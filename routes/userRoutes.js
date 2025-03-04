const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { invest } = require("../controllers/investmentController");

router.get('/profile', userController.getUserProfile);




// investmentRoutes file
router.post("/invest", invest);


module.exports = router;