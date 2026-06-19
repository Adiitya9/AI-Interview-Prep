import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, color = '#7C3AED', trend, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    setDisplayValue(0);
    const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
    if (numericValue <= 0) {
      setDisplayValue(0);
      return;
    }

    const duration = 1500;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, numericValue);
      setDisplayValue(Math.round(current));
      if (step >= steps) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const formatValue = () => {
    if (typeof value === 'string' && value.includes('%')) {
      return `${displayValue}%`;
    }
    return displayValue;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      <Box
        sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
          p: 3,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: `0 8px 32px ${color}26`,
            transform: 'translateY(-3px)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${color}, ${color}80)`,
            borderRadius: '3px 3px 0 0',
          },
        }}
      >
        {/* Background glow */}
        <Box
          sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', fontWeight: 500, mb: 0.5 }}
            >
              {title}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color,
                lineHeight: 1,
              }}
            >
              {formatValue()}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `${color}20`,
              border: `1px solid ${color}30`,
            }}
          >
            {Icon && <Icon sx={{ fontSize: 24, color }} />}
          </Box>
        </Box>

        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
            {trend.direction === 'up' ? (
              <TrendingUp sx={{ fontSize: 18, color: '#10B981' }} />
            ) : (
              <TrendingDown sx={{ fontSize: 18, color: '#EF4444' }} />
            )}
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: trend.direction === 'up' ? '#10B981' : '#EF4444',
              }}
            >
              {trend.value}%
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              vs last week
            </Typography>
          </Box>
        )}
      </Box>
    </motion.div>
  );
};

export default StatsCard;
