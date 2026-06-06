import { useState, useMemo } from "react";
import styled from "styled-components";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { HiOutlineDevicePhoneMobile, HiOutlineArrowDownTray } from "react-icons/hi2";
import { adminInitiateSTKPush, createPayment, updatePayment } from "../api/rentalApi";
import { formatKenyanCurrency, formatKenyanDateTime } from "../utils/formatters";
import { BRAND_NAME, CONTACT_DETAILS } from "../utils/siteContent";
import {
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  formatStatusLabel,
  statusTone,
  makeEmptyPaymentForm,
  downloadReceiptPdf,
} from "../utils/rentalTools";

/* ── Styled atoms ── */
const Wrapper = styled.div`display: flex; flex-direction: column; gap: 1rem;`;
const Card = styled.section`
  border-radius: 28px; padding: 1.5rem; background: white;
  border: 1px solid rgba(19,34,57,0.08);
  box-shadow: 0 22px 55px rgba(11,26,46,0.08);
`;
const SectionTitle = styled.h2`margin: 0; color: #132239;`;
const SectionText  = styled.p`margin: 0.8rem 0 0; color: #5b6c80; line-height: 1.75;`;
const SectionHead  = styled.div`display: flex; justify-content: space-between; align-items: flex-end; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.4rem;`;
const Form         = styled.form`display: flex; flex-direction: column; gap: 1rem;`;
const Grid         = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $cols = 2 }) => $cols}, minmax(0, 1fr));
  gap: 0.9rem;
  @media (max-width: 740px) { grid-template-columns: 1fr; }
`;
const Field = styled.label`display: flex; flex-direction: column; gap: 0.45rem; color: #35465a; font-weight: 700; font-size: 0.92rem;`;
const IB = `min-height:3rem;border-radius:16px;border:1px solid rgba(19,34,57,.1);padding:0 .9rem;background:#f8fafc;color:#142239;`;
const Input    = styled.input`${IB}`;
const Select   = styled.select`${IB}`;
const Textarea = styled.textarea`min-height:7rem;border-radius:18px;border:1px solid rgba(19,34,57,.1);padding:.9rem;background:#f8fafc;color:#142239;resize:vertical;`;
const PrimaryButton   = styled.button`min-height:3rem;padding:0 1.2rem;border-radius:16px;border:none;background:linear-gradient(135deg,#132239,#27446a);color:white;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:.5rem;&:disabled{opacity:.6;cursor:not-allowed;}`;
const GreenButton     = styled(PrimaryButton)`background:linear-gradient(135deg,#0f6a3b,#1a8a50);`;
const SecondaryButton = styled.button`min-height:2.6rem;padding:0 1rem;border-radius:14px;border:1px solid rgba(19,34,57,.12);background:#f8fafc;color:#17345e;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:.45rem;font-size:.88rem;`;
const DangerButton    = styled.button`min-height:2.4rem;padding:0 .9rem;border-radius:12px;border:none;background:#fde5e5;color:#a72d2d;font-weight:800;cursor:pointer;font-size:.85rem;`;
const InlineRow       = styled.div`display:flex;gap:.6rem;flex-wrap:wrap;`;
const TableWrapper    = styled.div`overflow-x:auto;margin-top:1rem;`;
const Table           = styled.table`width:100%;border-collapse:collapse;`;
const Th              = styled.th`padding:.9rem;text-align:left;color:#17345e;background:#f3f7fb;font-size:.85rem;white-space:nowrap;`;
const Td              = styled.td`padding:.9rem;border-top:1px solid rgba(19,34,57,.08);color:#304256;vertical-align:top;`;
const StatusPill      = styled.div`width:fit-content;border-radius:999px;padding:.42rem .72rem;font-size:.78rem;font-weight:800;`;
const ArrearsBadge    = styled.div`
  display:inline-flex;align-items:center;border-radius:999px;padding:.32rem .65rem;font-size:.78rem;font-weight:800;
  background:${({ $m }) => $m > 2 ? "#fde5e5" : $m > 0 ? "#fff3d6" : "#e6f9ef"};
  color:${({ $m }) => $m > 2 ? "#af2d2d" : $m > 0 ? "#9a6700" : "#0f6a3b"};
`;
const SearchRow       = styled.div`display:flex;gap:.7rem;flex-wrap:wrap;align-items:center;margin-bottom:1rem;`;
const SearchInput     = styled(Input)`min-width:14rem;`;
const SuccessMsg      = styled.div`border-radius:14px;padding:.75rem 1rem;background:#e6f9ef;color:#0f6a3b;font-weight:700;`;
const ErrorMsg        = styled.div`border-radius:14px;padding:.75rem 1rem;background:#fde5e5;color:#af2d2d;font-weight:700;`;
const Hint            = styled.div`color:#5d6f81;line-height:1.7;`;
const EmptyState      = styled.div`border-radius:22px;padding:1rem;border:1px dashed rgba(19,34,57,.14);color:#5d6f81;`;

