const fs = require("fs");
const path = require("path");
const multer = require("multer");

const imagesFolderPath = path.join(__dirname, "..", "Images");

function ensureImagesDirectory() {
  fs.mkdirSync(imagesFolderPath, { recursive: true });
  return imagesFolderPath;
}

function createDiskStorage() {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      try {
        cb(null, ensureImagesDirectory());
      } catch (error) {
        cb(error);
      }
    },
    filename: (_req, file, cb) => {
      cb(null, `${Date.now()}${path.extname(file.originalname || "")}`);
    },
  });
}

function multerErrorHandler(err, req, res, next) {
  if (!err) {
    return next();
  }

  console.log("Req Body is: ", req.body, "Req File is", req.file);
  console.error(err);

  const message =
    err instanceof multer.MulterError
      ? err.message
      : err.message || "File upload failed";

  return res.status(500).json({
    success: false,
    message,
  });
}

module.exports = {
  createDiskStorage,
  ensureImagesDirectory,
  imagesFolderPath,
  multerErrorHandler,
};
