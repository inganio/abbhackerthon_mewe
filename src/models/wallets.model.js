import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  privatekey: String,
  publickey: String,
  address: String,
  userId: String,
});

const Wallet = mongoose.model("Wallet", walletSchema);

module.exports = Wallet;
