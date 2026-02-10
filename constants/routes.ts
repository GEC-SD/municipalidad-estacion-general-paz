// ============================================================================
// RUTAS DEL SITIO WEB INSTITUCIONAL - MUNICIPALIDAD GENERAL PAZ
// ============================================================================

// Rutas públicas del portal
export const PUBLIC_ROUTES = {
  // Inicio
  HOME: '/',

  // Municipalidad
  MUNICIPALIDAD: '/municipalidad',
  MUNICIPALIDAD_INTENDENTE: '/municipalidad/intendente',
  MUNICIPALIDAD_GABINETE: '/municipalidad/gabinete',
  MUNICIPALIDAD_CONCEJO: '/municipalidad/concejo',
  MUNICIPALIDAD_HISTORIA: '/municipalidad/historia',

  // Novedades
  NOVEDADES: '/novedades',
  NOVEDADES_DETALLE: (slug: string) => `/novedades/${slug}`,

  // Servicios
  SERVICIOS: '/servicios',
  SERVICIOS_SALUD: '/servicios/salud',
  SERVICIOS_CULTURA: '/servicios/cultura',
  SERVICIOS_DEPORTE: '/servicios/deporte',
  SERVICIOS_TRAMITES: '/servicios/tramites',

  // Normativa
  NORMATIVA: '/normativa',

  // Agenda de eventos
  AGENDA: '/agenda',
  AGENDA_DETALLE: (slug: string) => `/agenda/${slug}`,

  // Contacto
  CONTACTO: '/contacto',

  // Login (redirige al admin)
  LOGIN: '/login',
} as const;

// Rutas de autenticación
export const AUTH_ROUTES = {
  LOGIN: '/login',
  LOGOUT: '/logout',
} as const;

// Rutas del panel de administración
export const ADMIN_ROUTES = {
  // Dashboard
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin',

  // Novedades
  ADMIN_NOVEDADES: '/admin/novedades',
  ADMIN_NOVEDADES_NUEVA: '/admin/novedades/nueva',
  ADMIN_NOVEDADES_EDITAR: (id: string) => `/admin/novedades/editar/${id}`,

  // Servicios
  ADMIN_SERVICIOS: '/admin/servicios',
  ADMIN_SERVICIOS_NUEVO: '/admin/servicios/nuevo',
  ADMIN_SERVICIOS_EDITAR: (id: string) => `/admin/servicios/editar/${id}`,

  // Autoridades
  ADMIN_AUTORIDADES: '/admin/autoridades',
  ADMIN_AUTORIDADES_NUEVA: '/admin/autoridades/nueva',
  ADMIN_AUTORIDADES_EDITAR: (id: string) => `/admin/autoridades/editar/${id}`,

  // Normativa
  ADMIN_NORMATIVA: '/admin/normativa',
  ADMIN_NORMATIVA_NUEVA: '/admin/normativa/nueva',
  ADMIN_NORMATIVA_EDITAR: (id: string) => `/admin/normativa/editar/${id}`,

  // Eventos
  ADMIN_EVENTOS: '/admin/eventos',
  ADMIN_EVENTOS_NUEVO: '/admin/eventos/nuevo',
  ADMIN_EVENTOS_EDITAR: (id: string) => `/admin/eventos/editar/${id}`,

  // Contacto
  ADMIN_CONTACTO: '/admin/contacto',
  ADMIN_CONTACTO_NUEVO: '/admin/contacto/nuevo',
  ADMIN_CONTACTO_EDITAR: (id: string) => `/admin/contacto/editar/${id}`,

  // Configuración
  ADMIN_CONFIGURACION: '/admin/configuracion',
} as const;

// Rutas API (para llamadas desde el cliente si es necesario)
export const API_ROUTES = {
  // News
  NEWS: '/api/news',
  NEWS_DETAIL: (id: string) => `/api/news/${id}`,
  NEWS_FEATURED: '/api/news/featured',

  // Authorities
  AUTHORITIES: '/api/authorities',
  AUTHORITIES_DETAIL: (id: string) => `/api/authorities/${id}`,

  // Services
  SERVICES: '/api/services',
  SERVICES_DETAIL: (id: string) => `/api/services/${id}`,

  // Regulations
  REGULATIONS: '/api/regulations',
  REGULATIONS_DETAIL: (id: string) => `/api/regulations/${id}`,

  // Contact
  CONTACT: '/api/contact',

  // Settings
  SETTINGS: '/api/settings',

  // Upload
  UPLOAD: '/api/upload',
} as const;
