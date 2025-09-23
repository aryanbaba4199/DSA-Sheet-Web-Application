const Topic = require("../models/problemModel");

//---------------------Create a Problem-------------------------------//
exports.create_problem = async (req, res) => {
  try {
    const { topicId, chapterName, title, youtubeLink, leetcodeLink, articleLink, level } = req.body;


    const topic = await Topic.findById(topicId);
    if (!topic) return res.status(404).json({ message: "Topic not found" });


    let chapter = topic.chapters.find(c => c.name === chapterName);
    if (!chapter) {
      chapter = { name: chapterName, problems: [] };
      topic.chapters.push(chapter);
    }

    chapter.problems.push({ title, youtubeLink, leetcodeLink, articleLink, level });

    await topic.save();
    res.status(201).json({ message: "Problem created successfully", topic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//--------------------- Getting Problems -------------------------------//
exports.get_problems = async (req, res) => {
  try {
    const topics = await Topic.find();
    res.status(200).json(topics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//---------------------Update a Problem-------------------------------//
exports.update_problem = async (req, res) => {
  try {
    const { topicId, chapterName, problemId, title, youtubeLink, leetcodeLink, articleLink, level } = req.body;

    const topic = await Topic.findById(topicId);
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    const chapter = topic.chapters.find(c => c.name === chapterName);
    if (!chapter) return res.status(404).json({ message: "Chapter not found" });

    const problem = chapter.problems.id(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    problem.title = title || problem.title;
    problem.youtubeLink = youtubeLink || problem.youtubeLink;
    problem.leetcodeLink = leetcodeLink || problem.leetcodeLink;
    problem.articleLink = articleLink || problem.articleLink;
    problem.level = level || problem.level;

    await topic.save();
    res.status(200).json({ message: "Problem updated successfully", topic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//---------------------Delete a Problem-------------------------------//
exports.delete_problem = async (req, res) => {
  try {
    const { topicId, chapterName, problemId } = req.body;

    const topic = await Topic.findById(topicId);
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    const chapter = topic.chapters.find(c => c.name === chapterName);
    if (!chapter) return res.status(404).json({ message: "Chapter not found" });

    const problem = chapter.problems.id(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    problem.remove();
    await topic.save();

    res.status(200).json({ message: "Problem deleted successfully", topic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



//---------------------Getting a Problem-------------------------------//
exports.get_problem_by_id = async (req, res) => {
  try {
    const { problemId } = req.params;

    const topics = await Topic.find();

    for (const topic of topics) {
      for (const chapter of topic.chapters) {
        const problem = chapter.problems.id(problemId);
        if (problem) {
          return res.status(200).json({ topic: topic.name, chapter: chapter.name, problem });
        }
      }
    }

    res.status(404).json({ message: "Problem not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

