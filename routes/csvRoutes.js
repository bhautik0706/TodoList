const express = require("express");
const router = express.Router();
const csvController = require("./../controller/csvController");
const multer = require("./../utlis/multer");
router.route("/").post(multer.single("csvfile"), csvController.uploadCsv);

module.exports = router;
