import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, IconButton,
    FormControl, InputLabel, Select, MenuItem, Box, Typography,
    Table, TableBody, TableCell, TableHead, TableRow, CircularProgress,
    Paper, TableContainer, Grid, Skeleton, Avatar,
    colors
} from '@mui/material';
import { keyframes } from '@mui/system';
import {
    Close,
    CakeOutlined,
    ChildCare,
    DirectionsRun,
    FitnessCenter,
    PeopleAlt,
    SelfImprovement,
    Elderly,
    Group as GroupIcon
} from '@mui/icons-material';
import axios from 'axios';
import baseURL from '../../../utils/baseURL';
import { getToken } from '../../../utils/helpers';

// A more noticeable fade-in animation
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

// More robust logic for matching icons and colors based on the age range's starting number
const getGroupStyle = (group) => {
    const minAge = parseInt(group, 10);
    if (minAge >= 56) return { icon: <Elderly />, color: colors.orange[600] };
    if (minAge >= 46) return { icon: <SelfImprovement />, color: colors.lightGreen[600] };
    if (minAge >= 36) return { icon: <PeopleAlt />, color: colors.teal[500] };
    if (minAge >= 26) return { icon: <FitnessCenter />, color: colors.cyan[500] };
    if (minAge >= 18) return { icon: <DirectionsRun />, color: colors.lightBlue[500] };
    if (minAge <= 17) return { icon: <ChildCare />, color: colors.purple[400] };
    return { icon: <CakeOutlined />, color: colors.grey[500] };
};

const AgeDemographic = ({
    open,
    onClose,
    ageData,
    branchList,
    selectedBranch,
    onBranchChange,
    loading // IMPORTANT: Pass a loading state from the parent for the skeleton loader
}) => {
    const [userList, setUserList] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [rangeModal, setRangeModal] = useState({ open: false, label: '', min: 0, max: 0 });

    const config = {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    };

    const handleGroupClick = async (label, min, max) => {
        setLoadingUsers(true);
        setRangeModal({ open: true, label, min, max });
        try {
            const res = await axios.get(`${baseURL}/users/by-age-group`, {
                params: { min, max, branch: selectedBranch || '' },
                ...config
            });
            setUserList(res.data.users);
        } catch (error) {
            console.error("Error fetching users by age group:", error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleCloseUsersModal = () => {
        setRangeModal({ open: false, label: '', min: 0, max: 0 });
        setUserList([]);
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CakeOutlined sx={{ mr: 1, color: 'primary.main' }} />
                        Age Demographics
                    </Box>
                    <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Filter by Branch</InputLabel>
                        <Select
                            value={selectedBranch}
                            label="Filter by Branch"
                            onChange={(e) => onBranchChange(e.target.value)}
                        >
                            <MenuItem value="">All Branches</MenuItem>
                            {branchList.map(branch => (
                                <MenuItem key={branch._id} value={branch._id}>{branch.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                        Showing Data for: {
                            selectedBranch
                                ? branchList.find(b => b._id === selectedBranch)?.name || "Selected Branch"
                                : "All Branches"
                        }
                    </Typography>


                    <Grid container spacing={2}>
                        {loading ? (
                            Array.from(new Array(6)).map((_, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
                                </Grid>
                            ))
                        ) : (
                            Object.entries(ageData).map(([group, count], index) => {
                                const { icon, color } = getGroupStyle(group);
                                const [min, maxRaw] = group.includes('+') ? [parseInt(group), 120] : group.split('-').map(Number);
                                const max = maxRaw || 120;

                                return (
                                    <Grid item xs={12} sm={6} md={4} key={group}>
                                        <Paper
                                            elevation={2}
                                            onClick={() => handleGroupClick(group, min, max)}
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                borderRadius: 2,
                                                cursor: 'pointer',
                                                borderLeft: `5px solid ${color}`,
                                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                                opacity: 0,
                                                animation: `${fadeIn} 0.5s ease-out forwards`,
                                                animationDelay: `${index * 100}ms`,
                                                '&:hover': {
                                                    transform: 'scale(1.05)',
                                                    boxShadow: 6,
                                                },
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ bgcolor: color, mr: 2 }}>{icon}</Avatar>
                                                <Typography variant="subtitle1" fontWeight="medium">{group} years</Typography>
                                            </Box>
                                            <Typography variant="h6" fontWeight="bold" color="primary.main">{count}</Typography>
                                        </Paper>
                                    </Grid>
                                );
                            })
                        )}
                    </Grid>
                </DialogContent>
            </Dialog>

            <Dialog open={rangeModal.open} onClose={handleCloseUsersModal} fullWidth maxWidth="md">
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <GroupIcon sx={{ mr: 1, color: 'primary.main' }} />
                        Users in Age Range: {rangeModal.label}
                    </Box>
                    <IconButton onClick={handleCloseUsersModal} sx={{ position: 'absolute', top: 8, right: 8 }}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {loadingUsers ? (
                        <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>
                    ) : userList.length === 0 ? (
                        <Typography variant="h6" align="center" sx={{ p: 4 }}>No users found.</Typography>
                    ) : (
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Birthdate</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Age</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {userList.map((user, index) => {
                                            const age = Math.floor((new Date() - new Date(user.birthDate)) / (365.25 * 24 * 60 * 60 * 1000));
                                            return (
                                                <TableRow hover key={user._id}>
                                                    <TableCell>{user.name}</TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                    <TableCell>{new Date(user.birthDate).toLocaleDateString()}</TableCell>
                                                    <TableCell>{age}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AgeDemographic;
