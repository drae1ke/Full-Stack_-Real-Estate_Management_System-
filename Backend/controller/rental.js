const { Property } = require("../model/property");
const { Tenant } = require("../model/tenant");
const { Booking } = require("../model/booking");
const { PaymentRecord } = require("../model/paymentRecord");
const { Complaint } = require("../model/complaint");
const {
  safeNumber,
  calculateTenantFinancials,
  buildMonthlyRevenueSeries,
} = require("../utils/rentalCalculations");

function toObjectIdString(value) {
  return value ? value.toString() : "";
}

function escapeRegex(value = "") {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
    property,
    propertyName: property.name,
    unit,
    unitCode: unit?.unitCode || "",
    unitName: unit?.unitName || "",
  };
}

async function syncTenantAssignment({
  previousPropertyId,
  previousUnitId,
  tenant,
}) {
  if (
    previousPropertyId &&
    previousUnitId &&
    (toObjectIdString(previousPropertyId) !== toObjectIdString(tenant.propertyId) ||
      toObjectIdString(previousUnitId) !== toObjectIdString(tenant.unitId))
  ) {
    const previousProperty = await Property.findById(previousPropertyId);

    if (previousProperty) {
      const previousUnit = previousProperty.units?.id(previousUnitId);

      if (previousUnit) {
        previousUnit.assignedTenantId = "";
        previousUnit.assignedTenantName = "";
        previousUnit.status = previousUnit.currentBookingId ? "reserved" : "vacant";
        await previousProperty.save();
      }
    }
  }

  if (!tenant.propertyId || !tenant.unitId) {
    return;
  }

  const property = await Property.findById(tenant.propertyId);

  if (!property) {
    return;
  }

  const unit = property.units?.id(tenant.unitId);

  if (!unit) {
    return;
  }

  unit.assignedTenantId = tenant._id.toString();
  unit.assignedTenantName = tenant.fullName;
  unit.status = "occupied";
  await property.save();
}

async function ensureUnitCanBeAssigned({
  propertyId,
  unitId,
  tenantId,
}) {
  if (!propertyId || !unitId) {
    return;
  }

  const property = await Property.findById(propertyId);

  if (!property) {
    throw new Error("Property not found");
  }

  const unit = property.units?.id(unitId);

  if (!unit) {
    throw new Error("Unit not found");
  }

  const existingTenant = await Tenant.findOne({
    propertyId,
    unitId,
    status: { $ne: "former" },
    ...(tenantId ? { _id: { $ne: tenantId } } : {}),
  }).sort({ createdAt: -1 });

  if (existingTenant) {
    const unitLabel = unit.unitCode || unit.unitName || "This unit";
    throw new Error(`${unitLabel} is already assigned to ${existingTenant.fullName}`);
  }

  if (
    unit.assignedTenantId &&
    toObjectIdString(unit.assignedTenantId) !== toObjectIdString(tenantId)
  ) {
    const unitLabel = unit.unitCode || unit.unitName || "This unit";
    throw new Error(
      `${unitLabel} is already marked as occupied. Remove the current tenant first or edit that tenant record.`
    );
  }
}

async function syncBookingStatus(booking) {
  if (!booking?.propertyId || !booking?.unitId) {
    return;
  }

  const property = await Property.findById(booking.propertyId);

  if (!property) {
    return;
  }

  const unit = property.units?.id(booking.unitId);

  if (!unit) {
    return;
  }

  if (booking.status === "approved") {
    unit.currentBookingId = booking._id.toString();
    unit.currentBookingName = booking.applicantName;
    if (!unit.assignedTenantId) {
      unit.status = "reserved";
    }
  }

  if (booking.status === "rejected") {
    if (unit.currentBookingId === booking._id.toString()) {
      unit.currentBookingId = "";
      unit.currentBookingName = "";
      if (!unit.assignedTenantId) {
        unit.status = "vacant";
      }
    }
  }

  if (booking.status === "checked_in") {
    unit.currentBookingId = booking._id.toString();
    unit.currentBookingName = booking.applicantName;
    unit.status = "occupied";
  }

  await property.save();
}

