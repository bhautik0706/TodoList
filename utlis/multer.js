const multer = require("multer");
const path = require("path");
const constant = require("./../utlis/constant");

const storege = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/");
  },
  filename: (req, file, cb) => {
    const extension = constant.MIME_TYPES[file.mimetype];
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

module.exports = multer({
  storage: storege,
  
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const extension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      const error = {
        error: true,
        message: 'Only jpg, jpeg, and png files are allowed',
      };
      return cb(JSON.stringify(error), false);
    }
    cb(null, true);
  },
});
