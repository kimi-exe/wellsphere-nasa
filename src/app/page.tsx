'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, Leaf, Satellite, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const bangladeshDivisions = [
    'Entire Bangladesh',
    'Barisal',
    'Chattogram (Chittagong)',
    'Dhaka',
    'Khulna',
    'Mymensingh',
    'Rajshahi',
    'Rangpur',
    'Sylhet'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.location) {
      localStorage.setItem('userInfo', JSON.stringify(formData));
      router.push('/dashboard');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Cosmic dust particles */}
        {mounted && Array.from({ length: 15 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              opacity: [0.1, 0.5, 0.1]
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 w-full max-w-md"
        >
          {/* Logo Section */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <motion.div 
              className="flex items-center justify-center space-x-2 mb-4"
            >
              <Leaf className="text-red-400" size={32} />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">
                Oasis
              </h1>
            </motion.div>
            
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Satellite className="text-cyan-400" size={16} />
              <p className="text-gray-300 text-sm">
                Empowering Cities, Enhancing Health
              </p>
              <Globe className="text-green-400" size={16} />
            </div>
            
            <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          </motion.div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="relative"
            >
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                required
              />
            </motion.div>

            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="relative"
            >
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
                required
              />
            </motion.div>

            {/* Location Dropdown */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="relative"
            >
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-12 py-4 text-white focus:outline-none focus:border-purple-400 transition-colors appearance-none cursor-pointer"
                required
              >
                <option value="" className="bg-gray-900 text-gray-400">Select Your Division</option>
                {bangladeshDivisions.map((division) => (
                  <option key={division} value={division} className="bg-gray-900 text-white">
                    {division}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-purple-400" />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!formData.name || !formData.email || !formData.location}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-4 px-6 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Satellite className="w-5 h-5" />
              <span>Enter Oasis</span>
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-400 text-sm">
              NASA Space Apps Challenge 2025
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}