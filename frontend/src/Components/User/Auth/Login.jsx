import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, Paper, Link as MUILink, Container, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { authenticate } from '../../../utils/helpers';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import baseURL from "../../../utils/baseURL";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : '';

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
        setValue,
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: { email: '', password: '' },
    });

    const login = async (data) => {
        const { email, password } = data;
        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.post(`${baseURL}/users/login`, { email, password }, config);
            authenticate(response.data, (redirectPath) => navigate(redirect || redirectPath || '/'));
        } catch (error) {
            // Try to get backend error message if available, else generic
            const message =
                error.response?.data?.message ||
                'Invalid user or password';
            toast.error(message, {
                position: 'bottom-right',
            });
        } finally {
            setLoading(false);
        }
    };

    const onChangeHandler = (name) => (e) => {
        setValue(name, e.target.value);
        trigger(name);
    };

    const onSubmit = (data) => login(data);

    return (
        <>
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    py: 8,
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center" justifyContent="center">
                        {/* Left Side - Login Form */}
                        <Grid item xs={12} md={6} lg={5}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Paper
                                    elevation={3}
                                    sx={{
                                        p: 4,
                                        borderRadius: 4,
                                        bgcolor: 'rgba(19, 19, 19, 0.8)', // Added dark background
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        color: '#fff', // Added white text color
                                    }}
                                >
                                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <FitnessCenterIcon
                                                sx={{
                                                    fontSize: 40,
                                                    mb: 2,
                                                    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                                                    borderRadius: '50%',
                                                    p: 1,
                                                    color: '#fff',
                                                }}
                                            />
                                        </motion.div>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 700,
                                                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                color: 'transparent',
                                            }}
                                        >
                                            Welcome to PSP
                                        </Typography>
                                    </Box>

                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <Box sx={{ mb: 3 }}>
                                            <Controller
                                                name="email"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        placeholder="Email"
                                                        error={!!errors.email}
                                                        helperText={errors.email?.message}
                                                        onChange={onChangeHandler('email')}
                                                        InputProps={{
                                                            startAdornment: <EmailOutlinedIcon sx={{ mr: 1, color: 'rgba(255,255,255,0.7)' }} />,
                                                            sx: {
                                                                color: '#fff',
                                                                '& .MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: 'rgba(255,255,255,0.2)',
                                                                },
                                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: 'rgba(255,255,255,0.3)',
                                                                },
                                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: '#4ECDC4',
                                                                },
                                                            },
                                                        }}
                                                        sx={{
                                                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                                                            '& .MuiFormHelperText-root': { color: '#FF6B6B' },
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Box>

                                        <Box sx={{ mb: 3 }}>
                                            <Controller
                                                name="password"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        type={showPassword ? 'text' : 'password'}
                                                        fullWidth
                                                        placeholder="Password"
                                                        error={!!errors.password}
                                                        helperText={errors.password?.message}
                                                        onChange={onChangeHandler('password')}
                                                        InputProps={{
                                                            startAdornment: <LockOutlinedIcon sx={{ mr: 1, color: 'rgba(255,255,255,0.7)' }} />,
                                                            endAdornment: (
                                                                <IconButton
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                    edge="end"
                                                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                                                >
                                                                    {showPassword ? (
                                                                        <VisibilityOff sx={{ color: 'rgba(255,255,255,0.7)' }} />
                                                                    ) : (
                                                                        <Visibility sx={{ color: 'rgba(255,255,255,0.7)' }} />
                                                                    )}
                                                                </IconButton>
                                                            ),
                                                            sx: {
                                                                color: '#fff',
                                                                '& .MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: 'rgba(255,255,255,0.2)',
                                                                },
                                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: 'rgba(255,255,255,0.3)',
                                                                },
                                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: '#4ECDC4',
                                                                },
                                                            },
                                                        }}
                                                        sx={{
                                                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                                                            '& .MuiFormHelperText-root': { color: '#FF6B6B' },
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                                            <MUILink
                                                href="password/forgot"
                                                sx={{
                                                    color: '#4ECDC4',
                                                    textDecoration: 'none',
                                                    '&:hover': { textDecoration: 'underline' },
                                                }}
                                            >
                                                Forgot Password?
                                            </MUILink>
                                        </Box>

                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                disabled={loading}
                                                sx={{
                                                    background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
                                                    color: '#fff',
                                                    py: 1.5,
                                                    fontSize: '1.1rem',
                                                    fontWeight: 600,
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    '&:hover': {
                                                        background: 'linear-gradient(45deg, #FF8E53, #FF6B6B)',
                                                    },
                                                }}
                                            >
                                                {loading ? 'Signing In...' : 'Sign In'}
                                            </Button>
                                        </motion.div>

                                        {/* <Box sx={{ textAlign: 'center', mt: 3 }}>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                Don't have an account?{' '}
                                                <Link
                                                    to="/register"
                                                    style={{
                                                        color: '#4ECDC4',
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    Sign Up
                                                </Link>
                                            </Typography>
                                        </Box> */}
                                    </form>
                                </Paper>
                            </motion.div>
                        </Grid>

                        {/* Right Side - Image */}
                        <Grid
                            item
                            xs={12}
                            md={6}
                            lg={5}
                            sx={{
                                display: { xs: 'none', md: 'block' },
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Box
                                    component="img"
                                    src={`/images/home-img-1.jpeg`}
                                    alt="Fitness"
                                    sx={{
                                        width: '100%',
                                        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                    }}
                                />
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

export default Login;
