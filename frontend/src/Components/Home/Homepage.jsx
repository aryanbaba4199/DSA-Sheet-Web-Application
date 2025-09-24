import React from 'react';
import { useAuth } from '../../Context/userContext';
import {
  Box,
  Typography,
  Container,
  Chip,
  Paper,
} from "@mui/material";

const Homepage = () => {
  const { user } = useAuth();



  const completedProblemsCount = user.completedProblems.length;
  const uniqueProblemsCount = new Set(user.completedProblems.map(cp => cp.problemId)).size;
  const completedTopicsCount = user.completedTopics.length;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold", color: "primary.main" }}>
          Welcome Back!
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Hello, {user.email}
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom align="center">
          Your Progress Overview
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" color="success.main" gutterBottom>
              {completedProblemsCount}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Problems Completed
            </Typography>
            <Chip label={`Unique: ${uniqueProblemsCount}`} size="small" color="primary" />
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" color="info.main" gutterBottom>
              {completedTopicsCount}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Topics Completed
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          Keep up the great work! Explore more topics and challenges to boost your skills.
        </Typography>
      </Box>
    </Container>
  );
};

export default Homepage;