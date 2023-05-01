const { default: mongoose } = require("mongoose");
const { validate } = require("./../model/userModel");
const User = require("./../model/userModel");
const userValidation = require("../validation/userValidation");
const validateuser = require("express-validator");
const { query } = require("express-validator");
const globalerror = require("./../utlis/errorHandler");
const imageUpload = require("./../utlis/multer");
const responseHandler = require("./../utlis/responseHandler");
const upload = require("./../utlis/multer");
//const multer = require("multer");

exports.createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  const profileimage  = req.file.path;
  console.log(profileimage);
  try {
    //console.log(schema.validate(req.body));
    const user = req.validateData;
    if (await User.findOne({ email: req.body.email })) {
      res
        .status(409)
        .json({ error: true, message: "This email alredy Exist!" });
      return;
    } else {
      const message = "Success! Your Submission has been Saved";
      const user = new User({ name, email, profileimage, password });
      const savedUser = await user.save();
      responseHandler.sendCreateResponce(res, message, savedUser);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { name, email, active, page = 1, limit = 10 } = req.query;
    const queryObj = {};
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";
    if (name) {
      queryObj.name = name;
    }
    if (email) {
      queryObj.email = email;
    }
    if (active) {
      queryObj.active = active;
    }
    const userQuery = await User.find(queryObj);
    if (userQuery.length === 1) {
      responseHandler.sendSuccessResponce(res, userQuery);
    } else {
      const user = await User.find({
        active: true,
      })
        .select("name email")
        .sort({ [sortBy]: sortOrder })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const count = await User.countDocuments();
      if (user.length === 0) {
        return globalerror.handleUserNotFound(req, res, next);
      } else {
        const totalPages = Math.ceil(count / limit);
        const currentPage = page;
        const result = user.length;
        const message = "Success";
        responseHandler.sendSuccessResponce(
          res,
          message,
          user,
          totalPages,
          currentPage,
          result
        );
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = req.validateData;
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return globalerror.handleInvalidId(req, res, next);
    } else {
      const updateUser = await User.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updateUser) {
        return globalerror.handleUserNotFound(req, res, next);
      }
      const message = "Your changes has been Successfully saved";
      responseHandler.sendSuccessResponce(res, message, updateUser);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: message.err });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return globalerror.handleInvalidId(req, res, next);
    } else {
      const user = await User.findByIdAndUpdate(id, { active: false });
      if (!user) {
        return globalerror.handleUserNotFound(req, res, next);
      }
      /*await User.deleteMany({ _id: user._id });
    res.status(200).json({ message: "User deleted successfully" });*/
      const message = "User deleted successfully";
      responseHandler.sendSuccessResponce(res, message, user);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: message.err });
  }
};
