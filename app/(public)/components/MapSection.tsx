'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  Box,
  Container,
  Typography,
  Paper,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import SectionTitle from './SectionTitle';
import AnimatedSection from './AnimatedSection';

// Lazy-load map to avoid SSR issues with Leaflet
const LazyMap = dynamic(() => import('./MapInner'), { ssr: false });

export type MapLocation = {
  name: string;
  lat: number;
  lng: number;
  category: 'gobierno' | 'salud' | 'cultura' | 'educacion' | 'deporte' | 'obra' | 'informacion' | 'registro' | 'seguridad' | 'transporte' | 'espacio-publico';
  address?: string;
  googleMapsUrl?: string;
  imageUrl?: string;
};

// ---------------------------------------------------------------------------
// Auto-matching de imágenes: archivos en /public/vistasMapas/
// Para agregar una imagen nueva, colocar el .webp en esa carpeta y agregar
// el nombre del archivo (sin extensión) a esta lista.
// El sistema matchea automáticamente por nombre normalizado (sin tildes,
// minúsculas). Si el nombre del archivo no matchea directamente con el de
// la ubicación, agregar una entrada en IMAGE_ALIASES.
// ---------------------------------------------------------------------------
const VISTA_IMAGES = [
  'Centro Modular de Salud',
  'Centro de Capacitacion',
  'Cine Teatro Municipal',
  'Concejo Deliberante Tribunal de Cuentas',
  'Guardia Urbana',
  'Juzgado de Paz',
  'Municipalidad',
  'Pileta municipal',
  'Planta Potabilizadora de Agua',
  'Polideportivo Est Gral Paz',
  'Punto Digital',
  'RAAC',
  'Registro Civil',
  'Sala Cuna',
  'Terminal de Ómnibus',
  'Vivienda Semilla',
];

/** Alias: nombre de ubicación → nombre de archivo (para los que no matchean) */
const IMAGE_ALIASES: Record<string, string> = {
  'HCD y HTC': 'Concejo Deliberante Tribunal de Cuentas',
  'Municipalidad de Estación General Paz': 'Municipalidad',
  'Polideportivo Municipal': 'Polideportivo Est Gral Paz',
  'Planta Potabilizadora': 'Planta Potabilizadora de Agua',
  'RAC': 'RAAC',
  'Sala Cuna - Tía María Elena': 'Sala Cuna',
  'Obra Viviendas Semilla': 'Vivienda Semilla',
};

/** Normaliza texto: quita tildes, baja a minúsculas */
const normalize = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/** Índice normalizado de imágenes disponibles */
const imageIndex = new Map(
  VISTA_IMAGES.map((f) => [normalize(f), `/vistasMapas/${f}.webp`]),
);

/** Dado el nombre de una ubicación, devuelve la URL de imagen o undefined */
const resolveImage = (locationName: string): string | undefined => {
  // 1. Alias explícito
  const alias = IMAGE_ALIASES[locationName];
  if (alias) {
    const url = imageIndex.get(normalize(alias));
    if (url) return url;
  }
  // 2. Match directo por nombre normalizado
  const direct = imageIndex.get(normalize(locationName));
  if (direct) return direct;
  // 3. Match parcial: el nombre de la ubicación contiene el del archivo o viceversa
  const normName = normalize(locationName);
  for (const [normFile, url] of imageIndex) {
    if (normName.includes(normFile) || normFile.includes(normName)) return url;
  }
  return undefined;
};

