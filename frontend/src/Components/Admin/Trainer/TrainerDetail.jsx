import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Avatar, Card, CardContent, Divider } from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../../../utils/baseURL';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const TrainerDetail = () => {
    const { id } = useParams();
    const [trainer, setTrainer] = useState([]);
    const [rating, setRating] = useState([]);
    const formatDate = (date) => new Date(date).toLocaleDateString();

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const response = await axios.get(`${baseURL}/users/get-user/${id}`);
                setTrainer(response.data.user);
            } catch (error) {
                console.error("Error fetching trainers:", error);
            }
        };
        const fetchRating = async () => {
            try {
                const response = await axios.get(`${baseURL}/users/get-ratings/${id}`);
                setRating(response.data.ratings);
            } catch (error) {
                console.error("Error fetching ratings:", error);
            }
        };

        fetchTrainers();
        fetchRating();
    }, [id]);

    // Rating Data Processing
    const ratingData = [
        { name: '1 Star', value: rating.filter(r => r.rating === 1).length },
        { name: '2 Stars', value: rating.filter(r => r.rating === 2).length },
        { name: '3 Stars', value: rating.filter(r => r.rating === 3).length },
        { name: '4 Stars', value: rating.filter(r => r.rating === 4).length },
        { name: '5 Stars', value: rating.filter(r => r.rating === 5).length },
    ];

    // Pie chart for average rating
    const averageRating = rating.reduce((acc, r) => acc + r.rating, 0) / rating.length || 0;
    const averageData = [
        { name: 'Average Rating', value: averageRating },
        { name: 'Remaining', value: 5 - averageRating },
    ];

    console.log(trainer.image[0].url,'Trainer')

    return (
        <Box sx={{ maxWidth: 1000, margin: 'auto', padding: 3 }}>
            {/* Trainer Profile Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <Avatar
                    sx={{ width: 120, height: 120, marginRight: 3 }}
                    alt={trainer.name}
                    src={trainer.image ? trainer.image[0].url : "https://via.placeholder.com/120"}
                />
                <Box>
                    <Typography variant="h4" sx={{ color: 'white' }}>
                        {trainer.name}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'white' }}>
                        {trainer.role}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                        Member Since: {formatDate(trainer.createdAt)}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ marginBottom: 4, color: 'white' }} />

            {/* Basic Info Section */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ padding: 2, backgroundColor: '#1e1e1e' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>Contact Information</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                <Email sx={{ marginRight: 1, color: 'white' }} />
                                <Typography sx={{ color: 'white' }}>{trainer.email}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                <Phone sx={{ marginRight: 1, color: 'white' }} />
                                <Typography sx={{ color: 'white' }}>{trainer.phone}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocationOn sx={{ marginRight: 1, color: 'white' }} />
                                <Typography sx={{ color: 'white' }}>{trainer.address}, {trainer.city}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Emergency Contact Section */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ padding: 2, backgroundColor: '#1e1e1e' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>Emergency Contact</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                <Phone sx={{ marginRight: 1, color: 'white' }} />
                                <Typography sx={{ color: 'white' }}>{trainer.emergencyContactName} - {trainer.emergencyContactNumber}</Typography>
                            </Box>
                        </CardContent>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>Gym Access</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                <Typography sx={{ color: 'white' }}>General Access: {trainer.generalAccess}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ color: 'white' }}>Other Access: {trainer.otherAccess}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Rating Section */}
            <Box sx={{ marginTop: 4, backgroundColor: '#1e1e1e', padding: 3, borderRadius: 2 }}>
                <Typography variant="h5" sx={{ color: 'white', marginBottom: 2 }}>Trainer Ratings</Typography>
                <Grid container spacing={3} sx={{ marginTop: 2 }}>
                    {/* BarChart for Ratings Distribution */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ backgroundColor: '#2e2e2e', borderRadius: 2, padding: 2 }}>
                            <Typography variant="h6" sx={{ color: 'white', marginBottom: 2 }}>Rating Distribution</Typography>
                            <BarChart width={400} height={300} data={ratingData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </Box>
                    </Grid>

                    {/* PieChart for Average Rating */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{
                            backgroundColor: '#2e2e2e',
                            borderRadius: 2,
                            padding: 2,
                            display: 'flex',  // Enable flexbox
                            justifyContent: 'center', // Center horizontally
                            alignItems: 'center', // Center vertically
                            height: '100%' // Ensure the Box takes full height to center its children properly
                        }}>
                            <Typography variant="h6" sx={{ color: 'white', marginBottom: 2 }}>
                                Average Rating
                            </Typography>
                            <PieChart width={300} height={300}> {/* Adjusted height for better centering */}
                                <Pie
                                    data={averageData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}  // Adjusted radius for better appearance
                                    fill="#8884d8"
                                    label
                                >
                                    <Cell fill="#82ca9d" />
                                    <Cell fill="#ff6f61" />
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default TrainerDetail;