import { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import LoginForm from "../Components/LoginForm";
import SignUpFrom from "../Components/SignUpFrom";

const Page = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
  background:
    radial-gradient(circle at top right, rgba(212, 184, 118, 0.2), transparent 34%),
    linear-gradient(135deg, #132239 0%, #203654 100%);
`;

const Card = styled.section`
  width: min(100%, 64rem);
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-radius: 34px;
  overflow: hidden;
  background: white;
  box-shadow: 0 28px 80px rgba(7, 19, 35, 0.24);

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  padding: 2rem;
`;

const BrandPanel = styled(Panel)`
  background:
    radial-gradient(circle at top right, rgba(212, 184, 118, 0.18), transparent 34%),
    linear-gradient(135deg, #132239 0%, #203654 100%);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Eyebrow = styled.span`
  color: #f2d489;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.82rem;
`;

const Title = styled.h1`
  margin: 0.9rem 0 0;
  font-size: clamp(2rem, 4vw, 3.3rem);
  line-height: 1.04;
  font-family: "Fraunces", Georgia, serif;
`;

const Description = styled.p`
  margin: 1rem 0 0;
  color: rgba(237, 243, 251, 0.78);
  line-height: 1.75;
`;

const PortalTag = styled.div`
  width: fit-content;
  border-radius: 999px;
  padding: 0.65rem 0.9rem;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(237, 243, 251, 0.86);
  font-weight: 700;
  margin-top: 1.25rem;
`;

const HomeLink = styled(Link)`
  width: fit-content;
  min-height: 3rem;
  padding: 0 1.15rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  color: white;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
`;

const FormPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  justify-content: center;
`;

const FormTitle = styled.h2`
  margin: 0;
  color: #132239;
  font-size: 2rem;
`;

const Toggle = styled.button`
  border: none;
  background: none;
  padding: 0;
  color: #17345e;
  font-weight: 800;
  cursor: pointer;
  width: fit-content;
`;

function Login() {
  const [showRegistration, setShowRegistration] = useState(false);

  return (
    <Page>
      <Card>
        <BrandPanel>
          <div>
            <Eyebrow>Client and Admin Access</Eyebrow>
            <Title>Manage property relationships with more confidence</Title>
            <Description>
              Sign in to review availability, submit bookings, monitor rent
              records, and operate the full property management workspace from a
              cleaner, more professional interface.
            </Description>
            <PortalTag>Secure portfolio access</PortalTag>
          </div>
          <HomeLink to="/">Return to website</HomeLink>
        </BrandPanel>

        <FormPanel>
          <div>
            <FormTitle>{showRegistration ? "Create account" : "Welcome back"}</FormTitle>
          </div>

          {showRegistration ? (
            <SignUpFrom setSet={setShowRegistration} />
          ) : (
            <LoginForm />
          )}

          <Toggle onClick={() => setShowRegistration((current) => !current)}>
            {showRegistration
              ? "Already have an account? Sign in"
              : "Need an account? Register here"}
          </Toggle>
        </FormPanel>
      </Card>
    </Page>
  );
}

export default Login;
