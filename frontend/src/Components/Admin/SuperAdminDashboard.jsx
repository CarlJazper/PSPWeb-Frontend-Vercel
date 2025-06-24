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
import baseURL from '../../utils/baseURL'; // adjust if needed
import { getToken } from '../../utils/helpers';

const SuperAdminDashboard = () => {
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [fetchingBranches, setFetchingBranches] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/branch/get-all-branches`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setBranches(data.branch || []);
      } catch (error) {
        console.error('Error fetching branches:', error.response?.data?.message || error.message);
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
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2, mx: 3 }}>
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
