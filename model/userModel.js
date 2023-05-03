const mongoose = require("mongoose");
const Joi = require("joi");
const constant = require("./../utlis/constant");
const Photo = require("./../model/photoModel");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    photo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Photo",
    },
    password: {
      type: String,
      minLength: 8,
    },
    confirmpassword: {
      type: String,
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
