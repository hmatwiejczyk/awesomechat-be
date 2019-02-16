const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const helpers = require('../helpers/helpers');
const config = require('../config/config');

exports.signup = async (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

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
    res.status(201).json({ message: 'User created', token });
  } catch (err) {
    res.status(500).json({ message: 'Error occured' });
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const payload = { id: user.id, name: user.name };
      const token = jwt.sign(payload, config.secret, { expiresIn: '1h' });
      res.cookie('auth', token);
      res.status(200).json({ token: 'Bearer ' + token });
    } else {
      res.status(401).json({ password: 'Wrong password' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error occured' });
  }
};
