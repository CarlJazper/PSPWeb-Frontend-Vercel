import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Avatar,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { InputAdornment, IconButton } from "@mui/material";
import baseURL from "../../../utils/baseURL";


// Validation Schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  birthDate: yup.date().required("Birth date is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  phone: yup.string().required("Phone number is required"),
  emergencyContactName: yup.string().required("Emergency contact name is required"),
  emergencyContactNumber: yup.string().required("Emergency contact number is required"),
  userBranch: yup.string().required("Branch is required"),
});

const Register = () => {
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.jpg");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);

  // Hook Form setup
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: { userBranch: "" },
  });

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/branch/get-all-branches`);
        setBranches(data.branch);
      } catch (error) {
        toast.error("Failed to load branches");
      }
    };
    fetchBranches();
  }, []);

  const registerUser = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value));
      formData.set("image", avatar);

      const config = { headers: { "Content-Type": "multipart/form-data" } };
      await axios.post(`${baseURL}/users/register`, formData, config);

      toast.success("Registered successfully!");
      navigate("/admin/users");
    } catch (err) {
      setError("server", { type: "manual", message: err.response.data.message });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data) => registerUser(data);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
      setAvatar(file);
    }
  };
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  

  return (
    <>
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={8} lg={7}>
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
                    bgcolor: 'rgba(17, 17, 17, 0.8)',
                    color: '#fff',
                  }}
                >
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <PersonAddIcon
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
                        mb: 3,
                      }}
                    >
                      Create Account
                    </Typography>
                  </Box>

                  <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                    <Grid container spacing={2}>
                      {/* Avatar Preview and Upload */}
                      <Grid item xs={12} sx={{ textAlign: 'center', mb: 2 }}>
                        <Avatar
                          src={avatarPreview}
                          sx={{
                            width: 100,
                            height: 100,
                            margin: '0 auto',
                            mb: 2,
                            border: '4px solid rgba(255,255,255,0.1)',
                          }}
                        />
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<CloudUploadIcon />}
                          sx={{
                            color: '#4ECDC4',
                            borderColor: '#4ECDC4',
                            '&:hover': {
                              borderColor: '#FF6B6B',
                              color: '#FF6B6B',
                            },
                          }}
                        >
                          Upload Photo
                          <input type="file" hidden onChange={handleAvatarChange} accept="image/*" />
                        </Button>
                      </Grid>

                      {/* Form Fields */}
                      {[
                        { name: "name", label: "Name", type: "text" },
                        { name: "email", label: "Email", type: "email" },
                        { name: "password", label: "Password", type: showPassword ? "text" : "password" },

                        { name: "birthDate", label: "Birth Date", type: "date" },
                        { name: "address", label: "Address", type: "text" },
                        { name: "city", label: "City", type: "text" },
                        { name: "phone", label: "Phone", type: "text" },
                        { name: "emergencyContactName", label: "Emergency Contact Name", type: "text" },
                        { name: "emergencyContactNumber", label: "Emergency Contact Number", type: "text" },
                      ].map((field) => (
                        <Grid item xs={12} sm={6} key={field.name}>
                          <Controller
                            name={field.name}
                            control={control}
                            render={({ field: fieldProps }) => (
                              <TextField
                                {...fieldProps}
                                type={field.type}
                                label={field.label}
                                fullWidth
                                error={!!errors[field.name]}
                                helperText={errors[field.name]?.message}
                                InputLabelProps={{
                                  shrink: true,
                                  sx: { color: 'rgba(255,255,255,0.7)' }
                                }}

                                InputProps={{
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
                                  },   ...(field.name === 'password' && {
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          aria-label="toggle password visibility"
                                          onClick={togglePasswordVisibility}
                                          edge="end"
                                          sx={{ color: 'rgba(255,255,255,0.7)' }}
                                        >
                                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }),

                                }}
                              />
                            )}
                          />
                        </Grid>
                      ))}

                      {/* Branch Selection */}
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Branch</InputLabel>
                          <Controller
                            name="userBranch"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                error={!!errors.userBranch}
                                sx={{
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
                                }}
                              >
                                {branches.map(branch => (
                                  <MenuItem key={branch._id} value={branch._id}>
                                    {branch.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                        </FormControl>
                      </Grid>

                      {/* Submit Button */}
                      <Grid item xs={12}>
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
                            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : "Create Account"}
                          </Button>
                        </motion.div>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Register;