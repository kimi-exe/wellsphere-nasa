'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Polyline, Popup, useMap } from 'react-leaflet';
import { fastRoadService, type FastRoadSegment } from '../services/fastRoadService';

interface FastRoadMapProps {
  center?: [number, number];
  zoom?: number;
  selectedCity?: string;
  showFilters?: {
    excellent?: boolean;
    good?: boolean;
    fair?: boolean;
    poor?: boolean;
    very_poor?: boolean;
  };
}

// Level of Detail component - only renders roads based on zoom level
function LODRoadRenderer({ roads, zoom, showFilters }: { 
  roads: FastRoadSegment[]; 
  zoom: number; 
  showFilters: FastRoadMapProps['showFilters'];
}) {
  const map = useMap();
  
  const visibleRoads = useMemo(() => {
    // Performance optimization: Only render roads based on zoom level
    let filteredRoads = roads;
    
    // Filter by quality
    if (showFilters) {
      filteredRoads = roads.filter(road => showFilters[road.quality] !== false);
    }
    
    // Level of Detail filtering based on zoom
    if (zoom < 10) {
      // Low zoom: Only show major roads
      filteredRoads = filteredRoads.filter(road => 
        ['motorway', 'trunk', 'primary'].includes(road.highway_type)
      );
    } else if (zoom < 12) {
      // Medium zoom: Show major and secondary roads
      filteredRoads = filteredRoads.filter(road => 
        ['motorway', 'trunk', 'primary', 'secondary'].includes(road.highway_type)
      );
    } else if (zoom < 14) {
      // High zoom: Show all except paths
      filteredRoads = filteredRoads.filter(road => 
        road.highway_type !== 'path'
      );
    }
    // At zoom >= 14, show all roads
    
    // Limit total roads for performance (show only first N roads)
    const maxRoads = zoom < 10 ? 50 : zoom < 12 ? 200 : zoom < 14 ? 800 : 2000;
    return filteredRoads.slice(0, maxRoads);
  }, [roads, zoom, showFilters]);

  return (
    <>
      {visibleRoads.map((road, index) => {
        // Skip roads with insufficient coordinates
        if (road.coordinates.length < 2) return null;

        // Dynamic weight based on zoom level
        const dynamicWeight = Math.max(1, road.weight * (zoom / 12));
        
        return (
          <Polyline
            key={`${road.id}_${zoom}`}
            positions={road.coordinates}
            pathOptions={{
              color: road.color,
              weight: dynamicWeight,
              opacity: zoom < 10 ? 0.9 : 0.7,
              lineCap: 'round',
              lineJoin: 'round'
            }}
            eventHandlers={{
              click: () => {
                // Only show popups at higher zoom levels for performance
                if (zoom >= 12) {
                  // Popup will be handled by the Popup component
                }
              }
            }}
          >
            {/* Only show popups at high zoom levels */}
            {zoom >= 12 && (
              <Popup maxWidth={300} className="fast-road-popup">
                <div style={{ color: 'black', padding: '8px', fontSize: '11px', maxWidth: '280px' }}>
                  <div style={{ 
                    background: road.color,
                    color: road.quality === 'fair' ? 'black' : 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    marginBottom: '6px'
                  }}>
                    {road.name}
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '10px' }}>
                    <div><strong>Quality:</strong> {road.quality}</div>
                    <div><strong>Type:</strong> {road.highway_type}</div>
                    <div><strong>Score:</strong> {road.condition_score}</div>
                    <div><strong>Traffic:</strong> {road.traffic_level}</div>
                    <div><strong>Surface:</strong> {road.surface}</div>
                  </div>

                  {road.issues.length > 0 && (
                    <div style={{ marginTop: '6px', fontSize: '9px' }}>
                      <strong style={{ color: '#dc2626' }}>Issues:</strong>
                      <div style={{ color: '#666' }}>
                        {road.issues.slice(0, 2).join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              </Popup>
            )}
          </Polyline>
        );
      })}
    </>
  );
}

export default function FastRoadMap({ 
  center = [23.8103, 90.4125],
  zoom = 11,
  selectedCity = 'Dhaka',
  showFilters = {
    excellent: true,
    good: true,
    fair: true,
    poor: true,
    very_poor: true
  }
}: FastRoadMapProps) {
  const [roads, setRoads] = useState<FastRoadSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [stats, setStats] = useState<any>(null);

  // Optimize Leaflet setup
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

  // Super fast data loading - no API calls!
  useEffect(() => {
    const loadRoads = async () => {
      if (!isClient) return;
      
      try {
        setLoading(true);
        
        // Instant data loading - no API calls, no processing delays
        const [roadData, cityStats] = await Promise.all([
          fastRoadService.getRoadsForCity(selectedCity),
          fastRoadService.getCityStats(selectedCity)
        ]);
        
        console.log(`⚡ FAST LOAD: ${roadData.length} roads for ${selectedCity} loaded instantly!`);
        
        setRoads(roadData);
        setStats(cityStats);
        
        // Update center based on city
        const cityCenter = fastRoadService.getCityCenter(selectedCity);
        if (cityCenter) {
          center = cityCenter;
        }
        
      } catch (error) {
        console.error('Error loading road data:', error);
        setRoads([]);
      } finally {
        setLoading(false);
      }
    };

    loadRoads();
  }, [isClient, selectedCity]);

  // Memoized filtered roads count for stats
  const filteredStats = useMemo(() => {
    if (!stats) return null;
    
    const visibleQualities = Object.keys(showFilters).filter(q => showFilters[q as keyof typeof showFilters]);
    const visibleCount = visibleQualities.reduce((sum, quality) => {
      return sum + (stats[quality as keyof typeof stats] || 0);
    }, 0);
    
    return {
      ...stats,
      visible: visibleCount
    };
  }, [stats, showFilters]);

  // Zoom change handler
  const handleZoomChange = useCallback((zoom: number) => {
    setCurrentZoom(zoom);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-white">⚡ Initializing fast map...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-white">
          <div className="mb-2">⚡ Loading optimized road network...</div>
          <div className="text-sm text-gray-400">Fast pre-computed data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* Performance Stats Overlay */}
      <div className="absolute top-4 right-4 z-[1000] bg-green-600/90 text-white p-3 rounded-lg text-xs">
        <div className="font-bold mb-2 text-green-100">⚡ FAST MODE</div>
        <div>City: <span className="text-green-200">{selectedCity}</span></div>
        <div>Total Roads: <span className="text-green-200">{stats?.total || 0}</span></div>
        <div>Showing: <span className="text-green-200">{filteredStats?.visible || 0}</span></div>
        <div>Zoom: <span className="text-green-200">{currentZoom}</span></div>
        <div className="mt-2 text-[10px] text-green-300">
          LOD Active • No API Calls
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full rounded-lg"
        style={{ backgroundColor: '#1a1a1a' }}
        maxZoom={18}
        minZoom={8}
        zoomControl={true}
        attributionControl={false}
        preferCanvas={true} // Use Canvas for better performance
        eventHandlers={{
          zoomend: (e) => {
            handleZoomChange(e.target.getZoom());
          }
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
          maxZoom={19}
          // Performance optimizations
          updateWhenZooming={false}
          updateWhenIdle={true}
          keepBuffer={2}
        />
        
        {/* Level of Detail Road Renderer */}
        <LODRoadRenderer 
          roads={roads} 
          zoom={currentZoom} 
          showFilters={showFilters}
        />
      </MapContainer>
      
      {/* Quick Quality Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-black/80 text-white p-2 rounded text-xs">
        <div className="grid grid-cols-5 gap-2">
          <div style={{color: '#00ff00'}}>● Excellent</div>
          <div style={{color: '#7fff00'}}>● Good</div>
          <div style={{color: '#ffff00'}}>● Fair</div>
          <div style={{color: '#ff7f00'}}>● Poor</div>
          <div style={{color: '#ff0000'}}>● V.Poor</div>
        </div>
      </div>
      
      {roads.length === 0 && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">No road data available</div>
            <div className="text-sm text-gray-300">Try selecting a different city</div>
          </div>
        </div>
      )}
    </div>
  );
}