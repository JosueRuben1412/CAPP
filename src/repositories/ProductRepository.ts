import type { SQLiteDatabase } from 'expo-sqlite';

import type { CreateProductRecord, Product, UpdateProductRecord } from '@/types/records';
import { repositoryOperation } from './errors';
import { deleteRow, updateRow } from './helpers';
import { mapProductRow, type ProductRow } from './rows';

export class ProductRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async create(record: CreateProductRecord): Promise<Product> {
    await repositoryOperation('products.create', () => this.db.runAsync(
      `INSERT INTO products (id, barcode, name, brand, category, image_path, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      record.id, record.barcode, record.name, record.brand, record.category,
      record.imagePath, record.notes, record.createdAt, record.updatedAt,
    ));
    return record;
  }

  async getById(id: string): Promise<Product | null> {
    return repositoryOperation('products.getById', async () => {
      const row = await this.db.getFirstAsync<ProductRow>('SELECT * FROM products WHERE id = ?', id);
      return row ? mapProductRow(row) : null;
    });
  }

  async getByBarcode(barcode: string | null): Promise<Product | null> {
    if (!barcode?.trim()) return null;
    return repositoryOperation('products.getByBarcode', async () => {
      const row = await this.db.getFirstAsync<ProductRow>('SELECT * FROM products WHERE barcode = ?', barcode);
      return row ? mapProductRow(row) : null;
    });
  }

  async list(): Promise<Product[]> {
    return repositoryOperation('products.list', async () =>
      (await this.db.getAllAsync<ProductRow>('SELECT * FROM products ORDER BY name ASC, id ASC')).map(mapProductRow));
  }

  async search(query: string): Promise<Product[]> {
    if (!query.trim()) return this.list();
    // LIKE treats % and _ in the input as wildcards in this first version.
    const pattern = `%${query.trim()}%`;
    return repositoryOperation('products.search', async () =>
      (await this.db.getAllAsync<ProductRow>(
        `SELECT * FROM products WHERE name LIKE ? OR brand LIKE ? OR barcode LIKE ?
         ORDER BY name ASC, id ASC`, pattern, pattern, pattern,
      )).map(mapProductRow));
  }

  async update(id: string, changes: UpdateProductRecord): Promise<Product | null> {
    const changed = await updateRow(this.db, 'products', 'id', id, [
      ['barcode', changes.barcode], ['name', changes.name], ['brand', changes.brand],
      ['category', changes.category], ['image_path', changes.imagePath], ['notes', changes.notes],
    ], changes.updatedAt);
    return changed ? this.getById(id) : null;
  }

  delete(id: string): Promise<boolean> { return deleteRow(this.db, 'products', 'id', id); }
}
