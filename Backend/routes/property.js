const express = require("express");
const propertyController = require("../controller/property");
const propertyRouter = express.Router();
const multer = require("multer");
const {
  createDiskStorage,
  multerErrorHandler,
} = require("../utils/upload");

const upload = multer({ storage: createDiskStorage() });

exports.upload = upload;

propertyRouter
  .post(
    "/",
    upload.single("image"),
    multerErrorHandler,
    propertyController.createProperty
  )
  .get("/", propertyController.getAllProperty)
  .get("/:id", propertyController.GetOneProperty)

  .put(
    "/:id",
    upload.single("image"),
    multerErrorHandler,
    propertyController.replaceProperty
  )
  .patch(
    "/:id",
    upload.single("image"),
    multerErrorHandler,
    propertyController.updateProperty
  )
  .patch("/star/:id", propertyController.updateStar)
  .delete("/:id", propertyController.deleteProperty);

exports.propertyRouter = propertyRouter;
