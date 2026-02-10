export const CACHE_TTL = {
  // Datos estables (persistidos en localStorage)
  SERVICES: 30 * 60 * 1000, // 30 minutos
  AUTHORITIES: 60 * 60 * 1000, // 1 hora
  SETTINGS: 60 * 60 * 1000, // 1 hora
  CONTACTS: 60 * 60 * 1000, // 1 hora

  // Datos volátiles (solo en memoria)
  FEATURED_NEWS: 5 * 60 * 1000, // 5 minutos
  NEWS_LIST: 3 * 60 * 1000, // 3 minutos
  EVENTS: 3 * 60 * 1000, // 3 minutos
  REGULATIONS: 5 * 60 * 1000, // 5 minutos
} as const;
