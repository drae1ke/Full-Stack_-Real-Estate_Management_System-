import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  BRAND_NAME,
  CONTACT_DETAILS,
  SITE_LOCATION,
} from "../../utils/siteContent";

const FooterShell = styled.footer`
  margin-top: 2rem;
  margin-bottom: 1.5rem;
  border-radius: 32px;
  padding: 2rem;
  background:
    radial-gradient(circle at top right, rgba(212, 184, 118, 0.18), transparent 36%),
    linear-gradient(135deg, #132239 0%, #203654 100%);
  color: white;
  box-shadow: 0 24px 60px rgba(12, 26, 47, 0.18);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr 0.8fr;
  gap: 1.5rem;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.15rem;
`;

const Brand = styled.div`
  font-family: "Fraunces", Georgia, serif;
  font-size: 2rem;
  font-weight: 800;
`;

const Text = styled.p`
  margin: 0.8rem 0 0;
  color: rgba(237, 243, 251, 0.78);
  line-height: 1.75;
`;

const LinkList = styled.div`
  display: grid;
  gap: 0.65rem;
  margin-top: 1rem;
`;

const FooterLink = styled(Link)`
  color: rgba(237, 243, 251, 0.86);
  width: fit-content;
`;

function Footer() {
  return (
    <FooterShell>
      <Grid>
        <div>
          <Brand>{BRAND_NAME}</Brand>
          <Text>
            A more professional property management platform for bookings,
            leasing, payments, and maintenance across modern rental portfolios.
          </Text>
        </div>

        <div>
          <Title>Platform</Title>
          <LinkList>
            <FooterLink to="/property">Availability</FooterLink>
            <FooterLink to="/dashboard">Dashboard</FooterLink>
            <FooterLink to="/operations">Operations</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
          </LinkList>
        </div>

        <div>
          <Title>Contact</Title>
          <Text>{SITE_LOCATION}</Text>
          <Text>{CONTACT_DETAILS.phone}</Text>
          <Text>{CONTACT_DETAILS.email}</Text>
        </div>
      </Grid>
    </FooterShell>
  );
}

export default Footer;
