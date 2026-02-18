'use client';

import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Box, Typography, Chip } from '@mui/material';
import { LocationOn as LocationOnIcon } from '@mui/icons-material';
import { PublicWork } from '@/types';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon (Leaflet + bundlers issue)
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type MapObrasProps = {
  obras: PublicWork[];
  center?: [number, number];
  zoom?: number;
};

const MapObras = ({ obras, center = [-32.003, -62.112], zoom = 14 }: MapObrasProps) => {
  const obrasConCoords = useMemo(
    () => obras.filter((o) => o.latitude && o.longitude),
    [obras]
  );

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {obrasConCoords.map((obra) => (
        <Marker
          key={obra.id}
          position={[obra.latitude!, obra.longitude!]}
          icon={greenIcon}
        >
          <Popup>
            <Box sx={{ minWidth: 180, maxWidth: 250 }}>
              {obra.image_url && (
                <Box
                  component="img"
                  src={obra.image_url}
                  alt={obra.title}
                  sx={{
                    width: '100%',
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 1,
                    mb: 1,
                  }}
                />
              )}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: '#43A047', lineHeight: 1.3 }}
              >
                {obra.title}
              </Typography>
              {obra.address && (
                <Chip
                  icon={<LocationOnIcon sx={{ fontSize: 14 }} />}
                  label={obra.address}
                  size="small"
                  variant="outlined"
                  sx={{ mt: 0.5, fontSize: '0.7rem' }}
                />
              )}
            </Box>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapObras;
