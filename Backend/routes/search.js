const express = require("express");
const propertyController = require("../controller/property");
const searchRouter = express.Router();

searchRouter
  .post("/", propertyController.searchProperty)
  .post("/cat", propertyController.searchByCategoryProperty)
  .post("/sto", propertyController.searchByStock);
exports.searchRouter = searchRouter;
