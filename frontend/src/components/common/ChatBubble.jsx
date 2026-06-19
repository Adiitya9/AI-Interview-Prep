import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { SmartToy, Person } from '@mui/icons-material';
import { motion } from 'framer-motion';

const ChatBubble = ({ message, sender = 'ai', timestamp }) => {
  const isAI = sender === 'ai';

  return (
    <motion.div
      initial={{ opacity: 0, x: isAI ? -20 : 20, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isAI ? 'row' : 'row-reverse',
          gap: 1.5,
          mb: 2,
          maxWidth: '85%',
          ml: isAI ? 0 : 'auto',
          mr: isAI ? 'auto' : 0,
        }}
      >
        {/* Avatar */}
        <Avatar
          sx={{
            width: 36,
            height: 36,
            flexShrink: 0,
            background: isAI
              ? 'linear-gradient(135deg, #7C3AED, #06B6D4)'
              : 'linear-gradient(135deg, #06B6D4, #10B981)',
            boxShadow: `0 4px 12px ${isAI ? 'rgba(124, 58, 237, 0.3)' : 'rgba(6, 182, 212, 0.3)'}`,
          }}
        >
          {isAI ? <SmartToy sx={{ fontSize: 18 }} /> : <Person sx={{ fontSize: 18 }} />}
        </Avatar>

        {/* Bubble */}
        <Box
          sx={{
            background: isAI
              ? 'rgba(255, 255, 255, 0.06)'
              : 'linear-gradient(135deg, rgba(124, 58, 237, 0.25), rgba(6, 182, 212, 0.15))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${isAI ? 'rgba(255, 255, 255, 0.08)' : 'rgba(124, 58, 237, 0.25)'}`,
            borderRadius: isAI ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
            px: 2.5,
            py: 1.5,
            position: 'relative',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'text.primary',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
            }}
          >
            {message}
          </Typography>
          {timestamp && (
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                opacity: 0.6,
                display: 'block',
                mt: 0.5,
                textAlign: isAI ? 'left' : 'right',
                fontSize: '0.65rem',
              }}
            >
              {timestamp}
            </Typography>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default ChatBubble;
