'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import { bangladeshAirports, type Airport } from '../services/airportService';

interface AirportMapProps {
  center?: [number, number];
  zoom?: number;
  showInternational?: boolean;
  showDomestic?: boolean;
  showSTOL?: boolean;
}

const createAirportIcon = (airport: Airport) => {
  const typeColors = {
    international: '#dc2626', // Red for international (highest danger)
    domestic: '#f97316',      // Orange for domestic 
    stol: '#f59e0b'          // Amber for STOL ports
  };

  const typeEmojis = {
    international: '✈️',
    domestic: '🛫',
    stol: '🛩️'
  };

  const color = typeColors[airport.type];
  const emoji = typeEmojis[airport.type];
  const size = airport.type === 'international' ? 30 : airport.type === 'domestic' ? 25 : 20;

  return new DivIcon({
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${size * 0.4}px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.4);
        position: relative;
      ">
        ${emoji}
        <div style="
          position: absolute;
          top: -8px;
          right: -8px;
          background: #dc2626;
          color: white;
          border-radius: 50%;
          width: 12px;
          height: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: bold;
          border: 1px solid white;
        ">!</div>
      </div>
    `,
    className: 'airport-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const getDangerZoneColor = (airport: Airport) => {
  switch (airport.type) {
    case 'international': return '#dc2626'; // Red
    case 'domestic': return '#f97316';      // Orange
    case 'stol': return '#f59e0b';          // Amber
    default: return '#dc2626';
  }
};

const getDangerLevel = (airport: Airport): string => {
  switch (airport.type) {
    case 'international': return 'EXTREME DANGER';
    case 'domestic': return 'HIGH DANGER';
    case 'stol': return 'MODERATE DANGER';
    default: return 'DANGER';
  }
};

export default function AirportMap({ 
  center = [23.6850, 90.3563], // Center of Bangladesh
  zoom = 7,
  showInternational = true,
  showDomestic = true,
  showSTOL = true
}: AirportMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fix for leaflet icon issues in Next.js
  useEffect(() => {
    if (isClient) {
      import('leaflet').then((L) => {
        delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: '/leaflet-images/marker-icon-2x.png',
          iconUrl: '/leaflet-images/marker-icon.png',
          shadowUrl: '/leaflet-images/marker-shadow.png',
        });
      }).catch(error => {
        console.warn('Failed to configure Leaflet icons:', error);
      });
    }
  }, [isClient]);

  const filteredAirports = bangladeshAirports.filter(airport => {
    if (airport.type === 'international' && !showInternational) return false;
    if (airport.type === 'domestic' && !showDomestic) return false;
    if (airport.type === 'stol' && !showSTOL) return false;
    return true;
  });

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-white">Loading map...</div>
      </div>
    );
  }

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
      
      {filteredAirports.map((airport) => (
        <div key={airport.id}>
          {/* Danger Zone Circle */}
          <Circle
            center={[airport.latitude, airport.longitude]}
            radius={airport.dangerZoneRadius}
            pathOptions={{
              color: getDangerZoneColor(airport),
              fillColor: getDangerZoneColor(airport),
              fillOpacity: 0.2,
              weight: 2,
              opacity: 0.8,
            }}
          />
          
          {/* Airport Marker */}
          <Marker
            position={[airport.latitude, airport.longitude]}
            icon={createAirportIcon(airport)}
          >
            <Popup maxWidth={400}>
              <div style={{ color: 'black', padding: '12px', maxWidth: '350px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '8px',
                  padding: '8px',
                  background: getDangerZoneColor(airport),
                  color: 'white',
                  borderRadius: '6px',
                  fontWeight: 'bold'
                }}>
                  <span style={{ fontSize: '18px', marginRight: '8px' }}>⚠️</span>
                  <div>
                    <div style={{ fontSize: '16px' }}>{airport.name}</div>
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>{getDangerLevel(airport)} ZONE</div>
                  </div>
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                    <div><strong>City:</strong> {airport.city}</div>
                    <div><strong>Type:</strong> {airport.type.toUpperCase()}</div>
                    <div><strong>IATA:</strong> {airport.iataCode}</div>
                    <div><strong>ICAO:</strong> {airport.icaoCode}</div>
                  </div>
                </div>

                <div style={{ 
                  background: '#f3f4f6', 
                  padding: '8px', 
                  borderRadius: '4px', 
                  marginBottom: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#dc2626', marginBottom: '4px' }}>
                    🚫 DANGER ZONE RADIUS: {(airport.dangerZoneRadius / 1000).toFixed(1)} KM
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    Living within this area is NOT RECOMMENDED
                  </div>
                </div>
                
                <div style={{ fontSize: '11px', lineHeight: '1.4', marginBottom: '10px' }}>
                  <strong>Health & Safety Risks:</strong><br />
                  {airport.description}
                </div>

                <div style={{ 
                  background: '#fef2f2', 
                  border: '1px solid #fecaca', 
                  padding: '8px', 
                  borderRadius: '4px',
                  fontSize: '10px',
                  color: '#991b1b'
                }}>
                  <strong>⚠️ WARNING:</strong> Airport proximity causes noise pollution (70-90 dB), air pollution from jet emissions, safety risks from flight paths, and potential property value decrease.
                </div>

                <div style={{ 
                  marginTop: '8px', 
                  fontSize: '10px', 
                  color: '#9ca3af',
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '6px'
                }}>
                  Coordinates: {airport.latitude.toFixed(4)}, {airport.longitude.toFixed(4)}
                </div>
              </div>
            </Popup>
          </Marker>
        </div>
      ))}
    </MapContainer>
  );
}