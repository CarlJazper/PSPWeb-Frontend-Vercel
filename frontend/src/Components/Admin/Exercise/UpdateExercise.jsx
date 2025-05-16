import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {TextField,Button,Typography,Container,MenuItem,Select,InputLabel,FormControl,Box,Paper,Grid,IconButton,useTheme,alpha,CircularProgress,Alert,Snackbar,Avatar,Chip,} from "@mui/material";
import axios from "axios";

// Import Icons
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SportsGymnasticsIcon from "@mui/icons-material/SportsGymnastics";
import BuildIcon from "@mui/icons-material/Build";
import SpeedIcon from "@mui/icons-material/Speed";
import DescriptionIcon from "@mui/icons-material/Description";

import baseURL from "../../../utils/baseURL";


const UpdateExercise = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [exercise, setExercise] = useState({
    name: "",
    type: "",
    targetMuscle: "",
    equipmentUsed: "",
    difficulty: "",
    instructions: "",
    images: [],
  });
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchExerciseDetails();
  }, [id]);

  const fetchExerciseDetails = async () => {
    try {
      const res = await axios.get(`${baseURL}/exercises/get-exercise/${id}`);
      const data = res.data.exercise;
      setExercise({
        ...data,
        difficulty: Number(data.difficulty),
        images: data.image || [],
      });
    } catch (err) {
      console.error("Error fetching exercise:", err);
      setSnackbar({
        open: true,
        message: "Error fetching exercise details",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setExercise({
      ...exercise,
      [e.target.name]: e.target.name === "difficulty" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    Object.keys(exercise).forEach((key) => {
      if (key !== "images") {
        formData.append(key, exercise[key]);
      }
    });

    if (newImages.length > 0) {
      newImages.forEach((image) => {
        formData.append("images", image);
      });
    }

    try {
      await axios.put(
        `${baseURL}/exercises/update-exercise/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setSnackbar({
        open: true,
        message: "Exercise updated successfully!",
        severity: "success",
      });
      setTimeout(() => navigate("/admin/exercises"), 2000);
    } catch (err) {
      console.error("Update error:", err);
      setSnackbar({
        open: true,
        message: "Error updating exercise",
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
          Loading exercise details...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, margin: "0 auto", p: 2 }}>
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
            onClick={() => navigate("/admin/exercises")}
            sx={{
              mr: 1,
              color: theme.palette.text.secondary,
              "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <FitnessCenterIcon sx={{ fontSize: 28, color: theme.palette.primary.main }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Update Exercise
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <FitnessCenterIcon sx={{ color: "text.secondary", mt: 2 }} />
                <TextField
                  fullWidth
                  label="Exercise Name"
                  name="name"
                  value={exercise.name}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <SportsGymnasticsIcon sx={{ color: "text.secondary", mt: 2 }} />
                <FormControl fullWidth required>
                  <InputLabel>Type</InputLabel>
                  <Select name="type" value={exercise.type} onChange={handleChange}>
                    <MenuItem value="Strength">Strength</MenuItem>
                    <MenuItem value="Cardio">Cardio</MenuItem>
                    <MenuItem value="Flexibility">Flexibility</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <BuildIcon sx={{ color: "text.secondary", mt: 2 }} />
                <TextField
                  fullWidth
                  label="Target Muscle"
                  name="targetMuscle"
                  value={exercise.targetMuscle}
                  onChange={handleChange}
                  required
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <SpeedIcon sx={{ color: "text.secondary", mt: 2 }} />
                <FormControl fullWidth required>
                  <InputLabel>Difficulty</InputLabel>
                  <Select name="difficulty" value={exercise.difficulty} onChange={handleChange}>
                    <MenuItem value={1}>Beginner</MenuItem>
                    <MenuItem value={2}>Intermediate</MenuItem>
                    <MenuItem value={3}>Advanced</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <BuildIcon sx={{ color: "text.secondary", mt: 2 }} />
                <TextField
                  fullWidth
                  label="Equipment Used"
                  name="equipmentUsed"
                  value={exercise.equipmentUsed}
                  onChange={handleChange}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <DescriptionIcon sx={{ color: "text.secondary", mt: 2 }} />
                <TextField
                  fullWidth
                  label="Instructions"
                  name="instructions"
                  value={exercise.instructions}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  required
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              {exercise.images.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                    Current Images
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {exercise.images.map((img, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: 'relative',
                          width: 120,
                          height: 120,
                          borderRadius: 2,
                          overflow: 'hidden',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                      >
                        <img
                          src={img.url}
                          alt={`Exercise ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              <Box
                sx={{
                  border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                }}
              >
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    mb: 2,
                    textTransform: "none",
                    borderRadius: 2,
                  }}
                >
                  Upload New Images
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                <Typography variant="body2" color="text.secondary">
                  Upload multiple images of the exercise
                </Typography>
              </Box>

              {newImages.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    New Images Selected: {newImages.length}
                  </Typography>
                  <Chip
                    label={`${newImages.length} new image${newImages.length > 1 ? 's' : ''} selected`}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/admin/exercises")}
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
                    <CircularProgress size={20} color="inherit" />
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
                  {updating ? "Updating Exercise..." : "Update Exercise"}
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

export default UpdateExercise;
