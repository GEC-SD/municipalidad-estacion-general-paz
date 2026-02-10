/**
 * Capitaliza la primera letra de un string
 * @param str - String a capitalizar
 * @returns String con primera letra en mayúscula
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitaliza la primera letra de cada palabra
 * @param str - String a capitalizar
 * @returns String con cada palabra capitalizada
 */
export const capitalizeWords = (str: string): string => {
  if (!str) return '';
  return str
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
};

/**
 * Trunca un string a un largo máximo
 * @param str - String a truncar
 * @param maxLength - Largo máximo
 * @param suffix - Sufijo a agregar (por defecto '...')
 * @returns String truncado
 */
export const truncate = (str: string, maxLength: number, suffix: string = '...'): string => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Elimina espacios en blanco al inicio y final
 * @param str - String a limpiar
 * @returns String sin espacios
 */
export const cleanString = (str: string): string => {
  return str.trim();
};

/**
 * Convierte un string a slug (URL-friendly)
 * @param str - String a convertir
 * @returns Slug
 */
export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
