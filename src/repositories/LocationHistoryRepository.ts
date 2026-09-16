import type { SQLiteDatabase } from 'expo-sqlite';

import type { CreateLocationHistoryRecord, LocationEntityType, LocationHistory } from '@/types/records';
import { repositoryOperation } from './errors';
import { mapLocationHistoryRow, type LocationHistoryRow } from './rows';

export class LocationHistoryRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async create(record: CreateLocationHistoryRecord): Promise<LocationHistory> {
    await repositoryOperation('location_history.create', () => this.db.runAsync(
      `INSERT INTO location_history (id, entity_type, entity_id, warehouse_id, map_x, map_y, reference, photo_path, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, record.id, record.entityType,
      record.entityId, record.warehouseId, record.mapX, record.mapY,
      record.reference, record.photoPath, record.createdAt,
    ));
    return record;
  }

  async listByEntity(entityType: LocationEntityType, entityId: string): Promise<LocationHistory[]> {
    return repositoryOperation('location_history.listByEntity', async () =>
      (await this.db.getAllAsync<LocationHistoryRow>(
        `SELECT * FROM location_history WHERE entity_type = ? AND entity_id = ?
         ORDER BY created_at DESC, id DESC`, entityType, entityId,
      )).map(mapLocationHistoryRow));
  }
}
