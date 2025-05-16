import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Box, TextField, Button, CircularProgress, Grid, Typography, MenuItem, FormControl, InputLabel, Select, Container } from '@mui/material';
import { errMsg, successMsg, getToken } from '../../../utils/helpers';
import axios from 'axios';
import baseURL from "../../../utils/baseURL";

const UpdateUser = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(true);
    const [isUpdated, setIsUpdated] = useState(false);
    let navigate = useNavigate();

    const { id } = useParams();
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        }
    };

    const getUserDetails = async (id) => {
        try {
            const { data } = await axios.get(`${baseURL}/users/get-user/${id}`, config);
            setUser(data.user);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const updateUser = async (id, userData) => {
        try {
            const { data } = await axios.put(`${baseURL}/users/update/${id}`, userData, config);
            setIsUpdated(data.success);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    useEffect(() => {
        if (user && user._id !== id) {
            getUserDetails(id);
        } else {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }

        if (error) {
            errMsg(error);
            setError('');
        }

        if (isUpdated) {
            successMsg('User updated successfully');
            navigate('/admin/users');
        }
    }, [error, isUpdated, id, user]);

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('role', role);
        updateUser(user._id, formData);
    };

    return (
        <>
            <Box display="flex">
                <Box component="main" flex={1} padding={3}>
                    <Container maxWidth="sm">
                        <Box sx={{ padding: 4, boxShadow: 3, borderRadius: 2, backgroundColor: 'white' }}>
                            <Typography variant="h4" align="center" gutterBottom>Update User</Typography>
                            <form onSubmit={submitHandler}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Name"
                                            fullWidth
                                            variant="outlined"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Email"
                                            fullWidth
                                            variant="outlined"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            type="email"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth variant="outlined" required>
                                            <InputLabel>Role</InputLabel>
                                            <Select
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                                label="Role"
                                            >
                                                <MenuItem value="user">User</MenuItem>
                                                <MenuItem value="client">Client</MenuItem>
                                                <MenuItem value="coach">Coach</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            type="submit"
                                            color="primary"
                                            disabled={loading}
                                            sx={{
                                                mt: 2,
                                                backgroundColor: '#3f51b5',
                                                '&:hover': { backgroundColor: '#2c387e' }
                                            }}
                                        >
                                            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Update'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Box>
                    </Container>
                </Box>
            </Box>
        </>
    );
};

export default UpdateUser;
