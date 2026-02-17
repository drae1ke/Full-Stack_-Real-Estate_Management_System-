const express = require("express");
const authController = require("../controller/auth");
const router = express.Router();
const multer = require("multer");
const path = require("path");

//This line is for getting the directore of the "__filename". Here the file name is "backend"
const scriptDir = path.dirname(__filename);
//This line construct the path with the "Images" folder
const imagesFolderPath = path.join(scriptDir, "..", "Images");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, "../Images");
    cb(
      null,
      //Here we used the constructed path
      imagesFolderPath
      // "C:/Users/USER/Desktop/Pharmacy/Backend/Images"
    );
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
    const fileName = Date.now() + path.extname(file.originalname);
  },
});

const upload = multer({ storage: storage });

const multerErrorHandler = (err, req, res, next) => {
  console.log("Req Body is: ", req.body, "Req File is", req.file);
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    console.error(err);
    res.status(500).send(err);
  } else if (err) {
    // An unknown error occurred when uploading.
    console.error(err);
    res.status(500).send(err);
  }
  // Everything went fine.
  next();
};

exports.upload = upload;
router
  .post(
    "/signup",
    upload.single("image"),
    multerErrorHandler,
    authController.createUser
  )
  .post("/login", authController.login);
exports.router = router;
