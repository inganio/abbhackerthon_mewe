import mongoose from "mongoose";
import "dotenv/config";

const env = process.env;
const db = mongoose.connect(env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = db;
