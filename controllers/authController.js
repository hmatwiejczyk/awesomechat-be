const Joi = require('joi');
const httpStatus = require('http-status-codes');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const helpers = require('../helpers/helpers');

exports.signup = async (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().email(),
    name: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
    
  });

  const { error, value } = Joi.validate(req.body, schema);
  if (error && error.details) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.details });
  }
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
    const result = await user.save();
    res
      .status(httpStatus.CREATED)
      .json({ message: 'User created', id: result._id});
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error occured' });
  }
};
