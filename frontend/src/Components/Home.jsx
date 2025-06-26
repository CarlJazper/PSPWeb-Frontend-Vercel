import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Box, Grid, Typography, Button, Container, Paper, keyframes, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import QrCodeIcon from '@mui/icons-material/QrCode';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const floatingAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(1deg); }
  50% { transform: translateY(-5px) rotate(0deg); }
  75% { transform: translateY(-15px) rotate(-1deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(78, 205, 196, 0.3), 0 0 40px rgba(78, 205, 196, 0.1); }
  50% { box-shadow: 0 0 30px rgba(78, 205, 196, 0.6), 0 0 60px rgba(78, 205, 196, 0.2); }
`;

const Home = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const [phoneInteraction, setPhoneInteraction] = useState(false);
  const [scanActive, setScanActive] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel images
  const carouselImages = [
    {
      src: "/images/gym-1.jpg",
      title: "Lat Pull Down",
      description: "Gym Equipments"
    },
    {
      src: "/images/gym-2.jpg", 
      title: "Matt Area",
      description: "Gym Equipments"
    },
    {
      src: "/images/gym-3.jpg",
      title: "Pull Row Machine",
      description: "Gym Equipments"
    },
    {
      src: "/images/gym-4.jpg",
      title: "Dumbell Rack",
      description: "Gym Equipments"
    },
    {
      src: "/images/gym-5.jpg",
      title: "Smith Machine",
      description: "Gym Equipments"
    }
  ];

  useEffect(() => {
    setFadeIn(true);

    const scanInterval = setInterval(() => {
      setScanActive(true);
      setTimeout(() => setScanActive(false), 3000);
    }, 8000);

    // Auto-advance carousel
    const carouselInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);

    return () => {
      clearInterval(scanInterval);
      clearInterval(carouselInterval);
    };
  }, [carouselImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

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

  const phoneVariants = {
    idle: {
      y: [0, -10, 0],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.05,
      y: -15,
      rotate: 0,
      transition: { duration: 0.3 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const qrCodeVariants = {
    idle: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    scanning: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 0.5,
        repeat: 3,
        ease: "easeInOut"
      }
    }
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
        position: 'relative',
      }}
    >
      {/* Floating Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '100px',
          height: '100px',
          background: 'radial-gradient(circle, rgba(78, 205, 196, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: `${floatingAnimation} 8s ease-in-out infinite`,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          right: '10%',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(255, 107, 107, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: `${floatingAnimation} 10s ease-in-out infinite reverse`,
          zIndex: 0,
        }}
      />

      <Container maxWidth="xl" sx={{ pt: { xs: 4, md: 8 }, pb: 8, position: 'relative', zIndex: 1 }}>
        {/* Hero Section with Enhanced Phone */}
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
                "Lift heavy, live light."<br />
                By training hard, you make your mind and body lighter, stronger, and healthier.
                It helps you literally feel lighter and healthier in your daily life.
              </Typography>

              <Box sx={{ display: "flex", gap: { xs: 2, md: 3 }, flexWrap: 'wrap' }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
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
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
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
                </motion.div>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <motion.div
              initial="hidden"
              animate={fadeIn ? "visible" : "hidden"}
              variants={scaleUp}
              style={{ width: '100%', maxWidth: '320px', position: 'relative' }}
            >
              {/* Floating Icons Around Phone */}
              <motion.div
                animate={{
                  rotate: 360,
                  transition: { duration: 20, repeat: Infinity, ease: "linear" }
                }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '400px',
                  height: '400px',
                  zIndex: 0,
                }}
              >
                <QrCodeIcon
                  sx={{
                    position: 'absolute',
                    top: '10%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'rgba(78, 205, 196, 0.6)',
                    fontSize: '2rem',
                  }}
                />
                <TouchAppIcon
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    right: '10%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255, 107, 107, 0.6)',
                    fontSize: '1.8rem',
                  }}
                />
                <FitnessCenterIcon
                  sx={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'rgba(255, 209, 102, 0.6)',
                    fontSize: '2rem',
                  }}
                />
                <PhoneAndroidIcon
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '10%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255, 142, 83, 0.6)',
                    fontSize: '1.8rem',
                  }}
                />
              </motion.div>

              {/* Enhanced Phone with Animations */}
              <motion.div
                variants={phoneVariants}
                animate="idle"
                whileHover="hover"
                whileTap="tap"
                onHoverStart={() => setPhoneInteraction(true)}
                onHoverEnd={() => setPhoneInteraction(false)}
                onClick={() => setScanActive(!scanActive)}
                style={{ cursor: 'pointer', position: 'relative', zIndex: 2 }}
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
                    boxShadow: phoneInteraction
                      ? '0 30px 60px -12px rgba(78, 205, 196, 0.4), inset 0 0 20px rgba(78, 205, 196, 0.1)'
                      : '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(0,0,0,0.3)',
                    border: phoneInteraction
                      ? '2px solid rgba(78, 205, 196, 0.5)'
                      : '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    animation: phoneInteraction ? `${pulseGlow} 2s ease-in-out infinite` : 'none',
                  }}
                >
                  {/* Phone Notch */}
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

                  {/* Phone Screen */}
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
                      position: 'relative',
                    }}
                  >
                    {/* Scan Line Animation */}
                    <AnimatePresence>
                      {scanActive && (
                        <motion.div
                          initial={{ y: '-100%', opacity: 0 }}
                          animate={{ y: '300%', opacity: [0, 1, 1, 0] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 2, ease: "easeInOut" }}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            background: 'linear-gradient(90deg, transparent, #4ECDC4, transparent)',
                            zIndex: 3,
                          }}
                        />
                      )}
                    </AnimatePresence>

                    <motion.div
                      animate={scanActive ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                      transition={{ duration: 0.5, repeat: scanActive ? 3 : 0 }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: scanActive ? '#4ECDC4' : 'rgba(255,255,255,0.8)',
                          mb: 1,
                          fontWeight: 500,
                          letterSpacing: '0.5px',
                          transition: 'color 0.3s ease',
                        }}
                      >
                        {scanActive ? 'SCANNING...' : 'SCAN TO EXPLORE'}
                      </Typography>
                    </motion.div>

                    <motion.div
                      variants={qrCodeVariants}
                      animate={scanActive ? "scanning" : "idle"}
                      style={{ position: 'relative' }}
                    >
                      <Box
                        component="img"
                        src="/images/qr.png"
                        alt="QR Code"
                        sx={{
                          width: '85%',
                          height: 'auto',
                          borderRadius: '8px',
                          border: scanActive
                            ? '2px solid rgba(78, 205, 196, 0.8)'
                            : '2px solid rgba(255,255,255,0.1)',
                          transition: 'border-color 0.3s ease',
                          filter: scanActive ? 'brightness(1.2)' : 'brightness(1)',
                          mx: 'auto',
                          display: 'block',
                        }}
                      />

                      {/* QR Code Corner Indicators */}
                      {scanActive && (
                        <>
                          {[0, 1, 2, 3].map((corner) => (
                            <motion.div
                              key={corner}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0 }}
                              transition={{ delay: corner * 0.1 }}
                              style={{
                                position: 'absolute',
                                width: '20px',
                                height: '20px',
                                border: '3px solid #4ECDC4',
                                ...(corner === 0 && { top: '-10px', left: '-10px', borderRight: 'none', borderBottom: 'none' }),
                                ...(corner === 1 && { top: '-10px', right: '-10px', borderLeft: 'none', borderBottom: 'none' }),
                                ...(corner === 2 && { bottom: '-10px', left: '-10px', borderRight: 'none', borderTop: 'none' }),
                                ...(corner === 3 && { bottom: '-10px', right: '-10px', borderLeft: 'none', borderTop: 'none' }),
                              }}
                            />
                          ))}
                        </>
                      )}
                    </motion.div>

                    <motion.div
                      animate={phoneInteraction ? { y: [0, -5, 0] } : {}}
                      transition={{ duration: 1, repeat: phoneInteraction ? Infinity : 0 }}
                    >
                      <PhoneAndroidIcon
                        sx={{
                          color: scanActive ? '#4ECDC4' : 'rgba(255,255,255,0.4)',
                          fontSize: '1.5rem',
                          mt: 2,
                          transition: 'color 0.3s ease',
                        }}
                      />
                    </motion.div>

                    {/* Interactive Hint */}
                    <AnimatePresence>
                      {phoneInteraction && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          style={{
                            position: 'absolute',
                            bottom: '10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#4ECDC4',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              textAlign: 'center',
                            }}
                          >
                            Click to Scan!
                          </Typography>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>
                </Paper>
              </motion.div>
            </motion.div>
          </Grid>
        </Grid>

        {/* Enhanced Features Section */}
        <Box sx={{ py: { xs: 6, md: 10 } }}>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
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
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                    }
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
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <DirectionsRunIcon
                      sx={{
                        fontSize: { xs: '2.5rem', md: '3rem' },
                        color: '#4ECDC4',
                        mb: 2
                      }}
                    />
                  </motion.div>
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

        {/* New Gym Showcase Carousel */}
        <Box sx={{ py: { xs: 6, md: 10 } }}>
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
                textAlign: 'center',
                color: '#fff'
              }}
            >
              Experience Our Gym
            </Typography>
          </motion.div>

          <Box sx={{ position: 'relative', maxWidth: '1200px', mx: 'auto' }}>
            {/* Carousel Container */}
            <Box
              sx={{
                position: 'relative',
                height: { xs: '300px', md: '500px' },
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <Box
                    component="img"
                    src={carouselImages[currentSlide].src}
                    alt={carouselImages[currentSlide].title}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'fit',
                    }}
                  />
                  
                  {/* Overlay with gradient */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                      p: { xs: 3, md: 4 },
                    }}
                  >
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          color: '#fff',
                          fontWeight: 700,
                          mb: 1,
                          fontSize: { xs: '1.5rem', md: '2rem' }
                        }}
                      >
                        {carouselImages[currentSlide].title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'rgba(255,255,255,0.9)',
                          fontSize: { xs: '0.9rem', md: '1.1rem' }
                        }}
                      >
                        {carouselImages[currentSlide].description}
                      </Typography>
                    </motion.div>
                  </Box>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <IconButton
                onClick={prevSlide}
                sx={{
                  position: 'absolute',
                  left: { xs: 10, md: 20 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: '#fff',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: 'rgba(78, 205, 196, 0.8)',
                    transform: 'translateY(-50%) scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                  zIndex: 2,
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>

              <IconButton
                onClick={nextSlide}
                sx={{
                  position: 'absolute',
                  right: { xs: 10, md: 20 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: '#fff',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: 'rgba(78, 205, 196, 0.8)',
                    transform: 'translateY(-50%) scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                  zIndex: 2,
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>

            {/* Carousel Indicators */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                mt: 3,
              }}
            >
              {carouselImages.map((_, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Box
                    onClick={() => goToSlide(index)}
                    sx={{
                      width: currentSlide === index ? '40px' : '12px',
                      height: '12px',
                      borderRadius: '6px',
                      backgroundColor: currentSlide === index ? '#4ECDC4' : 'rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: currentSlide === index ? '#4ECDC4' : 'rgba(255,255,255,0.7)',
                      }
                    }}
                  />
                </motion.div>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Enhanced Why Choose Us Section */}
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
                  whileHover={{
                    ...cardHoverEffect,
                    y: -10,
                  }}
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
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        border: '1px solid rgba(78, 205, 196, 0.3)',
                      }
                    }}
                  >
                    <motion.div
                      whileHover={{
                        scale: 1.2,
                        rotate: [0, -10, 10, 0],
                        transition: { duration: 0.5 }
                      }}
                    >
                      <Box mb={2}>{card.icon}</Box>
                    </motion.div>
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
