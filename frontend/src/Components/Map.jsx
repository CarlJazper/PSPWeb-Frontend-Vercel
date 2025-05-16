import React from "react";
import { Box, Grid, Typography, Card, Container } from "@mui/material";
import { motion } from "framer-motion";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsIcon from '@mui/icons-material/Directions';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const LocationSection = () => {
  const googleMapsEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3012.6666383407123!2d121.05067047376188!3d14.504710579419877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397cf39abfb4025%3A0x722dd534b9375291!2s138%20Ballecer%20St%2C%20Taguig%2C%201630%20Metro%20Manila!5e1!3m2!1sen!2sph!4v1738224446432!5m2!1sen!2sph";

  const images = [
    {
      url: `/images/map-page-1.jpg`,
      title: "Main Entrance"
    },
    {
      url: `/images/map-page-2.jpg`,
      title: "Gym Equipments"
    },
    {
      url: `/images/map-page-3.jpg`,
      title: "Gym Equipments"
    }
  ];

  return (
    <Box
      sx={{
        py: 8,
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              mb: 6,
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Find Us Here
          </Typography>
        </motion.div>

        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Image Gallery */}
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Grid container spacing={2}>
                {images.map((image, index) => (
                  <Grid item xs={12} key={index}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        sx={{
                          position: 'relative',
                          height: { xs: "15rem", md: "18rem" },
                          overflow: 'hidden',
                          borderRadius: 4,
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                          '&:hover': {
                            '& .image-overlay': {
                              opacity: 1,
                            },
                          },
                        }}
                      >
                        <Box
                          component="img"
                          src={image.url}
                          alt={image.title}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                            },
                          }}
                        />
                        <Box
                          className="image-overlay"
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                            padding: 2,
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              color: '#fff',
                              fontWeight: 600,
                            }}
                          >
                            {image.title}
                          </Typography>
                        </Box>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Grid>

          {/* Right Side - Map and Info */}
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Box sx={{ height: { xs: "20rem", md: "40rem" }, width: '100%' }}>
                  <iframe
                    src={googleMapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Google Map - Gym Location"
                  ></iframe>
                </Box>
              </Card>

              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LocationOnIcon sx={{ color: '#FF6B6B', fontSize: 30 }} />
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#fff',
                          fontWeight: 600,
                        }}
                      >
                        4/F 138 Balcacer St (Green Building beside Jollibee Triumph)
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <DirectionsIcon sx={{ color: '#4ECDC4', fontSize: 30 }} />
                      <Typography
                        variant="body1"
                        sx={{ color: 'rgba(255,255,255,0.8)' }}
                      >
                        Easy access from main road
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <AccessTimeIcon sx={{ color: '#FFD700', fontSize: 30 }} />
                      <Typography
                        variant="body1"
                        sx={{ color: 'rgba(255,255,255,0.8)' }}
                      >
                        Open: 7AM - 10PM (DAILY)
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LocationSection;
