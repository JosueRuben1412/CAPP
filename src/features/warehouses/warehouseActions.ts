import * as Crypto from 'expo-crypto';

import type { WarehouseRepository } from '@/repositories/WarehouseRepository';
import type { Warehouse } from '@/types/records';
import type { WarehouseFields } from './warehouseFields';

export async function createWarehouse(repository: WarehouseRepository, fields: WarehouseFields): Promise<Warehouse> {
  const now = new Date().toISOString();
  return repository.create({
    id: Crypto.randomUUID(),
    ...fields,
    mapImagePath: null,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateWarehouse(
  repository: WarehouseRepository, id: string, fields: WarehouseFields,
): Promise<Warehouse | null> {
  return repository.update(id, { ...fields, updatedAt: new Date().toISOString() });
}