const LOCATIONS: MapLocation[] = [
  {
    name: 'Terminal de Ómnibus',
    lat: -31.1308595,
    lng: -64.1397094,
    category: 'transporte',
    address: 'Estación General Paz',
    googleMapsUrl: 'https://maps.app.goo.gl/2Ri3AAf6TGW9ee8u6',
  },
  {
    name: 'Centro Modular de Salud',
    lat: -31.131057,
    lng: -64.139249,
    category: 'salud',
    address: 'Estación General Paz',
    googleMapsUrl: 'https://maps.app.goo.gl/xaLGTE9pqLPnZby2A',
  },
  {
    name: 'Cine Teatro Municipal',
    lat: -31.1334,
    lng: -64.1407,
    category: 'cultura',
    address: 'Buenos Aires, Estación General Paz',
    googleMapsUrl: 'https://maps.app.goo.gl/Mq3Jn4vtVmb4DngM8',
  },
  {
    name: 'Centro de Capacitación',
    lat: -31.134604,
    lng: -64.142181,
    category: 'cultura',
    address: 'Estación General Paz',
    googleMapsUrl: 'https://maps.app.goo.gl/dgESGJME3PPyDUvg7',
  },
  {
    name: 'Municipalidad de Estación General Paz',
    lat: -31.1335947,
    lng: -64.1403912,
    category: 'gobierno',
    address: 'Buenos Aires esq. Sgo. del Estero',
    googleMapsUrl: 'https://maps.app.goo.gl/je3CN2qfW1fgdwpa9',
  },
  {
    name: 'HCD y HTC',
    lat: -31.133360,
    lng: -64.139976,
    category: 'gobierno',
    address: 'Estación General Paz',
    googleMapsUrl: 'https://maps.app.goo.gl/Mm2u98g2G5zLcgHi9',
  },
  {
    name: 'Registro Civil',
    lat: -31.133741,
    lng: -64.140001,
    category: 'registro',
    address: 'Estación General Paz',
    googleMapsUrl: 'https://maps.app.goo.gl/VzyWqz4pHW8NB2Kn7',
  },
  {
    name: 'Polideportivo Municipal',
    lat: -31.133557,
    lng: -64.140030,
    category: 'deporte',
    address: 'Estación General Paz',
    googleMapsUrl: 'https://maps.app.goo.gl/ezy8j7cqGVyFPXgX7',
  },
  {
    name: 'Plaza Provincias Unidas',
    lat: -31.134591,
    lng: -64.140136,
    category: 'espacio-publico',
    address: 'Estación General Paz',
    googleMapsUrl: 'https://maps.app.goo.gl/T6aD2dNrmZu8ANKG9',
  },
  {
    name: 'Plaza del Divino Niño Jesús',
    lat: -31.130609,
    lng: -64.144293,
    category: 'espacio-publico',
    address: 'Estación General Paz',
    googleMapsUrl: 'https://maps.app.goo.gl/e7CPEpTYiC5EPDhh6',
  },
  {
    name: 'Sala Cuna - Tía María Elena',
    lat: -31.135959,
    lng: -64.140547,
    category: 'educacion',
    address: 'Estación General Paz',
    googleMapsUrl: 'https://maps.app.goo.gl/sMGBrbjthvnVVM8PA',
  },
  {
    name: 'Pileta Municipal',
    lat: -31.135444,
    lng: -64.142954,
    category: 'deporte',
    address: 'Estación General Paz',
    googleMapsUrl: 'https://maps.app.goo.gl/fF3yEsHGvJEGwabs8',
  },
  {
    name: 'Planta Potabilizadora',
    lat: -31.136670,
    lng: -64.143245,
    category: 'obra',
    address: 'Estación General Paz',
    googleMapsUrl: 'https://maps.app.goo.gl/gS4iefwzAd2dVtn8A',
  },
  {
    name: 'RAC',
    lat: -31.133995,
    lng: -64.139927,
    category: 'salud',
    address: 'Estación General Paz',
    googleMapsUrl: 'https://maps.app.goo.gl/QFuVdKVE9AWHdFDD9',
  },
  {
    name: 'Punto Digital',
    lat: -31.134008,
    lng: -64.139874,
    category: 'informacion',
    address: 'Estación General Paz',
    googleMapsUrl: 'https://maps.app.goo.gl/ZpWhNfCKaP3gVU9j6',
  },
  {
    name: 'Guardia Urbana',
    lat: -31.134026,
    lng: -64.139761,
    category: 'seguridad',
    address: 'Estación General Paz',
    googleMapsUrl: 'https://maps.app.goo.gl/PAW1MnAL29Uo679v6',
  },
  {
    name: 'Obra Viviendas Semilla',
    lat: -31.130222,
    lng: -64.138940,
    category: 'obra',
    address: 'Estación General Paz',
    googleMapsUrl: 'https://maps.app.goo.gl/UKtuAQudNjQXZNvA8',
  },
  {
    name: 'Huerta Municipal',
    lat: -31.1320,
    lng: -64.1430,
    category: 'espacio-publico',
    address: 'Estación General Paz',
    googleMapsUrl: '',
  },
  {
    name: 'Juzgado de Paz',
    lat: -31.1338,
    lng: -64.1400,
    category: 'gobierno',
    address: 'Bv. Pedro Fraire 63',
    googleMapsUrl: 'https://maps.app.goo.gl/5dchidRZmnqHsYPv8',
  },
];

// Aplicar imágenes automáticamente a cada ubicación
const LOCATIONS_WITH_IMAGES: MapLocation[] = LOCATIONS.map((loc) => ({
  ...loc,
  imageUrl: loc.imageUrl ?? resolveImage(loc.name),
}));

export const CATEGORY_CONFIG: Record<
  MapLocation['category'],
  { color: string; icon: string; label: string }
