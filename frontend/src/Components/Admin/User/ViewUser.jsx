import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box, Typography, Paper, Avatar, CircularProgress, Button, Grid, Divider, Fade
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from "axios";
import baseURL from "../../../utils/baseURL";

const ViewUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axios.get(`${baseURL}/users/get-user/${id}`);
                setUser(data.user);
            } catch (err) {
                console.error("Error fetching user:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return <Typography color="error">User not found.</Typography>;
    }

    return (
        <Fade in timeout={500}>
            <Box sx={{ maxWidth: 700, mx: "auto", my: 4 }}>
                <Paper sx={{ p: 4, borderRadius: 3 }}>
                    <Button
                        onClick={() => navigate(-1)}
                        startIcon={<ArrowBackIcon />}
                        sx={{ mb: 3 }}
                    >
                        Back
                    </Button>

                    <Box textAlign="center" mb={4}>
                        <Avatar
                            src={user.image?.[0]?.url || "/images/default_avatar.jpg"}
                            sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
                        />

                        <Typography variant="h5" fontWeight={600}>{user.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography><strong>Branch:</strong> {user.userBranch?.name || 'N/A'}</Typography>
                            <Typography><strong>Address:</strong> {user.address || 'N/A'}</Typography>
                            <Typography><strong>City:</strong> {user.city || 'N/A'}</Typography>
                            <Typography><strong>Phone:</strong> {user.phone || 'N/A'}</Typography>
                            <Typography><strong>Role:</strong> {user.role || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography><strong>Subscription Start:</strong>{" "}{user.subscribedDate ? new Date(user.subscribedDate).toLocaleDateString() : "N/A"}</Typography>
                            <Typography><strong>Subscription Expiry:</strong>{" "}{user.subscriptionExpiration ? new Date(user.subscriptionExpiration).toLocaleDateString() : "N/A"}</Typography>
                            <Typography><strong>General Access:</strong> {user.generalAccess || 'N/A'}</Typography>
                            <Typography><strong>Other Access:</strong> {user.otherAccess || 'N/A'}</Typography>
                            <Typography><strong>Emergency Contact:</strong> {user.emergencyContactName || 'N/A'}</Typography>
                            <Typography><strong>Emergency Phone:</strong> {user.emergencyContactNumber || 'N/A'}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Fade>
    );
};

export default ViewUser;
