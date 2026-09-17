import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import type { Warehouse } from '@/types/records';
import { useWarehouseRepository } from './useWarehouseRepository';

export type WarehouseRecordState =
  | { kind: 'loading' }
  | { kind: 'success'; warehouse: Warehouse }
  | { kind: 'not_found' }
  | { kind: 'error' };

export function useWarehouseRecord(id: string | null) {
  const repository = useWarehouseRepository();
  const [state, setState] = useState<WarehouseRecordState>({ kind: 'loading' });
  const requestId = useRef(0);

  const loadWarehouse = useCallback(() => {
    const request = ++requestId.current;
    if (!id) {
      setState({ kind: 'not_found' });
      return;
    }
    setState({ kind: 'loading' });
    repository.getById(id).then(warehouse => {
      if (request === requestId.current) setState(warehouse ? { kind: 'success', warehouse } : { kind: 'not_found' });
    }).catch(error => {
      console.error('No se pudo cargar la bodega.', error);
      if (request === requestId.current) setState({ kind: 'error' });
    });
  }, [id, repository]);

  useFocusEffect(useCallback(() => {
    loadWarehouse();
    return () => { requestId.current += 1; };
  }, [loadWarehouse]));

  return { state, retry: loadWarehouse, repository };
}
