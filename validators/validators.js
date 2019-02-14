const Joi = require('joi');
const httpStatus = require('http-status-codes');

exports.signupValidator = (req, res, next) => {
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
  next();
}