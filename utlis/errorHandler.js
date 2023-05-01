const { json } = require("body-parser");
const mongoose = require("mongoose");
const userValidation = require("../validation/userValidation");
const todoValidation = require("../validation/todoValidation");
const updateTodoValidation = require("../validation/updateTodoValidation");
const updateUserValidation = require("../validation/updateUserValidation");
const loginValidation = require("./../validation/loginValidation");
const photoValidation = require("./../validation/photoValidation");
const handleUserNotFound = (req, res, next) => {
  const err = res.status(404).json({ error: true, message: "User Not Found" });
  next(err);
};

const handleTodoNotFound = (req, res, next) => {
  const err = res
    .status(404)
    .json({ error: true, message: "Todo not found for this id" });
  next(err);
};

const handleInvalidId = (req, res, next) => {
  const userId = req.params.userId;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(403).json({ error: true, message: "Your id is invalid" });
  }
};

const validationError = (req, res, next) => {
  const { value, error } = userValidation.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errorMessages = error.details.map((err) => err.message);
    res.status(400).json({ error: true, message: errorMessages });
    next(errorMessages);
  }
  req.validateData = value;
  next();
};
const handlePhotoValidation = (req, res, next) => {
  const { value, error } = photoValidation.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errorMessages = error.details.map((err) => err.message);
    res.status(400).json({ error: true, message: errorMessages });
    next(errorMessages);
  }
  req.validateData = value;
  next();
};

const handleTodoValidation = (req, res, next) => {
  const { value, error } = todoValidation.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errorMessages = error.details.map((err) => err.message);
    res.status(400).json({ error: true, message: errorMessages });
    next(errorMessages);
  }
  req.validateData = value;
  next();
};

const handleTodoUpdateValidation = (req, res, next) => {
  const { value, error } = updateTodoValidation.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errorMessages = error.details.map((err) => err.message);
    res.status(400).json({ error: true, message: errorMessages });
    next(errorMessages);
  }
  req.validateData = value;
  next();
};

const handleUserUpdateValidation = (req, res, next) => {
  const { value, error } = updateUserValidation.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errorMessages = error.details.map((err) => err.message);
    res.status(400).json({ error: true, message: errorMessages });
    next(errorMessages);
  }
  req.validateData = value;
  next();
};

const loginUserValidation = (req, res, next) => {
  const { value, error } = loginValidation.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errorMessages = error.details.map((err) => err.message);
    res.status(400).json({ error: true, message: errorMessages });
    next(errorMessages);
  }
  req.validateData = value;
  next();
};
module.exports = {
  handleUserNotFound,
  handleInvalidId,
  validationError,
  handleTodoNotFound,
  handleTodoValidation,
  handleTodoUpdateValidation,
  handleUserUpdateValidation,
  loginUserValidation,
  handlePhotoValidation
};
