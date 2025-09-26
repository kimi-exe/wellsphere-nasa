'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Info, 
  Satellite, 
  Database, 
  Globe, 
  Zap, 
  ChevronDown,
  ExternalLink,
  Clock,
  MapPin,
  Signal
} from 'lucide-react';

interface DataSource {
  name: string;
  description: string;
  provider: string;
  updateFrequency: string;
  coverage: string;
  accuracy: string;
  dataTypes: string[];
  apiEndpoint?: string;
  documentation?: string;
  satellites?: string[];
  icon: any;
  color: string;
}

const dataSources: DataSource[] = [
  {
    name: "NASA Earthdata",
    description: "Comprehensive Earth observation data from NASA's fleet of satellites including atmospheric, oceanic, land surface, and climate measurements.",
    provider: "NASA Earth Observing System",
    updateFrequency: "Daily to Real-time",
    coverage: "Global",
    accuracy: "±0.1-1°C for temperature, ±5% for other metrics",
    dataTypes: ["Surface Temperature", "Atmospheric Composition", "Land Cover", "Ocean Color", "Ice Coverage"],
    apiEndpoint: "https://search.earthdata.nasa.gov/",
    documentation: "https://earthdata.nasa.gov/learn",
    satellites: ["Landsat 8/9", "Terra", "Aqua", "Suomi NPP", "JPSS-1"],
    icon: Satellite,
    color: "#ef4444"
  },
  {
    name: "MODIS (Terra/Aqua)",
    description: "Moderate Resolution Imaging Spectroradiometer providing comprehensive environmental monitoring with 36 spectral bands.",
    provider: "NASA/USGS",
    updateFrequency: "Daily",
    coverage: "Global (1-2 day revisit)",
    accuracy: "±1K for surface temperature, 500m spatial resolution",
    dataTypes: ["Fire Detection", "Air Quality", "Vegetation Indices", "Cloud Properties", "Aerosol Optical Depth"],
    satellites: ["Terra (EOS AM-1)", "Aqua (EOS PM-1)"],
    icon: Globe,
    color: "#22c55e"
  },
  {
    name: "Landsat Program",
    description: "Long-term Earth observation program providing continuous high-resolution imagery since 1972, essential for environmental change detection.",
    provider: "NASA/USGS",
    updateFrequency: "16-day revisit cycle",
    coverage: "Global land masses",
    accuracy: "30m spatial resolution, ±1-2% radiometric accuracy",
    dataTypes: ["Land Use Change", "Water Quality", "Urban Growth", "Agricultural Monitoring", "Forest Health"],
    satellites: ["Landsat 8", "Landsat 9"],
    icon: MapPin,
    color: "#06b6d4"
  },
  {
    name: "USGS Earthquake API",
    description: "Real-time and historical earthquake data from the United States Geological Survey's comprehensive seismic monitoring network.",
    provider: "United States Geological Survey",
    updateFrequency: "Real-time (1-5 minutes)",
    coverage: "Global seismic activity",
    accuracy: "±0.1 magnitude, ±1-5km location accuracy",
    dataTypes: ["Magnitude", "Depth", "Location", "Time", "Seismic Waves"],
    apiEndpoint: "https://earthquake.usgs.gov/fdsnws/event/1/",
    documentation: "https://earthquake.usgs.gov/data/",
    icon: Zap,
    color: "#f59e0b"
  },
  {
    name: "NOAA SWPC",
    description: "Space Weather Prediction Center providing critical space weather data affecting Earth's atmosphere and technology systems.",
    provider: "National Oceanic and Atmospheric Administration",
    updateFrequency: "Real-time to Hourly",
    coverage: "Global space weather conditions",
    accuracy: "High precision for solar activity monitoring",
    dataTypes: ["Solar Flares", "Geomagnetic Activity", "Radiation Levels", "Aurora Predictions", "Satellite Environment"],
    apiEndpoint: "https://services.swpc.noaa.gov/json/",
    icon: Signal,
    color: "#8b5cf6"
  },
  {
    name: "ESA Copernicus",
    description: "European Union's Earth observation program providing comprehensive environmental monitoring through the Sentinel satellite constellation.",
    provider: "European Space Agency",
    updateFrequency: "1-6 day revisit",
    coverage: "Global coverage with European focus",
    accuracy: "10-60m spatial resolution depending on sensor",
    dataTypes: ["Air Quality", "Climate Monitoring", "Land Services", "Marine Environment", "Emergency Response"],
    satellites: ["Sentinel-1A/B", "Sentinel-2A/B", "Sentinel-3A/B", "Sentinel-5P"],
    icon: Database,
    color: "#ec4899"
  }
];

interface DataSourceInfoProps {
  compact?: boolean;
  showSatellites?: boolean;
}

