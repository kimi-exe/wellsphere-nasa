'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { DivIcon, LatLngBounds } from 'leaflet';
import { flightTrackingService, type AircraftState, type FlightBounds, type FlightStats } from '../services/flightTrackingService';

interface FlightTrackerProps {
  center?: [number, number];
  zoom?: number;
  bounds?: FlightBounds;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

// Map events handler for bound changes and zoom
function MapEvents({ 
  onBoundsChange, 
  onZoomChange 
}: { 
  onBoundsChange: (bounds: FlightBounds) => void;
  onZoomChange: (zoom: number) => void;
}) {
  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      onBoundsChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      });
    },
    zoomend: () => {
      onZoomChange(map.getZoom());
    },
  });
  return null;
}

// Create airplane icon
const createAirplaneIcon = (aircraft: AircraftState, size: number, color: string) => {
  const rotation = flightTrackingService.getAircraftRotation(aircraft);
  
  return new DivIcon({
    html: `
      <div style="
        transform: rotate(${rotation}deg);
        transform-origin: center;
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${size}px;
        height: ${size}px;
        color: ${color};
        filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
        pointer-events: auto;
      ">
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      </div>
    `,
    className: 'flight-marker',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  });
};

// Aircraft marker component
function AircraftMarker({ 
  aircraft, 
  zoomLevel 
}: { 
  aircraft: AircraftState; 
  zoomLevel: number;
}) {
  const color = flightTrackingService.getAircraftColor(aircraft);
  const size = flightTrackingService.getAircraftSize(zoomLevel);
  const info = flightTrackingService.formatAircraftInfo(aircraft);

  if (aircraft.latitude === null || aircraft.longitude === null) {
    return null;
  }

  return (
    <Marker
      position={[aircraft.latitude, aircraft.longitude]}
      icon={createAirplaneIcon(aircraft, size, color)}
    >
      <Popup maxWidth={350} className="flight-popup">
        <div style={{ color: 'black', padding: '12px', fontSize: '12px' }}>
          {/* Header */}
          <div style={{ 
            background: color,
            color: aircraft.on_ground ? 'black' : 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontWeight: 'bold',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
              <div>
                <div style={{ fontSize: '14px' }}>{info.title}</div>
                <div style={{ fontSize: '10px', opacity: 0.9 }}>
                  {aircraft.on_ground ? '🛬 ON GROUND' : '✈️ IN FLIGHT'}
                </div>
              </div>
            </div>
            <div style={{ 
              background: 'rgba(0,0,0,0.2)', 
              padding: '2px 6px', 
              borderRadius: '4px',
              fontSize: '10px'
            }}>
              LIVE
            </div>
          </div>
          
          {/* Flight Details */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '8px',
            marginBottom: '12px'
          }}>
            {info.details.map((detail, index) => (
              <div key={index} style={{ fontSize: '11px' }}>
                <strong style={{ color: '#374151' }}>{detail.label}:</strong>
                <div style={{ color: '#6B7280' }}>{detail.value}</div>
              </div>
            ))}
          </div>

          {/* Position Info */}
          <div style={{ 
            background: '#f3f4f6', 
            padding: '8px', 
            borderRadius: '4px',
            fontSize: '10px',
            marginBottom: '8px'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Position:</div>
            <div>Lat: {aircraft.latitude?.toFixed(4)}°</div>
            <div>Lng: {aircraft.longitude?.toFixed(4)}°</div>
          </div>

          {/* Vertical Rate */}
          {aircraft.vertical_rate !== null && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              fontSize: '10px',
              color: aircraft.vertical_rate > 0 ? '#059669' : aircraft.vertical_rate < 0 ? '#DC2626' : '#6B7280'
            }}>
              {aircraft.vertical_rate > 0 ? '📈' : aircraft.vertical_rate < 0 ? '📉' : '➡️'}
              <span style={{ marginLeft: '4px' }}>
                Vertical Rate: {aircraft.vertical_rate > 0 ? '+' : ''}{Math.round(aircraft.vertical_rate)} m/s
              </span>
            </div>
          )}

          {/* Last Update */}
          <div style={{ 
            marginTop: '8px', 
            fontSize: '9px', 
            color: '#9CA3AF',
            borderTop: '1px solid #E5E7EB',
            paddingTop: '6px'
          }}>
            Last Contact: {new Date(aircraft.last_contact * 1000).toLocaleTimeString()}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default function FlightTracker({ 
  center = [20.0, 20.0], // Global center for worldwide view
  zoom = 3, // Lower zoom for global view
  bounds,
  autoRefresh = true,
  refreshInterval = 30000 // 30 seconds
}: FlightTrackerProps) {
  const [aircraft, setAircraft] = useState<AircraftState[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [currentBounds, setCurrentBounds] = useState<FlightBounds | null>(bounds || null);
  const [stats, setStats] = useState<FlightStats | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Initialize client-side Leaflet
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

  // Load aircraft data
  const loadAircraftData = useCallback(async () => {
    if (!isClient) return;

    try {
      setError(null);
      console.log('🔄 Loading aircraft data...');
      
      let aircraftData: AircraftState[];
      
      if (currentBounds) {
        // Load aircraft in specific bounds for better performance
        aircraftData = await flightTrackingService.getAircraftInBounds(currentBounds);
      } else {
        // Load all aircraft (may be slower)
        aircraftData = await flightTrackingService.getAllAircraft();
      }

      // Filter by zoom level for performance
      if (currentZoom < 6) {
        // Only show aircraft above 10,000m at very low zoom
        aircraftData = flightTrackingService.filterByAltitude(aircraftData, 10000);
      } else if (currentZoom < 8) {
        // Only show aircraft above 5,000m at low zoom
        aircraftData = flightTrackingService.filterByAltitude(aircraftData, 5000);
      }

      setAircraft(aircraftData);
      setStats(flightTrackingService.getFlightStats(aircraftData));
      setLastUpdate(new Date());
      
      console.log(`✈️ Loaded ${aircraftData.length} aircraft`);
    } catch (error: any) {
      console.error('Failed to load aircraft:', error);
      setError(error.message || 'Failed to load flight data');
    } finally {
      setLoading(false);
    }
  }, [isClient, currentBounds, currentZoom]);

  // Initial load and auto-refresh setup
  useEffect(() => {
    if (!isClient) return;

    loadAircraftData();

    if (autoRefresh) {
      const startRefresh = () => {
        refreshTimeoutRef.current = setTimeout(() => {
          loadAircraftData();
          startRefresh(); // Schedule next refresh
        }, refreshInterval);
      };

      startRefresh();
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [isClient, autoRefresh, refreshInterval, loadAircraftData]);

  // Handle map bound changes
  const handleBoundsChange = useCallback((newBounds: FlightBounds) => {
    setCurrentBounds(newBounds);
  }, []);

  // Handle zoom changes
  const handleZoomChange = useCallback((newZoom: number) => {
    setCurrentZoom(newZoom);
  }, []);

  // Visible aircraft based on zoom level (for performance)
  const visibleAircraft = useMemo(() => {
    let filtered = aircraft;
    
    // Limit aircraft count based on zoom level for performance
    const maxAircraft = currentZoom < 6 ? 50 : currentZoom < 8 ? 200 : currentZoom < 10 ? 500 : 1000;
    
    return filtered.slice(0, maxAircraft);
  }, [aircraft, currentZoom]);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-white">✈️ Initializing flight radar...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* Flight Statistics Overlay */}
      <div className="absolute top-4 left-4 z-[1000] bg-blue-600/90 text-white p-3 rounded-lg text-xs">
        <div className="font-bold mb-2 text-blue-100">
          ✈️ {(flightTrackingService as any).useMockData ? 'DEMO' : 'LIVE'} FLIGHT RADAR
        </div>
        {stats && (
          <>
            <div>Total Aircraft: <span className="text-blue-200">{stats.total}</span></div>
            <div>In Air: <span className="text-green-300">{stats.in_air}</span></div>
            <div>On Ground: <span className="text-orange-300">{stats.on_ground}</span></div>
            <div>Showing: <span className="text-blue-200">{visibleAircraft.length}</span></div>
          </>
        )}
        <div>Zoom: <span className="text-blue-200">{currentZoom}</span></div>
        <div className="text-[10px] text-blue-300">
          Source: {(flightTrackingService as any).useMockData ? 'Demo Data' : 'OpenSky API'}
        </div>
        {lastUpdate && (
          <div className="mt-1 text-[10px] text-blue-300">
            Updated: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="absolute top-4 right-4 z-[1000] flex space-x-2">
        {/* Data Source Toggle */}
        <button
          onClick={() => {
            const currentUseMock = (flightTrackingService as any).useMockData;
            flightTrackingService.setUseMockData(!currentUseMock);
            setLoading(true);
            loadAircraftData();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg text-xs font-medium shadow-lg flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Switch to {(flightTrackingService as any).useMockData ? 'Live' : 'Demo'}
        </button>

        {/* Manual Refresh Button */}
        <button
          onClick={() => {
            setLoading(true);
            loadAircraftData();
          }}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white p-3 rounded-lg text-xs font-medium shadow-lg flex items-center"
        >
          <svg 
            className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="absolute top-20 left-4 z-[1000] bg-red-600/90 text-white p-3 rounded-lg text-xs max-w-md">
          <div className="font-bold mb-1">⚠️ Error</div>
          <div>{error}</div>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full rounded-lg"
        style={{ backgroundColor: '#1a1a1a' }}
        maxZoom={18}
        minZoom={3}
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap | Flight data: OpenSky Network'
          maxZoom={19}
        />
        
        {/* Map Events Handler */}
        <MapEvents 
          onBoundsChange={handleBoundsChange}
          onZoomChange={handleZoomChange}
        />
        
        {/* Aircraft Markers */}
        {visibleAircraft.map((aircraftItem) => (
          <AircraftMarker
            key={aircraftItem.icao24}
            aircraft={aircraftItem}
            zoomLevel={currentZoom}
          />
        ))}
      </MapContainer>
      
      {/* Altitude Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-black/80 text-white p-2 rounded text-xs">
        <div className="font-bold mb-2">Altitude Legend</div>
        <div className="grid grid-cols-1 gap-1 text-[10px]">
          <div style={{color: '#4169E1'}}>● &gt;20,000m (Very High)</div>
          <div style={{color: '#87CEEB'}}>● 15,000-20,000m (High)</div>
          <div style={{color: '#90EE90'}}>● 10,000-15,000m (Medium-High)</div>
          <div style={{color: '#FFD700'}}>● 6,000-10,000m (Medium)</div>
          <div style={{color: '#FFA500'}}>● 3,000-6,000m (Medium-Low)</div>
          <div style={{color: '#FF6347'}}>● 1,000-3,000m (Low)</div>
          <div style={{color: '#FF4500'}}>● &lt;1,000m (Very Low)</div>
          <div style={{color: '#8B4513'}}>● Ground</div>
        </div>
      </div>
      
      {/* Loading Overlay */}
      {loading && aircraft.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white z-[1000]">
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">🛩️ Loading Flight Data</div>
            <div className="text-sm text-gray-300">Fetching live aircraft positions from OpenSky Network</div>
            <div className="mt-2 text-xs text-gray-400">This may take a few seconds...</div>
          </div>
        </div>
      )}
      
      {/* No Data Message */}
      {!loading && aircraft.length === 0 && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white z-[1000]">
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">No Aircraft Found</div>
            <div className="text-sm text-gray-300">No flights detected in this area</div>
            <div className="text-xs text-gray-400 mt-2">Try zooming out or refreshing</div>
          </div>
        </div>
      )}
    </div>
  );
}