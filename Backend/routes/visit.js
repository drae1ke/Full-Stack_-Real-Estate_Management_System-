const express = require("express");
const visitController = require("../controller/visit");
const visitRouter = express.Router();
visitRouter
  .post("/", visitController.createVisit)
  .post("/get", visitController.getForOneProperty)
  .get("/", visitController.getVisits)
  .patch("/:id", visitController.confirmation)
  .delete("/:id", visitController.delete);

exports.visitRouter = visitRouter;
