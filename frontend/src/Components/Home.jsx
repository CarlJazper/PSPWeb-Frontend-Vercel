import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Box, Grid, Typography, Button, Container, Paper, keyframes } from '@mui/material';
import { motion } from 'framer-motion';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const animatedGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Home = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const cardHoverEffect = {
    scale: 1.05,
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
    transition: { duration: 0.3 }
  };

  const featureCards = [
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 48, color: '#4ECDC4' }} />,
      title: "Expert Trainers",
      description: "Our certified trainers provide personalized guidance to help you achieve your fitness goals safely and effectively."
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 48, color: '#FF6B6B' }} />,
      title: "Supportive Community",
      description: "Join a motivating and friendly community that cheers you on every step of your fitness journey."
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 48, color: '#FFD166' }} />,
      title: "Proven Results",
      description: "We focus on sustainable results, helping you build lasting habits for a healthier and stronger life."
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        color: '#fff',
        overflow: 'hidden',
        backgroundSize: '400% 400%',
        animation: `${animatedGradient} 15s ease infinite`,
      }}
    >
      <Container maxWidth="xl" sx={{ pt: { xs: 4, md: 8 }, pb: 8 }}>
        {/* QR Mobile */}
        <Grid
          container
          spacing={4}
          sx={{
            minHeight: { md: '80vh' },
            alignItems: 'center',
            pb: { xs: 6, md: 10 }
          }}
        >
          <Grid item xs={12} md={7}>
            <motion.div
              initial="hidden"
              animate={fadeIn ? "visible" : "hidden"}
              variants={fadeInUp}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.8rem', sm: '3.5rem', md: '4rem', lg: '4.5rem' },
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #FF8E53, #FF6B6B, #4ECDC4)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  mb: 3,
                  lineHeight: 1.2,
                }}
              >
                Achieve Your Fitness Goal
                <br />
                With Us
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255,255,255,0.85)',
                  mb: 5,
                  lineHeight: 1.7,
                  fontSize: { xs: '1rem', md: '1.15rem' },
                }}
              >
                “Lift heavy, live light.”<br />
                By training hard, you make your mind and body lighter, stronger, and healthier.
                It helps you literally feel lighter and healthier in your daily life.
              </Typography>

              <Box sx={{ display: "flex", gap: { xs: 2, md: 3 } }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  size="large"
                  startIcon={<FitnessCenterIcon />}
                  sx={{
                    background: "linear-gradient(45deg, #FF6B6B, #FF8E53)",
                    color: '#fff',
                    px: { xs: 3, md: 5 },
                    py: 1.5,
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    fontWeight: 600,
                    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    "&:hover": {
                      background: "linear-gradient(45deg, #FF8E53, #FF6B6B)",
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(255, 107, 107, 0.5)',
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
                    borderColor: 'rgba(255,255,255,0.7)',
                    px: { xs: 3, md: 5 },
                    py: 1.5,
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    fontWeight: 600,
                    transition: 'border-color 0.2s ease-in-out, color 0.2s ease-in-out, transform 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: '#4ECDC4',
                      color: '#4ECDC4',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <motion.div
              initial="hidden"
              animate={fadeIn ? "visible" : "hidden"}
              variants={scaleUp}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              style={{ width: '100%', maxWidth: '320px' }}
            >
              <Paper
                elevation={12}
                sx={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '9 / 19',
                  backgroundColor: 'rgba(100, 100, 100, 0.39)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  borderRadius: '36px',
                  p: '12px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <Box sx={{
                  position: 'absolute',
                  top: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  borderRadius: '4px',
                  zIndex: 2,
                }} />

                <Box
                  sx={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: 'rgba(10, 10, 10, 0.8)',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      mb: 1,
                      fontWeight: 500,
                      letterSpacing: '0.5px'
                    }}
                  >
                    SCAN TO EXPLORE
                  </Typography>
                  <Box
                    component="img"
                    src="/images/qr.png"
                    alt="QR Code"
                    sx={{
                      width: '85%',
                      height: 'auto',
                      borderRadius: '8px',
                      border: '2px solid rgba(255,255,255,0.1)',
                    }}
                  />
                  <PhoneAndroidIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.5rem', mt: 2 }} />
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Box sx={{ py: { xs: 6, md: 10 } }}>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
              >
                <Box
                  component="img"
                  src={`/images/home-img-2.jpg`}
                  alt="Exercise benefits"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: { xs: '350px', md: '450px' },
                    objectFit: 'cover',
                    borderRadius: '20px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                  }}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
              >
                <Box sx={{ p: { xs: 0, md: 2 } }}>
                  <DirectionsRunIcon
                    sx={{
                      fontSize: { xs: '2.5rem', md: '3rem' },
                      color: '#4ECDC4',
                      mb: 2
                    }}
                  />
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: { xs: '2rem', md: '2.5rem' },
                      fontWeight: 700,
                      mb: 3,
                      lineHeight: 1.3,
                    }}
                  >
                    Transform Your Life Through Fitness
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      lineHeight: 1.8,
                      fontSize: { xs: '1rem', md: '1.1rem' }
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

        {/* Why Choose Us Section - NEW */}
        <Box sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.2rem', md: '3rem' },
                fontWeight: 700,
                mb: 6,
                color: '#fff'
              }}
            >
              Why Choose Us?
            </Typography>
          </motion.div>
          <Grid container spacing={4} justifyContent="center">
            {featureCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.2 } }
                  }}
                  whileHover={cardHoverEffect}
                  style={{ height: '100%' }}
                >
                  <Paper
                    elevation={8}
                    sx={{
                      p: { xs: 3, md: 4 },
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                    }}
                  >
                    <Box mb={2}>{card.icon}</Box>
                    <Typography variant="h5" component="h3" fontWeight={600} gutterBottom sx={{ color: '#fff' }}>
                      {card.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
                      {card.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

      </Container>
    </Box>
  );
};

export default Home;