/* STK modal */
const Overlay  = styled.div`position:fixed;inset:0;background:rgba(10,20,40,.45);display:grid;place-items:center;z-index:50;padding:1rem;`;
const ModalBox = styled.div`background:white;border-radius:28px;padding:2rem;width:min(100%,28rem);box-shadow:0 28px 70px rgba(7,18,35,.22);`;
const MTitle   = styled.h3`margin:0 0 .5rem;color:#132239;`;
const MText    = styled.p`margin:0 0 1rem;color:#5d6f81;line-height:1.7;`;

/* ── Helpers ── */
const fmtNextDue = (d) => !d ? "—" : new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Nairobi" });
const fmtArrears = (m) => (!m || m <= 0) ? "Current" : `${m}mo overdue`;

function exportCSV(payments) {
  const headers = ["Receipt","Tenant","Property","Unit","Period","Amount (KSh)","Method","Status","Date"];
  const rows = payments.map((p) => [
    p.receiptNumber, p.tenantName, p.propertyName,
    p.unitCode || p.unitName || "", p.periodLabel || "",
    p.amount, p.method, p.status,
    formatKenyanDateTime(p.paidAt || p.createdAt),
  ]);
  const csv = [headers, ...rows]
    .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  a.download = `payments-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
}

function exportPDF(payments) {
  const doc = new jsPDF();
  doc.setFillColor(16,32,67); doc.rect(0,0,210,28,"F");
  doc.setTextColor(255,255,255); doc.setFontSize(18);
  doc.text(`${BRAND_NAME} — Payment Register`,14,14);
  doc.setFontSize(10); doc.text(`Generated: ${formatKenyanDateTime(new Date())}`,14,22);
  doc.autoTable({
    startY: 34,
    head: [["Receipt","Tenant","Unit","Period","Amount","Method","Status","Date"]],
    body: payments.map((p) => [
      p.receiptNumber, p.tenantName, p.unitCode || p.unitName || "—",
      p.periodLabel || "—", formatKenyanCurrency(p.amount),
      formatStatusLabel(p.method), formatStatusLabel(p.status),
      formatKenyanDateTime(p.paidAt || p.createdAt),
    ]),
    headStyles: { fillColor: [16,32,67], fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [248,250,252] },
  });
  const fy = doc.lastAutoTable?.finalY || 40;
  doc.setTextColor(90,108,128); doc.setFontSize(9);
  doc.text(`${CONTACT_DETAILS.address}  •  ${CONTACT_DETAILS.phone}  •  ${CONTACT_DETAILS.email}`,14,fy+12);
  doc.save(`payment-register-${new Date().toISOString().slice(0,10)}.pdf`);
}

/* ── Component ── */
export default function AdminPaymentsPanel({ tenants, payments, onRefresh }) {
  const [form, setForm]             = useState(makeEmptyPaymentForm());
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState("");
  const [stkTarget, setSTKTarget]   = useState(null);
  const [stkForm, setSTKForm]       = useState({ phone:"", amount:"", periodLabel:"" });
  const [stkStatus, setSTKStatus]   = useState({ busy:false, success:"", error:"" });
  const [saving, setSaving]         = useState(false);

  const payTenant = tenants.find((t) => t._id === form.tenantId);

  const handleTenantChange = (id) => {
    const t = tenants.find((x) => x._id === id);
    setForm((c) => ({
      ...c, tenantId: id,
      propertyId: t?.propertyId || "",
      unitId:     t?.unitId     || "",
      amount:     t?.monthlyRent || "",
      periodLabel: c.periodLabel || new Date().toLocaleString("en-KE",{month:"long",year:"numeric"}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await createPayment({ ...form, amount: Number(form.amount)||0, paidAt: form.paidAt ? new Date(form.paidAt).toISOString() : new Date() });
      setForm(makeEmptyPaymentForm());
      onRefresh?.();
    } catch (err) { alert(err.message || "Payment could not be saved."); }
    finally { setSaving(false); }
  };

  const handleQuickUpdate = async (payment, status) => {
    try { await updatePayment(payment._id, { status }); onRefresh?.(); }
    catch { alert("Status could not be updated."); }
  };

  const openSTK = (t) => {
    setSTKTarget(t);
    setSTKForm({ phone: t.phone||"", amount: t.monthlyRent||"", periodLabel: new Date().toLocaleString("en-KE",{month:"long",year:"numeric"}) });
    setSTKStatus({ busy:false, success:"", error:"" });
  };

  const handleSTK = async (e) => {
    e.preventDefault();
    setSTKStatus({ busy:true, success:"", error:"" });
    try {
      const r = await adminInitiateSTKPush({ tenantId: stkTarget._id, phone: stkForm.phone, amount: Number(stkForm.amount), periodLabel: stkForm.periodLabel });
      setSTKStatus({ busy:false, success: r.message || "STK Push sent.", error:"" });
      onRefresh?.();
    } catch (err) {
      setSTKStatus({ busy:false, success:"", error: err.message || "STK Push failed." });
    }
  };

  const filtered = useMemo(() =>
    payments.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch = !q || [p.tenantName,p.propertyName,p.unitCode,p.receiptNumber,p.periodLabel].join(" ").toLowerCase().includes(q);
      const matchStatus = !statusFilter || p.status === statusFilter;
      return matchSearch && matchStatus;
    }),
  [payments, search, statusFilter]);

  return (
    <Wrapper>
      {/* Record payment */}
      <Card>
        <SectionHead>
          <div>
            <SectionTitle>Record a payment</SectionTitle>
            <SectionText>Capture rent, verify status, and generate receipts.</SectionText>
          </div>
        </SectionHead>
        <Form onSubmit={handleSubmit}>
          <Grid>
            <Field>
              Tenant
              <Select value={form.tenantId} onChange={(e) => handleTenantChange(e.target.value)} required>
                <option value="">Select tenant</option>
                {tenants.map((t) => <option key={t._id} value={t._id}>{t.fullName} — {t.unitCode || t.unitName}</option>)}
              </Select>
            </Field>
            <Field>Amount<Input type="number" min="0" value={form.amount} onChange={(e) => setForm((c)=>({...c,amount:e.target.value}))} required /></Field>
            <Field>
              Method
              <Select value={form.method} onChange={(e) => setForm((c)=>({...c,method:e.target.value}))}>
                {PAYMENT_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </Select>
            </Field>
            <Field>
              Status
              <Select value={form.status} onChange={(e) => setForm((c)=>({...c,status:e.target.value}))}>
                {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{formatStatusLabel(s)}</option>)}
              </Select>
            </Field>
            <Field>Period<Input value={form.periodLabel} onChange={(e) => setForm((c)=>({...c,periodLabel:e.target.value}))} /></Field>
            <Field>Paid At<Input type="datetime-local" value={form.paidAt} onChange={(e) => setForm((c)=>({...c,paidAt:e.target.value}))} /></Field>
            <Field>Reference<Input value={form.reference} onChange={(e) => setForm((c)=>({...c,reference:e.target.value}))} /></Field>
            <Field>Context<Hint>{payTenant ? `${payTenant.propertyName} • ${payTenant.unitCode||payTenant.unitName}` : "Select a tenant to auto-fill."}</Hint></Field>
          </Grid>
          <Field>Notes<Textarea value={form.notes} onChange={(e) => setForm((c)=>({...c,notes:e.target.value}))} /></Field>
          <PrimaryButton type="submit" disabled={saving}>{saving ? "Saving…" : "Record Payment"}</PrimaryButton>
        </Form>
      </Card>

      {/* Tenant payment status table */}
      <Card>
        <SectionHead>
          <div>
            <SectionTitle>Tenant payment status</SectionTitle>
            <SectionText>Next rent due, arrears aging, and one-click M-Pesa STK Push per tenant.</SectionText>
          </div>
        </SectionHead>
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>Tenant</Th><Th>Unit</Th><Th>Monthly Rent</Th>
                <Th>Outstanding</Th><Th>Arrears</Th><Th>Next Due</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {tenants.length === 0 && <tr><Td colSpan={7}><EmptyState>No tenant records yet.</EmptyState></Td></tr>}
              {tenants.map((t) => (
                <tr key={t._id}>
                  <Td>
                    <div style={{color:"#132239",fontWeight:800}}>{t.fullName}</div>
                    <div style={{color:"#607184",fontSize:"0.82rem",marginTop:"0.2rem"}}>{t.phone}</div>
                  </Td>
                  <Td>
                    <div>{t.propertyName}</div>
                    <div style={{color:"#607184",fontSize:"0.82rem"}}>{t.unitCode||t.unitName}</div>
                  </Td>
                  <Td>{formatKenyanCurrency(t.monthlyRent||0)}</Td>
                  <Td>
                    <strong style={{color:(t.outstandingBalance||0)>0?"#af2d2d":"#0f6a3b"}}>
                      {formatKenyanCurrency(t.outstandingBalance||0)}
                    </strong>
                  </Td>
                  <Td><ArrearsBadge $m={t.arrearsMonths||0}>{fmtArrears(t.arrearsMonths||0)}</ArrearsBadge></Td>
                  <Td style={{whiteSpace:"nowrap",fontSize:"0.85rem"}}>{fmtNextDue(t.nextDueDate)}</Td>
                  <Td>
                    <GreenButton type="button" onClick={() => openSTK(t)} style={{fontSize:"0.82rem",minHeight:"2.4rem",padding:"0 0.9rem"}}>
                      <HiOutlineDevicePhoneMobile />STK Push
                    </GreenButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      </Card>

      {/* Payment history */}
      <Card>
        <SectionHead>
          <div>
            <SectionTitle>Payment history &amp; exports</SectionTitle>
            <SectionText>Search, filter, verify, download receipts, and export the full register.</SectionText>
          </div>
          <InlineRow>
            <SecondaryButton type="button" onClick={() => exportCSV(filtered)}>
              <HiOutlineArrowDownTray />CSV
            </SecondaryButton>
            <SecondaryButton type="button" onClick={() => exportPDF(filtered)}>
              <HiOutlineArrowDownTray />PDF
            </SecondaryButton>
          </InlineRow>
        </SectionHead>
        <SearchRow>
          <SearchInput type="search" placeholder="Search tenant, property, receipt…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select value={statusFilter} onChange={(e) => setStatus(e.target.value)} style={{minHeight:"3rem",borderRadius:"16px",minWidth:"10rem"}}>
            <option value="">All statuses</option>
            {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{formatStatusLabel(s)}</option>)}
          </Select>
        </SearchRow>
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>Receipt</Th><Th>Tenant</Th><Th>Arrears</Th><Th>Next Due</Th>
                <Th>Amount</Th><Th>Method</Th><Th>Status</Th><Th>Date</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><Td colSpan={9}><EmptyState>No payments match the current filter.</EmptyState></Td></tr>}
              {filtered.map((p) => {
                const tone = statusTone(p.status);
                const lt   = tenants.find((t) => t._id === p.tenantId || t._id === String(p.tenantId));
                const am   = lt?.arrearsMonths || 0;
                return (
                  <tr key={p._id}>
                    <Td style={{fontFamily:"monospace",fontSize:"0.8rem"}}>{p.receiptNumber}</Td>
                    <Td>
                      <div style={{fontWeight:700}}>{p.tenantName}</div>
                      <div style={{color:"#607184",fontSize:"0.82rem"}}>{p.propertyName} • {p.unitCode||p.unitName}</div>
                      {p.periodLabel && <div style={{color:"#8a9bb0",fontSize:"0.78rem"}}>{p.periodLabel}</div>}
                    </Td>
                    <Td><ArrearsBadge $m={am}>{fmtArrears(am)}</ArrearsBadge></Td>
                    <Td style={{whiteSpace:"nowrap",fontSize:"0.85rem"}}>{fmtNextDue(lt?.nextDueDate)}</Td>
                    <Td>{formatKenyanCurrency(p.amount)}</Td>
                    <Td>{formatStatusLabel(p.method)}</Td>
                    <Td><StatusPill style={{background:tone.background,color:tone.color}}>{formatStatusLabel(p.status)}</StatusPill></Td>
                    <Td style={{fontSize:"0.82rem"}}>{formatKenyanDateTime(p.paidAt||p.createdAt)}</Td>
                    <Td>
                      <InlineRow>
                        {p.status !== "verified" && <SecondaryButton type="button" onClick={() => handleQuickUpdate(p,"verified")}>Verify</SecondaryButton>}
                        {p.status !== "arrears"  && <DangerButton type="button" onClick={() => handleQuickUpdate(p,"arrears")}>Arrears</DangerButton>}
                        <SecondaryButton type="button" onClick={() => downloadReceiptPdf({payment:p,tenant:lt})}>Receipt</SecondaryButton>
                      </InlineRow>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </TableWrapper>
      </Card>

      {/* STK push modal */}
      {stkTarget && (
        <Overlay onClick={() => { if (!stkStatus.busy) setSTKTarget(null); }}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <MTitle>Send M-Pesa STK Push</MTitle>
            <MText>A payment prompt will go to <strong>{stkTarget.fullName}</strong>'s phone. They enter their PIN to complete.</MText>
            {stkStatus.success && <SuccessMsg style={{marginBottom:"1rem"}}>{stkStatus.success}</SuccessMsg>}
            {stkStatus.error   && <ErrorMsg   style={{marginBottom:"1rem"}}>{stkStatus.error}</ErrorMsg>}
            {!stkStatus.success && (
              <Form onSubmit={handleSTK}>
                <Field>Phone number<Input value={stkForm.phone} onChange={(e)=>setSTKForm((c)=>({...c,phone:e.target.value}))} placeholder="07XXXXXXXX" required /></Field>
                <Field>Amount (KSh)<Input type="number" min="1" value={stkForm.amount} onChange={(e)=>setSTKForm((c)=>({...c,amount:e.target.value}))} required /></Field>
                <Field>Period<Input value={stkForm.periodLabel} onChange={(e)=>setSTKForm((c)=>({...c,periodLabel:e.target.value}))} /></Field>
                <InlineRow>
                  <GreenButton type="submit" disabled={stkStatus.busy}>
                    <HiOutlineDevicePhoneMobile />{stkStatus.busy ? "Sending…" : "Send STK Push"}
                  </GreenButton>
                  <SecondaryButton type="button" onClick={() => setSTKTarget(null)} disabled={stkStatus.busy}>Cancel</SecondaryButton>
                </InlineRow>
              </Form>
            )}
            {stkStatus.success && (
              <SecondaryButton type="button" onClick={() => setSTKTarget(null)} style={{marginTop:"0.5rem"}}>Close</SecondaryButton>
            )}
          </ModalBox>
        </Overlay>
      )}
    </Wrapper>
  );
}