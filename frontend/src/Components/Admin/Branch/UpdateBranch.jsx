import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Paper, TextField, Button, Typography, Box, CircularProgress, IconButton, useTheme, alpha, Alert, Snackbar, Grid, } from "@mui/material";
import axios from "axios";
// Import Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SaveIcon from "@mui/icons-material/Save";

import baseURL from "../../../utils/baseURL";

const UpdateBranch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [branch, setBranch] = useState({
    name: "",
    email: "",
    contact: "",
    place: "",
  });
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchBranchDetails();
  }, [id]);

  const fetchBranchDetails = async () => {
    setLoading(true);
    try {
      console.log("Fetching branch with ID:", id);
      const response = await axios.get(`${baseURL}/branch/get-branch/${id}`);
      if (!response.data.branch) {
        throw new Error("Branch not found in response");
      }

      setBranch(response.data.branch);
    } catch (error) {
      console.error("Error fetching branch details", error);
      setSnackbar({
        open: true,
        message: "Error fetching branch details. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setBranch({ ...branch, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axios.put(`${baseURL}/branch/update-branch/${id}`, branch);
      setSnackbar({
        open: true,
        message: "Branch updated successfully!",
        severity: "success",
      });
      setTimeout(() => navigate("/admin/branches"), 2000);
    } catch (error) {
      console.error("Error updating branch", error);
      setSnackbar({
        open: true,
        message: "Error updating branch. Please try again.",
        severity: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Loading branch details...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", p: 2 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          background: theme.palette.background.paper,
          boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 4,
            gap: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
            pb: 2,
          }}
        >
          <IconButton
            onClick={() => navigate("/admin/branches")}
            sx={{
              mr: 1,
              color: theme.palette.text.secondary,
              "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <BusinessIcon sx={{ fontSize: 28, color: theme.palette.primary.main }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Update Branch
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <BusinessIcon sx={{ color: "text.secondary", mt: 2 }} />
                <TextField
                  fullWidth
                  label="Branch Name"
                  name="name"
                  value={branch.name}
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
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <EmailIcon sx={{ color: "text.secondary", mt: 2 }} />
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  value={branch.email}
                  onChange={handleChange}
                  required
                  type="email"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <PhoneIcon sx={{ color: "text.secondary", mt: 2 }} />
                <TextField
                  fullWidth
                  label="Contact Number"
                  name="contact"
                  value={branch.contact}
                  onChange={handleChange}
                  required
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <LocationOnIcon sx={{ color: "text.secondary", mt: 2 }} />
                <TextField
                  fullWidth
                  label="Branch Location"
                  name="place"
                  value={branch.place}
                  onChange={handleChange}
                  required
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/admin/branches")}
                  fullWidth
                  sx={{
                    py: 1.5,
                    textTransform: "none",
                    borderRadius: 2,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={updating}
                  startIcon={updating ? (
                    <CircularProgress
                      size={20}
                      color="inherit"
                      sx={{ mr: 1 }}
                    />
                  ) : (
                    <SaveIcon />
                  )}
                  fullWidth
                  sx={{
                    py: 1.5,
                    textTransform: "none",
                    borderRadius: 2,
                    backgroundColor: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  }}
                >
                  {updating ? "Updating Branch..." : "Update Branch"}
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

export default UpdateBranch;
