'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Satellite, Radio, Zap } from 'lucide-react';

interface SatelliteProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'landsat' | 'terra' | 'aqua' | 'modis';
  showSignals?: boolean;
}

export default function SatelliteTracker({ 
  size = 'medium', 
  variant = 'landsat',
  showSignals = true 
}: SatelliteProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sizeConfig = {
    small: { width: 40, height: 40, orbitRadius: 80 },
    medium: { width: 60, height: 60, orbitRadius: 120 },
    large: { width: 80, height: 80, orbitRadius: 160 }
  };

  const satelliteInfo = {
    landsat: {
      name: 'Landsat 8/9',
      description: 'Earth observation satellites providing high-resolution imagery for environmental monitoring',
      dataTypes: ['Surface Temperature', 'Land Use', 'Vegetation Health', 'Water Quality'],
      altitude: '705 km',
      orbitPeriod: '99 minutes',
      color: '#ef4444'
    },
    terra: {
      name: 'Terra (EOS AM-1)',
      description: 'Multi-instrument platform monitoring Earth\'s climate and environmental changes',
      dataTypes: ['Atmospheric Data', 'Cloud Coverage', 'Aerosols', 'Land Surface Temperature'],
      altitude: '705 km',
      orbitPeriod: '98.8 minutes',
      color: '#22c55e'
    },
    aqua: {
      name: 'Aqua (EOS PM-1)',
      description: 'Water cycle and climate monitoring satellite with advanced sensors',
      dataTypes: ['Ocean Temperature', 'Precipitation', 'Atmospheric Water Vapor', 'Sea Ice'],
      altitude: '705 km',
      orbitPeriod: '98.8 minutes',
      color: '#06b6d4'
    },
    modis: {
      name: 'MODIS Platform',
      description: 'Moderate Resolution Imaging Spectroradiometer for global environmental monitoring',
      dataTypes: ['Fire Detection', 'Air Quality', 'Ocean Color', 'Snow Cover'],
      altitude: '705 km',
      orbitPeriod: '98.8 minutes',
      color: '#8b5cf6'
    }
  };

  const currentSat = satelliteInfo[variant];
  const config = sizeConfig[size];

  return (
    <div className="relative flex items-center justify-center">
      {/* Orbit Ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute border border-cyan-400/30 rounded-full"
        style={{
          width: config.orbitRadius * 2,
          height: config.orbitRadius * 2,
        }}
      >
        {/* Orbit Trail Effect */}
        <div className="absolute inset-0 rounded-full animate-pulse">
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, transparent, ${currentSat.color}20, transparent)`,
              animation: 'spin 8s linear infinite'
            }}
          />
        </div>
      </motion.div>

      {/* Earth (Center) */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-green-400 to-blue-600 shadow-lg"
        style={{
          boxShadow: `
            0 0 30px rgba(59, 130, 246, 0.4),
            inset 0 0 20px rgba(34, 197, 94, 0.3)
          `
        }}
      >
        {/* Earth Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white/5 to-transparent animate-pulse" />
        
        {/* Continent Silhouettes */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute top-2 left-3 w-2 h-3 bg-green-600/60 rounded-sm transform rotate-12" />
          <div className="absolute top-4 right-2 w-1.5 h-2 bg-green-600/60 rounded-sm" />
          <div className="absolute bottom-3 left-2 w-3 h-2 bg-green-600/60 rounded-sm transform -rotate-6" />
        </div>
      </motion.div>

      {/* Satellite */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute satellite-orbit satellite-pulse"
        style={{
          width: config.width,
          height: config.height,
        }}
      >
        {/* Satellite Body */}
        <div className="relative w-full h-full">
          {/* Main Body */}
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 rounded-lg"
            style={{
              boxShadow: `
                0 0 15px ${currentSat.color}60,
                inset 0 0 10px rgba(255, 255, 255, 0.2)
              `
            }}
          >
            {/* Solar Panels */}
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-6 h-8 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 rounded-sm">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 to-transparent rounded-sm" />
            </div>
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-6 h-8 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 rounded-sm">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 to-transparent rounded-sm" />
            </div>

            {/* Antenna */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-0.5 h-3 bg-gray-300" />
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-2 h-2 bg-red-400 rounded-full animate-pulse" />

            {/* Sensors */}
            <div className="absolute bottom-0 left-1/4 w-2 h-1 bg-yellow-400 rounded-sm opacity-80" />
            <div className="absolute bottom-0 right-1/4 w-2 h-1 bg-green-400 rounded-sm opacity-80" />
          </motion.div>

          {/* Signal Waves */}
          {showSignals && (
            <>
              {[1, 2, 3].map((index) => (
                <motion.div
                  key={index}
                  className="absolute inset-0 border-2 rounded-full"
                  style={{
                    borderColor: `${currentSat.color}40`,
                    animation: `ping 2s cubic-bezier(0, 0, 0.2, 1) infinite ${index * 0.5}s`,
                  }}
                />
              ))}
            </>
          )}
        </div>
      </motion.div>

      {/* Data Streams */}
      {showSignals && (
        <>
          {Array.from({ length: 8 }).map((_, index) => (
            <motion.div
              key={index}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
              initial={{
                x: config.orbitRadius,
                y: 0,
                opacity: 0
              }}
              animate={{
                x: 0,
                y: 0,
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                delay: index * 0.3,
                repeat: Infinity,
                ease: "easeOut"
              }}
              style={{
                transformOrigin: 'center',
                transform: `rotate(${index * 45}deg)`
              }}
            />
          ))}
        </>
      )}

      {/* Satellite Information Panel */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute left-full ml-8 top-0 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 w-72 hologram"
        style={{ zIndex: 10 }}
      >
        <div className="flex items-center space-x-2 mb-3">
          <Satellite className="text-cyan-400" size={20} />
          <h3 className="text-lg font-semibold text-glow">{currentSat.name}</h3>
        </div>
        
        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
          {currentSat.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Altitude:</span>
            <span className="text-cyan-400 font-medium">{currentSat.altitude}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Orbit Period:</span>
            <span className="text-green-400 font-medium">{currentSat.orbitPeriod}</span>
          </div>

          <div className="mt-4">
            <p className="text-gray-400 text-sm mb-2 flex items-center">
              <Radio size={14} className="mr-2" />
              Data Types:
            </p>
            <div className="grid grid-cols-2 gap-1">
              {currentSat.dataTypes.map((type, index) => (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2 + index * 0.1 }}
                  className="text-xs px-2 py-1 bg-white/10 rounded-full text-center border-glow"
                >
                  {type}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="text-yellow-400" size={14} />
              <span className="text-yellow-400 text-sm font-medium">Live Data Stream</span>
            </div>
            <div className="text-xs text-gray-300">
              Real-time environmental monitoring data from NASA Earth observing satellites
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}