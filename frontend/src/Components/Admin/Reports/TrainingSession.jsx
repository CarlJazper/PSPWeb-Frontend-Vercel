import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Box, Card, CardContent, Typography, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, Select, MenuItem, Snackbar, Alert, Container, Chip, useTheme, alpha,
  Avatar, Divider, Grid, Paper, IconButton, Tooltip, Badge
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FaceIcon from "@mui/icons-material/Face";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CloseIcon from "@mui/icons-material/Close";
import EventIcon from "@mui/icons-material/Event";
import baseURL from "../../../utils/baseURL";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { GlobalStyles } from "@mui/material";

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
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon sx={{ fontSize: 16, color: '#4caf50' }} />;
      case 'pending':
        return <PendingIcon sx={{ fontSize: 16, color: '#ff9800' }} />;
      case 'waiting':
        return <HourglassEmptyIcon sx={{ fontSize: 16, color: '#2196f3' }} />;
      default:
        return <EventIcon sx={{ fontSize: 16, color: '#757575' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return { bg: '#e8f5e8', border: '#4caf50', text: '#2e7d32' };
      case 'pending':
        return { bg: '#fff3e0', border: '#ff9800', text: '#ef6c00' };
      case 'waiting':
        return { bg: '#e3f2fd', border: '#2196f3', text: '#1565c0' };
      default:
        return { bg: '#f5f5f5', border: '#757575', text: '#424242' };
    }
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
      const sessionEvents = active
        .filter(Boolean)
        .flatMap(({ user, coach, sessions }) =>
          sessions.map((session, idx) => ({
            title: `${coach?.name || "Unassigned"}`,
            date: session.dateAssigned,
            extendedProps: {
              coach: coach?.name || "Unassigned",
              client: user.name,
              status: session.status,
              time: session.timeAssigned,
              sessionNumber: idx + 1,
              coachEmail: coach?.email || '',
              clientEmail: user.email || ''
            },
            backgroundColor: getStatusColor(session.status).bg,
            borderColor: getStatusColor(session.status).border,
            textColor: getStatusColor(session.status).text,
          }))
        );
      setEvents(sessionEvents);

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
    <>
      <GlobalStyles
        styles={{
          // Modern Calendar Styling
          ".fc": {
            fontFamily: theme.typography.fontFamily,
          },
          ".fc .fc-toolbar": {
            marginBottom: "1.5rem",
            padding: "1rem",
            backgroundColor: "#f8fafc",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
          },
          ".fc .fc-toolbar-title": {
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#1e293b",
            margin: "0 1rem",
          },
          ".fc .fc-button": {
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            color: "#475569",
            fontWeight: "600",
            padding: "0.5rem 1rem",
            transition: "all 0.2s ease",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          },
          ".fc .fc-button:hover": {
            backgroundColor: "#f1f5f9",
            borderColor: "#cbd5e1",
            transform: "translateY(-1px)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          },
          ".fc .fc-button:focus": {
            boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
          },
          ".fc .fc-button-primary": {
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            color: "#ffffff",
          },
          ".fc .fc-button-primary:hover": {
            backgroundColor: theme.palette.primary.dark,
            borderColor: theme.palette.primary.dark,
          },
          ".fc .fc-button-primary:focus": {
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.5)}`,
          },
          ".fc .fc-button:disabled": {
            opacity: 0.6,
            cursor: "not-allowed",
          },
          ".fc .fc-daygrid-day": {
            borderColor: "#f1f5f9",
            transition: "background-color 0.2s ease",
          },
          ".fc .fc-daygrid-day:hover": {
            backgroundColor: "#f8fafc",
          },
          ".fc .fc-daygrid-day.fc-day-today": {
            backgroundColor: "#fef3c7",
            border: "2px solid #f59e0b",
            borderRadius: "8px",
            position: "relative",
          },
          ".fc .fc-day-today .fc-daygrid-day-number": {
            fontWeight: "700",
            color: "#d97706",
            backgroundColor: "#fbbf24",
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "4px",
          },
          ".fc .fc-daygrid-day-number": {
            fontWeight: "600",
            color: "#374151",
            padding: "4px 8px",
            transition: "all 0.2s ease",
          },
          ".fc .fc-event": {
            border: "none",
            borderRadius: "6px",
            padding: "2px 6px",
            margin: "1px 2px",
            fontSize: "0.75rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            position: "relative",
            overflow: "hidden",
          },
          ".fc .fc-event:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            zIndex: 10,
          },
          ".fc .fc-event::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "3px",
            backgroundColor: "currentColor",
            opacity: 0.8,
          },
          ".fc .fc-daygrid-event-harness": {
            marginTop: "2px",
            marginBottom: "2px",
          },
          ".fc .fc-h-event": {
            borderRadius: "6px",
            border: "none",
          },
        }}
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Active Training Sessions
          </Typography>
          <Button
            onClick={() => setCalendarOpen(true)}
            startIcon={<CalendarMonthIcon />}
            variant="contained"
            sx={{ 
              borderRadius: 3, 
              fontWeight: 600, 
              textTransform: "none",
              px: 3,
              py: 1.5,
              boxShadow: theme.shadows[3],
              '&:hover': {
                boxShadow: theme.shadows[6],
                transform: 'translateY(-2px)',
              }
            }}
          >
            View Calendar
          </Button>
        </Box>

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

        {/* Enhanced Calendar Dialog */}
        <Dialog 
          open={calendarOpen} 
          onClose={() => setCalendarOpen(false)} 
          fullWidth 
          maxWidth="lg" 
          PaperProps={{ 
            sx: { 
              borderRadius: 3,
              minHeight: '80vh',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            } 
          }}
        >
          <DialogTitle 
            sx={{ 
              fontWeight: 700,
              fontSize: '1.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              m: 0,
              p: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarMonthIcon sx={{ mr: 2, fontSize: '2rem' }} />
              Training Schedule Calendar
            </Box>
            <IconButton 
              onClick={() => setCalendarOpen(false)}
              sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 3, backgroundColor: '#f8fafc' }}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 2, 
                mt: 3,
                borderRadius: 3,
                backgroundColor: 'white',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              }}
            >
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                height="auto"
                events={events}
                eventDisplay="block"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,dayGridWeek'
                }}
                buttonText={{
                  today: 'Today',
                  month: 'Month',
                  week: 'Week'
                }}
                eventContent={({ event }) => {
                  const statusColors = getStatusColor(event.extendedProps.status);
                  return (
                    <Box
                      sx={{
                        px: 1,
                        py: 0.5,
                        cursor: 'pointer',
                        borderRadius: '4px',
                        backgroundColor: statusColors.bg,
                        border: `1px solid ${statusColors.border}`,
                        color: statusColors.text,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                      {getStatusIcon(event.extendedProps.status)}
                      <Typography variant="caption" fontWeight={600} noWrap>
                        {event.title}
                      </Typography>
                    </Box>
                  );
                }}
                eventClick={({ event }) => {
                  setSelectedEvent(event);
                }}
                dayMaxEvents={3}
                moreLinkClick="popover"
                navLinks={true}
                selectable={true}
                selectMirror={true}
                dayMaxEventRows={true}
                weekends={true}
                datesSet={(dateInfo) => {
                  console.log('Date range changed:', dateInfo);
                }}
              />
            </Paper>
          </DialogContent>
        </Dialog>

        {/* Enhanced Event Popup */}
        <Dialog
          open={Boolean(selectedEvent)}
          onClose={() => setSelectedEvent(null)}
          PaperProps={{ 
            sx: { 
              borderRadius: 3, 
              maxWidth: 600,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            } 
          }}
        >
          <DialogTitle 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              m: 0,
              p: 3,
            }}
          >
            <FitnessCenterIcon sx={{ mr: 2 }} />
            Training Session Details
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            {selectedEvent && (
              <Box sx={{ p: 3 }}>
                {/* Status Badge */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                  <Chip
                    icon={getStatusIcon(selectedEvent.extendedProps.status)}
                    label={selectedEvent.extendedProps.status.toUpperCase()}
                    sx={{
                      backgroundColor: getStatusColor(selectedEvent.extendedProps.status).bg,
                      color: getStatusColor(selectedEvent.extendedProps.status).text,
                      border: `2px solid ${getStatusColor(selectedEvent.extendedProps.status).border}`,
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      px: 2,
                      py: 1,
                    }}
                  />
                </Box>

                <Grid container spacing={3}>
                  {/* Coach Information */}
                  <Grid item xs={12} md={6}>
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #e0f2fe 0%, #f3e5f5 100%)',
                        border: '1px solid #e1bee7',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2, width: 32, height: 32 }}>
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                          COACH
                        </Typography>
                      </Box>
                      <Typography variant="h6" fontWeight={700} color="primary">
                        {selectedEvent.extendedProps.coach}
                      </Typography>
                      {selectedEvent.extendedProps.coachEmail && (
                        <Typography variant="body2" color="text.secondary">
                          {selectedEvent.extendedProps.coachEmail}
                        </Typography>
                      )}
                    </Paper>
                  </Grid>

                  {/* Client Information */}
                  <Grid item xs={12} md={6}>
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #f3e5f5 0%, #e8f5e8 100%)',
                        border: '1px solid #c8e6c9',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ bgcolor: theme.palette.success.main, mr: 2, width: 32, height: 32 }}>
                          <FaceIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                          CLIENT
                        </Typography>
                      </Box>
                      <Typography variant="h6" fontWeight={700} color="success.main">
                        {selectedEvent.extendedProps.client}
                      </Typography>
                      {selectedEvent.extendedProps.clientEmail && (
                        <Typography variant="body2" color="text.secondary">
                          {selectedEvent.extendedProps.clientEmail}
                        </Typography>
                      )}
                    </Paper>
                  </Grid>

                  {/* Session Details */}
                  <Grid item xs={12}>
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: 3, 
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #fff3e0 0%, #f3e5f5 100%)',
                        border: '1px solid #ffcc02',
                      }}
                    >
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#e65100' }}>
                        Session Information
                      </Typography>

                      <Grid container spacing={2}>
                        {/*Session Number */}
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Badge 
                              badgeContent={selectedEvent.extendedProps.sessionNumber} 
                              color="primary"
                              sx={{ mr: 2 }}
                            >
                              <FitnessCenterIcon sx={{ color: theme.palette.info.main }} />
                            </Badge>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Session Number
                              </Typography>
                              <Typography variant="body1" fontWeight={600}>
                                Session # {selectedEvent.extendedProps.sessionNumber}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        {/*Session date */}
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <EventIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Session Date
                              </Typography>
                              <Typography variant="body1" fontWeight={600}>
                                {new Date(selectedEvent.start).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        {/*Session Time */}
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <AccessTimeIcon sx={{ mr: 2, color: theme.palette.secondary.main }} />
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Session Time
                              </Typography>
                              <Typography variant="body1" fontWeight={600}>
                                {selectedEvent.extendedProps.time
                                  ? new Date(selectedEvent.extendedProps.time).toLocaleTimeString('en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })
                                  : 'Not scheduled'}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, backgroundColor: '#f8fafc' }}>
            <Button 
              onClick={() => setSelectedEvent(null)} 
              variant="contained"
              sx={{ 
                borderRadius: 2, 
                fontWeight: 600,
                textTransform: 'none',
                px: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                }
              }}
            >
              Close
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
    </>
  );
};

export default TrainingSessions;
