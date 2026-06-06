import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { HiOutlineHomeModern, HiOutlineMapPin, HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import {
  createComplaint,
  createResidentPayment,
  getResidentPortal,
  residentInitiateSTKPush,
} from "../api/rentalApi";
import { formatKenyanCurrency, formatKenyanDateTime } from "../utils/formatters";
import {
  PAYMENT_METHODS,
  formatStatusLabel,
  statusTone,
  toDateInputValue,
  toDateTimeInputValue,
  downloadReceiptPdf,
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
  @media (max-width: 980px) { grid-template-columns: 1fr; }
`;

const Sidebar = styled.aside`display: flex; flex-direction: column; gap: 1rem;`;

const SidebarCard = styled.section`
  position: sticky;
  top: 6.2rem;
  border-radius: 28px;
  padding: 1rem;
  background: white;
  border: 1px solid rgba(19, 34, 57, 0.08);
  box-shadow: 0 22px 55px rgba(11, 26, 46, 0.08);
  @media (max-width: 980px) { position: static; }
`;

const SidebarTitle = styled.div`color: #132239; font-weight: 800;`;
const SidebarText = styled.p`margin: 0.6rem 0 0; color: #5d6f81; line-height: 1.7;`;
const SidebarNav = styled.div`display: grid; gap: 0.65rem; margin-top: 1rem;`;

const SidebarButton = styled.button`
  text-align: left;
  border-radius: 18px;
  border: 1px solid ${({ $active }) => ($active ? "rgba(198, 155, 67, 0.42)" : "rgba(19, 34, 57, 0.08)")};
  background: ${({ $active }) => ($active ? "#fff8ec" : "#f8fafc")};
  padding: 0.95rem 1rem;
  cursor: pointer;
`;

const SidebarButtonTitle = styled.div`color: #132239; font-weight: 800;`;
const SidebarButtonText = styled.div`margin-top: 0.35rem; color: #607184; font-size: 0.88rem; line-height: 1.6;`;

const Content = styled.div`display: flex; flex-direction: column; gap: 1rem;`;

const Card = styled.section`
  border-radius: 28px;
  padding: 1.5rem;
  background: white;
  border: 1px solid rgba(19, 34, 57, 0.08);
  box-shadow: 0 22px 55px rgba(11, 26, 46, 0.08);
`;

const SectionTitle = styled.h2`margin: 0; color: #132239;`;
const SectionText = styled.p`margin: 0.8rem 0 0; color: #5b6c80; line-height: 1.75;`;

const BalanceStrip = styled.div`
  margin-top: 1.4rem;
  border-radius: 24px;
  padding: 1.4rem;
  background: radial-gradient(circle at top right, rgba(212, 184, 118, 0.2), transparent 36%),
    linear-gradient(135deg, #132239 0%, #203654 100%);
  color: white;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  @media (max-width: 760px) { grid-template-columns: 1fr; }
`;

const BalanceItem = styled.div`border-radius: 18px; padding: 1rem; background: rgba(255,255,255,0.08);`;
const BalanceLabel = styled.div`color: rgba(237,243,251,0.72); font-size: 0.85rem;`;
const BalanceValue = styled.div`margin-top: 0.35rem; font-size: 1.5rem; font-weight: 800;`;
const BalanceSubtext = styled.div`margin-top: 0.25rem; color: rgba(237,243,251,0.6); font-size: 0.82rem;`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1.4rem;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const SummaryCard = styled.div`
  border-radius: 24px; padding: 1.2rem; background: #f8fafc;
  border: 1px solid rgba(19, 34, 57, 0.08);
`;

const SummaryLabel = styled.div`color: #5d6f81; font-size: 0.9rem;`;
const SummaryValue = styled.div`margin-top: 0.45rem; color: #132239; font-size: 1.5rem; font-weight: 800;`;

const MetaRow = styled.div`display: flex; flex-wrap: wrap; gap: 0.7rem; margin-top: 1rem;`;
const MetaPill = styled.div`
  display: inline-flex; align-items: center; gap: 0.45rem;
  border-radius: 999px; padding: 0.7rem 0.95rem;
  background: #f6f8fb; color: #17345e; font-weight: 700;
`;

const EmptyState = styled.div`
  border-radius: 22px; padding: 1rem;
  border: 1px dashed rgba(19,34,57,0.14); color: #5d6f81; line-height: 1.75; margin-top: 1.2rem;
`;

const TableWrapper = styled.div`overflow-x: auto; margin-top: 1.3rem;`;
const Table = styled.table`width: 100%; border-collapse: collapse;`;
const Th = styled.th`padding: 0.9rem; text-align: left; color: #17345e; background: #f3f7fb; font-size: 0.88rem;`;
const Td = styled.td`padding: 0.9rem; border-top: 1px solid rgba(19,34,57,0.08); color: #304256; vertical-align: top;`;
const StatusPill = styled.div`width: fit-content; border-radius: 999px; padding: 0.45rem 0.72rem; font-size: 0.8rem; font-weight: 800;`;

const Form = styled.form`display: flex; flex-direction: column; gap: 1rem; margin-top: 1.4rem;`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $columns = 2 }) => $columns}, minmax(0, 1fr));
  gap: 0.9rem;
  @media (max-width: 740px) { grid-template-columns: 1fr; }
