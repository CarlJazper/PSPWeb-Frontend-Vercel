import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
  GlobalStyles
} from '@mui/material';
import {
  FitnessCenter,
  AccessTime,
  People
} from '@mui/icons-material';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import baseURL from '../../../utils/baseURL';

const GymMonitoring = () => {
  const [activeSessions, setActiveSessions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const [logsRes, usersRes] = await Promise.all([
        axios.get(`${baseURL}/logs/get-all-logs`),
        axios.get(`${baseURL}/users/get-all-users`)
      ]);

      const active = logsRes.data.logs.filter(log => !log.timeOut);
      setActiveSessions(active);
      setUsers(usersRes.data.users);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load monitoring data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeUsers = useMemo(() => {
    const ids = new Set(activeSessions.map(s => s.userId._id));
    return [...ids].map(id => users.find(user => user._id === id)).filter(Boolean);
  }, [activeSessions, users]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: '20px'
        }}
      >
        <CircularProgress size={40} thickness={3} sx={{ color: '#007AFF' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: '20px'
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: '20px',
        p: 4,
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      <GlobalStyles styles={{
        '@keyframes pulse': {
          '0%': { opacity: 1 },
          '50%': { opacity: 0.5 },
          '100%': { opacity: 1 }
        }
      }} />

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FitnessCenter
            sx={{
              fontSize: '2rem',
              color: '#007AFF',
              mr: 2,
              background: 'rgba(0, 122, 255, 0.1)',
              borderRadius: '12px',
              p: 1
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em'
            }}
          >
            Gym Monitoring
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ color: '#6B7280', fontSize: '1.1rem', fontWeight: 400 }}>
          Real-time tracking of active gym members
        </Typography>
      </Box>

      {/* Stats Card */}
      <Card
        sx={{
          mb: 4,
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <People sx={{ fontSize: '2.5rem', color: '#34C759', mr: 2 }} />
              <Box>
                <Typography variant="h2" sx={{ fontWeight: 800, color: '#1a1a1a', lineHeight: 1, fontSize: '3rem' }}>
                  {activeSessions.length}
                </Typography>
                <Typography variant="body1" sx={{ color: '#6B7280', fontWeight: 500, mt: 0.5 }}>
                  Active Members
                </Typography>
              </Box>
            </Box>

            <Chip
              label="Live"
              sx={{
                background: activeSessions.length > 0 ? 'linear-gradient(135deg, #34C759 0%, #30D158 100%)' : '#ccc',
                color: activeSessions.length > 0 ? 'white' : '#666',
                fontWeight: 600,
                fontSize: '0.9rem',
                px: 2,
                py: 1,
                borderRadius: '20px',
                boxShadow: activeSessions.length > 0 ? '0 4px 12px rgba(52, 199, 89, 0.3)' : 'none',
                '&::before': {
                  content: '""',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: activeSessions.length > 0 ? 'white' : '#999',
                  marginRight: '8px',
                  animation: activeSessions.length > 0 ? 'pulse 2s infinite' : 'none'
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Active Users */}
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 3, letterSpacing: '-0.01em' }}>
          Currently Active ({activeUsers.length})
        </Typography>

        {activeUsers.length === 0 ? (
          <Card
            sx={{
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              textAlign: 'center',
              py: 6
            }}
          >
            <Typography variant="body1" sx={{ color: '#9CA3AF', fontSize: '1.1rem' }}>
              No active members at the moment
            </Typography>
          </Card>
        ) : (
          <Stack spacing={2} sx={{ maxHeight: '400px', overflow: 'auto' }}>
            {activeUsers.map(user => {
              const session = activeSessions.find(s => s.userId._id === user._id);
              return (
                <Card
                  key={user._id}
                  sx={{
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                            mr: 2,
                            fontSize: '1.2rem',
                            fontWeight: 600
                          }}
                        >
                          {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 0.5 }}>
                            {user.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTime sx={{ fontSize: '1rem', color: '#6B7280', mr: 0.5 }} />
                            <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 500 }}>
                              Checked in at {session?.timeIn ? format(parseISO(session.timeIn), 'h:mm a') : '—'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Chip
                        label="Active"
                        size="small"
                        sx={{
                          background: 'rgba(52, 199, 89, 0.1)',
                          color: '#34C759',
                          fontWeight: 600,
                          border: '1px solid rgba(52, 199, 89, 0.2)',
                          borderRadius: '12px'
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default GymMonitoring;
