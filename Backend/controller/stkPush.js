const { Property } = require("../model/property");
const { Tenant } = require("../model/tenant");
const { PaymentRecord } = require("../model/paymentRecord");
const { initiateSTKPush, normalizePhone } = require("../utils/daraja");
const { safeNumber } = require("../utils/rentalCalculations");

function toObjectIdString(value) {
  return value ? value.toString() : "";
}

function escapeRegex(value = "") {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function generateReceiptNumber() {
  const timestamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `RCT-${timestamp}-${randomSuffix}`;
}

function getAckResponse() {
  return {
    ResultCode: 0,
    ResultDesc: "Accepted",
  };
}

function parseCallbackMetadata(callback) {
  const items = callback?.CallbackMetadata?.Item || [];

  return items.reduce((accumulator, item) => {
    if (item?.Name) {
      accumulator[item.Name] = item.Value;
    }

    return accumulator;
  }, {});
}

function parseDarajaTimestamp(value) {
  const rawValue = String(value || "");

  if (!/^\d{14}$/.test(rawValue)) {
    return null;
  }

  const isoValue = `${rawValue.slice(0, 4)}-${rawValue.slice(4, 6)}-${rawValue.slice(
    6,
    8
  )}T${rawValue.slice(8, 10)}:${rawValue.slice(10, 12)}:${rawValue.slice(
    12,
    14
  )}+03:00`;
  const parsedDate = new Date(isoValue);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function normalizeMpesaPhone(phone, fallbackPhone = "") {
  const normalizedPhone = normalizePhone(phone || fallbackPhone || "");

  if (!/^254\d{9}$/.test(normalizedPhone)) {
    throw new Error("Enter a valid Kenyan M-Pesa phone number.");
  }

  return normalizedPhone;
}

function normalizeAmount(value) {
  const amount = Math.ceil(safeNumber(value));

  if (amount <= 0) {
    throw new Error("Payment amount must be greater than zero.");
  }

  return amount;
}

function logSTKPushError(source, error, req) {
  console.error(`${source} STK Push failed:`, {
    message: error.message,
    userId: req.user?.id,
    userEmail: req.user?.email,
    tenantId: req.body?.tenantId,
  });
}

async function resolvePropertyContext(propertyId, unitId) {
  if (!propertyId) {
    return {};
  }

  const property = await Property.findById(propertyId);

  if (!property) {
    return {};
  }

  const unit = property.units?.find(
    (item) => toObjectIdString(item?._id) === toObjectIdString(unitId)
  );

  return {
    propertyName: property.name,
    unitCode: unit?.unitCode || "",
    unitName: unit?.unitName || "",
  };
}

async function findLinkedTenantForUser(user) {
  if (!user?.email) {
    return null;
  }

  return Tenant.findOne({
    email: new RegExp(`^${escapeRegex(user.email)}$`, "i"),
    status: { $ne: "former" },
  }).sort({ createdAt: -1 });
}

async function createPendingMpesaPayment({
  tenant,
  user,
  amount,
  phone,
  periodLabel,
  initiationResponse,
  initiatedBy,
}) {
  const propertyContext = await resolvePropertyContext(
    tenant.propertyId,
    tenant.unitId
  );

  return PaymentRecord.create({
    submittedByUserId: user?.id || null,
    tenantId: tenant._id,
    tenantName: tenant.fullName,
    propertyId: tenant.propertyId,
    propertyName: propertyContext.propertyName || tenant.propertyName,
    unitId: tenant.unitId || "",
    unitCode: propertyContext.unitCode || tenant.unitCode || "",
    unitName: propertyContext.unitName || tenant.unitName || "",
    amount,
    method: "mpesa",
    status: "pending",
    receiptNumber: generateReceiptNumber(),
    periodLabel: periodLabel || "",
    phoneNumber: phone,
    checkoutRequestId: initiationResponse.CheckoutRequestID || "",
    merchantRequestId: initiationResponse.MerchantRequestID || "",
    resultCode: Number(initiationResponse.ResponseCode || 0),
    resultDescription:
      initiationResponse.ResponseDescription ||
      initiationResponse.CustomerMessage ||
      "",
    notes:
      initiatedBy === "admin"
        ? "M-Pesa STK Push initiated by admin."
        : "M-Pesa STK Push initiated by resident portal.",
  });
}

async function initiatePaymentFlow({
  tenant,
  user,
  phone,
  amount,
  periodLabel,
  initiatedBy,
}) {
  const payableAmount = normalizeAmount(amount);
  const normalizedPhone = normalizeMpesaPhone(phone, tenant?.phone);
  const initiationResponse = await initiateSTKPush({
    phone: normalizedPhone,
    amount: payableAmount,
    accountReference:
      periodLabel || tenant?.unitCode || tenant?.unitName || tenant?.fullName || "Rent",
    description: tenant?.fullName || "Rent payment",
  });

  if (String(initiationResponse?.ResponseCode || "") !== "0") {
    throw new Error(
      initiationResponse?.errorMessage ||
        initiationResponse?.ResponseDescription ||
        initiationResponse?.CustomerMessage ||
        "Safaricom did not accept the STK Push request."
    );
  }

  if (!initiationResponse?.CheckoutRequestID) {
    throw new Error(
      "Safaricom accepted the STK Push request but did not return a checkout tracking ID."
    );
  }

  const payment = await createPendingMpesaPayment({
    tenant,
    user,
    amount: payableAmount,
    phone: normalizedPhone,
    periodLabel,
    initiationResponse,
    initiatedBy,
  });

  return {
    payment,
    normalizedPhone,
    initiationResponse,
  };
}

exports.adminInitiateSTKPush = async (req, res) => {
  try {
    if (!req.body.tenantId) {
      return res.status(400).json({ message: "Tenant is required for an STK Push." });
    }

    const tenant = await Tenant.findById(req.body.tenantId);

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { payment, normalizedPhone, initiationResponse } =
      await initiatePaymentFlow({
        tenant,
        user: req.user,
        phone: req.body.phone,
        amount: req.body.amount,
        periodLabel: req.body.periodLabel,
        initiatedBy: "admin",
      });

    return res.status(201).json({
      message: `STK Push sent to ${normalizedPhone}.`,
      payment,
      checkoutRequestId: initiationResponse.CheckoutRequestID,
      merchantRequestId: initiationResponse.MerchantRequestID,
    });
  } catch (error) {
    logSTKPushError("Admin", error, req);
    return res.status(400).json({ message: error.message });
  }
};

exports.residentInitiateSTKPush = async (req, res) => {
  try {
    const tenant = await findLinkedTenantForUser(req.user);

    if (!tenant) {
      return res.status(404).json({
        message:
          "No tenant profile is linked to your account email yet. Ask an admin to add your email to the tenant record.",
      });
    }

    const { payment, normalizedPhone, initiationResponse } =
      await initiatePaymentFlow({
        tenant,
        user: req.user,
        phone: req.body.phone,
        amount: req.body.amount,
        periodLabel: req.body.periodLabel,
        initiatedBy: "resident",
      });

    return res.status(201).json({
      message: `STK Push sent to ${normalizedPhone}. Complete it on your phone.`,
      payment,
      checkoutRequestId: initiationResponse.CheckoutRequestID,
      merchantRequestId: initiationResponse.MerchantRequestID,
    });
  } catch (error) {
    logSTKPushError("Resident", error, req);
    return res.status(400).json({ message: error.message });
  }
};

exports.mpesaCallback = async (req, res) => {
  const callback =
    req.body?.Body?.stkCallback || req.body?.stkCallback || req.body || {};
  const checkoutRequestId = callback?.CheckoutRequestID;

  if (!checkoutRequestId) {
    return res.status(200).json(getAckResponse());
  }

  try {
    const payment = await PaymentRecord.findOne({
      checkoutRequestId,
    }).sort({ createdAt: -1 });

    if (!payment) {
      console.warn(
        `Received an M-Pesa callback for unknown CheckoutRequestID: ${checkoutRequestId}`
      );
      return res.status(200).json(getAckResponse());
    }

    const resultCode = Number(callback.ResultCode ?? -1);
    const resultDescription = callback.ResultDesc || "";
    const metadata = parseCallbackMetadata(callback);
    const amount = Math.ceil(safeNumber(metadata.Amount));
    const paidAt = parseDarajaTimestamp(metadata.TransactionDate);

    payment.checkoutRequestId = checkoutRequestId;
    payment.merchantRequestId =
      callback.MerchantRequestID || payment.merchantRequestId;
    payment.resultCode = Number.isFinite(resultCode)
      ? resultCode
      : payment.resultCode;
    payment.resultDescription = resultDescription || payment.resultDescription;

    if (resultCode === 0) {
      payment.status = "verified";
      payment.verifiedBy = "M-Pesa Callback";
      if (amount > 0) {
        payment.amount = amount;
      }
      if (paidAt) {
        payment.paidAt = paidAt;
      }
      if (metadata.MpesaReceiptNumber) {
        payment.mpesaReceiptNumber = String(metadata.MpesaReceiptNumber);
        payment.reference = String(metadata.MpesaReceiptNumber);
      }
      if (metadata.PhoneNumber) {
        payment.phoneNumber = String(metadata.PhoneNumber);
      }
    } else {
      payment.status = "failed";
      payment.notes = [payment.notes, resultDescription].filter(Boolean).join(" | ");
    }

    await payment.save();

    return res.status(200).json(getAckResponse());
  } catch (error) {
    console.error("Failed to process M-Pesa callback:", error.message);
    return res.status(500).json({
      ResultCode: 1,
      ResultDesc: "Callback processing failed",
    });
  }
};
