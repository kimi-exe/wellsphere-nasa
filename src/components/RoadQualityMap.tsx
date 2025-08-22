'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup, Marker } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import { roadQualityService, type RoadSegment, type RoadQualityArea } from '../services/roadQualityService';

interface RoadQualityMapProps {
  center?: [number, number];
  zoom?: number;
  selectedCity?: string;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  showFilters?: {
    excellent?: boolean;
    good?: boolean;
    fair?: boolean;
    poor?: boolean;
    very_poor?: boolean;
  };
}

const createRoadMarker = (road: RoadSegment) => {
  const qualityIcons = {
    excellent: '✅',
    good: '🟢',
    fair: '🟡',
    poor: '🟠',
    very_poor: '🔴'
  };

  const qualityColors = {
    excellent: '#00ff00',
    good: '#7fff00',
    fair: '#ffff00',
    poor: '#ff7f00',
    very_poor: '#ff0000'
  };

  const color = qualityColors[road.quality];
  const icon = qualityIcons[road.quality];

  return new DivIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
      ">
        ${icon}
      </div>
    `,
    className: 'road-quality-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const getRoadQualityDescription = (road: RoadSegment): string => {
  switch (road.quality) {
    case 'excellent': return 'Excellent condition - smooth, well-maintained road';
    case 'good': return 'Good condition - minor wear, suitable for all vehicles';
    case 'fair': return 'Fair condition - some maintenance needed';
    case 'poor': return 'Poor condition - significant issues present';
    case 'very_poor': return 'Very poor condition - major problems, use caution';
    default: return 'Road condition unknown';
  }
};

const getSurfaceDescription = (surface: string): string => {
  switch (surface) {
    case 'concrete': return 'Concrete surface - durable and smooth';
    case 'asphalt': return 'Asphalt surface - standard paved road';
    case 'paved': return 'Paved surface - suitable for vehicles';
    case 'gravel': return 'Gravel surface - rough, slower travel';
    case 'dirt': return 'Dirt surface - unpaved, weather dependent';
    case 'unpaved': return 'Unpaved surface - basic road conditions';
    default: return 'Surface type unknown';
  }
};

export default function RoadQualityMap({ 
  center = [23.6850, 90.3563], 
  zoom = 8,
  selectedCity,
  bounds,
  showFilters = {
    excellent: true,
    good: true,
    fair: true,
    poor: true,
    very_poor: true
  }
}: RoadQualityMapProps) {
  const [roadData, setRoadData] = useState<RoadQualityArea | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  useEffect(() => {
    const loadRoadData = async () => {
      try {
        setLoading(true);
        let data: RoadQualityArea;
        
        if (bounds) {
          data = await roadQualityService.getRoadQualityForArea(bounds);
        } else if (selectedCity) {
          data = await roadQualityService.getRoadQualityForCity(selectedCity);
        } else {
          // Default to Dhaka area
          data = await roadQualityService.getRoadQualityForCity('Dhaka');
        }
        
        setRoadData(data);
      } catch (error) {
        console.error('Error loading road data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isClient) {
      loadRoadData();
    }
  }, [isClient, bounds, selectedCity]);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-white">Loading map...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-white">Loading road quality data...</div>
      </div>
    );
  }

  if (!roadData) {
    return (
      <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-white">No road data available for this area</div>
      </div>
    );
  }

  const filteredRoads = roadData.roads.filter(road => {
    return showFilters[road.quality] !== false;
  });

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
      />
      
      {filteredRoads.map((road) => (
        <div key={road.id}>
          {/* Road Line */}
          <Polyline
            positions={road.coordinates}
            pathOptions={{
              color: roadQualityService.getQualityColor(road.quality),
              weight: roadQualityService.getQualityWeight(road.quality),
              opacity: 0.8,
            }}
          >
            <Popup maxWidth={450}>
              <div style={{ color: 'black', padding: '12px', maxWidth: '420px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '12px',
                  padding: '10px',
                  background: roadQualityService.getQualityColor(road.quality),
                  color: road.quality === 'fair' ? 'black' : 'white',
                  borderRadius: '6px',
                  fontWeight: 'bold'
                }}>
                  <span style={{ fontSize: '20px', marginRight: '10px' }}>
                    {road.quality === 'excellent' ? '✅' : 
                     road.quality === 'good' ? '🟢' :
                     road.quality === 'fair' ? '🟡' :
                     road.quality === 'poor' ? '🟠' : '🔴'}
                  </span>
                  <div>
                    <div style={{ fontSize: '16px' }}>{road.name}</div>
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>
                      {road.quality.toUpperCase().replace('_', ' ')} CONDITION
                    </div>
                  </div>
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                    <div><strong>Surface:</strong> {road.surface}</div>
                    <div><strong>Type:</strong> {road.highway_type}</div>
                    <div><strong>Score:</strong> {road.condition_score}/100</div>
                    <div><strong>Traffic:</strong> {road.traffic_level}</div>
                    <div><strong>Width:</strong> {road.width_category}</div>
                    <div><strong>Maintenance:</strong> {road.maintenance_status.replace('_', ' ')}</div>
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                    Road Description:
                  </div>
                  <div style={{ fontSize: '11px', color: '#4b5563' }}>
                    {getRoadQualityDescription(road)}
                  </div>
                  <div style={{ fontSize: '11px', color: '#4b5563', marginTop: '2px' }}>
                    {getSurfaceDescription(road.surface)}
                  </div>
                </div>

                {road.issues.length > 0 && (
                  <div style={{ 
                    background: '#fef2f2', 
                    border: '1px solid #fecaca', 
                    padding: '8px', 
                    borderRadius: '4px',
                    marginBottom: '12px',
                    fontSize: '11px'
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#dc2626', marginBottom: '4px' }}>
                      ⚠️ Current Issues:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '16px', color: '#991b1b' }}>
                      {road.issues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                    Accessibility:
                  </div>
                  <div style={{ fontSize: '11px', display: 'flex', gap: '12px' }}>
                    <span style={{ color: road.accessibility.vehicle_accessible ? '#059669' : '#dc2626' }}>
                      🚗 {road.accessibility.vehicle_accessible ? 'Vehicle OK' : 'No Vehicles'}
                    </span>
                    <span style={{ color: road.accessibility.emergency_access ? '#059669' : '#dc2626' }}>
                      🚑 {road.accessibility.emergency_access ? 'Emergency OK' : 'No Emergency'}
                    </span>
                    <span style={{ color: road.accessibility.wheelchair_accessible ? '#059669' : '#dc2626' }}>
                      ♿ {road.accessibility.wheelchair_accessible ? 'Wheelchair OK' : 'Not Accessible'}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                    Environmental Risks:
                  </div>
                  <div style={{ fontSize: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                    <span style={{ color: road.environmental_factors.flood_risk ? '#dc2626' : '#059669' }}>
                      💧 {road.environmental_factors.flood_risk ? 'Flood Risk' : 'No Flood Risk'}
                    </span>
                    <span style={{ color: road.environmental_factors.monsoon_affected ? '#dc2626' : '#059669' }}>
                      🌧️ {road.environmental_factors.monsoon_affected ? 'Monsoon Impact' : 'Weather Safe'}
                    </span>
                    <span style={{ color: road.environmental_factors.heat_damage ? '#dc2626' : '#059669' }}>
                      🔥 {road.environmental_factors.heat_damage ? 'Heat Damage' : 'Heat Safe'}
                    </span>
                    <span style={{ color: road.environmental_factors.earthquake_damage ? '#dc2626' : '#059669' }}>
                      ⚡ {road.environmental_factors.earthquake_damage ? 'Earthquake Risk' : 'Seismic Safe'}
                    </span>
                  </div>
                </div>

                <div style={{ 
                  marginTop: '8px', 
                  fontSize: '10px', 
                  color: '#9ca3af',
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '6px'
                }}>
                  Last Updated: {new Date(road.last_updated).toLocaleString()}
                </div>
              </div>
            </Popup>
          </Polyline>
          
          {/* Road Start Marker */}
          {road.coordinates.length > 0 && (
            <Marker
              position={road.coordinates[0]}
              icon={createRoadMarker(road)}
            >
              <Popup>
                <div style={{ color: 'black', padding: '8px' }}>
                  <strong>{road.name}</strong><br />
                  <span style={{ color: roadQualityService.getQualityColor(road.quality) }}>
                    {road.quality.toUpperCase().replace('_', ' ')} CONDITION
                  </span>
                </div>
              </Popup>
            </Marker>
          )}
        </div>
      ))}
    </MapContainer>
  );
}