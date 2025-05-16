import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { getToken } from '../../utils/helpers';
import { Box, Grid, TextField, Button, CircularProgress, Paper, Typography } from '@mui/material';
import baseURL from "../../utils/baseURL";

const UpdatePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isUpdated, setIsUpdated] = useState(false);
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();

    const updatePassword = async (formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            };
            const { data } = await axios.put(`${baseURL}/password/update`, formData, config);
            setIsUpdated(data.success);
            setLoading(false);
            toast.success('Password updated successfully', { position: 'bottom-right' });
            navigate('/me');
        } catch (error) {
            setError(error.response.data.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'bottom-right' });
        }
    }, [error]);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('oldPassword', oldPassword);
        formData.set('password', password);

        setLoading(true);
        updatePassword(formData);
    };

    return (
        <>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                bgcolor="background.default"
                px={2}
            >
                <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, maxWidth: 600, width: '100%' }}>
                    <Typography variant="h5" textAlign="center" fontWeight="bold" mb={3}>
                        Update Password
                    </Typography>
                    <form onSubmit={submitHandler}>
                        <Grid container spacing={3}>
                            {/* Old Password Input */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Old Password"
                                    variant="outlined"
                                    fullWidth
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    error={!!error}
                                    helperText={error ? error : ''}
                                    required
                                />
                            </Grid>

                            {/* New Password Input */}
                            <Grid item xs={12}>
                                <TextField
                                    label="New Password"
                                    variant="outlined"
                                    fullWidth
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    error={!!error}
                                    helperText={error ? error : ''}
                                    required
                                />
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    disabled={loading}
                                    sx={{ height: 50 }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Password'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Box>
        </>
    );
};

export default UpdatePassword;
