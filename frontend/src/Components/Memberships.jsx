import React from "react";
import { Box, Card, CardContent, Typography, Button, List, ListItem, ListItemIcon, ListItemText, Container, Grid } from "@mui/material";
import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const benefits = [
  { text: "UNLIMITED USE OF GYM", icon: <FitnessCenterIcon /> },
  { text: "FREE GROUP CLASSES (Circuit training, Zumba, Tabata, Yoga)", icon: <SportsGymnasticsIcon /> },
  { text: "ACCESS TO ALL PROVIDER BRANCHES NATIONWIDE", icon: <LocationOnIcon /> },
  { text: "FREE 2 SESSION OF PERSONAL TRAINING", icon: <FitnessCenterIcon /> },
  { text: "FREE 3 MONTHS FREEZING OF CONTRACT", icon: <CheckCircleIcon /> },
  { text: "FREE 5 GUEST PASSES", icon: <CheckCircleIcon /> },
  { text: "FREE WIFI", icon: <CheckCircleIcon /> },
  { text: "FREE LOCKERS", icon: <CheckCircleIcon /> },
  { text: "FREE DRINKING MINERAL WATER", icon: <CheckCircleIcon /> },
  { text: "ALL MAJOR CREDIT CARDS ARE ACCEPTED", icon: <CheckCircleIcon /> },
];

const Membership = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 8,
        color: '#fff',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  overflow: 'hidden',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography 
                    variant="h4" 
                    sx={{
                      fontWeight: 800,
                      mb: 4,
                      background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      textAlign: 'center',
                    }}
                  >
                    Membership Benefits
                  </Typography>

                  <List>
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ListItem 
                          sx={{
                            mb: 2,
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.1)',
                              transform: 'translateX(10px)',
                            }
                          }}
                        >
                          <ListItemIcon>
                            <Box
                              sx={{
                                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                                borderRadius: '50%',
                                p: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {React.cloneElement(benefit.icon, { sx: { color: '#fff', fontSize: 20 } })}
                            </Box>
                          </ListItemIcon>
                          <ListItemText 
                            primary={benefit.text}
                            sx={{
                              '& .MuiListItemText-primary': {
                                color: '#fff',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                              }
                            }}
                          />
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>

                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography 
                      variant="body1" 
                      sx={{
                        color: '#FF6B6B',
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      STRICTLY NO APPOINTMENT, NO DISCOUNT!!
                    </Typography>
                    <Typography 
                      variant="h6"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        color: 'rgba(255,255,255,0.9)',
                      }}
                    >
                      MESSAGE US FOR MORE DETAILS
                      <EmojiEmotionsIcon sx={{ color: '#FFD700' }} />
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    component="img"
                    src={`/images/home-img-1.jpeg`}
                    alt="Gym"
                    sx={{
                      width: '100%',
                      maxWidth: 450,
                      height: 'auto',
                      borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      mb: 4,
                    }}
                  />
                </motion.div>

                <Typography
                  variant="h4"
                  sx={{
                    fontStyle: 'italic',
                    fontWeight: 'light',
                    mb: 4,
                    color: 'rgba(255,255,255,0.9)',
                    lineHeight: 1.6,
                  }}
                >
                  "If you don't invest in it, if you don't put in the work, you won't get the results."
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Membership;
