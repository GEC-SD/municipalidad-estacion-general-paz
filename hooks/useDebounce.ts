import { useState, useEffect } from 'react';

/**
 * Hook para debouncing de valores
 * Útil para búsquedas en tiempo real y optimización de llamadas API
 *
 * @param value - Valor a debounce
 * @param delay - Delay en milisegundos (default: 500ms)
 * @returns Valor debounced
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     // Hacer búsqueda
 *   }
 * }, [debouncedSearchTerm]);
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Crear timer que actualiza el valor después del delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el timeout si value cambia antes de que termine el delay
    // Esto previene actualizaciones innecesarias
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook para debouncing con estado de loading
 * Similar a useDebounce pero también retorna un estado de loading
 *
 * @param value - Valor a debounce
 * @param delay - Delay en milisegundos (default: 500ms)
 * @returns Objeto con valor debounced y estado loading
 *
 * @example
 * const { value: debouncedSearch, loading } = useDebouncedValue(search);
 */
export const useDebouncedValue = <T>(
  value: T,
  delay: number = 500
): { value: T; loading: boolean } => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setLoading(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return { value: debouncedValue, loading };
};
