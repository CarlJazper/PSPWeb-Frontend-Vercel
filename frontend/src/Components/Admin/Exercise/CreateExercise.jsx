import React, { useState } from "react";
import {Paper,Typography,TextField,Button,MenuItem,Select,InputLabel,FormControl,Box,Avatar,Grid,IconButton,useTheme,alpha,CircularProgress,Alert,Snackbar,Chip,} from "@mui/material";
import { useNavigate } from "react-router-dom";
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


const CreateExercise = ({ onExerciseCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    targetMuscle: "",
    equipmentUsed: "",
    difficulty: "",
    instructions: "",
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "difficulty" ? Number(value) : value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        formData.images.forEach((file) => {
          data.append("images", file);
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      await axios.post(`${baseURL}/exercises/create-exercise`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSnackbar({
        open: true,
        message: "Exercise created successfully!",
        severity: "success",
      });
      if (onExerciseCreated) onExerciseCreated();
      setTimeout(() => navigate("/admin/exercises"), 2000);
    } catch (error) {
      console.error("Error creating exercise", error);
      setSnackbar({
        open: true,
        message: "Error creating exercise. Please try again.",
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
            Create New Exercise
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
                  value={formData.name}
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
                  <Select name="type" value={formData.type} onChange={handleChange}>
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
                  value={formData.targetMuscle}
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
                  <Select name="difficulty" value={formData.difficulty} onChange={handleChange}>
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
                  value={formData.equipmentUsed}
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
                  value={formData.instructions}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  required
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
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
                  Upload Exercise Images
                  <input type="file" name="images" multiple hidden onChange={handleFileChange} />
                </Button>
                <Typography variant="body2" color="text.secondary">
                  Upload multiple images of the exercise
                </Typography>
              </Box>
            </Grid>

            {imagePreviews.length > 0 && (
              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Image Preview
                  </Typography>
                  <Grid container spacing={2}>
                    {imagePreviews.map((src, index) => (
                      <Grid item key={index}>
                        <Box sx={{ position: "relative" }}>
                          <Avatar
                            src={src}
                            variant="rounded"
                            sx={{
                              width: 100,
                              height: 100,
                              borderRadius: 2,
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => removeImage(index)}
                            sx={{
                              position: "absolute",
                              top: -8,
                              right: -8,
                              backgroundColor: "white",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                              "&:hover": {
                                backgroundColor: alpha(theme.palette.error.main, 0.1),
                              },
                            }}
                          >
                            <DeleteOutlineIcon sx={{ fontSize: 20, color: theme.palette.error.main }} />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Grid>
            )}

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
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
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
                  {loading ? "Creating Exercise..." : "Create Exercise"}
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

export default CreateExercise;
