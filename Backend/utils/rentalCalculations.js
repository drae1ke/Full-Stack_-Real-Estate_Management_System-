function safeNumber(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function startOfMonth(value) {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function countRentCycles(leaseStart, referenceDate = new Date(), leaseEnd) {
  if (!leaseStart) {
    return 1;
  }

  const start = new Date(leaseStart);

  if (Number.isNaN(start.getTime())) {
    return 1;
  }

  const now = new Date(referenceDate);

  if (startOfMonth(start) > startOfMonth(now)) {
    return 0;
  }

  const cappedEnd =
    leaseEnd && !Number.isNaN(new Date(leaseEnd).getTime())
      ? new Date(Math.min(now.getTime(), new Date(leaseEnd).getTime()))
      : now;

  const startMonth = startOfMonth(start);
  const endMonth = startOfMonth(cappedEnd);

  if (endMonth < startMonth) {
    return 1;
  }

  return (
    (endMonth.getFullYear() - startMonth.getFullYear()) * 12 +
    (endMonth.getMonth() - startMonth.getMonth()) +
    1
  );
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

  const totalPaid = relevantPayments.reduce(
    (sum, payment) => sum + safeNumber(payment?.amount),
    0
  );

  const outstandingBalance = Math.max(totalExpectedRent - totalPaid, 0);
  const isUpcoming = leaseStart && startOfMonth(leaseStart) > startOfMonth(now);

  let paymentStatus = "paid";

  if (isUpcoming) {
    paymentStatus = "upcoming";
  } else if (outstandingBalance > 0 && totalPaid > 0) {
    paymentStatus = "partial";
  } else if (outstandingBalance > 0) {
    paymentStatus = "arrears";
  }

  const sortedPayments = relevantPayments
    .slice()
    .sort(
      (left, right) =>
        new Date(right?.paidAt || right?.createdAt).getTime() -
        new Date(left?.paidAt || left?.createdAt).getTime()
    );

  const lastPaymentDate = sortedPayments[0]?.paidAt || sortedPayments[0]?.createdAt;
  const nextDueDate =
    leaseStart && !isUpcoming
      ? new Date(now.getFullYear(), now.getMonth() + 1, 1)
      : leaseStart;

  return {
    rentCycles,
    monthlyRent,
    totalExpectedRent,
    totalPaid,
    outstandingBalance,
    paymentStatus,
    lastPaymentDate,
    nextDueDate,
  };
}

function getMonthKey(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function buildMonthlyRevenueSeries(payments = [], months = 6) {
  const now = new Date();
  const buckets = [];

  for (let index = months - 1; index >= 0; index -= 1) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - index, 1);
    buckets.push({
      key: getMonthKey(monthDate),
      label: monthDate.toLocaleString("en-KE", {
        month: "short",
        year: "numeric",
        timeZone: "Africa/Nairobi",
      }),
      amount: 0,
    });
  }

  const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  payments
    .filter((payment) => ["verified", "partial"].includes(payment?.status))
    .forEach((payment) => {
      const key = getMonthKey(payment?.paidAt || payment?.createdAt);
      const bucket = bucketMap.get(key);

      if (bucket) {
        bucket.amount += safeNumber(payment?.amount);
      }
    });

  return buckets;
}

exports.safeNumber = safeNumber;
exports.calculateTenantFinancials = calculateTenantFinancials;
exports.buildMonthlyRevenueSeries = buildMonthlyRevenueSeries;
