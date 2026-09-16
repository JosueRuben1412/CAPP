import type { SQLiteDatabase } from 'expo-sqlite';

import type { CreateProductLocationRecord, ProductLocation, UpdateProductLocationRecord } from '@/types/records';
import { repositoryOperation } from './errors';
import { deleteRow, updateRow } from './helpers';
import { mapProductLocationRow, type ProductLocationRow } from './rows';

export class ProductLocationRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async create(record: CreateProductLocationRecord): Promise<ProductLocation> {
    await repositoryOperation('product_locations.create', () => this.db.runAsync(
      `INSERT INTO product_locations (id, product_id, warehouse_id, map_x, map_y, reference, photo_path, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, record.id, record.productId,
      record.warehouseId, record.mapX, record.mapY, record.reference, record.photoPath,
      record.createdAt, record.updatedAt,
    ));
    return record;
  }

  async getByProductId(productId: string): Promise<ProductLocation | null> {
    return repositoryOperation('product_locations.getByProductId', async () => {
      const row = await this.db.getFirstAsync<ProductLocationRow>(
        'SELECT * FROM product_locations WHERE product_id = ?', productId,
      );
      return row ? mapProductLocationRow(row) : null;
    });
  }

  async update(productId: string, changes: UpdateProductLocationRecord): Promise<ProductLocation | null> {
    const changed = await updateRow(this.db, 'product_locations', 'product_id', productId, [
      ['warehouse_id', changes.warehouseId], ['map_x', changes.mapX],
      ['map_y', changes.mapY], ['reference', changes.reference],
      ['photo_path', changes.photoPath],
    ], changes.updatedAt);
    return changed ? this.getByProductId(productId) : null;
  }

  deleteByProductId(productId: string): Promise<boolean> {
    return deleteRow(this.db, 'product_locations', 'product_id', productId);
  }
}
