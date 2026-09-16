import type { SQLiteDatabase } from 'expo-sqlite';

import type { CreateWarehouseRecord, UpdateWarehouseRecord, Warehouse } from '@/types/records';
import { repositoryOperation } from './errors';
import { deleteRow, updateRow } from './helpers';
import { mapWarehouseRow, type WarehouseRow } from './rows';

export class WarehouseRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async create(record: CreateWarehouseRecord): Promise<Warehouse> {
    await repositoryOperation('warehouses.create', () => this.db.runAsync(
      `INSERT INTO warehouses (id, name, description, map_image_path, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`, record.id, record.name, record.description,
      record.mapImagePath, record.createdAt, record.updatedAt,
    ));
    return record;
  }

  async getById(id: string): Promise<Warehouse | null> {
    return repositoryOperation('warehouses.getById', async () => {
      const row = await this.db.getFirstAsync<WarehouseRow>('SELECT * FROM warehouses WHERE id = ?', id);
      return row ? mapWarehouseRow(row) : null;
    });
  }

  async list(): Promise<Warehouse[]> {
    return repositoryOperation('warehouses.list', async () =>
      (await this.db.getAllAsync<WarehouseRow>('SELECT * FROM warehouses ORDER BY name ASC, id ASC')).map(mapWarehouseRow));
  }

  async update(id: string, changes: UpdateWarehouseRecord): Promise<Warehouse | null> {
    const changed = await updateRow(this.db, 'warehouses', 'id', id, [
      ['name', changes.name], ['description', changes.description],
      ['map_image_path', changes.mapImagePath],
    ], changes.updatedAt);
    return changed ? this.getById(id) : null;
  }

  delete(id: string): Promise<boolean> { return deleteRow(this.db, 'warehouses', 'id', id); }
}
