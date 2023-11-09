import express from "express";
import surveyService from "../services/api.service";
import Survey from "../models/survey.model";
import Wallet from "../models/wallets.model";
import jsonWebToken from "jsonwebtoken";
import axios from "axios";
const router = express.Router();

// Create a new survey
router.post("/create", async (req, res) => {
  try {
    const newSurveyData = req.body;
    const savedSurvey = await surveyService.createSurvey(newSurveyData);
    res.status(201).json(savedSurvey);
  } catch (error) {
    console.error("Error creating survey:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all surveys
router.get("/getAll", async (req, res) => {
  try {
    const { writer, proceeding, page, pageSize } = req.query;

    let filter = {};

    // Check filter criteria
    if (writer) {
      filter.writer = writer;
    }

    if (proceeding) {
      // Add logic based on your definition of "proceeding"
      // For example, if "proceeding" means surveys that are not completed, you might use:
      filter.completed = false;
    }

    const surveys = await surveyService.getAllSurveys(filter, page, 7);
    res.status(200).json(surveys);
  } catch (error) {
    console.error("Error getting surveys:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Update a survey
router.put("/update/:surveyId", async (req, res) => {
  try {
    const surveyId = req.params.surveyId;
    const update = req.body;
    const updatedSurvey = await surveyService.updateSurvey(surveyId, update);
    res.status(200).json(updatedSurvey);
  } catch (error) {
    console.error("Error updating survey:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a survey
router.delete("/delete/:surveyId", async (req, res) => {
  try {
    const surveyId = req.params.surveyId;
    const deletedSurvey = await surveyService.deleteSurvey(surveyId);
    res.status(200).json(deletedSurvey);
  } catch (error) {
    console.error("Error deleting survey:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/submit-answers/:surveyId", async (req, res) => {
  try {
    const surveyId = req.params.surveyId;
    const survey = await Survey.findById(surveyId);

    if (!survey) {
      return res.status(404).json({ error: "Survey not found" });
    }

    const { answers } = req.body;

    // Validate answers structure based on your requirements
    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: "Invalid answers format" });
    }

    // Check if the survey is still active or has not been completed
    if (!survey.completed && new Date() <= new Date(survey.dueDate)) {
      // Save the answers to the appropriate question(s)
      answers.forEach((answer, index) => {
        // Validate the answer structure based on your requirements
        if (!answer.option || typeof answer.option !== "string") {
          return res.status(400).json({ error: "Invalid answer format" });
        }

        // Find the question by its index
        const question = survey.questions[index];

        // Find the response option in the question
        const responseOption = question.responses.find(
          (option) => option.options === answer.option,
        );

        if (responseOption) {
          // Increment the count for the selected response option
          responseOption.count += 1;
        } else {
          return res.status(400).json({ error: "Invalid response option" });
        }
      });

      // Save the updated survey
      const updatedSurvey = await survey.save();

      const userId = jsonWebToken.verify(
        req.headers.authorization,
        process.env.SECRET_JWT_CODE,
      ).id;

      const userWallet = await Wallet.find({ userId: userId });

      axios.post("http://175.106.96.224:3398/v1/mitumt/point/transfer", {
        token: process.env.API_TOKEN,
        chain: "mitumt",
        cont_addr: process.env.CONTRACT_ADDRESS,
        sender: process.env.SENDER,
        sender_pkey: process.env.SENDER_PKEY,
        receiver: userWallet.address,
        amount: 10,
      });

      res.status(200).json({
        message: "Survey answers recorded successfully",
        survey: updatedSurvey,
      });
    } else {
      return res
        .status(403)
        .json({ error: "Survey is no longer active or has been completed" });
    }
  } catch (error) {
    console.error("Error submitting survey answers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
