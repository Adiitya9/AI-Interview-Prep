import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingOverlay = ({ open = true, message = 'Loading...', fullScreen = true }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            sx={{
              position: fullScreen ? 'fixed' : 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: fullScreen
                ? 'rgba(15, 10, 26, 0.85)'
                : 'rgba(15, 10, 26, 0.6)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              zIndex: 9999,
              gap: 3,
            }}
          >
            {/* Animated spinner */}
            <Box sx={{ position: 'relative' }}>
              <CircularProgress
                size={56}
                thickness={2}
                sx={{
                  color: 'rgba(124, 58, 237, 0.2)',
                }}
              />
              <CircularProgress
                size={56}
                thickness={2}
                sx={{
                  color: '#7C3AED',
                  position: 'absolute',
                  left: 0,
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                    strokeDasharray: '80px, 200px',
                  },
                }}
              />
              {/* Inner glow */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%)',
                  animation: 'pulse 2s ease infinite',
                }}
              />
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.primary',
                  fontWeight: 500,
                  mb: 0.5,
                }}
              >
                {message}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', mt: 1 }}>
                {[0, 1, 2].map((i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#7C3AED',
                      animation: 'dotPulse 1.4s ease infinite',
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
