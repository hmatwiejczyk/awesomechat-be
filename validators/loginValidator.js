const Validator = require('validator');
const { isEmpty, lowerCase } = require('../helpers/helpers');
const User = require('../models/userModel');

exports.loginValidator = async (req, res, next) => {
  let errors = {};
  let email = req.body.email;
  let password = req.body.password;

  email = !isEmpty(email) ? email : '';
  password = !isEmpty(password) ? password : '';

  // if (!Validator.isLength(password, { min: 5, max: 30 })) {
  //   errors.password = 'Password must be at least 5 characters';
  // }

  // if (Validator.isEmpty(password)) {
  //   errors.password = 'Password field is required';
  // }

  const userEmail = await User.findOne({
    email: lowerCase(email)
  });

  if (!userEmail) {
    errors.email = 'Email does not exists';
  }

  if (!Validator.isEmail(email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(email)) {
    errors.email = 'Email field is required';
  }

  if (!isEmpty(errors)) {
    return res.status(400).json(errors);
  }
  next();
};
