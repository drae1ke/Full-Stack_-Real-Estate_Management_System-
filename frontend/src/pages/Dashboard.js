import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Link } from "react-router-dom";
import {
  HiOutlineArrowTrendingUp,
  HiOutlineBellAlert,
  HiOutlineCalendarDays,
  HiOutlineCurrencyDollar,
  HiOutlineExclamationTriangle,
  HiOutlineHomeModern,
  HiOutlineWrenchScrewdriver,
} from "react-icons/hi2";
import { getOverview } from "../api/rentalApi";
import {
  formatKenyanCurrency,
  formatKenyanDateTime,
} from "../utils/formatters";
import { BRAND_NAME } from "../utils/siteContent";
import { formatStatusLabel, statusTone } from "../utils/rentalTools";

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

const ActionRow = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
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

const ActionLink = styled(Link)`
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

const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 1rem;

  @media (max-width: 1040px) {
    grid-template-columns: 1fr;
  }
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

const Chart = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.8rem;
  align-items: end;
  margin-top: 1.5rem;
  min-height: 17rem;
`;

const BarWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  align-items: center;
`;

const Bar = styled.div`
  width: 100%;
  max-width: 4.2rem;
  border-radius: 18px 18px 10px 10px;
  background: linear-gradient(180deg, #d8b469 0%, #17345e 100%);
  min-height: 1.5rem;
  height: ${({ $height }) => `${$height}px`};
`;

const BarValue = styled.div`
  color: #132239;
  font-weight: 800;
  font-size: 0.85rem;
  text-align: center;
`;

const BarLabel = styled.div`
  color: #607184;
  font-size: 0.83rem;
  text-align: center;
`;

const HighlightGrid = styled.div`
  display: grid;
  gap: 0.85rem;
  margin-top: 1.4rem;
`;

const HighlightCard = styled.div`
  border-radius: 22px;
  padding: 1rem 1.1rem;
  background: #f8fafc;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
`;

const HighlightLabel = styled.div`
  color: #5d6f81;
`;

const HighlightValue = styled.div`
  color: #132239;
  font-size: 1.25rem;
  font-weight: 800;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 1.4rem;
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

const Pill = styled.div`
  width: fit-content;
  border-radius: 999px;
  padding: 0.45rem 0.72rem;
  font-size: 0.8rem;
  font-weight: 800;
`;

const Timeline = styled.div`
  display: grid;
  gap: 0.8rem;
  margin-top: 1.4rem;
`;

const TimelineCard = styled.div`
  border-radius: 22px;
  padding: 1rem 1.1rem;
  border: 1px solid rgba(19, 34, 57, 0.08);
  background: #f8fafc;
`;

const EmptyState = styled.div`
  border-radius: 28px;
  padding: 1.5rem;
  background: white;
  border: 1px solid rgba(19, 34, 57, 0.08);
  color: #5d6f81;
`;

function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await getOverview();
        setOverview(response);
      } catch (error) {
        console.error("Failed to load overview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const chartHeights = useMemo(() => {
    const series = overview?.monthlyRevenue || [];
    const maxAmount = Math.max(...series.map((item) => item.amount), 1);
    return series.map((item) => ({
      ...item,
      height: Math.max(28, (item.amount / maxAmount) * 180),
    }));
  }, [overview?.monthlyRevenue]);

  const downloadExecutiveReport = () => {
    if (!overview) {
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text(`${BRAND_NAME} Portfolio Overview`, 14, 18);
    doc.setFontSize(11);
    doc.text(`Generated: ${formatKenyanDateTime(new Date())}`, 14, 26);
    doc.text(
      `Occupancy Rate: ${overview.kpis.occupancyRate}%   Collected Revenue: ${formatKenyanCurrency(
        overview.paymentSummary.collectedRevenue
      )}`,
      14,
      34
    );

    doc.autoTable({
      startY: 44,
      head: [["KPI", "Value"]],
      body: [
        ["Properties", String(overview.kpis.properties)],
        ["Total Units", String(overview.kpis.totalUnits)],
        ["Occupied Rooms", String(overview.kpis.occupiedRooms)],
        ["Vacant Rooms", String(overview.kpis.vacantRooms)],
        ["Pending Bookings", String(overview.kpis.pendingBookings)],
        ["Open Complaints", String(overview.kpis.openComplaints)],
        [
          "Arrears Outstanding",
          formatKenyanCurrency(overview.paymentSummary.arrearsOutstanding),
        ],
      ],
      headStyles: { fillColor: [19, 34, 57] },
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 12,
      head: [["Property", "Units", "Occupied", "Vacant", "Revenue", "Arrears"]],
      body: (overview.propertyPerformance || []).map((property) => [
        property.name,
        String(property.totalUnits),
        String(property.occupied),
        String(property.vacant),
        formatKenyanCurrency(property.revenue),
        formatKenyanCurrency(property.arrears),
      ]),
      headStyles: { fillColor: [34, 67, 109] },
    });

    doc.save("portfolio-overview.pdf");
  };

  if (loading) {
    return <Page>Loading dashboard...</Page>;
  }

  if (!overview) {
    return <EmptyState>The dashboard could not be loaded right now.</EmptyState>;
  }

  const kpis = [
    {
      icon: <HiOutlineHomeModern />,
      value: `${overview.kpis.occupancyRate}%`,
      label: "Occupancy rate across the managed unit portfolio",
    },
    {
      icon: <HiOutlineCurrencyDollar />,
      value: formatKenyanCurrency(overview.paymentSummary.collectedRevenue),
      label: "Verified and partially verified revenue collected",
    },
    {
      icon: <HiOutlineBellAlert />,
      value: formatKenyanCurrency(overview.paymentSummary.arrearsOutstanding),
      label: "Outstanding rent exposure across active tenants",
    },
    {
      icon: <HiOutlineWrenchScrewdriver />,
      value: `${overview.kpis.openComplaints}`,
      label: "Open complaints still requiring administrative action",
    },
  ];

  return (
    <Page>
      <Hero>
        <HeroTop>
          <div>
            <Eyebrow>
              <HiOutlineArrowTrendingUp />
              Executive Portfolio Dashboard
            </Eyebrow>
            <Title>Rental operations with sharper visibility</Title>
            <Description>
              Track room occupancy, booking approvals, payment verification,
              arrears exposure, maintenance queues, and recent rent activity from
              one professional dashboard.
            </Description>
          </div>
          <ActionRow>
            <ActionButton onClick={downloadExecutiveReport}>
              Download Report
            </ActionButton>
            <ActionLink to="/admin/properties#property-management">
              Manage Houses & Units
            </ActionLink>
            <ActionLink to="/admin/tenants#tenant-management">
              Manage Tenants
            </ActionLink>
            <ActionButton $secondary as={Link} to="/property">
              Review Booking Experience
            </ActionButton>
          </ActionRow>
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

      <TwoColumn>
        <Card>
          <SectionTitle>Monthly revenue analytics</SectionTitle>
          <SectionText>
            Review rent collections over the last six months to quickly spot
            revenue momentum or softness in the portfolio.
          </SectionText>
          <Chart>
            {chartHeights.map((point) => (
              <BarWrap key={point.key}>
                <BarValue>{formatKenyanCurrency(point.amount)}</BarValue>
                <Bar $height={point.height} />
                <BarLabel>{point.label}</BarLabel>
              </BarWrap>
            ))}
          </Chart>
        </Card>

        <Card>
          <SectionTitle>Portfolio health</SectionTitle>
          <SectionText>
            Core supply and service metrics that help management teams move
            quickly on vacancies, maintenance, and revenue risk.
          </SectionText>
          <HighlightGrid>
            <HighlightCard>
              <HighlightLabel>Vacant rooms</HighlightLabel>
              <HighlightValue>{overview.kpis.vacantRooms}</HighlightValue>
            </HighlightCard>
            <HighlightCard>
              <HighlightLabel>Reserved rooms</HighlightLabel>
              <HighlightValue>{overview.kpis.reservedRooms}</HighlightValue>
            </HighlightCard>
            <HighlightCard>
              <HighlightLabel>Rooms under maintenance</HighlightLabel>
              <HighlightValue>{overview.kpis.maintenanceRooms}</HighlightValue>
            </HighlightCard>
            <HighlightCard>
              <HighlightLabel>Pending bookings</HighlightLabel>
              <HighlightValue>{overview.kpis.pendingBookings}</HighlightValue>
            </HighlightCard>
          </HighlightGrid>
        </Card>
      </TwoColumn>

      <TwoColumn>
        <Card>
          <SectionTitle>Overdue rent alerts</SectionTitle>
          <SectionText>
            Tenants carrying outstanding balances are surfaced here so finance
            and operations teams can follow up before arrears spread further.
          </SectionText>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Tenant</Th>
                  <Th>Unit</Th>
                  <Th>Outstanding</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {overview.arrearsTenants?.length ? (
                  overview.arrearsTenants.map((tenant) => {
                    const tone = statusTone(tenant.paymentStatus);
                    return (
                      <tr key={tenant._id}>
                        <Td>{tenant.fullName}</Td>
                        <Td>
                          {tenant.propertyName}
                          <br />
                          {tenant.unitCode || tenant.unitName}
                        </Td>
                        <Td>{formatKenyanCurrency(tenant.outstandingBalance)}</Td>
                        <Td>
                          <Pill
                            style={{
                              background: tone.background,
                              color: tone.color,
                            }}
                          >
                            {formatStatusLabel(tenant.paymentStatus)}
                          </Pill>
                        </Td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <Td colSpan="4">No arrears recorded right now.</Td>
                  </tr>
                )}
              </tbody>
            </Table>
          </TableWrapper>
        </Card>

        <Card>
          <SectionTitle>Complaint overview</SectionTitle>
          <SectionText>
            Keep resident service quality visible with a clear snapshot of what
            is newly submitted, actively being worked, or already resolved.
          </SectionText>
          <HighlightGrid>
            <HighlightCard>
              <HighlightLabel>Submitted</HighlightLabel>
              <HighlightValue>{overview.complaintOverview.submitted}</HighlightValue>
            </HighlightCard>
            <HighlightCard>
              <HighlightLabel>In progress</HighlightLabel>
              <HighlightValue>{overview.complaintOverview.inProgress}</HighlightValue>
            </HighlightCard>
            <HighlightCard>
              <HighlightLabel>Resolved</HighlightLabel>
              <HighlightValue>{overview.complaintOverview.resolved}</HighlightValue>
            </HighlightCard>
          </HighlightGrid>
        </Card>
      </TwoColumn>

      <TwoColumn>
        <Card>
          <SectionTitle>Recent transactions</SectionTitle>
          <SectionText>
            Newly recorded rent payments, ready for verification review and
            receipt generation where needed.
          </SectionText>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Receipt</Th>
                  <Th>Tenant</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                </tr>
              </thead>
              <tbody>
                {overview.recentTransactions?.length ? (
                  overview.recentTransactions.map((payment) => {
                    const tone = statusTone(payment.status);
                    return (
                      <tr key={payment._id}>
                        <Td>{payment.receiptNumber}</Td>
                        <Td>{payment.tenantName}</Td>
                        <Td>{formatKenyanCurrency(payment.amount)}</Td>
                        <Td>
                          <Pill
                            style={{
                              background: tone.background,
                              color: tone.color,
                            }}
                          >
                            {formatStatusLabel(payment.status)}
                          </Pill>
                        </Td>
                        <Td>{formatKenyanDateTime(payment.paidAt || payment.createdAt)}</Td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <Td colSpan="5">No payment activity recorded yet.</Td>
                  </tr>
                )}
              </tbody>
            </Table>
          </TableWrapper>
        </Card>

        <Card>
          <SectionTitle>
            <HiOutlineCalendarDays style={{ marginRight: "0.4rem" }} />
            Booking timeline
          </SectionTitle>
          <SectionText>
            Upcoming reservation activity and approval decisions appear here so
            the team can see demand forming across the portfolio.
          </SectionText>
          <Timeline>
            {overview.recentBookings?.length ? (
              overview.recentBookings.map((booking) => {
                const tone = statusTone(booking.status);
                return (
                  <TimelineCard key={booking._id}>
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
                        <div style={{ color: "#5d6f81", marginTop: "0.35rem" }}>
                          {booking.propertyName} • {booking.unitName || booking.unitCode}
                        </div>
                      </div>
                      <Pill
                        style={{
                          background: tone.background,
                          color: tone.color,
                        }}
                      >
                        {formatStatusLabel(booking.status)}
                      </Pill>
                    </div>
                    <div style={{ color: "#5d6f81", marginTop: "0.85rem" }}>
                      Preferred move-in:{" "}
                      {booking.preferredMoveIn
                        ? formatKenyanDateTime(booking.preferredMoveIn)
                        : "Not set"}
                    </div>
                  </TimelineCard>
                );
              })
            ) : (
              <EmptyState>No booking activity has been recorded yet.</EmptyState>
            )}
          </Timeline>
        </Card>
      </TwoColumn>

      <Card>
        <SectionTitle>
          <HiOutlineExclamationTriangle style={{ marginRight: "0.4rem" }} />
          Property performance
        </SectionTitle>
        <SectionText>
          Compare occupancy, vacancy, revenue, and complaints property by
          property to understand which assets need leasing or service attention.
        </SectionText>
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>Property</Th>
                <Th>Units</Th>
                <Th>Occupied</Th>
                <Th>Vacant</Th>
                <Th>Revenue</Th>
                <Th>Arrears</Th>
                <Th>Open Complaints</Th>
              </tr>
            </thead>
            <tbody>
              {overview.propertyPerformance?.map((property) => (
                <tr key={property.id}>
                  <Td>
                    {property.name}
                    <br />
                    <span style={{ color: "#6a7b8d" }}>{property.category}</span>
                  </Td>
                  <Td>{property.totalUnits}</Td>
                  <Td>{property.occupied}</Td>
                  <Td>{property.vacant}</Td>
                  <Td>{formatKenyanCurrency(property.revenue)}</Td>
                  <Td>{formatKenyanCurrency(property.arrears)}</Td>
                  <Td>{property.openComplaints}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      </Card>
    </Page>
  );
}

export default Dashboard;
