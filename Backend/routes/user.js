const express = require("express");
const userController = require("../controller/user");
const router = express.Router();
router
  .get("/", userController.getAllUser)
  .get("/:id", userController.GetOneUser)
  .put("/:id", userController.replaceUser)
  // .patch("/:id", userController.updateUser)
  .delete("/:id", userController.deleteUser)
  .patch("/getUser", userController.GetOneUserByToken);
exports.router = router;
