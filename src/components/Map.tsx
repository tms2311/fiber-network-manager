import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Point, Cable, CableRoute } from '../lib/database.types';

const createIcon = (color: string, type: string) => {
  const iconHtml = type === 'pole'
    ? '📍'
    : type === 'fiber_box'
    ? '📦'
    : '🔧';

  return L.divIcon({
    html: `<div style="font-size: 24px;">${iconHtml}</div>`,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

interface MapProps {
  points: Point[];
  cables: Cable[];
  cableRoutes: CableRoute[];
  onMapClick?: (lat: number, lng: number) => void;
  onPointClick?: (point: Point) => void;
  drawingMode?: 'point' | 'cable' | null;
}

function MapClickHandler({
  onMapClick
}: {
  onMapClick?: (lat: number, lng: number) => void
}) {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export function Map({
  points,
  cables,
  cableRoutes,
  onMapClick,
  onPointClick,
  drawingMode
}: MapProps) {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  if (!mapReady) {
    return <div className="w-full h-full flex items-center justify-center">Loading map...</div>;
  }

  return (
    <MapContainer
     center={[-23.9608, -46.3336]}
zoom={15}
      className="w-full h-full"
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler onMapClick={onMapClick} />

      {points.map((point) => (
        <Marker
          key={point.id}
          position={[point.latitude, point.longitude]}
          icon={createIcon('#000', point.type)}
          eventHandlers={{
            click: () => onPointClick?.(point),
          }}
        >
          <Popup>
            <div className="text-sm">
              <h3 className="font-semibold">{point.name}</h3>
              <p className="text-gray-600">Type: {point.type}</p>
              {point.description && (
                <p className="text-gray-500 mt-1">{point.description}</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      {cables.map((cable) => {
        const startPoint = points.find(p => p.id === cable.start_point_id);
        const endPoint = points.find(p => p.id === cable.end_point_id);
        const route = cableRoutes.find(r => r.cable_id === cable.id);

        if (!startPoint || !endPoint) return null;

        const positions = route && route.route_points.length > 0
          ? route.route_points.map(p => [p.lat, p.lng] as [number, number])
          : [
              [startPoint.latitude, startPoint.longitude] as [number, number],
              [endPoint.latitude, endPoint.longitude] as [number, number],
            ];

        return (
          <Polyline
            key={cable.id}
            positions={positions}
            color={cable.color}
            weight={4}
            opacity={0.7}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-semibold">{cable.name}</h3>
                <p className="text-gray-600">Fibers: {cable.fiber_count}</p>
                <p className="text-gray-500">
                  {startPoint.name} → {endPoint.name}
                </p>
              </div>
            </Popup>
          </Polyline>
        );
      })}
    </MapContainer>
  );
}
