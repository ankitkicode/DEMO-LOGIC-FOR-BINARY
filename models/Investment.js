const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    trxHash: { type: String, required: true, unique: true }, // Blockchain Transaction Hash
    status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
    roiEarned: { type: Number, default: 0 }, // Track total ROI earned
    startDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Investment", investmentSchema);
