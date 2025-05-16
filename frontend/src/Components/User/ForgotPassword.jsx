import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, CircularProgress, Grid, Typography, Container } from '@mui/material';
import baseURL from "../../utils/baseURL";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const forgotPassword = async (formData) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            const { data } = await axios.post(`${baseURL}/password/forgot`, formData, config);
            console.log(data.message);

            setLoading(false);
            toast.success(data.message, {
                position: 'bottom-center'
            });
            navigate('/login');
        } catch (error) {
            toast.error(error.response.data.message, {
                position: 'top-right'
            });
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('email', email);
        forgotPassword(formData);
    };

    return (
        <>
            <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Box 
                    sx={{ 
                        width: '100%', 
                        padding: 4, 
                        boxShadow: 3, 
                        borderRadius: 2, 
                        backgroundColor: 'white' 
                    }}>
                    <Typography variant="h4" align="center" gutterBottom>Forgot Password</Typography>
                    <form onSubmit={submitHandler}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Enter Email"
                                    fullWidth
                                    variant="outlined"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    type="submit"
                                    disabled={loading}
                                    sx={{
                                        backgroundColor: '#3f51b5',
                                        '&:hover': { backgroundColor: '#2c387e' }
                                    }}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} sx={{ color: 'white' }} />
                                    ) : (
                                        'Send Email'
                                    )}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Container>
        </>
    );
};

export default ForgotPassword;
