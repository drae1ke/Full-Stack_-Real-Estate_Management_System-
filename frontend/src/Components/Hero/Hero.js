import { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import CountUp from "react-countup";
import { HERO_STATS, BRAND_NAME } from "../../utils/siteContent";
import UserContext from "../../context/UserContext";

const HeroShell = styled.section`
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at top right, rgba(196, 169, 108, 0.35), transparent 32%),
    linear-gradient(135deg, #0f1d32 0%, #182a45 54%, #233a5f 100%);
  border-radius: 36px;
  padding: 4.5rem;
  min-height: 34rem;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(20rem, 0.9fr);
  gap: 2rem;
  box-shadow: 0 38px 80px rgba(9, 22, 40, 0.28);

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    padding: 2rem;
    min-height: auto;
  }
`;

const Glow = styled.div`
  position: absolute;
  inset: auto auto -6rem -5rem;
  width: 20rem;
  height: 20rem;
  border-radius: 999px;
  background: rgba(28, 194, 167, 0.22);
  filter: blur(32px);
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Eyebrow = styled.span`
  width: fit-content;
  padding: 0.55rem 0.95rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: #f4dca6;
  font-size: 0.82rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 800;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(2.75rem, 4vw, 5rem);
  line-height: 0.98;
  color: #f8fbff;
  max-width: 12ch;
  font-family: "Fraunces", Georgia, serif;
`;

const Accent = styled.span`
  color: #f0c977;
`;

const Description = styled.p`
  margin: 0;
  max-width: 42rem;
  color: rgba(238, 244, 251, 0.78);
  line-height: 1.75;
  font-size: 1.02rem;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const PrimaryAction = styled(Link)`
  padding: 0.95rem 1.35rem;
  border-radius: 18px;
  background: linear-gradient(135deg, #d7b56d, #f0d28f);
  color: #142137;
  font-weight: 800;
  box-shadow: 0 14px 30px rgba(215, 181, 109, 0.28);
`;

const SecondaryAction = styled(Link)`
  padding: 0.95rem 1.35rem;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: #eef5ff;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.05);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  border-radius: 24px;
  padding: 1.15rem 1.25rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

const StatValue = styled.div`
  color: white;
  font-size: 2rem;
  font-weight: 800;
`;

const StatLabel = styled.div`
  margin-top: 0.45rem;
  color: rgba(237, 244, 252, 0.74);
  font-size: 0.95rem;
`;

const VisualPanel = styled.div`
  position: relative;
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
`;

const VisualCard = styled.div`
  position: relative;
  width: min(100%, 30rem);
  border-radius: 30px;
  overflow: hidden;
  background: #dde6f4;
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 28px 70px rgba(6, 17, 31, 0.34);
  align-self: end;
  min-height: 28rem;

  @media (max-width: 980px) {
    width: 100%;
    min-height: 20rem;
  }
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FloatingCard = styled.div`
  position: absolute;
  left: 1.5rem;
  bottom: 1.5rem;
  max-width: 16rem;
  border-radius: 24px;
  padding: 1rem 1.1rem;
  background: rgba(248, 251, 255, 0.92);
  color: #16263e;
  box-shadow: 0 16px 34px rgba(16, 31, 52, 0.18);
  backdrop-filter: blur(10px);
`;

const FloatingLabel = styled.div`
  color: #53657c;
  font-size: 0.83rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
`;

const FloatingTitle = styled.div`
  margin-top: 0.45rem;
  font-size: 1.2rem;
  font-weight: 800;
`;

const FloatingText = styled.div`
  margin-top: 0.45rem;
  color: #586a7e;
  line-height: 1.6;
  font-size: 0.92rem;
`;

function Hero() {
  const { user } = useContext(UserContext);
  const isAdmin = user?.role === "admin";

  return (
    <HeroShell>
      <Glow />
      <Content>
        <Eyebrow>Enterprise Property Operations</Eyebrow>
        <Title>
          Modern rent management for <Accent>premium portfolios</Accent>
        </Title>
        <Description>
          {BRAND_NAME} brings leasing, apartment inventory, tenant records,
          bookings, payments, receipts, and maintenance follow-up into one
          refined operating platform for professional property teams.
        </Description>
        <ActionRow>
          <PrimaryAction to="/property">Explore Availability</PrimaryAction>
          <SecondaryAction to={isAdmin ? "/operations" : "/login"}>
            {isAdmin ? "Open Admin Workspace" : "Access Client Portal"}
          </SecondaryAction>
        </ActionRow>
        <StatsGrid>
          {HERO_STATS.map((stat) => (
            <StatCard key={stat.label}>
              <StatValue>
                <CountUp start={stat.start} end={stat.end} duration={2.4} separator="," />
                +
              </StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      </Content>

      <VisualPanel>
        <VisualCard>
          <HeroImage src="/hero-image-12.png" alt="Executive apartment interior" />
          <FloatingCard>
            <FloatingLabel>Live Portfolio View</FloatingLabel>
            <FloatingTitle>From lead to lease in one workspace</FloatingTitle>
            <FloatingText>
              Track room availability, approve reservations, monitor arrears,
              and resolve maintenance requests with executive clarity.
            </FloatingText>
          </FloatingCard>
        </VisualCard>
      </VisualPanel>
    </HeroShell>
  );
}

export default Hero;