function hydrateTenants(tenants = [], payments = []) {
  return tenants.map((tenant) => ({
    ...tenant.toObject(),
    ...calculateTenantFinancials(tenant, payments),
  }));
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

async function buildResidentPortal(user) {
  const tenant = await findLinkedTenantForUser(user);
  const payments = tenant
    ? await PaymentRecord.find({ tenantId: tenant._id }).sort({ createdAt: -1 })
    : [];
  const bookings = await Booking.find({
    $or: [{ userId: user.id }, { email: user.email }],
  }).sort({ createdAt: -1 });
  const complaintFilters = [{ userId: user.id }, { email: user.email }];

  if (tenant?._id) {
    complaintFilters.push({ tenantId: tenant._id });
  }

  const complaints = await Complaint.find({
    $or: complaintFilters,
  }).sort({ createdAt: -1 });

  return {
    tenant: tenant
      ? {
          ...tenant.toObject(),
          ...calculateTenantFinancials(tenant, payments),
        }
      : null,
    payments,
    bookings,
    complaints,
  };
}

exports.getResidentPortal = async (req, res) => {
  try {
    const portal = await buildResidentPortal(req.user);

    return res.json({
      profile: req.user,
      ...portal,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getOverview = async (_req, res) => {
  try {
    const [properties, tenants, bookings, payments, complaints] = await Promise.all([
      Property.find().sort({ createdAt: -1 }),
      Tenant.find().sort({ createdAt: -1 }),
      Booking.find().sort({ createdAt: -1 }),
      PaymentRecord.find().sort({ createdAt: -1 }),
      Complaint.find().sort({ createdAt: -1 }),
    ]);

    const enrichedTenants = hydrateTenants(tenants, payments);
    const units = properties.flatMap((property) => property.units || []);
    const occupiedRooms = units.filter((unit) => unit.status === "occupied").length;
    const vacantRooms = units.filter((unit) => unit.status === "vacant").length;
    const reservedRooms = units.filter((unit) => unit.status === "reserved").length;
    const maintenanceRooms = units.filter(
      (unit) => unit.status === "maintenance"
    ).length;
    const monthlyRevenue = buildMonthlyRevenueSeries(payments, 6);
    const collectedRevenue = payments
      .filter((payment) => ["verified", "partial"].includes(payment.status))
      .reduce((sum, payment) => sum + safeNumber(payment.amount), 0);
    const pendingRevenue = payments
      .filter((payment) => payment.status === "pending")
      .reduce((sum, payment) => sum + safeNumber(payment.amount), 0);
    const arrearsOutstanding = enrichedTenants.reduce(
      (sum, tenant) => sum + safeNumber(tenant.outstandingBalance),
      0
    );

    const propertyPerformance = properties.map((property) => {
      const propertyUnits = property.units || [];
      const propertyTenants = enrichedTenants.filter(
        (tenant) => toObjectIdString(tenant.propertyId) === property._id.toString()
      );
      const propertyPayments = payments.filter(
        (payment) => toObjectIdString(payment.propertyId) === property._id.toString()
      );
      const propertyComplaints = complaints.filter(
        (complaint) => toObjectIdString(complaint.propertyId) === property._id.toString()
      );

      return {
        id: property._id,
        name: property.name,
        category: property.category,
        totalUnits: propertyUnits.length,
        occupied: propertyUnits.filter((unit) => unit.status === "occupied").length,
        vacant: propertyUnits.filter((unit) => unit.status === "vacant").length,
        reserved: propertyUnits.filter((unit) => unit.status === "reserved").length,
        maintenance: propertyUnits.filter(
          (unit) => unit.status === "maintenance"
        ).length,
        revenue: propertyPayments
          .filter((payment) => ["verified", "partial"].includes(payment.status))
          .reduce((sum, payment) => sum + safeNumber(payment.amount), 0),
        arrears: propertyTenants.reduce(
          (sum, tenant) => sum + safeNumber(tenant.outstandingBalance),
          0
        ),
        openComplaints: propertyComplaints.filter(
          (complaint) => complaint.status !== "resolved" && complaint.status !== "closed"
        ).length,
      };
    });

    res.json({
      kpis: {
        properties: properties.length,
        totalUnits: units.length,
        occupiedRooms,
        vacantRooms,
        reservedRooms,
        maintenanceRooms,
        occupancyRate: units.length
          ? Number(((occupiedRooms / units.length) * 100).toFixed(1))
          : 0,
        tenants: tenants.length,
        pendingBookings: bookings.filter((booking) => booking.status === "pending")
          .length,
        openComplaints: complaints.filter(
          (complaint) =>
            complaint.status !== "resolved" && complaint.status !== "closed"
        ).length,
      },
      paymentSummary: {
        collectedRevenue,
        pendingRevenue,
        arrearsOutstanding,
      },
      monthlyRevenue,
      propertyPerformance,
      arrearsTenants: enrichedTenants
        .filter((tenant) => tenant.outstandingBalance > 0)
        .sort((left, right) => right.outstandingBalance - left.outstandingBalance)
        .slice(0, 8),
      recentTransactions: payments.slice(0, 8),
      complaintOverview: {
        submitted: complaints.filter((complaint) => complaint.status === "submitted")
          .length,
        inProgress: complaints.filter(
          (complaint) => complaint.status === "in_progress"
        ).length,
        resolved: complaints.filter((complaint) => complaint.status === "resolved")
          .length,
      },
      recentBookings: bookings.slice(0, 8),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTenants = async (req, res) => {
  try {
    const { search = "", status = "", paymentStatus = "", propertyId = "" } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (propertyId) {
      query.propertyId = propertyId;
    }

    if (search) {
      query.$or = [
        { fullName: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
        { nationalId: new RegExp(search, "i") },
        { unitCode: new RegExp(search, "i") },
      ];
    }

    const [tenants, payments] = await Promise.all([
      Tenant.find(query).sort({ createdAt: -1 }),
      PaymentRecord.find().sort({ createdAt: -1 }),
    ]);

    const enrichedTenants = hydrateTenants(tenants, payments).filter((tenant) =>
      paymentStatus ? tenant.paymentStatus === paymentStatus : true
    );

    res.json(enrichedTenants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTenant = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      monthlyRent: safeNumber(req.body.monthlyRent),
      depositAmount: safeNumber(req.body.depositAmount),
    };
    await ensureUnitCanBeAssigned({
      propertyId: payload.propertyId,
      unitId: payload.unitId,
    });
    const propertyContext = await resolvePropertyContext(
      payload.propertyId,
      payload.unitId
    );

    const tenant = await Tenant.create({
      ...payload,
      propertyName: propertyContext.propertyName || payload.propertyName,
      unitCode: propertyContext.unitCode || payload.unitCode,
      unitName: propertyContext.unitName || payload.unitName,
    });

    await syncTenantAssignment({ tenant });

    res.status(201).json(tenant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const previousPropertyId = tenant.propertyId;
    const previousUnitId = tenant.unitId;
    await ensureUnitCanBeAssigned({
      propertyId: req.body.propertyId || tenant.propertyId,
      unitId: req.body.unitId || tenant.unitId,
      tenantId: tenant._id,
    });
    const propertyContext = await resolvePropertyContext(
      req.body.propertyId || tenant.propertyId,
      req.body.unitId || tenant.unitId
    );

    Object.assign(tenant, {
      ...req.body,
      monthlyRent:
        req.body.monthlyRent === undefined
          ? tenant.monthlyRent
          : safeNumber(req.body.monthlyRent),
      depositAmount:
        req.body.depositAmount === undefined
          ? tenant.depositAmount
          : safeNumber(req.body.depositAmount),
      propertyName:
        propertyContext.propertyName ||
        req.body.propertyName ||
        tenant.propertyName,
      unitCode: propertyContext.unitCode || req.body.unitCode || tenant.unitCode,
      unitName: propertyContext.unitName || req.body.unitName || tenant.unitName,
    });

    await tenant.save();
    await syncTenantAssignment({ previousPropertyId, previousUnitId, tenant });

    res.json(tenant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndDelete(req.params.id);

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    await syncTenantAssignment({
      previousPropertyId: tenant.propertyId,
      previousUnitId: tenant.unitId,
      tenant: { propertyId: null, unitId: null, _id: tenant._id, fullName: tenant.fullName },
    });

    res.json({ message: "Tenant deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const query = {};

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.propertyId) {
      query.propertyId = req.query.propertyId;
    }

    res.json(await Booking.find(query).sort({ createdAt: -1 }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      durationMonths: safeNumber(req.body.durationMonths) || 1,
    };
    const propertyContext = await resolvePropertyContext(
      payload.propertyId,
      payload.unitId
    );

    if (!propertyContext.property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (propertyContext.property.bookingEnabled === false) {
      return res.status(400).json({ message: "Booking is disabled for this property" });
    }

    if (
      propertyContext.unit &&
      ["occupied", "maintenance"].includes(propertyContext.unit.status)
    ) {
      return res.status(400).json({ message: "This unit is not open for booking" });
    }

    const booking = await Booking.create({
      ...payload,
      userId: req.user.id,
      applicantName: req.user.name || payload.applicantName,
      email: req.user.email,
      propertyName: propertyContext.propertyName || payload.propertyName,
      unitCode: propertyContext.unitCode || payload.unitCode,
      unitName: propertyContext.unitName || payload.unitName,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const propertyContext = await resolvePropertyContext(
      req.body.propertyId || booking.propertyId,
      req.body.unitId || booking.unitId
    );

    Object.assign(booking, {
      ...req.body,
      propertyName:
        propertyContext.propertyName ||
        req.body.propertyName ||
        booking.propertyName,
      unitCode: propertyContext.unitCode || req.body.unitCode || booking.unitCode,
      unitName: propertyContext.unitName || req.body.unitName || booking.unitName,
    });

    await booking.save();
    await syncBookingStatus(booking);

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

function generateReceiptNumber() {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `RCT-${year}-${randomSuffix}`;
}

exports.getPayments = async (req, res) => {
  try {
    const query = {};

    if (req.query.tenantId) {
      query.tenantId = req.query.tenantId;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    res.json(await PaymentRecord.find(query).sort({ createdAt: -1 }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.body.tenantId);

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const propertyContext = await resolvePropertyContext(
      req.body.propertyId || tenant.propertyId,
      req.body.unitId || tenant.unitId
    );

    const payment = await PaymentRecord.create({
      ...req.body,
      amount: safeNumber(req.body.amount),
      receiptNumber: req.body.receiptNumber || generateReceiptNumber(),
      paidAt: req.body.paidAt || new Date(),
      tenantName: tenant.fullName,
      propertyId: req.body.propertyId || tenant.propertyId,
      propertyName:
        propertyContext.propertyName || req.body.propertyName || tenant.propertyName,
      unitId: req.body.unitId || tenant.unitId,
      unitCode: propertyContext.unitCode || req.body.unitCode || tenant.unitCode,
      unitName: propertyContext.unitName || req.body.unitName || tenant.unitName,
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createResidentPayment = async (req, res) => {
  try {
    const tenant = await findLinkedTenantForUser(req.user);

    if (!tenant) {
      return res.status(404).json({
        message:
          "No tenant profile is linked to your account email yet. Ask an admin to add your email to the tenant record.",
      });
    }

    const amount = safeNumber(req.body.amount);

    if (!amount) {
      return res.status(400).json({ message: "Payment amount must be greater than zero" });
    }

    const propertyContext = await resolvePropertyContext(
      tenant.propertyId,
      tenant.unitId
    );

    const payment = await PaymentRecord.create({
      tenantId: tenant._id,
      tenantName: tenant.fullName,
      propertyId: tenant.propertyId,
      propertyName: propertyContext.propertyName || tenant.propertyName,
      unitId: tenant.unitId,
      unitCode: propertyContext.unitCode || tenant.unitCode,
      unitName: propertyContext.unitName || tenant.unitName,
      submittedByUserId: req.user.id,
      amount,
      method: req.body.method || "mpesa",
      status: "pending",
      receiptNumber: generateReceiptNumber(),
      periodLabel: req.body.periodLabel || "",
      paidAt: req.body.paidAt || new Date(),
      reference: req.body.reference || "",
      notes: req.body.notes || "",
    });

    return res.status(201).json(payment);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const payment = await PaymentRecord.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    Object.assign(payment, {
      ...req.body,
      amount:
        req.body.amount === undefined ? payment.amount : safeNumber(req.body.amount),
    });

    await payment.save();
    res.json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const query = {};

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.propertyId) {
      query.propertyId = req.query.propertyId;
    }

    res.json(await Complaint.find(query).sort({ createdAt: -1 }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createComplaint = async (req, res) => {
  try {
    const payload = { ...req.body };
    const tenant = await findLinkedTenantForUser(req.user);
    const propertyId = payload.propertyId || tenant?.propertyId;
    const unitId = payload.unitId || tenant?.unitId;

    if (!propertyId) {
      return res.status(400).json({
        message:
          "No property is linked to your account yet. Ask an admin to connect your tenant profile before submitting a complaint.",
      });
    }

    const propertyContext = await resolvePropertyContext(
      propertyId,
      unitId
    );

    const complaint = await Complaint.create({
      ...payload,
      userId: req.user.id,
      propertyId,
      unitId: unitId || "",
      tenantId: tenant?._id || null,
      tenantName: tenant?.fullName || req.user.name || payload.tenantName,
      email: req.user.email,
      propertyName: propertyContext.propertyName || payload.propertyName,
      unitCode: propertyContext.unitCode || payload.unitCode,
      unitName: propertyContext.unitName || payload.unitName,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
