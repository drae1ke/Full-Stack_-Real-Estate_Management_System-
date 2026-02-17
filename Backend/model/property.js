const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
  text: String,
  authorId: Number,
  author: String,
  // date: Date,
});

const visitSchema = new Schema({
  userId: String,
  isVisited: Boolean,
  date: Date,
});

const propertySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  price: {
    type: Number,
    required: true,
    min: [0, "wrong Price"],
  },
  category: { type: String, required: true },
  discountPercentage: {
    type: Number,
    min: [0, "wrong min discount"],
    max: [100, "wrong max discount"],
  },
  rating: {
    type: Number,
    min: [0, "wrong min ratting"],
    max: [10, "wrong max ratting"],
  },
  totalRating: Number,
  address: { type: String, required: true },
  image: { type: String, required: true },
  comments: [commentSchema],
  visit: [visitSchema],
});

exports.Property = mongoose.model("Property", propertySchema);
