const express = require("express");
const categoryController = require("../controller/category");
const categoryRouter = express.Router();
categoryRouter
  .post("/", categoryController.createCategory)
  .get("/", categoryController.getCategory)
  .get("/:id", categoryController.getOneCategory)
  .patch("/:id", categoryController.updateCategory)
  .delete("/:id", categoryController.deleteCategory);

exports.categoryRouter = categoryRouter;
