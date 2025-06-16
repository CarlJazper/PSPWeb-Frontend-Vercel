import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Box, Card, CardContent, Typography, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, Select, MenuItem, Snackbar, Alert, Container, Chip, useTheme, alpha,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FaceIcon from "@mui/icons-material/Face";
import baseURL from "../../../utils/baseURL";
import { getUser } from "../../../utils/helpers";

const TrainingSessions = () => {
  const theme = useTheme();
  const user = getUser();
  const [users, setUsers] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const userBranch = user.userBranch || '';
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchActiveUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Step 1: Fetch all availTrainer records (ideally filtered by branch)
      const { data: trainings } = await axios.post(`${baseURL}/availTrainer/get-all-trainers`, { userBranch });

      // Step 2: Check which users have active training
      const active = await Promise.all(
        trainings.map(async ({ userId, coachID, _id }) => {
          try {
            const { data } = await axios.post(`${baseURL}/availTrainer/has-active`, { userBranch });
            console.log(data, 'Data');

            // Find the specific training entry for the current user
            const entry = data.hasActive.find((item) => item.user._id === userId._id);

            return entry
              ? {
                user: entry.user,
                coach: entry.coach,
                sessions: entry.sessions || [],
                trainingId: entry.trainingId,
              }
              : null;
          } catch (err) {
            console.warn("Error checking active training for user:", userId?._id, err);
            return null;
          }
        })
      );

      setUsers(active.filter(Boolean)); // Only users with active training
    } catch (err) {
      console.error("Error fetching active users:", err);
      showSnackbar("Failed to load training sessions", "error");
    } finally {
      setLoading(false);
    }
  }, [userBranch]);

  const fetchCoaches = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/users/get-all-users?role=coach`);
      setCoaches(data.users);
    } catch (err) {
      console.error("Error fetching coaches:", err);
      showSnackbar("Failed to load coaches", "error");
    }
  };

  const handleOpenModal = (id) => {
    setSelectedUserId(id);
    setOpenModal(true);
    fetchCoaches();
  };

  const handleAssignCoach = async () => {
    if (!selectedCoach || !selectedUserId) return;
    setLoading(true);
    try {
      await axios.put(`${baseURL}/availTrainer/${selectedUserId}`, {
        coachID: selectedCoach,
      });
      const coach = coaches.find((c) => c._id === selectedCoach);
      setUsers((prev) =>
        prev.map((u) =>
          u.trainingId === selectedUserId ? { ...u, coach } : u
        )
      );
      showSnackbar("Coach assigned successfully");
      setOpenModal(false);
    } catch (err) {
      console.error("Error assigning coach:", err);
      showSnackbar("Failed to assign coach", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveUsers();
  }, [fetchActiveUsers]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Active Training Sessions
      </Typography>

      <Box sx={{ display: "grid", gap: 3 }}>
        {users.length > 0 ? (
          users.map(({ user, coach, sessions, trainingId }) => (
            <Card
              key={user._id}
              elevation={0}
              sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <FaceIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Client Name</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                  </Box>
                  <Chip label="Active Training" color="success" size="small" sx={{ ml: "auto" }} />
                </Box>

                <Box sx={{ mt: 3 }}>
                  {coach ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                        borderRadius: 2,
                      }}
                    >
                      <PersonIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Assigned Coach
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {coach.name} • {coach.email}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => handleOpenModal(trainingId)}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        py: 1.5,
                        fontWeight: 600,
                      }}
                    >
                      Assign Coach
                    </Button>
                  )}
                </Box>

                {sessions.length > 0 && (
                  <Accordion
                    elevation={0}
                    sx={{
                      mt: 3,
                      "&:before": { display: "none" },
                      bgcolor: "transparent",
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                        borderRadius: 2,
                        "&.Mui-expanded": {
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CalendarTodayIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Training Sessions ({sessions.length})
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                        borderBottomLeftRadius: 2,
                        borderBottomRightRadius: 2,
                      }}
                    >
                      {sessions.map((s, i) => (
                        <Box
                          key={i}
                          sx={{
                            p: 2,
                            "&:not(:last-child)": {
                              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            },
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: theme.palette.text.secondary,
                            }}
                          >
                            <Chip label={`Session ${i + 1}`} size="small" sx={{ mr: 1 }} />
                            {s.dateAssigned && s.timeAssigned ? (
                              <>
                                {new Date(s.dateAssigned).toLocaleDateString()} at{" "}
                                {new Date(s.timeAssigned).toLocaleTimeString()}
                                <Chip
                                  label={s.status}
                                  size="small"
                                  color={s.status === "completed" ? "success" : "default"}
                                  sx={{ ml: 1 }}
                                />
                              </>
                            ) : (
                              <Chip
                                label={
                                  s.status === "waiting"
                                    ? "Waiting for schedule"
                                    : s.status === "pending"
                                      ? "Pending approval"
                                      : "Not scheduled"
                                }
                                size="small"
                                color="warning"
                              />
                            )}
                          </Typography>
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
              No active training sessions found
            </Typography>
          </Box>
        )}
      </Box>

      {/* Assign Coach Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} PaperProps={{ sx: { borderRadius: 3, maxWidth: 500 } }}>
        <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Assign a Coach</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Select
            value={selectedCoach}
            onChange={(e) => setSelectedCoach(e.target.value)}
            fullWidth
            sx={{
              borderRadius: 2,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: alpha(theme.palette.divider, 0.2),
              },
            }}
          >
            {coaches.map(({ _id, name, email }) => (
              <MenuItem key={_id} value={_id}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FaceIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Box>
                    <Typography variant="subtitle2">{name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {email}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenModal(false)} sx={{ borderRadius: 2, fontWeight: 600, textTransform: "none" }}>
            Cancel
          </Button>
          <Button onClick={handleAssignCoach} variant="contained" sx={{ borderRadius: 2, fontWeight: 600, textTransform: "none" }}>
            Assign Coach
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ borderRadius: 2, width: "100%", boxShadow: theme.shadows[3] }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TrainingSessions;
