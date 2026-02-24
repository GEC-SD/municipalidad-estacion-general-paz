// ============================================================================
// MENÚS DE NAVEGACIÓN - MUNICIPALIDAD GENERAL PAZ
// ============================================================================

import { PUBLIC_ROUTES, ADMIN_ROUTES } from './routes';

export type MenuItem = {
  label: string;
  href: string;
  children?: MenuItem[];
  icon?: string;
};

// Menú principal del portal público
export const MAIN_MENU: MenuItem[] = [
  {
    label: 'Inicio',
    href: PUBLIC_ROUTES.HOME,
  },
  {
    label: 'Gobierno',
    href: PUBLIC_ROUTES.MUNICIPALIDAD,
    children: [
      {
        label: 'Departamento Ejecutivo',
        href: PUBLIC_ROUTES.MUNICIPALIDAD_DEPARTAMENTO_EJECUTIVO,
      },
      {
        label: 'Honorable Concejo Deliberante',
        href: PUBLIC_ROUTES.MUNICIPALIDAD_CONCEJO,
      },
      {
        label: 'Honorable Tribunal de Cuentas',
        href: PUBLIC_ROUTES.MUNICIPALIDAD_TRIBUNAL,
      },
      {
        label: 'Nuestra historia',
        href: PUBLIC_ROUTES.MUNICIPALIDAD_HISTORIA,
      },
      {
        label: 'Transparencia',
        href: PUBLIC_ROUTES.TRANSPARENCIA,
      },
    ],
  },
  {
    label: 'Areas',
    href: PUBLIC_ROUTES.SERVICIOS,
    children: [
      {
        label: 'Salud',
        href: PUBLIC_ROUTES.SERVICIOS_SALUD,
      },
      {
        label: 'Cultura y Deporte',
        href: PUBLIC_ROUTES.SERVICIOS_CULTURA,
      },
      {
        label: 'Obra e infraestructura',
        href: PUBLIC_ROUTES.SERVICIOS_OBRAS,
      },
      {
        label: 'Educación',
        href: PUBLIC_ROUTES.SERVICIOS_EDUCACION,
      },
    ],
  },
  {
    label: 'Trámites',
    href: PUBLIC_ROUTES.SERVICIOS_TRAMITES,
  },
  {
    label: 'Agenda',
    href: PUBLIC_ROUTES.AGENDA,
  },
  {
    label: 'Contacto',
    href: PUBLIC_ROUTES.CONTACTO,
  },
];

// Menú del panel de administración
export const ADMIN_MENU: MenuItem[] = [
  {
    label: 'Dashboard',
    href: ADMIN_ROUTES.ADMIN_DASHBOARD,
    icon: 'Dashboard',
  },
  {
    label: 'Novedades',
    href: ADMIN_ROUTES.ADMIN_NOVEDADES,
    icon: 'Article',
  },
  {
    label: 'Areas',
    href: ADMIN_ROUTES.ADMIN_SERVICIOS,
    icon: 'MiscellaneousServices',
  },
  {
    label: 'Autoridades',
    href: ADMIN_ROUTES.ADMIN_AUTORIDADES,
    icon: 'People',
  },
  {
    label: 'Transparencia',
    href: ADMIN_ROUTES.ADMIN_TRANSPARENCIA,
    icon: 'Gavel',
  },
  {
    label: 'Eventos',
    href: ADMIN_ROUTES.ADMIN_EVENTOS,
    icon: 'Event',
  },
  {
    label: 'Trámites',
    href: ADMIN_ROUTES.ADMIN_TRAMITES,
    icon: 'Description',
  },
];

// Breadcrumbs labels
export const BREADCRUMB_LABELS: Record<string, string> = {
  '/': 'Inicio',
  '/gobierno': 'Gobierno',
  '/gobierno/intendente': 'Intendente',
  '/gobierno/gabinete': 'Gabinete Municipal',
  '/gobierno/departamento-ejecutivo': 'Departamento Ejecutivo',
  '/gobierno/concejo': 'Honorable Concejo Deliberante',
  '/gobierno/tribunal-de-cuentas': 'Honorable Tribunal de Cuentas',
  '/gobierno/historia': 'Historia',
  '/novedades': 'Novedades',
  '/areas': 'Areas',
  '/areas/salud': 'Salud',
  '/areas/cultura-y-deporte': 'Cultura y Deporte',
  '/areas/obra-e-infraestructura': 'Obra e infraestructura',
  '/tramites': 'Trámites',
  '/areas/educacion': 'Educación',
  '/transparencia': 'Transparencia',
  '/contacto': 'Contacto',
  '/admin': 'Dashboard',
  '/admin/novedades': 'Novedades',
  '/admin/novedades/nueva': 'Nueva Novedad',
  '/admin/areas': 'Areas',
  '/admin/areas/nuevo': 'Nueva Area',
  '/admin/autoridades': 'Autoridades',
  '/admin/autoridades/nueva': 'Nueva Autoridad',
  '/admin/transparencia': 'Transparencia',
  '/admin/transparencia/nueva': 'Nueva Normativa',
  '/admin/eventos': 'Eventos',
  '/admin/eventos/nuevo': 'Nuevo Evento',
  '/agenda': 'Agenda',
  '/admin/tramites': 'Trámites',
  '/admin/tramites/nuevo': 'Nuevo Trámite',
};
