const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionType: {
      type: String,
      enum: ["Deposit", "ROI", "Referral Bonus", "Binary Bonus"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    trxHash: {
      type: String, // Store Tron transaction hash
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);


const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
