import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { HiOutlineHomeModern, HiOutlineMapPin } from "react-icons/hi2";
import {
  createComplaint,
  createResidentPayment,
  getResidentPortal,
} from "../api/rentalApi";
import {
  formatKenyanCurrency,
  formatKenyanDateTime,
} from "../utils/formatters";
import {
  PAYMENT_METHODS,
  formatStatusLabel,
  statusTone,
  toDateInputValue,
  toDateTimeInputValue,
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
  margin-top: 1.35rem;
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

const Layout = styled.div`
  display: grid;
  grid-template-columns: 18rem minmax(0, 1fr);
  gap: 1rem;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SidebarCard = styled.section`
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

const SidebarTitle = styled.div`
  color: #132239;
  font-weight: 800;
`;

const SidebarText = styled.p`
  margin: 0.6rem 0 0;
  color: #5d6f81;
  line-height: 1.7;
`;

const SidebarNav = styled.div`
  display: grid;
  gap: 0.65rem;
  margin-top: 1rem;
`;

const SidebarButton = styled.button`
  text-align: left;
  border-radius: 18px;
  border: 1px solid
    ${({ $active }) => ($active ? "rgba(198, 155, 67, 0.42)" : "rgba(19, 34, 57, 0.08)")};
  background: ${({ $active }) => ($active ? "#fff8ec" : "#f8fafc")};
  padding: 0.95rem 1rem;
  cursor: pointer;
`;

const SidebarButtonTitle = styled.div`
  color: #132239;
  font-weight: 800;
`;

const SidebarButtonText = styled.div`
  margin-top: 0.35rem;
  color: #607184;
  font-size: 0.88rem;
  line-height: 1.6;
`;

const Content = styled.div`
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

const SectionTitle = styled.h2`
  margin: 0;
  color: #132239;
`;

const SectionText = styled.p`
  margin: 0.8rem 0 0;
  color: #5b6c80;
  line-height: 1.75;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1.4rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div`
  border-radius: 24px;
  padding: 1.2rem;
  background: #f8fafc;
  border: 1px solid rgba(19, 34, 57, 0.08);
`;

const SummaryLabel = styled.div`
  color: #5d6f81;
  font-size: 0.9rem;
`;

const SummaryValue = styled.div`
  margin-top: 0.45rem;
  color: #132239;
  font-size: 1.5rem;
  font-weight: 800;
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

const EmptyState = styled.div`
  border-radius: 22px;
  padding: 1rem;
  border: 1px dashed rgba(19, 34, 57, 0.14);
  color: #5d6f81;
  line-height: 1.75;
  margin-top: 1.2rem;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 1.3rem;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.4rem;
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

const SuccessMessage = styled.div`
  border-radius: 18px;
  padding: 0.9rem 1rem;
  background: #e6f9ef;
  color: #0f6a3b;
  font-weight: 700;
`;

function makeResidentPaymentForm() {
  return {
    amount: "",
    method: "mpesa",
    periodLabel: new Date().toLocaleString("en-KE", {
      month: "long",
      year: "numeric",
    }),
    paidAt: toDateTimeInputValue(new Date()),
    reference: "",
    notes: "",
  };
}

function makeComplaintForm(phone = "") {
  return {
    phone,
    category: "maintenance",
    priority: "medium",
    subject: "",
    description: "",
  };
}

const PORTAL_SECTIONS = [
  {
    id: "overview",
    title: "Resident Overview",
    text: "See your linked property, tenant status, and current balance in one place.",
  },
  {
    id: "payments",
    title: "Payment History",
    text: "Review rent records, receipt references, and payment verification status.",
  },
  {
    id: "pay-rent",
    title: "Make Monthly Payment",
    text: "Submit rent payments for admin verification against your current tenant profile.",
  },
  {
    id: "complaints",
    title: "Submit Complaint",
    text: "Send maintenance or billing issues directly to the admin service queue.",
  },
  {
    id: "bookings",
    title: "Booking Requests",
    text: "Track property reservation requests you have already submitted.",
  },
];

function resolvePortalSection(hash = "") {
  const normalizedHash = hash.replace("#", "");
  return PORTAL_SECTIONS.find((section) => section.id === normalizedHash)?.id || "overview";
}

function ResidentPortal() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [submittingComplaint, setSubmittingComplaint] = useState(false);
  const [activeSection, setActiveSection] = useState(resolvePortalSection(location.hash));
  const [portal, setPortal] = useState({
    profile: null,
    tenant: null,
    payments: [],
    complaints: [],
    bookings: [],
  });
  const [paymentForm, setPaymentForm] = useState(makeResidentPaymentForm());
  const [complaintForm, setComplaintForm] = useState(makeComplaintForm());
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const [complaintSuccess, setComplaintSuccess] = useState("");

  const loadPortal = async () => {
    try {
      const response = await getResidentPortal();
      setPortal({
        profile: response.profile || null,
        tenant: response.tenant || null,
        payments: Array.isArray(response.payments) ? response.payments : [],
        complaints: Array.isArray(response.complaints) ? response.complaints : [],
        bookings: Array.isArray(response.bookings) ? response.bookings : [],
      });
      setComplaintForm(
        makeComplaintForm(response.tenant?.phone || response.profile?.phone || "")
      );
    } catch (error) {
      console.error("Failed to load resident portal:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortal();
  }, []);

  useEffect(() => {
    setActiveSection(resolvePortalSection(location.hash));
  }, [location.hash]);

  const linkedPropertyLabel = useMemo(() => {
    if (!portal.tenant) {
      return "No tenant profile linked yet";
    }

    return `${portal.tenant.propertyName} - ${
      portal.tenant.unitCode || portal.tenant.unitName || "Assigned unit"
    }`;
  }, [portal.tenant]);

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    setSubmittingPayment(true);

    try {
      await createResidentPayment({
        ...paymentForm,
        amount: Number(paymentForm.amount) || 0,
        paidAt: paymentForm.paidAt
          ? new Date(paymentForm.paidAt).toISOString()
          : new Date().toISOString(),
      });
      setPaymentSuccess("Payment submitted successfully. Admin verification is now pending.");
      setPaymentForm(makeResidentPaymentForm());
      await loadPortal();
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handleComplaintSubmit = async (event) => {
    event.preventDefault();
    setSubmittingComplaint(true);

    try {
      await createComplaint(complaintForm);
      setComplaintSuccess("Complaint submitted successfully. The admin team can now track it.");
      setComplaintForm(makeComplaintForm(portal.tenant?.phone || ""));
      await loadPortal();
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmittingComplaint(false);
    }
  };

  if (loading) {
    return <Page>Loading resident portal...</Page>;
  }

  return (
    <Page>
      <Hero>
        <Eyebrow>
          <HiOutlineHomeModern />
          Resident Service Portal
        </Eyebrow>
        <Title>Manage your rental activity without the admin clutter</Title>
        <Description>
          View your linked property, track payment history, submit complaints,
          and manage resident actions from a focused workspace designed for tenants.
        </Description>
        <HeroActions>
          <HeroLink to="/property">Browse Availability</HeroLink>
          <HeroLink to="/property">Book A Property</HeroLink>
        </HeroActions>
      </Hero>

      <Layout>
        <Sidebar>
          <SidebarCard>
            <SidebarTitle>Resident Tools</SidebarTitle>
            <SidebarText>
              Open one service area at a time so payments, complaints, and booking
              records stay easy to manage.
            </SidebarText>
            <SidebarNav>
              {PORTAL_SECTIONS.map((section) => (
                <SidebarButton
                  key={section.id}
                  type="button"
                  $active={activeSection === section.id}
                  onClick={() => setActiveSection(section.id)}
                >
                  <SidebarButtonTitle>{section.title}</SidebarButtonTitle>
                  <SidebarButtonText>{section.text}</SidebarButtonText>
                </SidebarButton>
              ))}
            </SidebarNav>
          </SidebarCard>
        </Sidebar>

        <Content>
          {activeSection === "overview" && (
            <Card>
              <SectionTitle>Resident overview</SectionTitle>
              <SectionText>
                Your current property relationship, rent exposure, and quick service
                context appear here.
              </SectionText>
              <MetaRow>
                <MetaPill>
                  <HiOutlineMapPin />
                  {linkedPropertyLabel}
                </MetaPill>
                {portal.tenant?.leaseStart && (
                  <MetaPill>
                    Lease: {toDateInputValue(portal.tenant.leaseStart)} to{" "}
                    {toDateInputValue(portal.tenant.leaseEnd) || "Open ended"}
                  </MetaPill>
                )}
              </MetaRow>
              <SummaryGrid>
                <SummaryCard>
                  <SummaryLabel>Monthly Rent</SummaryLabel>
                  <SummaryValue>
                    {formatKenyanCurrency(portal.tenant?.monthlyRent || 0)}
                  </SummaryValue>
                </SummaryCard>
                <SummaryCard>
                  <SummaryLabel>Outstanding Balance</SummaryLabel>
                  <SummaryValue>
                    {formatKenyanCurrency(portal.tenant?.outstandingBalance || 0)}
                  </SummaryValue>
                </SummaryCard>
                <SummaryCard>
                  <SummaryLabel>Payment Status</SummaryLabel>
                  <SummaryValue>
                    {formatStatusLabel(portal.tenant?.paymentStatus || "upcoming")}
                  </SummaryValue>
                </SummaryCard>
              </SummaryGrid>
              {!portal.tenant && (
                <EmptyState>
                  No tenant profile is linked to your account email yet. Ask the admin
                  to add your email to the tenant record so monthly rent payments and
                  complaint submission can connect to the right property.
                </EmptyState>
              )}
            </Card>
          )}

          {activeSection === "payments" && (
            <Card>
              <SectionTitle>Payment history</SectionTitle>
              <SectionText>
                Review every rent submission and see whether admin verification is
                still pending or already complete.
              </SectionText>
              {portal.payments.length === 0 ? (
                <EmptyState>No rent payments have been recorded for your account yet.</EmptyState>
              ) : (
                <TableWrapper>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Receipt</Th>
                        <Th>Period</Th>
                        <Th>Amount</Th>
                        <Th>Method</Th>
                        <Th>Status</Th>
                        <Th>Date</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {portal.payments.map((payment) => {
                        const tone = statusTone(payment.status);

                        return (
                          <tr key={payment._id}>
                            <Td>{payment.receiptNumber}</Td>
                            <Td>{payment.periodLabel || "Not specified"}</Td>
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
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </TableWrapper>
              )}
            </Card>
          )}

          {activeSection === "pay-rent" && (
            <Card>
              <SectionTitle>Make monthly payment</SectionTitle>
              <SectionText>
                Submit your rent payment for admin verification against your current
                tenant record and assigned property.
              </SectionText>
              {paymentSuccess && <SuccessMessage>{paymentSuccess}</SuccessMessage>}
              {!portal.tenant ? (
                <EmptyState>
                  You need a linked tenant profile before you can submit monthly rent
                  payments from the portal.
                </EmptyState>
              ) : (
                <Form onSubmit={handlePaymentSubmit}>
                  <Grid>
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
                        placeholder="M-Pesa code, bank ref, or receipt number"
                      />
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
                      placeholder="Add any helpful context for the admin finance team."
                    />
                  </Field>
                  <PrimaryButton type="submit" disabled={submittingPayment}>
                    Submit Payment
                  </PrimaryButton>
                </Form>
              )}
            </Card>
          )}

          {activeSection === "complaints" && (
            <Card>
              <SectionTitle>Submit complaint</SectionTitle>
              <SectionText>
                Send maintenance, billing, security, or service issues to the admin
                queue without leaving your resident workspace.
              </SectionText>
              {complaintSuccess && <SuccessMessage>{complaintSuccess}</SuccessMessage>}
              {!portal.tenant ? (
                <EmptyState>
                  Complaints are linked to a tenant property record. Ask an admin to
                  connect your account email to your tenant profile first.
                </EmptyState>
              ) : (
                <Form onSubmit={handleComplaintSubmit}>
                  <Grid>
                    <Field>
                      Phone
                      <Input
                        value={complaintForm.phone}
                        onChange={(event) =>
                          setComplaintForm((current) => ({
                            ...current,
                            phone: event.target.value,
                          }))
                        }
                        required
                      />
                    </Field>
                    <Field>
                      Category
                      <Select
                        value={complaintForm.category}
                        onChange={(event) =>
                          setComplaintForm((current) => ({
                            ...current,
                            category: event.target.value,
                          }))
                        }
                      >
                        <option value="maintenance">Maintenance</option>
                        <option value="billing">Billing</option>
                        <option value="security">Security</option>
                        <option value="noise">Noise</option>
                        <option value="other">Other</option>
                      </Select>
                    </Field>
                    <Field>
                      Priority
                      <Select
                        value={complaintForm.priority}
                        onChange={(event) =>
                          setComplaintForm((current) => ({
                            ...current,
                            priority: event.target.value,
                          }))
                        }
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </Select>
                    </Field>
                    <Field>
                      Subject
                      <Input
                        value={complaintForm.subject}
                        onChange={(event) =>
                          setComplaintForm((current) => ({
                            ...current,
                            subject: event.target.value,
                          }))
                        }
                        required
                      />
                    </Field>
                  </Grid>
                  <Field>
                    Description
                    <Textarea
                      value={complaintForm.description}
                      onChange={(event) =>
                        setComplaintForm((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      placeholder="Describe the issue, urgency, and any access notes."
                      required
                    />
                  </Field>
                  <PrimaryButton type="submit" disabled={submittingComplaint}>
                    Submit Complaint
                  </PrimaryButton>
                </Form>
              )}

              {portal.complaints.length > 0 && (
                <>
                  <SectionTitle style={{ marginTop: "2rem" }}>Complaint history</SectionTitle>
                  <TableWrapper>
                    <Table>
                      <thead>
                        <tr>
                          <Th>Subject</Th>
                          <Th>Property</Th>
                          <Th>Status</Th>
                          <Th>Submitted</Th>
                        </tr>
                      </thead>
                      <tbody>
                        {portal.complaints.map((complaint) => {
                          const tone = statusTone(complaint.status);

                          return (
                            <tr key={complaint._id}>
                              <Td>{complaint.subject}</Td>
                              <Td>
                                {complaint.propertyName}
                                <br />
                                <span style={{ color: "#607184" }}>
                                  {complaint.unitCode || complaint.unitName}
                                </span>
                              </Td>
                              <Td>
                                <StatusPill
                                  style={{
                                    background: tone.background,
                                    color: tone.color,
                                  }}
                                >
                                  {formatStatusLabel(complaint.status)}
                                </StatusPill>
                              </Td>
                              <Td>{formatKenyanDateTime(complaint.createdAt)}</Td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </TableWrapper>
                </>
              )}
            </Card>
          )}

          {activeSection === "bookings" && (
            <Card>
              <SectionTitle>Booking requests</SectionTitle>
              <SectionText>
                Review your reservation requests and their current approval status,
                then browse new availability when you need another option.
              </SectionText>
              <HeroActions style={{ marginTop: "1rem" }}>
                <HeroLink to="/property">Browse Properties</HeroLink>
              </HeroActions>
              {portal.bookings.length === 0 ? (
                <EmptyState>
                  You have not submitted any booking requests yet. Browse the property
                  catalogue to request a room or unit.
                </EmptyState>
              ) : (
                <TableWrapper>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Property</Th>
                        <Th>Move In</Th>
                        <Th>Duration</Th>
                        <Th>Status</Th>
                        <Th>Submitted</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {portal.bookings.map((booking) => {
                        const tone = statusTone(booking.status);

                        return (
                          <tr key={booking._id}>
                            <Td>
                              {booking.propertyName}
                              <br />
                              <span style={{ color: "#607184" }}>
                                {booking.unitCode || booking.unitName || "General request"}
                              </span>
                            </Td>
                            <Td>
                              {booking.preferredMoveIn
                                ? toDateInputValue(booking.preferredMoveIn)
                                : "Not set"}
                            </Td>
                            <Td>{booking.durationMonths || 1} month(s)</Td>
                            <Td>
                              <StatusPill
                                style={{
                                  background: tone.background,
                                  color: tone.color,
                                }}
                              >
                                {formatStatusLabel(booking.status)}
                              </StatusPill>
                            </Td>
                            <Td>{formatKenyanDateTime(booking.createdAt)}</Td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </TableWrapper>
              )}
            </Card>
          )}
        </Content>
      </Layout>
    </Page>
  );
}

export default ResidentPortal;
