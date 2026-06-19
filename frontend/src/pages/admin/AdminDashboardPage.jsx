import React from 'react';
import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { People, Assessment, Description, Storage } from '@mui/icons-material';
import StatsCard from '../../components/common/StatsCard';
import GlassCard from '../../components/common/GlassCard';

const recentUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', joinedAt: '2023-10-25', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', joinedAt: '2023-10-24', status: 'Active' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', joinedAt: '2023-10-22', status: 'Inactive' },
];

const AdminDashboardPage = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="800" sx={{ mb: 1 }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Platform overview and system statistics.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Total Users" value={1254} icon={People} color="#bb86fc" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Interviews Conducted" value={8432} icon={Assessment} color="#03dac6" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Resumes Analyzed" value={3210} icon={Description} color="#ff4081" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="API Requests" value="1.2M" icon={Storage} color="#ffd740" />
        </Grid>
      </Grid>

      <GlassCard>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
          Recent Registrations
        </Typography>
        <TableContainer component={Box} sx={{ bgcolor: 'transparent' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'text.secondary', borderBottomColor: 'rgba(255,255,255,0.1)' }}>Name</TableCell>
                <TableCell sx={{ color: 'text.secondary', borderBottomColor: 'rgba(255,255,255,0.1)' }}>Email</TableCell>
                <TableCell sx={{ color: 'text.secondary', borderBottomColor: 'rgba(255,255,255,0.1)' }}>Joined Date</TableCell>
                <TableCell sx={{ color: 'text.secondary', borderBottomColor: 'rgba(255,255,255,0.1)' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell sx={{ borderBottomColor: 'rgba(255,255,255,0.05)' }}>{user.name}</TableCell>
                  <TableCell sx={{ borderBottomColor: 'rgba(255,255,255,0.05)' }}>{user.email}</TableCell>
                  <TableCell sx={{ borderBottomColor: 'rgba(255,255,255,0.05)' }}>{user.joinedAt}</TableCell>
                  <TableCell sx={{ borderBottomColor: 'rgba(255,255,255,0.05)' }}>
                    <Chip 
                      label={user.status} 
                      size="small" 
                      color={user.status === 'Active' ? 'success' : 'default'} 
                      variant="outlined" 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </GlassCard>
    </Box>
  );
};

export default AdminDashboardPage;
