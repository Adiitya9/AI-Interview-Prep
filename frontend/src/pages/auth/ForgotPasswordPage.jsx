import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Link, 
  InputAdornment,
  Alert
} from '@mui/material';
import { Email, ArrowBack } from '@mui/icons-material';
import GlassCard from '../../components/common/GlassCard';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);
      // Mock API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage('If an account exists for this email, you will receive password reset instructions.');
      setEmail('');
    } catch (err) {
      setError('Failed to process request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard sx={{ p: { xs: 3, md: 5 } }} hover={false}>
      <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" align="center">
        Reset Password
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Enter your email address and we'll send you a link to reset your password.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {message && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {message}
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
          sx={{ mb: 4 }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isSubmitting}
          sx={{ py: 1.5, mb: 3, fontWeight: 600, fontSize: '1rem', borderRadius: 2 }}
        >
          {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
        </Button>
        
        <Box textAlign="center">
          <Link 
            component={RouterLink} 
            to="/login" 
            color="text.secondary" 
            sx={{ display: 'inline-flex', alignItems: 'center', '&:hover': { color: 'primary.main' } }}
          >
            <ArrowBack fontSize="small" sx={{ mr: 0.5 }} /> Back to login
          </Link>
        </Box>
      </Box>
    </GlassCard>
  );
};

export default ForgotPasswordPage;
