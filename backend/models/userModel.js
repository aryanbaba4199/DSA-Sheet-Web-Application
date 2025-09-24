const mongoose = require("mongoose");

//------------------- Problem Schema (separate collection) ----------------//
const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  youtubeLink: { type: String },
  leetcodeLink: { type: String },
  articleLink: { type: String },
  level: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
}, { timestamps: true });

const Problem = mongoose.model("Problem", problemSchema);

//------------------- Chapter Schema ----------------//
const chapterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  problems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }],
});

//------------------- Topic Schema ----------------//
const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  chapters: [chapterSchema],
}, { timestamps: true });

const Topic = mongoose.model("Topic", topicSchema);

//------------------- User Schema ----------------//
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true },
  completedProblems: [
  {
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
    status: { type: String, enum: ["Pending", "Done"], default: "Pending" },
  }
],

  completedTopics: [
    {
      topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
      status: { type: String, enum: ["Pending", "Done"], default: "Pending" },
    }
  ],

}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);

module.exports = { Topic, Problem, userModel };
