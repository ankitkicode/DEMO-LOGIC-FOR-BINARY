const Investment = require("../models/Investment");
const User = require("../models/User");
const { calculateBoosterIncome, calculateBinaryIncome } = require('../utils/calculations');


const invest = async (req, res) => {
  console.log("Investing...");
  try {
    const { userId, amount, trxHash } = req.body;

    // Validate amount
    if (amount < 100) {
      return res.status(400).json({ message: "Minimum investment is 100 TRX" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create new investment record
    const newInvestment = new Investment({
      user: user._id,
      amount,
      trxHash,
      status: "Completed", 
    });

    // Update user's investment
    user.investment += amount;
    await user.save();
    await newInvestment.save();

    // 🔥 If the user has a parent (referral), update incomes
    console.log(`Checking incomes for ${user}`);
    if (user.parent) {
        console.log(`Checking booster and binary income for ${user.parent}`);
        
        // 🔥 Check if parent qualifies for Booster Income
        await calculateBoosterIncome(user.parent);

        // 🔥 Check if parent qualifies for Binary Income
        await calculateBinaryIncome(user.parent);
    }

    return res.status(201).json({ message: "Investment successful", investment: newInvestment });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { invest };