> = {
  gobierno: { color: '#2E86C1', icon: '🏛️', label: 'Gobierno' },
  salud: { color: '#E53935', icon: '🏥', label: 'Salud' },
  cultura: { color: '#B52A1C', icon: '🎭', label: 'Cultura' },
  educacion: { color: '#1A5F8B', icon: '📚', label: 'Educación' },
  deporte: { color: '#43A047', icon: '⚽', label: 'Deporte' },
  obra: { color: '#F5A623', icon: '🏗️', label: 'Obra e Infraestructura' },
  informacion: { color: '#7B1FA2', icon: '💻', label: 'Información' },
  registro: { color: '#2E7D32', icon: '📋', label: 'Registro Civil' },
  seguridad: { color: '#5C6BC0', icon: '🛡️', label: 'Seguridad' },
  transporte: { color: '#00897B', icon: '🚌', label: 'Transporte' },
  'espacio-publico': { color: '#66BB6A', icon: '🌳', label: 'Espacios Públicos' },
};

const MapSection = () => {
  const [selected, setSelected] = useState<MapLocation | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(LOCATIONS_WITH_IMAGES.map((l) => l.category));
    return Array.from(cats).map((c) => ({ key: c, ...CATEGORY_CONFIG[c] }));
  }, []);

  return (
    <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#FAFBFC' }}>
      <Container maxWidth="lg">
        <AnimatedSection animation="fadeInUp">
          <SectionTitle
            title="Mapa de la Ciudad"
            subtitle="Encontrá los puntos de interés y servicios municipales"
          />
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={100}>
          {/* Legend */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.5,
              justifyContent: 'center',
              mb: 3,
            }}
          >
            {categories.map((cat) => (
              <Box
                key={cat.key}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 5,
                  backgroundColor: `${cat.color}12`,
                  border: `1px solid ${cat.color}30`,
                }}
              >
                <Typography sx={{ fontSize: '0.85rem', lineHeight: 1 }}>
                  {cat.icon}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 500, color: cat.color }}
                >
                  {cat.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Map container */}
          <Box sx={{ position: 'relative' }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                height: { xs: 400, md: 500 },
              }}
            >
              <LazyMap
                locations={LOCATIONS_WITH_IMAGES}
                onMarkerClick={setSelected}
              />
            </Paper>

            {/* Info panel */}
            {selected && (
              <Paper
                elevation={6}
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  right: { xs: 16, sm: 'auto' },
                  width: { sm: 320 },
                  borderRadius: 2.5,
                  zIndex: 1000,
                  overflow: 'hidden',
                  borderLeft: `4px solid ${CATEGORY_CONFIG[selected.category].color}`,
                }}
              >
                {/* Image area */}
                {selected.imageUrl && (
                  <Box sx={{ position: 'relative', height: 140 }}>
                    <Box
                      component="img"
                      src={selected.imageUrl}
                      alt={selected.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    {/* Gradient overlay for readability */}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.35) 100%)',
                      }}
                    />
                    {/* Category badge on image */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 1,
                        py: 0.4,
                        borderRadius: 1,
                        backgroundColor: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      <Typography sx={{ fontSize: '0.8rem', lineHeight: 1 }}>
                        {CATEGORY_CONFIG[selected.category].icon}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: CATEGORY_CONFIG[selected.category].color,
                          fontSize: '0.65rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {CATEGORY_CONFIG[selected.category].label}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Content area */}
                <Box sx={{ p: 2 }}>
                  {/* Category badge when no image */}
                  {!selected.imageUrl && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
                      <Typography sx={{ fontSize: '1rem', lineHeight: 1 }}>
                        {CATEGORY_CONFIG[selected.category].icon}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: CATEGORY_CONFIG[selected.category].color,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {CATEGORY_CONFIG[selected.category].label}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, lineHeight: 1.3, fontSize: '0.95rem' }}
                      >
                        {selected.name}
                      </Typography>
                      {selected.address && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, fontSize: '0.8rem' }}>
                          {selected.address}
                        </Typography>
                      )}
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => setSelected(null)}
                      sx={{
                        ml: 0.5,
                        mt: -0.5,
                        mr: -0.5,
                        color: 'text.secondary',
                        '&:hover': { color: 'text.primary' },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>

                  {selected.googleMapsUrl && (
                    <Typography
                      component="a"
                      href={selected.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="caption"
                      sx={{
                        display: 'inline-block',
                        mt: 1,
                        color: '#2E86C1',
                        fontWeight: 600,
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Ver en Google Maps →
                    </Typography>
                  )}
                </Box>
              </Paper>
            )}
          </Box>
        </AnimatedSection>
      </Container>
    </Box>
  );
};

export default MapSection;
