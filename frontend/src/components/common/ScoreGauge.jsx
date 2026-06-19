import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const ScoreGauge = ({ score = 0, maxScore = 100, label = 'Score', size = 160 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const percentage = (animatedScore / maxScore) * 100;
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    // Reset starting state and parse score
    setAnimatedScore(0);
    const targetScore = typeof score === 'number' ? score : parseFloat(score) || 0;
    if (targetScore <= 0) {
      setAnimatedScore(0);
      return;
    }

    const duration = 1500;
    const steps = 60;
    const increment = targetScore / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, targetScore);
      setAnimatedScore(Math.round(current));
      if (step >= steps) {
        setAnimatedScore(targetScore);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const getColor = () => {
    const targetScore = typeof score === 'number' ? score : parseFloat(score) || 0;
    const pct = (targetScore / maxScore) * 100;
    if (pct >= 80) return '#10B981';
    if (pct >= 60) return '#06B6D4';
    if (pct >= 40) return '#F59E0B';
    if (pct >= 20) return '#F97316';
    return '#EF4444';
  };

  const color = getColor();
  const safeId = label.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Box sx={{ position: 'relative', width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="10"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id={`gauge-gradient-${safeId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={color} />
                <stop offset="100%" stopColor={color === '#10B981' ? '#06B6D4' : color} stopOpacity="0.6" />
              </linearGradient>
              <filter id={`glow-${safeId}`}>
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={`url(#gauge-gradient-${safeId})`}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              filter={`url(#glow-${safeId})`}
              style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
            />
          </svg>

          {/* Center content */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: size * 0.22,
                fontWeight: 800,
                color,
                lineHeight: 1,
              }}
            >
              {animatedScore}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontWeight: 500, fontSize: size * 0.08 }}
            >
              / {maxScore}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="subtitle2"
          sx={{ color: 'text.secondary', fontWeight: 600, textAlign: 'center' }}
        >
          {label}
        </Typography>
      </Box>
    </motion.div>
  );
};

export default ScoreGauge;
