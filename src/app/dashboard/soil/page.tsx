'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mountain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Bell,
  Leaf,
  MapPin,
  TestTube
} from 'lucide-react';
import { Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SoilPage() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [soilData, setSoilData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      const user = JSON.parse(stored);
      setUserInfo(user);
      fetchSoilData(user.location);
    }
  }, []);

  const fetchSoilData = async (location: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/soil?location=${location}`);
      if (response.ok) {
        const data = await response.json();
        setSoilData(data);
      } else {
        setSoilData(generateMockData());
      }
    } catch (error) {
      console.error('Error fetching soil data:', error);
      setSoilData(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
    const phLevels = [6.8, 6.9, 6.7, 6.6, 6.8, 6.9];
    const organicMatter = [3.2, 3.5, 3.1, 2.8, 3.0, 3.3];
    
    return {
      historical: {
        years,
        phLevels,
        organicMatter,
        nitrogen: [45, 48, 42, 40, 44, 47],
        phosphorus: [28, 30, 25, 23, 26, 29],
        potassium: [180, 185, 175, 170, 178, 182]
      },
      current: {
        ph: 6.9,
        organicMatter: 3.3,
        nitrogen: 47,
        phosphorus: 29,
        potassium: 182,
        moisture: 25.4,
        temperature: 18.2,
        fertility: 'high',
        healthScore: 85
      },
      composition: {
        sand: 40,
        clay: 25,
        silt: 35
      },
      alerts: [
        {
          id: 1,
          type: 'info',
          message: 'Soil fertility levels are optimal for current season',
          timestamp: new Date().toISOString()
        }
      ]
    };
  };

  const trendChartData = {
    labels: soilData?.historical.years || [],
    datasets: [
      {
        label: 'pH Level',
        data: soilData?.historical.phLevels || [],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Organic Matter (%)',
        data: soilData?.historical.organicMatter || [],
        borderColor: 'rgb(139, 69, 19)',
        backgroundColor: 'rgba(139, 69, 19, 0.1)',
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  const radarData = {
    labels: ['Nitrogen', 'Phosphorus', 'Potassium', 'pH', 'Organic Matter', 'Moisture'],
    datasets: [
      {
        label: 'Current Levels',
        data: [
          soilData?.current?.nitrogen || 0,
          soilData?.current?.phosphorus || 0,
          soilData?.current?.potassium || 0,
          (soilData?.current?.ph || 0) * 10, // Scaled for visibility
          (soilData?.current?.organicMatter || 0) * 10,
          soilData?.current?.moisture || 0
        ],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgb(34, 197, 94)',
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(34, 197, 94)'
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
          text: 'pH Level',
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
          text: 'Organic Matter (%)',
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
        text: 'Soil Quality Trends',
        color: 'white',
        font: {
          size: 16
        }
      }
    }
  };

  const radarOptions = {
    responsive: true,
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        pointLabels: {
          color: 'white'
        },
        ticks: {
          color: 'white',
          backdropColor: 'transparent'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'white'
        }
      },
      title: {
        display: true,
        text: 'Soil Composition Analysis',
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
          type: 'soil',
          message: 'Soil quality alert for your area',
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
        <div className="text-white">Loading soil data...</div>
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
              <Mountain className="text-green-400" size={32} />
              <div>
                <h1 className="text-3xl font-bold">Soil Quality Monitor</h1>
                <p className="text-gray-400">
                  Comprehensive soil analysis for {userInfo?.location}
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
                  : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
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
              <TestTube className="text-green-400" size={24} />
              <div className="text-right">
                <p className="text-2xl font-bold text-green-400">
                  {soilData?.current?.ph || 'N/A'}
                </p>
                <p className="text-xs text-gray-400">pH Level</p>
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
              <Leaf className="text-emerald-400" size={24} />
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-400">
                  {soilData?.current?.organicMatter || 'N/A'}%
                </p>
                <p className="text-xs text-gray-400">Organic Matter</p>
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
              <Mountain className="text-yellow-400" size={24} />
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-400">
                  {soilData?.current?.moisture || 'N/A'}%
                </p>
                <p className="text-xs text-gray-400">Moisture</p>
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
              <TrendingUp className="text-blue-400" size={24} />
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-400">
                  {soilData?.current?.healthScore || 'N/A'}
                </p>
                <p className="text-xs text-gray-400">Health Score</p>
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
            {soilData && (
              <div className="h-80">
                <Line data={trendChartData} options={chartOptions} />
              </div>
            )}
          </motion.div>

          {/* Soil Composition Radar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Nutrient Analysis</h2>
            {soilData && (
              <div className="h-80">
                <Radar data={radarData} options={radarOptions} />
              </div>
            )}
          </motion.div>
        </div>

        {/* Soil Quality Map and Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Quality Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Soil Quality Map</h2>
              <MapPin className="text-green-400" size={20} />
            </div>
            <div className="h-80 bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20"></div>
              <div className="relative z-10 text-center">
                <MapPin className="text-green-400 mx-auto mb-2" size={48} />
                <p className="text-lg font-semibold mb-2">{userInfo?.location}</p>
                <p className="text-gray-400 text-sm mb-4">
                  Regional soil quality assessment
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Excellent Soil Quality</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Good Soil Quality</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Poor Soil Quality</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Soil Composition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Soil Composition</h2>
            <div className="space-y-6">
              {/* Composition Bars */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Sand</span>
                    <span className="text-white font-medium">{soilData?.composition?.sand || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-yellow-400 h-3 rounded-full transition-all duration-1000" 
                      style={{ width: `${soilData?.composition?.sand || 0}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Clay</span>
                    <span className="text-white font-medium">{soilData?.composition?.clay || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-orange-400 h-3 rounded-full transition-all duration-1000" 
                      style={{ width: `${soilData?.composition?.clay || 0}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Silt</span>
                    <span className="text-white font-medium">{soilData?.composition?.silt || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-blue-400 h-3 rounded-full transition-all duration-1000" 
                      style={{ width: `${soilData?.composition?.silt || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-2xl font-bold text-green-400">{soilData?.current?.temperature}°C</p>
                  <p className="text-xs text-gray-400">Temperature</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-2xl font-bold text-blue-400 capitalize">{soilData?.current?.fertility}</p>
                  <p className="text-xs text-gray-400">Fertility</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <AlertTriangle className="text-yellow-400" size={20} />
            <span>Soil Health Alerts</span>
          </h2>
          <div className="space-y-3">
            {soilData?.alerts?.map((alert: any) => (
              <div
                key={alert.id}
                className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
              >
                <p className="text-green-400 font-medium">{alert.message}</p>
                <p className="text-gray-400 text-sm mt-1">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
            )) || (
              <p className="text-gray-400">No active alerts</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}