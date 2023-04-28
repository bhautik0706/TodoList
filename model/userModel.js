const mongoose = require("mongoose");
const Joi = require("joi");
const constant = require("./../utlis/constant");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      /*validate: {
        validator: function (name) {
          return /^[A-Za-z\s]+$/.test(name);
        },
        message: "Please enter only alphabetical letters.",
      },
      required: [true, "Please enter your name"],*/
    },
    email: {
      type: String,
      /*validate: {
        validator: function (email) {
          return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email);
        },
        message: "Please enter valid email address",
      },
      required: [true, "Please enter your email"],*/
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      /*validate: {
        validator: function (password) {
          return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/.test(
            password
          );
        },
        message: "Please enter valid password",
      },
      required: [true, "Please enter your password"],*/
      minLength: 8,
    },
    
    active: {
      type: Number,
      enum: [constant.ACTIVE_STATUS.ACTIVE, constant.ACTIVE_STATUS.INACTIVE],
      default: constant.ACTIVE_STATUS.ACTIVE,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
