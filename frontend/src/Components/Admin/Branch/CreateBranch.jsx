import React, { useState } from "react";
import { TextField, Button, Typography, Grid, Paper, Box, IconButton, useTheme, alpha, CircularProgress, Alert, Snackbar, } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Import Icons
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import PersonIcon from '@mui/icons-material/Person';
import PasswordIcon from '@mui/icons-material/Password'

import baseURL from "../../../utils/baseURL";


const CreateBranch = ({ onBranchCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    place: "",
    admin: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
  });


  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("admin.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        admin: {
          ...prev.admin,
          [field]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await axios.post(`${baseURL}/branch/create-branch`, formData);
    setSnackbar({
      open: true,
      message: "Branch created successfully!",
      severity: "success",
    });
    setFormData({
      name: "",
      email: "",
      contact: "",
      place: "",
      admin: {
        name: "",
        email: "",
        password: "",
        phone: "",
      },
    });
    if (onBranchCreated) onBranchCreated();
    setTimeout(() => navigate("/admin/branches"), 2000);
  } catch (error) {
    console.error("Error creating branch", error);
    const message =
      error?.response?.data?.message ||
      "Error creating branch. Please try again.";

    setSnackbar({
      open: true,
      message,
      severity: "error",
    });
  } finally {
    setLoading(false);
  }
};


  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", p: 2 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          background: theme.palette.background.paper,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)'
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 4,
            gap: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
            pb: 2
          }}
        >
          <IconButton
            onClick={() => navigate("/admin/branches")}
            sx={{
              mr: 1,
              color: theme.palette.text.secondary,
              '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <BusinessIcon sx={{ fontSize: 28, color: theme.palette.primary.main }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Create New Branch
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <BusinessIcon sx={{ color: 'text.secondary', mt: 2 }} />
                <TextField
                  fullWidth
                  label="Branch Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <EmailIcon sx={{ color: 'text.secondary', mt: 2 }} />
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <PhoneIcon sx={{ color: 'text.secondary', mt: 2 }} />
                <TextField
                  fullWidth
                  label="Contact Number"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOnIcon sx={{ color: 'text.secondary', mt: 2 }} />
                <TextField
                  fullWidth
                  label="Branch Location"
                  name="place"
                  value={formData.place}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Box>
            </Grid>
            {/* Admin Part */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 500 }}>
                Admin Details
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <PersonIcon sx={{ color: 'text.secondary', mt: 2 }} />
                <TextField
                  fullWidth
                  label="Admin Name"
                  name="admin.name"
                  value={formData.admin.name}
                  onChange={handleChange}
                  required
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <EmailIcon sx={{ color:'text.secondary', mt: 2 }} />
                <TextField
                  fullWidth
                  label="Admin Email"
                  type="email"
                  name="admin.email"
                  value={formData.admin.email}
                  onChange={handleChange}
                  required
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <PasswordIcon sx={{ color:'text.secondary', mt: 2 }} />
                <TextField
                  fullWidth
                  label="Admin Password"
                  type="password"
                  name="admin.password"
                  value={formData.admin.password}
                  onChange={handleChange}
                  required
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <PhoneIcon sx={{ color:'text.secondary', mt: 2 }} />
                <TextField
                  fullWidth
                  label="Admin Phone"
                  name="admin.phone"
                  value={formData.admin.phone}
                  onChange={handleChange}
                  required
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/admin/branches")}
                  fullWidth
                  sx={{
                    py: 1.5,
                    textTransform: 'none',
                    borderRadius: 2,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  sx={{
                    py: 1.5,
                    textTransform: 'none',
                    borderRadius: 2,
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    }
                  }}
                >
                  {loading ? "Creating..." : "Create Branch"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateBranch;
