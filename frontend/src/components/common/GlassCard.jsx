import React from 'react';
import { Paper } from '@mui/material';
import { motion } from 'framer-motion';

const GlassCard = ({ children, sx, hover = true, delay = 0, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      <Paper
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
          p: 3,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          ...(hover && {
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 32px rgba(124, 58, 237, 0.15)',
              transform: 'translateY(-2px)',
            },
          }),
          ...sx,
        }}
        {...props}
      >
        {children}
      </Paper>
    </motion.div>
  );
};

export default GlassCard;
