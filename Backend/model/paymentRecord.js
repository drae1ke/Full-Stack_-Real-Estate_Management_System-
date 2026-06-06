const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentRecordSchema = new Schema(
  {
    submittedByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    tenantName: String,
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    propertyName: String,
    unitId: String,
    unitCode: String,
    unitName: String,
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    method: {
      type: String,
      enum: ["mpesa", "bank_transfer", "card", "cash"],
      default: "mpesa",
    },
    status: {
      type: String,
      enum: ["pending", "verified", "partial", "arrears", "failed"],
      default: "pending",
    },
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
    },
    periodLabel: String,
    paidAt: Date,
    reference: String,
    verifiedBy: String,
    notes: String,
    phoneNumber: String,
    mpesaReceiptNumber: String,
    checkoutRequestId: String,
    merchantRequestId: String,
    resultCode: Number,
    resultDescription: String,
  },
  { timestamps: true }
);

exports.PaymentRecord = mongoose.model("PaymentRecord", paymentRecordSchema);
