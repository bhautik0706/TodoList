const passport = require("passport");
const bcrypt = require("bcryptjs");
const { default: mongoose } = require("mongoose");
const { validate } = require("./../model/userModel");
const User = require("./../model/userModel");
const Photo = require("./../model/photoModel");
const userValidation = require("../validation/userValidation");
const validateuser = require("express-validator");
const { query } = require("express-validator");
const globalerror = require("./../utlis/errorHandler");
const responseHandler = require("./../utlis/responseHandler");
const { message } = require("../validation/userValidation");
exports.signUp = async (req, res, done) => {
  const { name, email, password } = req.body;
  const url = req.protocol + "://" + req.get("host");
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    if (await User.findOne({ email: req.body.email })) {
      res
        .status(409)
        .json({ error: true, message: "This email alredy Exist!" });
      return;
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ error: true, message: "Photo is required" });
    }
    const { originalname, path, mimetype, size } = req.file;
    const photo = new Photo({
      name: originalname,
      path: path,
      extension: mimetype.split("/")[1],
      size: size,
    });
    await photo.save();
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      photo: photo._id,
    });
    await newUser.save();
    req.logIn(newUser, function (err) {
      const message = "Your account has been successfully created";
      if (err) {
        return done(err);
      }
      return responseHandler.sendSuccessResponce(res, message, newUser);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const message = "Logged in Successfully";
      return responseHandler.sendSuccessResponce(res, message, user);
    });
  })(req, res, next);
};

exports.logOut = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    const message = "You have been successfully logged out";
    //res.status(200).json({ message: "Logged out successfully." });
    responseHandler.sendSuccessResponce(res, message);
  });
};

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    //return res.status(401).json({ message: "Please Logged in" });
    const message = "Please Logged In";
    responseHandler.sendUnauthorized(res, message);
  }
};
