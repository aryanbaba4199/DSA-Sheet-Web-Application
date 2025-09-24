import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  LinearProgress,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { MdExpandMore, MdPlayArrow } from "react-icons/md";
import { userApi } from '../../Api';
import { useAuth } from "../../Context/userContext";

const UserProgress = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  const get_progress_data = async () => {
    try {
      setLoading(true);
      const res = await axios.get(userApi.progress, { withCredentials: true });
      console.log("Progress data", res.data);
      setProgressData(res.data);
    } catch (err) {
      console.log("Error while fetching progress data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    get_progress_data();
  }, []);

  const enhancedProgress = useMemo(() => {
    if (!user || !progressData?.topicProgress) return progressData;

    const completedProblemIds = new Set(user.completedProblems.map(cp => cp.problemId.toString()));

    const enhancedTopics = progressData.topicProgress.map((topic) => {
      const enhancedChapters = topic.chapters.map((chapter) => ({
        ...chapter,
        problems: (chapter.problems || []).map((problem) => {
          const isCompleted = completedProblemIds.has(problem._id.toString());
          return {
            ...problem,
            status: isCompleted ? "Done" : "Pending",
            checked: isCompleted,
          };
        }),
      }));

      const topicTotal = enhancedChapters.reduce((sum, ch) => sum + ch.problems.length, 0);
      const topicCompleted = enhancedChapters.reduce((sum, ch) => sum + ch.problems.filter(p => p.status === "Done").length, 0);
      const topicPercentage = topicTotal > 0 ? Math.round((topicCompleted / topicTotal) * 100) : 0;

      const enhancedTopic = {
        ...topic,
        topicTotal,
        topicCompleted,
        topicPercentage,
        chapters: enhancedChapters.map((ch) => {
          const chTotal = ch.problems.length;
          const chCompleted = ch.problems.filter(p => p.status === "Done").length;
          const chPercentage = chTotal > 0 ? Math.round((chCompleted / chTotal) * 100) : 0;
          return {
            ...ch,
            chapterTotal: chTotal,
            chapterCompleted: chCompleted,
            chapterPercentage: chPercentage,
          };
        }),
      };

      return enhancedTopic;
    });

    const overallTotal = enhancedTopics.reduce((sum, t) => sum + t.topicTotal, 0);
    const overallCompleted = enhancedTopics.reduce((sum, t) => sum + t.topicCompleted, 0);
    const overallPercentage = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0;

    return {
      overall: {
        totalProblems: overallTotal,
        totalCompleted: overallCompleted,
        overallPercentage,
      },
      topicProgress: enhancedTopics,
    };
  }, [progressData, user?.completedProblems]);

  const data = enhancedProgress || progressData;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!progressData) {
    return (
      <Box m={2}>
        <Typography>Error loading progress data.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}
      >
        Your Progress
      </Typography>

      {/* Overall Progress */}
      <Box sx={{ mb: 4, p: 3, backgroundColor: "background.paper", borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ color: "text.primary" }}>
          Overall Progress
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Completed {data.overall.totalCompleted} out of {data.overall.totalProblems} problems
        </Typography>
        <LinearProgress variant="determinate" value={data.overall.overallPercentage} sx={{ mb: 1 }} />
        <Typography variant="body2" align="right" sx={{ color: "text.secondary" }}>
          {data.overall.overallPercentage}%
        </Typography>
      </Box>

      {/* Topic Progress */}
      {data.topicProgress.map((topic) => (
        <Accordion key={topic.topicId} sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <AccordionSummary expandIcon={<MdExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
                {topic.topicName}
              </Typography>
              <Chip
                label={`${topic.topicCompleted}/${topic.topicTotal}`}
                color="primary"
                variant="outlined"
                sx={{ mr: 1 }}
              />
              <Chip
                label={`${topic.topicPercentage}%`}
                color={topic.topicPercentage === 100 ? "success" : "warning"}
                variant="filled"
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            {topic.chapters
              .filter((chapter) => chapter.problems.length > 0 || chapter.chapterTotal > 0)
              .map((chapter) => (
                <Box
                  key={chapter._id}
                  sx={{
                    p: 3,
                    backgroundColor: "grey.50",
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: "primary.main" }}>
                    {chapter.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Completed {chapter.chapterCompleted} out of {chapter.chapterTotal} problems
                  </Typography>
                  <LinearProgress variant="determinate" value={chapter.chapterPercentage} sx={{ mb: 2 }} />
                  <Typography variant="body2" align="right" sx={{ mb: 3, color: "text.secondary" }}>
                    {chapter.chapterPercentage}%
                  </Typography>

                  {/* Problems List */}
                  <Box>
                    {chapter.problems.map((problem) => (
                      <Box
                        key={problem._id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 2,
                          mb: 1,
                          backgroundColor: "white",
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "grey.200",
                        }}
                      >
                        <Chip
                          label={problem.status}
                          color={problem.status === "Done" ? "success" : "default"}
                          size="small"
                          sx={{ mr: 2, minWidth: 60 }}
                        />
                        <Typography variant="body1" sx={{ flexGrow: 1, fontWeight: 500 }}>
                          {problem.title}
                        </Typography>
                        <Chip label={problem.level} color="info" variant="outlined" size="small" sx={{ mr: 2 }} />
                        <IconButton
                          onClick={() => window.open(problem.leetcodeLink, "_blank")}
                          size="small"
                          color="primary"
                        >
                          <MdPlayArrow />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default UserProgress;