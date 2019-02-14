const express = require('express');
const router = express.Router();

const { signupValidator } = require('../validators/validators')
const authController = require('../controllers/authController');

router.post('/signup',[signupValidator], authController.signup);

module.exports = router;