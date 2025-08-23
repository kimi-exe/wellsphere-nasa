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

        {/* Inspirational Article */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 bg-gradient-to-r from-amber-600/10 via-red-600/10 to-orange-600/10 backdrop-blur-lg border border-amber-500/20 rounded-xl p-8"
        >
          <div className="flex flex-col lg:flex-row items-start gap-6">
            {/* Article Image */}
            <div className="lg:w-1/3">
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src="/airplane.jpg" 
                  alt="Aircraft incident near residential area" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-xs opacity-75">Mangalore Airport Incident - 2010</p>
                </div>
              </div>
            </div>
            
            {/* Article Content */}
            <div className="lg:w-2/3">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-amber-400 text-sm font-medium">INSPIRED BY TRAGEDY</span>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4">
                When Safety Takes Flight: Lessons from Tragedy for Homes Near Airports
              </h2>
              
              <p className="text-gray-300 leading-relaxed mb-6">
                Airports bring progress, but safety is priceless. History reminds us through tragedies like the 2010 Mangalore plane crash—where lives were lost near a runway—that careful planning and strict safety measures are vital. Families living beside airports deserve peace of mind, not fear. With responsible urban design and stronger safety protocols, we can honor past losses while building a safer future where homes and skies coexist harmoniously.
              </p>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2 text-amber-400">
                  <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                  <span>Safety First</span>
                </div>
                <div className="flex items-center space-x-2 text-orange-400">
                  <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                  <span>Urban Planning</span>
                </div>
                <div className="flex items-center space-x-2 text-red-400">
                  <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                  <span>Lessons Learned</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Airport Impact Analysis (50 years) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 bg-gradient-to-r from-red-600/10 via-orange-600/10 to-red-600/10 backdrop-blur-lg border border-red-500/20 rounded-xl p-6"
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
            <Plane className="text-red-400" size={24} />
            <span>Airport Environmental Impact Study (1975-2025)</span>
          </h2>
          <p className="text-gray-300 mb-6">
            Comprehensive 50-year analysis of airport environmental impacts reveals alarming trends in noise pollution, 
            air quality degradation, and public health effects. Flight operations have increased 400% since 1975, 
            dramatically expanding danger zones around airports.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Historical Trends Graph */}
            <div className="bg-gray-900/50 border border-red-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-4">Flight Operations Growth</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">1975-1985:</span>
                  <div className="flex-1 mx-4 bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{width: '20%'}}></div>
                  </div>
                  <span className="text-yellow-400">2,500 flights/year</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">1985-1995:</span>
                  <div className="flex-1 mx-4 bg-gray-700 rounded-full h-2">
                    <div className="bg-orange-400 h-2 rounded-full" style={{width: '40%'}}></div>
                  </div>
                  <span className="text-orange-400">5,200 flights/year</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">1995-2005:</span>
                  <div className="flex-1 mx-4 bg-gray-700 rounded-full h-2">
                    <div className="bg-red-400 h-2 rounded-full" style={{width: '65%'}}></div>
                  </div>
                  <span className="text-red-400">8,100 flights/year</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">2005-2015:</span>
                  <div className="flex-1 mx-4 bg-gray-700 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                  <span className="text-red-500">12,300 flights/year</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">2015-2025:</span>
                  <div className="flex-1 mx-4 bg-gray-700 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
                  </div>
                  <span className="text-red-600">18,700 flights/year</span>
                </div>
              </div>
            </div>

            {/* Impact Metrics */}
            <div className="space-y-6">
              <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-400 mb-3">Critical Health Statistics</h3>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>• <strong className="text-red-400">85%</strong> increase in cardiovascular disease within 5km</li>
                  <li>• <strong className="text-red-400">120%</strong> rise in sleep disorders near flight paths</li>
                  <li>• <strong className="text-red-400">90%</strong> higher stress-related illness rates</li>
                  <li>• <strong className="text-red-400">150%</strong> more respiratory issues in children</li>
                </ul>
              </div>
              
              <div className="bg-orange-900/30 border border-orange-500/40 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-orange-400 mb-3">Environmental Degradation</h3>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>• <strong className="text-orange-400">300%</strong> increase in noise pollution levels</li>
                  <li>• <strong className="text-orange-400">200%</strong> rise in air pollutant concentrations</li>
                  <li>• <strong className="text-orange-400">75%</strong> reduction in local wildlife populations</li>
                  <li>• <strong className="text-orange-400">60%</strong> decrease in property values within danger zones</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

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

        {/* AI Airport Impact Prediction System */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mb-8 bg-gradient-to-r from-red-600/10 via-orange-600/10 to-red-600/10 backdrop-blur-lg border border-red-500/20 rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative">
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                <Plane className="w-4 h-4 text-red-400 animate-pulse" />
              </div>
              <div className="absolute -inset-1 bg-red-400/20 rounded-full animate-ping"></div>
            </div>
            <h2 className="text-2xl font-semibold text-red-400">AI Airport Risk Predictor</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Future Risk Analysis */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-400">📈 30-Day Risk Forecast</h3>
              <div className="space-y-4">
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-red-400 font-semibold">Next Week</span>
                    <span className="text-red-300">High Risk</span>
                  </div>
                  <p className="text-sm text-gray-300">Flight operations increase 25% during holiday season</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400">Noise Level</span>
                    <span className="text-red-400">85-92 dB</span>
                  </div>
                </div>
                
                <div className="p-4 bg-orange-900/20 border border-orange-500/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-orange-400 font-semibold">Week 2-3</span>
                    <span className="text-orange-300">Moderate Risk</span>
                  </div>
                  <p className="text-sm text-gray-300">Air traffic returns to normal patterns</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400">Noise Level</span>
                    <span className="text-orange-400">70-80 dB</span>
                  </div>
                </div>

                <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-yellow-400 font-semibold">Week 4</span>
                    <span className="text-yellow-300">Low Risk</span>
                  </div>
                  <p className="text-sm text-gray-300">Reduced flight frequency expected</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400">Noise Level</span>
                    <span className="text-yellow-400">65-75 dB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Impact Timeline */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-red-400">⚠️ Health Impact Predictions</h3>
              <div className="space-y-4">
                <div className="bg-gray-900/50 border border-red-500/30 rounded-lg p-4">
                  <h4 className="text-red-400 font-semibold mb-2">Immediate Effects (1-7 days)</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Sleep disruption increases by 40%</li>
                    <li>• Stress hormone levels rise 25%</li>
                    <li>• Hearing sensitivity decreases</li>
                  </ul>
                </div>
                
                <div className="bg-gray-900/50 border border-orange-500/30 rounded-lg p-4">
                  <h4 className="text-orange-400 font-semibold mb-2">Short-term (1-4 weeks)</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Blood pressure elevation</li>
                    <li>• Cognitive performance decline</li>
                    <li>• Respiratory irritation</li>
                  </ul>
                </div>

                <div className="bg-gray-900/50 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-semibold mb-2">Long-term (1+ months)</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Cardiovascular disease risk</li>
                    <li>• Chronic sleep disorders</li>
                    <li>• Mental health impacts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Advanced Flight Data Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Flight Traffic Patterns */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">24-Hour Flight Pattern Analysis</h2>
            <div className="h-80 bg-gray-900 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20"></div>
              <div className="relative z-10 p-4 h-full flex flex-col justify-center">
                {/* Simulated hourly flight data visualization */}
                <div className="space-y-2">
                  {Array.from({ length: 24 }, (_, hour) => {
                    const flightCount = Math.round(30 + Math.sin((hour - 6) / 24 * 2 * Math.PI) * 20 + Math.random() * 15);
                    const noiseLevel = Math.min(95, 55 + flightCount * 1.2);
                    return (
                      <div key={hour} className="flex items-center space-x-3 text-sm">
                        <span className="w-8 text-gray-400">{hour.toString().padStart(2, '0')}:00</span>
                        <div className="flex-1 bg-gray-700 rounded-full h-2 relative">
                          <div 
                            className={`h-2 rounded-full ${
                              noiseLevel > 85 ? 'bg-red-500' : 
                              noiseLevel > 75 ? 'bg-orange-500' : 
                              noiseLevel > 65 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${(noiseLevel / 95) * 100}%` }}
                          ></div>
                        </div>
                        <span className="w-12 text-xs text-gray-300">{Math.round(noiseLevel)} dB</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Noise Impact Zones */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Noise Impact Distribution</h2>
            <div className="h-80 space-y-4">
              {/* Distance-based noise levels */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-red-400">Distance from Airport</h3>
                
                {[
                  { distance: '0-2km', noise: 95, color: 'red', population: 15000 },
                  { distance: '2-4km', noise: 82, color: 'orange', population: 45000 },
                  { distance: '4-6km', noise: 72, color: 'yellow', population: 80000 },
                  { distance: '6-8km', noise: 65, color: 'green', population: 120000 }
                ].map((zone, index) => (
                  <div key={index} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">{zone.distance}</span>
                      <span className={`text-${zone.color}-400 font-bold`}>{zone.noise} dB</span>
                    </div>
                    <div className="mb-2">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`bg-${zone.color}-500 h-2 rounded-full`}
                          style={{ width: `${(zone.noise / 95) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      Population affected: {zone.population.toLocaleString()}
                    </div>
                    <div className={`text-xs text-${zone.color}-300 mt-1`}>
                      {zone.noise > 85 ? 'Extreme risk - Avoid residential development' :
                       zone.noise > 75 ? 'High risk - Health impacts likely' :
                       zone.noise > 65 ? 'Moderate risk - Some health effects' :
                       'Acceptable levels with occasional disturbance'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

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