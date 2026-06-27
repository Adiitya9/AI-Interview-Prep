import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from '@mui/icons-material';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #0F0A1A 0%, #1a0f2e 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated background elements */}
        <Box
          sx={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            top: '-100px',
            right: '-100px',
            animation: 'float 6s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            bottom: '-50px',
            left: '-50px',
            animation: 'float 8s ease-in-out infinite reverse',
          }}
        />

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}</style>

        {/* 404 Display */}
        <Box sx={{ position: 'relative', zIndex: 1, mb: 4 }}>
          <Typography
            sx={{
              fontSize: { xs: '120px', md: '180px' },
              fontWeight: 900,
              background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
              mb: 2,
            }}
          >
            404
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
            <SearchIcon sx={{ fontSize: 40, color: '#a855f7', opacity: 0.7 }} />
            <Typography
              variant="h3"
              sx={{
                color: '#fff',
                fontWeight: 700,
                mb: 0,
              }}
            >
              Page Not Found
            </Typography>
          </Box>

          <Typography
            variant="body1"
            sx={{
              color: '#9ca3af',
              fontSize: '1.1rem',
              mb: 4,
              maxWidth: '500px',
              mx: 'auto',
            }}
          >
            Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on track!
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 6 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/dashboard')}
              sx={{
                background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
                color: '#fff',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #9333ea 0%, #2563eb 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 30px rgba(168, 85, 247, 0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                color: '#a855f7',
                borderColor: '#a855f7',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: 2,
                border: '2px solid',
                '&:hover': {
                  background: 'rgba(168, 85, 247, 0.1)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Back to Login
            </Button>
          </Box>

          {/* Helpful links */}
          <Box sx={{ color: '#6b7280' }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Need help? Try these:
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                onClick={() => navigate('/dashboard')}
                sx={{ color: '#6b7280', textTransform: 'none', fontSize: '0.95rem', '&:hover': { color: '#a855f7' } }}
              >
                Dashboard
              </Button>
              <Button
                onClick={() => navigate('/interview')}
                sx={{ color: '#6b7280', textTransform: 'none', fontSize: '0.95rem', '&:hover': { color: '#a855f7' } }}
              >
                Mock Interview
              </Button>
              <Button
                onClick={() => navigate('/resume')}
                sx={{ color: '#6b7280', textTransform: 'none', fontSize: '0.95rem', '&:hover': { color: '#a855f7' } }}
              >
                Resume Analyzer
              </Button>
              <Button
                onClick={() => navigate('/questions')}
                sx={{ color: '#6b7280', textTransform: 'none', fontSize: '0.95rem', '&:hover': { color: '#a855f7' } }}
              >
                Questions
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
