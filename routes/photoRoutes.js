const express = require("express");
const router = express.Router();
const photoController = require("./../controller/photoController");
const globleError = require("./../utlis/errorHandler");
const multer = require("./../utlis/multer");
const { isAuthenticated } = require("./../controller/authController");

//const upload = multer({ dest: "upload/" })
router.route("/").post(multer.single("image"),globleError.handlePhotoValidation,isAuthenticated,photoController.addPhoto)
.get(isAuthenticated,photoController.getAll);
router.route("/:id").patch(multer.single("image"),isAuthenticated,globleError.handlePhotoValidation,photoController.updatePhoto)
.delete(multer.single("image"),isAuthenticated,photoController.deletPhoto);
module.exports = router;