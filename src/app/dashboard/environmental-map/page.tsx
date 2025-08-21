'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapIcon,
  Satellite,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Filter,
  Download,
  Share2,
  Info
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EnvironmentalMap from '@/components/EnvironmentalMap';

interface EnvironmentalData {
  id: string;
  lat: number;
  lng: number;
  type: 'heatwave' | 'flood' | 'soil' | 'earthquake';
  severity: 'low' | 'medium' | 'high' | 'critical';
  value: number;
  description: string;
  timestamp: string;
  source: string;
}

interface ApiResponse {
  success: boolean;
  data: EnvironmentalData[];
  stats: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    byType: Record<string, number>;
  };
  location: string;
  timestamp: string;
  sources: string[];
}

export default function EnvironmentalMapPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [mapData, setMapData] = useState<EnvironmentalData[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (!stored) {
      router.push('/');
      return;
    }
    const user = JSON.parse(stored);
    setUserInfo(user);
    setSelectedLocation(user.location || 'all');
  }, [router]);

  const fetchMapData = async (location: string = selectedLocation, includeRealtime: boolean = realtimeEnabled) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/environmental-map?location=${encodeURIComponent(location)}&realtime=${includeRealtime}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch environmental data');
      }
      
      setMapData(result.data);
      setStats(result.stats);
      setLastUpdated(result.timestamp);
      
    } catch (err) {
      console.error('Error fetching map data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchMapData();
    }
  }, [userInfo, selectedLocation, realtimeEnabled]);

  // Auto-refresh every 5 minutes when realtime is enabled
  useEffect(() => {
    if (!realtimeEnabled) return;
    
    const interval = setInterval(() => {
      fetchMapData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [realtimeEnabled, selectedLocation]);

  const bangladeshDivisions = [
    { value: 'all', label: 'All Bangladesh' },
    { value: 'Dhaka', label: 'Dhaka' },
    { value: 'Chittagong', label: 'Chittagong' },
    { value: 'Sylhet', label: 'Sylhet' },
    { value: 'Rajshahi', label: 'Rajshahi' },
    { value: 'Khulna', label: 'Khulna' },
    { value: 'Barisal', label: 'Barisal' },
    { value: 'Rangpur', label: 'Rangpur' },
    { value: 'Mymensingh', label: 'Mymensingh' }
  ];

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const dangerZones = mapData.filter(d => d.severity === 'high' || d.severity === 'critical');

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                ← Dashboard
              </Link>
              <div className="flex items-center space-x-2">
                <MapIcon className="text-red-400" size={24} />
                <h1 className="text-2xl font-bold">Environmental Risk Map</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Location Selector */}
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
              >
                {bangladeshDivisions.map((division) => (
                  <option key={division.value} value={division.value} className="bg-gray-900">
                    {division.label}
                  </option>
                ))}
              </select>

              {/* Realtime Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRealtimeEnabled(!realtimeEnabled)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  realtimeEnabled
                    ? 'bg-green-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Satellite size={14} />
                  <span>Real-time</span>
                </div>
              </motion.button>

              {/* Refresh Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fetchMapData()}
                disabled={loading}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {stats && (
            <>
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-xs text-gray-400">Total Data Points</div>
              </div>
              
              <div className="bg-red-600/20 backdrop-blur-lg rounded-xl p-4 text-center border border-red-500/30">
                <div className="text-2xl font-bold text-red-400">{stats.critical}</div>
                <div className="text-xs text-gray-400">Critical Alerts</div>
              </div>
              
              <div className="bg-orange-600/20 backdrop-blur-lg rounded-xl p-4 text-center border border-orange-500/30">
                <div className="text-2xl font-bold text-orange-400">{stats.high}</div>
                <div className="text-xs text-gray-400">High Risk</div>
              </div>
              
              <div className="bg-yellow-600/20 backdrop-blur-lg rounded-xl p-4 text-center border border-yellow-500/30">
                <div className="text-2xl font-bold text-yellow-400">{stats.medium}</div>
                <div className="text-xs text-gray-400">Medium Risk</div>
              </div>
              
              <div className="bg-green-600/20 backdrop-blur-lg rounded-xl p-4 text-center border border-green-500/30">
                <div className="text-2xl font-bold text-green-400">{stats.low}</div>
                <div className="text-xs text-gray-400">Low Risk</div>
              </div>

              <div className="bg-cyan-600/20 backdrop-blur-lg rounded-xl p-4 text-center border border-cyan-500/30">
                <div className="text-2xl font-bold text-cyan-400">{dangerZones.length}</div>
                <div className="text-xs text-gray-400">Danger Zones</div>
              </div>
            </>
          )}
        </motion.div>

        {/* Danger Zone Alert */}
        {dangerZones.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-red-600/20 border border-red-500/50 rounded-xl p-4"
          >
            <div className="flex items-center space-x-3">
              <AlertTriangle className="text-red-400 animate-pulse" size={24} />
              <div>
                <h3 className="text-red-400 font-semibold">⚠️ Active Danger Zones Detected</h3>
                <p className="text-gray-300 text-sm">
                  {dangerZones.length} high-risk areas are currently active with red danger zone markings. 
                  Immediate attention and safety measures are recommended.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-600/20 border border-red-500/50 rounded-xl p-4"
          >
            <div className="flex items-center space-x-3">
              <AlertTriangle className="text-red-400" size={20} />
              <div>
                <h3 className="text-red-400 font-semibold">Error Loading Map Data</h3>
                <p className="text-gray-300 text-sm">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Map Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Satellite className="text-cyan-400" size={20} />
              <h2 className="text-xl font-semibold">Live Environmental Risk Assessment</h2>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              {lastUpdated && (
                <div className="flex items-center space-x-1">
                  <RefreshCw size={12} />
                  <span>Updated: {new Date(lastUpdated).toLocaleTimeString()}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Live Data</span>
              </div>
            </div>
          </div>
          
          {/* Map Component */}
          <div className="h-[600px] rounded-lg overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-full bg-gray-900/50">
                <div className="text-center">
                  <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                  <div>Loading environmental data...</div>
                </div>
              </div>
            ) : (
              <EnvironmentalMap selectedLocation={selectedLocation} />
            )}
          </div>
        </motion.div>

        {/* Data Sources & Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center space-x-2 mb-4">
              <Info className="text-cyan-400" size={20} />
              <h3 className="text-lg font-semibold">NASA Data Sources</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• <strong>MODIS Terra/Aqua:</strong> Temperature and heatwave data</li>
              <li>• <strong>GPM Mission:</strong> Precipitation and flood monitoring</li>
              <li>• <strong>Landsat 8/9:</strong> Soil quality and land cover analysis</li>
              <li>• <strong>USGS:</strong> Real-time earthquake activity</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="text-green-400" size={20} />
              <h3 className="text-lg font-semibold">Risk Assessment Guide</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span><strong>Red Circles:</strong> Immediate danger zones requiring evacuation</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span><strong>Orange Markers:</strong> High risk areas, enhanced monitoring</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span><strong>Yellow Markers:</strong> Moderate concern, prepare safety measures</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span><strong>Green Markers:</strong> Normal conditions, continue monitoring</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}