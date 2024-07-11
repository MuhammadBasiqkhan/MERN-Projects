const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  author: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  productID: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
  answers: [
    {
      content: { type: String },
      user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
      answeredAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  views: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  dislikes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  questionAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Question", QuestionSchema);
