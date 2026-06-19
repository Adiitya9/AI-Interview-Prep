import React from 'react';
import { toast } from 'react-hot-toast';
import { Box, Typography, Grid, TextField, Button, Avatar } from '@mui/material';
import GlassCard from '../../components/common/GlassCard';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="800" sx={{ mb: 1 }}>
          Profile Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Update your personal information and preferences.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <GlassCard sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Avatar sx={{ width: 120, height: 120, bgcolor: 'primary.main', fontSize: '3rem', mb: 2 }}>
              {user?.fullName?.charAt(0) || 'U'}
            </Avatar>
            <Typography variant="h5" fontWeight="bold">{user?.fullName}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{user?.email}</Typography>
            <Typography variant="caption" sx={{ px: 2, py: 0.5, bgcolor: 'rgba(187, 134, 252, 0.1)', color: 'primary.main', borderRadius: 4 }}>
              Role: {user?.role}
            </Typography>
            
            <Button 
              variant="outlined" 
              onClick={() => toast.success('Avatar changes saved (simulation)')}
              sx={{ mt: 4, width: '100%' }}
            >
              Change Avatar
            </Button>
          </GlassCard>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <GlassCard>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Personal Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Full Name" defaultValue={user?.fullName || ''} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email Address" defaultValue={user?.email || ''} disabled />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone Number" defaultValue={user?.phone || ''} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Target Role" placeholder="e.g. Frontend Developer" />
              </Grid>
            </Grid>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => toast.success('Profile changes saved successfully!')}
              >
                Save Changes
              </Button>
            </Box>
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
