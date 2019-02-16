const Validator = require('validator');
const { isEmpty, lowerCase } = require('../helpers/helpers');
const User = require('../models/userModel');

exports.signupValidator = async (req, res, next) => {
  let errors = {};
  let email = req.body.email;
  let name = req.body.name;
  let password = req.body.password;
  let password2 = req.body.password2;

  name = !isEmpty(name) ? name : '';
  email = !isEmpty(email) ? email : '';
  password = !isEmpty(password) ? password : '';
  password2 = !isEmpty(password2) ? password2 : '';

  if (!Validator.isLength(name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(name)) {
    errors.name = 'Name field is required';
  }

  if (!Validator.isEmail(email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(email)) {
    errors.email = 'Email field is required';
  }

  if (!Validator.isLength(password, { min: 5, max: 30 })) {
    errors.password = 'Password must be at least 5 characters';
  }

  if (Validator.isEmpty(password)) {
    errors.password = 'Password field is required';
  }

  if (!Validator.equals(password, password2)) {
    errors.password2 = 'Passwords must match';
  }

  if (Validator.isEmpty(password2)) {
    errors.password2 = 'Password2 field is required';
  }

  const userEmail = await User.findOne({
    email: lowerCase(email)
  });

  if (userEmail) {
    errors.email = 'Email already exists';
  }

  if (!isEmpty(errors)) {
    return res.status(400).json(errors);
  }
  next();
};
