import React, { useState, useEffect } from 'react';
import { Box, Card, CardMedia, CardContent, Typography, Button, Container, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { getUser } from '../utils/helpers';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';

const Coaches = () => {
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    const interval = setInterval(() => {
      setUser(getUser());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const coaches = [
    { 
      title: 'Richard Picar',
      image: `/images/coach-1.jpg`,
      specialty: 'Strength & Conditioning',
      gradient: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
    },
    { 
      title: 'Emilie Reyes',
      image: `/images/coach-2.jpg`,
      specialty: 'Yoga & Flexibility',
      gradient: 'linear-gradient(135deg, #4ECDC4, #45B7AF)',
    },
    { 
      title: 'Joshua Pascaldo',
      image: `/images/coach-3.jpg`,
      specialty: 'CrossFit Expert',
      gradient: 'linear-gradient(135deg, #A66CFF, #9C55FF)',
    },
    { 
      title: 'Brian Mendez',
      image: `/images/coach-4.jpg`,
      specialty: 'Nutrition Specialist',
      gradient: 'linear-gradient(135deg, #3EECAC, #3BE9AA)',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <Box
      sx={{
        color: '#fff',
        py: 8,
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="lg">
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
            Meet Our Expert Trainers
          </Typography>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={4} justifyContent="center">
            {coaches.map((coach, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div variants={cardVariants} style={{ height: '100%' }}>
                  <Card
                    sx={{
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 4,
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        '& .coach-overlay': {
                          opacity: 0.7,
                        },
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative', height: 300 }}>
                      <CardMedia
                        component="img"
                        image={coach.image}
                        alt={coach.title}
                        sx={{
                          height: '100%',
                          width: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <Box
                        className="coach-overlay"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: coach.gradient,
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                        }}
                      />
                    </Box>

                    <CardContent
                      sx={{
                        textAlign: 'center',
                        p: 3,
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: '#fff',
                          fontSize: '1.25rem',
                        }}
                      >
                        {coach.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'rgba(255,255,255,0.8)',
                          mb: 1,
                          fontSize: '0.95rem',
                        }}
                      >
                        {coach.specialty}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255,255,255,0.6)',
                          mb: 2,
                          fontSize: '0.85rem',
                        }}
                      >
                        {coach.experience}
                      </Typography>

                      {user && (
                        <Button
                          variant="contained"
                          startIcon={<FitnessCenterIcon />}
                          sx={{
                            background: coach.gradient,
                            color: '#fff',
                            py: 1,
                            px: 3,
                            borderRadius: 2,
                            fontWeight: 600,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-3px)',
                              boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                              background: coach.gradient,
                            },
                          }}
                        >
                          Train with me
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Box
            sx={{
              textAlign: 'center',
              mt: 8,
              p: 4,
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 4,
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontStyle: 'italic',
                fontWeight: 'light',
                color: 'rgba(255,255,255,0.9)',
                maxWidth: '800px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              "If you want something you've never had, you must be willing to do something
              you've never done."
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Coaches;
