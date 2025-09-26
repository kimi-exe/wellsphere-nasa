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
  Plane
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="text-white text-xl font-medium">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Professional Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Clean Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900" />
        
        {/* Geometric Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Floating Corporate Elements */}
        <motion.div
          className="absolute w-96 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30"
          animate={{
            x: [-400, window?.innerWidth || 1920],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            delay: 0
          }}
          style={{ top: '20%' }}
        />
        
        <motion.div
          className="absolute w-96 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-30"
          animate={{
            x: [-400, window?.innerWidth || 1920],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
            delay: 7
          }}
          style={{ top: '60%' }}
        />
        
        {/* Data Flow Lines */}
        <motion.div
          className="absolute w-0.5 h-96 bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-20"
          animate={{
            y: [-400, window?.innerHeight || 1080],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
            delay: 3
          }}
          style={{ left: '30%' }}
        />
        
        {/* Subtle Pulsing Nodes */}
        <motion.div
          className="absolute w-3 h-3 bg-cyan-400 rounded-full opacity-60"
          animate={{
            scale: [0.5, 1.5, 0.5],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ left: '15%', top: '25%' }}
        />
        
        <motion.div
          className="absolute w-2 h-2 bg-emerald-400 rounded-full opacity-50"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          style={{ right: '20%', top: '40%' }}
        />
        
        <motion.div
          className="absolute w-4 h-4 bg-blue-400 rounded-full opacity-40"
          animate={{
            scale: [0.3, 1, 0.3],
            opacity: [0.1, 0.5, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          style={{ left: '70%', bottom: '30%' }}
        />
        
        {/* Professional Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
        
        {/* Corporate Accent Lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 opacity-50" />
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-400 opacity-30" />
      </div>
      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Leaf className="text-red-400" size={24} />
              <span className="text-xl font-bold bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">
                Oasis
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