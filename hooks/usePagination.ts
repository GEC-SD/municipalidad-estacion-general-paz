import { useState, useMemo, useCallback } from 'react';

type UsePaginationOptions = {
  initialPage?: number;
  initialLimit?: number;
  scrollToTop?: boolean;
};

/**
 * Hook para manejo de paginación
 * Retorna page, limit, offset y funciones para cambiar
 */
export const usePagination = (options: UsePaginationOptions = {}) => {
  const { initialPage = 1, initialLimit = 10, scrollToTop = true } = options;

  const [page, setPageState] = useState(initialPage);
  const [limit, setLimitState] = useState(initialLimit);

  // Calcular offset para queries
  const offset = useMemo(() => (page - 1) * limit, [page, limit]);

  /**
   * Cambiar página con scroll opcional
   */
  const setPage = useCallback(
    (newPage: number) => {
      setPageState(newPage);
      if (scrollToTop && typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [scrollToTop]
  );

  /**
   * Cambiar límite y resetear a página 1
   */
  const setLimit = useCallback(
    (newLimit: number) => {
      setLimitState(newLimit);
      setPageState(1); // Reset a primera página
      if (scrollToTop && typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [scrollToTop]
  );

  /**
   * Ir a la página siguiente
   */
  const nextPage = useCallback(() => {
    setPage(page + 1);
  }, [page, setPage]);

  /**
   * Ir a la página anterior
   */
  const previousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page, setPage]);

  /**
   * Ir a la primera página
   */
  const firstPage = useCallback(() => {
    setPage(1);
  }, [setPage]);

  /**
   * Ir a la última página (requiere total)
   */
  const lastPage = useCallback(
    (total: number) => {
      const totalPages = Math.ceil(total / limit);
      setPage(totalPages);
    },
    [limit, setPage]
  );

  /**
   * Resetear a valores iniciales
   */
  const reset = useCallback(() => {
    setPageState(initialPage);
    setLimitState(initialLimit);
  }, [initialPage, initialLimit]);

  /**
   * Calcular total de páginas
   */
  const getTotalPages = useCallback(
    (total: number) => {
      return Math.ceil(total / limit);
    },
    [limit]
  );

  return {
    page,
    limit,
    offset,
    setPage,
    setLimit,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    reset,
    getTotalPages,
  };
};
