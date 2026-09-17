import { useMemo } from 'react';
import { useSQLiteContext } from 'expo-sqlite';

import { WarehouseRepository } from '@/repositories/WarehouseRepository';

export function useWarehouseRepository(): WarehouseRepository {
  const database = useSQLiteContext();
  return useMemo(() => new WarehouseRepository(database), [database]);
}
