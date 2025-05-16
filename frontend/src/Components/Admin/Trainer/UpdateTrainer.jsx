import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Grid,
  IconButton,
  Avatar,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const UpdateTrainer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trainer, setTrainer] = useState({
    name: "",
    email: "",
    image: null,
    previewImage: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const { data } = await axios.get(
          `${baseURL}/users/get-user/${id}`
        );
        setTrainer({
          name: data.user.name,
          email: data.user.email,
          previewImage: data.user.image?.url || "",
        });
      } catch (error) {
        console.error("Error fetching trainer:", error);
        setSnackbar({
          open: true,
          message: "Error fetching trainer details",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [id]);

  const handleChange = (e) => {
    setTrainer({ ...trainer, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTrainer({
        ...trainer,
        image: file,
        previewImage: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    formData.append("name", trainer.name);
    formData.append("email", trainer.email);
    if (trainer.image) {
      formData.append("image", trainer.image);
    }

    try {
      await axios.put(
        `${baseURL}/users/update-trainer/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setSnackbar({
        open: true,
        message: "Trainer updated successfully!",
        severity: "success",
      });
      setTimeout(() => navigate("/admin/trainers"), 2000);
    } catch (error) {
      console.error("Error updating trainer:", error);
      setSnackbar({
        open: true,
        message: "Error updating trainer",
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
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading trainer details...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", p: 2 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <IconButton onClick={() => navigate("/admin/trainers")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 600, ml: 1 }}>
            Update Trainer
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} display="flex" justifyContent="center">
              <Avatar src={trainer.previewImage} sx={{ width: 120, height: 120 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={trainer.name}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={trainer.email}
                onChange={handleChange}
                required
                type="email"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  border: "2px dashed gray",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                }}
              >
                <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                  Upload New Image
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>
                <Typography variant="body2" color="text.secondary">
                  Upload a new profile image
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/admin/trainers")}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={updating}
                  startIcon={updating ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  {updating ? "Updating..." : "Update Trainer"}
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
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateTrainer;
