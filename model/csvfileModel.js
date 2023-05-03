const mongoose = require("mongoose");
const constant = require("./../utlis/constant");
const csvSchema = new mongoose.Schema(
  {
    srno: {
      type: Number,
    },
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
      type: String,
    },
    status: {
      type: String,
      enum: [
        constant.TASK_STATUS.TASK_STATUS_PENDING,
        constant.TASK_STATUS.TASK_STATUS_ONGOING,
        constant.TASK_STATUS.TASK_STATUS_COMPLETE,
      ],
    },
    subtasks: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Csv",
      },
    ],
    parenttask: {
      type: mongoose.Schema.ObjectId,
      ref: "Csv",
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

const Csv = mongoose.model("Csv", csvSchema);
module.exports = Csv;
