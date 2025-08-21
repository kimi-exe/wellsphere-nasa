'use client';

import { useEffect, useState } from 'react';
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
  Zap
} from 'lucide-react';

interface EnvironmentalDataPoint {
  id: string;
  lat: number;
  lng: number;
  type: 'heatwave' | 'flood' | 'soil' | 'earthquake';
  severity: 'low' | 'medium' | 'high' | 'critical';
  value: number;
  description: string;
  timestamp: string;
}

interface FallbackMapProps {
  data: EnvironmentalDataPoint[];
  visibleLayers: Record<string, boolean>;
}

function FallbackMap({ data, visibleLayers }: FallbackMapProps) {
  const [selectedPoint, setSelectedPoint] = useState<EnvironmentalDataPoint | null>(null);

  // Bangladesh boundaries (approximate)
  const bangladeshBounds = {
    minLat: 20.7,
    maxLat: 26.6,
    minLng: 88.1,
    maxLng: 92.7
  };

  // Convert lat/lng to SVG coordinates
  const latLngToSVG = (lat: number, lng: number) => {
    const x = ((lng - bangladeshBounds.minLng) / (bangladeshBounds.maxLng - bangladeshBounds.minLng)) * 800;
    const y = ((bangladeshBounds.maxLat - lat) / (bangladeshBounds.maxLat - bangladeshBounds.minLat)) * 600;
    return { x, y };
  };

  const severityColors = {
    low: '#22c55e',
    medium: '#f59e0b', 
    high: '#f97316',
    critical: '#dc2626'
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'heatwave': return Thermometer;
      case 'flood': return Droplets;
      case 'soil': return Mountain;
      case 'earthquake': return Activity;
      default: return MapPin;
    }
  };

  const filteredData = data.filter(point => visibleLayers[point.type]);
  const dangerousPoints = filteredData.filter(point => 
    point.severity === 'high' || point.severity === 'critical'
  );

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      {/* Bangladesh Map SVG */}
      <svg 
        viewBox="0 0 800 600" 
        className="w-full h-full"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
      >
        {/* Bangladesh outline (simplified) */}
        <defs>
          <pattern id="mapPattern" patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="rgba(59, 130, 246, 0.1)" />
            <path d="m 0 20 l 20 -20 M -5 5 l 10 -10 M 15 25 l 10 -10" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" />
          </pattern>
        </defs>
        
        {/* Country boundary */}
        <rect 
          x="50" 
          y="50" 
          width="700" 
          height="500" 
          fill="url(#mapPattern)" 
          stroke="rgba(59, 130, 246, 0.4)" 
          strokeWidth="2" 
          rx="20"
        />

        {/* Major cities labels */}
        <text x="250" y="200" fill="#9ca3af" fontSize="12" textAnchor="middle">Dhaka</text>
        <text x="500" y="350" fill="#9ca3af" fontSize="12" textAnchor="middle">Chittagong</text>
        <text x="400" y="120" fill="#9ca3af" fontSize="12" textAnchor="middle">Sylhet</text>
        <text x="150" y="250" fill="#9ca3af" fontSize="12" textAnchor="middle">Rajshahi</text>
        <text x="200" y="400" fill="#9ca3af" fontSize="12" textAnchor="middle">Khulna</text>
        <text x="300" y="450" fill="#9ca3af" fontSize="12" textAnchor="middle">Barisal</text>

        {/* Danger zones (red circles for high/critical severity) */}
        {dangerousPoints.map((point) => {
          const { x, y } = latLngToSVG(point.lat, point.lng);
          const radius = point.severity === 'critical' ? 60 : 40;
          
          return (
            <circle
              key={`danger-${point.id}`}
              cx={x}
              cy={y}
              r={radius}
              fill="rgba(220, 38, 38, 0.15)"
              stroke="rgba(220, 38, 38, 0.8)"
              strokeWidth="2"
              className="animate-pulse"
            />
          );
        })}

        {/* Environmental data points */}
        {filteredData.map((point) => {
          const { x, y } = latLngToSVG(point.lat, point.lng);
          const size = point.severity === 'critical' ? 12 : point.severity === 'high' ? 10 : 8;
          
          return (
            <g key={point.id}>
              <circle
                cx={x}
                cy={y}
                r={size}
                fill={severityColors[point.severity]}
                stroke="#ffffff"
                strokeWidth="2"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setSelectedPoint(point)}
              />
              
              {/* Pulsing effect for critical points */}
              {point.severity === 'critical' && (
                <circle
                  cx={x}
                  cy={y}
                  r={size + 5}
                  fill="none"
                  stroke={severityColors[point.severity]}
                  strokeWidth="2"
                  opacity="0.6"
                  className="animate-ping"
                />
              )}
            </g>
          );
        })}

        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(156, 163, 175, 0.1)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-lg rounded-lg p-3 space-y-2">
        <div className="text-white text-sm font-medium mb-2">Legend</div>
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

      {/* Info Panel */}
      {selectedPoint && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 bg-white/10 backdrop-blur-lg rounded-lg p-4 max-w-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {(() => {
                const IconComponent = getIconForType(selectedPoint.type);
                return <IconComponent size={16} style={{ color: severityColors[selectedPoint.severity] }} />;
              })()}
              <h3 className="text-white font-semibold text-sm">
                {selectedPoint.type.toUpperCase()} Alert
              </h3>
            </div>
            <button
              onClick={() => setSelectedPoint(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-1 text-xs">
            <p className="text-red-400 font-medium">
              Severity: {selectedPoint.severity.toUpperCase()}
            </p>
            <p className="text-white">
              Value: {selectedPoint.value}
              {selectedPoint.type === 'heatwave' && '°C'}
              {selectedPoint.type === 'flood' && 'm'}
              {selectedPoint.type === 'soil' && ' pH'}
              {selectedPoint.type === 'earthquake' && ' mag'}
            </p>
            <p className="text-gray-300">
              {selectedPoint.description}
            </p>
            <p className="text-gray-400">
              {new Date(selectedPoint.timestamp).toLocaleString()}
            </p>
          </div>
        </motion.div>
      )}

      {/* Title */}
      <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-lg rounded-lg p-3">
        <h3 className="text-white font-semibold flex items-center space-x-2">
          <MapPin className="text-cyan-400" size={16} />
          <span>Bangladesh Environmental Map</span>
        </h3>
        <p className="text-xs text-gray-400">Fallback visualization mode</p>
      </div>
    </div>
  );
}

export default FallbackMap;