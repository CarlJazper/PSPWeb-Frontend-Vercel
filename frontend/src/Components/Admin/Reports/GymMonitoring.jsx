import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import baseURL from '../../../utils/baseURL';

const GymMonitoring = () => {
  const [activeSessions, setActiveSessions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [logsRes, usersRes] = await Promise.all([
        axios.get(`${baseURL}/logs/get-all-logs`),
        axios.get(`${baseURL}/users/get-all-users`),
      ]);

      const activeLogs = logsRes.data.logs.filter(log => !log.timeOut);
      setActiveSessions(activeLogs);
      setUsers(usersRes.data.users);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const activeUsers = useMemo(() => {
    const uniqueUserIds = [...new Set(activeSessions.map(s => s.userId._id))];
    return uniqueUserIds
      .map(id => users.find(user => user._id === id))
      .filter(Boolean); // Remove undefined users
  }, [activeSessions, users]);

  if (loading) return <CircularProgress size={30} />;

  return (
    <Box sx={{ background: 'rgba(255, 255, 255, 0.1)', p: 2, borderRadius: 2 }}>
      <Typography variant="h6" color="black" mb={2}>
        Current Users in Gym
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        <Chip
          label={`Active: ${activeSessions.length}`}
          color="success"
          variant="outlined"
          sx={{ fontSize: '1.2rem', p: 2 }}
        />
      </Box>

      <Typography variant="subtitle1" color="black" mb={2}>
        Currently Active Users ({activeUsers.length}):
      </Typography>

      <List sx={{ maxHeight: 200, overflowY: 'auto' }}>
        {activeUsers.map(user => {
          const session = activeSessions.find(s => s.userId._id === user._id);
          return (
            <ListItem key={user._id} sx={{ py: 1 }}>
              <ListItemText
                primary={user.name}
                secondary={`Checked in: ${format(parseISO(session.timeIn), 'HH:mm')}`}
                sx={{ color: '#000' }}
              />
              <Chip label="Active Now" color="success" size="small" variant="outlined" />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default GymMonitoring;
