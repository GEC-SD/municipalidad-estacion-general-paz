/**
 * Formatea una fecha
 * @param date - Fecha a formatear
 * @param locale - Locale (por defecto 'es-AR')
 * @param options - Opciones de formato
 * @returns String con fecha formateada
 */
export const formatDate = (
  date: Date | string,
  locale: string = 'es-AR',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

/**
 * Formatea una fecha con hora
 * @param date - Fecha a formatear
 * @param locale - Locale (por defecto 'es-AR')
 * @returns String con fecha y hora formateada
 */
export const formatDateTime = (date: Date | string, locale: string = 'es-AR'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

/**
 * Obtiene la diferencia en días entre dos fechas
 * @param date1 - Primera fecha
 * @param date2 - Segunda fecha
 * @returns Diferencia en días
 */
export const getDaysDifference = (date1: Date | string, date2: Date | string): number => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Verifica si una fecha es del pasado
 * @param date - Fecha a verificar
 * @returns True si la fecha es del pasado
 */
export const isPastDate = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj < new Date();
};

/**
 * Verifica si una fecha es del futuro
 * @param date - Fecha a verificar
 * @returns True si la fecha es del futuro
 */
export const isFutureDate = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj > new Date();
};
