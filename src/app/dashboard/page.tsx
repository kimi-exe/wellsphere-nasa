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
import CrystalBallEngine from '@/components/CrystalBallEngine';

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

      {/* Crystal Ball Engine - Interactive Liveability Map */}
      <main className="h-[calc(100vh-4rem)]">
        <CrystalBallEngine />
      </main>
    </div>
  );
}