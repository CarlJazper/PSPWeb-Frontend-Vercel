import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../Layout/Loader';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';
import { Box, Avatar, Typography, Button, Paper, Grid, Divider, Stack } from '@mui/material';
import baseURL from "../../../utils/baseURL";

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState('');

    const getProfile = async () => {
        // Retrieve token from session storage
        const token = sessionStorage.getItem("token");
        if (!token) {
            console.error("No token found, user not authenticated.");
            return;
        }

        // Retrieve user data from session storage
        const storedUser = sessionStorage.getItem("user");
        if (!storedUser) {
            console.error("No user data found in session storage.");
            return;
        }

        // Parse stored JSON and get the user ID
        const user = JSON.parse(storedUser);
        const userId = user._id; // Extract user ID

        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };

        try {
            const { data } = await axios.get(`${baseURL}/users/get-user/${userId}`, config);
            setUser(data.user); // Store user data in state
            setLoading(false);
        } catch (error) {
            console.error("Error fetching user profile", error);
            toast.error("Failed to load profile. Please try again.", { position: "bottom-center" });
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    if (loading) {
        return <Loader />;
    }
    console.log(user?.image[0].url, "User")
    return (
        <>
            <Box sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    My Profile
                </Typography>

                <Paper elevation={3} sx={{ padding: 4, borderRadius: 3, backgroundColor: '#f9f9f9' }}>
                    <Grid container spacing={4} alignItems="center">
                        {/* Avatar and Edit Profile Button */}
                        <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                            <Avatar
                                src={user.image ? user.image[0].url : ''}
                                alt={user.name}
                                sx={{
                                    width: 150,
                                    height: 150,
                                    margin: '0 auto',
                                }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ marginTop: 3 }}
                                component={Link}
                                to="/me/update"
                            >
                                Edit Profile
                            </Button>
                        </Grid>

                        {/* User Details */}
                        <Grid item xs={12} md={8}>
                            <Stack spacing={2}>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Full Name
                                    </Typography>
                                    <Typography>{user.name}</Typography>
                                </Box>
                                <Divider />
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Email Address
                                    </Typography>
                                    <Typography>{user.email}</Typography>
                                </Box>
                                <Divider />
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Joined On
                                    </Typography>
                                    <Typography>
                                        {user.createdAt
                                            ? String(user.createdAt).substring(0, 10)
                                            : 'N/A'}
                                    </Typography>
                                </Box>
                            </Stack>

                            {/* Buttons */}
                            <Stack direction="row" spacing={2} sx={{ marginTop: 4 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    component={Link}
                                    to="/password/update"
                                >
                                    Change Password
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </>
    );
};

export default Profile;
