const httpStatus = require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const helpers = require('../helpers/helpers');
const config = require('../config/config');

exports.signup = async (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  const userEmail = await User.findOne({
    email: helpers.lowerCase(email)
  });
  if (userEmail) {
    return res
      .status(httpStatus.CONFLICT)
      .json({ message: 'Email already exists' });
  }
  const userName = await User.findOne({
    name: helpers.firstUpper(name)
  });
  if (userName) {
    return res
      .status(httpStatus.CONFLICT)
      .json({ message: 'Name already exists' });
  }
  try {
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email: helpers.lowerCase(email),
      password: hashedPw,
      name: helpers.firstUpper(name)
    });
    const createdUser = await user.save();
    const token = jwt.sign(
      {
        email: createdUser.email,
        userId: createdUser._id.toString()
      },
      config.secret,
      { expiresIn: '1h' }
    );
    res.cookie('auth', token);
    res
      .status(httpStatus.CREATED)
      .json({ message: 'User created', token });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error occured' });
  }
};
