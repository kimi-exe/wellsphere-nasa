'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Bell,
  Calendar,
  MapPin
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

export default function HeatwavePage() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [heatwaveData, setHeatwaveData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      const user = JSON.parse(stored);
      setUserInfo(user);
      fetchHeatwaveData(user.location);
    }
  }, []);

  const fetchHeatwaveData = async (location: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/heatwave?location=${location}`);
      if (response.ok) {
        const data = await response.json();
        setHeatwaveData(data);
      } else {
        setHeatwaveData(generateMockData());
      }
    } catch (error) {
      console.error('Error fetching heatwave data:', error);
      setHeatwaveData(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
    const temperatures = [32.1, 33.5, 35.2, 36.8, 38.1, 39.5];
    const heatwaveDays = [12, 18, 25, 32, 41, 48];
    
    return {
      historical: {
        years,
        maxTemperatures: temperatures,
        heatwaveDays,
        trend: 'increasing'
      },
      current: {
        temperature: 39.5,
        heatIndex: 45.2,
        riskLevel: 'high',
        daysInHeatwave: 7,
        forecast: [40.1, 41.2, 38.9, 37.5, 35.8]
      },
      alerts: [
        {
          id: 1,
          type: 'warning',
          message: 'Extreme heat warning in effect for the next 3 days',
          timestamp: new Date().toISOString()
        }
      ]
    };
  };

  const chartData = {
    labels: heatwaveData?.historical.years || [],
    datasets: [
      {
        label: 'Max Temperature (°C)',
        data: heatwaveData?.historical.maxTemperatures || [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Heatwave Days',
        data: heatwaveData?.historical.heatwaveDays || [],
        borderColor: 'rgb(251, 146, 60)',
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
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
          text: 'Temperature (°C)',
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
          text: 'Heatwave Days',
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
        text: 'Historical Heatwave Trends',
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
          type: 'heatwave',
          message: 'Heatwave alert for your area',
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
        <div className="text-white">Loading heatwave data...</div>
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
              <Thermometer className="text-red-400" size={32} />
              <div>
                <h1 className="text-3xl font-bold">Heatwave Monitor</h1>
                <p className="text-gray-400">
                  Real-time and historical heatwave data for {userInfo?.location}
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
                  : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
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
              <Thermometer className="text-red-400" size={24} />
              <div className="text-right">
                <p className="text-2xl font-bold text-red-400">
                  {heatwaveData?.current?.temperature || 'N/A'}°C
                </p>
                <p className="text-xs text-gray-400">Current Temp</p>
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
              <TrendingUp className="text-orange-400" size={24} />
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-400">
                  {heatwaveData?.current?.heatIndex || 'N/A'}°C
                </p>
                <p className="text-xs text-gray-400">Heat Index</p>
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
                <p className="text-2xl font-bold text-yellow-400 capitalize">
                  {heatwaveData?.current?.riskLevel || 'N/A'}
                </p>
                <p className="text-xs text-gray-400">Risk Level</p>
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
              <Calendar className="text-blue-400" size={24} />
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-400">
                  {heatwaveData?.current?.daysInHeatwave || 0}
                </p>
                <p className="text-xs text-gray-400">Days in Heatwave</p>
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
            {heatwaveData && (
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
              <h2 className="text-xl font-semibold">Risk Areas Map</h2>
              <MapPin className="text-red-400" size={20} />
            </div>
            <div className="h-80 bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* Placeholder for Google Maps */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20"></div>
              <div className="relative z-10 text-center">
                <MapPin className="text-red-400 mx-auto mb-2" size={48} />
                <p className="text-lg font-semibold mb-2">{userInfo?.location}</p>
                <p className="text-gray-400 text-sm">
                  Interactive map showing heat risk zones
                </p>
                {/* Risk indicators */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-sm">High Risk Areas</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Moderate Risk Areas</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Low Risk Areas</span>
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
              {heatwaveData?.alerts?.map((alert: any) => (
                <div
                  key={alert.id}
                  className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                >
                  <p className="text-yellow-400 font-medium">{alert.message}</p>
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
              {heatwaveData?.current?.forecast?.map((temp: number, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Thermometer className="text-red-400" size={16} />
                    <span className="text-sm">
                      Day {index + 1}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{temp}°C</span>
                    {temp > 38 ? (
                      <TrendingUp className="text-red-400" size={16} />
                    ) : (
                      <TrendingDown className="text-green-400" size={16} />
                    )}
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