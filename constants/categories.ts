// ============================================================================
// CATEGORÍAS Y OPCIONES - MUNICIPALIDAD GENERAL PAZ
// ============================================================================

import {
  NewsCategory,
  ServiceCategory,
  ContactCategory,
  RegulationCategory,
  RegulationType,
  EventCategory,
} from '@/types';

// Categorías de noticias
export const NEWS_CATEGORIES: Array<{ value: NewsCategory; label: string }> = [
  { value: 'institucional', label: 'Institucional' },
  // { value: 'obras', label: 'Obras Públicas' },
  { value: 'cultura', label: 'Cultura' },
  { value: 'deporte', label: 'Deporte' },
  { value: 'salud', label: 'Salud' },
  { value: 'educacion', label: 'Educación' },
  { value: 'social', label: 'Desarrollo Social' },
  { value: 'medio-ambiente', label: 'Medio Ambiente' },
  { value: 'seguridad', label: 'Seguridad' },
  { value: 'recoleccion-residuos', label: 'Recolección de Residuos' },
  { value: 'servicio-agua', label: 'Servicio de Agua' },
  { value: 'inmobiliario', label: 'Inmobiliario' },
  { value: 'registro-civil', label: 'Registro Civil' },
  { value: 'otros', label: 'Otros' },
] as const;

// Categorías de servicios con íconos
export const SERVICE_CATEGORIES: Array<{
  value: ServiceCategory;
  label: string;
  icon: string;
  description: string;
}> = [
  {
    value: 'salud',
    label: 'Salud',
    icon: 'LocalHospital',
    description: 'Servicios de salud municipal',
  },
  {
    value: 'cultura',
    label: 'Cultura',
    icon: 'TheaterComedy',
    description: 'Eventos y actividades culturales',
  },
  {
    value: 'deporte',
    label: 'Deporte',
    icon: 'SportsFootball',
    description: 'Deportes y recreación',
  },
  {
    value: 'tramites',
    label: 'Trámites',
    icon: 'Description',
    description: 'Trámites y gestiones municipales',
  },
  {
    value: 'educacion',
    label: 'Educación',
    icon: 'School',
    description: 'Programas educativos municipales',
  },
] as const;

// Categorías de contactos
export const CONTACT_CATEGORIES: Array<{ value: ContactCategory; label: string }> = [
  { value: 'emergencia', label: 'Emergencias' },
  { value: 'administrativo', label: 'Administrativo' },
  { value: 'servicios', label: 'Servicios' },
] as const;

// Tipos de normativa (Ordenanzas / Decretos)
export const REGULATION_TYPES: Array<{
  value: RegulationType;
  label: string;
}> = [
  { value: 'ordenanza', label: 'Ordenanza' },
  { value: 'decreto', label: 'Decreto' },
] as const;

// Categorías de normativa
export const REGULATION_CATEGORIES: Array<{
  value: RegulationCategory;
  label: string;
}> = [
  { value: 'tributaria', label: 'Tributaria' },
  // { value: 'obras', label: 'Obras y Servicios Públicos' },
  { value: 'administrativa', label: 'Administrativa' },
  { value: 'urbanismo', label: 'Urbanismo y Zonificación' },
  { value: 'ambiental', label: 'Ambiental' },
  { value: 'transito', label: 'Tránsito y Transporte' },
  { value: 'habilitaciones', label: 'Habilitaciones' },
  { value: 'otras', label: 'Otras' },
] as const;

// Estados de noticias
export const NEWS_STATUS = [
  { value: 'draft', label: 'Borrador', color: 'warning' },
  { value: 'published', label: 'Publicada', color: 'success' },
  { value: 'archived', label: 'Archivada', color: 'default' },
] as const;

// Categorías de eventos
export const EVENT_CATEGORIES: Array<{ value: EventCategory; label: string }> = [
  { value: 'cultural', label: 'Cultural' },
  { value: 'deportivo', label: 'Deportivo' },
  { value: 'institucional', label: 'Institucional' },
  { value: 'educativo', label: 'Educativo' },
  { value: 'social', label: 'Social' },
] as const;

// Categorías de autoridades
export const AUTHORITY_CATEGORIES = [
  { value: 'intendente', label: 'Intendente' },
  { value: 'gabinete', label: 'Gabinete Municipal' },
  { value: 'concejo', label: 'Concejo Deliberante' },
  { value: 'tribunal', label: 'Tribunal de Cuentas' },
] as const;
