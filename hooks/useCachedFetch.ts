'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector, RootState } from '@/state/redux/store';

type UseCachedFetchOptions = {
  /** Selector para obtener el mapa lastFetched del slice */
  selector: (state: RootState) => Record<string, number>;
  /** Clave del dato dentro de lastFetched */
  dataKey: string;
  /** Acción thunk a despachar */
  fetchAction: () => any;
  /** TTL en milisegundos */
  ttl: number;
  /** Si ya existen datos cacheados (controla skeleton vs SWR) */
  hasData: boolean;
};

/**
 * Hook que implementa Stale-While-Revalidate para Redux.
 * - Si hay datos y el TTL no expiró → no hace fetch (ahorra llamada)
 * - Si hay datos pero TTL expiró → muestra datos cacheados + fetch en background
 * - Si no hay datos → fetch normal (se muestra skeleton)
 */
export const useCachedFetch = ({
  selector,
  dataKey,
  fetchAction,
  ttl,
  hasData,
}: UseCachedFetchOptions) => {
  const dispatch = useAppDispatch();
  const lastFetchedMap = useAppSelector(selector);
  const lastFetched = lastFetchedMap?.[dataKey] ?? 0;
  const dispatched = useRef(false);

  useEffect(() => {
    const now = Date.now();
    const isStale = now - lastFetched > ttl;
    const needsFetch = lastFetched === 0 || isStale;

    if (needsFetch && !dispatched.current) {
      dispatched.current = true;
      dispatch(fetchAction());
    }

    return () => {
      dispatched.current = false;
    };
  }, [dispatch, dataKey, lastFetched, ttl]); // fetchAction estable, excluido intencionalmente

  return {
    /** True cuando no hay datos cacheados (primera carga, mostrar skeleton) */
    isFirstLoad: !hasData && lastFetched === 0,
    /** True cuando hay datos pero están siendo actualizados en background */
    isBackgroundRefresh: hasData && Date.now() - lastFetched > ttl,
  };
};
