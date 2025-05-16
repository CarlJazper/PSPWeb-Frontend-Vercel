import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Typography, TextField, Button, Avatar, CircularProgress, Grid, Paper, } from '@mui/material';

// Validation Schema using Yup
const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup
        .string()
        .email('Enter a valid email')
        .required('Email is required'),
});

const UpdateProfile = () => {
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg');
    const [loading, setLoading] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        trigger,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            email: '',
        },
    });

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
            
            setValue('name', data.user.name);
            setValue('email', data.user.email);
    
            // Check if `avatar` exists before accessing `url`
            if (data.user.image && data.user.image.length > 0) {
                setAvatarPreview(data.user.image[0].url);
            } else {
                setAvatarPreview('/images/default_avatar.jpg'); // Default avatar
            }
    
            setLoading(false);
        } catch (error) {
            console.error("Error fetching user profile", error);
            toast.error("Failed to load profile. Please try again.", { position: "bottom-center" });
        }
    };    

    // const getProfile = async () => {
    //     const config = {
    //         headers: {
    //             Authorization: `Bearer ${getToken()}`,
    //         },
    //     };
    //     try {
    //         const { data } = await axios.get(`${import.meta.env.VITE_API}/me`, config);
    // setValue('name', data.user.name);
    // setValue('email', data.user.email);
    // setAvatarPreview(data.user.avatar.url);
    // setLoading(false);
    //     } catch (error) {
    //         toast.error('User not found', { position: 'bottom-right' });
    //     }
    // };

    const updateProfile = async (userData) => {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${getToken()}`,
            },
        };
        try {
            const { data } = await axios.put(`${baseURL}/users/me/update`, userData, config);
            setIsUpdated(data.success);
            setLoading(false);
            toast.success('Profile updated successfully', { position: 'bottom-right' });
            navigate('/me', { replace: true });
        } catch (error) {
            toast.error('Update failed', { position: 'bottom-right' });
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    const submitHandler = (data) => {
        const formData = new FormData();
        formData.set('name', data.name);
        formData.set('email', data.email);
        formData.set('avatar', avatar);
        updateProfile(formData);
    };

    const onChange = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        };
        reader.readAsDataURL(e.target.files[0]);
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
                        Update Profile
                    </Typography>
                    <form onSubmit={handleSubmit(submitHandler)}>
                        <Grid container spacing={3}>
                            {/* Avatar and Upload */}
                            <Grid item xs={12} display="flex" justifyContent="center">
                                <Box display="flex" alignItems="center" flexDirection="column">
                                    <Avatar
                                        src={avatarPreview}
                                        alt="Avatar Preview"
                                        sx={{ width: 100, height: 100, mb: 2 }}
                                    />
                                    <Button variant="contained" component="label">
                                        Upload Avatar
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={onChange}
                                        />
                                    </Button>
                                </Box>
                            </Grid>
                            {/* Name Input */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Name"
                                    variant="outlined"
                                    fullWidth
                                    {...register('name')}
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    onBlur={() => trigger('name')}
                                    onChange={(e) => {
                                        setValue('name', e.target.value);
                                        trigger('name');
                                    }}
                                />
                            </Grid>
                            {/* Email Input */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    type="email"
                                    {...register('email')}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    onBlur={() => trigger('email')}
                                    onChange={(e) => {
                                        setValue('email', e.target.value);
                                        trigger('email');
                                    }}
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
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Profile'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Box>
        </>
    );
};

export default UpdateProfile;
