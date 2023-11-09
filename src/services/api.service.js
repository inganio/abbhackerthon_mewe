import Survey from "../models/survey.model.js";

async function createSurvey(newSurveyData) {
  try {
    const newSurvey = new Survey(newSurveyData);
    const savedSurvey = await newSurvey.save();
    return savedSurvey;
  } catch (error) {
    throw error;
  }
}

async function getAllSurveys(filter = {}, page = 1, pageSize = 7) {
  try {
    const surveys = await Survey.find(filter)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return surveys;
  } catch (error) {
    throw error;
  }
}

async function updateSurvey(surveyId, update) {
  try {
    const updatedSurvey = await Survey.findByIdAndUpdate(surveyId, update, {
      new: true,
    });
    return updatedSurvey;
  } catch (error) {
    throw error;
  }
}

async function deleteSurvey(surveyId) {
  try {
    const deletedSurvey = await Survey.findByIdAndDelete(surveyId);
    return deletedSurvey;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createSurvey,
  getAllSurveys,
  updateSurvey,
  deleteSurvey,
};