export default function DataSourceInfo({ compact = false, showSatellites = true }: DataSourceInfoProps) {
  const [expandedSource, setExpandedSource] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'satellite', 'ground-based', 'real-time', 'climate'];

  const toggleSource = (sourceName: string) => {
    setExpandedSource(expandedSource === sourceName ? null : sourceName);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hologram"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Info className="text-cyan-400" size={24} />
        <h2 className="text-2xl font-bold text-glow">Data Sources & Satellites</h2>
      </div>

      <p className="text-gray-300 mb-6 leading-relaxed">
        Oasis integrates data from multiple NASA and international Earth observation platforms, 
        providing comprehensive environmental monitoring through cutting-edge satellite technology and ground-based sensors.
      </p>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-cyan-500/20 text-cyan-400 border-glow'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </motion.button>
        ))}
      </div>

      <div className="space-y-4">
        {dataSources.map((source, index) => {
          const IconComponent = source.icon;
          const isExpanded = expandedSource === source.name;

          return (
            <motion.div
              key={source.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="border border-white/10 rounded-lg overflow-hidden hover-lift"
            >
              <motion.div
                onClick={() => toggleSource(source.name)}
                className="p-4 cursor-pointer bg-white/5 hover:bg-white/10 transition-all duration-300"
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${source.color}20`, border: `1px solid ${source.color}40` }}
                    >
                      <IconComponent size={20} style={{ color: source.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-glow">{source.name}</h3>
                      <p className="text-sm text-gray-400">{source.provider}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm text-cyan-400 font-medium">{source.updateFrequency}</div>
                      <div className="text-xs text-gray-400">{source.coverage}</div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={20} className="text-gray-400" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-gradient-to-br from-white/5 to-transparent border-t border-white/10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Description */}
                        <div>
                          <h4 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center">
                            <Globe size={14} className="mr-2" />
                            Description
                          </h4>
                          <p className="text-gray-300 text-sm leading-relaxed mb-4">
                            {source.description}
                          </p>

                          {/* Technical Specs */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Update Frequency:</span>
                              <span className="text-green-400 font-medium">{source.updateFrequency}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Coverage:</span>
                              <span className="text-blue-400 font-medium">{source.coverage}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Accuracy:</span>
                              <span className="text-purple-400 font-medium">{source.accuracy}</span>
                            </div>
                          </div>
                        </div>

                        {/* Data Types & Satellites */}
                        <div>
                          <h4 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center">
                            <Database size={14} className="mr-2" />
                            Data Types
                          </h4>
                          <div className="grid grid-cols-1 gap-1 mb-4">
                            {source.dataTypes.map((type) => (
                              <motion.div
                                key={type}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-xs px-3 py-1 bg-white/10 rounded-full border border-white/20 text-center"
                              >
                                {type}
                              </motion.div>
                            ))}
                          </div>

                          {/* Satellites */}
                          {source.satellites && showSatellites && (
                            <div>
                              <h4 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center">
                                <Satellite size={14} className="mr-2" />
                                Satellites
                              </h4>
                              <div className="space-y-1">
                                {source.satellites.map((satellite) => (
                                  <div key={satellite} className="text-sm text-gray-300 flex items-center">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse" />
                                    {satellite}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Links */}
                          <div className="mt-4 space-y-2">
                            {source.apiEndpoint && (
                              <motion.a
                                href={source.apiEndpoint}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                className="inline-flex items-center text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                              >
                                <ExternalLink size={12} className="mr-1" />
                                API Endpoint
                              </motion.a>
                            )}
                            {source.documentation && (
                              <motion.a
                                href={source.documentation}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                className="inline-flex items-center text-xs text-purple-400 hover:text-purple-300 transition-colors ml-4"
                              >
                                <ExternalLink size={12} className="mr-1" />
                                Documentation
                              </motion.a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Live Status Indicator */}
                      <div className="mt-4 p-3 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-lg border border-green-500/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-green-400 text-sm font-medium">Live Data Stream Active</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-400">
                            <Clock size={12} />
                            <span>Last updated: {new Date().toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="text-center p-3 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-lg border border-red-500/20">
          <div className="text-2xl font-bold text-red-400">15+</div>
          <div className="text-xs text-gray-400">Active Satellites</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg border border-green-500/20">
          <div className="text-2xl font-bold text-green-400">24/7</div>
          <div className="text-xs text-gray-400">Real-time Monitoring</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg border border-blue-500/20">
          <div className="text-2xl font-bold text-blue-400">Global</div>
          <div className="text-xs text-gray-400">Coverage</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg border border-purple-500/20">
          <div className="text-2xl font-bold text-purple-400">50+</div>
          <div className="text-xs text-gray-400">Data Parameters</div>
        </div>
      </motion.div>
    </motion.div>
  );
}