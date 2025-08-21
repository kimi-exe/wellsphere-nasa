'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  Bell,
  Calendar,
  MapPin,
  Zap
} from 'lucide-react';
import { Line, Scatter } from 'react-chartjs-2';
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

export default function EarthquakePage() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [earthquakeData, setEarthquakeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      const user = JSON.parse(stored);
      setUserInfo(user);
      fetchEarthquakeData(user.location);
    }
  }, []);

  const fetchEarthquakeData = async (location: string) => {
    setLoading(true);
    try {
      // Fetch real USGS earthquake data
      const response = await fetch(`/api/earthquake?location=${location}`);
      if (response.ok) {
        const data = await response.json();
        setEarthquakeData(data);
      } else {
        setEarthquakeData(generateMockData());
      }
    } catch (error) {
      console.error('Error fetching earthquake data:', error);
      setEarthquakeData(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyEvents = [2, 1, 3, 1, 0, 2, 1, 2, 3, 1, 2, 1];
    const magnitudes = [3.2, 2.8, 3.5, 2.9, 0, 3.1, 2.7, 3.0, 3.4, 2.6, 3.3, 2.5];
    
    return {
      historical: {
        months,
        monthlyEvents,
        averageMagnitude: magnitudes,
        totalEvents: 19,
        maxMagnitude: 3.5,
        trend: 'stable'
      },
      recent: [
        {
          id: 1,
          magnitude: 3.2,
          location: 'Near Chittagong',
          depth: 15.2,
          time: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
          distance: 45.3
        },
        {
          id: 2,
          magnitude: 2.8,
          location: 'Bay of Bengal',
          depth: 22.5,
          time: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
          distance: 78.1
        },
        {
          id: 3,
          magnitude: 3.1,
          location: 'Near Sylhet',
          depth: 18.7,
          time: new Date(Date.now() - 86400000 * 8).toISOString(), // 8 days ago
          distance: 92.4
        }
      ],
      risk: {
        level: 'low',
        probability: 15,
        nextExpected: 'Within 30 days',
        preparedness: 78
      },
      alerts: [
        {
          id: 1,
          type: 'info',
          message: 'Minor seismic activity detected 45km from your location',
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ]
    };
  };

  const lineChartData = {
    labels: earthquakeData?.historical.months || [],
    datasets: [
      {
        label: 'Number of Events',
        data: earthquakeData?.historical.monthlyEvents || [],
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Average Magnitude',
        data: earthquakeData?.historical.averageMagnitude || [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  const scatterData = {
    datasets: [
      {
        label: 'Earthquake Events',
        data: earthquakeData?.recent?.map((eq: any, index: number) => ({
          x: index + 1,
          y: eq.magnitude,
          depth: eq.depth
        })) || [],
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgb(239, 68, 68)',
        pointRadius: 8,
        pointHoverRadius: 12
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
          text: 'Month',
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
          text: 'Number of Events',
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
          text: 'Magnitude',
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
        text: 'Monthly Earthquake Activity',
        color: 'white',
        font: {
          size: 16
        }
      }
    }
  };

  const scatterOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Event Number',
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
        title: {
          display: true,
          text: 'Magnitude',
          color: 'white'
        },
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
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
        text: 'Recent Earthquake Magnitudes',
        color: 'white',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context: any) {
            const dataPoint = context.raw;
            return `Depth: ${dataPoint.depth}km`;
          }
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
          type: 'earthquake',
          message: 'Earthquake monitoring alert',
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

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400';
      case 'moderate': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading earthquake data...</div>
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
              <Activity className="text-orange-400" size={32} />
              <div>
                <h1 className="text-3xl font-bold">Earthquake Monitor</h1>
                <p className="text-gray-400">
                  Seismic activity tracking for {userInfo?.location}
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
                  : 'bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30'
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
              <Activity className="text-orange-400" size={24} />
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-400">
                  {earthquakeData?.historical?.totalEvents || 0}
                </p>
                <p className="text-xs text-gray-400">Total Events (12m)</p>
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
              <Zap className="text-red-400" size={24} />
              <div className="text-right">
                <p className="text-2xl font-bold text-red-400">
                  {earthquakeData?.historical?.maxMagnitude || 'N/A'}
                </p>
                <p className="text-xs text-gray-400">Max Magnitude</p>
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
                <p className={`text-2xl font-bold capitalize ${getRiskColor(earthquakeData?.risk?.level)}`}>
                  {earthquakeData?.risk?.level || 'N/A'}
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
              <TrendingUp className="text-blue-400" size={24} />
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-400">
                  {earthquakeData?.risk?.preparedness || 0}%
                </p>
                <p className="text-xs text-gray-400">Preparedness</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Historical Trends */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Historical Activity</h2>
            {earthquakeData && (
              <div className="h-80">
                <Line data={lineChartData} options={chartOptions} />
              </div>
            )}
          </motion.div>

          {/* Recent Events Scatter */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Recent Events</h2>
            {earthquakeData && (
              <div className="h-80">
                <Scatter data={scatterData} options={scatterOptions} />
              </div>
            )}
          </motion.div>
        </div>

        {/* Map and Recent Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Seismic Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Seismic Activity Map</h2>
              <MapPin className="text-orange-400" size={20} />
            </div>
            <div className="h-80 bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20"></div>
              <div className="relative z-10 text-center">
                <MapPin className="text-orange-400 mx-auto mb-2" size={48} />
                <p className="text-lg font-semibold mb-2">{userInfo?.location}</p>
                <p className="text-gray-400 text-sm mb-4">
                  Regional seismic activity monitoring
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm">High Activity Zone</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Moderate Activity Zone</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Low Activity Zone</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Events List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Recent Earthquakes</h2>
            <div className="space-y-4">
              {earthquakeData?.recent?.map((eq: any) => (
                <motion.div
                  key={eq.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Activity className="text-orange-400" size={16} />
                      <span className="font-medium text-orange-400">
                        M{eq.magnitude}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(eq.time).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-white text-sm mb-1">{eq.location}</p>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Depth: {eq.depth}km</span>
                    <span>Distance: {eq.distance}km</span>
                  </div>
                </motion.div>
              )) || (
                <p className="text-gray-400">No recent earthquakes recorded</p>
              )}
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
            <span>Seismic Alerts</span>
          </h2>
          <div className="space-y-3">
            {earthquakeData?.alerts?.map((alert: any) => (
              <div
                key={alert.id}
                className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg"
              >
                <p className="text-orange-400 font-medium">{alert.message}</p>
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