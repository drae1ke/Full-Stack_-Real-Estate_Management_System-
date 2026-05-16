import jsPDF from "jspdf";
import "jspdf-autotable";
import { BRAND_NAME, CONTACT_DETAILS } from "./siteContent";
import {
  formatKenyanCurrency,
  formatKenyanDateTime,
} from "./formatters";

export const UNIT_STATUSES = [
  "vacant",
  "reserved",
  "occupied",
  "maintenance",
];

export const BOOKING_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "checked_in",
];

export const PAYMENT_METHODS = [
  { value: "mpesa", label: "M-Pesa" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "card", label: "Card" },
  { value: "cash", label: "Cash" },
];

export const PAYMENT_STATUSES = [
  "pending",
  "verified",
  "partial",
  "arrears",
  "failed",
];

export const COMPLAINT_STATUSES = [
  "submitted",
  "in_progress",
  "resolved",
  "closed",
];

export const PROPERTY_STATUSES = ["active", "inactive"];

export function makeEmptyPropertyForm() {
  return {
    name: "",
    propertyCode: "",
    description: "",
    price: "",
    discountPercentage: "",
    address: "",
    city: "",
    estate: "",
    managerName: "",
    contactPhone: "",
    category: "Apartment",
    billingCycle: "monthly",
    bookingEnabled: true,
    status: "active",
    amenitiesText: "",
    buildings: [
      { id: `building-${Date.now()}`, name: "Block A", floors: 4, notes: "" },
    ],
    units: [
      {
        localId: `unit-${Date.now()}`,
        buildingId: "",
        unitCode: "A-101",
        unitName: "Executive One Bedroom",
        floorLabel: "Level 1",
        bedrooms: 1,
        bathrooms: 1,
        sizeSqm: 42,
        rent: 45000,
        deposit: 45000,
        status: "vacant",
        previewFeaturesText: "Balcony, Fitted kitchen, Parking",
      },
    ],
  };
}

export function makeEmptyTenantForm() {
  return {
    fullName: "",
    phone: "",
    email: "",
    nationalId: "",
    leaseStart: "",
    leaseEnd: "",
    propertyId: "",
    unitId: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    monthlyRent: "",
    depositAmount: "",
    status: "active",
    notes: "",
  };
}

export function makeEmptyPaymentForm() {
  return {
    tenantId: "",
    propertyId: "",
    unitId: "",
    amount: "",
    method: "mpesa",
    status: "verified",
    periodLabel: "",
    paidAt: toDateTimeInputValue(new Date()),
    reference: "",
    notes: "",
  };
}

export function makeEmptyComplaintResponse() {
  return {
    status: "in_progress",
    assignedTo: "",
    response: "",
  };
}

export function toDateInputValue(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().split("T")[0];
}

export function toDateTimeInputValue(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const timezoneOffset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - timezoneOffset * 60000);
  return localDate.toISOString().slice(0, 16);
}

export function statusTone(status) {
  const tones = {
    vacant: { background: "#e6f9ef", color: "#0f6a3b" },
    reserved: { background: "#fff3d6", color: "#9a6700" },
    occupied: { background: "#e1efff", color: "#144b8b" },
    maintenance: { background: "#fde5e5", color: "#af2d2d" },
    paid: { background: "#e6f9ef", color: "#0f6a3b" },
    partial: { background: "#fff3d6", color: "#9a6700" },
    arrears: { background: "#fde5e5", color: "#af2d2d" },
    upcoming: { background: "#eff2f6", color: "#435466" },
    pending: { background: "#fff3d6", color: "#9a6700" },
    verified: { background: "#e6f9ef", color: "#0f6a3b" },
    failed: { background: "#fde5e5", color: "#af2d2d" },
    submitted: { background: "#fff3d6", color: "#9a6700" },
    in_progress: { background: "#e1efff", color: "#144b8b" },
    resolved: { background: "#e6f9ef", color: "#0f6a3b" },
    closed: { background: "#eff2f6", color: "#435466" },
    approved: { background: "#e1efff", color: "#144b8b" },
    rejected: { background: "#fde5e5", color: "#af2d2d" },
    checked_in: { background: "#e6f9ef", color: "#0f6a3b" },
    active: { background: "#e6f9ef", color: "#0f6a3b" },
    inactive: { background: "#eff2f6", color: "#435466" },
  };

  return tones[status] || { background: "#eff2f6", color: "#435466" };
}

