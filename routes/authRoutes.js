const express = require("express");
const router = express.Router();
const { login, logOut, signUp } = require("./../controller/authController");
const authController = require("./../controller/todoController");
const globleError = require("./../utlis/errorHandler");
const { isAuthenticated } = require("./../controller/authController");
const upload = require("./../utlis/multer.js");

router.post("/login",globleError.loginUserValidation,login);
router.get("/logout", logOut);
router.post("/signUp", upload.single("photo"),globleError.validationError,signUp);
module.exports = router;
