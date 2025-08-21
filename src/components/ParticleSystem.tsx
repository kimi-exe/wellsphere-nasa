'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

interface ParticleSystemProps {
  count?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  minDuration?: number;
  maxDuration?: number;
}

export default function ParticleSystem({
  count = 30,
  colors = ['#ef4444', '#22c55e', '#06b6d4', '#8b5cf6', '#f59e0b'],
  minSize = 2,
  maxSize = 8,
  minDuration = 8,
  maxDuration = 15
}: ParticleSystemProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      const generateParticles = () => {
        const newParticles: Particle[] = [];
        
        for (let i = 0; i < count; i++) {
          newParticles.push({
            id: i,
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + Math.random() * 100,
            size: minSize + Math.random() * (maxSize - minSize),
            color: colors[Math.floor(Math.random() * colors.length)],
            delay: Math.random() * 5,
            duration: minDuration + Math.random() * (maxDuration - minDuration)
          });
        }
        
        setParticles(newParticles);
      };

      generateParticles();

      // Regenerate particles periodically
      const interval = setInterval(generateParticles, 10000);
      
      return () => clearInterval(interval);
    }
  }, [count, colors, minSize, maxSize, minDuration, maxDuration]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {particles.map((particle) => (
        <motion.div
          key={`${particle.id}-${Date.now()}`}
          className="absolute rounded-full opacity-60"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}80, 0 0 ${particle.size * 4}px ${particle.color}40`,
            filter: 'blur(0.5px)'
          }}
          initial={{
            x: particle.x,
            y: particle.y,
            rotate: 0,
            opacity: 0
          }}
          animate={{
            x: particle.x + (Math.random() - 0.5) * 200,
            y: -100,
            rotate: 360,
            opacity: [0, 0.8, 0.6, 0.4, 0]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: Math.random() * 3
          }}
        />
      ))}
      
      {/* Additional cosmic dust particles */}
      {Array.from({ length: 50 }).map((_, index) => (
        <motion.div
          key={`dust-${index}`}
          className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-30"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
          }}
          animate={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  );
}