export function formatStatusLabel(status = "") {
  return status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function preparePropertyPayload(formState) {
  return {
    name: formState.name,
    propertyCode: formState.propertyCode,
    description: formState.description,
    price: formState.price,
    discountPercentage: formState.discountPercentage || 0,
    address: formState.address,
    city: formState.city,
    estate: formState.estate,
    managerName: formState.managerName,
    contactPhone: formState.contactPhone,
    category: formState.category,
    billingCycle: formState.billingCycle,
    bookingEnabled: formState.bookingEnabled,
    status: formState.status,
    amenities: formState.amenitiesText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    buildings: formState.buildings.map((building) => ({
      _id: building._id,
      id: building.id,
      name: building.name,
      floors: Number(building.floors) || 0,
      notes: building.notes,
    })),
    units: formState.units.map((unit) => ({
      _id: unit._id,
      id: unit.id || unit.localId,
      buildingId: unit.buildingId,
      buildingName: unit.buildingName || "",
      unitCode: unit.unitCode,
      unitName: unit.unitName,
      floorLabel: unit.floorLabel,
      bedrooms: Number(unit.bedrooms) || 0,
      bathrooms: Number(unit.bathrooms) || 0,
      sizeSqm: Number(unit.sizeSqm) || 0,
      rent: Number(unit.rent) || 0,
      deposit: Number(unit.deposit) || 0,
      status: unit.status,
      previewFeatures: unit.previewFeaturesText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      assignedTenantId: unit.assignedTenantId || "",
      assignedTenantName: unit.assignedTenantName || "",
      currentBookingId: unit.currentBookingId || "",
      currentBookingName: unit.currentBookingName || "",
    })),
  };
}

export function createPropertyFormData(formState, imageFile, existingImage = "") {
  const payload = preparePropertyPayload(formState);
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, value);
  });

  if (imageFile) {
    formData.append("image", imageFile);
  } else if (existingImage) {
    formData.append("image", existingImage);
  }

  return formData;
}

export function getUnitMetrics(property) {
  const units = property?.units || [];
  return {
    total: units.length,
    vacant: units.filter((unit) => unit.status === "vacant").length,
    reserved: units.filter((unit) => unit.status === "reserved").length,
    occupied: units.filter((unit) => unit.status === "occupied").length,
    maintenance: units.filter((unit) => unit.status === "maintenance").length,
  };
}

export function downloadReceiptPdf({ payment, tenant }) {
  const doc = new jsPDF();
  const paymentDate = payment?.paidAt || payment?.createdAt;

  doc.setFillColor(16, 32, 67);
  doc.rect(0, 0, 210, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(21);
  doc.text(BRAND_NAME, 14, 16);
  doc.setFontSize(11);
  doc.text("Official Rent Receipt", 14, 23);

  doc.setTextColor(22, 34, 51);
  doc.setFontSize(11);
  doc.text(`Receipt No: ${payment?.receiptNumber || "Pending"}`, 14, 42);
  doc.text(`Date: ${formatKenyanDateTime(paymentDate)}`, 14, 49);
  doc.text(`Payment Method: ${formatStatusLabel(payment?.method || "")}`, 14, 56);

  doc.autoTable({
    startY: 66,
    head: [["Detail", "Value"]],
    body: [
      ["Tenant", tenant?.fullName || payment?.tenantName || "Tenant"],
      ["Property", payment?.propertyName || tenant?.propertyName || ""],
      ["Unit", payment?.unitName || tenant?.unitName || ""],
      ["National ID", tenant?.nationalId || "Not provided"],
      ["Amount", formatKenyanCurrency(payment?.amount)],
      ["Reference", payment?.reference || "N/A"],
      ["Status", formatStatusLabel(payment?.status || "verified")],
    ],
    headStyles: { fillColor: [16, 32, 67] },
    styles: { fontSize: 10 },
  });

  const finalY = doc.lastAutoTable?.finalY || 125;

  doc.text("Received by:", 14, finalY + 20);
  doc.line(38, finalY + 21, 92, finalY + 21);
  doc.text("Signature:", 120, finalY + 20);
  doc.line(141, finalY + 21, 194, finalY + 21);
  doc.text(CONTACT_DETAILS.address, 14, finalY + 36);
  doc.text(CONTACT_DETAILS.phone, 14, finalY + 43);
  doc.text(CONTACT_DETAILS.email, 14, finalY + 50);

  doc.save(`${payment?.receiptNumber || "rent-receipt"}.pdf`);
}
