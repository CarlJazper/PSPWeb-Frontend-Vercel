import React, { useEffect, useState } from 'react';
import {
    Box, Card, CardContent, Typography, Grid, CircularProgress,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import axios from 'axios';
import baseURL from '../../../utils/baseURL';
import { getToken } from '../../../utils/helpers';

const TrainingDemographics = ({ branchList, selectedBranch, onBranchChange }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.post(
                    `${baseURL}/availtrainer/training-demographics`,
                    selectedBranch ? { userBranch: selectedBranch } : {},
                    { headers: { Authorization: `Bearer ${getToken()}` } }
                );
                setData(res.data.trainingDemographics || []);
            } catch (err) {
                console.error("Error fetching training demographics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedBranch]);

    if (loading) return <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>;

    return (
        <Box p={2}>
            <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Filter by Branch</InputLabel>
                <Select
                    value={selectedBranch}
                    label="Filter by Branch"
                    onChange={(e) => onBranchChange(e.target.value)}
                >
                    <MenuItem value="">All Branches</MenuItem>
                    {branchList.map(branch => (
                        <MenuItem key={branch._id} value={branch._id}>
                            {branch.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Typography variant="h5" gutterBottom>
                Training Type Demographics
            </Typography>

            <Grid container spacing={2}>
                {data.map((item, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                        <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6">{item.trainingType}</Typography>

                                {item.users.length > 0 ? (
                                    <>
                                        <Typography color="textSecondary">
                                            Top Gender: <strong>{item.topGender}</strong> ({item.genderCount})
                                        </Typography>
                                        <Typography color="textSecondary">
                                            Avg Age Bracket: <strong>{item.averageAgeBracket}</strong>
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography color="textSecondary">
                                        No users for this training type.
                                    </Typography>
                                )}
                            </CardContent>

                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default TrainingDemographics;
