import "dotenv/config";
import jsonWebToken from "jsonwebtoken";
import Opinion from "../models/opinion.model";

function uploadOpinion(req) {}

async function findProceedingOpinon(page, itemsPerPage) {
  try {
    const now = new Date();
    const skip = (page - 1) * itemsPerPage;

    // Find ongoing events with pagination
    const ongoingEvents = await Opinion.find({
      startDate: { $lte: now },
      dueDate: { $gte: now },
    })
      .skip(skip)
      .limit(itemsPerPage);

    return ongoingEvents;
  } catch (error) {
    throw error;
  }
}

async function findAll(page, itemsPerPage) {
  try {
    const skip = (page - 1) * itemsPerPage;

    // Find all events with pagination
    const allEvents = await Opinion.find({}).skip(skip).limit(itemsPerPage);

    return allEvents;
  } catch (error) {
    throw error;
  }
}

async function findMyOpinions(accessToken, page, itemsPerPage) {
  try {
    const decoded = jsonWebToken.verify(
      authorization,
      process.env.SECRET_JWT_CODE,
    );

    const userId = decoded.id;

    const skip = (page - 1) * itemsPerPage;

    // Find the user's events with pagination
    const userOpinions = await Opinion.find({ userId: userId })
      .skip(skip)
      .limit(itemsPerPage);

    return userOpinions;
  } catch (error) {
    throw error;
  }
}
