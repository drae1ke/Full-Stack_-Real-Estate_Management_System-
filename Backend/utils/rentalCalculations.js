function safeNumber(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function startOfMonth(value) {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function countRentCycles(leaseStart, referenceDate = new Date(), leaseEnd) {
  if (!leaseStart) return 1;
  const start = new Date(leaseStart);
  if (Number.isNaN(start.getTime())) return 1;
  const now = new Date(referenceDate);
  if (startOfMonth(start) > startOfMonth(now)) return 0;
  const cappedEnd =
    leaseEnd && !Number.isNaN(new Date(leaseEnd).getTime())
      ? new Date(Math.min(now.getTime(), new Date(leaseEnd).getTime()))
      : now;
  const startMonth = startOfMonth(start);
  const endMonth = startOfMonth(cappedEnd);
  if (endMonth < startMonth) return 1;
  return (
    (endMonth.getFullYear() - startMonth.getFullYear()) * 12 +
    (endMonth.getMonth() - startMonth.getMonth()) +
    1
  );
}

function calculateArrearsAging(outstandingBalance, monthlyRent) {
  const rent = safeNumber(monthlyRent);
  const balance = safeNumber(outstandingBalance);
  if (rent <= 0 || balance <= 0) return 0;
  return Math.ceil(balance / rent);
}

function calculateNextDueDate(leaseStart, referenceDate = new Date()) {
  if (!leaseStart) return null;
  const start = new Date(leaseStart);
  if (Number.isNaN(start.getTime())) return null;
  const now = new Date(referenceDate);
  const billingDay = start.getDate();
  let candidate = new Date(now.getFullYear(), now.getMonth(), billingDay);
  if (candidate <= now) {
    candidate = new Date(now.getFullYear(), now.getMonth() + 1, billingDay);
  }
  const lastDayOfMonth = new Date(candidate.getFullYear(), candidate.getMonth() + 1, 0).getDate();
  if (billingDay > lastDayOfMonth) candidate.setDate(lastDayOfMonth);
  return candidate;
}

function calculateTenantFinancials(tenant, payments = [], referenceDate = new Date()) {
  const leaseStart = tenant?.leaseStart ? new Date(tenant.leaseStart) : null;
  const now = new Date(referenceDate);
  const rentCycles = countRentCycles(leaseStart, now, tenant?.leaseEnd);
  const monthlyRent = safeNumber(tenant?.monthlyRent);
  const totalExpectedRent = rentCycles * monthlyRent;
  const relevantPayments = payments.filter(
    (payment) =>
      String(payment?.tenantId) === String(tenant?._id) &&
      ["verified", "partial"].includes(payment?.status)
  );
  const totalPaid = relevantPayments.reduce((sum, p) => sum + safeNumber(p?.amount), 0);
  const outstandingBalance = Math.max(totalExpectedRent - totalPaid, 0);
  const isUpcoming = leaseStart && startOfMonth(leaseStart) > startOfMonth(now);
  let paymentStatus = "paid";
  if (isUpcoming) paymentStatus = "upcoming";
  else if (outstandingBalance > 0 && totalPaid > 0) paymentStatus = "partial";
  else if (outstandingBalance > 0) paymentStatus = "arrears";
  const sortedPayments = relevantPayments
    .slice()
    .sort((l, r) => new Date(r?.paidAt || r?.createdAt).getTime() - new Date(l?.paidAt || l?.createdAt).getTime());
  const lastPaymentDate = sortedPayments[0]?.paidAt || sortedPayments[0]?.createdAt;
  const nextDueDate = calculateNextDueDate(leaseStart, now);
  const arrearsMonths = calculateArrearsAging(outstandingBalance, monthlyRent);
  return { rentCycles, monthlyRent, totalExpectedRent, totalPaid, outstandingBalance, paymentStatus, lastPaymentDate, nextDueDate, arrearsMonths };
}

function getMonthKey(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function buildMonthlyRevenueSeries(payments = [], months = 6) {
  const now = new Date();
  const buckets = [];
  for (let i = months - 1; i >= 0; i -= 1) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ key: getMonthKey(monthDate), label: monthDate.toLocaleString("en-KE", { month: "short", year: "numeric", timeZone: "Africa/Nairobi" }), amount: 0 });
  }
  const bucketMap = new Map(buckets.map((b) => [b.key, b]));
  payments.filter((p) => ["verified", "partial"].includes(p?.status)).forEach((p) => {
    const key = getMonthKey(p?.paidAt || p?.createdAt);
    const bucket = bucketMap.get(key);
    if (bucket) bucket.amount += safeNumber(p?.amount);
  });
  return buckets;
}

exports.safeNumber = safeNumber;
exports.calculateTenantFinancials = calculateTenantFinancials;
exports.buildMonthlyRevenueSeries = buildMonthlyRevenueSeries;
exports.calculateArrearsAging = calculateArrearsAging;
exports.calculateNextDueDate = calculateNextDueDate;