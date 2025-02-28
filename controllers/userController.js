const User = require('../models/User');

const getUserProfile = async (req, res) => {
    try {
        res.json({ message: 'User profile.' });
    } catch (error) {
        console.error('Error:', error);
    }
} 












module.exports = {
    getUserProfile,
}

