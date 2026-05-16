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

const buildingSchema = new Schema(
  {
    id: String,
    name: String,
    floors: Number,
    notes: String,
  },
  { _id: false }
);

const unitSchema = new Schema({
  id: String,
  buildingId: String,
  buildingName: String,
  unitCode: String,
  unitName: String,
  floorLabel: String,
  bedrooms: Number,
  bathrooms: Number,
  sizeSqm: Number,
  rent: Number,
  deposit: Number,
  status: {
    type: String,
    enum: ["vacant", "reserved", "occupied", "maintenance"],
    default: "vacant",
  },
  previewFeatures: [String],
  assignedTenantId: String,
  assignedTenantName: String,
  currentBookingId: String,
  currentBookingName: String,
});

const propertySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    propertyCode: String,
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
    city: String,
    estate: String,
    managerName: String,
    contactPhone: String,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    bookingEnabled: {
      type: Boolean,
      default: true,
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "quarterly"],
      default: "monthly",
    },
    amenities: [String],
    buildings: [buildingSchema],
    units: [unitSchema],
    image: { type: String, required: true },
    comments: [commentSchema],
    visit: [visitSchema],
  },
  { timestamps: true }
);

exports.Property = mongoose.model("Property", propertySchema);
