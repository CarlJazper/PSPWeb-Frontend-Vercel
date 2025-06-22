import React, { useState } from 'react';
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
import BranchDashboard from './Dashboard';

const SuperAdminDashboard = () => {
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBranchChange = (event) => {
    const branchId = event.target.value;
    setLoading(true);
    setSelectedBranchId(branchId);
    setTimeout(() => {
      setLoading(false);
    }, 300); // Matches Fade transition time
  };

  const handleReset = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedBranchId('');
      setLoading(false);
    }, 300); // Smooth exit
  };

  return (
    <Box sx={{ minHeight: '100vh', pt: 5 }}>
      <Container maxWidth={false} disableGutters>
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2, mx: 3 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Super Admin Dashboard
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <FormControl fullWidth variant="outlined">
              <InputLabel>Select a Branch</InputLabel>
              <Select
                value={selectedBranchId}
                onChange={handleBranchChange}
                label="Select a Branch"
              >
                <MenuItem value="">-- Select Branch --</MenuItem>
                <MenuItem value="6720ec077f16b93bd1cf145a">Taguig</MenuItem>
                <MenuItem value="68501d07b27adfe762cf5dc2">Pasay</MenuItem>
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
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Fade in={!!selectedBranchId} timeout={300}>
            <Box sx={{ p: 0, m: 0 }}>
              {selectedBranchId && <BranchDashboard branchId={selectedBranchId} />}
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default SuperAdminDashboard;
