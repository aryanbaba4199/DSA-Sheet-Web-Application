const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  youtubeLink: { type: String },
  leetcodeLink: { type: String },
  articleLink: { type: String },
  level: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
});

const chapterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  problems: [problemSchema],
});

const topicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    chapters: [chapterSchema],
  },
  { timestamps: true }
);

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