`;

const Field = styled.label`display: flex; flex-direction: column; gap: 0.45rem; color: #35465a; font-weight: 700; font-size: 0.92rem;`;

const inputBase = `
  min-height: 3rem; border-radius: 16px;
  border: 1px solid rgba(19,34,57,0.1); padding: 0 0.9rem;
  background: #f8fafc; color: #142239;
`;
const Input = styled.input`${inputBase}`;
const Select = styled.select`${inputBase}`;
const Textarea = styled.textarea`
  min-height: 8rem; border-radius: 18px;
  border: 1px solid rgba(19,34,57,0.1); padding: 0.9rem;
  background: #f8fafc; color: #142239; resize: vertical;
`;

const PrimaryButton = styled.button`
  min-height: 3rem; padding: 0 1.2rem; border-radius: 16px; border: none;
  background: linear-gradient(135deg, #132239, #27446a);
  color: white; font-weight: 800; cursor: pointer;
  display: inline-flex; align-items: center; gap: 0.5rem;
  &:disabled { opacity: 0.6; }
`;

const GreenButton = styled(PrimaryButton)`
  background: linear-gradient(135deg, #0f6a3b, #1a8a50);
`;

const SecondaryButton = styled.button`
  min-height: 2.4rem; padding: 0 0.9rem; border-radius: 12px;
  border: 1px solid rgba(19,34,57,0.12); background: #f8fafc;
  color: #17345e; font-weight: 700; cursor: pointer; font-size: 0.85rem;
`;

const SuccessMessage = styled.div`
  border-radius: 18px; padding: 0.9rem 1rem;
  background: #e6f9ef; color: #0f6a3b; font-weight: 700;
`;

const ErrorMessage = styled.div`
  border-radius: 18px; padding: 0.9rem 1rem;
  background: #fde5e5; color: #af2d2d; font-weight: 700;
`;

const Divider = styled.div`height: 1px; background: rgba(19,34,57,0.08); margin: 1.2rem 0;`;

const TabRow = styled.div`display: flex; gap: 0.5rem; margin-bottom: 1.2rem; flex-wrap: wrap;`;
const Tab = styled.button`
  padding: 0.55rem 1rem; border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? "#c69b43" : "rgba(19,34,57,0.12)")};
  background: ${({ $active }) => ($active ? "#fff8ec" : "#f8fafc")};
  color: ${({ $active }) => ($active ? "#7a5f1a" : "#304256")};
  font-weight: 700; cursor: pointer; font-size: 0.88rem;
  display: inline-flex; align-items: center; gap: 0.4rem;
`;

const PORTAL_SECTIONS = [
  { id: "overview",   title: "Resident Overview", text: "Property, balance, and next due date." },
  { id: "payments",   title: "Payment History",   text: "All rent records and receipt downloads." },
  { id: "pay-rent",   title: "Pay Rent",          text: "M-Pesa STK Push or manual submission." },
  { id: "complaints", title: "Submit Complaint",  text: "Send maintenance or billing issues." },
  { id: "bookings",   title: "Booking Requests",  text: "Track your reservation requests." },
];

function resolvePortalSection(hash = "") {
  const id = hash.replace("#", "");
  return PORTAL_SECTIONS.find((s) => s.id === id)?.id || "overview";
}

