/**
 * Formatea un número como moneda
 * @param value - Valor numérico
 * @param currency - Código de moneda (por defecto 'ARS')
 * @param locale - Locale (por defecto 'es-AR')
 * @returns String formateado como moneda
 */
export const formatCurrency = (
  value: number,
  currency: string = 'ARS',
  locale: string = 'es-AR'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
};

/**
 * Formatea un número con separadores de miles
 * @param value - Valor numérico
 * @param locale - Locale (por defecto 'es-AR')
 * @returns String formateado con separadores
 */
export const formatNumber = (value: number, locale: string = 'es-AR'): string => {
  return new Intl.NumberFormat(locale).format(value);
};

/**
 * Redondea un número a N decimales
 * @param value - Valor numérico
 * @param decimals - Cantidad de decimales (por defecto 2)
 * @returns Número redondeado
 */
export const roundToDecimals = (value: number, decimals: number = 2): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Calcula el porcentaje de un valor sobre un total
 * @param value - Valor
 * @param total - Total
 * @returns Porcentaje
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};
