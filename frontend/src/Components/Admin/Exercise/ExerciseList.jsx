import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  IconButton,
  Tooltip,
  Chip,
  useTheme,
  alpha,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import axios from "axios";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SportsGymnasticsIcon from "@mui/icons-material/SportsGymnastics";
import baseURL from "../../../utils/baseURL";

const ExerciseList = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/exercises/get-all-exercise`);
      setExercises(response.data.exercises || []);
    } catch (error) {
      console.error("Error fetching exercises", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this exercise?")) {
      try {
        await axios.delete(`${baseURL}/exercises/delete-exercise/${id}`);
        setExercises(exercises.filter((exercise) => exercise._id !== id));
      } catch (error) {
        console.error("Error deleting exercise", error);
      }
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return {
          color: theme.palette.success.main,
          backgroundColor: alpha(theme.palette.success.main, 0.1),
        };
      case "Intermediate":
        return {
          color: theme.palette.warning.main,
          backgroundColor: alpha(theme.palette.warning.main, 0.1),
        };
      case "Advanced":
        return {
          color: theme.palette.error.main,
          backgroundColor: alpha(theme.palette.error.main, 0.1),
        };
      default:
        return {
          color: theme.palette.grey[500],
          backgroundColor: alpha(theme.palette.grey[500], 0.1),
        };
    }
  };

  // DataGrid expects a field called "id" for each row
  const rows = exercises.map((exercise) => ({
    id: exercise._id,
    ...exercise,
  }));

  const columns = [
    {
      field: "name",
      headerName: "Exercise",
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            src={params.row.image?.[0]?.url || ""}
            alt={params.value}
            variant="rounded"
            sx={{
              width: 56,
              height: 56,
              mt:1,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          icon={<SportsGymnasticsIcon />}
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            fontWeight: 500,
          }}
        />
      ),
    },
    {
      field: "targetMuscle",
      headerName: "Target Muscle",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "difficulty",
      headerName: "Difficulty",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            ...getDifficultyColor(params.value),
            fontWeight: 500,
          }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 120,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          <Tooltip title="Edit Exercise">
            <IconButton
              component={Link}
              to={`/admin/update-exercise/${params.row._id}`}
              size="small"
              sx={{
                color: theme.palette.primary.main,
                "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
              }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Exercise">
            <IconButton
              onClick={() => handleDelete(params.row._id)}
              size="small"
              sx={{
                color: theme.palette.error.main,
                "&:hover": { backgroundColor: alpha(theme.palette.error.main, 0.1) },
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mt: 4,
        mb: 4,
        borderRadius: 3,
        background: theme.palette.background.paper,
        boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <FitnessCenterIcon sx={{ fontSize: 28 }} />
          Exercise Library
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/admin/create-exercises"
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            py: 1,
          }}
        >
          Add New Exercise
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 8 }}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            disableSelectionOnClick
            sx={{
              borderRadius: 2,
              background: theme.palette.background.paper,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                fontWeight: 600,
              },
            }}
            getRowHeight={() => 72}
            components={{
              NoRowsOverlay: () => (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 8 }}>
                  <FitnessCenterIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    No exercises found in the library
                  </Typography>
                  <Button
                    component={Link}
                    to="/admin/create-exercises"
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    sx={{ mt: 1, textTransform: "none" }}
                  >
                    Add Your First Exercise
                  </Button>
                </Box>
              ),
            }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default ExerciseList;
