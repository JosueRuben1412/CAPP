import { useMemo } from 'react';
import { useSQLiteContext } from 'expo-sqlite';

import { ProductRepository } from '@/repositories/ProductRepository';

export function useProductRepository(): ProductRepository {
  const database = useSQLiteContext();
  return useMemo(() => new ProductRepository(database), [database]);
}
