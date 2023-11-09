import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  options: { type: String, required: true },
  cout: { type: Number, default: 0 },
});

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  responses: [responseSchema],
});

const surveySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  writer: { type: String, required: true },
  questions: [questionSchema],
  completed: { type: Boolean, default: false },
});

const Survey = mongoose.model("Survey", surveySchema);

module.exports = Survey;
