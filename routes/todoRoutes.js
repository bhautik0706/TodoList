const express = require("express");
const todoController = require("./../controller/todoController");
const globleError = require("./../utlis/errorHandler");
const { isAuthenticated } = require("./../controller/authController");
const router = express.Router();

router
  .route("/")
  .post(
    globleError.handleTodoValidation,isAuthenticated,
    todoController.createTodo
  )
  .get(isAuthenticated, todoController.getAll);

router.get(
  "/completed-tasks",
  isAuthenticated,
  todoController.getCompletedTasks
);

router
  .route("/:id")
  .get(isAuthenticated, todoController.getTodo)
  .delete(isAuthenticated, todoController.deleteTodo)
  .patch(
    globleError.handleTodoUpdateValidation,
    isAuthenticated,
    todoController.updatedTodo
  );
router.route("/:id/subtasks").patch(isAuthenticated,todoController.addSubTasks);
router.route("/user-tasks/:id").get(isAuthenticated, todoController.userTasks);

module.exports = router;
