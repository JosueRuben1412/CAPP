import type { SQLiteDatabase } from 'expo-sqlite';

import type { CreatePalletRecord, Pallet, UpdatePalletRecord } from '@/types/records';
import { repositoryOperation } from './errors';
import { deleteRow, updateRow } from './helpers';
import { mapPalletRow, type PalletRow } from './rows';

export class PalletRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async create(record: CreatePalletRecord): Promise<Pallet> {
    await repositoryOperation('pallets.create', () => this.db.runAsync(
      `INSERT INTO pallets (id, warehouse_id, name, map_x, map_y, reference, photo_path, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, record.id, record.warehouseId,
      record.name, record.mapX, record.mapY, record.reference, record.photoPath,
      record.notes, record.createdAt, record.updatedAt,
    ));
    return record;
  }

  async getById(id: string): Promise<Pallet | null> {
    return repositoryOperation('pallets.getById', async () => {
      const row = await this.db.getFirstAsync<PalletRow>('SELECT * FROM pallets WHERE id = ?', id);
      return row ? mapPalletRow(row) : null;
    });
  }

  async listByWarehouse(warehouseId: string): Promise<Pallet[]> {
    return repositoryOperation('pallets.listByWarehouse', async () =>
      (await this.db.getAllAsync<PalletRow>(
        'SELECT * FROM pallets WHERE warehouse_id = ? ORDER BY created_at ASC, id ASC', warehouseId,
      )).map(mapPalletRow));
  }

  async update(id: string, changes: UpdatePalletRecord): Promise<Pallet | null> {
    const changed = await updateRow(this.db, 'pallets', 'id', id, [
      ['warehouse_id', changes.warehouseId], ['name', changes.name],
      ['map_x', changes.mapX], ['map_y', changes.mapY], ['reference', changes.reference],
      ['photo_path', changes.photoPath], ['notes', changes.notes],
    ], changes.updatedAt);
    return changed ? this.getById(id) : null;
  }

  delete(id: string): Promise<boolean> { return deleteRow(this.db, 'pallets', 'id', id); }
}
