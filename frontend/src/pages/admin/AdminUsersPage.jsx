import React from 'react';
import { toast } from 'react-hot-toast';
import { Box, Typography, Button, TextField, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { Search, Edit, Delete, PersonAdd } from '@mui/icons-material';
import GlassCard from '../../components/common/GlassCard';

const mockUsers = [
  { id: 1, name: 'Aditya', email: 'aditya@example.com', role: 'ADMIN' },
  { id: 2, name: 'Alice Smith', email: 'alice@example.com', role: 'USER' },
  { id: 3, name: 'Bob Jones', email: 'bob@example.com', role: 'USER' },
];

const AdminUsersPage = () => {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="800" sx={{ mb: 1 }}>
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage platform users, roles, and access.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<PersonAdd />}
          onClick={() => toast.success('Add User functionality simulated!')}
        >
          Add User
        </Button>
      </Box>

      <GlassCard>
        <Box sx={{ mb: 3 }}>
          <TextField
            placeholder="Search users by name or email..."
            variant="outlined"
            size="small"
            sx={{ width: 300, '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.05)' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer component={Box} sx={{ bgcolor: 'transparent' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'text.secondary', borderBottomColor: 'rgba(255,255,255,0.1)' }}>ID</TableCell>
                <TableCell sx={{ color: 'text.secondary', borderBottomColor: 'rgba(255,255,255,0.1)' }}>Name</TableCell>
                <TableCell sx={{ color: 'text.secondary', borderBottomColor: 'rgba(255,255,255,0.1)' }}>Email</TableCell>
                <TableCell sx={{ color: 'text.secondary', borderBottomColor: 'rgba(255,255,255,0.1)' }}>Role</TableCell>
                <TableCell align="right" sx={{ color: 'text.secondary', borderBottomColor: 'rgba(255,255,255,0.1)' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id} hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                  <TableCell sx={{ borderBottomColor: 'rgba(255,255,255,0.05)' }}>{user.id}</TableCell>
                  <TableCell sx={{ borderBottomColor: 'rgba(255,255,255,0.05)' }}>{user.name}</TableCell>
                  <TableCell sx={{ borderBottomColor: 'rgba(255,255,255,0.05)' }}>{user.email}</TableCell>
                  <TableCell sx={{ borderBottomColor: 'rgba(255,255,255,0.05)' }}>{user.role}</TableCell>
                  <TableCell align="right" sx={{ borderBottomColor: 'rgba(255,255,255,0.05)' }}>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => toast.success(`Editing user: ${user.name} (simulation)`)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => toast.error(`Deleted user: ${user.name} (simulation)`)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
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

export default AdminUsersPage;
