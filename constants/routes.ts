// ============================================================================
// RUTAS DEL SITIO WEB INSTITUCIONAL - MUNICIPALIDAD GENERAL PAZ
// ============================================================================

// Rutas públicas del portal
export const PUBLIC_ROUTES = {
  // Inicio
  HOME: '/',

  // Gobierno
  MUNICIPALIDAD: '/gobierno',
  MUNICIPALIDAD_INTENDENTE: '/gobierno/intendente',
  MUNICIPALIDAD_GABINETE: '/gobierno/gabinete',
  MUNICIPALIDAD_DEPARTAMENTO_EJECUTIVO: '/gobierno/departamento-ejecutivo',
  MUNICIPALIDAD_CONCEJO: '/gobierno/concejo',
  MUNICIPALIDAD_TRIBUNAL: '/gobierno/tribunal-de-cuentas',
  MUNICIPALIDAD_HISTORIA: '/gobierno/historia',

  // Novedades
  NOVEDADES: '/novedades',
  NOVEDADES_DETALLE: (slug: string) => `/novedades/${slug}`,

  // Areas (Servicios)
  SERVICIOS: '/areas',
  SERVICIOS_SALUD: '/areas/salud',
  SERVICIOS_CULTURA: '/areas/cultura-y-deporte',
  SERVICIOS_OBRAS: '/areas/obra-e-infraestructura',
  SERVICIOS_TRAMITES: '/tramites',
  SERVICIOS_EDUCACION: '/areas/educacion',
  SERVICIOS_REGISTRO: '/areas/registro-civil',

  // Transparencia
  TRANSPARENCIA: '/transparencia',

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

  // Areas
  ADMIN_SERVICIOS: '/admin/areas',
  ADMIN_SERVICIOS_NUEVO: '/admin/areas/nuevo',
  ADMIN_SERVICIOS_EDITAR: (id: string) => `/admin/areas/editar/${id}`,
  ADMIN_RESENAS: '/admin/areas/resenas',

  // Autoridades
  ADMIN_AUTORIDADES: '/admin/autoridades',
  ADMIN_AUTORIDADES_NUEVA: '/admin/autoridades/nueva',
  ADMIN_AUTORIDADES_EDITAR: (id: string) => `/admin/autoridades/editar/${id}`,

  // Transparencia
  ADMIN_TRANSPARENCIA: '/admin/transparencia',
  ADMIN_TRANSPARENCIA_NUEVA: '/admin/transparencia/nueva',
  ADMIN_TRANSPARENCIA_EDITAR: (id: string) => `/admin/transparencia/editar/${id}`,

  // Eventos
  ADMIN_EVENTOS: '/admin/eventos',
  ADMIN_EVENTOS_NUEVO: '/admin/eventos/nuevo',
  ADMIN_EVENTOS_EDITAR: (id: string) => `/admin/eventos/editar/${id}`,

  // Contacto
  ADMIN_CONTACTO: '/admin/contacto',
  ADMIN_CONTACTO_NUEVO: '/admin/contacto/nuevo',
  ADMIN_CONTACTO_EDITAR: (id: string) => `/admin/contacto/editar/${id}`,

  // Trámites
  ADMIN_TRAMITES: '/admin/tramites',
  ADMIN_TRAMITES_NUEVO: '/admin/tramites/nuevo',
  ADMIN_TRAMITES_EDITAR: (id: string) => `/admin/tramites/editar/${id}`,
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

  // Upload
  UPLOAD: '/api/upload',
} as const;
