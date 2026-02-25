'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap, AttributionControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapLocation, CATEGORY_CONFIG } from './MapSection';

// Fix Leaflet default marker icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MARKER_SIZE = 32;

const createCategoryIcon = (category: MapLocation['category']) => {
  const config = CATEGORY_CONFIG[category];
  return L.divIcon({
    className: '',
    html: `<div style="
      width: ${MARKER_SIZE}px;
      height: ${MARKER_SIZE}px;
      border-radius: 50%;
      background: ${config.color};
      border: 2.5px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
      transition: transform 0.15s ease;
    ">${config.icon}</div>`,
    iconSize: [MARKER_SIZE, MARKER_SIZE],
    iconAnchor: [MARKER_SIZE / 2, MARKER_SIZE / 2],
    popupAnchor: [0, -MARKER_SIZE / 2],
  });
};

/**
 * Spread overlapping markers in a circular pattern so each is visible and clickable.
 * Markers within `threshold` degrees of each other are considered overlapping.
 */
const spreadOverlappingMarkers = (
  locations: MapLocation[],
  threshold = 0.00025,
  radiusDeg = 0.0004,
): { location: MapLocation; lat: number; lng: number }[] => {
  // Group locations that are within threshold distance of each other
  const groups: MapLocation[][] = [];
  const assigned = new Set<number>();

  for (let i = 0; i < locations.length; i++) {
    if (assigned.has(i)) continue;
    const group: MapLocation[] = [locations[i]];
    assigned.add(i);

    for (let j = i + 1; j < locations.length; j++) {
      if (assigned.has(j)) continue;
      const dLat = Math.abs(locations[i].lat - locations[j].lat);
      const dLng = Math.abs(locations[i].lng - locations[j].lng);
      if (dLat < threshold && dLng < threshold) {
        group.push(locations[j]);
        assigned.add(j);
      }
    }
    groups.push(group);
  }

  // Spread each group
  const result: { location: MapLocation; lat: number; lng: number }[] = [];

  for (const group of groups) {
    if (group.length === 1) {
      result.push({ location: group[0], lat: group[0].lat, lng: group[0].lng });
      continue;
    }

    // Calculate group center
    const centerLat = group.reduce((sum, l) => sum + l.lat, 0) / group.length;
    const centerLng = group.reduce((sum, l) => sum + l.lng, 0) / group.length;

    // Spread in a circle around the center
    const angleStep = (2 * Math.PI) / group.length;
    group.forEach((loc, i) => {
      const angle = angleStep * i - Math.PI / 2; // Start from top
      result.push({
        location: loc,
        lat: centerLat + radiusDeg * Math.sin(angle),
        lng: centerLng + radiusDeg * Math.cos(angle),
      });
    });
  }

  return result;
};

// Auto-fit bounds to all markers
const FitBounds = ({ locations }: { locations: MapLocation[] }) => {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map((l) => [l.lat, l.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [map, locations]);

  return null;
};

type MapInnerProps = {
  locations: MapLocation[];
  onMarkerClick: (location: MapLocation) => void;
};

const MapInner = ({ locations, onMarkerClick }: MapInnerProps) => {
  const center: [number, number] = [-31.1335, -64.1405];

  const spreadLocations = useMemo(
    () => spreadOverlappingMarkers(locations),
    [locations],
  );

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={false}
      attributionControl={false}
    >
      <AttributionControl position="bottomright" prefix={false} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds locations={locations} />
      {spreadLocations.map(({ location, lat, lng }) => (
        <Marker
          key={location.name}
          position={[lat, lng]}
          icon={createCategoryIcon(location.category)}
          eventHandlers={{
            click: () => onMarkerClick(location),
          }}
        />
      ))}
    </MapContainer>
  );
};

export default MapInner;
