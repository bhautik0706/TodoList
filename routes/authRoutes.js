const express = require("express");
const router = express.Router();
const { login, logOut, signUp } = require("./../controller/authController");
const authController = require("./../controller/todoController");
const globleError = require("./../utlis/errorHandler");
const { isAuthenticated } = require("./../controller/authController");

router.post("/login", login);
router.get("/logout", logOut);
router.post("/signUp", globleError.validationError,signUp);
module.exports = router;
