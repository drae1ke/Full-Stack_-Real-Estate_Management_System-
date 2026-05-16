import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import {
  HiOutlineArrowPath,
  HiOutlineBanknotes,
  HiOutlineBuildingOffice2,
  HiOutlineClipboardDocumentCheck,
  HiOutlinePlus,
  HiOutlineUsers,
  HiOutlineWrenchScrewdriver,
} from "react-icons/hi2";
import { getCategories } from "../api/categoryApi";
import {
  addProperty,
  deleteProperty,
  getProperty,
  updateProperty,
} from "../api/propertyApi";
import {
  createPayment,
  createTenant,
  deleteTenant,
  getBookings,
  getComplaints,
  getOverview,
  getPayments,
  getTenants,
  updateBooking,
  updateComplaint,
  updatePayment,
  updateTenant,
} from "../api/rentalApi";
import { imageUrl } from "../api/client";
import {
  formatKenyanCurrency,
  formatKenyanDateTime,
  getCategoryOptions,
} from "../utils/formatters";
import { BRAND_NAME } from "../utils/siteContent";
import {
  BOOKING_STATUSES,
  COMPLAINT_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  PROPERTY_STATUSES,
  UNIT_STATUSES,
  createPropertyFormData,
  downloadReceiptPdf,
  formatStatusLabel,
  getUnitMetrics,
  makeEmptyComplaintResponse,
  makeEmptyPaymentForm,
  makeEmptyPropertyForm,
  makeEmptyTenantForm,
  statusTone,
  toDateInputValue,
} from "../utils/rentalTools";

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem 0 4rem;
`;

const Hero = styled.section`
  border-radius: 34px;
  padding: 2rem;
  background:
    radial-gradient(circle at top right, rgba(212, 184, 118, 0.2), transparent 35%),
    linear-gradient(135deg, #132239 0%, #203654 100%);
  color: white;
  box-shadow: 0 24px 60px rgba(12, 26, 47, 0.18);
`;

const HeroTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: #f2d489;
  font-weight: 800;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
`;

const Title = styled.h1`
  margin: 0.75rem 0 0;
  font-size: clamp(2rem, 4vw, 3.2rem);
`;

const Description = styled.p`
  margin: 0.9rem 0 0;
  color: rgba(237, 243, 251, 0.76);
  line-height: 1.75;
  max-width: 46rem;
`;

const HeroActions = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

const HeroButton = styled.button`
  min-height: 3rem;
  padding: 0 1.2rem;
  border-radius: 16px;
  border: ${({ $secondary }) => ($secondary ? "1px solid rgba(255,255,255,0.18)" : "none")};
  background: ${({ $secondary }) =>
    $secondary ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg, #d7b56d, #f0d28f)"};
  color: ${({ $secondary }) => ($secondary ? "white" : "#132239")};
  font-weight: 800;
  cursor: pointer;
`;

const HeroLink = styled(Link)`
  min-height: 3rem;
  padding: 0 1.2rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  color: white;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 660px) {
    grid-template-columns: 1fr;
  }
`;

const WorkspaceLayout = styled.div`
  display: grid;
  grid-template-columns: 18rem minmax(0, 1fr);
  gap: 1rem;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const WorkspaceSidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const WorkspaceSidebarCard = styled.section`
  position: sticky;
  top: 6.2rem;
  border-radius: 28px;
  padding: 1rem;
  background: white;
  border: 1px solid rgba(19, 34, 57, 0.08);
  box-shadow: 0 22px 55px rgba(11, 26, 46, 0.08);

  @media (max-width: 980px) {
    position: static;
  }
`;

const WorkspaceSidebarTitle = styled.div`
  color: #132239;
  font-weight: 800;
`;

const WorkspaceSidebarText = styled.p`
  margin: 0.6rem 0 0;
  color: #5d6f81;
  line-height: 1.7;
`;

const WorkspaceNav = styled.div`
  display: grid;
  gap: 0.65rem;
  margin-top: 1rem;
`;

const WorkspaceNavButton = styled.button`
  text-align: left;
  border-radius: 18px;
  border: 1px solid
    ${({ $active }) => ($active ? "rgba(198, 155, 67, 0.42)" : "rgba(19, 34, 57, 0.08)")};
  background: ${({ $active }) => ($active ? "#fff8ec" : "#f8fafc")};
  padding: 0.95rem 1rem;
  cursor: pointer;
`;

const WorkspaceNavTitle = styled.div`
  color: #132239;
  font-weight: 800;
`;

const WorkspaceNavText = styled.div`
  margin-top: 0.35rem;
  color: #607184;
  font-size: 0.88rem;
  line-height: 1.6;
`;

const WorkspaceContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Card = styled.section`
  border-radius: 28px;
  padding: 1.5rem;
  background: white;
  border: 1px solid rgba(19, 34, 57, 0.08);
  box-shadow: 0 22px 55px rgba(11, 26, 46, 0.08);
`;

const KPIIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: rgba(212, 184, 118, 0.22);
  color: #0f2e57;
  font-size: 1.5rem;
`;

const KPIValue = styled.div`
  margin-top: 1rem;
  color: #132239;
  font-size: 2rem;
  font-weight: 800;
`;

const KPILabel = styled.div`
  margin-top: 0.45rem;
  color: #5c6d80;
  line-height: 1.6;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: #132239;
`;

const SectionText = styled.p`
  margin: 0.8rem 0 0;
  color: #5b6c80;
  line-height: 1.75;
`;

const SectionHead = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
  margin-bottom: 1.4rem;
`;

const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1.12fr 0.88fr;
  gap: 1rem;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $columns = 2 }) => $columns}, minmax(0, 1fr));
  gap: 0.9rem;

  @media (max-width: 740px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  color: #35465a;
  font-weight: 700;
  font-size: 0.92rem;
`;

const inputStyles = `
  min-height: 3rem;
  border-radius: 16px;
  border: 1px solid rgba(19, 34, 57, 0.1);
  padding: 0 0.9rem;
  background: #f8fafc;
  color: #142239;
`;

const Input = styled.input`
  ${inputStyles}
`;

const Select = styled.select`
  ${inputStyles}
`;

const Textarea = styled.textarea`
  min-height: 8rem;
  border-radius: 18px;
  border: 1px solid rgba(19, 34, 57, 0.1);
  padding: 0.9rem;
  background: #f8fafc;
  color: #142239;
  resize: vertical;
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  color: #35506e;
  font-weight: 700;
`;

const InlineButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  min-height: 3rem;
  padding: 0 1.2rem;
  border-radius: 16px;
  border: none;
  background: linear-gradient(135deg, #132239, #27446a);
  color: white;
  font-weight: 800;
  cursor: pointer;
`;

const SecondaryButton = styled.button`
  min-height: 3rem;
  padding: 0 1.2rem;
  border-radius: 16px;
  border: 1px solid rgba(19, 34, 57, 0.12);
  background: #f8fafc;
  color: #17345e;
  font-weight: 800;
  cursor: pointer;
`;

const DangerButton = styled.button`
  min-height: 2.6rem;
  padding: 0 1rem;
  border-radius: 14px;
  border: none;
  background: #fde5e5;
  color: #a72d2d;
  font-weight: 800;
  cursor: pointer;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(19, 34, 57, 0.08);
`;

const Subsection = styled.div`
  border-radius: 24px;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid rgba(19, 34, 57, 0.08);
`;

const SubsectionTitle = styled.h3`
  margin: 0 0 0.8rem;
  color: #132239;
  font-size: 1rem;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 0.9rem;
  text-align: left;
  color: #17345e;
  background: #f3f7fb;
  font-size: 0.88rem;
`;

const Td = styled.td`
  padding: 0.9rem;
  border-top: 1px solid rgba(19, 34, 57, 0.08);
  color: #304256;
  vertical-align: top;
`;

const StatusPill = styled.div`
  width: fit-content;
  border-radius: 999px;
  padding: 0.45rem 0.72rem;
  font-size: 0.8rem;
  font-weight: 800;
`;

const SearchInput = styled(Input)`
  min-width: 18rem;
`;

const BookingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 840px) {
    grid-template-columns: 1fr;
  }
`;

const BookingCard = styled.div`
  border-radius: 24px;
  padding: 1.2rem;
  background: #f8fafc;
  border: 1px solid rgba(19, 34, 57, 0.08);
`;

const ComplaintGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const ComplaintCard = styled.div`
  border-radius: 24px;
  padding: 1.2rem;
  background: #f8fafc;
  border: 1px solid rgba(19, 34, 57, 0.08);
`;

const UnitSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.7rem;

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const UnitSummaryCard = styled.div`
  border-radius: 18px;
  padding: 0.9rem;
  font-weight: 700;
`;

const ListingImage = styled.img`
  width: 4.2rem;
  height: 3.3rem;
  border-radius: 14px;
  object-fit: cover;
`;

const Hint = styled.div`
  color: #5d6f81;
  line-height: 1.7;
`;

const EmptyState = styled.div`
  border-radius: 22px;
  padding: 1rem;
  border: 1px dashed rgba(19, 34, 57, 0.14);
  color: #5d6f81;
`;

function mapPropertyToForm(property) {
  const base = makeEmptyPropertyForm();

  return {
    ...base,
    name: property.name || "",
    propertyCode: property.propertyCode || "",
    description: property.description || "",
    price: property.price || "",
    discountPercentage: property.discountPercentage || "",
    address: property.address || "",
    city: property.city || "",
    estate: property.estate || "",
    managerName: property.managerName || "",
    contactPhone: property.contactPhone || "",
    category: property.category || "Apartment",
    billingCycle: property.billingCycle || "monthly",
    bookingEnabled:
      property.bookingEnabled === undefined ? true : property.bookingEnabled,
    status: property.status || "active",
    amenitiesText: (property.amenities || []).join(", "),
    buildings:
      property.buildings?.length > 0
        ? property.buildings.map((building) => ({
            _id: building._id,
            id: building.id || `building-${Date.now()}`,
            name: building.name || "",
            floors: building.floors || "",
            notes: building.notes || "",
          }))
        : base.buildings,
    units:
      property.units?.length > 0
        ? property.units.map((unit) => ({
            _id: unit._id,
            id: unit.id || unit._id,
            localId: unit._id || unit.id,
            buildingId: unit.buildingId || "",
            buildingName: unit.buildingName || "",
            unitCode: unit.unitCode || "",
            unitName: unit.unitName || "",
            floorLabel: unit.floorLabel || "",
            bedrooms: unit.bedrooms || "",
            bathrooms: unit.bathrooms || "",
            sizeSqm: unit.sizeSqm || "",
            rent: unit.rent || "",
            deposit: unit.deposit || "",
            status: unit.status || "vacant",
            previewFeaturesText: (unit.previewFeatures || []).join(", "),
            assignedTenantId: unit.assignedTenantId || "",
            assignedTenantName: unit.assignedTenantName || "",
            currentBookingId: unit.currentBookingId || "",
            currentBookingName: unit.currentBookingName || "",
          }))
        : [],
  };
}

function hydrateComplaintDrafts(records) {
  return records.reduce((accumulator, complaint) => {
    accumulator[complaint._id] = {
      status: complaint.status || "submitted",
      assignedTo: complaint.assignedTo || "",
      response: complaint.response || "",
    };
    return accumulator;
  }, {});
}

function createLocalDraftKey(prefix = "draft") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function makeDraftUnit(buildingId = "") {
  return {
    localId: createLocalDraftKey("unit"),
    buildingId,
    buildingName: "",
    unitCode: "",
    unitName: "",
    floorLabel: "",
    bedrooms: "",
    bathrooms: "",
    sizeSqm: "",
    rent: "",
    deposit: "",
    status: "vacant",
    previewFeaturesText: "",
    assignedTenantId: "",
    assignedTenantName: "",
    currentBookingId: "",
    currentBookingName: "",
  };
}

function getUnitDraftKey(unit, index = 0) {
  return String(
    unit?._id || unit?.localId || unit?.id || unit?.unitCode || `unit-template-${index}`
  );
}

function getSuggestedCodePrefix(unit, building) {
  const unitCode = unit?.unitCode?.trim();

  if (unitCode) {
    const [prefix] = unitCode.split("-");

    if (prefix?.trim()) {
      return prefix.trim();
    }
  }

  const buildingTokens = building?.name?.match(/[A-Za-z0-9]+/g) || [];
  return (buildingTokens[buildingTokens.length - 1] || "").toUpperCase();
}

function makeUnitGenerationForm(form = makeEmptyPropertyForm()) {
  const firstBuilding = form.buildings?.[0] || null;
  const firstUnit = form.units?.[0] || null;

  return {
    templateUnitKey: firstUnit ? getUnitDraftKey(firstUnit, 0) : "",
    buildingId: firstUnit?.buildingId || firstBuilding?.id || "",
    floorCount: Number(firstBuilding?.floors) || 1,
    unitsPerFloor: 1,
    startingFloor: 1,
    codePrefix: getSuggestedCodePrefix(firstUnit, firstBuilding),
    floorLabelPrefix: "Level",
  };
}

function buildGeneratedUnits({
  templateUnit,
  buildingId,
  floorCount,
  unitsPerFloor,
  startingFloor,
  codePrefix,
  floorLabelPrefix,
  existingUnits = [],
}) {
  const normalizedFloorCount = Number(floorCount) || 0;
  const normalizedUnitsPerFloor = Number(unitsPerFloor) || 0;
  const normalizedStartingFloor = Number(startingFloor) || 1;
  const normalizedCodePrefix = codePrefix.trim();
  const normalizedFloorLabelPrefix = floorLabelPrefix.trim();
  const unitNumberPadding = Math.max(2, String(normalizedUnitsPerFloor).length);
  const existingCodes = new Set(
    existingUnits
      .filter((unit) => String(unit?.buildingId || "") === String(buildingId))
      .map((unit) => `${buildingId}::${String(unit?.unitCode || "").trim().toLowerCase()}`)
  );
  const generatedUnits = [];

  for (let floorIndex = 0; floorIndex < normalizedFloorCount; floorIndex += 1) {
    const floorNumber = normalizedStartingFloor + floorIndex;

    for (let unitIndex = 1; unitIndex <= normalizedUnitsPerFloor; unitIndex += 1) {
      const unitSuffix = String(unitIndex).padStart(unitNumberPadding, "0");
      const unitCode = normalizedCodePrefix
        ? `${normalizedCodePrefix}-${floorNumber}${unitSuffix}`
        : `${floorNumber}${unitSuffix}`;
      const codeKey = `${buildingId}::${unitCode.toLowerCase()}`;

      if (existingCodes.has(codeKey)) {
        continue;
      }

      existingCodes.add(codeKey);
      generatedUnits.push({
        ...makeDraftUnit(buildingId),
        unitCode,
        unitName: templateUnit?.unitName || "",
        floorLabel: normalizedFloorLabelPrefix
          ? `${normalizedFloorLabelPrefix} ${floorNumber}`
          : `${floorNumber}`,
        bedrooms: templateUnit?.bedrooms ?? "",
        bathrooms: templateUnit?.bathrooms ?? "",
        sizeSqm: templateUnit?.sizeSqm ?? "",
        rent: templateUnit?.rent ?? "",
        deposit: templateUnit?.deposit ?? "",
        status:
          templateUnit?.status &&
          !["occupied", "reserved"].includes(templateUnit.status)
            ? templateUnit.status
            : "vacant",
        previewFeaturesText: templateUnit?.previewFeaturesText || "",
      });
    }
  }

  return generatedUnits;
}

const WORKSPACE_PANELS = [
  {
    id: "properties",
    title: "Properties",
    text: "Create houses, buildings, units, and manage existing property inventory.",
  },
  {
    id: "tenants",
    title: "Tenants",
    text: "Add tenants, assign units, and work through the resident register.",
  },
  {
    id: "bookings",
    title: "Bookings",
    text: "Approve, reject, or check in reservation requests one by one.",
  },
  {
    id: "payments",
    title: "Payments",
    text: "Capture rent, verify payment status, and review arrears history.",
  },
  {
    id: "complaints",
    title: "Complaints",
    text: "Handle maintenance issues and update resident responses from one queue.",
  },
];

function resolveWorkspacePanel(pathname = "", hash = "") {
  const normalizedHash = hash.replace("#", "");
  const hashToPanel = {
    "property-management": "properties",
    "portfolio-inventory": "properties",
    "tenant-management": "tenants",
    "tenant-records": "tenants",
    bookings: "bookings",
    payments: "payments",
    complaints: "complaints",
  };

  if (hashToPanel[normalizedHash]) {
    return hashToPanel[normalizedHash];
  }

  if (pathname.includes("/admin/tenants")) {
    return "tenants";
  }

  return "properties";
}

function AddProduct() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeWorkspacePanel, setActiveWorkspacePanel] = useState(
    resolveWorkspacePanel(location.pathname, location.hash)
  );
  const [overview, setOverview] = useState(null);
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [propertyForm, setPropertyForm] = useState(() => makeEmptyPropertyForm());
  const [propertyImage, setPropertyImage] = useState(null);
  const [editingPropertyId, setEditingPropertyId] = useState("");
  const [tenantForm, setTenantForm] = useState(makeEmptyTenantForm());
  const [editingTenantId, setEditingTenantId] = useState("");
  const [paymentForm, setPaymentForm] = useState(makeEmptyPaymentForm());
  const [tenantSearch, setTenantSearch] = useState("");
  const [complaintDrafts, setComplaintDrafts] = useState({});
  const [unitGenerationForm, setUnitGenerationForm] = useState({
    templateUnitKey: "",
    buildingId: "",
    floorCount: 1,
    unitsPerFloor: 1,
    startingFloor: 1,
    codePrefix: "",
    floorLabelPrefix: "Level",
  });

  const loadWorkspace = async () => {
    try {
      const [
        categoryData,
        propertyData,
        overviewData,
        tenantData,
        bookingData,
        paymentData,
        complaintData,
      ] = await Promise.all([
        getCategories().catch(() => []),
        getProperty(),
        getOverview(),
        getTenants(),
        getBookings(),
        getPayments(),
        getComplaints(),
      ]);

      setCategories(getCategoryOptions(categoryData));
      setProperties(Array.isArray(propertyData) ? propertyData : []);
      setOverview(overviewData);
      setTenants(Array.isArray(tenantData) ? tenantData : []);
      setBookings(Array.isArray(bookingData) ? bookingData : []);
      setPayments(Array.isArray(paymentData) ? paymentData : []);
      setComplaints(Array.isArray(complaintData) ? complaintData : []);
      setComplaintDrafts(hydrateComplaintDrafts(Array.isArray(complaintData) ? complaintData : []));
    } catch (error) {
      console.error("Failed to load workspace:", error);
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, []);

  useEffect(() => {
    setActiveWorkspacePanel(resolveWorkspacePanel(location.pathname, location.hash));
  }, [location.pathname, location.hash]);

  useEffect(() => {
    setUnitGenerationForm((current) => {
      const firstBuilding = propertyForm.buildings?.[0] || null;
      const firstUnit = propertyForm.units?.[0] || null;
      const matchingBuilding = propertyForm.buildings.find(
        (building) => building.id === current.buildingId
      );
      const matchingTemplateUnit = propertyForm.units.find(
        (unit, index) => getUnitDraftKey(unit, index) === current.templateUnitKey
      );
      const nextBuilding = matchingBuilding || firstBuilding;
      const nextTemplateUnit = matchingTemplateUnit || firstUnit;
      const nextTemplateUnitKey = nextTemplateUnit
        ? getUnitDraftKey(
            nextTemplateUnit,
            propertyForm.units.findIndex(
              (unit) => String(unit?.localId || unit?._id || unit?.id) ===
                String(nextTemplateUnit?.localId || nextTemplateUnit?._id || nextTemplateUnit?.id)
            )
          )
        : "";
      const nextBuildingId = nextBuilding?.id || "";
      const nextFloorCount =
        Number(current.floorCount) > 0
          ? current.floorCount
          : Number(nextBuilding?.floors) || 1;
      const nextCodePrefix =
        current.codePrefix || getSuggestedCodePrefix(nextTemplateUnit, nextBuilding);

      if (
        current.templateUnitKey === nextTemplateUnitKey &&
        current.buildingId === nextBuildingId &&
        current.floorCount === nextFloorCount &&
        current.codePrefix === nextCodePrefix
      ) {
        return current;
      }

      return {
        ...current,
        templateUnitKey: nextTemplateUnitKey,
        buildingId: nextBuildingId,
        floorCount: nextFloorCount,
        codePrefix: nextCodePrefix,
      };
    });
  }, [propertyForm.buildings, propertyForm.units]);

  const filteredTenants = useMemo(() => {
    if (!tenantSearch) {
      return tenants;
    }

    return tenants.filter((tenant) =>
      [
        tenant.fullName,
        tenant.phone,
        tenant.nationalId,
        tenant.propertyName,
        tenant.unitCode,
      ]
        .join(" ")
        .toLowerCase()
        .includes(tenantSearch.toLowerCase())
    );
  }, [tenantSearch, tenants]);

  const selectedTenantProperty = useMemo(
    () => properties.find((property) => property._id === tenantForm.propertyId),
    [properties, tenantForm.propertyId]
  );

  const unitTemplateOptions = useMemo(
    () =>
      propertyForm.units.map((unit, index) => ({
        key: getUnitDraftKey(unit, index),
        unit,
      })),
    [propertyForm.units]
  );
  const selectedTemplateUnit =
    unitTemplateOptions.find((option) => option.key === unitGenerationForm.templateUnitKey)
      ?.unit || propertyForm.units[0] || null;
  const selectedGeneratorBuilding =
    propertyForm.buildings.find((building) => building.id === unitGenerationForm.buildingId) ||
    propertyForm.buildings[0] ||
    null;

  const tenantUnitOptions = useMemo(() => {
    const units = selectedTenantProperty?.units || [];

    return units.filter((unit) => {
      if (!unit?.assignedTenantId) {
        return true;
      }

      return String(unit.assignedTenantId) === String(editingTenantId);
    });
  }, [selectedTenantProperty, editingTenantId]);
  const paymentTenant = tenants.find((tenant) => tenant._id === paymentForm.tenantId);

  const kpis = [
    {
      icon: <HiOutlineBuildingOffice2 />,
      value: `${overview?.kpis?.occupiedRooms || 0}/${overview?.kpis?.totalUnits || 0}`,
      label: "Occupied rooms across the total managed unit inventory",
    },
    {
      icon: <HiOutlineUsers />,
      value: `${tenants.length}`,
      label: "Active tenant records under administration and lease tracking",
    },
    {
      icon: <HiOutlineBanknotes />,
      value: formatKenyanCurrency(overview?.paymentSummary?.collectedRevenue || 0),
      label: "Revenue collected and verified through the payment register",
    },
    {
      icon: <HiOutlineWrenchScrewdriver />,
      value: `${complaints.length}`,
      label: "Resident complaints and maintenance issues currently logged",
    },
  ];

  const resetPropertyEditor = () => {
    const nextPropertyForm = makeEmptyPropertyForm();
    setPropertyForm(nextPropertyForm);
    setUnitGenerationForm(makeUnitGenerationForm(nextPropertyForm));
    setPropertyImage(null);
    setEditingPropertyId("");
  };

  const resetTenantEditor = () => {
    setTenantForm(makeEmptyTenantForm());
    setEditingTenantId("");
  };

  const handlePropertyField = (field, value) => {
    setPropertyForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleBuildingChange = (index, field, value) => {
    const targetBuildingId = propertyForm.buildings[index]?.id;

    setPropertyForm((current) => {
      const nextBuildings = current.buildings.map((building, buildingIndex) =>
        buildingIndex === index ? { ...building, [field]: value } : building
      );
      return { ...current, buildings: nextBuildings };
    });

    if (field === "floors" && targetBuildingId === unitGenerationForm.buildingId) {
      setUnitGenerationForm((current) => ({
        ...current,
        floorCount: value,
      }));
    }
  };

  const handleUnitChange = (index, field, value) => {
    setPropertyForm((current) => {
      const nextUnits = current.units.map((unit, unitIndex) =>
        unitIndex === index ? { ...unit, [field]: value } : unit
      );
      return { ...current, units: nextUnits };
    });
  };

  const handleUnitGenerationField = (field, value) => {
    setUnitGenerationForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleUnitTemplateChange = (templateUnitKey) => {
    const templateUnit = unitTemplateOptions.find((option) => option.key === templateUnitKey)?.unit;
    const templateBuilding = propertyForm.buildings.find(
      (building) => building.id === templateUnit?.buildingId
    );

    setUnitGenerationForm((current) => ({
      ...current,
      templateUnitKey,
      buildingId: templateUnit?.buildingId || current.buildingId,
      codePrefix:
        current.codePrefix || getSuggestedCodePrefix(templateUnit, templateBuilding),
    }));
  };

  const handleUnitGenerationBuildingChange = (buildingId) => {
    const building = propertyForm.buildings.find((item) => item.id === buildingId);

    setUnitGenerationForm((current) => ({
      ...current,
      buildingId,
      floorCount: Number(building?.floors) || current.floorCount,
      codePrefix:
        current.codePrefix || getSuggestedCodePrefix(selectedTemplateUnit, building),
    }));
  };

  const addBuildingRow = () => {
    setPropertyForm((current) => ({
      ...current,
      buildings: [
        ...current.buildings,
        {
          id: `building-${Date.now()}`,
          name: `Block ${String.fromCharCode(65 + current.buildings.length)}`,
          floors: "",
          notes: "",
        },
      ],
    }));
  };

  const addUnitRow = () => {
    setPropertyForm((current) => ({
      ...current,
      units: [
        ...current.units,
        {
          ...makeDraftUnit(current.buildings[0]?.id || ""),
        },
      ],
    }));
  };

  const removeBuildingRow = (index) => {
    setPropertyForm((current) => ({
      ...current,
      buildings: current.buildings.filter((_, buildingIndex) => buildingIndex !== index),
    }));
  };

  const removeUnitRow = (index) => {
    setPropertyForm((current) => ({
      ...current,
      units: current.units.filter((_, unitIndex) => unitIndex !== index),
    }));
  };

  const handleGenerateUnits = () => {
    if (!selectedTemplateUnit) {
      alert("Create and fill one template unit first, then generate the rest.");
      return;
    }

    if (!selectedGeneratorBuilding) {
      alert("Select a building before generating units.");
      return;
    }

    const floorCount = Number(unitGenerationForm.floorCount) || 0;
    const unitsPerFloor = Number(unitGenerationForm.unitsPerFloor) || 0;
    const startingFloor = Number(unitGenerationForm.startingFloor) || 0;

    if (floorCount <= 0 || unitsPerFloor <= 0 || startingFloor <= 0) {
      alert("Enter valid floor, starting floor, and units-per-floor values.");
      return;
    }

    const resolvedCodePrefix =
      unitGenerationForm.codePrefix.trim() ||
      getSuggestedCodePrefix(selectedTemplateUnit, selectedGeneratorBuilding);
    const generatedUnits = buildGeneratedUnits({
      templateUnit: selectedTemplateUnit,
      buildingId: selectedGeneratorBuilding.id,
      floorCount,
      unitsPerFloor,
      startingFloor,
      codePrefix: resolvedCodePrefix,
      floorLabelPrefix: unitGenerationForm.floorLabelPrefix || "Level",
      existingUnits: propertyForm.units,
    });
    const requestedTotal = floorCount * unitsPerFloor;
    const skippedUnits = requestedTotal - generatedUnits.length;

    if (generatedUnits.length === 0) {
      alert("No new units were added because every generated code already exists.");
      return;
    }

    setPropertyForm((current) => ({
      ...current,
      buildings: current.buildings.map((building) =>
        building.id === selectedGeneratorBuilding.id
          ? { ...building, floors: floorCount }
          : building
      ),
      units: [...current.units, ...generatedUnits],
    }));
    setUnitGenerationForm((current) => ({
      ...current,
      buildingId: selectedGeneratorBuilding.id,
      floorCount,
      codePrefix: resolvedCodePrefix,
    }));

    alert(
      `${generatedUnits.length} unit(s) generated successfully.${
        skippedUnits > 0
          ? ` ${skippedUnits} matching code(s) already existed and were skipped.`
          : ""
      }`
    );
  };

  const handlePropertySubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const hydratedUnits = propertyForm.units.map((unit) => ({
        ...unit,
        buildingName:
          propertyForm.buildings.find((building) => building.id === unit.buildingId)?.name ||
          "",
      }));

      const payload = {
        ...propertyForm,
        units: hydratedUnits,
      };
      const formData = createPropertyFormData(
        payload,
        propertyImage,
        properties.find((property) => property._id === editingPropertyId)?.image || ""
      );

      if (editingPropertyId) {
        await updateProperty(formData, editingPropertyId);
      } else {
        await addProperty(formData);
      }

      resetPropertyEditor();
      await loadWorkspace();
    } catch (error) {
      console.error("Property save failed:", error);
      alert("Property could not be saved.");
      setSaving(false);
    }
  };

  const loadPropertyIntoEditor = (property) => {
    const nextPropertyForm = mapPropertyToForm(property);
    setActiveWorkspacePanel("properties");
    setEditingPropertyId(property._id);
    setPropertyForm(nextPropertyForm);
    setUnitGenerationForm(makeUnitGenerationForm(nextPropertyForm));
    setPropertyImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProperty = async (property) => {
    const confirmed = window.confirm(`Delete ${property.name} from the portfolio?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteProperty(property._id);
      await loadWorkspace();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("The property could not be deleted.");
    }
  };

  const handleTenantSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...tenantForm,
        leaseStart: tenantForm.leaseStart || null,
        leaseEnd: tenantForm.leaseEnd || null,
        monthlyRent: Number(tenantForm.monthlyRent) || 0,
        depositAmount: Number(tenantForm.depositAmount) || 0,
      };

      if (editingTenantId) {
        await updateTenant(editingTenantId, payload);
      } else {
        await createTenant(payload);
      }

      resetTenantEditor();
      await loadWorkspace();
    } catch (error) {
      console.error("Tenant save failed:", error);
      alert(error.message || "The tenant record could not be saved.");
      setSaving(false);
    }
  };

  const loadTenantIntoEditor = (tenant) => {
    setActiveWorkspacePanel("tenants");
    setEditingTenantId(tenant._id);
    setTenantForm({
      fullName: tenant.fullName || "",
      phone: tenant.phone || "",
      email: tenant.email || "",
      nationalId: tenant.nationalId || "",
      leaseStart: toDateInputValue(tenant.leaseStart),
      leaseEnd: toDateInputValue(tenant.leaseEnd),
      propertyId: tenant.propertyId || "",
      unitId: tenant.unitId || "",
      emergencyContactName: tenant.emergencyContactName || "",
      emergencyContactPhone: tenant.emergencyContactPhone || "",
      monthlyRent: tenant.monthlyRent || "",
      depositAmount: tenant.depositAmount || "",
      status: tenant.status || "active",
      notes: tenant.notes || "",
    });
  };

  const handleDeleteTenant = async (tenant) => {
    const confirmed = window.confirm(`Delete tenant record for ${tenant.fullName}?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteTenant(tenant._id);
      await loadWorkspace();
    } catch (error) {
      console.error("Tenant delete failed:", error);
      alert("The tenant record could not be deleted.");
    }
  };

  const handleBookingStatus = async (booking, status) => {
    try {
      await updateBooking(booking._id, { status });
      await loadWorkspace();
    } catch (error) {
      console.error("Booking update failed:", error);
      alert("The booking could not be updated.");
    }
  };

  const handlePaymentTenantChange = (tenantId) => {
    const tenant = tenants.find((record) => record._id === tenantId);
    setPaymentForm((current) => ({
      ...current,
      tenantId,
      propertyId: tenant?.propertyId || "",
      unitId: tenant?.unitId || "",
      amount: tenant?.monthlyRent || "",
      periodLabel:
        current.periodLabel ||
        new Date().toLocaleString("en-KE", {
          month: "long",
          year: "numeric",
        }),
    }));
  };

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await createPayment({
        ...paymentForm,
        amount: Number(paymentForm.amount) || 0,
        paidAt: paymentForm.paidAt ? new Date(paymentForm.paidAt).toISOString() : new Date(),
      });
      setPaymentForm(makeEmptyPaymentForm());
      await loadWorkspace();
    } catch (error) {
      console.error("Payment save failed:", error);
      alert("Payment could not be saved.");
      setSaving(false);
    }
  };

  const handleQuickPaymentUpdate = async (payment, status) => {
    try {
      await updatePayment(payment._id, { status });
      await loadWorkspace();
    } catch (error) {
      console.error("Payment update failed:", error);
      alert("Payment status could not be updated.");
    }
  };

  const handleComplaintDraftChange = (id, field, value) => {
    setComplaintDrafts((current) => ({
      ...current,
      [id]: {
        ...(current[id] || makeEmptyComplaintResponse()),
        [field]: value,
      },
    }));
  };

  const handleComplaintSave = async (complaint) => {
    try {
      await updateComplaint(complaint._id, complaintDrafts[complaint._id]);
      await loadWorkspace();
    } catch (error) {
      console.error("Complaint update failed:", error);
      alert("Complaint progress could not be updated.");
    }
  };

  if (loading) {
    return <Page>Loading property and tenant workspace...</Page>;
  }

  return (
    <Page>
      <Hero>
        <HeroTop>
          <div>
            <Eyebrow>
              <HiOutlineClipboardDocumentCheck />
              Property And Tenant Admin Workspace
            </Eyebrow>
            <Title>{BRAND_NAME} rental administration hub</Title>
            <Description>
              Create houses, apartment blocks, and units, then perform tenant
              and property CRUD from one admin workspace.
            </Description>
          </div>
          <HeroActions>
            <HeroButton onClick={loadWorkspace}>
              <HiOutlineArrowPath style={{ marginRight: "0.45rem" }} />
              Refresh Data
            </HeroButton>
            <HeroLink to="/dashboard">Open Dashboard</HeroLink>
            <HeroLink to="/category">Manage Categories</HeroLink>
          </HeroActions>
        </HeroTop>
      </Hero>

      <KPIGrid>
        {kpis.map((item) => (
          <Card key={item.label}>
            <KPIIcon>{item.icon}</KPIIcon>
            <KPIValue>{item.value}</KPIValue>
            <KPILabel>{item.label}</KPILabel>
          </Card>
        ))}
      </KPIGrid>
      <WorkspaceLayout>
        <WorkspaceSidebar>
          <WorkspaceSidebarCard>
            <WorkspaceSidebarTitle>Operations Sidebar</WorkspaceSidebarTitle>
            <WorkspaceSidebarText>
              Open one admin area at a time so property setup, tenant work, bookings,
              payments, and complaints stay much easier to manage.
            </WorkspaceSidebarText>
            <WorkspaceNav>
              {WORKSPACE_PANELS.map((panel) => (
                <WorkspaceNavButton
                  key={panel.id}
                  type="button"
                  $active={activeWorkspacePanel === panel.id}
                  onClick={() => setActiveWorkspacePanel(panel.id)}
                >
                  <WorkspaceNavTitle>{panel.title}</WorkspaceNavTitle>
                  <WorkspaceNavText>{panel.text}</WorkspaceNavText>
                </WorkspaceNavButton>
              ))}
            </WorkspaceNav>
          </WorkspaceSidebarCard>
        </WorkspaceSidebar>

        <WorkspaceContent>
      {activeWorkspacePanel === "properties" && (
      <TwoColumn>
        <Card id="property-management">
          <SectionHead>
            <div>
              <SectionTitle>House, property, and unit management</SectionTitle>
              <SectionText>
                Create buildings, add or edit rooms, and maintain property CRUD
                from a structure built for apartment operations instead of simple
                generic listings.
              </SectionText>
            </div>
          </SectionHead>

          <Form onSubmit={handlePropertySubmit}>
            <Grid>
              <Field>
                Property Name
                <Input
                  value={propertyForm.name}
                  onChange={(event) => handlePropertyField("name", event.target.value)}
                  required
                />
              </Field>
              <Field>
                Property Code
                <Input
                  value={propertyForm.propertyCode}
                  onChange={(event) =>
                    handlePropertyField("propertyCode", event.target.value)
                  }
                />
              </Field>
              <Field>
                Category
                <Select
                  value={propertyForm.category}
                  onChange={(event) => handlePropertyField("category", event.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category._id} value={category.category}>
                      {category.category}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field>
                Property Status
                <Select
                  value={propertyForm.status}
                  onChange={(event) => handlePropertyField("status", event.target.value)}
                >
                  {PROPERTY_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {formatStatusLabel(status)}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field>
                Starting Rent
                <Input
                  type="number"
                  min="0"
                  value={propertyForm.price}
                  onChange={(event) => handlePropertyField("price", event.target.value)}
                  required
                />
              </Field>
              <Field>
                Discount Percentage
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={propertyForm.discountPercentage}
                  onChange={(event) =>
                    handlePropertyField("discountPercentage", event.target.value)
                  }
                />
              </Field>
              <Field>
                Manager Name
                <Input
                  value={propertyForm.managerName}
                  onChange={(event) =>
                    handlePropertyField("managerName", event.target.value)
                  }
                />
              </Field>
              <Field>
                Contact Phone
                <Input
                  value={propertyForm.contactPhone}
                  onChange={(event) =>
                    handlePropertyField("contactPhone", event.target.value)
                  }
                />
              </Field>
              <Field>
                Address
                <Input
                  value={propertyForm.address}
                  onChange={(event) => handlePropertyField("address", event.target.value)}
                  required
                />
              </Field>
              <Field>
                City
                <Input
                  value={propertyForm.city}
                  onChange={(event) => handlePropertyField("city", event.target.value)}
                />
              </Field>
              <Field>
                Estate / Neighbourhood
                <Input
                  value={propertyForm.estate}
                  onChange={(event) => handlePropertyField("estate", event.target.value)}
                />
              </Field>
              <Field>
                Billing Cycle
                <Select
                  value={propertyForm.billingCycle}
                  onChange={(event) =>
                    handlePropertyField("billingCycle", event.target.value)
                  }
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </Select>
              </Field>
            </Grid>

            <Field>
              Amenities
              <Input
                value={propertyForm.amenitiesText}
                onChange={(event) =>
                  handlePropertyField("amenitiesText", event.target.value)
                }
                placeholder="Parking, CCTV, Lift, Backup power"
              />
            </Field>

            <Field>
              Description
              <Textarea
                value={propertyForm.description}
                onChange={(event) =>
                  handlePropertyField("description", event.target.value)
                }
                required
              />
            </Field>

            <Grid>
              <Field>
                Listing Image
                <Input
                  type="file"
                  onChange={(event) => setPropertyImage(event.target.files?.[0] || null)}
                />
              </Field>
              <Field>
                Booking Enabled
                <ToggleRow>
                  <input
                    type="checkbox"
                    checked={propertyForm.bookingEnabled}
                    onChange={(event) =>
                      handlePropertyField("bookingEnabled", event.target.checked)
                    }
                  />
                  Allow reservation requests from the booking page
                </ToggleRow>
              </Field>
            </Grid>

            {propertyForm.category === "Apartment" && (
              <>
                <Divider />
                <Subsection>
                  <SectionHead>
                    <div>
                      <SubsectionTitle>Apartment blocks / buildings</SubsectionTitle>
                      <Hint>
                        Use structured building records when a property contains
                        multiple apartment blocks.
                      </Hint>
                    </div>
                    <SecondaryButton type="button" onClick={addBuildingRow}>
                      <HiOutlinePlus style={{ marginRight: "0.35rem" }} />
                      Add Building
                    </SecondaryButton>
                  </SectionHead>
                  <Grid>
                    {propertyForm.buildings.map((building, index) => (
                      <Subsection key={building.id || building._id}>
                        <Grid>
                          <Field>
                            Building Name
                            <Input
                              value={building.name}
                              onChange={(event) =>
                                handleBuildingChange(index, "name", event.target.value)
                              }
                            />
                          </Field>
                          <Field>
                            Floors
                            <Input
                              type="number"
                              min="0"
                              value={building.floors}
                              onChange={(event) =>
                                handleBuildingChange(index, "floors", event.target.value)
                              }
                            />
                          </Field>
                        </Grid>
                        <Field>
                          Notes
                          <Textarea
                            value={building.notes}
                            onChange={(event) =>
                              handleBuildingChange(index, "notes", event.target.value)
                            }
                          />
                        </Field>
                        {propertyForm.buildings.length > 1 && (
                          <DangerButton type="button" onClick={() => removeBuildingRow(index)}>
                            Remove Building
                          </DangerButton>
                        )}
                      </Subsection>
                    ))}
                  </Grid>
                </Subsection>

                <Subsection>
                  <SectionHead>
                    <div>
                      <SubsectionTitle>Rooms / units</SubsectionTitle>
                      <Hint>
                        Assign each room a code, rent, deposit, and live
                        occupancy status so bookings and tenants stay aligned.
                      </Hint>
                    </div>
                    <SecondaryButton type="button" onClick={addUnitRow}>
                      <HiOutlinePlus style={{ marginRight: "0.35rem" }} />
                      Add Unit
                    </SecondaryButton>
                  </SectionHead>
                  <Subsection style={{ marginBottom: "1rem" }}>
                    <SectionHead>
                      <div>
                        <SubsectionTitle>Generate units from one template</SubsectionTitle>
                        <Hint>
                          Fill one sample unit below, then generate the rest by floor.
                          Existing matching unit codes are skipped automatically.
                        </Hint>
                      </div>
                      <PrimaryButton type="button" onClick={handleGenerateUnits}>
                        Generate Units
                      </PrimaryButton>
                    </SectionHead>
                    <Grid>
                      <Field>
                        Template Unit
                        <Select
                          value={unitGenerationForm.templateUnitKey}
                          onChange={(event) => handleUnitTemplateChange(event.target.value)}
                        >
                          {unitTemplateOptions.length === 0 && (
                            <option value="">Create a template unit first</option>
                          )}
                          {unitTemplateOptions.map((option, index) => (
                            <option key={option.key} value={option.key}>
                              {option.unit.unitCode || `Unit template ${index + 1}`} -{" "}
                              {option.unit.unitName || "Unnamed unit"}
                            </option>
                          ))}
                        </Select>
                      </Field>
                      <Field>
                        Building
                        <Select
                          value={unitGenerationForm.buildingId}
                          onChange={(event) =>
                            handleUnitGenerationBuildingChange(event.target.value)
                          }
                        >
                          {propertyForm.buildings.length === 0 && (
                            <option value="">Create a building first</option>
                          )}
                          {propertyForm.buildings.map((building) => (
                            <option key={building.id} value={building.id}>
                              {building.name}
                            </option>
                          ))}
                        </Select>
                      </Field>
                      <Field>
                        Floors To Generate
                        <Input
                          type="number"
                          min="1"
                          value={unitGenerationForm.floorCount}
                          onChange={(event) =>
                            handleUnitGenerationField("floorCount", event.target.value)
                          }
                        />
                      </Field>
                      <Field>
                        Units Per Floor
                        <Input
                          type="number"
                          min="1"
                          value={unitGenerationForm.unitsPerFloor}
                          onChange={(event) =>
                            handleUnitGenerationField("unitsPerFloor", event.target.value)
                          }
                        />
                      </Field>
                      <Field>
                        Starting Floor
                        <Input
                          type="number"
                          min="1"
                          value={unitGenerationForm.startingFloor}
                          onChange={(event) =>
                            handleUnitGenerationField("startingFloor", event.target.value)
                          }
                        />
                      </Field>
                      <Field>
                        Code Prefix
                        <Input
                          value={unitGenerationForm.codePrefix}
                          onChange={(event) =>
                            handleUnitGenerationField("codePrefix", event.target.value)
                          }
                          placeholder="A"
                        />
                      </Field>
                    </Grid>
                    <Grid style={{ marginTop: "0.9rem" }}>
                      <Field>
                        Floor Label Prefix
                        <Input
                          value={unitGenerationForm.floorLabelPrefix}
                          onChange={(event) =>
                            handleUnitGenerationField("floorLabelPrefix", event.target.value)
                          }
                          placeholder="Level"
                        />
                      </Field>
                      <Field>
                        Preview
                        <Hint>
                          Example codes:{" "}
                          {(unitGenerationForm.codePrefix || getSuggestedCodePrefix(
                            selectedTemplateUnit,
                            selectedGeneratorBuilding
                          ) || "A") +
                            `-${Number(unitGenerationForm.startingFloor) || 1}01`}{" "}
                          to{" "}
                          {(unitGenerationForm.codePrefix || getSuggestedCodePrefix(
                            selectedTemplateUnit,
                            selectedGeneratorBuilding
                          ) || "A") +
                            `-${
                              (Number(unitGenerationForm.startingFloor) || 1) +
                              Math.max((Number(unitGenerationForm.floorCount) || 1) - 1, 0)
                            }${String(
                              Math.max(Number(unitGenerationForm.unitsPerFloor) || 1, 1)
                            ).padStart(2, "0")}`}
                        </Hint>
                      </Field>
                    </Grid>
                  </Subsection>
                  {propertyForm.units.length === 0 ? (
                    <EmptyState>
                      No units have been added yet. Add the first apartment room
                      or suite to activate occupancy tracking.
                    </EmptyState>
                  ) : (
                    propertyForm.units.map((unit, index) => (
                      <Subsection key={unit._id || unit.localId || index}>
                        <Grid>
                          <Field>
                            Building
                            <Select
                              value={unit.buildingId}
                              onChange={(event) =>
                                handleUnitChange(index, "buildingId", event.target.value)
                              }
                            >
                              <option value="">Select building</option>
                              {propertyForm.buildings.map((building) => (
                                <option key={building.id} value={building.id}>
                                  {building.name}
                                </option>
                              ))}
                            </Select>
                          </Field>
                          <Field>
                            Unit Code
                            <Input
                              value={unit.unitCode}
                              onChange={(event) =>
                                handleUnitChange(index, "unitCode", event.target.value)
                              }
                            />
                          </Field>
                          <Field>
                            Unit Name
                            <Input
                              value={unit.unitName}
                              onChange={(event) =>
                                handleUnitChange(index, "unitName", event.target.value)
                              }
                            />
                          </Field>
                          <Field>
                            Floor Label
                            <Input
                              value={unit.floorLabel}
                              onChange={(event) =>
                                handleUnitChange(index, "floorLabel", event.target.value)
                              }
                            />
                          </Field>
                          <Field>
                            Bedrooms
                            <Input
                              type="number"
                              min="0"
                              value={unit.bedrooms}
                              onChange={(event) =>
                                handleUnitChange(index, "bedrooms", event.target.value)
                              }
                            />
                          </Field>
                          <Field>
                            Bathrooms
                            <Input
                              type="number"
                              min="0"
                              value={unit.bathrooms}
                              onChange={(event) =>
                                handleUnitChange(index, "bathrooms", event.target.value)
                              }
                            />
                          </Field>
                          <Field>
                            Size (sqm)
                            <Input
                              type="number"
                              min="0"
                              value={unit.sizeSqm}
                              onChange={(event) =>
                                handleUnitChange(index, "sizeSqm", event.target.value)
                              }
                            />
                          </Field>
                          <Field>
                            Rent
                            <Input
                              type="number"
                              min="0"
                              value={unit.rent}
                              onChange={(event) =>
                                handleUnitChange(index, "rent", event.target.value)
                              }
                            />
                          </Field>
                          <Field>
                            Deposit
                            <Input
                              type="number"
                              min="0"
                              value={unit.deposit}
                              onChange={(event) =>
                                handleUnitChange(index, "deposit", event.target.value)
                              }
                            />
                          </Field>
                          <Field>
                            Unit Status
                            <Select
                              value={unit.status}
                              onChange={(event) =>
                                handleUnitChange(index, "status", event.target.value)
                              }
                            >
                              {UNIT_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                  {formatStatusLabel(status)}
                                </option>
                              ))}
                            </Select>
                          </Field>
                        </Grid>
                        <Field>
                          Preview Features
                          <Textarea
                            value={unit.previewFeaturesText}
                            onChange={(event) =>
                              handleUnitChange(
                                index,
                                "previewFeaturesText",
                                event.target.value
                              )
                            }
                            placeholder="Balcony, Generator backup, Fitted kitchen, Garden view"
                          />
                        </Field>
                        <DangerButton type="button" onClick={() => removeUnitRow(index)}>
                          Remove Unit
                        </DangerButton>
                      </Subsection>
                    ))
                  )}
                </Subsection>
              </>
            )}

            <InlineButtonRow>
              <PrimaryButton type="submit" disabled={saving}>
                {editingPropertyId ? "Update Property" : "Create Property"}
              </PrimaryButton>
              <SecondaryButton type="button" onClick={resetPropertyEditor}>
                Clear Editor
              </SecondaryButton>
            </InlineButtonRow>
          </Form>
        </Card>

        <Card id="portfolio-inventory">
          <SectionHead>
            <div>
              <SectionTitle>Portfolio inventory</SectionTitle>
              <SectionText>
                Review occupancy status, vacancy counts, and fast edit access
                for each managed property.
              </SectionText>
            </div>
          </SectionHead>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Listing</Th>
                  <Th>Category</Th>
                  <Th>Occupancy</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => {
                  const metrics = getUnitMetrics(property);

                  return (
                    <tr key={property._id}>
                      <Td>
                        <div style={{ display: "flex", gap: "0.85rem" }}>
                          <ListingImage src={imageUrl(property.image)} alt={property.name} />
                          <div>
                            <div style={{ color: "#132239", fontWeight: 800 }}>
                              {property.name}
                            </div>
                            <div style={{ color: "#607184", marginTop: "0.35rem" }}>
                              {property.address}
                            </div>
                            <div style={{ color: "#607184", marginTop: "0.35rem" }}>
                              {formatKenyanCurrency(property.price)}
                            </div>
                          </div>
                        </div>
                      </Td>
                      <Td>{property.category}</Td>
                      <Td>
                        {property.category === "Apartment" ? (
                          <UnitSummaryGrid>
                            {[
                              { label: "Vacant", value: metrics.vacant, key: "vacant" },
                              { label: "Reserved", value: metrics.reserved, key: "reserved" },
                              { label: "Occupied", value: metrics.occupied, key: "occupied" },
                              {
                                label: "Maintenance",
                                value: metrics.maintenance,
                                key: "maintenance",
                              },
                            ].map((item) => {
                              const tone = statusTone(item.key);
                              return (
                                <UnitSummaryCard
                                  key={item.key}
                                  style={{
                                    background: tone.background,
                                    color: tone.color,
                                  }}
                                >
                                  {item.label}: {item.value}
                                </UnitSummaryCard>
                              );
                            })}
                          </UnitSummaryGrid>
                        ) : (
                          <StatusPill
                            style={{
                              background: statusTone(property.status).background,
                              color: statusTone(property.status).color,
                            }}
                          >
                            {formatStatusLabel(property.status)}
                          </StatusPill>
                        )}
                      </Td>
                      <Td>
                        <InlineButtonRow>
                          <SecondaryButton
                            type="button"
                            onClick={() => loadPropertyIntoEditor(property)}
                          >
                            Edit
                          </SecondaryButton>
                          <DangerButton
                            type="button"
                            onClick={() => handleDeleteProperty(property)}
                          >
                            Delete
                          </DangerButton>
                        </InlineButtonRow>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </TableWrapper>
        </Card>
      </TwoColumn>
      )}

      {activeWorkspacePanel === "tenants" && (
      <TwoColumn>
        <Card id="tenant-management">
          <SectionHead>
            <div>
              <SectionTitle>Tenant management</SectionTitle>
              <SectionText>
                Add or edit tenants, attach lease details, and manually assign
                rooms while keeping payment status and emergency contacts close
                at hand.
              </SectionText>
            </div>
          </SectionHead>

          <Form onSubmit={handleTenantSubmit}>
            <Grid>
              <Field>
                Full Name
                <Input
                  value={tenantForm.fullName}
                  onChange={(event) =>
                    setTenantForm((current) => ({
                      ...current,
                      fullName: event.target.value,
                    }))
                  }
                  required
                />
              </Field>
              <Field>
                Phone
                <Input
                  value={tenantForm.phone}
                  onChange={(event) =>
                    setTenantForm((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  required
                />
              </Field>
              <Field>
                Email
                <Input
                  type="email"
                  value={tenantForm.email}
                  onChange={(event) =>
                    setTenantForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field>
                National ID / Passport
                <Input
                  value={tenantForm.nationalId}
                  onChange={(event) =>
                    setTenantForm((current) => ({
                      ...current,
                      nationalId: event.target.value,
                    }))
                  }
                  required
                />
              </Field>
              <Field>
                Property
                <Select
                  value={tenantForm.propertyId}
                  onChange={(event) =>
                    setTenantForm((current) => ({
                      ...current,
                      propertyId: event.target.value,
                      unitId: "",
                    }))
                  }
                  required
                >
                  <option value="">Select property</option>
                  {properties.map((property) => (
                    <option key={property._id} value={property._id}>
                      {property.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field>
                Assigned Room / Unit
                <Select
                  value={tenantForm.unitId}
                  onChange={(event) =>
                    setTenantForm((current) => ({
                      ...current,
                      unitId: event.target.value,
                    }))
                  }
                >
                  <option value="">Select unit</option>
                  {tenantUnitOptions.map((unit) => (
                    <option key={unit._id} value={unit._id}>
                      {unit.unitCode} - {unit.unitName}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field>
                Lease Start
                <Input
                  type="date"
                  value={tenantForm.leaseStart}
                  onChange={(event) =>
                    setTenantForm((current) => ({
                      ...current,
                      leaseStart: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field>
                Lease End
                <Input
                  type="date"
                  value={tenantForm.leaseEnd}
                  onChange={(event) =>
                    setTenantForm((current) => ({
                      ...current,
                      leaseEnd: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field>
                Monthly Rent
                <Input
                  type="number"
                  min="0"
                  value={tenantForm.monthlyRent}
                  onChange={(event) =>
                    setTenantForm((current) => ({
                      ...current,
                      monthlyRent: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field>
                Deposit
                <Input
                  type="number"
                  min="0"
                  value={tenantForm.depositAmount}
                  onChange={(event) =>
                    setTenantForm((current) => ({
                      ...current,
                      depositAmount: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field>
                Emergency Contact Name
                <Input
                  value={tenantForm.emergencyContactName}
                  onChange={(event) =>
                    setTenantForm((current) => ({
                      ...current,
                      emergencyContactName: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field>
                Emergency Contact Phone
                <Input
                  value={tenantForm.emergencyContactPhone}
                  onChange={(event) =>
                    setTenantForm((current) => ({
                      ...current,
                      emergencyContactPhone: event.target.value,
                    }))
                  }
                />
              </Field>
            </Grid>
            <Field>
              Notes
              <Textarea
                value={tenantForm.notes}
                onChange={(event) =>
                  setTenantForm((current) => ({
                    ...current,
                    notes: event.target.value,
                  }))
                }
              />
            </Field>
            <InlineButtonRow>
              <PrimaryButton type="submit" disabled={saving}>
                {editingTenantId ? "Update Tenant" : "Create Tenant"}
              </PrimaryButton>
              <SecondaryButton type="button" onClick={resetTenantEditor}>
                Clear Form
              </SecondaryButton>
            </InlineButtonRow>
          </Form>
        </Card>

        <Card id="tenant-records">
          <SectionHead>
            <div>
              <SectionTitle>Tenant records</SectionTitle>
              <SectionText>
                Search, filter, and review lease, unit, and payment status
                details from one searchable tenant register.
              </SectionText>
            </div>
            <SearchInput
              type="search"
              placeholder="Search tenants, units, IDs..."
              value={tenantSearch}
              onChange={(event) => setTenantSearch(event.target.value)}
            />
          </SectionHead>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Tenant</Th>
                  <Th>Lease</Th>
                  <Th>Payment Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.map((tenant) => {
                  const tone = statusTone(tenant.paymentStatus);
                  return (
                    <tr key={tenant._id}>
                      <Td>
                        <div style={{ color: "#132239", fontWeight: 800 }}>
                          {tenant.fullName}
                        </div>
                        <div style={{ color: "#607184", marginTop: "0.35rem" }}>
                          {tenant.phone}
                        </div>
                        <div style={{ color: "#607184", marginTop: "0.35rem" }}>
                          {tenant.nationalId}
                        </div>
                      </Td>
                      <Td>
                        {tenant.propertyName}
                        <br />
                        {tenant.unitCode || tenant.unitName}
                        <br />
                        {tenant.leaseStart
                          ? `${toDateInputValue(tenant.leaseStart)} to ${toDateInputValue(
                              tenant.leaseEnd
                            )}`
                          : "Lease dates not set"}
                      </Td>
                      <Td>
                        <StatusPill
                          style={{
                            background: tone.background,
                            color: tone.color,
                          }}
                        >
                          {formatStatusLabel(tenant.paymentStatus)}
                        </StatusPill>
                        <div style={{ marginTop: "0.45rem" }}>
                          {formatKenyanCurrency(tenant.outstandingBalance || 0)} outstanding
                        </div>
                      </Td>
                      <Td>
                        <InlineButtonRow>
                          <SecondaryButton type="button" onClick={() => loadTenantIntoEditor(tenant)}>
                            Edit
                          </SecondaryButton>
                          <DangerButton type="button" onClick={() => handleDeleteTenant(tenant)}>
                            Delete
                          </DangerButton>
                        </InlineButtonRow>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </TableWrapper>
        </Card>
      </TwoColumn>
      )}

      {(activeWorkspacePanel === "bookings" || activeWorkspacePanel === "payments") && (
      <TwoColumn>
        {activeWorkspacePanel === "bookings" && (
        <Card id="bookings">
          <SectionHead>
            <div>
              <SectionTitle>Booking and reservation system</SectionTitle>
              <SectionText>
                Approve, reject, or convert bookings into checked-in occupancy
                directly from a central booking timeline.
              </SectionText>
            </div>
          </SectionHead>
          <BookingGrid>
            {bookings.length === 0 ? (
              <EmptyState>No bookings have been submitted yet.</EmptyState>
            ) : (
              bookings.map((booking) => {
                const tone = statusTone(booking.status);
                return (
                  <BookingCard key={booking._id}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "1rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div style={{ color: "#132239", fontWeight: 800 }}>
                          {booking.applicantName}
                        </div>
                        <div style={{ color: "#607184", marginTop: "0.35rem" }}>
                          {booking.propertyName} • {booking.unitName || booking.unitCode}
                        </div>
                      </div>
                      <StatusPill
                        style={{
                          background: tone.background,
                          color: tone.color,
                        }}
                      >
                        {formatStatusLabel(booking.status)}
                      </StatusPill>
                    </div>
                    <div style={{ color: "#607184", marginTop: "0.85rem" }}>
                      Preferred move-in:{" "}
                      {booking.preferredMoveIn
                        ? formatKenyanDateTime(booking.preferredMoveIn)
                        : "Not set"}
                    </div>
                    <div style={{ color: "#607184", marginTop: "0.45rem" }}>
                      {booking.phone} {booking.email ? `• ${booking.email}` : ""}
                    </div>
                    <div style={{ color: "#4f6176", marginTop: "0.85rem", lineHeight: 1.7 }}>
                      {booking.message || "No additional booking notes submitted."}
                    </div>
                    <InlineButtonRow style={{ marginTop: "1rem" }}>
                      {BOOKING_STATUSES.filter((status) => status !== booking.status).map(
                        (status) => (
                          <SecondaryButton
                            key={status}
                            type="button"
                            onClick={() => handleBookingStatus(booking, status)}
                          >
                            {formatStatusLabel(status)}
                          </SecondaryButton>
                        )
                      )}
                    </InlineButtonRow>
                  </BookingCard>
                );
              })
            )}
          </BookingGrid>
        </Card>
        )}

        {activeWorkspacePanel === "payments" && (
        <Card id="payments">
          <SectionHead>
            <div>
              <SectionTitle>Payment records and receipts</SectionTitle>
              <SectionText>
                Capture rent payments, verify transaction status, and generate
                branded receipt PDFs for tenants.
              </SectionText>
            </div>
          </SectionHead>
          <Form onSubmit={handlePaymentSubmit}>
            <Grid>
              <Field>
                Tenant
                <Select
                  value={paymentForm.tenantId}
                  onChange={(event) => handlePaymentTenantChange(event.target.value)}
                  required
                >
                  <option value="">Select tenant</option>
                  {tenants.map((tenant) => (
                    <option key={tenant._id} value={tenant._id}>
                      {tenant.fullName} - {tenant.unitCode || tenant.unitName}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field>
                Amount
                <Input
                  type="number"
                  min="0"
                  value={paymentForm.amount}
                  onChange={(event) =>
                    setPaymentForm((current) => ({
                      ...current,
                      amount: event.target.value,
                    }))
                  }
                  required
                />
              </Field>
              <Field>
                Payment Method
                <Select
                  value={paymentForm.method}
                  onChange={(event) =>
                    setPaymentForm((current) => ({
                      ...current,
                      method: event.target.value,
                    }))
                  }
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field>
                Status
                <Select
                  value={paymentForm.status}
                  onChange={(event) =>
                    setPaymentForm((current) => ({
                      ...current,
                      status: event.target.value,
                    }))
                  }
                >
                  {PAYMENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {formatStatusLabel(status)}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field>
                Period Label
                <Input
                  value={paymentForm.periodLabel}
                  onChange={(event) =>
                    setPaymentForm((current) => ({
                      ...current,
                      periodLabel: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field>
                Paid At
                <Input
                  type="datetime-local"
                  value={paymentForm.paidAt}
                  onChange={(event) =>
                    setPaymentForm((current) => ({
                      ...current,
                      paidAt: event.target.value,
                    }))
                  }
                />
              </Field>
            </Grid>
            <Grid>
              <Field>
                Reference
                <Input
                  value={paymentForm.reference}
                  onChange={(event) =>
                    setPaymentForm((current) => ({
                      ...current,
                      reference: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field>
                Tenant Context
                <Hint>
                  {paymentTenant
                    ? `${paymentTenant.propertyName} • ${paymentTenant.unitCode || paymentTenant.unitName}`
                    : "Select a tenant to auto-fill the property and unit context."}
                </Hint>
              </Field>
            </Grid>
            <Field>
              Notes
              <Textarea
                value={paymentForm.notes}
                onChange={(event) =>
                  setPaymentForm((current) => ({
                    ...current,
                    notes: event.target.value,
                  }))
                }
              />
            </Field>
            <PrimaryButton type="submit" disabled={saving}>
              Record Payment
            </PrimaryButton>
          </Form>
        </Card>
        )}
      </TwoColumn>
      )}

      {activeWorkspacePanel === "payments" && (
      <Card>
        <SectionHead>
          <div>
            <SectionTitle>Payment history and arrears</SectionTitle>
            <SectionText>
              Searchable payment records, quick verification actions, and
              downloadable receipt history per tenant.
            </SectionText>
          </div>
        </SectionHead>
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>Receipt</Th>
                <Th>Tenant</Th>
                <Th>Amount</Th>
                <Th>Method</Th>
                <Th>Status</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => {
                const tone = statusTone(payment.status);
                const linkedTenant = tenants.find((tenant) => tenant._id === payment.tenantId);
                return (
                  <tr key={payment._id}>
                    <Td>{payment.receiptNumber}</Td>
                    <Td>
                      {payment.tenantName}
                      <br />
                      <span style={{ color: "#607184" }}>
                        {payment.propertyName} • {payment.unitCode || payment.unitName}
                      </span>
                    </Td>
                    <Td>{formatKenyanCurrency(payment.amount)}</Td>
                    <Td>{formatStatusLabel(payment.method)}</Td>
                    <Td>
                      <StatusPill
                        style={{
                          background: tone.background,
                          color: tone.color,
                        }}
                      >
                        {formatStatusLabel(payment.status)}
                      </StatusPill>
                    </Td>
                    <Td>{formatKenyanDateTime(payment.paidAt || payment.createdAt)}</Td>
                    <Td>
                      <InlineButtonRow>
                        <SecondaryButton
                          type="button"
                          onClick={() => handleQuickPaymentUpdate(payment, "verified")}
                        >
                          Verify
                        </SecondaryButton>
                        <SecondaryButton
                          type="button"
                          onClick={() => handleQuickPaymentUpdate(payment, "arrears")}
                        >
                          Mark Arrears
                        </SecondaryButton>
                        <SecondaryButton
                          type="button"
                          onClick={() =>
                            downloadReceiptPdf({
                              payment,
                              tenant: linkedTenant,
                            })
                          }
                        >
                          Receipt PDF
                        </SecondaryButton>
                      </InlineButtonRow>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </TableWrapper>
      </Card>
      )}

      {activeWorkspacePanel === "complaints" && (
      <Card id="complaints">
        <SectionHead>
          <div>
            <SectionTitle>Complaints and maintenance module</SectionTitle>
            <SectionText>
              Track complaint status, assign action owners, and update resident
              responses from a single service management queue.
            </SectionText>
          </div>
        </SectionHead>
        <ComplaintGrid>
          {complaints.length === 0 ? (
            <EmptyState>No complaints have been submitted yet.</EmptyState>
          ) : (
            complaints.map((complaint) => {
              const draft = complaintDrafts[complaint._id] || makeEmptyComplaintResponse();
              const tone = statusTone(complaint.status);

              return (
                <ComplaintCard key={complaint._id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div style={{ color: "#132239", fontWeight: 800 }}>
                        {complaint.subject}
                      </div>
                      <div style={{ color: "#607184", marginTop: "0.35rem" }}>
                        {complaint.tenantName} • {complaint.propertyName} •{" "}
                        {complaint.unitCode || complaint.unitName}
                      </div>
                    </div>
                    <StatusPill
                      style={{
                        background: tone.background,
                        color: tone.color,
                      }}
                    >
                      {formatStatusLabel(complaint.status)}
                    </StatusPill>
                  </div>
                  <div style={{ color: "#607184", marginTop: "0.85rem" }}>
                    Submitted: {formatKenyanDateTime(complaint.createdAt)} •{" "}
                    {formatStatusLabel(complaint.category)} •{" "}
                    {formatStatusLabel(complaint.priority)}
                  </div>
                  <div style={{ color: "#4f6176", marginTop: "0.85rem", lineHeight: 1.7 }}>
                    {complaint.description}
                  </div>

                  <Grid style={{ marginTop: "1rem" }}>
                    <Field>
                      Status
                      <Select
                        value={draft.status}
                        onChange={(event) =>
                          handleComplaintDraftChange(
                            complaint._id,
                            "status",
                            event.target.value
                          )
                        }
                      >
                        {COMPLAINT_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {formatStatusLabel(status)}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <Field>
                      Assigned To
                      <Input
                        value={draft.assignedTo}
                        onChange={(event) =>
                          handleComplaintDraftChange(
                            complaint._id,
                            "assignedTo",
                            event.target.value
                          )
                        }
                      />
                    </Field>
                  </Grid>

                  <Field style={{ marginTop: "1rem" }}>
                    Response / Progress Update
                    <Textarea
                      value={draft.response}
                      onChange={(event) =>
                        handleComplaintDraftChange(
                          complaint._id,
                          "response",
                          event.target.value
                        )
                      }
                    />
                  </Field>

                  <InlineButtonRow style={{ marginTop: "1rem" }}>
                    <PrimaryButton type="button" onClick={() => handleComplaintSave(complaint)}>
                      Save Progress
                    </PrimaryButton>
                  </InlineButtonRow>
                </ComplaintCard>
              );
            })
          )}
        </ComplaintGrid>
      </Card>
      )}
        </WorkspaceContent>
      </WorkspaceLayout>
    </Page>
  );
}

export default AddProduct;
