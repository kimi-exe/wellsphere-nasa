'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';

import { type EnvironmentalDataPoint } from '../services/environmentalDataService';

interface LeafletMapProps {
  center: [number, number];
  zoom: number;
  data: EnvironmentalDataPoint[];
  visibleLayers: Record<string, boolean>;
}

// Create custom markers for different severities
const createCustomIcon = (severity: string, type: string) => {
  const severityColors = {
    low: '#22c55e',
    medium: '#f59e0b',
    high: '#f97316',
    critical: '#dc2626'
  };

  const typeEmojis = {
    heatwave: '🌡️',
    flood: '💧',
    soil: '🏔️',
    earthquake: '⚡'
  };

  const color = severityColors[severity as keyof typeof severityColors];
  const emoji = typeEmojis[type as keyof typeof typeEmojis];
  const size = severity === 'critical' ? 25 : severity === 'high' ? 20 : 15;

  return new DivIcon({
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 2px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${size * 0.4}px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        ${emoji}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

function getUnitForType(type: string): string {
  switch (type) {
    case 'heatwave': return '°C';
    case 'flood': return 'm';
    case 'soil': return ' pH';
    case 'earthquake': return ' mag';
    default: return '';
  }
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical': return '#dc2626';
    case 'high': return '#f97316';
    case 'medium': return '#f59e0b';
    case 'low': return '#22c55e';
    default: return '#6b7280';
  }
}

export default function LeafletMap({ center, zoom, data, visibleLayers }: LeafletMapProps) {
  // Fix for leaflet icon issues in Next.js
  useEffect(() => {
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/leaflet-images/marker-icon-2x.png',
      iconUrl: '/leaflet-images/marker-icon.png',
      shadowUrl: '/leaflet-images/marker-shadow.png',
    });
  }, []);

  const filteredData = data.filter(point => visibleLayers[point.type]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-full rounded-lg"
      style={{ backgroundColor: '#1a1a1a' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        className="map-tiles"
      />
      
      {filteredData.map((point) => (
        <div key={point.id}>
          {/* Danger zone circle for high severity items */}
          {(point.severity === 'high' || point.severity === 'critical') && (
            <Circle
              center={[point.lat, point.lng]}
              radius={point.severity === 'critical' ? 15000 : 10000}
              pathOptions={{
                color: '#dc2626',
                fillColor: '#dc2626',
                fillOpacity: 0.15,
                weight: 2,
              }}
            />
          )}
          
          {/* Data point marker */}
          <Marker
            position={[point.lat, point.lng]}
            icon={createCustomIcon(point.severity, point.type)}
          >
            <Popup>
              <div style={{ color: 'black', padding: '8px', maxWidth: '300px' }}>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#1f2937' }}>
                  {point.type.toUpperCase()} Alert
                </h3>
                <div style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '4px', margin: '4px 0' }}>
                  <span style={{ fontSize: '11px', color: '#6b7280' }}>Source: {point.source || 'Unknown'}</span>
                </div>
                <p style={{ margin: '4px 0', fontSize: '12px' }}>
                  <strong>Severity:</strong> <span style={{ color: getSeverityColor(point.severity) }}>{point.severity.toUpperCase()}</span>
                </p>
                <p style={{ margin: '4px 0', fontSize: '12px' }}>
                  <strong>Value:</strong> {point.value}{getUnitForType(point.type)}
                </p>
                {point.additionalData && (
                  <div style={{ margin: '4px 0', fontSize: '11px', color: '#4b5563' }}>
                    {point.additionalData.magnitude && <div><strong>Magnitude:</strong> {point.additionalData.magnitude}</div>}
                    {point.additionalData.depth && <div><strong>Depth:</strong> {point.additionalData.depth.toFixed(1)} km</div>}
                    {point.additionalData.ph && <div><strong>pH:</strong> {point.additionalData.ph}</div>}
                    {point.additionalData.moisture && <div><strong>Soil Moisture:</strong> {point.additionalData.moisture.toFixed(1)}%</div>}
                    {point.additionalData.temperature && point.type === 'soil' && <div><strong>Soil Temp:</strong> {point.additionalData.temperature.toFixed(1)}°C</div>}
                  </div>
                )}
                <p style={{ margin: '6px 0 4px 0', fontSize: '11px', lineHeight: '1.4' }}>
                  {point.description}
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#9ca3af', borderTop: '1px solid #e5e7eb', paddingTop: '4px' }}>
                  {new Date(point.timestamp).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        </div>
      ))}
    </MapContainer>
  );
}