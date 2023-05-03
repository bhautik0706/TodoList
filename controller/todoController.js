const { default: mongoose } = require("mongoose");
const User = require("../model/userModel");
const { populate } = require("./../model/todoModel");
const Todo = require("./../model/todoModel");
const todoValidation = require("../validation/todoValidation");
const validatTodo = require("express-validator");
const globalerror = require("./../utlis/errorHandler");
const constant = require("./../utlis/constant");
const responceHandler = require("./../utlis/responseHandler");
const { message } = require("../validation/todoValidation");
const { isAuthenticated } = require("./../controller/authController");
exports.createTodo = async (req, res) => {
  try {
    //const todo =  req.validateData;
    const newTodo = new Todo({
      assigningto: req.body.assigningto,
      title: req.body.title,
      priority: req.body.priority,
      description: req.body.description,
      duedate: req.body.duedate,
      status: req.body.status,
      //subtasks: [],
    });
    //console.log(newTodo);
    //const saveTodo = await newTodo.save();
    const subtasks = req.body.subtasks.map(
      (subtask) =>
        new Todo({
          ...subtask,
          subtasks: [],
        })
    );
    newTodo.subtasks = subtasks.map((subtask) => subtask._id);
    const savedTodo = await newTodo.save();

    for (let i = 0; i < subtasks.length; i++) {
      const subtask = subtasks[i];
      subtask.parentTask = savedTodo._id;
      await subtask.save();
    }
    //res.status(201).json(savedTodo);
    const message = "Success! Your todo has been Saved";
    return responceHandler.sendSuccessResponce(res, message, savedTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const {
      assigningto,
      title,
      description,
      duedate,
      status,
      page = 1,
      limit = 10,
    } = req.query;
    const queryObj = {};
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";
    if (assigningto) {
      queryObj.assigningto = assigningto;
    }
    if (title) {
      queryObj.title = title;
    }
    if (description) {
      queryObj.description = description;
    }
    if (duedate) {
      queryObj.duedate = duedate;
    }
    if (status) {
      queryObj.status = status;
    }
    const todoQuery = Todo.find(queryObj);
    if (todoQuery.length === 1) {
      res.status(200).json(todoQuery);
    } else {
      const todo = await Todo.find({ active: true })
        .sort({ [sortBy]: sortOrder })
        .populate("assigningto")
        .populate("subtasks")
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const count = await User.countDocuments();
      if (todo.length === 0) {
        return globalerror.handleTodoNotFound(req, res, next);
      } else {
        const totalPages = Math.ceil(count / limit);
        const currentPage = page;
        const result = todo.length;
        return responceHandler.sendSuccessResponce(
          res,
          message,
          todo,
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

exports.getTodo = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return globalerror.handleInvalidId(req, res, next);
    } else {
      const todo = await Todo.findById(id)
        .populate("assigningto")
        .populate("subtasks");
      if (!todo) {
        return globalerror.handleTodoNotFound(req, res, next);
      }
      responceHandler.sendSuccessResponce(res, message, todo);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return globalerror.handleInvalidId(req, res, next);
    } else {
      const todo = await Todo.findById(id);
      if (!todo) {
        return globalerror.handleTodoNotFound(req, res, next);
      }
      for (const subtaskId of todo.subtasks) {
        await Todo.findByIdAndUpdate(subtaskId, { active: false });
      }
      const todoTasks = await Todo.findByIdAndUpdate(req.params.id, {
        active: false,
      });
      const message = "Task and subtask deleted successfully";
      responceHandler.sendSuccessResponce(res, message, todoTasks);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatedTodo = async (req, res, next) => {
  try {
    const todo1 = req.validateData;
    const id = req.params.id;
    const todo = await Todo.findById(req.params.id);
    let status = todo.status;

    if ("status" in req.body) {
      const subtasks = await Todo.find({ _id: { $in: todo.subtasks } });
      const allSubtasksComplete = subtasks.every(
        (subtask) =>
          subtask.status === constant.TASK_STATUS.TASK_STATUS_COMPLETE
      );
      if (allSubtasksComplete) {
        status = constant.TASK_STATUS.TASK_STATUS_COMPLETE;
      } else {
        status = constant.TASK_STATUS.TASK_STATUS_PENDING;
        return res
          .status(200)
          .json({ error: true, message: "Subtasks are not completed" });
      }
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return globalerror.handleInvalidId(req, res, next);
    } else {
      const updateTask = await Todo.findByIdAndUpdate(
        id,
        { ...req.body, status },
        {
          new: true,
        }
      )
        .populate("assigningto")
        .populate("subtasks");
      if (!updateTask) {
        return globalerror.handleTodoNotFound(req, res, next);
      } else {
        const message = "Todo updated successfully";
        responceHandler.sendSuccessResponce(res, message, updateTask);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: message.err });
  }
};

exports.userTasks = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return globalerror.handleInvalidId(req, res, next);
    } else {
      const tasks = await Todo.find({ assigningto: userId, active: 1 })
        .populate("assigningto")
        .populate("subtasks");
      if (tasks.length === 0) {
        res
          .status(404)
          .json({ error: true, message: "This user any task not found" });
      } else {
        //res.json(tasks);
        responceHandler.sendSuccessResponce(res, message, tasks);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: message.err });
  }
};

exports.getCompletedTasks = async (req, res) => {
  try {
    const tasks = await Todo.find({ status: "complete" });
    if (tasks.length === 0) {
      res
        .status(404)
        .json({ error: true, message: "Completed task not found" });
    } else {
      responceHandler.sendSuccessResponce(res, message, tasks);
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.addSubTasks = async (req, res, next) => {
  const { id } = req.params;
  try {
    const parentTask = await Todo.findById(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return globalerror.handleInvalidId(req, res, next);
    }
    if (!parentTask) {
      return globalerror.handleTodoNotFound(req, res, next);
    }
    const subtasks = req.body.subtasks.map(
      (subtask) =>
        new Todo({
          ...subtask,
          subtasks: [],
        })
    );
    const savedSubtasks = await Promise.all(
      subtasks.map((subtask) => subtask.save())
    );
    parentTask.subtasks.push(...savedSubtasks.map((subtask) => subtask._id));
    await parentTask.save();
    const message = "Subtasks added successfully";
    responceHandler.sendSuccessResponce(res, message, parentTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
