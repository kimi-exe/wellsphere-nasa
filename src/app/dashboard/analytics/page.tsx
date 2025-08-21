'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Brain, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Target,
  RefreshCw
} from 'lucide-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      const user = JSON.parse(stored);
      setUserInfo(user);
      loadAnalyticsData(user.location);
    }
  }, []);

  const loadAnalyticsData = async (location: string) => {
    setLoading(true);
    try {
      const [analyticsRes, insightsRes] = await Promise.all([
        fetch(`/api/analytics?location=${location}`),
        fetch(`/api/ai-insights?location=${location}`)
      ]);

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalyticsData(data);
      } else {
        setAnalyticsData(generateMockAnalytics());
      }

      if (insightsRes.ok) {
        const insights = await insightsRes.json();
        setAiInsights(insights);
      } else {
        setAiInsights(generateMockInsights());
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      setAnalyticsData(generateMockAnalytics());
      setAiInsights(generateMockInsights());
    } finally {
      setLoading(false);
    }
  };

  const generateMockAnalytics = () => {
    return {
      overallScore: 76,
      categoryScores: {
        airQuality: 68,
        waterQuality: 82,
        soilHealth: 89,
        climate: 71,
        biodiversity: 77,
        noise: 65
      },
      trends: {
        improving: ['soilHealth', 'waterQuality'],
        declining: ['airQuality', 'noise'],
        stable: ['climate', 'biodiversity']
      },
      riskFactors: [
        { factor: 'Air Pollution', level: 'high', impact: 85 },
        { factor: 'Urban Heat Island', level: 'moderate', impact: 62 },
        { factor: 'Noise Pollution', level: 'high', impact: 78 },
        { factor: 'Flood Risk', level: 'low', impact: 24 }
      ],
      monthlyComparison: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        current: [72, 74, 71, 76, 78, 76],
        average: [70, 71, 69, 73, 75, 74]
      }
    };
  };

  const generateMockInsights = () => {
    return {
      recommendations: [
        {
          id: 1,
          category: 'Air Quality',
          priority: 'high',
          title: 'Implement Green Transportation Initiative',
          description: 'Based on current PM2.5 levels and traffic patterns, implementing electric bus routes could reduce air pollution by 23%.',
          impact: '23% reduction in PM2.5',
          timeline: '6-12 months',
          confidence: 87
        },
        {
          id: 2,
          category: 'Urban Planning',
          priority: 'medium',
          title: 'Expand Urban Green Spaces',
          description: 'Analysis shows optimal locations for new parks that could reduce heat island effect and improve biodiversity.',
          impact: '2.5°C temperature reduction',
          timeline: '12-18 months',
          confidence: 92
        },
        {
          id: 3,
          category: 'Water Management',
          priority: 'high',
          title: 'Smart Water Monitoring System',
          description: 'Historical patterns indicate potential contamination risks. Implementing IoT sensors could prevent 78% of water quality issues.',
          impact: '78% risk reduction',
          timeline: '3-6 months',
          confidence: 85
        }
      ],
      predictions: [
        {
          category: 'Temperature',
          prediction: 'Expect 1.2°C increase in summer peak temperatures by 2026',
          confidence: 89,
          timeframe: '2026'
        },
        {
          category: 'Air Quality',
          prediction: 'AQI likely to improve by 15% with proposed transportation changes',
          confidence: 78,
          timeframe: '2025'
        },
        {
          category: 'Flood Risk',
          prediction: 'Monsoon flooding risk decreased by 12% due to improved drainage',
          confidence: 82,
          timeframe: '2024-2025'
        }
      ],
      correlations: [
        {
          factor1: 'Temperature',
          factor2: 'Air Quality',
          correlation: 0.73,
          insight: 'Higher temperatures strongly correlate with poor air quality'
        },
        {
          factor1: 'Green Space',
          factor2: 'Air Quality',
          correlation: -0.68,
          insight: 'More green spaces significantly improve air quality'
        }
      ]
    };
  };

  const refreshInsights = async () => {
    setRefreshing(true);
    await loadAnalyticsData(userInfo?.location);
    setRefreshing(false);
  };

  const scoreData = {
    labels: ['Air Quality', 'Water Quality', 'Soil Health', 'Climate', 'Biodiversity', 'Noise'],
    datasets: [
      {
        data: analyticsData ? [
          analyticsData.categoryScores.airQuality,
          analyticsData.categoryScores.waterQuality,
          analyticsData.categoryScores.soilHealth,
          analyticsData.categoryScores.climate,
          analyticsData.categoryScores.biodiversity,
          analyticsData.categoryScores.noise
        ] : [],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(249, 115, 22, 0.8)'
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)',
          'rgb(168, 85, 247)',
          'rgb(249, 115, 22)'
        ],
        borderWidth: 2
      }
    ]
  };

  const trendData = {
    labels: analyticsData?.monthlyComparison?.labels || [],
    datasets: [
      {
        label: 'Current Year',
        data: analyticsData?.monthlyComparison?.current || [],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 3,
        tension: 0.4
      },
      {
        label: 'Historical Average',
        data: analyticsData?.monthlyComparison?.average || [],
        backgroundColor: 'rgba(156, 163, 175, 0.2)',
        borderColor: 'rgb(156, 163, 175)',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.4
      }
    ]
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white flex items-center space-x-2">
          <RefreshCw className="animate-spin" size={20} />
          <span>Loading AI analytics...</span>
        </div>
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
              <Brain className="text-purple-400" size={32} />
              <div>
                <h1 className="text-3xl font-bold">AI Analytics</h1>
                <p className="text-gray-400">
                  Intelligent insights and predictions for {userInfo?.location}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshInsights}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
            >
              <RefreshCw className={refreshing ? 'animate-spin' : ''} size={18} />
              <span>Refresh Insights</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Environmental Health Score</h2>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20"></div>
                <div className="absolute inset-2 rounded-full bg-black flex items-center justify-center">
                  <span className="text-4xl font-bold text-purple-400">
                    {analyticsData?.overallScore || 0}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-400">
              Your city's overall environmental health rating out of 100
            </p>
          </div>
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Category Scores */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
            {analyticsData && (
              <div className="h-80">
                <Doughnut 
                  data={scoreData} 
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom' as const,
                        labels: {
                          color: 'white',
                          padding: 20
                        }
                      }
                    }
                  }}
                />
              </div>
            )}
          </motion.div>

          {/* Trend Comparison */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Performance Trends</h2>
            {analyticsData && (
              <div className="h-80">
                <Bar 
                  data={trendData}
                  options={{
                    responsive: true,
                    scales: {
                      x: {
                        ticks: { color: 'white' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                      },
                      y: {
                        ticks: { color: 'white' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                      }
                    },
                    plugins: {
                      legend: {
                        labels: { color: 'white' }
                      }
                    }
                  }}
                />
              </div>
            )}
          </motion.div>
        </div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Lightbulb className="text-yellow-400" size={24} />
            <h2 className="text-2xl font-semibold">AI Recommendations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiInsights?.recommendations?.map((rec: any) => (
              <motion.div
                key={rec.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs px-3 py-1 rounded-full border ${getPriorityColor(rec.priority)}`}>
                    {rec.priority.toUpperCase()}
                  </span>
                  <Target className="text-purple-400" size={20} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{rec.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{rec.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Impact:</span>
                    <span className="text-green-400">{rec.impact}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Timeline:</span>
                    <span className="text-blue-400">{rec.timeline}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Confidence:</span>
                    <span className="text-purple-400">{rec.confidence}%</span>
                  </div>
                </div>
              </motion.div>
            )) || (
              <p className="text-gray-400 col-span-full text-center">Loading recommendations...</p>
            )}
          </div>
        </motion.div>

        {/* Predictions and Risk Factors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* AI Predictions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="text-purple-400" size={20} />
              <h2 className="text-xl font-semibold">AI Predictions</h2>
            </div>
            <div className="space-y-4">
              {aiInsights?.predictions?.map((pred: any, index: number) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-400 font-medium">{pred.category}</span>
                    <span className="text-xs text-gray-400">{pred.confidence}% confidence</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{pred.prediction}</p>
                  <span className="text-xs text-blue-400">{pred.timeframe}</span>
                </div>
              )) || (
                <p className="text-gray-400">Loading predictions...</p>
              )}
            </div>
          </motion.div>

          {/* Risk Factors */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="text-yellow-400" size={20} />
              <h2 className="text-xl font-semibold">Risk Assessment</h2>
            </div>
            <div className="space-y-3">
              {analyticsData?.riskFactors?.map((risk: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{risk.factor}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(risk.level)}`}>
                        {risk.level.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-400">Impact: {risk.impact}%</span>
                    </div>
                  </div>
                  {risk.level === 'high' ? (
                    <TrendingUp className="text-red-400" size={20} />
                  ) : risk.level === 'low' ? (
                    <TrendingDown className="text-green-400" size={20} />
                  ) : (
                    <AlertTriangle className="text-yellow-400" size={20} />
                  )}
                </div>
              )) || (
                <p className="text-gray-400">Loading risk assessment...</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Data Correlations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="text-blue-400" size={20} />
            <h2 className="text-xl font-semibold">Data Correlations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiInsights?.correlations?.map((corr: any, index: number) => (
              <div key={index} className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-400 text-sm font-medium">
                    {corr.factor1} ↔ {corr.factor2}
                  </span>
                  <span className={`text-sm font-bold ${
                    Math.abs(corr.correlation) > 0.7 ? 'text-red-400' :
                    Math.abs(corr.correlation) > 0.5 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {corr.correlation.toFixed(2)}
                  </span>
                </div>
                <p className="text-gray-400 text-xs">{corr.insight}</p>
              </div>
            )) || (
              <p className="text-gray-400 col-span-full text-center">Loading correlations...</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}