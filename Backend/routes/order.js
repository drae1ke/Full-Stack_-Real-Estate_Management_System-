const express = require("express");
const orderController = require("../controller/order");
const orderRouter = express.Router();
orderRouter
  .get("/", orderController.getAllOrder)
  .post("/", orderController.createOrder)
  .post("/getOrder", orderController.getOrder)
  .patch("/:id", orderController.update);

exports.orderRouter = orderRouter;
