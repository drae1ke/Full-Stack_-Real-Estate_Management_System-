const mongoose = require("mongoose");
const { Schema } = mongoose;

const complaintSchema = new Schema(
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
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      default: null,
    },
    tenantName: { type: String, required: true },
    phone: String,
    email: String,
    category: {
      type: String,
      enum: ["maintenance", "billing", "security", "noise", "other"],
      default: "maintenance",
    },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["submitted", "in_progress", "resolved", "closed"],
      default: "submitted",
    },
    assignedTo: String,
    response: String,
  },
  { timestamps: true }
);

exports.Complaint = mongoose.model("Complaint", complaintSchema);
