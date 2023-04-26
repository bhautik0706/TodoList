const Joi = require("joi");

const schema = Joi.object({
  assigningto: Joi.array()
    .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
    .unique()
    .messages({
      "string.empty": "Assigning can not be empty",
      "any.required": "Assigningto is required",
      "array.unique": "Assigningto contains duplicate IDs",
      "string.pattern.base": "Invalid ObjectId format",
    }),
  title: Joi.string()
    .regex(/^[^0-9]/)
    .required()
    .messages({
      "string.empty": "Title can not be empty",
      "string.pattern.base": "Title must not start with a number",
      "any.required": "Title is required",
    }),
  description: Joi.string().min(10).max(100).required().messages({
    "any.required": "Description is required",
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description must be at most 100 characters long",
  }),
  duedate: Joi.date().greater("now").required().messages({
    "any.required": "Due date is required",
    "date.greater": "Due date must be in the future",
  }),
  status: Joi.string()
    .valid("pending", "ongoing", "complete")
    .required()
    .messages({
      "any.required": "Status is required",
      "any.only": "Status must be pending, ongoing or complete",
    }),
  subtasks: Joi.array(),
  active: Joi.boolean().default(true),
});

module.exports = schema;
