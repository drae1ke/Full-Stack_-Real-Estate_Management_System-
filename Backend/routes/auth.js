const express = require("express");
const authController = require("../controller/auth");
const router = express.Router();
const multer = require("multer");
const {
  createDiskStorage,
  multerErrorHandler,
} = require("../utils/upload");

const upload = multer({ storage: createDiskStorage() });

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
