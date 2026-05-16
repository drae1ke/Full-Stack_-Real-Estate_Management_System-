import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineArrowLeft,
  HiOutlineHomeModern,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineWrenchScrewdriver,
} from "react-icons/hi2";
import UserContext from "../context/UserContext";
import { getById } from "../api/propertyApi";
import { createBooking } from "../api/rentalApi";
import { imageUrl } from "../api/client";
import { formatKenyanCurrency } from "../utils/formatters";
import {
  formatStatusLabel,
  getUnitMetrics,
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
  border-radius: 32px;
  overflow: hidden;
  background: white;
  border: 1px solid rgba(19, 34, 57, 0.08);
  box-shadow: 0 24px 60px rgba(11, 26, 46, 0.08);
`;

const HeroImage = styled.img`
  width: 100%;
  height: min(30rem, 45vw);
  min-height: 18rem;
  object-fit: cover;
`;

const HeroBody = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 1.5rem;
  padding: 1.8rem;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: #49607a;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  margin: 0;
  color: #132239;
  font-size: clamp(2rem, 4vw, 3.2rem);
`;

const Description = styled.p`
  margin: 1rem 0 0;
  color: #5b6c80;
  line-height: 1.8;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: 1rem;
`;

const MetaPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border-radius: 999px;
  padding: 0.7rem 0.95rem;
  background: #f6f8fb;
  color: #17345e;
  font-weight: 700;
`;

const SideCard = styled.div`
  border-radius: 28px;
  padding: 1.4rem;
  background:
    radial-gradient(circle at top right, rgba(212, 184, 118, 0.18), transparent 36%),
    linear-gradient(135deg, #132239 0%, #1d3150 100%);
  color: white;
`;

const SideTitle = styled.div`
  font-size: 1.15rem;
  font-weight: 800;
`;

const SideText = styled.p`
  color: rgba(236, 243, 251, 0.76);
  line-height: 1.75;
`;

const KeyFigureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
`;

const KeyFigure = styled.div`
  border-radius: 22px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.08);
`;

const KeyLabel = styled.div`
  color: rgba(237, 243, 251, 0.72);
  font-size: 0.85rem;
`;

const KeyValue = styled.div`
  margin-top: 0.35rem;
  font-size: 1.25rem;
  font-weight: 800;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 1.5rem;

  @media (max-width: 1040px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.section`
  border-radius: 30px;
  padding: 1.6rem;
  background: white;
  border: 1px solid rgba(19, 34, 57, 0.08);
  box-shadow: 0 22px 55px rgba(11, 26, 46, 0.08);
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: #132239;
`;

const SectionText = styled.p`
  margin: 0.75rem 0 0;
  color: #5d6f81;
  line-height: 1.75;
`;

const UnitGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1.4rem;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const UnitCard = styled.button`
  text-align: left;
  border: 1px solid ${({ $selected }) => ($selected ? "#c69b43" : "rgba(19, 34, 57, 0.08)")};
  background: ${({ $selected }) => ($selected ? "#fff8ec" : "#f8fafc")};
  border-radius: 24px;
  padding: 1.15rem;
  cursor: pointer;
`;

const UnitHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: start;
`;

const UnitName = styled.h3`
  margin: 0;
  color: #142239;
  font-size: 1.1rem;
`;

const StatusPill = styled.div`
  border-radius: 999px;
  padding: 0.45rem 0.75rem;
  font-weight: 800;
  font-size: 0.78rem;
`;

const UnitMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.8rem;
`;

const UnitMetric = styled.div`
  border-radius: 999px;
  padding: 0.42rem 0.7rem;
  background: white;
  color: #4e6278;
  font-size: 0.83rem;
  border: 1px solid rgba(19, 34, 57, 0.08);
`;

const Features = styled.div`
  margin-top: 0.9rem;
  color: #5d6f81;
  line-height: 1.7;
  font-size: 0.95rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.4rem;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;

  @media (max-width: 680px) {
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
  min-height: 8.6rem;
  border-radius: 18px;
  border: 1px solid rgba(19, 34, 57, 0.1);
  padding: 0.9rem;
  background: #f8fafc;
  color: #142239;
  resize: vertical;
`;

const SubmitButton = styled.button`
  min-height: 3.2rem;
  border: none;
  border-radius: 18px;
  background: linear-gradient(135deg, #132239, #27446a);
  color: white;
  font-weight: 800;
  cursor: pointer;
`;

const Hint = styled.div`
  color: #5b6c80;
  line-height: 1.7;
`;

const SuccessMessage = styled.div`
  border-radius: 18px;
  padding: 0.9rem 1rem;
  background: #e6f9ef;
  color: #0f6a3b;
  font-weight: 700;
`;

const ActionNotice = styled.div`
  margin-top: 1.3rem;
  border-radius: 22px;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid rgba(19, 34, 57, 0.08);
  color: #5d6f81;
  line-height: 1.75;
`;

function makeBookingForm(user) {
  return {
    applicantName: user?.name || "",
    email: user?.email || "",
    phone: "",
    preferredMoveIn: toDateInputValue(new Date()),
    durationMonths: 12,
    message: "",
  };
}

function ProductDetail() {
  const [property, setProperty] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [bookingForm, setBookingForm] = useState({});
  const [bookingSuccess, setBookingSuccess] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const isAdmin = user?.role === "admin";
  const isResident = user?.role === "user";
  const isVisitor = !user || user?.role === "visitor";

  useEffect(() => {
    setBookingForm(makeBookingForm(user));
  }, [user]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await getById(id);
        if (!response?._id) {
          navigate("*");
          return;
        }

        setProperty(response);
        const firstVacantUnit = response.units?.find((unit) => unit.status === "vacant");
        setSelectedUnitId(firstVacantUnit?._id || response.units?.[0]?._id || "");
      } catch (error) {
        console.error("Failed to fetch property:", error);
        navigate("*");
      }
    };

    fetchProperty();
  }, [id, navigate]);

  const selectedUnit = useMemo(
    () => property?.units?.find((unit) => unit._id === selectedUnitId),
    [property?.units, selectedUnitId]
  );

  const unitMetrics = useMemo(() => getUnitMetrics(property || {}), [property]);

  const handleBookingSubmit = async (event) => {
    event.preventDefault();

    if (!isResident) {
      alert("Only resident accounts can submit booking requests.");
      return;
    }

    try {
      await createBooking({
        propertyId: property._id,
        unitId: selectedUnit?._id || "",
        phone: bookingForm.phone,
        preferredMoveIn: bookingForm.preferredMoveIn,
        durationMonths: bookingForm.durationMonths,
        message: bookingForm.message,
      });

      setBookingSuccess("Reservation request submitted successfully. The property team can now approve or reject it from the admin workspace.");
      setBookingForm(makeBookingForm(user));
    } catch (error) {
      alert(error.message);
    }
  };

  if (!property) {
    return <Page>Loading property details...</Page>;
  }

  return (
    <Page>
      <Hero>
        <HeroImage src={imageUrl(property.image)} alt={property.name} />
        <HeroBody>
          <div>
            <BackLink to="/property">
              <HiOutlineArrowLeft />
              Back to availability
            </BackLink>
            <Title>{property.name}</Title>
            <Description>{property.description}</Description>
            <MetaRow>
              <MetaPill>
                <HiOutlineMapPin />
                {property.address}
              </MetaPill>
              <MetaPill>
                <HiOutlineHomeModern />
                {property.category}
              </MetaPill>
              <MetaPill>
                <HiOutlinePhone />
                {property.contactPhone || "Contact details available on request"}
              </MetaPill>
            </MetaRow>
          </div>

          <SideCard>
            <SideTitle>Booking Snapshot</SideTitle>
            <SideText>
              Review room availability, choose the right unit, and submit a
              polished reservation request for approval.
            </SideText>
            <KeyFigureGrid>
              <KeyFigure>
                <KeyLabel>Starting Rent</KeyLabel>
                <KeyValue>{formatKenyanCurrency(property.price)}</KeyValue>
              </KeyFigure>
              <KeyFigure>
                <KeyLabel>Vacant Units</KeyLabel>
                <KeyValue>{unitMetrics.vacant}</KeyValue>
              </KeyFigure>
              <KeyFigure>
                <KeyLabel>Reserved</KeyLabel>
                <KeyValue>{unitMetrics.reserved}</KeyValue>
              </KeyFigure>
              <KeyFigure>
                <KeyLabel>Occupied</KeyLabel>
                <KeyValue>{unitMetrics.occupied}</KeyValue>
              </KeyFigure>
            </KeyFigureGrid>
          </SideCard>
        </HeroBody>
      </Hero>

      <ContentGrid>
        <Section>
          <SectionTitle>Room and unit availability</SectionTitle>
          <SectionText>
            Every unit is presented with its live occupancy status so prospects
            can distinguish what is available now from what is already reserved
            or occupied.
          </SectionText>

          {property.units?.length ? (
            <UnitGrid>
              {property.units.map((unit) => {
                const tone = statusTone(unit.status);
                return (
                  <UnitCard
                    type="button"
                    key={unit._id}
                    $selected={selectedUnitId === unit._id}
                    onClick={() => setSelectedUnitId(unit._id)}
                  >
                    <UnitHeader>
                      <div>
                        <UnitName>{unit.unitName || unit.unitCode}</UnitName>
                        <div style={{ color: "#607184", marginTop: "0.35rem" }}>
                          {unit.unitCode} {unit.floorLabel ? `• ${unit.floorLabel}` : ""}
                        </div>
                      </div>
                      <StatusPill
                        style={{
                          background: tone.background,
                          color: tone.color,
                        }}
                      >
                        {formatStatusLabel(unit.status)}
                      </StatusPill>
                    </UnitHeader>
                    <UnitMeta>
                      <UnitMetric>{formatKenyanCurrency(unit.rent || property.price)}</UnitMetric>
                      {unit.bedrooms > 0 && <UnitMetric>{unit.bedrooms} bed</UnitMetric>}
                      {unit.bathrooms > 0 && <UnitMetric>{unit.bathrooms} bath</UnitMetric>}
                      {unit.sizeSqm > 0 && <UnitMetric>{unit.sizeSqm} sqm</UnitMetric>}
                    </UnitMeta>
                    <Features>
                      {(unit.previewFeatures || []).length
                        ? unit.previewFeatures.join(", ")
                        : "Professional unit preview details will appear here as the admin adds them."}
                    </Features>
                  </UnitCard>
                );
              })}
            </UnitGrid>
          ) : (
            <Hint>
              This listing does not yet have individual apartment units attached,
              but you can still contact the property team and request a guided
              booking.
            </Hint>
          )}
        </Section>

        <Section>
          <SectionTitle>Reserve a room or unit</SectionTitle>
          <SectionText>
            Submit a corporate-style reservation request with your preferred
            move-in timeline. The admin team can review, approve, or reject the
            booking from the central operations dashboard.
          </SectionText>
          {isResident ? (
            <>
              {bookingSuccess && <SuccessMessage>{bookingSuccess}</SuccessMessage>}
              <Form onSubmit={handleBookingSubmit}>
                <InputGrid>
                  <Field>
                    Full Name
                    <Input value={bookingForm.applicantName || ""} readOnly />
                  </Field>
                  <Field>
                    Email
                    <Input type="email" value={bookingForm.email || ""} readOnly />
                  </Field>
                  <Field>
                    Phone Number
                    <Input
                      value={bookingForm.phone || ""}
                      onChange={(event) =>
                        setBookingForm((current) => ({
                          ...current,
                          phone: event.target.value,
                        }))
                      }
                      required
                    />
                  </Field>
                  <Field>
                    Preferred Move-in
                    <Input
                      type="date"
                      value={bookingForm.preferredMoveIn || ""}
                      onChange={(event) =>
                        setBookingForm((current) => ({
                          ...current,
                          preferredMoveIn: event.target.value,
                        }))
                      }
                      required
                    />
                  </Field>
                  <Field>
                    Reservation Length (Months)
                    <Input
                      type="number"
                      min="1"
                      value={bookingForm.durationMonths || 1}
                      onChange={(event) =>
                        setBookingForm((current) => ({
                          ...current,
                          durationMonths: event.target.value,
                        }))
                      }
                      required
                    />
                  </Field>
                  <Field>
                    Selected Unit
                    <Select
                      value={selectedUnitId || ""}
                      onChange={(event) => setSelectedUnitId(event.target.value)}
                    >
                      {property.units?.length ? (
                        property.units.map((unit) => (
                          <option key={unit._id} value={unit._id}>
                            {unit.unitCode} - {unit.unitName} ({formatStatusLabel(unit.status)})
                          </option>
                        ))
                      ) : (
                        <option value="">General property request</option>
                      )}
                    </Select>
                  </Field>
                </InputGrid>
                <Field>
                  Booking Notes
                  <Textarea
                    value={bookingForm.message || ""}
                    onChange={(event) =>
                      setBookingForm((current) => ({
                        ...current,
                        message: event.target.value,
                      }))
                    }
                    placeholder="Share occupancy dates, company requirements, furnishing preferences, or any special notes."
                  />
                </Field>
                <SubmitButton type="submit">Submit Reservation Request</SubmitButton>
              </Form>
            </>
          ) : (
            <ActionNotice>
              {isAdmin
                ? "Admin accounts can review property details and complaint activity, but they cannot book or rent space from the resident-facing experience."
                : "Sign in with a resident account to submit a booking request for this property."}
            </ActionNotice>
          )}
        </Section>
      </ContentGrid>

      <Section>
        <SectionTitle>
          <HiOutlineWrenchScrewdriver style={{ marginRight: "0.45rem" }} />
          Resident support and complaint routing
        </SectionTitle>
        <SectionText>
          Complaint handling now follows role-based access. Residents submit
          issues from the resident portal, while admins review and respond from
          the operations complaint queue.
        </SectionText>
        {isResident && (
          <SubmitButton as={Link} to="/resident#complaints">
            Open Resident Complaint Portal
          </SubmitButton>
        )}
        {isAdmin && (
          <SubmitButton as={Link} to="/admin/operations#complaints">
            Open Admin Complaint Queue
          </SubmitButton>
        )}
        {isVisitor && (
          <SubmitButton as={Link} to="/login">
            Sign In For Resident Services
          </SubmitButton>
        )}
      </Section>
    </Page>
  );
}

export default ProductDetail;
