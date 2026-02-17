const mongoose = require("mongoose");
const { Schema } = mongoose;

const buySchema = new Schema({
  medId: String,
  name: String,
  isRated: Boolean,
  rating: Number,
  commentId: [String],
  date: Date,
});

const orderSchema = new Schema({
  orderId: String,
});

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  totalItemBuy: Number,
  image: String,
  password: { type: String, required: true },
  token: String,
  buyHistory: [buySchema],
  orders: [orderSchema],
});

exports.User = mongoose.model("User", userSchema);