function formatNextDue(date) {
  if (!date) return "Not set";
  return new Date(date).toLocaleDateString("en-KE", {
    day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Nairobi",
  });
}

function makeSTKForm(tenant) {
  return { phone: tenant?.phone || "", amount: tenant?.monthlyRent || "", periodLabel: new Date().toLocaleString("en-KE", { month: "long", year: "numeric" }) };
}

function makeManualForm(tenant) {
  return { amount: tenant?.monthlyRent || "", method: "mpesa", periodLabel: new Date().toLocaleString("en-KE", { month: "long", year: "numeric" }), paidAt: toDateTimeInputValue(new Date()), reference: "", notes: "" };
}

function makeComplaintForm(phone = "") {
  return { phone, category: "maintenance", priority: "medium", subject: "", description: "" };
}

function ResidentPortal() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(resolvePortalSection(location.hash));
  const [payTab, setPayTab] = useState("stk");
  const [portal, setPortal] = useState({ profile: null, tenant: null, payments: [], complaints: [], bookings: [] });
  const [stkForm, setSTKForm] = useState(makeSTKForm(null));
  const [manualForm, setManualForm] = useState(makeManualForm(null));
  const [complaintForm, setComplaintForm] = useState(makeComplaintForm());
  const [stkStatus, setSTKStatus] = useState({ success: "", error: "", busy: false });
  const [manualStatus, setManualStatus] = useState({ success: "", error: "", busy: false });
  const [complaintSuccess, setComplaintSuccess] = useState("");

  const loadPortal = async () => {
    try {
      const response = await getResidentPortal();
      const tenant = response.tenant || null;
      setPortal({ profile: response.profile || null, tenant, payments: Array.isArray(response.payments) ? response.payments : [], complaints: Array.isArray(response.complaints) ? response.complaints : [], bookings: Array.isArray(response.bookings) ? response.bookings : [] });
      setSTKForm(makeSTKForm(tenant));
      setManualForm(makeManualForm(tenant));
      setComplaintForm(makeComplaintForm(tenant?.phone || response.profile?.phone || ""));
    } catch (err) {
      console.error("Failed to load portal:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPortal(); }, []);
  useEffect(() => { setActiveSection(resolvePortalSection(location.hash)); }, [location.hash]);

  const linkedPropertyLabel = useMemo(() => {
    if (!portal.tenant) return "No tenant profile linked yet";
    return `${portal.tenant.propertyName} — ${portal.tenant.unitCode || portal.tenant.unitName || "Assigned unit"}`;
  }, [portal.tenant]);

  const handleSTKSubmit = async (e) => {
    e.preventDefault();
    setSTKStatus({ success: "", error: "", busy: true });
    try {
      const result = await residentInitiateSTKPush({ phone: stkForm.phone, amount: Number(stkForm.amount), periodLabel: stkForm.periodLabel });
      setSTKStatus({ success: result.message || "STK Push sent. Enter your M-Pesa PIN.", error: "", busy: false });
      setSTKForm(makeSTKForm(portal.tenant));
      await loadPortal();
    } catch (err) {
      setSTKStatus({ success: "", error: err.message || "STK Push failed. Check your phone number.", busy: false });
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setManualStatus({ success: "", error: "", busy: true });
    try {
      await createResidentPayment({ ...manualForm, amount: Number(manualForm.amount) || 0, paidAt: manualForm.paidAt ? new Date(manualForm.paidAt).toISOString() : new Date().toISOString() });
      setManualStatus({ success: "Payment submitted. Admin verification is pending.", error: "", busy: false });
      setManualForm(makeManualForm(portal.tenant));
      await loadPortal();
    } catch (err) {
      setManualStatus({ success: "", error: err.message || "Could not submit payment.", busy: false });
    }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    try {
      await createComplaint(complaintForm);
      setComplaintSuccess("Complaint submitted successfully.");
      setComplaintForm(makeComplaintForm(portal.tenant?.phone || ""));
      await loadPortal();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Page>Loading resident portal...</Page>;

  const { tenant, payments } = portal;

  return (
    <Page>
      <Hero>
        <Eyebrow><HiOutlineHomeModern />Resident Service Portal</Eyebrow>
        <Title>Manage your rental activity</Title>
        <Description>
          View your property, track payments, pay rent via M-Pesa STK Push, submit complaints, and track bookings — all in one place.
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
            <SidebarText>Open one service area at a time.</SidebarText>
            <SidebarNav>
              {PORTAL_SECTIONS.map((s) => (
                <SidebarButton key={s.id} type="button" $active={activeSection === s.id} onClick={() => setActiveSection(s.id)}>
                  <SidebarButtonTitle>{s.title}</SidebarButtonTitle>
                  <SidebarButtonText>{s.text}</SidebarButtonText>
                </SidebarButton>
              ))}
            </SidebarNav>
          </SidebarCard>
        </Sidebar>

        <Content>
          {activeSection === "overview" && (
            <Card>
              <SectionTitle>Resident overview</SectionTitle>
              <SectionText>Your current property, rent balance, and next payment due date.</SectionText>
              <MetaRow>
                <MetaPill><HiOutlineMapPin />{linkedPropertyLabel}</MetaPill>
                {tenant?.leaseStart && (
                  <MetaPill>Lease: {toDateInputValue(tenant.leaseStart)} to {toDateInputValue(tenant.leaseEnd) || "Open ended"}</MetaPill>
                )}
              </MetaRow>

              {tenant && (
                <BalanceStrip>
                  <BalanceItem>
                    <BalanceLabel>Monthly rent</BalanceLabel>
                    <BalanceValue>{formatKenyanCurrency(tenant.monthlyRent || 0)}</BalanceValue>
                    <BalanceSubtext>Per calendar month</BalanceSubtext>
                  </BalanceItem>
                  <BalanceItem>
                    <BalanceLabel>Outstanding balance</BalanceLabel>
                    <BalanceValue style={{ color: (tenant.outstandingBalance || 0) > 0 ? "#f4a261" : "#6ee7b7" }}>
                      {formatKenyanCurrency(tenant.outstandingBalance || 0)}
                    </BalanceValue>
                    <BalanceSubtext>
                      {(tenant.arrearsMonths || 0) > 0
                        ? `${tenant.arrearsMonths} month${tenant.arrearsMonths === 1 ? "" : "s"} overdue`
                        : "No arrears"}
                    </BalanceSubtext>
                  </BalanceItem>
                  <BalanceItem>
                    <BalanceLabel>Next rent due</BalanceLabel>
                    <BalanceValue style={{ fontSize: "1.1rem" }}>{formatNextDue(tenant.nextDueDate)}</BalanceValue>
                    <BalanceSubtext>{formatStatusLabel(tenant.paymentStatus || "upcoming")}</BalanceSubtext>
                  </BalanceItem>
                </BalanceStrip>
              )}

              <SummaryGrid>
                <SummaryCard>
                  <SummaryLabel>Total paid to date</SummaryLabel>
                  <SummaryValue>{formatKenyanCurrency(tenant?.totalPaid || 0)}</SummaryValue>
                </SummaryCard>
                <SummaryCard>
                  <SummaryLabel>Rent cycles covered</SummaryLabel>
                  <SummaryValue>{tenant?.rentCycles || 0}</SummaryValue>
                </SummaryCard>
                <SummaryCard>
                  <SummaryLabel>Payments on record</SummaryLabel>
                  <SummaryValue>{payments.length}</SummaryValue>
                </SummaryCard>
              </SummaryGrid>

              {!tenant && (
                <EmptyState>
                  No tenant profile is linked to your account email. Ask the admin to add your email to the tenant record so payments and complaints connect to the right property.
                </EmptyState>
              )}
            </Card>
          )}

          {activeSection === "payments" && (
            <Card>
              <SectionTitle>Payment history</SectionTitle>
              <SectionText>Every rent submission with its verification status. Download individual receipts as PDF.</SectionText>
              {payments.length === 0 ? (
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
                        <Th></Th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => {
                        const tone = statusTone(payment.status);
                        return (
                          <tr key={payment._id}>
                            <Td style={{ fontFamily: "monospace", fontSize: "0.82rem" }}>{payment.receiptNumber}</Td>
                            <Td>{payment.periodLabel || "—"}</Td>
                            <Td>{formatKenyanCurrency(payment.amount)}</Td>
                            <Td>{formatStatusLabel(payment.method)}</Td>
                            <Td>
                              <StatusPill style={{ background: tone.background, color: tone.color }}>
                                {formatStatusLabel(payment.status)}
                              </StatusPill>
                            </Td>
                            <Td>{formatKenyanDateTime(payment.paidAt || payment.createdAt)}</Td>
                            <Td>
                              <SecondaryButton type="button" onClick={() => downloadReceiptPdf({ payment, tenant })}>
                                Receipt PDF
                              </SecondaryButton>
                            </Td>
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
              <SectionTitle>Pay rent</SectionTitle>
              <SectionText>
                Use M-Pesa STK Push to get a payment prompt on your phone, or submit a manual record for admin verification.
              </SectionText>
              {!tenant ? (
                <EmptyState>You need a linked tenant profile before submitting rent payments from the portal.</EmptyState>
              ) : (
                <>
                  <TabRow>
                    <Tab $active={payTab === "stk"} type="button" onClick={() => setPayTab("stk")}>
                      <HiOutlineDevicePhoneMobile />M-Pesa STK Push
                    </Tab>
                    <Tab $active={payTab === "manual"} type="button" onClick={() => setPayTab("manual")}>
                      Manual submission
                    </Tab>
                  </TabRow>

                  {payTab === "stk" && (
                    <>
                      {stkStatus.success && <SuccessMessage>{stkStatus.success}</SuccessMessage>}
                      {stkStatus.error && <ErrorMessage>{stkStatus.error}</ErrorMessage>}
                      <Form onSubmit={handleSTKSubmit}>
                        <Grid>
                          <Field>
                            Phone number (M-Pesa registered)
                            <Input value={stkForm.phone} onChange={(e) => setSTKForm((c) => ({ ...c, phone: e.target.value }))} placeholder="07XXXXXXXX or +2547XXXXXXXX" required />
                          </Field>
                          <Field>
                            Amount (KSh)
                            <Input type="number" min="1" value={stkForm.amount} onChange={(e) => setSTKForm((c) => ({ ...c, amount: e.target.value }))} required />
                          </Field>
                          <Field>
                            Period
                            <Input value={stkForm.periodLabel} onChange={(e) => setSTKForm((c) => ({ ...c, periodLabel: e.target.value }))} />
                          </Field>
                        </Grid>
                        <GreenButton type="submit" disabled={stkStatus.busy}>
                          <HiOutlineDevicePhoneMobile />
                          {stkStatus.busy ? "Sending prompt…" : "Send M-Pesa STK Push"}
                        </GreenButton>
                        <SectionText style={{ fontSize: "0.88rem" }}>
                          You will receive a prompt on your phone. Enter your M-Pesa PIN to complete. Your balance updates automatically once Safaricom confirms.
                        </SectionText>
                      </Form>
                    </>
                  )}

                  {payTab === "manual" && (
                    <>
                      {manualStatus.success && <SuccessMessage>{manualStatus.success}</SuccessMessage>}
                      {manualStatus.error && <ErrorMessage>{manualStatus.error}</ErrorMessage>}
                      <Form onSubmit={handleManualSubmit}>
                        <Grid>
                          <Field>
                            Amount
                            <Input type="number" min="0" value={manualForm.amount} onChange={(e) => setManualForm((c) => ({ ...c, amount: e.target.value }))} required />
                          </Field>
                          <Field>
                            Payment Method
                            <Select value={manualForm.method} onChange={(e) => setManualForm((c) => ({ ...c, method: e.target.value }))}>
                              {PAYMENT_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </Select>
                          </Field>
                          <Field>
                            Period Label
                            <Input value={manualForm.periodLabel} onChange={(e) => setManualForm((c) => ({ ...c, periodLabel: e.target.value }))} />
                          </Field>
                          <Field>
                            Paid At
                            <Input type="datetime-local" value={manualForm.paidAt} onChange={(e) => setManualForm((c) => ({ ...c, paidAt: e.target.value }))} />
                          </Field>
                          <Field>
                            Reference
                            <Input value={manualForm.reference} onChange={(e) => setManualForm((c) => ({ ...c, reference: e.target.value }))} placeholder="M-Pesa code, bank ref" />
                          </Field>
                        </Grid>
                        <Field>
                          Notes
                          <Textarea value={manualForm.notes} onChange={(e) => setManualForm((c) => ({ ...c, notes: e.target.value }))} placeholder="Add context for the admin finance team." />
                        </Field>
                        <PrimaryButton type="submit" disabled={manualStatus.busy}>
                          {manualStatus.busy ? "Submitting…" : "Submit for Verification"}
                        </PrimaryButton>
                      </Form>
                    </>
                  )}
                </>
              )}
            </Card>
          )}

          {activeSection === "complaints" && (
            <Card>
              <SectionTitle>Submit complaint</SectionTitle>
              <SectionText>Send maintenance, billing, security, or service issues to the admin queue.</SectionText>
              {complaintSuccess && <SuccessMessage style={{ marginTop: "1rem" }}>{complaintSuccess}</SuccessMessage>}
              {!tenant ? (
                <EmptyState>Complaints are linked to a tenant property record. Ask an admin to connect your account email to your tenant profile first.</EmptyState>
              ) : (
                <Form onSubmit={handleComplaintSubmit}>
                  <Grid>
                    <Field>Phone<Input value={complaintForm.phone} onChange={(e) => setComplaintForm((c) => ({ ...c, phone: e.target.value }))} required /></Field>
                    <Field>
                      Category
                      <Select value={complaintForm.category} onChange={(e) => setComplaintForm((c) => ({ ...c, category: e.target.value }))}>
                        <option value="maintenance">Maintenance</option>
                        <option value="billing">Billing</option>
                        <option value="security">Security</option>
                        <option value="noise">Noise</option>
                        <option value="other">Other</option>
                      </Select>
                    </Field>
                    <Field>
                      Priority
                      <Select value={complaintForm.priority} onChange={(e) => setComplaintForm((c) => ({ ...c, priority: e.target.value }))}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </Select>
                    </Field>
                    <Field>Subject<Input value={complaintForm.subject} onChange={(e) => setComplaintForm((c) => ({ ...c, subject: e.target.value }))} required /></Field>
                  </Grid>
                  <Field>
                    Description
                    <Textarea value={complaintForm.description} onChange={(e) => setComplaintForm((c) => ({ ...c, description: e.target.value }))} placeholder="Describe the issue, urgency, and any access notes." required />
                  </Field>
                  <PrimaryButton type="submit">Submit Complaint</PrimaryButton>
                </Form>
              )}

              {portal.complaints.length > 0 && (
                <>
                  <Divider />
                  <SectionTitle style={{ fontSize: "1.2rem" }}>Complaint history</SectionTitle>
                  <TableWrapper>
                    <Table>
                      <thead>
                        <tr>
                          <Th>Subject</Th><Th>Property</Th><Th>Status</Th><Th>Submitted</Th>
                        </tr>
                      </thead>
                      <tbody>
                        {portal.complaints.map((complaint) => {
                          const tone = statusTone(complaint.status);
                          return (
                            <tr key={complaint._id}>
                              <Td>{complaint.subject}</Td>
                              <Td>{complaint.propertyName}<br /><span style={{ color: "#607184" }}>{complaint.unitCode || complaint.unitName}</span></Td>
                              <Td><StatusPill style={{ background: tone.background, color: tone.color }}>{formatStatusLabel(complaint.status)}</StatusPill></Td>
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
              <SectionText>Review your reservation requests and their current approval status.</SectionText>
              <HeroActions style={{ marginTop: "1rem" }}>
                <HeroLink to="/property">Browse Properties</HeroLink>
              </HeroActions>
              {portal.bookings.length === 0 ? (
                <EmptyState>You have not submitted any booking requests yet.</EmptyState>
              ) : (
                <TableWrapper>
                  <Table>
                    <thead>
                      <tr><Th>Property</Th><Th>Move In</Th><Th>Duration</Th><Th>Status</Th><Th>Submitted</Th></tr>
                    </thead>
                    <tbody>
                      {portal.bookings.map((booking) => {
                        const tone = statusTone(booking.status);
                        return (
                          <tr key={booking._id}>
                            <Td>{booking.propertyName}<br /><span style={{ color: "#607184" }}>{booking.unitCode || booking.unitName || "General request"}</span></Td>
                            <Td>{booking.preferredMoveIn ? toDateInputValue(booking.preferredMoveIn) : "Not set"}</Td>
                            <Td>{booking.durationMonths || 1} month(s)</Td>
                            <Td><StatusPill style={{ background: tone.background, color: tone.color }}>{formatStatusLabel(booking.status)}</StatusPill></Td>
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