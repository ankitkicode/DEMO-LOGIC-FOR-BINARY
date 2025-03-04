const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    roleType : {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    username: {
      type: String,
      trim: true,
    },
    walletAddress: {
      type: String,
      default: "",
      required: true,
      unique: true, 
    },
    investment: {
      type: Number,
      default: 0,
    },
    totalInvestment: {
      type: Number,
      default: 0,
    },
    totalWithdrawal: {
      type: Number,
      default: 0,
    },
    totalIncome: {
      type: Number,
      default: 0,
    },
    totalPassiveIncome: {
      type: Number,
      default: 0,
    },

    // Referral System
    referralCode: {
      type: String,
      unique: true,
    },
    referrals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Binary Tree Structure
    leftChild: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rightChild: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    nodeType: {
      type: String,
      enum: ['leftChild', 'rightChild', null],
      default: null,
  },




    // Transactions & Withdrawals (Allow Multiple)
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
    withdrawals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Withdraw",
      },
    ],
  },
  
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
