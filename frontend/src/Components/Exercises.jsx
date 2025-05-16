import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Grid, 
  CircularProgress, 
  Box,
  Chip,
  Container,
  Fade,
  Rating,
  Divider,
  Collapse,
  Button,
  IconButton
} from "@mui/material";
import { styled } from "@mui/material/styles";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import baseURL from "../utils/baseURL";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
  borderRadius: '16px',
  overflow: 'hidden',
}));

const StyledCardMedia = styled(CardMedia)({
  height: 240,
  objectFit: 'cover',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 500,
}));

const InstructionStep = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(1.5),
  '&:last-child': {
    marginBottom: 0,
  },
}));

const StepNumber = styled(Box)(({ theme }) => ({
  minWidth: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(1.5),
  marginTop: '2px',
  fontSize: '0.875rem',
  fontWeight: 'bold',
}));

const Exercise = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(`${baseURL}/exercises/get-all-exercise`);
        setExercises(response.data.exercises);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const toggleInstructions = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatInstructions = (instructions) => {
    return instructions.split(/\d+\./).filter(step => step.trim()).map(step => step.trim());
  };

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            color: '#BDBB02',
            mb: 2,
          }}
        >
          <FitnessCenterIcon sx={{ mr: 2, fontSize: 40, color:'#fff'}} />
          Exercise Library
        </Typography>
        <Typography variant="h6" color="#fff" sx={{ maxWidth: 800, mx: 'auto' }}>
          Explore our comprehensive collection of exercises designed to help you achieve your fitness goals
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {exercises.map((exercise, index) => (
            <Grid item xs={12} sm={6} md={4} key={exercise._id}>
              <Fade in={true} timeout={500 + index * 100}>
                <StyledCard style={{backgroundColor:'#3b444b'}}>
                  {exercise.image?.length > 0 && (
                    <StyledCardMedia
                      component="img"
                      image={exercise.image[0].url}
                      alt={exercise.name}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h5" component="h2" sx={{ 
                      fontWeight: 700,
                      mb: 2,
                      color: 'white'
                    }}>
                      {exercise.name}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <StyledChip 
                        label={exercise.type} 
                        color="primary" 
                        variant="outlined"
                      />
                      <StyledChip 
                        label={exercise.targetMuscle}
                        color="secondary"
                        variant="outlined"
                      />
                    </Box>

                    <Typography sx={{ mb: 2, color: 'white' }}>
                      <strong>Equipment:</strong> {exercise.equipmentUsed}
                    </Typography>

                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Typography component="span" sx={{ mr: 1, color: 'white' }}>
                        <strong>Difficulty:</strong>
                      </Typography>
                      <Rating 
                        value={exercise.difficulty} 
                        readOnly 
                        max={5}
                        size="small"
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        '&:hover': { opacity: 0.8 }
                      }}
                      onClick={() => toggleInstructions(exercise._id)}
                      >
                        <Typography variant="subtitle1" fontWeight="bold" color="white">
                          Instructions
                        </Typography>
                        <IconButton size="small">
                          {expandedCards[exercise._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>

                      <Collapse in={expandedCards[exercise._id]} timeout="auto">
                        <Box sx={{ mt: 2, px: 1 }}>
                          {formatInstructions(exercise.instructions).map((step, index) => (
                            <InstructionStep key={index}>
                              <StepNumber>{index + 1}</StepNumber>
                              <Typography variant="body2" color="white" sx={{ lineHeight: 1.6 }}>
                                {step}
                              </Typography>
                            </InstructionStep>
                          ))}
                        </Box>
                      </Collapse>
                    </Box>
                  </CardContent>
                </StyledCard>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Exercise;
