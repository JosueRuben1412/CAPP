import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import type { Product } from '@/types/records';
import { useProductRepository } from './useProductRepository';

type SearchState =
  | { kind: 'loading' }
  | { kind: 'success'; products: Product[]; searching: boolean }
  | { kind: 'error' };

const SEARCH_DELAY_MS = 250;

export function useProductSearch() {
  const repository = useProductRepository();
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim();
  const [state, setState] = useState<SearchState>({ kind: 'loading' });
  const requestId = useRef(0);

  const runQuery = useCallback((term: string) => {
    const request = ++requestId.current;
    setState(current => current.kind === 'success'
      ? { ...current, searching: true }
      : { kind: 'loading' });
    const operation = term ? repository.search(term) : repository.list();
    operation.then(products => {
      if (request === requestId.current) setState({ kind: 'success', products, searching: false });
    }).catch(error => {
      if (request === requestId.current) {
        console.error('No se pudieron consultar los productos.', error);
        setState({ kind: 'error' });
      }
    });
  }, [repository]);

  useFocusEffect(useCallback(() => {
    setState(current => current.kind === 'success'
      ? { ...current, searching: true }
      : { kind: 'loading' });
    const timer = normalizedQuery
      ? setTimeout(() => runQuery(normalizedQuery), SEARCH_DELAY_MS)
      : undefined;
    if (!normalizedQuery) runQuery('');
    return () => {
      if (timer) clearTimeout(timer);
      requestId.current += 1;
    };
  }, [normalizedQuery, runQuery]));

  function changeQuery(value: string) {
    if (value.trim() !== normalizedQuery) {
      // Invalidate an in-flight response before the next focus effect runs.
      requestId.current += 1;
      setState(current => current.kind === 'success'
        ? { ...current, searching: true }
        : { kind: 'loading' });
    }
    setQuery(value);
  }

  return {
    query,
    normalizedQuery,
    state,
    changeQuery,
    clearQuery: () => changeQuery(''),
    retry: () => runQuery(normalizedQuery),
  };
}
