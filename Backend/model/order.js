const mongoose = require("mongoose");
const { Schema } = mongoose;

const propertySchema = new Schema({
  id: String,
  inTotal: Number,
  name: String,
});

const orderSchema = new Schema({
  userId: String,
  date: { type: Date },
  status: Boolean,
  address: String,
  totalItem: Number,
  property: [propertySchema],
  sellMoney: Number,
  image: String,
});
exports.Order = mongoose.model("Order", orderSchema);

//{ type: Date }
