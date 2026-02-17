const mongoose = require("mongoose");
const { Schema } = mongoose;
const visitSchema = new Schema({
  userId: String,
  productId: String,
  user: String,
  product: String,
  isVisited: Boolean,
  date: String,
});
exports.Visit = mongoose.model("Visit", visitSchema);
