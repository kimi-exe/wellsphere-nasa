'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { environmentalDataService, type EnvironmentalDataPoint } from '../services/environmentalDataService';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Thermometer, 
  Droplets, 
  Mountain, 
  Activity,
  AlertTriangle,
  Eye,
  EyeOff,
  Layers,
  RotateCcw,
  RefreshCw,
  Clock,
  Wifi,
  Database
} from 'lucide-react';
import FallbackMap from './FallbackMap';

// Dynamic import for Leaflet to avoid SSR issues
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-900 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-2"></div>
        <div className="text-white">Loading Map...</div>
      </div>
    </div>
  )
});




function getUnitForType(type: string): string {
  switch (type) {
    case 'heatwave': return '°C';
    case 'flood': return 'm';
    case 'soil': return ' pH';
    case 'earthquake': return ' mag';
    default: return '';
  }
}

function getIconForType(type: string) {
  switch (type) {
    case 'heatwave': return Thermometer;
    case 'flood': return Droplets;
    case 'soil': return Mountain;
    case 'earthquake': return Activity;
    default: return MapPin;
  }
}

interface EnvironmentalMapProps {
  selectedLocation?: string;
}

export default function EnvironmentalMap({ selectedLocation }: EnvironmentalMapProps) {
  const [visibleLayers, setVisibleLayers] = useState({
    heatwave: true,
    flood: true,
    soil: true,
    earthquake: true
  });
  
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    23.6850, // Center of Bangladesh
    90.3563
  ]);
  
  const [zoom, setZoom] = useState(7);
  const [useFallback, setUseFallback] = useState(false);
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [dataStats, setDataStats] = useState<{
    total: number;
    bySeverity: Record<string, number>;
    byType: Record<string, number>;
    bySource: Record<string, number>;
  } | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Load environmental data on component mount
  useEffect(() => {
    loadEnvironmentalData();
  }, []);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing environmental data...');
      loadEnvironmentalData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const loadEnvironmentalData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading environmental data...');
      
      // Check for cached data first
      const cached = environmentalDataService.getCachedData();
      if (cached) {
        setEnvironmentalData(cached);
        setLoading(false);
        setLastUpdate(new Date());
        return;
      }
      
      // Fetch fresh data
      const data = await environmentalDataService.getAllEnvironmentalData();
      const stats = environmentalDataService.getDataStatistics(data);
      
      setEnvironmentalData(data);
      setDataStats(stats);
      setLastUpdate(new Date());
      console.log(`✅ Loaded ${data.length} environmental data points`);
      console.log('📊 Data statistics:', stats);
    } catch (error) {
      console.error('❌ Error loading environmental data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await loadEnvironmentalData();
  };

  const layerTypes = [
    { key: 'heatwave', label: 'Heatwave', icon: Thermometer, color: '#f97316' },
    { key: 'flood', label: 'Flood', icon: Droplets, color: '#3b82f6' },
    { key: 'soil', label: 'Soil Quality', icon: Mountain, color: '#a855f7' },
    { key: 'earthquake', label: 'Earthquake', icon: Activity, color: '#ef4444' }
  ];

  const toggleLayer = (layerKey: string) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  const resetView = () => {
    setMapCenter([23.6850, 90.3563]);
    setZoom(7);
  };

  // Filter data based on selected location
  const filteredData = selectedLocation 
    ? environmentalData.filter(point => 
        // Simple location matching - in a real app, you'd have proper location boundaries
        selectedLocation.includes('Dhaka') ? point.lat > 23.7 && point.lat < 23.9 :
        selectedLocation.includes('Chittagong') ? point.lat > 22.2 && point.lat < 22.4 :
        selectedLocation.includes('Sylhet') ? point.lat > 24.7 && point.lat < 25.0 :
        selectedLocation.includes('Rajshahi') ? point.lat > 24.2 && point.lat < 24.4 :
        selectedLocation.includes('Khulna') ? point.lat > 22.7 && point.lat < 22.9 :
        selectedLocation.includes('Barisal') ? point.lat > 22.6 && point.lat < 22.8 :
        true
      )
    : environmentalData;


  const dangerZoneCount = filteredData.filter(point => 
    point.severity === 'high' || point.severity === 'critical'
  ).length;

  return (
    <div className="relative w-full h-full bg-black rounded-xl overflow-hidden">
      {/* Map Controls */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 left-4 z-30 space-y-2 max-w-xs"
      >
        {/* Layer Toggle Controls */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 space-y-2 min-w-[200px]">
          <div className="flex items-center space-x-2 mb-2">
            <Layers className="text-cyan-400" size={16} />
            <span className="text-white text-sm font-medium">Map Layers</span>
          </div>
          
          {layerTypes.map((layer) => {
            const IconComponent = layer.icon;
            const count = dataStats?.byType[layer.key] || 0;
            return (
              <motion.button
                key={layer.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleLayer(layer.key)}
                className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors border ${
                  visibleLayers[layer.key]
                    ? 'bg-white/20 text-white border-white/30 shadow-lg'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <IconComponent size={16} style={{ color: visibleLayers[layer.key] ? layer.color : '#9ca3af' }} />
                  <span className="text-sm font-medium">{layer.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {count > 0 && (
                    <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full">
                      {count}
                    </span>
                  )}
                  {visibleLayers[layer.key] ? (
                    <Eye size={14} className="text-green-400" />
                  ) : (
                    <EyeOff size={14} className="text-gray-500" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Reset View Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetView}
          className="bg-white/10 backdrop-blur-lg rounded-lg p-3 flex items-center space-x-2 text-white hover:bg-white/20 transition-colors"
        >
          <RotateCcw size={16} />
          <span className="text-sm">Reset View</span>
        </motion.button>

        {/* Refresh Data Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={refreshData}
          disabled={loading}
          className="bg-white/10 backdrop-blur-lg rounded-lg p-3 flex items-center space-x-2 text-white hover:bg-white/20 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span className="text-sm">{loading ? 'Loading...' : 'Refresh Data'}</span>
        </motion.button>

        {/* Auto-refresh Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`bg-white/10 backdrop-blur-lg rounded-lg p-3 flex items-center space-x-2 text-white hover:bg-white/20 transition-colors ${
            autoRefresh ? 'ring-2 ring-green-400' : ''
          }`}
        >
          <Wifi size={16} className={autoRefresh ? 'text-green-400' : ''} />
          <span className="text-sm">{autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}</span>
        </motion.button>

        {/* Map Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setUseFallback(!useFallback)}
          className={`bg-white/10 backdrop-blur-lg rounded-lg p-3 flex items-center space-x-2 text-white hover:bg-white/20 transition-colors ${
            useFallback ? 'ring-2 ring-cyan-400' : ''
          }`}
        >
          <MapPin size={16} />
          <span className="text-sm">{useFallback ? 'Fallback' : 'OpenStreetMap'}</span>
        </motion.button>
      </motion.div>

      {/* Danger Zone Alert */}
      {dangerZoneCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute top-4 right-4 z-30"
        >
          <div className="bg-red-600/90 backdrop-blur-lg rounded-lg p-3 text-white">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="text-yellow-400 animate-pulse" size={20} />
              <div>
                <p className="font-semibold text-sm">Danger Zones Active</p>
                <p className="text-xs opacity-90">{dangerZoneCount} high-risk areas detected</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Map Legend and Data Info */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="absolute bottom-4 right-4 z-30 space-y-2 max-w-xs"
      >
        {/* Data Statistics */}
        {dataStats && (
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3">
            <div className="text-white text-sm font-medium mb-2 flex items-center space-x-2">
              <Database size={14} />
              <span>Data Coverage</span>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-300">
                <span className="font-medium text-cyan-400">{dataStats.total}</span> total data points
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="text-red-400">Critical: {dataStats.bySeverity.critical}</div>
                <div className="text-orange-400">High: {dataStats.bySeverity.high}</div>
                <div className="text-yellow-400">Medium: {dataStats.bySeverity.medium}</div>
                <div className="text-green-400">Low: {dataStats.bySeverity.low}</div>
              </div>
            </div>
          </div>
        )}

        {/* Data Source Info */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3">
          <div className="text-white text-sm font-medium mb-2 flex items-center space-x-2">
            <Wifi size={14} className={autoRefresh ? 'text-green-400' : 'text-gray-400'} />
            <span>Live Data Sources</span>
          </div>
          <div className="space-y-1">
            {dataStats && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">USGS Earthquakes</span>
                  </div>
                  <span className="text-xs text-green-400">{dataStats.bySource.USGS || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">NASA Earth Data</span>
                  </div>
                  <span className="text-xs text-blue-400">{dataStats.bySource.NASA || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">NOAA Weather</span>
                  </div>
                  <span className="text-xs text-yellow-400">{dataStats.bySource.NOAA || 0}</span>
                </div>
              </>
            )}
            {lastUpdate && (
              <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-white/20">
                <Clock size={12} />
                <span className="text-xs text-gray-400">
                  Updated: {lastUpdate.toLocaleTimeString()}
                </span>
                {autoRefresh && (
                  <span className="text-xs text-green-400 ml-1">(Auto)</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Severity Legend */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3">
          <div className="text-white text-sm font-medium mb-2">Severity Levels</div>
          {[
            { level: 'Critical', color: '#dc2626', description: 'Immediate danger' },
            { level: 'High', color: '#f97316', description: 'High risk zone' },
            { level: 'Medium', color: '#f59e0b', description: 'Moderate concern' },
            { level: 'Low', color: '#22c55e', description: 'Normal conditions' }
          ].map((severity) => (
            <div key={severity.level} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: severity.color }}
              />
              <div className="text-xs text-white">
                <span className="font-medium">{severity.level}</span>
                <span className="text-gray-300 ml-1">- {severity.description}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center z-40">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center max-w-sm mx-4">
            <RefreshCw className="animate-spin mx-auto mb-4 text-cyan-400" size={32} />
            <p className="text-white font-medium">Fetching Environmental Data</p>
            <p className="text-gray-300 text-sm mt-1">Loading from NASA, USGS, and NOAA APIs...</p>
            {dataStats && (
              <div className="mt-3 text-xs text-gray-400">
                Last loaded: {dataStats.total} data points
              </div>
            )}
          </div>
        </div>
      )}

      {/* Map Component */}
      <div className="absolute inset-0 z-10">
        {useFallback ? (
          <FallbackMap 
            data={filteredData}
            visibleLayers={visibleLayers}
          />
        ) : (
          <LeafletMap 
            center={mapCenter}
            zoom={zoom}
            data={filteredData}
            visibleLayers={visibleLayers}
          />
        )}
      </div>
    </div>
  );
}