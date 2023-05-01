const Joi = require("joi");
const schema = Joi.object().keys({
  photo: Joi.string()
    .pattern(/.(jpg|jpeg|gif|png)$/i)
    .messages({
      "string.empty": "Image cannot be empty",
      "string.pattern.base": "Please upload valid image file",
    })
});
module.exports = schema;
