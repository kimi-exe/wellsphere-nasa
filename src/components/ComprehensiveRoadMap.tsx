'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup } from 'react-leaflet';
import { overpassRoadService, type RealRoadSegment } from '../services/overpassRoadService';

interface ComprehensiveRoadMapProps {
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

export default function ComprehensiveRoadMap({ 
  center = [23.8103, 90.4125], // Dhaka center
  zoom = 12,
  selectedCity = 'Dhaka',
  bounds,
  showFilters = {
    excellent: true,
    good: true,
    fair: true,
    poor: true,
    very_poor: true
  }
}: ComprehensiveRoadMapProps) {
  const [roads, setRoads] = useState<RealRoadSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

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
    const loadRoads = async () => {
      if (!isClient) return;
      
      try {
        setLoading(true);
        let roadData: RealRoadSegment[];
        
        if (bounds) {
          roadData = await overpassRoadService.fetchRoadsFromOverpass(bounds);
        } else {
          roadData = await overpassRoadService.getRoadsForCity(selectedCity);
        }
        
        console.log(`Loaded ${roadData.length} road segments for ${selectedCity}`);
        setRoads(roadData);
      } catch (error) {
        console.error('Error loading road data:', error);
        setRoads([]);
      } finally {
        setLoading(false);
      }
    };

    loadRoads();
  }, [isClient, selectedCity, bounds]);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-white">Initializing map...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-white">
          <div className="mb-2">Loading comprehensive road network...</div>
          <div className="text-sm text-gray-400">Fetching real road data from OpenStreetMap</div>
        </div>
      </div>
    );
  }

  // Filter roads based on quality filters
  const filteredRoads = roads.filter(road => {
    return showFilters[road.quality] !== false;
  });

  const roadStats = {
    total: roads.length,
    shown: filteredRoads.length,
    excellent: roads.filter(r => r.quality === 'excellent').length,
    good: roads.filter(r => r.quality === 'good').length,
    fair: roads.filter(r => r.quality === 'fair').length,
    poor: roads.filter(r => r.quality === 'poor').length,
    very_poor: roads.filter(r => r.quality === 'very_poor').length,
  };

  return (
    <div className="w-full h-full relative">
      {/* Road Statistics Overlay */}
      <div className="absolute top-4 right-4 z-[1000] bg-black/80 text-white p-3 rounded-lg text-xs">
        <div className="font-bold mb-2">Road Coverage</div>
        <div>Total Roads: <span className="text-blue-400">{roadStats.total}</span></div>
        <div>Displayed: <span className="text-green-400">{roadStats.shown}</span></div>
        <div className="mt-2 space-y-1">
          <div style={{color: '#00ff00'}}>● Excellent: {roadStats.excellent}</div>
          <div style={{color: '#7fff00'}}>● Good: {roadStats.good}</div>
          <div style={{color: '#ffff00'}}>● Fair: {roadStats.fair}</div>
          <div style={{color: '#ff7f00'}}>● Poor: {roadStats.poor}</div>
          <div style={{color: '#ff0000'}}>● Very Poor: {roadStats.very_poor}</div>
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full rounded-lg"
        style={{ backgroundColor: '#1a1a1a' }}
        maxZoom={18}
        minZoom={8}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={19}
        />
        
        {filteredRoads.map((road, index) => {
          // Skip roads with insufficient coordinates
          if (road.coordinates.length < 2) return null;

          const color = overpassRoadService.getQualityColor(road.quality);
          const weight = overpassRoadService.getQualityWeight(road.quality);
          
          return (
            <Polyline
              key={`${road.id}_${index}`}
              positions={road.coordinates}
              pathOptions={{
                color,
                weight: Math.max(1, weight),
                opacity: 0.8,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            >
              <Popup maxWidth={400} className="road-popup">
                <div style={{ color: 'black', padding: '10px', maxWidth: '380px', fontSize: '12px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '10px',
                    padding: '8px',
                    background: color,
                    color: road.quality === 'fair' ? 'black' : 'white',
                    borderRadius: '6px',
                    fontWeight: 'bold'
                  }}>
                    <div>
                      <div style={{ fontSize: '14px' }}>{road.name}</div>
                      <div style={{ fontSize: '11px', opacity: 0.9 }}>
                        {road.quality.toUpperCase().replace('_', ' ')} - {road.highway_type.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '10px' }}>
                    <div><strong>Score:</strong> {road.condition_score}/100</div>
                    <div><strong>Surface:</strong> {road.surface || 'Unknown'}</div>
                    <div><strong>Width:</strong> {road.width_meters}m</div>
                    <div><strong>Speed:</strong> {road.max_speed} km/h</div>
                    <div><strong>Traffic:</strong> {road.traffic_level}</div>
                    <div><strong>Status:</strong> {road.maintenance_status.replace('_', ' ')}</div>
                  </div>

                  {road.issues.length > 0 && (
                    <div style={{ 
                      background: '#fef2f2', 
                      border: '1px solid #fecaca', 
                      padding: '6px', 
                      borderRadius: '4px',
                      marginBottom: '8px'
                    }}>
                      <div style={{ fontWeight: 'bold', color: '#dc2626', marginBottom: '3px', fontSize: '11px' }}>
                        ⚠️ Issues:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '12px', fontSize: '10px', color: '#991b1b' }}>
                        {road.issues.slice(0, 3).map((issue, index) => (
                          <li key={index}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '3px' }}>
                      Accessibility:
                    </div>
                    <div style={{ fontSize: '10px', display: 'flex', gap: '8px' }}>
                      <span style={{ color: road.accessibility.vehicle_accessible ? '#059669' : '#dc2626' }}>
                        🚗 {road.accessibility.vehicle_accessible ? 'OK' : 'No'}
                      </span>
                      <span style={{ color: road.accessibility.emergency_access ? '#059669' : '#dc2626' }}>
                        🚑 {road.accessibility.emergency_access ? 'OK' : 'No'}
                      </span>
                      <span style={{ color: road.accessibility.wheelchair_accessible ? '#059669' : '#dc2626' }}>
                        ♿ {road.accessibility.wheelchair_accessible ? 'OK' : 'No'}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '3px' }}>
                      Environmental Risks:
                    </div>
                    <div style={{ fontSize: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
                      <span style={{ color: road.environmental_risks.flood_prone ? '#dc2626' : '#059669' }}>
                        💧 {road.environmental_risks.flood_prone ? 'Flood Risk' : 'Safe'}
                      </span>
                      <span style={{ color: road.environmental_risks.monsoon_affected ? '#dc2626' : '#059669' }}>
                        🌧️ {road.environmental_risks.monsoon_affected ? 'Monsoon' : 'Safe'}
                      </span>
                      <span style={{ color: road.environmental_risks.heat_damage ? '#dc2626' : '#059669' }}>
                        🔥 {road.environmental_risks.heat_damage ? 'Heat Risk' : 'Safe'}
                      </span>
                      <span style={{ color: road.environmental_risks.earthquake_risk ? '#dc2626' : '#059669' }}>
                        ⚡ {road.environmental_risks.earthquake_risk ? 'Quake Risk' : 'Safe'}
                      </span>
                    </div>
                  </div>

                  <div style={{ 
                    fontSize: '9px', 
                    color: '#6b7280',
                    borderTop: '1px solid #e5e7eb',
                    paddingTop: '6px',
                    marginTop: '8px'
                  }}>
                    Road ID: {road.id}<br/>
                    Last Updated: {new Date(road.last_updated).toLocaleString()}
                  </div>
                </div>
              </Popup>
            </Polyline>
          );
        })}
      </MapContainer>
      
      {roads.length === 0 && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">No road data available</div>
            <div className="text-sm text-gray-300">Try selecting a different city or area</div>
          </div>
        </div>
      )}
    </div>
  );
}