import axios from "axios";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Checkbox,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Snackbar,
} from "@mui/material";
import { MdExpandMore, MdPlayArrow } from "react-icons/md";
import { SiYoutube } from "react-icons/si";
import { BiBook } from "react-icons/bi";

import { topicApi, userApi } from "../../Api";
import { useAuth } from "../../Context/userContext";

const Topics = () => {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const getTopics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(topicApi.get_topics, {
        withCredentials: true,
      });
      setTopics(res.data.topics || []);
    } catch (err) {
      console.error("Error fetching topics:", err);
      setError("Failed to load topics. Please try again.");
      setTopics([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProblemStatus = useCallback(async (problemId, status) => {
    try {
      await axios.put(userApi.complete_topic, { problemId, status }, { withCredentials: true });
      setSnackbar({ open: true, message: "Problem status updated successfully!", severity: "success" });
    } catch (err) {
      console.error("Error updating problem status:", err);
      setSnackbar({ open: true, message: "Failed to update problem status.", severity: "error" });
      throw err;
    }
  }, []);

  useEffect(() => {
    getTopics();
  }, [getTopics]);

  const enhancedTopics = useMemo(() => {
    if (!user || !topics.length) return [];

    const completedProblemIds = new Set(user.completedProblems.map(cp => cp.problemId.toString()));

    return topics.map((topic) => {
      const newChapters = topic.chapters.map((chapter) => ({
        ...chapter,
        problems: (chapter.problems || []).map((problem) => {
          const hasLocalStatus = problem.status !== undefined;
          const hasLocalChecked = problem.checked !== undefined;
          const isCompleted = completedProblemIds.has(problem._id.toString());
          const localOrDefaultStatus = hasLocalStatus ? problem.status : (isCompleted ? "Done" : "Pending");
          const localOrDefaultChecked = hasLocalChecked ? problem.checked : isCompleted;

          return {
            ...problem,
            status: localOrDefaultStatus,
            checked: localOrDefaultChecked,
            leetcodeLink: problem.leetcodeLink || "#",
            youtubeLink: problem.youtubeLink || "#",
            articleLink: problem.articleLink || "#",
            level: problem.level || "EASY",
          };
        }),
      }));

      const allDone = newChapters.every((ch) => ch.problems.every((p) => p.status === "Done"));

      return {
        ...topic,
        status: allDone ? "Done" : "Pending",
        chapters: newChapters,
      };
    });
  }, [topics, user?.completedProblems]);

  const handleCheckboxChange = useCallback(
    async (topicId, problemId) => {
      setTopics((prevTopics) => {
        const newTopics = prevTopics.map((t) => {
          if (t._id.toString() !== topicId) return t;

          const newChapters = t.chapters.map((ch) => ({
            ...ch,
            problems: ch.problems.map((p) => {
              if (p._id.toString() !== problemId) return p;

              const newChecked = !p.checked;
              const newStatus = newChecked ? "Done" : "Pending";

              return {
                ...p,
                checked: newChecked,
                status: newStatus,
              };
            }),
          }));

          const allDone = newChapters.every((ch) => ch.problems.every((p) => p.status === "Done"));
          const newTopicStatus = allDone ? "Done" : "Pending";

          return {
            ...t,
            status: newTopicStatus,
            chapters: newChapters,
          };
        });

        const updatedProblem = newTopics
          .find((t) => t._id.toString() === topicId)
          ?.chapters.flatMap((ch) => ch.problems)
          .find((p) => p._id.toString() === problemId);

        if (updatedProblem) {
          updateProblemStatus(problemId, updatedProblem.status).catch(() => {
            getTopics();
          });
        }

        return newTopics;
      });
    },
    [updateProblemStatus, getTopics]
  );

  const handleLinkClick = useCallback((link, e) => {
    e.stopPropagation();
    if (link !== "#") {
      window.open(link, "_blank");
    }
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const handleAccordionChange = useCallback((topicId, isExpanded) => {
    setExpandedTopic(isExpanded ? topicId : null);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
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
        Topics
      </Typography>
      <Typography variant="h6" align="center" sx={{ mb: 6, color: "text.secondary" }}>
        Explore these exciting topics!
      </Typography>

      {enhancedTopics.length === 0 ? (
        <Alert severity="info">No topics available yet. Check back soon!</Alert>
      ) : (
        <>
          {enhancedTopics.map((topic) => (
            <Accordion
              key={topic._id}
              expanded={expandedTopic === topic._id}
              onChange={(e, isExpanded) => handleAccordionChange(topic._id, isExpanded)}
              sx={{
                mb: 3,
                boxShadow: 2,
                "&:before": { display: "none" },
                borderRadius: 2,
                backgroundColor: "info.light",
              }}
            >
              <AccordionSummary
                expandIcon={<MdExpandMore />}
                sx={{
                  backgroundColor: "info.main",
                  color: "white",
                  "& .MuiAccordionSummary-expandIconWrapper": {
                    color: "white",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                  <div className="flex gap-4">
                  <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
                    {topic.name}
                  </Typography>
                  <Chip
                    label={topic.status}
                    color={topic.status === "Done" ? "success" : "warning"}
                    variant="filled"
                    sx={{ ml: 2 }}
                  />
                  </div>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0, color: "text.primary", backgroundColor: "background.paper" }}>
                <TableContainer sx={{ backgroundColor: "white" }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "info.main", color: "white" }}>
                        <TableCell padding="checkbox" sx={{ fontWeight: "bold" }} />
                        <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>LeetCode Link</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>YouTube Link</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Article Link</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Level</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody sx={{ color: "text.primary", backgroundColor: "background.paper" }}>
                      {topic.chapters.map((chapter) => (
                        <React.Fragment key={chapter._id}>
                          {chapter.problems && chapter.problems.length > 0 && (
                            <TableRow>
                              <TableCell colSpan={7} sx={{ backgroundColor: "grey.50", p: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                  {chapter.name}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                          {chapter.problems.map((problem) => (
                            <TableRow key={problem._id} hover>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={problem.checked}
                                  onChange={() => handleCheckboxChange(topic._id, problem._id)}
                                  color="primary"
                                />
                              </TableCell>
                              <TableCell>{problem.title}</TableCell>
                              <TableCell>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<MdPlayArrow />}
                                  onClick={(e) => handleLinkClick(problem.leetcodeLink, e)}
                                  sx={{ minWidth: 80 }}
                                >
                                  Practice
                                </Button>
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  onClick={(e) => handleLinkClick(problem.youtubeLink, e)}
                                  color="error"
                                  size="small"
                                >
                                  <SiYoutube />
                                </IconButton>
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  onClick={(e) => handleLinkClick(problem.articleLink, e)}
                                  color="primary"
                                  size="small"
                                >
                                  <BiBook />
                                </IconButton>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={problem.level}
                                  color="info"
                                  variant="outlined"
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={problem.status}
                                  color={problem.status === "Done" ? "success" : "warning"}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          ))}
        </>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Topics;