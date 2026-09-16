import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import type { Product } from '@/types/records';
import { useProductRepository } from './useProductRepository';

export type ProductRecordState =
  | { kind: 'loading' }
  | { kind: 'success'; product: Product }
  | { kind: 'not_found' }
  | { kind: 'error' };

export function useProductRecord(id: string | null) {
  const repository = useProductRepository();
  const [state, setState] = useState<ProductRecordState>({ kind: 'loading' });
  const requestId = useRef(0);

  const loadProduct = useCallback(() => {
    const request = ++requestId.current;
    if (!id) {
      setState({ kind: 'not_found' });
      return;
    }
    setState({ kind: 'loading' });
    repository.getById(id).then(product => {
      if (request === requestId.current) setState(product ? { kind: 'success', product } : { kind: 'not_found' });
    }).catch(error => {
      console.error('No se pudo cargar el producto.', error);
      if (request === requestId.current) setState({ kind: 'error' });
    });
  }, [id, repository]);

  useFocusEffect(useCallback(() => {
    loadProduct();
    return () => { requestId.current += 1; };
  }, [loadProduct]));

  return { state, retry: loadProduct, repository };
}
