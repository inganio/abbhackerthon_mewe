import mongoose from "mongoose";

const opinionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now(),
  },
  dueDate: {
    type: Date,
    required: true,
  },
  pdfUrl: {
    type: Date,
    required: true,
  },
});

const Opinion = mongoose.model("Opinion", opinionSchema);

module.exports = Opinion;
