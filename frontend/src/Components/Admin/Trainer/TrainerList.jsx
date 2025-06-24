import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
  Avatar,
  useTheme,
  alpha,
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';  // Correct import
import { EditOutlined, DeleteOutline, PersonAdd, Person } from "@mui/icons-material";
import baseURL from '../../../utils/baseURL'
import { getUser } from "../../../utils/helpers";

const TrainerList = () => {
  const location = useLocation();
  const user = getUser();
  const userBranch = user.role === 'superadmin' && !location.state?.branchId ? null: (location.state?.branchId || user.userBranch);

  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const payload = userBranch ? { userBranch } : {};
        const response = await axios.post(`${baseURL}/users/get-all-users?role=coach`, payload);

        setTrainers(response.data.users);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, [userBranch]);

  const handleDelete = async (trainerId) => {
    if (!window.confirm("Are you sure you want to delete this trainer?")) return;

    try {
      await axios.delete(`${baseURL}/users/delete/${trainerId}`);
      setTrainers((prev) => prev.filter((trainer) => trainer._id !== trainerId));
    } catch (error) {
      console.error("Error deleting trainer:", error);
    }
  };

  console.log(trainers, 'Trainers')

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
          <Person sx={{ fontSize: 28 }} />
          Trainer List
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => navigate("/admin/create-trainer")}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            py: 1,
          }}
        >
          Add Trainer
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 8 }}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <TableContainer sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Trainer</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Address</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>City</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trainers.length > 0 ? (
                trainers.map((trainer) => (
                  <TableRow
                    key={trainer._id}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.02),
                      },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          src={trainer.image[0]?.url || ""}
                          alt={trainer.name}
                          sx={{
                            width: 48,
                            height: 48,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {trainer.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {trainer.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {trainer.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {trainer.address}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {trainer.city}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                        <Tooltip title="Edit Trainer">
                          <IconButton
                            onClick={() => navigate(`/admin/update-trainer/${trainer._id}`)}
                            size="small"
                            sx={{
                              color: theme.palette.primary.main,
                              "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
                            }}
                          >
                            <EditOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Trainer">
                          <IconButton
                            onClick={() => navigate(`/admin/trainer-detail/${trainer._id}`)}
                            size="small"
                            sx={{
                              color: theme.palette.primary.main,
                              "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
                            }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Trainer">
                          <IconButton
                            onClick={() => handleDelete(trainer._id)}
                            size="small"
                            sx={{
                              color: theme.palette.error.main,
                              "&:hover": { backgroundColor: alpha(theme.palette.error.main, 0.1) },
                            }}
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{
                      py: 8,
                      backgroundColor: alpha(theme.palette.primary.main, 0.02),
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                      <Person sx={{ fontSize: 48, color: "text.disabled" }} />
                      <Typography variant="body1" sx={{ color: "text.secondary" }}>
                        No trainers found.
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<PersonAdd />}
                        onClick={() => navigate("/admin/create-trainer")}
                        sx={{ mt: 1, textTransform: "none" }}
                      >
                        Add Your First Trainer
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default TrainerList;
