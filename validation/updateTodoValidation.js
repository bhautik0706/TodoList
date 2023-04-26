const Joi = require("joi");

const schema = Joi.object({
  assigningto: Joi.array()
    .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
    .unique()
    .messages({
      "array.unique": "Assigningto contains duplicate IDs",
      "string.pattern.base": "Invalid ObjectId format",
    }),
  title: Joi.string()
    .regex(/^[^0-9]/)
    .messages({
      "string.pattern.base": "Title must not start with a number"
    }),
  description: Joi.string().min(10).max(100).messages({
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description must be at most 100 characters long",
  }),
  duedate: Joi.date().greater("now").messages({
    "date.greater": "Due date must be in the future",
  }),
  status: Joi.string()
    .valid("pending", "ongoing", "complete")
    .messages({
      "any.only": "Status must be pending, ongoing or complete",
    }),
  subtasks: Joi.array(),
  active: Joi.boolean().default(1),
});

module.exports = schema;
