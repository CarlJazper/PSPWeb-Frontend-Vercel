import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Collapse,
  Container,
  Divider,
  Fade,
  Grid,
  IconButton,
  Pagination,
  Rating,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import baseURL from "../utils/baseURL";

// === Styled Components ===
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[10],
  },
  borderRadius: 16,
  overflow: "hidden",
  backgroundColor: "#3b444b",
}));

const StyledCardMedia = styled(CardMedia)({
  height: 240,
  objectFit: "cover",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 500,
}));

const InstructionStep = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  marginBottom: theme.spacing(1.5),
  "&:last-child": {
    marginBottom: 0,
  },
}));

const StepNumber = styled(Box)(({ theme }) => ({
  minWidth: 24,
  height: 24,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: theme.spacing(1.5),
  marginTop: "2px",
  fontSize: "0.875rem",
  fontWeight: "bold",
}));

// === Component ===
const Exercise = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 6;

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/exercises/get-all-exercise`);
        setExercises(data.exercises);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const toggleInstructions = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatInstructions = (instructions) =>
    instructions
      .split(/\d+\./)
      .filter((step) => step.trim())
      .map((step) => step.trim());

  const totalPages = Math.ceil(exercises.length / exercisesPerPage);

  const paginatedExercises = useMemo(() => {
    const start = (currentPage - 1) * exercisesPerPage;
    return exercises.slice(start, start + exercisesPerPage);
  }, [exercises, currentPage]);

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      {/* Header */}
      <Box sx={{ mb: 5, textAlign: "center" }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            color: "#BDBB02",
            mb: 2,
          }}
        >
          <FitnessCenterIcon sx={{ mr: 2, fontSize: 40, color: "#fff" }} />
          Exercise Library
        </Typography>
      </Box>

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", minHeight: "50vh" }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          {/* Cards Grid */}
          <Grid container spacing={4}>
            {paginatedExercises.map((exercise, index) => (
              <Grid item xs={12} sm={6} md={4} key={exercise._id}>
                <Fade in timeout={500 + index * 100}>
                  <StyledCard>
                    {exercise.image?.[0]?.url && (
                      <StyledCardMedia component="img" image={exercise.image[0].url} alt={exercise.name} />
                    )}

                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2, color: "white" }}>
                        {exercise.name}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <StyledChip label={exercise.type} color="primary" variant="outlined" />
                        <StyledChip label={exercise.targetMuscle} color="secondary" variant="outlined" />
                      </Box>

                      <Typography sx={{ mb: 2, color: "white" }}>
                        <strong>Equipment:</strong> {exercise.equipmentUsed}
                      </Typography>

                      <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                        <Typography component="span" sx={{ mr: 1, color: "white" }}>
                          <strong>Difficulty:</strong>
                        </Typography>
                        <Rating value={exercise.difficulty} readOnly max={5} size="small" />
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Instructions */}
                      <Box>
                        <Box
                          onClick={() => toggleInstructions(exercise._id)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            cursor: "pointer",
                            "&:hover": { opacity: 0.8 },
                          }}
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
                            {formatInstructions(exercise.instructions).map((step, i) => (
                              <InstructionStep key={i}>
                                <StepNumber>{i + 1}</StepNumber>
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

          {/* Pagination */}
          <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, value) => setCurrentPage(value)}
                size="large"
                shape="rounded"
                showFirstButton
                showLastButton
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#fff",
                    borderColor: "#fff",
                  },
                  "& .MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: "#fff",
                    color: "#000",
                    borderColor: "#fff",
                    fontWeight: "bold",
                  },
                  "& .MuiPaginationItem-root.Mui-selected:hover": {
                    backgroundColor: "#f0f0f0", // Optional: lighter hover color
                  },
                }}
              />
          </Box>
        </>
      )}
    </Container>
  );
};

export default Exercise;
