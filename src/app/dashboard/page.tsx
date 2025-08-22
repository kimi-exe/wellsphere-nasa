'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Thermometer, 
  Droplets, 
  Mountain, 
  Activity, 
  BarChart3, 
  Gamepad2,
  Leaf,
  LogOut,
  MapIcon,
  Plane,
  Route
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [activeNav, setActiveNav] = useState('overview');

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (!stored) {
      router.push('/');
      return;
    }
    setUserInfo(JSON.parse(stored));
  }, [router]);

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Home, href: '/dashboard' },
    { id: 'heatwave', label: 'Heatwave', icon: Thermometer, href: '/dashboard/heatwave' },
    { id: 'flood', label: 'Flood', icon: Droplets, href: '/dashboard/flood' },
    { id: 'soil', label: 'Soil Quality', icon: Mountain, href: '/dashboard/soil' },
    { id: 'earthquake', label: 'Earthquake', icon: Activity, href: '/dashboard/earthquake' },
    { id: 'airport-zones', label: 'Airport Zones', icon: Plane, href: '/dashboard/airport-zones' },
    { id: 'road-quality', label: 'Road Quality', icon: Route, href: '/dashboard/road-quality' },
    { id: 'environmental-map', label: 'Risk Map', icon: MapIcon, href: '/dashboard/environmental-map' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
    { id: 'game', label: 'Game', icon: Gamepad2, href: '/dashboard/game' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    router.push('/');
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Leaf className="text-red-400" size={24} />
              <span className="text-xl font-bold bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">
                WellSphere
              </span>
            </div>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link key={item.id} href={item.href}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveNav(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeNav === item.id
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'hover:bg-white/5 text-gray-300'
                    }`}
                  >
                    <item.icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.button>
                </Link>
              ))}
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">{userInfo.name}</p>
                <p className="text-xs text-gray-400">{userInfo.location}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <LogOut size={20} className="text-gray-400" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-white/10">
          <div className="flex overflow-x-auto px-4 py-2 space-x-1">
            {navigationItems.map((item) => (
              <Link key={item.id} href={item.href}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveNav(item.id)}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    activeNav === item.id
                      ? 'bg-red-500/20 text-red-400'
                      : 'text-gray-300'
                  }`}
                >
                  <item.icon size={16} />
                  <span className="text-xs">{item.label}</span>
                </motion.button>
              </Link>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Overview Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {userInfo.name}!
            </h1>
            <p className="text-gray-400">
              Environmental data overview for {userInfo.location}
            </p>
          </div>

          {/* Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Air Quality Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Air Quality</h3>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">PM2.5</span>
                  <span className="text-white">25 μg/m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">PM10</span>
                  <span className="text-white">45 μg/m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">AQI</span>
                  <span className="text-yellow-400 font-semibold">89 - Moderate</span>
                </div>
              </div>
            </motion.div>

            {/* Weather Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Weather Data</h3>
                <Thermometer className="text-blue-400" size={20} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Temperature</span>
                  <span className="text-white">28°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Humidity</span>
                  <span className="text-white">75%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Feel Like</span>
                  <span className="text-blue-400 font-semibold">32°C</span>
                </div>
              </div>
            </motion.div>

            {/* Water Quality Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Water Quality</h3>
                <Droplets className="text-blue-400" size={20} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">pH Level</span>
                  <span className="text-white">7.2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Dissolved O2</span>
                  <span className="text-white">8.5 mg/L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400 font-semibold">Good</span>
                </div>
              </div>
            </motion.div>

            {/* Soil Quality Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Soil Quality</h3>
                <Mountain className="text-green-400" size={20} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Soil pH</span>
                  <span className="text-white">6.8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Organic Matter</span>
                  <span className="text-white">3.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fertility</span>
                  <span className="text-green-400 font-semibold">High</span>
                </div>
              </div>
            </motion.div>

            {/* Noise Pollution Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Noise Pollution</h3>
                <Activity className="text-orange-400" size={20} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Level</span>
                  <span className="text-white">65 dB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Peak Today</span>
                  <span className="text-white">78 dB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="text-orange-400 font-semibold">Moderate</span>
                </div>
              </div>
            </motion.div>

            {/* Green Spaces Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Green Spaces</h3>
                <Leaf className="text-green-400" size={20} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Coverage</span>
                  <span className="text-white">18.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Biodiversity</span>
                  <span className="text-white">High</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Trend</span>
                  <span className="text-green-400 font-semibold">Improving</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Road Quality Assessment Feature */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="mt-8 bg-gradient-to-r from-blue-600/20 via-blue-700/20 to-blue-600/20 backdrop-blur-lg border border-blue-500/30 rounded-xl p-6"
          >
            <Link href="/dashboard/road-quality">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Route className="text-blue-400" size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">🛣️ Comprehensive Road Network</h3>
                    <p className="text-gray-300 text-sm">
                      Complete city road coverage with real OpenStreetMap data - every street mapped!
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                      <span>• 2500+ roads per city</span>
                      <span>• Real Overpass API data</span>
                      <span>• Every street covered</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                    NEW
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Click to explore →</p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Airport Danger Zones Feature */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="mt-4 bg-gradient-to-r from-red-600/20 via-red-700/20 to-red-600/20 backdrop-blur-lg border border-red-500/30 rounded-xl p-6"
          >
            <Link href="/dashboard/airport-zones">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-red-500/20 rounded-lg">
                    <Plane className="text-red-400" size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">⚠️ Airport Danger Zones</h3>
                    <p className="text-gray-300 text-sm">
                      View dangerous areas around Bangladesh airports - avoid building homes here!
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                      <span>• Noise pollution zones</span>
                      <span>• Safety risk areas</span>
                      <span>• Property value impact</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                    HOT
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Click to explore →</p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Environmental Risk Map Feature */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="mt-4 bg-gradient-to-r from-orange-600/20 via-orange-700/20 to-orange-600/20 backdrop-blur-lg border border-orange-500/30 rounded-xl p-6"
          >
            <Link href="/dashboard/environmental-map">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-500/20 rounded-lg">
                    <MapIcon className="text-orange-400" size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">🚨 Environmental Risk Map</h3>
                    <p className="text-gray-300 text-sm">
                      Interactive map showing real-time NASA data with danger zone analysis
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                      <span>• Live satellite data</span>
                      <span>• Red danger zones</span>
                      <span>• Multi-hazard analysis</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    UPDATED
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Click to explore →</p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {navigationItems.slice(1).map((item) => (
                <Link key={item.id} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center hover:border-red-400/30 transition-colors"
                  >
                    <item.icon className="mx-auto mb-2 text-red-400" size={24} />
                    <p className="text-sm font-medium">{item.label}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}