const express = require("express");
const userController = require("./../controller/userController");
const globleError = require("./../utlis/errorHandler");
const router = express.Router();
//const userValidator = require("../validation/userValidation");
//const { validate } = require("express-validator");

router.route("/").post(globleError.validationError,userController.createUser).get(userController.getAll);
router.route("/:id").patch(globleError.handleUserUpdateValidation,userController.updateUser).delete(userController.deleteUser);


module.exports = router;
