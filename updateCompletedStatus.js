import mongoose from "mongoose";
import Survey from "./src/models/survey.model";
import "dotenv/config";
import axios from "axios";

async function updateCompletedStatus() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Find surveys that are still active and due date has passed
    const surveysToUpdate = await Survey.find({
      completed: false,
      dueDate: { $lt: new Date() },
    });

    // Update completed status for each survey
    surveysToUpdate.forEach(async (survey) => {
      survey.completed = true;
      await survey.save();
      console.log(`Survey ${survey._id} marked as completed.`);
    });

    // Disconnect from MongoDB
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error updating completed status:", error);
  }
}

module.exports = updateCompletedStatus;
