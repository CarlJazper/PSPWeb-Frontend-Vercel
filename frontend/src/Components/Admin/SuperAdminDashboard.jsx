import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Paper,
  Button,
  Stack,
  CircularProgress,
  Fade,
} from '@mui/material';
import axios from 'axios';
import BranchDashboard from './Dashboard';
import Overview from './Reports/Overview';
import baseURL from '../../utils/baseURL';
import { getToken } from '../../utils/helpers';

const SuperAdminDashboard = () => {
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [fetchingBranches, setFetchingBranches] = useState(true);
  const [mostClientsBranch, setMostClientsBranch] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/branch/get-all-branches`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const fetchedBranches = data.branch || [];
        setBranches(fetchedBranches);

        const res = await axios.post(
          `${baseURL}/users/get-all-users`,
          {},
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        const users = res.data.users || [];

        const branchClientCount = {};
        users.forEach(user => {
          if (!user.isDeleted && user.userBranch) {
            const id = user.userBranch._id || user.userBranch;
            branchClientCount[id] = (branchClientCount[id] || 0) + 1;
          }
        });

        const sorted = Object.entries(branchClientCount).sort((a, b) => b[1] - a[1]);

        if (sorted.length > 0) {
          const [topBranchId, count] = sorted[0];
          const branchName = fetchedBranches.find(b => b._id === topBranchId)?.name || 'Unknown';
          setMostClientsBranch({ name: branchName, count });
        }
      } catch (error) {
        console.error('Error fetching data:', error.response?.data?.message || error.message);
      } finally {
        setFetchingBranches(false);
      }
    };

    fetchBranches();
  }, []);

  const handleBranchChange = (event) => {
    const branchId = event.target.value;
    setLoading(true);
    setSelectedBranchId(branchId);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const handleReset = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedBranchId('');
      setLoading(false);
    }, 300);
  };

  return (
    <Box sx={{ minHeight: '100vh', pt: 5 }}>
      <Container maxWidth={false} disableGutters>
        {/* Branch Selector */}
        <Paper elevation={3} sx={{ p: 3, mb: 2, borderRadius: 2, mx: 3 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Select a Branch to view data
          </Typography>

          {fetchingBranches ? (
            <CircularProgress />
          ) : (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <FormControl fullWidth variant="outlined">
                <InputLabel>Select a Branch</InputLabel>
                <Select
                  value={selectedBranchId}
                  onChange={handleBranchChange}
                  label="Select a Branch"
                >
                  <MenuItem value="">-- Select Branch --</MenuItem>
                  {branches.map((branch) => (
                    <MenuItem key={branch._id} value={branch._id}>
                      {branch.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                color="error"
                onClick={handleReset}
                disabled={!selectedBranchId}
              >
                Reset
              </Button>
            </Stack>
          )}
        </Paper>

        {/* Most Clients Info (Only show if NO branch selected) */}
        {!selectedBranchId && !fetchingBranches && mostClientsBranch && (
          <Box
            sx={{
              mx: 3,
              mb: 3,
              px: 3,
              py: 2,
              backgroundColor: '#f9f9f9',
              border: '1px solid #e0e0e0',
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 500, color:"black" }}>
              📈 Branch with Most Clients:
            </Typography>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
              {mostClientsBranch.name} – {mostClientsBranch.count} clients
            </Typography>
          </Box>
        )}

        {/* Conditional Dashboard Rendering */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : selectedBranchId ? (
          <Fade in timeout={300}>
            <Box sx={{ p: 0, m: 0 }}>
              <BranchDashboard branchId={selectedBranchId} />
            </Box>
          </Fade>
        ) : (
          <Fade in timeout={300}>
            <Box sx={{ px: 3 }}>
              <Overview />
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default SuperAdminDashboard;
