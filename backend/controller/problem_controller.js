const { default: mongoose } = require("mongoose");
const { Problem, Topic, userModel } = require("../models/userModel");


//---------------------Create Problem + Add to Topic/Chapter-------------------------------//
exports.create_problem = async (req, res) => {
  console.log("Request Body:", req.body); 
  try {
    const problemsArray = req.body;

    if (!Array.isArray(problemsArray) || problemsArray.length === 0) {
      return res.status(400).json({ message: "Array of problems is required" });
    }

    const topicMap = {};
    for (const p of problemsArray) {
      const { topicName, chapterName, title, youtubeLink, leetcodeLink, articleLink, level } = p;

      const problem = await Problem.create({
        title,
        youtubeLink,
        leetcodeLink,
        articleLink,
        level,
      });

      let topic = topicMap[topicName];
      if (!topic) {
        topic = await Topic.findOne({ name: topicName });
        if (!topic) {
          topic = new Topic({ name: topicName, chapters: [] });
        }
        topicMap[topicName] = topic;
      }

      let chapter = topic.chapters.find((c) => c.name === chapterName);
      if (!chapter) {
        chapter = { name: chapterName, problems: [] };
        topic.chapters.push(chapter);
      }

      chapter.problems.push(problem._id);
    }

    for (const topic of Object.values(topicMap)) {
      await topic.save();
      await topic.populate({
        path: "chapters.problems",
        model: "Problem",
      });
    }

    res.status(201).json({
      message: "All problems created and added to topics successfully",
      topics: Object.values(topicMap),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


//---------------------Getting all Problems (with populated refs)-------------------------------//
exports.get_problems = async (req, res) => {
  try {
    const topics = await Topic.find().populate({
      path: "chapters.problems",
      model: "Problem",
    });
    res.status(200).json({success: true,  topics: topics});
  } catch (err) {
    console.error(err);
    res.status(500).json({success: false, message: "Server error" });
  }
};

//---------------------Getting a Problem by ID-------------------------------//
exports.get_problem_by_id = async (req, res) => {
  try {
    const { problemId } = req.params;

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const topic = await Topic.findOne({ "chapters.problems": problemId });
    let chapterName = null;
    if (topic) {
      const chapter = topic.chapters.find((c) =>
        c.problems.includes(problemId)
      );
      chapterName = chapter?.name;
    }

    res.status(200).json({ topic: topic?.name, chapter: chapterName, problem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//---------------------Update Topic Completed -------------------------------//
exports.update_problem_status = async (req, res) => {
  try {
    const { problemId, status } = req.body; // "Pending" or "Done"
    const userId = req.userId;

    if (!["Pending", "Done"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const problemObjectId = new mongoose.Types.ObjectId(problemId);

    if (status === "Done") {
      const existing = user.completedProblems.find(
        (p) => p.problemId && p.problemId.toString() === problemObjectId.toString()
      );

      if (!existing) {
        user.completedProblems.push({ problemId: problemObjectId, status });
      } else {
        existing.status = status;
      }
    } else if (status === "Pending") {
      user.completedProblems = user.completedProblems.filter(
        (p) => !(p.problemId && p.problemId.toString() === problemObjectId.toString())
      );
    }

    await user.save();

    res.status(200).json({
      message: "Problem status updated",
      completedProblems: user.completedProblems,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//---------------------User Progress -------------------------------//
exports.get_user_progress = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel
      .findById(userId)
      .populate({
        path: "completedProblems.problemId",
        select: "_id title",
      })
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    const topics = await Topic.find().populate("chapters.problems").lean();

    let totalProblems = 0;
    let totalCompleted = 0;

    const topicProgress = topics.map((topic) => {
      let topicTotal = 0;
      let topicCompleted = 0;

      const chapters = topic.chapters.map((ch) => {
        const chapterTotal = ch.problems.length;
        const chapterCompleted = ch.problems.filter((p) =>
          user.completedProblems.some(
            (cp) => cp.problemId && cp.problemId.toString() === p._id.toString()
          )
        ).length;

        topicTotal += chapterTotal;
        topicCompleted += chapterCompleted;

        return {
          ...ch,
          chapterTotal,
          chapterCompleted,
          chapterPercentage: chapterTotal === 0 ? 0 : Math.round((chapterCompleted / chapterTotal) * 100),
        };
      });

      totalProblems += topicTotal;
      totalCompleted += topicCompleted;

      return {
        topicId: topic._id,
        topicName: topic.name,
        topicTotal,
        topicCompleted,
        topicPercentage: topicTotal === 0 ? 0 : Math.round((topicCompleted / topicTotal) * 100),
        chapters,
      };
    });

    const overallPercentage = totalProblems === 0 ? 0 : Math.round((totalCompleted / totalProblems) * 100);

    res.status(200).json({
      overall: {
        totalProblems,
        totalCompleted,
        overallPercentage,
      },
      topicProgress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};









