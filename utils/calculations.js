const Investment = require("../models/Investment");
const User = require("../models/User");

const calculateBinaryIncome = async (userId) => {
    console.log("Calculating Binary Income for all users...");
    try {
        const user = await User.findById(userId)
        .populate("leftChild")
        .populate("rightChild");
        
        if (user.leftChild && user.rightChild) {
            const investmentLeft = await Investment.findOne({ user: user.leftChild._id });
            const investmentRight = await Investment.findOne({ user: user.rightChild._id });

            if (investmentLeft && investmentRight) {
                const minInvestment = Math.min(investmentLeft.amount, investmentRight.amount);
                const binaryBonus = minInvestment * 0.10; // 10% on the smaller investment

                await User.findByIdAndUpdate(userId, {
                    $inc: { totalIncome: binaryBonus }
                });

                console.log(`Binary Income of ${binaryBonus} TRX added to ${user.username}`);
            }
        }
    } catch (error) {
        console.error("Error calculating Binary Income:", error);
    }
};


const calculateBoosterIncome = async (userId) => {
    console.log("Calculating Booster Income for all users...");
    try {
        const user = await User.findById(userId).populate("referrals");

        if (user.referrals.length === 2) {
            const referral1 = await Investment.findOne({ user: user.referrals[0]._id });
            const referral2 = await Investment.findOne({ user: user.referrals[1]._id });

            if (referral1 && referral2 && referral1.amount === referral2.amount) {
                const activationDate = new Date(user.createdAt);
                const currentDate = new Date();
                const daysSinceActivation = Math.floor((currentDate - activationDate) / (1000 * 60 * 60 * 24));

                let boosterAmount = 0;
                if (daysSinceActivation <= 7) {
                    boosterAmount = user.investment * 0.50; // 50% Booster Bonus
                } else if (daysSinceActivation <= 15) {
                    boosterAmount = user.investment * 0.25; // 25% Booster Bonus
                }

                if (boosterAmount > 0) {
                    await User.findByIdAndUpdate(userId, {
                        $inc: { totalIncome: boosterAmount }
                    });
                    console.log(`Booster Income of ${boosterAmount} TRX added to ${user.username}`);
                }
            }
        }
    } catch (error) {
        console.error("Error calculating Booster Income:", error);
    }
};


const calculateDailyROI = async () => {
    console.log("Calculating Daily ROI for all users...");
    try {
        const investments = await Investment.find({ status: "Completed" });

        for (let investment of investments) {
            const dailyROI = investment.amount * 0.01; // 1% Daily ROI
            investment.roiEarned += dailyROI;
            await investment.save();

            // Update user's total income
            await User.findByIdAndUpdate(investment.user, {
                $inc: { totalIncome: dailyROI, totalPassiveIncome: dailyROI }
            });
        }
        
        console.log("ROI updated for all users");
    } catch (error) {
        console.error("Error calculating ROI:", error);
    }
};

module.exports = { calculateBinaryIncome, calculateBoosterIncome, calculateDailyROI };