import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Box, Grid, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';

const Home = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Box
      sx={{
       
        minHeight: '100vh',
        color: '#fff',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="xl">
        {/* Hero Section */}
        <Grid 
          container 
          spacing={4} 
          sx={{ 
            minHeight: '90vh',
            alignItems: 'center',
            py: { xs: 4, md: 8 }
          }}
        >
          <Grid item xs={12} md={6}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  mb: 3
                }}
              >
                Achieve Your Fitness Goal
                <br />
                With Us
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: '#rgba(255,255,255,0.9)',
                  mb: 4,
                  lineHeight: 1.8
                }}
              >
                “Lift heavy, live light.”<br/>
                By training hard, you make your mind and body lighter, stronger, and healthier.  
                It helps you literally feel lighter and healthier in your daily life.
              </Typography>

              <Box sx={{ display: "flex", gap: 2 }}>
  <Button
    component={Link}
    to="/login"
    variant="contained"
    size="large"
    startIcon={<FitnessCenterIcon />}
    sx={{
      background: "linear-gradient(45deg, #FF6B6B, #FF8E53)",
      px: 4,
      py: 1.5,
      "&:hover": {
        background: "linear-gradient(45deg, #FF8E53, #FF6B6B)",
      },
    }}
  >
    Start Now
  </Button>
                <Button
                  component={Link}
                  to="/memberships"
                  variant="outlined"
                  size="large"
                  sx={{
                    color: '#fff',
                    borderColor: '#fff',
                    px: 4,
                    '&:hover': {
                      borderColor: '#FF6B6B',
                      color: '#FF6B6B'
                    }
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-20px',
                    left: '-20px',
                    right: '-20px',
                    bottom: '-20px',
                    background: 'linear-gradient(45deg, #FF6B6B33, #4ECDC433)',
                    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                    zIndex: 0,
                    animation: 'morphing 10s ease-in-out infinite'
                  }
                }}
              >
                <Box
                  component="img"
                  src={`/images/home-img-1.jpeg`}
                  alt="Fitness Training"
                  sx={{
                    width: '100%',
                    height: { xs: '300px', md: '500px' },
                    objectFit: 'cover',
                    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                    position: 'relative',
                    zIndex: 1,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                  }}
                />
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Box sx={{ py: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Box
                  component="img"
                  src={`/images/home-img-2.jpg`}
                  alt="Exercise benefits"
                  sx={{
                    width: '100%',
                    height: { xs: '300px', md: '400px' },
                    objectFit: 'cover',
                    borderRadius: '20px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                  }}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Box sx={{ p: 4 }}>
                  <DirectionsRunIcon 
                    sx={{ 
                      fontSize: '3rem', 
                      color: '#4ECDC4',
                      mb: 2 
                    }} 
                  />
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: { xs: '1.8rem', md: '2.2rem' },
                      fontWeight: 700,
                      mb: 3
                    }}
                  >
                    Transform Your Life Through Fitness
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      lineHeight: 1.8,
                      fontSize: '1.1rem'
                    }}
                  >
                    Exercise is not just about physical transformation. It's a journey
                    that changes your mind, elevates your mood, and builds lasting
                    confidence. Our expert trainers are here to guide you every step
                    of the way, ensuring you achieve your fitness goals while maintaining
                    proper form and technique.
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <style jsx>{`
        @keyframes morphing {
          0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
          25% { border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%; }
          50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; }
          75% { border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%; }
          100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
        }
      `}</style>
    </Box>
  );
};

export default Home;
