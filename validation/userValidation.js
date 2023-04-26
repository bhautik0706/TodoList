const Joi = require("joi");
const schema = Joi.object().keys(
  {
    name: Joi.string()
      //.label("Name can not be empty")
      .pattern(/^[A-Za-z\s]+$/)
      //.label("Please enter only alphabet")
      .messages({
        "string.empty": "Name cannot be empty",
        "string.pattern.base": "Please enter only alphabet",
        "any.required": "Name is required",
      })
      .required(),

    email: Joi.string()
      .pattern(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)
      .messages({
        "string.empty": "Email cannot be empty",
        "string.pattern.base": "Please enter valid email",
        "any.required": "Email is required"
      })
      .required(),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/)
      .messages({
        "string.empty": "password cannot be empty",
        "string.pattern.base": "Please enter valid password",
        "any.required": "Password is required",
        "string.min": "Password length must be at least 8 characters long"
      })
      .required(),
  },
  { abortEarly: false }
);

module.exports = schema;
