'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapIcon, 
  Route, 
  AlertCircle,
  CheckCircle,
  Filter,
  Eye,
  EyeOff,
  BarChart3,
  Navigation,
  Zap,
  Construction,
  Car
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { roadQualityService } from '../../../services/roadQualityService';

// Dynamic import for RoadQualityMap to avoid SSR issues
const RoadQualityMap = dynamic(() => import('../../../components/RoadQualityMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-900 rounded-lg flex items-center justify-center">
      <div className="text-white">Loading road quality map...</div>
    </div>
  )
});

export default function RoadQuality() {
  const [showFilters, setShowFilters] = useState({
    excellent: true,
    good: true,
    fair: true,
    poor: true,
    very_poor: true
  });
  const [selectedCity, setSelectedCity] = useState('Dhaka');
  const [statistics, setStatistics] = useState<{
    totalRoads: number;
    qualityDistribution: Record<string, number>;
    surfaceDistribution: Record<string, number>;
    averageConditionScore: number;
    maintenanceNeeded: number;
  } | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal'];

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const stats = await roadQualityService.getRoadStatistics();
        setStatistics(stats);
      } catch (error) {
        console.error('Error loading statistics:', error);
      }
    };

    loadStatistics();
  }, []);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        const results = await roadQualityService.searchRoadsByName(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching roads:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const toggleFilter = (quality: keyof typeof showFilters) => {
    setShowFilters(prev => ({
      ...prev,
      [quality]: !prev[quality]
    }));
  };

  const qualityConfig = {
    excellent: { color: '#00ff00', icon: CheckCircle, label: 'Excellent', description: 'Perfect condition, smooth surface' },
    good: { color: '#7fff00', icon: CheckCircle, label: 'Good', description: 'Minor wear, suitable for all vehicles' },
    fair: { color: '#ffff00', icon: AlertCircle, label: 'Fair', description: 'Some maintenance needed' },
    poor: { color: '#ff7f00', icon: AlertCircle, label: 'Poor', description: 'Significant issues present' },
    very_poor: { color: '#ff0000', icon: Construction, label: 'Very Poor', description: 'Major problems, use caution' }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-3 bg-blue-600/20 border border-blue-500/30 rounded-full px-6 py-3 mb-4"
          >
            <Route className="text-blue-400" size={24} />
            <h1 className="text-2xl font-bold text-blue-400">Road Quality Assessment</h1>
            <Car className="text-blue-400" size={24} />
          </motion.div>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Interactive road quality map showing good roads (green lines) and bad roads (red lines) across Bangladesh. 
            Make informed decisions about travel routes and infrastructure quality.
          </p>
        </div>

        {/* Statistics Dashboard */}
        {statistics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4 text-center">
              <Route className="mx-auto mb-2 text-blue-400" size={32} />
              <div className="text-2xl font-bold text-blue-400">{statistics.totalRoads}</div>
              <div className="text-sm text-gray-400">Total Road Segments</div>
            </div>

            <div className="bg-green-600/10 border border-green-500/20 rounded-xl p-4 text-center">
              <CheckCircle className="mx-auto mb-2 text-green-400" size={32} />
              <div className="text-2xl font-bold text-green-400">
                {statistics.qualityDistribution.excellent + statistics.qualityDistribution.good}
              </div>
              <div className="text-sm text-gray-400">Good Quality Roads</div>
            </div>

            <div className="bg-orange-600/10 border border-orange-500/20 rounded-xl p-4 text-center">
              <AlertCircle className="mx-auto mb-2 text-orange-400" size={32} />
              <div className="text-2xl font-bold text-orange-400">
                {statistics.qualityDistribution.poor + statistics.qualityDistribution.very_poor}
              </div>
              <div className="text-sm text-gray-400">Poor Quality Roads</div>
            </div>

            <div className="bg-red-600/10 border border-red-500/20 rounded-xl p-4 text-center">
              <Construction className="mx-auto mb-2 text-red-400" size={32} />
              <div className="text-2xl font-bold text-red-400">{statistics.maintenanceNeeded}</div>
              <div className="text-sm text-gray-400">Need Maintenance</div>
            </div>
          </motion.div>
        )}

        {/* Search and City Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Navigation className="text-purple-400" size={20} />
            <h3 className="text-lg font-semibold">Search & Navigation</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search Roads</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by road name..."
                  className="flex-1 bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Search
                </button>
              </div>
              
              {searchResults.length > 0 && (
                <div className="mt-3 max-h-32 overflow-y-auto">
                  {searchResults.map((road) => (
                    <div key={road.id} className="text-sm p-2 bg-gray-800/30 rounded mb-1">
                      <span className="font-medium">{road.name}</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs`} 
                            style={{ backgroundColor: roadQualityService.getQualityColor(road.quality) + '20', 
                                     color: roadQualityService.getQualityColor(road.quality) }}>
                        {road.quality}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Map Filters */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="text-yellow-400" size={20} />
            <h3 className="text-lg font-semibold">Road Quality Filters</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(qualityConfig).map(([quality, config]) => {
              const isActive = showFilters[quality as keyof typeof showFilters];
              
              return (
                <motion.button
                  key={quality}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleFilter(quality as keyof typeof showFilters)}
                  className={`flex items-center space-x-3 p-4 rounded-lg border transition-all ${
                    isActive 
                      ? 'border-opacity-50' 
                      : 'bg-gray-800/50 border-gray-600/30 text-gray-400'
                  }`}
                  style={{
                    backgroundColor: isActive ? config.color + '20' : undefined,
                    borderColor: isActive ? config.color + '50' : undefined,
                    color: isActive ? config.color : undefined
                  }}
                >
                  {isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                  <div className="text-left">
                    <div className="font-medium text-sm">{config.label}</div>
                    <div className="text-xs opacity-75">{config.description}</div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Road Quality Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <MapIcon className="text-green-400" size={20} />
            <h3 className="text-lg font-semibold">Interactive Road Quality Map</h3>
          </div>
          
          <div className="h-96 rounded-lg overflow-hidden">
            <RoadQualityMap
              selectedCity={selectedCity}
              showFilters={showFilters}
            />
          </div>

          <div className="mt-4 text-xs text-gray-400 grid grid-cols-2 md:grid-cols-5 gap-2">
            <p><span style={{color: '#00ff00'}}>●</span> <strong>Excellent:</strong> Perfect condition</p>
            <p><span style={{color: '#7fff00'}}>●</span> <strong>Good:</strong> Minor wear only</p>
            <p><span style={{color: '#ffff00'}}>●</span> <strong>Fair:</strong> Needs maintenance</p>
            <p><span style={{color: '#ff7f00'}}>●</span> <strong>Poor:</strong> Significant issues</p>
            <p><span style={{color: '#ff0000'}}>●</span> <strong>Very Poor:</strong> Major problems</p>
          </div>
        </motion.div>

        {/* Quality Distribution Chart */}
        {statistics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <BarChart3 className="text-cyan-400" size={20} />
              <h3 className="text-lg font-semibold">Road Quality Distribution</h3>
            </div>

            <div className="space-y-4">
              {Object.entries(statistics.qualityDistribution).map(([quality, count]) => {
                const config = qualityConfig[quality as keyof typeof qualityConfig];
                const percentage = (count / statistics.totalRoads * 100).toFixed(1);
                
                return (
                  <div key={quality} className="flex items-center space-x-4">
                    <div className="w-20 text-sm font-medium capitalize" style={{ color: config.color }}>
                      {quality.replace('_', ' ')}
                    </div>
                    <div className="flex-1 bg-gray-800 rounded-full h-6 relative">
                      <div 
                        className="h-6 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: config.color,
                          opacity: 0.7
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                        {count} roads ({percentage}%)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {((statistics.qualityDistribution.excellent + statistics.qualityDistribution.good) / statistics.totalRoads * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">Roads in Good Condition</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {statistics.averageConditionScore.toFixed(1)}/100
                </div>
                <div className="text-sm text-gray-400">Average Condition Score</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">
                  {((statistics.surfaceDistribution.paved / statistics.totalRoads) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">Paved Road Coverage</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Usage Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-indigo-600/10 border border-indigo-500/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Zap className="text-indigo-400" size={20} />
            <span>How to Use Road Quality Map</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-indigo-400 mb-2">🗺️ Reading the Map</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <strong>Green lines:</strong> Excellent/Good roads - safe for all vehicles</li>
                <li>• <strong>Yellow lines:</strong> Fair roads - usable but needs attention</li>
                <li>• <strong>Orange/Red lines:</strong> Poor roads - use caution</li>
                <li>• <strong>Click roads:</strong> View detailed condition information</li>
                <li>• <strong>Markers:</strong> Show road start points with quality indicators</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-indigo-400 mb-2">🎯 Planning Your Route</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <strong>Filter roads:</strong> Show only quality levels you&apos;re interested in</li>
                <li>• <strong>Search roads:</strong> Find specific highways and routes</li>
                <li>• <strong>Check conditions:</strong> Review maintenance status and issues</li>
                <li>• <strong>Environmental risks:</strong> See flood/monsoon affected areas</li>
                <li>• <strong>Accessibility:</strong> Check emergency and vehicle access</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}