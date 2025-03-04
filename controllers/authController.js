const User = require('../models/User');
const jwt = require("jsonwebtoken");
const {  generateUniqueUsername } = require('../utils/randomNameGenerators');
const { findNextAvailableNode } = require('../utils/FindNextPosition');
const { calculateBoosterIncome, calculateBinaryIncome } = require('../utils/calculations');

// const register = async (req, res) => {
//     const { walletAddress, investment, referralCode } = req.body;
//     try {
//         const user = await User.findOne({ walletAddress });
//         if (user) {
//             return res.status(400).json({ message: "User already exists" });
//         }
//         const usersConut = await User.countDocuments();
//         let parent = null;
//         let leftChild = null;
//         let rightChild = null;
//         let referral = null;
//         if (usersConut > 0) {
//             referral = await User.findOne({
//                 referralCode: referralCode,
//             });
//             if (!referral) {
//                 return res.status(400).json({ message: "Invalid referral code" });
//             }
//             parent = referral;
//             if (!parent.leftChild) {
//                 leftChild = parent;
//             } else if (!parent.rightChild) {
//                 rightChild = parent;
//             } else {
//                 return res.status(400).json({ message: "Referral has two children" });
//             }
//         }
//         const username = await generateUniqueUsername();
//         const newUser = new User({
//             username,
//             walletAddress,
//             investment,
//             referralCode,
//             parent,
//             leftChild,
//             rightChild,
//         });
//         await newUser.save();
//         if (parent) {
//             if (!parent.leftChild) {
//                 parent.leftChild = newUser;
//             } else {
//                 parent.rightChild = newUser;
//             }
//             await parent.save();
//         }
//         return res.status(201).json({ message: "User created successfully", newUser });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: error.message });


//     }
// }


const register = async (req, res) => {
    const { walletAddress, investment = 0 } = req.body;
    const referralCode = req.params.referralCode; 

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ walletAddress });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Count existing users in the database
        const userCount = await User.countDocuments();
        let parent = null;
        let nodeType = null;

        // If it's not the first user, referral code is mandatory
        if (userCount === 0) {
            console.log("Creating first user in the system...");
        } else {
            if (!referralCode) {
                return res.status(400).json({ message: "Referral code is required for new users" });
            }

            const referralUser = await User.findOne({ referralCode });
            if (!referralUser) {
                return res.status(400).json({ message: "Invalid referral code" });
            }



            let nodeInfo;

            // 🔥 First, check if the referral has an available left or right position
            if (!referralUser.leftChild || !referralUser.rightChild) {
                nodeInfo = { 
                    parent: referralUser, 
                    nodeType: !referralUser.leftChild ? "leftChild" : "rightChild" 
                };
            } else {
                // 🔥 If both positions are filled, find the next available node
                nodeInfo = await findNextAvailableNode(referralUser);
            }

            console.log("Next Available Position:", nodeInfo);

            if (!nodeInfo) {
                return res.status(400).json({ message: "Referral has no available position" });
            }

            parent = nodeInfo.parent;
            nodeType = nodeInfo.nodeType;
        }

        // Generate a unique username (starting with "CR")
        const username = await generateUniqueUsername();

        // 🔥 Ensure referralCode is unique before saving
        let newReferralCode = username;
        let referralExists = await User.findOne({ referralCode: newReferralCode });

        while (referralExists) {
            newReferralCode = await generateUniqueUsername();
            referralExists = await User.findOne({ referralCode: newReferralCode });
        }

        // Create new user
        const newUser = new User({
            username,
            walletAddress,
            investment,
            referralCode: newReferralCode, 
            parent: parent ? parent._id : null,
            nodeType: nodeType,
        });

        await newUser.save();

        // 🔥 Assign left or right child properly
        if (parent) {
            if (nodeType === "leftChild") {
                parent.leftChild = newUser._id;
            } else {
                parent.rightChild = newUser._id;
            }

            parent.referrals.push(newUser._id);
            await parent.save();
            await calculateBoosterIncome(parent._id);

            // 🔥 Trigger Binary Income Calculation
            await calculateBinaryIncome(parent._id);
        }

        return res.status(201).json({ message: "User created successfully", newUser });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    const { walletAddress } = req.body;

    try {
        // 🔍 Find user by wallet address
        const user = await User.findOne({ walletAddress });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const token = jwt.sign(
            { userId: user._id, walletAddress: user.walletAddress },
            process.env.JWT_SECRET || "mysecretkey",
            { expiresIn: "7d" } 
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return res.status(200).json({ 
            message: "Login successful", 
            user, 
            token 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};


const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });

        return res.status(200).json({ message: "User logged out successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};



module.exports = {
    register,
    login,
    logout,

}