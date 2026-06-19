import React, { useState } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Link, 
  InputAdornment, 
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Settings } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import GlassCard from '../../components/common/GlassCard';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Settings for API URL
  const [openSettings, setOpenSettings] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard sx={{ p: { xs: 3, md: 5 }, position: 'relative' }} hover={false}>
      <IconButton
        onClick={() => {
          const currentUrl = localStorage.getItem('VITE_API_URL') || import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
          setApiUrl(currentUrl);
          setOpenSettings(true);
        }}
        sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 16, 
          color: 'text.secondary', 
          '&:hover': { color: 'primary.main', transform: 'rotate(45deg)' },
          transition: 'all 0.3s ease'
        }}
        aria-label="api settings"
      >
        <Settings />
      </IconButton>

      <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" align="center">
        Welcome Back
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Enter your credentials to access your account
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1 }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Link component={RouterLink} to="/forgot-password" variant="body2" color="primary">
            Forgot password?
          </Link>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isSubmitting}
          sx={{ py: 1.5, mb: 3, fontWeight: 600, fontSize: '1rem', borderRadius: 2 }}
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
        
        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link component={RouterLink} to="/register" color="primary" fontWeight="600">
              Sign up
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* API Server Settings Dialog */}
      <Dialog 
        open={openSettings} 
        onClose={() => setOpenSettings(false)}
        PaperProps={{
          sx: {
            background: 'rgba(26, 10, 46, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            color: 'text.primary',
            maxWidth: 450,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main' }}>API Server Settings</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary', mb: 2, fontSize: '0.9rem' }}>
            Set a custom backend server URL for this application. This URL is saved locally in your browser.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Backend API Base URL"
            type="url"
            fullWidth
            variant="outlined"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="http://localhost:8080/api/v1"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover fieldset': { borderColor: 'primary.main' },
              },
              '& .MuiInputLabel-root': { color: 'text.secondary' },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setOpenSettings(false)} 
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              localStorage.removeItem('VITE_API_URL');
              setOpenSettings(false);
              toast.success('Reset to default backend URL');
              setTimeout(() => window.location.reload(), 800);
            }} 
            color="warning"
          >
            Reset
          </Button>
          <Button 
            onClick={() => {
              if (apiUrl.trim()) {
                localStorage.setItem('VITE_API_URL', apiUrl.trim());
                toast.success('API Server URL updated');
              } else {
                localStorage.removeItem('VITE_API_URL');
                toast.success('Reset to default API URL');
              }
              setOpenSettings(false);
              setTimeout(() => window.location.reload(), 800);
            }} 
            variant="contained" 
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </GlassCard>
  );
};

export default LoginPage;
