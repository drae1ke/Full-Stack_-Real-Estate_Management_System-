import React from "react";
import styled from "styled-components";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import {
  BRAND_NAME,
  CONTACT_DETAILS,
  SITE_REGION,
} from "../utils/siteContent";

const ContactFormContainer = styled.div`
  background-color: #e6e6fa;
  padding: 40px;
  border-radius: 10px;
  max-width: 1200px;
  margin: 50px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: "Arial", sans-serif;
`;

const Title = styled.h2`
  font-size: 2.5em;
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 1.8em;
  color: #333;
  margin-top: 30px;
  margin-bottom: 10px;
`;

const Paragraph = styled.p`
  font-size: 1.2em;
  line-height: 1.6;
  margin-bottom: 20px;
  color: #555;
`;

const ContactDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #333;
`;

const Icon = styled.div`
  margin-right: 10px;
  color: #007bff;
  font-size: 1.5em;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const SocialLink = styled.a`
  display: inline-block;
  margin: 0 10px;
  color: #007bff;
  font-size: 1.5em;
  text-decoration: none;

  &:hover {
    color: #0056b3;
  }
`;

function Contactus() {
  return (
    <ContactFormContainer>
      <Title>Contact Us</Title>
      <ContactDetails>
        <ContactItem>
          <Icon>
            <FaEnvelope />
          </Icon>
          <Paragraph>Email: {CONTACT_DETAILS.email}</Paragraph>
        </ContactItem>
        <ContactItem>
          <Icon>
            <FaPhone />
          </Icon>
          <Paragraph>Phone Number: {CONTACT_DETAILS.phone}</Paragraph>
        </ContactItem>
        <ContactItem>
          <Icon>
            <FaMapMarkerAlt />
          </Icon>
          <Paragraph>{CONTACT_DETAILS.address}</Paragraph>
        </ContactItem>
      </ContactDetails>
      <Paragraph>You can call us {CONTACT_DETAILS.supportHours}.</Paragraph>
      <Paragraph>Feel free to give us a call. We'd love to hear from you!</Paragraph>

      <SectionTitle>How We Started</SectionTitle>
      <Paragraph>
        {BRAND_NAME} is a Kenyan real estate platform built to make property
        discovery and management easier for buyers, renters, and property
        owners. We started with a simple goal: create a clearer way to search,
        compare, and manage listings across the country.
      </Paragraph>

      <SectionTitle>Our Vision</SectionTitle>
      <Paragraph>
        At {BRAND_NAME}, we want to become one of the most trusted real estate
        management platforms in {SITE_REGION}. Our focus is on transparent
        listings, practical admin tools, and reliable experiences that help
        people make better property decisions.
      </Paragraph>

      <SocialLinks>
        <SocialLink href="https://facebook.com/" target="_blank" rel="noreferrer">
          <FaFacebook />
        </SocialLink>
        <SocialLink href="https://twitter.com" target="_blank" rel="noreferrer">
          <FaTwitter />
        </SocialLink>
        <SocialLink href="https://linkedin.com" target="_blank" rel="noreferrer">
          <FaLinkedin />
        </SocialLink>
      </SocialLinks>
    </ContactFormContainer>
  );
}

export default Contactus;
