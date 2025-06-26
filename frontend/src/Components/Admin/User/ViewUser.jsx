import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
  Button,
  Grid,
  Divider,
  Fade,
  Card,
  CardContent,
  Chip,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  GetApp as GetAppIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Security as SecurityIcon,
  ContactEmergency as EmergencyIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import baseURL from "../../../utils/baseURL";

const ViewUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/users/get-user/${id}`);
        setUser(data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

    doc.setFontSize(16);
    doc.text("User Profile Report", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 14, 26);

    autoTable(doc, {
      startY: 35,
      head: [["Field", "Value"]],
      body: [
        ["Name", user.name || "N/A"],
        ["Email", user.email || "N/A"],
        ["Address", user.address || "N/A"],
        ["City", user.city || "N/A"],
        ["Phone", user.phone || "N/A"],
        ["Role", user.role || "N/A"],
        [
          "Subscription Start",
          user.subscribedDate
            ? new Date(user.subscribedDate).toLocaleDateString()
            : "N/A",
        ],
        [
          "Subscription Expiry",
          user.subscriptionExpiration
            ? new Date(user.subscriptionExpiration).toLocaleDateString()
            : "N/A",
        ],
        ["General Access", user.generalAccess || "N/A"],
        ["Other Access", user.otherAccess || "N/A"],
        ["Emergency Contact", user.emergencyContactName || "N/A"],
        ["Emergency Phone", user.emergencyContactNumber || "N/A"],
      ],
      styles: { fontSize: 10 },
    });

    doc.save(`UserProfile_${user.name || "User"}.pdf`);
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'error';
      case 'trainer':
        return 'warning';
      case 'member':
        return 'success';
      default:
        return 'default';
    }
  };

  const getSubscriptionStatus = () => {
    if (!user.subscriptionExpiration) return { status: 'No Subscription', color: 'default' };
    
    const expiryDate = new Date(user.subscriptionExpiration);
    const today = new Date();
    const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { status: 'Expired', color: 'error' };
    if (daysLeft <= 7) return { status: 'Expiring Soon', color: 'warning' };
    return { status: 'Active', color: 'success' };
  };

  const InfoItem = ({ icon, label, value, fullWidth = false }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, ...(fullWidth && { gridColumn: 'span 2' }) }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: 40, 
        height: 40, 
        borderRadius: '50%', 
        bgcolor: 'primary.light', 
        color: 'primary.contrastText',
        mr: 2,
        flexShrink: 0
      }}>
        {icon}
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 500 }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-word' }}>
          {value || "Not provided"}
        </Typography>
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="error" gutterBottom>
          User not found
        </Typography>
        <Button onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />}>
          Go Back
        </Button>
      </Box>
    );
  }

  const subscriptionStatus = getSubscriptionStatus();

  return (
    <Fade in timeout={800}>
      <Box sx={{ maxWidth: 1000, mx: "auto", my: 4, px: 2 }}>
        {/* Header Section */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIcon />}
            variant="contained"
            size="large"
            sx={{ borderRadius: 2 }}
          >
            Back to Users
          </Button>
          <Tooltip title="Export user profile as PDF">
            <Button 
              onClick={exportToPDF} 
              variant="contained" 
              startIcon={<GetAppIcon />}
              size="large"
              sx={{ borderRadius: 2 }}
            >
              Export PDF
            </Button>
          </Tooltip>
        </Box>

        {/* Main Profile Card */}
        <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3, mb: 3 }}>
          {/* Profile Header */}
          <Box sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 4,
            textAlign: 'center',
            position: 'relative'
          }}>
            <Avatar
              src={user.image?.[0]?.url || "/images/default_avatar.jpg"}
              sx={{
                width: 120,
                height: 120,
                mx: "auto",
                mb: 2,
                border: "4px solid rgba(255,255,255,0.3)",
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}
            />
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
              {user.email}
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
              <Chip 
                label={user.role || 'Member'} 
                color={getRoleColor(user.role)}
                icon={<BadgeIcon />}
                sx={{ fontWeight: 600 }}
              />
              <Chip 
                label={subscriptionStatus.status} 
                color={subscriptionStatus.color}
                icon={<SecurityIcon />}
                sx={{ fontWeight: 600 }}
              />
            </Stack>
          </Box>

          {/* Profile Content */}
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={4}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="h5" fontWeight={700} gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: 'primary.main',
                  mb: 3
                }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  Personal Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <InfoItem 
                      icon={<EmailIcon />}
                      label="Email Address"
                      value={user.email}
                    />
                    <InfoItem 
                      icon={<PhoneIcon />}
                      label="Phone Number"
                      value={user.phone}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InfoItem 
                      icon={<LocationIcon />}
                      label="Address"
                      value={user.address}
                    />
                    <InfoItem 
                      icon={<LocationIcon />}
                      label="City"
                      value={user.city}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              {/* Subscription Information */}
              <Grid item xs={12}>
                <Typography variant="h5" fontWeight={700} gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: 'primary.main',
                  mb: 3
                }}>
                  <CalendarIcon sx={{ mr: 1 }} />
                  Subscription Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <InfoItem 
                      icon={<CalendarIcon />}
                      label="Subscription Start Date"
                      value={user.subscribedDate ? new Date(user.subscribedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : null}
                    />
                    <InfoItem 
                      icon={<SecurityIcon />}
                      label="General Access"
                      value={user.generalAccess}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InfoItem 
                      icon={<CalendarIcon />}
                      label="Subscription Expiry Date"
                      value={user.subscriptionExpiration ? new Date(user.subscriptionExpiration).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : null}
                    />
                    <InfoItem 
                      icon={<SecurityIcon />}
                      label="Other Access"
                      value={user.otherAccess}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              {/* Emergency Contact */}
              <Grid item xs={12}>
                <Typography variant="h5" fontWeight={700} gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: 'primary.main',
                  mb: 3
                }}>
                  <EmergencyIcon sx={{ mr: 1 }} />
                  Emergency Contact
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <InfoItem 
                      icon={<PersonIcon />}
                      label="Emergency Contact Name"
                      value={user.emergencyContactName}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InfoItem 
                      icon={<PhoneIcon />}
                      label="Emergency Contact Phone"
                      value={user.emergencyContactNumber}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Paper>
      </Box>
    </Fade>
  );
};

export default ViewUser;
