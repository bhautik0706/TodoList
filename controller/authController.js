const passport = require("passport");
const { default: mongoose } = require("mongoose");
const { validate } = require("./../model/userModel");
const User = require("./../model/userModel");
const userValidation = require("../validation/userValidation");
const validateuser = require("express-validator");
const { query } = require("express-validator");
const globalerror = require("./../utlis/errorHandler");
exports.signUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    //console.log(schema.validate(req.body));
    const user = req.validateData;
    if (await User.findOne({ email: req.body.email })) {
      res.status(409).json({ message: "This email alredy Exist!" });
      return;
    } else {
      const user = await User.create({ name, email, password });
      res.status(201).json({
        status: "success",
        data: {
          user,
        },
      });
    }
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
      return res.status(200).json({ message: "Logged in successfully." });
    });
  })(req, res, next);
};

exports.logOut = (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.status(200).json({ message: "Logged out successfully." });
  })
 
};

exports.isAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()){
    next();
  }
  else{
    return res.status(401).json({ message: "Please Logged in"});
  }
}
