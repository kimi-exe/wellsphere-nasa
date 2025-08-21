'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, 
  Trophy, 
  Star,
  CheckCircle,
  XCircle,
  RefreshCw,
  Award,
  Brain,
  Target,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function GamePage() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('menu'); // menu, playing, finished
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStats, setGameStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    streakBest: 0,
    currentStreak: 0
  });

  const questions = [
    {
      id: 1,
      category: "Air Quality",
      question: "What is the primary component measured in PM2.5?",
      image: "🌫️",
      options: [
        "Particulate matter smaller than 2.5 micrometers",
        "Particles larger than 2.5 millimeters", 
        "Chemical compounds with 2.5 atoms",
        "Air pressure at 2.5 altitude"
      ],
      correct: 0,
      explanation: "PM2.5 refers to fine particulate matter with diameter less than 2.5 micrometers. These tiny particles can penetrate deep into lungs and cause health issues."
    },
    {
      id: 2,
      category: "Climate Change",
      question: "Which greenhouse gas has the highest concentration in the atmosphere?",
      image: "🌍",
      options: [
        "Methane (CH4)",
        "Carbon Dioxide (CO2)",
        "Nitrous Oxide (N2O)",
        "Fluorinated gases"
      ],
      correct: 1,
      explanation: "Carbon dioxide (CO2) makes up about 76% of total greenhouse gas emissions, primarily from burning fossil fuels."
    },
    {
      id: 3,
      category: "Water Quality",
      question: "What pH level indicates neutral water?",
      image: "💧",
      options: [
        "pH 5",
        "pH 7",
        "pH 9",
        "pH 11"
      ],
      correct: 1,
      explanation: "pH 7 is neutral. Values below 7 are acidic, and values above 7 are alkaline. Most drinking water should be between 6.5-8.5 pH."
    },
    {
      id: 4,
      category: "Biodiversity",
      question: "What percentage of Earth's species are estimated to live in tropical rainforests?",
      image: "🌳",
      options: [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      correct: 2,
      explanation: "Despite covering only 6% of Earth's surface, tropical rainforests are home to approximately 75% of all plant and animal species."
    },
    {
      id: 5,
      category: "Urban Planning",
      question: "What is the Urban Heat Island effect?",
      image: "🏙️",
      options: [
        "Cities are cooler than rural areas",
        "Cities are warmer than surrounding areas",
        "Islands in cities are heated",
        "Heat creates islands in cities"
      ],
      correct: 1,
      explanation: "Urban Heat Island effect occurs when cities experience higher temperatures than rural areas due to human activities and infrastructure that absorb and retain heat."
    },
    {
      id: 6,
      category: "Renewable Energy",
      question: "Which renewable energy source has grown fastest in the last decade?",
      image: "⚡",
      options: [
        "Wind power",
        "Solar power",
        "Hydroelectric",
        "Geothermal"
      ],
      correct: 1,
      explanation: "Solar power has experienced the fastest growth, with costs falling by over 80% since 2010, making it the cheapest source of electricity in many regions."
    },
    {
      id: 7,
      category: "Waste Management",
      question: "How long does it take for a plastic bottle to decompose naturally?",
      image: "♻️",
      options: [
        "10 years",
        "50 years",
        "450 years",
        "1000 years"
      ],
      correct: 2,
      explanation: "Plastic bottles can take up to 450 years to decompose naturally. This is why recycling and reducing plastic use is crucial for environmental health."
    },
    {
      id: 8,
      category: "Ecosystems",
      question: "What is the term for species that serve as early warning systems for environmental health?",
      image: "🦋",
      options: [
        "Apex predators",
        "Indicator species",
        "Keystone species",
        "Endemic species"
      ],
      correct: 1,
      explanation: "Indicator species are organisms whose presence, absence, or abundance reflects environmental conditions. They help scientists monitor ecosystem health."
    }
  ];

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      setUserInfo(JSON.parse(stored));
    }

    const savedStats = localStorage.getItem('gameStats');
    if (savedStats) {
      setGameStats(JSON.parse(savedStats));
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0 && !showResult) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState, showResult]);

  const startGame = () => {
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(30);
    setGameStats(prev => ({
      ...prev,
      currentStreak: 0
    }));
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const correct = answerIndex === questions[currentQuestion].correct;
    if (correct) {
      setScore(score + 1);
      setGameStats(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
        currentStreak: prev.currentStreak + 1,
        streakBest: Math.max(prev.streakBest, prev.currentStreak + 1)
      }));
    } else {
      setGameStats(prev => ({
        ...prev,
        currentStreak: 0
      }));
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(30);
      } else {
        endGame();
      }
    }, 3000);
  };

  const handleTimeUp = () => {
    setShowResult(true);
    setGameStats(prev => ({
      ...prev,
      currentStreak: 0
    }));
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(30);
      } else {
        endGame();
      }
    }, 2000);
  };

  const endGame = () => {
    setGameState('finished');
    const newStats = {
      ...gameStats,
      totalQuestions: gameStats.totalQuestions + questions.length
    };
    setGameStats(newStats);
    localStorage.setItem('gameStats', JSON.stringify(newStats));
  };

  const resetGame = () => {
    setGameState('menu');
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(30);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return "🌟 Environmental Expert! Outstanding knowledge!";
    if (percentage >= 70) return "🌱 Eco Warrior! Great environmental awareness!";
    if (percentage >= 50) return "🌍 Earth Defender! Good foundation, keep learning!";
    return "🌿 Eco Explorer! There's room to grow your environmental knowledge!";
  };

  const getProgressColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 70) return "from-green-500 to-emerald-500";
    if (percentage >= 50) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

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
          <div className="flex items-center space-x-3 mb-4">
            <Gamepad2 className="text-green-400" size={32} />
            <div>
              <h1 className="text-3xl font-bold">EcoQuest Challenge</h1>
              <p className="text-gray-400">
                Test your environmental knowledge and learn while playing!
              </p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Menu State */}
          {gameState === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Game Info */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8">
                  <div className="text-center mb-6">
                    <Trophy className="text-yellow-400 mx-auto mb-4" size={64} />
                    <h2 className="text-2xl font-bold mb-2">Environmental Quiz Challenge</h2>
                    <p className="text-gray-400">
                      Test your knowledge about environmental science, climate change, and sustainable living!
                    </p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3 text-sm">
                      <Brain className="text-purple-400" size={20} />
                      <span>8 challenging questions covering key environmental topics</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <Clock className="text-blue-400" size={20} />
                      <span>30 seconds per question to keep you engaged</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <Target className="text-green-400" size={20} />
                      <span>Learn fascinating facts with detailed explanations</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Gamepad2 size={20} />
                    <span>Start EcoQuest</span>
                    <ArrowRight size={20} />
                  </motion.button>
                </div>

                {/* Stats */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8">
                  <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                    <Award className="text-yellow-400" size={24} />
                    <span>Your Statistics</span>
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-1">
                        {gameStats.totalQuestions > 0 
                          ? Math.round((gameStats.correctAnswers / gameStats.totalQuestions) * 100)
                          : 0}%
                      </div>
                      <div className="text-gray-400 text-sm">Overall Accuracy</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">
                          {gameStats.totalQuestions}
                        </div>
                        <div className="text-xs text-gray-400">Questions Answered</div>
                      </div>
                      
                      <div className="text-center p-4 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-purple-400">
                          {gameStats.streakBest}
                        </div>
                        <div className="text-xs text-gray-400">Best Streak</div>
                      </div>
                    </div>

                    {userInfo && (
                      <div className="text-center p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg">
                        <p className="text-green-400 font-medium">Welcome back, {userInfo.name}!</p>
                        <p className="text-gray-400 text-sm">Playing from {userInfo.location}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Playing State */}
          {gameState === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span className={`text-sm font-medium ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                    ⏱️ {timeLeft}s
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 mb-6">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{questions[currentQuestion].image}</div>
                  <div className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
                    {questions[currentQuestion].category}
                  </div>
                  <h2 className="text-2xl font-bold mb-4">
                    {questions[currentQuestion].question}
                  </h2>
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: showResult ? 1 : 1.02 }}
                      whileTap={{ scale: showResult ? 1 : 0.98 }}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        showResult
                          ? index === questions[currentQuestion].correct
                            ? 'border-green-500 bg-green-500/20 text-green-400'
                            : index === selectedAnswer && selectedAnswer !== questions[currentQuestion].correct
                            ? 'border-red-500 bg-red-500/20 text-red-400'
                            : 'border-white/10 bg-white/5 text-gray-400'
                          : 'border-white/20 bg-white/5 text-white hover:border-green-400 hover:bg-green-500/10'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          showResult && index === questions[currentQuestion].correct
                            ? 'border-green-500 bg-green-500'
                            : showResult && index === selectedAnswer && selectedAnswer !== questions[currentQuestion].correct
                            ? 'border-red-500 bg-red-500'
                            : 'border-white/40'
                        }`}>
                          {showResult && index === questions[currentQuestion].correct && (
                            <CheckCircle size={16} className="text-white" />
                          )}
                          {showResult && index === selectedAnswer && selectedAnswer !== questions[currentQuestion].correct && (
                            <XCircle size={16} className="text-white" />
                          )}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4"
                    >
                      <p className="text-blue-400 text-sm">
                        <strong>Explanation:</strong> {questions[currentQuestion].explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Score Display */}
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-full px-6 py-2">
                  <Star className="text-yellow-400" size={20} />
                  <span className="font-medium">Score: {score}/{questions.length}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Finished State */}
          {gameState === 'finished' && (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8">
                <Trophy className="text-yellow-400 mx-auto mb-6" size={80} />
                
                <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
                <p className="text-xl mb-6">{getScoreMessage()}</p>

                {/* Score Circle */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-700 to-gray-600"></div>
                  <div 
                    className={`absolute inset-2 rounded-full bg-gradient-to-r ${getProgressColor()} flex items-center justify-center`}
                  >
                    <span className="text-2xl font-bold text-white">
                      {score}/{questions.length}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">
                      {Math.round((score / questions.length) * 100)}%
                    </div>
                    <div className="text-gray-400 text-sm">Accuracy</div>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">
                      {gameStats.currentStreak}
                    </div>
                    <div className="text-gray-400 text-sm">Final Streak</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <RefreshCw size={20} />
                    <span>Play Again</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetGame}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    Back to Menu
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}