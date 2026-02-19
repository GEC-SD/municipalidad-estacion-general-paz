import { PublicWork } from '@/types';

/**
 * Obras de ejemplo para mostrar en el sitio cuando no hay datos en la base.
 * Estas obras pueden ser creadas via el panel de administrador.
 */
export const SAMPLE_OBRAS: PublicWork[] = [
  {
    id: 'sample-1',
    title: 'Plan de Pavimentación y Cordón Cuneta',
    slug: 'plan-pavimentacion-cordon-cuneta',
    description:
      'Trabajamos en la pavimentación, construcción de cordón cuneta y repavimentación de las principales vías de nuestro municipio, mejorando la movilidad urbana y la seguridad vial para todos los vecinos.',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
    latitude: -32.005,
    longitude: -62.115,
    address: 'Av. San Martín y calles aledañas',
    is_active: true,
    order_position: 1,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 'sample-2',
    title: 'Eficiencia Energética - Iluminación LED',
    slug: 'eficiencia-energetica-led',
    description:
      'Continuamos con la colocación y el reemplazo de luminarias de sodio por equipos LED en plazas, espacios verdes, principales calles y barrios de la ciudad para mayor seguridad y ahorro energético.',
    image_url: 'https://images.unsplash.com/photo-1545987796-200677ee1011?w=800&q=80',
    latitude: -32.002,
    longitude: -62.110,
    address: 'Diversos puntos de la ciudad',
    is_active: true,
    order_position: 2,
    created_at: '2025-02-10T10:00:00Z',
    updated_at: '2025-02-10T10:00:00Z',
  },
  {
    id: 'sample-3',
    title: 'Mejoramiento de Redes de Agua',
    slug: 'mejoramiento-redes-agua',
    description:
      'Nos enfocamos en mejorar y expandir las redes de agua potable y cloacas, asegurando el acceso a servicios básicos para todos los barrios y mejorando la calidad de vida de los vecinos.',
    image_url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80',
    latitude: -32.008,
    longitude: -62.120,
    address: 'Barrio Norte y Barrio Sur',
    is_active: true,
    order_position: 3,
    created_at: '2025-03-05T10:00:00Z',
    updated_at: '2025-03-05T10:00:00Z',
  },
  {
    id: 'sample-4',
    title: 'Modernización de Espacios Verdes',
    slug: 'modernizacion-espacios-verdes',
    description:
      'A través de este plan, ponemos en valor plazas, parques y ciclovías, creando espacios públicos modernos y accesibles para el disfrute de toda la comunidad.',
    image_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80',
    latitude: -32.000,
    longitude: -62.108,
    address: 'Plaza Central y Parque Municipal',
    is_active: true,
    order_position: 4,
    created_at: '2025-04-20T10:00:00Z',
    updated_at: '2025-04-20T10:00:00Z',
  },
  {
    id: 'sample-5',
    title: 'Construcción de Centro Cultural',
    slug: 'construccion-centro-cultural',
    description:
      'Construcción del nuevo Centro Cultural Municipal con salón de usos múltiples, biblioteca, sala de exposiciones y talleres para fomentar la cultura y las artes en nuestro municipio.',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
    latitude: -32.003,
    longitude: -62.112,
    address: 'Calle Belgrano 450',
    is_active: true,
    order_position: 5,
    created_at: '2025-05-10T10:00:00Z',
    updated_at: '2025-05-10T10:00:00Z',
  },
  {
    id: 'sample-6',
    title: 'Nuevos Accesos y Rotondas',
    slug: 'nuevos-accesos-rotondas',
    description:
      'Trabajamos en la construcción de nuevos accesos y rotondas para mejorar la conectividad vial, facilitar el tránsito vehicular y aumentar la seguridad en los puntos de mayor circulación.',
    image_url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80',
    latitude: -31.998,
    longitude: -62.105,
    address: 'Ruta Provincial y acceso sur',
    is_active: true,
    order_position: 6,
    created_at: '2025-06-01T10:00:00Z',
    updated_at: '2025-06-01T10:00:00Z',
  },
];
