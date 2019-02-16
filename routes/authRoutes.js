const express = require('express');
const router = express.Router();

const { signupValidator } = require('../validators/signupValidator');
const { loginValidator } = require('../validators/loginValidator');
const authController = require('../controllers/authController');

router.post('/signup', [signupValidator], authController.signup);
router.post('/login', [loginValidator], authController.login);

module.exports = router;
