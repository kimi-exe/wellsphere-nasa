'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Bell,
  Calendar,
  MapPin,
  CloudRain
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function FloodPage() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [floodData, setFloodData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      const user = JSON.parse(stored);
      setUserInfo(user);
      fetchFloodData(user.location);
    }
  }, []);

  const fetchFloodData = async (location: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/flood?location=${location}`);
      if (response.ok) {
        const data = await response.json();
        setFloodData(data);
      } else {
        setFloodData(generateMockData());
      }
    } catch (error) {
      console.error('Error fetching flood data:', error);
      setFloodData(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
    const floodEvents = [3, 2, 5, 7, 4, 6];
    const rainfall = [1200, 1450, 1800, 2100, 1650, 1950];
    
    return {
      historical: {
        years,
        floodEvents,
        annualRainfall: rainfall,
        trend: 'increasing'
      },
      current: {
        riskLevel: 'moderate',
        waterLevel: 4.2,
        rainfall24h: 45.6,
        floodProbability: 35,
        activeFoods: 2,
        forecast: [
          { day: 'Today', probability: 35, rainfall: 45.6 },
          { day: 'Tomorrow', probability: 42, rainfall: 62.3 },
          { day: 'Day 3', probability: 28, rainfall: 31.2 },
          { day: 'Day 4', probability: 15, rainfall: 18.7 },
          { day: 'Day 5', probability: 22, rainfall: 25.4 }
        ]
      },
      alerts: [
        {
          id: 1,
          type: 'warning',
          message: 'Heavy rainfall expected in the next 48 hours',
          timestamp: new Date().toISOString()
        }
      ]
    };
  };

  const chartData = {
    labels: floodData?.historical.years || [],
    datasets: [
      {
        label: 'Flood Events',
        data: floodData?.historical.floodEvents || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Annual Rainfall (mm)',
        data: floodData?.historical.annualRainfall || [],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Year',
          color: 'white'
        },
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Number of Flood Events',
          color: 'white'
        },
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Rainfall (mm)',
          color: 'white'
        },
        ticks: {
          color: 'white'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'white'
        }
      },
      title: {
        display: true,
        text: 'Historical Flood and Rainfall Data',
        color: 'white',
        font: {
          size: 16
        }
      }
    }
  };

  const sendNotification = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userInfo?.email,
          type: 'flood',
          message: 'Flood alert for your area',
          location: userInfo?.location
        }),
      });
      
      if (response.ok) {
        setNotificationSent(true);
        setTimeout(() => setNotificationSent(false), 3000);
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading flood data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Droplets className="text-blue-400" size={32} />
              <div>
                <h1 className="text-3xl font-bold">Flood Monitor</h1>
                <p className="text-gray-400">
                  Flood risk assessment and monitoring for {userInfo?.location}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendNotification}
              disabled={notificationSent}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                notificationSent
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30'
              }`}
            >
              <Bell size={18} />
              <span>{notificationSent ? 'Notification Sent!' : 'Send Alert'}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Current Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Droplets className="text-blue-400" size={24} />
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-400">
                  {floodData?.current?.waterLevel || 'N/A'}m
                </p>
                <p className="text-xs text-gray-400">Water Level</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <CloudRain className="text-cyan-400" size={24} />
              <div className="text-right">
                <p className="text-2xl font-bold text-cyan-400">
                  {floodData?.current?.rainfall24h || 'N/A'}mm
                </p>
                <p className="text-xs text-gray-400">24h Rainfall</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="text-yellow-400" size={24} />
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-400">
                  {floodData?.current?.floodProbability || 0}%
                </p>
                <p className="text-xs text-gray-400">Flood Risk</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Calendar className="text-red-400" size={24} />
              <div className="text-right">
                <p className="text-2xl font-bold text-red-400">
                  {floodData?.current?.activeFoods || 0}
                </p>
                <p className="text-xs text-gray-400">Active Floods</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts and Map Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Historical Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Historical Trends</h2>
            {floodData && (
              <div className="h-80">
                <Line data={chartData} options={chartOptions} />
              </div>
            )}
          </motion.div>

          {/* Risk Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Flood Risk Map</h2>
              <MapPin className="text-blue-400" size={20} />
            </div>
            <div className="h-80 bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20"></div>
              <div className="relative z-10 text-center">
                <MapPin className="text-blue-400 mx-auto mb-2" size={48} />
                <p className="text-lg font-semibold mb-2">{userInfo?.location}</p>
                <p className="text-gray-400 text-sm">
                  Interactive map showing flood-prone areas
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-sm">High Flood Risk</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Moderate Flood Risk</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Low Flood Risk</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Alerts and Forecast */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <AlertTriangle className="text-yellow-400" size={20} />
              <span>Active Alerts</span>
            </h2>
            <div className="space-y-3">
              {floodData?.alerts?.map((alert: any) => (
                <div
                  key={alert.id}
                  className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg"
                >
                  <p className="text-blue-400 font-medium">{alert.message}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              )) || (
                <p className="text-gray-400">No active alerts</p>
              )}
            </div>
          </motion.div>

          {/* 5-Day Forecast */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">5-Day Forecast</h2>
            <div className="space-y-3">
              {floodData?.current?.forecast?.map((forecast: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CloudRain className="text-blue-400" size={16} />
                    <span className="text-sm font-medium">
                      {forecast.day}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{forecast.probability}% risk</p>
                    <p className="text-gray-400 text-sm">{forecast.rainfall}mm rain</p>
                  </div>
                </div>
              )) || (
                <p className="text-gray-400">Forecast data unavailable</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}