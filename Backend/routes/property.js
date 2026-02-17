const express = require("express");
const propertyController = require("../controller/property");
const propertyRouter = express.Router();
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
