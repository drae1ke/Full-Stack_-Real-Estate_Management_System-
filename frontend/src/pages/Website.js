import styled from "styled-components";
import {
  HiOutlineBuildingOffice2,
  HiOutlineCalendarDays,
  HiOutlineBanknotes,
  HiOutlineWrenchScrewdriver,
} from "react-icons/hi2";
import Hero from "../Components/Hero/Hero";

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 0 4rem;
`;

const Section = styled.section`
  background: white;
  border-radius: 30px;
  border: 1px solid rgba(20, 33, 55, 0.08);
  box-shadow: 0 24px 60px rgba(11, 26, 46, 0.08);
  padding: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-bottom: 1.5rem;
`;

const Eyebrow = styled.span`
  color: #8a6b32;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.82rem;
  font-weight: 800;
`;

const Title = styled.h2`
  margin: 0;
  color: #132239;
  font-size: clamp(1.9rem, 3vw, 3rem);
`;

const Text = styled.p`
  margin: 0;
  color: #5a6a7d;
  line-height: 1.75;
  max-width: 52rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  padding: 1.5rem;
  border-radius: 26px;
  background: linear-gradient(180deg, #f8fafc 0%, #eef3f8 100%);
  border: 1px solid rgba(19, 34, 57, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

const IconWrap = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: #0f2e57;
  background: rgba(212, 184, 118, 0.24);
  font-size: 1.5rem;
`;

const CardTitle = styled.h3`
  margin: 0;
  color: #14233a;
  font-size: 1.15rem;
`;

const CardText = styled.p`
  margin: 0;
  color: #5b6c80;
  line-height: 1.7;
`;

const OperationsRail = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Showcase = styled.div`
  border-radius: 28px;
  padding: 1.7rem;
  background:
    radial-gradient(circle at top right, rgba(212, 184, 118, 0.2), transparent 35%),
    linear-gradient(135deg, #132239 0%, #203554 100%);
  color: white;
`;

const ShowcaseList = styled.div`
  display: grid;
  gap: 0.85rem;
  margin-top: 1.3rem;
`;

const ShowcaseItem = styled.div`
  border-radius: 20px;
  padding: 1rem 1.1rem;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(238, 244, 251, 0.82);
`;

const MetricBox = styled.div`
  border-radius: 28px;
  padding: 1.7rem;
  background: #f8fafc;
  border: 1px solid rgba(20, 33, 55, 0.08);
  display: grid;
  gap: 1rem;
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 1rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid rgba(20, 33, 55, 0.08);
`;

const MetricLabel = styled.div`
  color: #5b6c80;
`;

const MetricValue = styled.div`
  color: #132239;
  font-size: 1.6rem;
  font-weight: 800;
`;

function Website() {
  return (
    <Page>
      <Hero />

      <Section>
        <SectionHeader>
          <Eyebrow>Core Platform</Eyebrow>
          <Title>Built for corporate property teams, not generic admin panels</Title>
          <Text>
            The experience is designed around day-to-day rental operations: unit
            availability, tenant administration, booking control, financial
            visibility, and maintenance accountability.
          </Text>
        </SectionHeader>

        <Grid>
          <Card>
            <IconWrap>
              <HiOutlineBuildingOffice2 />
            </IconWrap>
            <CardTitle>Apartment and unit control</CardTitle>
            <CardText>
              Organise buildings, floors, and rooms with clear occupancy states
              and a portfolio-wide view of what is vacant, reserved, or under
              maintenance.
            </CardText>
          </Card>
          <Card>
            <IconWrap>
              <HiOutlineCalendarDays />
            </IconWrap>
            <CardTitle>Booking workflow</CardTitle>
            <CardText>
              Convert enquiries into approved reservations with modern unit
              previews, fast approvals, and a move-in timeline that feels
              polished on desktop and mobile.
            </CardText>
          </Card>
          <Card>
            <IconWrap>
              <HiOutlineBanknotes />
            </IconWrap>
            <CardTitle>Financial clarity</CardTitle>
            <CardText>
              Track rent, payment verification, arrears exposure, receipts,
              revenue trends, and transaction history without leaving the admin
              workspace.
            </CardText>
          </Card>
          <Card>
            <IconWrap>
              <HiOutlineWrenchScrewdriver />
            </IconWrap>
            <CardTitle>Complaints and maintenance</CardTitle>
            <CardText>
              Capture tenant issues, assign follow-up, and communicate progress
              with a more accountable service experience for residents and staff.
            </CardText>
          </Card>
        </Grid>
      </Section>

      <Section>
        <OperationsRail>
          <Showcase>
            <Eyebrow style={{ color: "#f4dca6" }}>Operations Snapshot</Eyebrow>
            <Title style={{ color: "white", fontSize: "2rem" }}>
              One operating system for leasing, finance, and service
            </Title>
            <ShowcaseList>
              <ShowcaseItem>
                Admins can assign rooms manually, manage lease records, and keep
                occupancy data aligned with each tenant record.
              </ShowcaseItem>
              <ShowcaseItem>
                Finance teams can validate rent payments, monitor arrears, and
                issue professional receipts with property branding.
              </ShowcaseItem>
              <ShowcaseItem>
                Resident-facing booking and complaints experiences stay clean,
                responsive, and trustworthy from the first touchpoint.
              </ShowcaseItem>
            </ShowcaseList>
          </Showcase>

          <MetricBox>
            <MetricRow>
              <MetricLabel>Booking approvals</MetricLabel>
              <MetricValue>Fast-track</MetricValue>
            </MetricRow>
            <MetricRow>
              <MetricLabel>Receipt generation</MetricLabel>
              <MetricValue>PDF-ready</MetricValue>
            </MetricRow>
            <MetricRow>
              <MetricLabel>Portfolio analytics</MetricLabel>
              <MetricValue>Executive view</MetricValue>
            </MetricRow>
            <MetricRow style={{ borderBottom: "none", paddingBottom: 0 }}>
              <MetricLabel>Maintenance follow-up</MetricLabel>
              <MetricValue>Tracked</MetricValue>
            </MetricRow>
          </MetricBox>
        </OperationsRail>
      </Section>
    </Page>
  );
}

export default Website;
