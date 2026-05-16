function parseJSON(value, fallback) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBoolean(value, fallback = false) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value.toLowerCase() === "true") {
      return true;
    }

    if (value.toLowerCase() === "false") {
      return false;
    }
  }

  return fallback;
}

function normalizeBuilding(building, index) {
  return {
    _id: building?._id,
    id: building?.id || `building-${index + 1}`,
    name: building?.name || `Block ${index + 1}`,
    floors: toNumber(building?.floors, 0),
    notes: building?.notes || "",
  };
}

function normalizeUnit(unit, index) {
  return {
    _id: unit?._id,
    id: unit?.id || `unit-${index + 1}`,
    buildingId: unit?.buildingId || "",
    buildingName: unit?.buildingName || "",
    unitCode: unit?.unitCode || `UNIT-${index + 1}`,
    unitName: unit?.unitName || unit?.name || `Unit ${index + 1}`,
    floorLabel: unit?.floorLabel || "",
    bedrooms: toNumber(unit?.bedrooms, 0),
    bathrooms: toNumber(unit?.bathrooms, 0),
    sizeSqm: toNumber(unit?.sizeSqm, 0),
    rent: toNumber(unit?.rent, 0),
    deposit: toNumber(unit?.deposit, 0),
    status: unit?.status || "vacant",
    previewFeatures: Array.isArray(unit?.previewFeatures)
      ? unit.previewFeatures
      : [],
    assignedTenantId: unit?.assignedTenantId || "",
    assignedTenantName: unit?.assignedTenantName || "",
    currentBookingId: unit?.currentBookingId || "",
    currentBookingName: unit?.currentBookingName || "",
  };
}

function normalizePropertyPayload(body = {}) {
  const payload = {
    ...body,
    price: toNumber(body.price, 0),
    discountPercentage: toNumber(body.discountPercentage, 0),
    rating: toNumber(body.rating, 0),
    totalRating: toNumber(body.totalRating, 0),
    bookingEnabled: toBoolean(body.bookingEnabled, true),
  };

  const buildings = parseJSON(body.buildings, []);
  const units = parseJSON(body.units, []);
  const amenities = parseJSON(body.amenities, []);

  payload.propertyCode = body.propertyCode || "";
  payload.city = body.city || "";
  payload.estate = body.estate || "";
  payload.managerName = body.managerName || "";
  payload.contactPhone = body.contactPhone || "";
  payload.billingCycle = body.billingCycle || "monthly";
  payload.status = body.status || "active";
  payload.amenities = Array.isArray(amenities) ? amenities : [];
  payload.buildings = Array.isArray(buildings)
    ? buildings.map(normalizeBuilding)
    : [];
  payload.units = Array.isArray(units) ? units.map(normalizeUnit) : [];

  return payload;
}

exports.normalizePropertyPayload = normalizePropertyPayload;
