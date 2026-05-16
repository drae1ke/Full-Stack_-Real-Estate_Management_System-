const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    propertyName: String,
    unitId: String,
    unitCode: String,
    unitName: String,
    applicantName: { type: String, required: true },
    email: String,
    phone: String,
    preferredMoveIn: Date,
    durationMonths: {
      type: Number,
      default: 1,
      min: 1,
    },
    message: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "checked_in"],
      default: "pending",
    },
    adminNote: String,
  },
  { timestamps: true }
);

exports.Booking = mongoose.model("Booking", bookingSchema);
