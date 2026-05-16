const mongoose = require("mongoose");
const { Schema } = mongoose;

const tenantSchema = new Schema(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    propertyName: String,
    unitId: String,
    unitCode: String,
    unitName: String,
    fullName: { type: String, required: true },
    email: String,
    phone: String,
    nationalId: String,
    leaseStart: Date,
    leaseEnd: Date,
    emergencyContactName: String,
    emergencyContactPhone: String,
    paymentStatus: {
      type: String,
      enum: ["paid", "partial", "arrears", "upcoming"],
      default: "upcoming",
    },
    monthlyRent: {
      type: Number,
      default: 0,
      min: 0,
    },
    depositAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    outstandingBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "notice", "former"],
      default: "active",
    },
    notes: String,
  },
  { timestamps: true }
);

exports.Tenant = mongoose.model("Tenant", tenantSchema);
