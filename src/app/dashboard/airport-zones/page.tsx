'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapIcon, 
  AlertTriangle, 
  Plane, 
  Home, 
  Volume2,
  Wind,
  TrendingDown,
  Info,
  Filter,
  Eye,
  EyeOff
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { bangladeshAirports } from '../../../services/airportService';

// Dynamic import for AirportMap to avoid SSR issues
const AirportMap = dynamic(() => import('../../../components/AirportMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-900 rounded-lg flex items-center justify-center">
      <div className="text-white">Loading airport map...</div>
    </div>
  )
});

export default function AirportZones() {
  const [showInternational, setShowInternational] = useState(true);
  const [showDomestic, setShowDomestic] = useState(true);
  const [showSTOL, setShowSTOL] = useState(true);
  // Reserved for future location checking feature
  // const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  // const [dangerCheck, setDangerCheck] = useState<{ inDangerZone: boolean; nearestAirport?: any; distance?: number } | null>(null);

  const internationalAirports = bangladeshAirports.filter(a => a.type === 'international');
  const domesticAirports = bangladeshAirports.filter(a => a.type === 'domestic');
  const stolPorts = bangladeshAirports.filter(a => a.type === 'stol');

  // Function to check if a location is in a danger zone (for future features)
  // const checkLocationSafety = (lat: number, lng: number) => {
  //   const result = isLocationInDangerZone(lat, lng);
  //   setDangerCheck(result);
  //   setSelectedLocation({ lat, lng });
  // };

  const riskFactors = [
    {
      icon: Volume2,
      title: 'Noise Pollution',
      description: 'Aircraft noise levels can reach 70-90 dB, causing sleep disruption, stress, and hearing damage',
      severity: 'High'
    },
    {
      icon: Wind,
      title: 'Air Pollution',
      description: 'Jet engines emit NOx, CO, hydrocarbons, and particulate matter affecting air quality',
      severity: 'High'
    },
    {
      icon: AlertTriangle,
      title: 'Safety Risks',
      description: 'Risk of aircraft accidents, emergency landings, and falling debris in flight paths',
      severity: 'Medium'
    },
    {
      icon: TrendingDown,
      title: 'Property Value',
      description: 'Real estate values typically decrease by 5-15% within airport danger zones',
      severity: 'Medium'
    }
  ];

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
            className="inline-flex items-center space-x-3 bg-red-600/20 border border-red-500/30 rounded-full px-6 py-3 mb-4"
          >
            <AlertTriangle className="text-red-400" size={24} />
            <h1 className="text-2xl font-bold text-red-400">Airport Danger Zones</h1>
            <Plane className="text-red-400" size={24} />
          </motion.div>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Interactive map showing dangerous areas around airports in Bangladesh. Red circles indicate zones where living poses 
            health and safety risks due to noise pollution, air pollution, and flight path hazards.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-red-600/10 border border-red-500/20 rounded-xl p-4 text-center"
          >
            <Plane className="mx-auto mb-2 text-red-400" size={32} />
            <div className="text-2xl font-bold text-red-400">{internationalAirports.length}</div>
            <div className="text-sm text-gray-400">International Airports</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-orange-600/10 border border-orange-500/20 rounded-xl p-4 text-center"
          >
            <Plane className="mx-auto mb-2 text-orange-400" size={32} />
            <div className="text-2xl font-bold text-orange-400">{domesticAirports.length}</div>
            <div className="text-sm text-gray-400">Domestic Airports</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-amber-600/10 border border-amber-500/20 rounded-xl p-4 text-center"
          >
            <Plane className="mx-auto mb-2 text-amber-400" size={32} />
            <div className="text-2xl font-bold text-amber-400">{stolPorts.length}</div>
            <div className="text-sm text-gray-400">STOL Ports</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-red-600/10 border border-red-500/20 rounded-xl p-4 text-center"
          >
            <Home className="mx-auto mb-2 text-red-400" size={32} />
            <div className="text-2xl font-bold text-red-400">
              {bangladeshAirports.reduce((sum, airport) => sum + Math.PI * Math.pow(airport.dangerZoneRadius / 1000, 2), 0).toFixed(0)}
            </div>
            <div className="text-sm text-gray-400">km² Danger Zone</div>
          </motion.div>
        </div>

        {/* Map Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="text-blue-400" size={20} />
            <h3 className="text-lg font-semibold">Map Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowInternational(!showInternational)}
              className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                showInternational 
                  ? 'bg-red-600/20 border-red-500/30 text-red-400' 
                  : 'bg-gray-800/50 border-gray-600/30 text-gray-400'
              }`}
            >
              {showInternational ? <Eye size={20} /> : <EyeOff size={20} />}
              <div className="text-left">
                <div className="font-medium">International</div>
                <div className="text-xs opacity-75">High danger zones</div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDomestic(!showDomestic)}
              className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                showDomestic 
                  ? 'bg-orange-600/20 border-orange-500/30 text-orange-400' 
                  : 'bg-gray-800/50 border-gray-600/30 text-gray-400'
              }`}
            >
              {showDomestic ? <Eye size={20} /> : <EyeOff size={20} />}
              <div className="text-left">
                <div className="font-medium">Domestic</div>
                <div className="text-xs opacity-75">Medium danger zones</div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSTOL(!showSTOL)}
              className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                showSTOL 
                  ? 'bg-amber-600/20 border-amber-500/30 text-amber-400' 
                  : 'bg-gray-800/50 border-gray-600/30 text-gray-400'
              }`}
            >
              {showSTOL ? <Eye size={20} /> : <EyeOff size={20} />}
              <div className="text-left">
                <div className="font-medium">STOL Ports</div>
                <div className="text-xs opacity-75">Low danger zones</div>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <MapIcon className="text-red-400" size={20} />
            <h3 className="text-lg font-semibold">Bangladesh Airport Danger Zones Map</h3>
          </div>
          
          <div className="h-96 rounded-lg overflow-hidden">
            <AirportMap
              showInternational={showInternational}
              showDomestic={showDomestic}
              showSTOL={showSTOL}
            />
          </div>

          <div className="mt-4 text-xs text-gray-400">
            <p><strong>Red zones:</strong> International airports - Extreme danger (8km radius)</p>
            <p><strong>Orange zones:</strong> Domestic airports - High danger (3-6km radius)</p>
            <p><strong>Amber zones:</strong> STOL ports - Moderate danger (2-3km radius)</p>
          </div>
        </motion.div>

        {/* Risk Factors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Info className="text-orange-400" size={20} />
            <h3 className="text-lg font-semibold">Health & Safety Risk Factors</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {riskFactors.map((risk, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/30"
              >
                <div className={`p-2 rounded-lg ${
                  risk.severity === 'High' ? 'bg-red-600/20 text-red-400' : 'bg-orange-600/20 text-orange-400'
                }`}>
                  <risk.icon size={24} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{risk.title}</h4>
                  <p className="text-sm text-gray-400 mb-2">{risk.description}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    risk.severity === 'High' 
                      ? 'bg-red-600/20 text-red-400 border border-red-500/30' 
                      : 'bg-orange-600/20 text-orange-400 border border-orange-500/30'
                  }`}>
                    {risk.severity} Risk
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Safety Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-green-600/10 via-blue-600/10 to-green-600/10 border border-green-500/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Home className="text-green-400" size={20} />
            <span>Safe Housing Recommendations</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-400 mb-2">✅ Recommended Areas</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Areas beyond danger zone circles</li>
                <li>• Minimum 5km from international airports</li>
                <li>• Minimum 3km from domestic airports</li>
                <li>• Consider wind patterns and flight paths</li>
                <li>• Check local noise ordinances</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-red-400 mb-2">❌ Areas to Avoid</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Inside red danger zone circles</li>
                <li>• Directly under flight paths</li>
                <li>• Areas with frequent night flights</li>
                <li>• Near runway approach/departure zones</li>
                <li>• Industrial areas adjacent to airports</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}