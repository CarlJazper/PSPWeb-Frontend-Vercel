import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, IconButton,
    FormControl, InputLabel, Select, MenuItem, Box, Typography,
    Table, TableBody, TableCell, TableHead, TableRow, CircularProgress
} from '@mui/material';
import { Close } from '@mui/icons-material';
import axios from 'axios';
import baseURL from '../../../utils/baseURL';
import { getToken } from '../../../utils/helpers';

const AgeDemographic = ({
    open,
    onClose,
    ageData,
    branchList,
    selectedBranch,
    onBranchChange
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
                params: {
                    min,
                    max,
                    branch: selectedBranch || ''
                },
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
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    Age Demographics
                    <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <FormControl fullWidth sx={{ mb: 2 }}>
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

                    {Object.entries(ageData).map(([group, count]) => {
                        const [min, maxRaw] = group.includes('+')
                            ? [parseInt(group), 120]
                            : group.split('-').map(Number);
                        const max = maxRaw || 120;

                        return (
                            <Box
                                key={group}
                                onClick={() => handleGroupClick(group, min, max)}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    py: 1,
                                    px: 2,
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    '&:hover': { backgroundColor: '#f5f5f5' }
                                }}
                            >
                                <Typography>{group}</Typography>
                                <Typography fontWeight="bold">{count}</Typography>
                            </Box>
                        );
                    })}
                </DialogContent>
            </Dialog>

            <Dialog open={rangeModal.open} onClose={handleCloseUsersModal} fullWidth maxWidth="md">
                <DialogTitle>
                    Users in Age Range: {rangeModal.label}
                    <IconButton onClick={handleCloseUsersModal} sx={{ position: 'absolute', top: 8, right: 8 }}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {loadingUsers ? (
                        <Box display="flex" justifyContent="center" my={4}>
                            <CircularProgress />
                        </Box>
                    ) : userList.length === 0 ? (
                        <Typography>No users found in this age group.</Typography>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Birthdate</TableCell>
                                    <TableCell>Age</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {userList.map(user => {
                                    const age = Math.floor(
                                        (new Date() - new Date(user.birthDate)) / (365.25 * 24 * 60 * 60 * 1000)
                                    );
                                    return (
                                        <TableRow key={user._id}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{new Date(user.birthDate).toLocaleDateString()}</TableCell>
                                            <TableCell>{age}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>

                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AgeDemographic;
