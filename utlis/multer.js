const multer = require("multer");
const path = require("path");

module.exports = multer({
  storage: multer.diskStorage({
    destination: (req, res, cb) => {
      cb(null, "./../upload");
    },
    fileFilter: (req, file, cb) => {
      let ext = path.extname(file.originalname);
      if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
        cb(new Error("Unspported file type!"), false);
        return;
      }
      cb(null, true);
    },
  }),
});
