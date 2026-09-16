import type { SQLiteDatabase } from 'expo-sqlite';

import type { CreatePalletProductRecord, PalletProduct } from '@/types/records';
import { repositoryOperation } from './errors';
import { mapPalletProductRow, type PalletProductRow } from './rows';

export class PalletProductRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async add(record: CreatePalletProductRecord): Promise<PalletProduct> {
    await repositoryOperation('pallet_products.add', () => this.db.runAsync(
      'INSERT INTO pallet_products (id, pallet_id, product_id, created_at) VALUES (?, ?, ?, ?)',
      record.id, record.palletId, record.productId, record.createdAt,
    ));
    return record;
  }

  async remove(palletId: string, productId: string): Promise<boolean> {
    return repositoryOperation('pallet_products.remove', async () =>
      (await this.db.runAsync(
        'DELETE FROM pallet_products WHERE pallet_id = ? AND product_id = ?', palletId, productId,
      )).changes > 0);
  }

  async listByPallet(palletId: string): Promise<PalletProduct[]> {
    return repositoryOperation('pallet_products.listByPallet', async () =>
      (await this.db.getAllAsync<PalletProductRow>(
        'SELECT * FROM pallet_products WHERE pallet_id = ? ORDER BY created_at ASC, id ASC', palletId,
      )).map(mapPalletProductRow));
  }

  async listByProduct(productId: string): Promise<PalletProduct[]> {
    return repositoryOperation('pallet_products.listByProduct', async () =>
      (await this.db.getAllAsync<PalletProductRow>(
        'SELECT * FROM pallet_products WHERE product_id = ? ORDER BY created_at ASC, id ASC', productId,
      )).map(mapPalletProductRow));
  }

  async exists(palletId: string, productId: string): Promise<boolean> {
    return repositoryOperation('pallet_products.exists', async () =>
      (await this.db.getFirstAsync<{ id: string }>(
        'SELECT id FROM pallet_products WHERE pallet_id = ? AND product_id = ?', palletId, productId,
      )) !== null);
  }
}
