const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authController = require('../controllers/authController');



router.post('/register/:referralCode?', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);


module.exports = router;
