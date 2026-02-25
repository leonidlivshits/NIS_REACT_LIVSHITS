import { useState, useCallback } from 'react';
import { useGetProductsQuery } from '../../app/api/apiSlice';

export function useProducts(initialLimit = 10) {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);
  const limit = initialLimit;

  const { data, error, isLoading, isFetching, refetch } = useGetProductsQuery({ limit, skip: page * limit, q });

  const search = useCallback((newQ: string) => {
    setQ(newQ);
    setPage(0);
  }, []);

  const next = useCallback(() => setPage((p) => p + 1), []);
  const prev = useCallback(() => setPage((p) => Math.max(0, p - 1)), []);

  return {
    data,
    error,
    isLoading,
    isFetching,
    q,
    page,
    limit,
    search,
    next,
    prev,
    refetch,
  };
}
