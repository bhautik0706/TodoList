const mongoose = require("mongoose");
const constant = require("./../utlis/constant")
const todoSchema = mongoose.Schema(
  {
    assigningto: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    title: {
      type: String,
      
    },
    description: {
      type: String,
      min: 10,
      max: 100,
    },
    duedate: {
      type: Date,
      default: Date.now,
     
    },
    status: {
      type: String,
      enum: [constant.TASK_STATUS.TASK_STATUS_PENDING,constant.TASK_STATUS.TASK_STATUS_ONGOING,constant.TASK_STATUS.TASK_STATUS_COMPLETE]
    },
    subtasks: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Todo",
      },
    ],
    active: {
      type: Number,
      enum: [constant.ACTIVE_STATUS.ACTIVE,constant.ACTIVE_STATUS.INACTIVE],
      default: constant.ACTIVE_STATUS.ACTIVE,
      select: false,
    },
  },
  { timestamps: true }
);
todoSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;
