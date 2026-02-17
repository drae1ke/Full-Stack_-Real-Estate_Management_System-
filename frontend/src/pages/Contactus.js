import React from "react";
import styled from "styled-components";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

// Define styled components for the title, paragraphs, and container
const ContactFormContainer = styled.div`
  background-color: #E6E6FA;
  padding: 40px;
  border-radius: 10px;
  max-width: 1200px;
  margin: 50px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
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

// Enhanced Contactus component with styled components
function Contactus() {
  return (
    <ContactFormContainer>
      <Title>Contact Us</Title>
      <ContactDetails>
        <ContactItem>
          <Icon><FaEnvelope /></Icon>
          <Paragraph>Email: L’Espace@gmail.com</Paragraph>
        </ContactItem>
        <ContactItem>
          <Icon><FaPhone /></Icon>
          <Paragraph>Phone Number: 0190001010</Paragraph>
        </ContactItem>
        <ContactItem>
          <Icon><FaMapMarkerAlt /></Icon>
          <Paragraph>Dhaka Uttara</Paragraph>
        </ContactItem>
      </ContactDetails>
      <Paragraph>You can call us Saturday to Thursday, 9AM to 5PM.</Paragraph>
      <Paragraph>Feel free to give us a call. We'd love to hear from you!</Paragraph>

      <SectionTitle>How We Started</SectionTitle>
      <Paragraph>
        L’Espace is a Bangladeshi company with a vision to revolutionize the real estate market. Our journey began with a small team of dedicated professionals who shared a common goal: to make property management more accessible and efficient for everyone.
      </Paragraph>

      <SectionTitle>Our Vision</SectionTitle>
      <Paragraph>
        At L’Espace, we aim to become the leading real estate management platform in Bangladesh. Our vision is to provide seamless, transparent, and reliable services that cater to all aspects of property management. We strive to empower property owners and tenants with the tools they need to make informed decisions.
      </Paragraph>

      <SocialLinks>
        <SocialLink href="https://facebook.com/" target="_blank"><FaFacebook /></SocialLink>
        <SocialLink href="https://twitter.com" target="_blank"><FaTwitter /></SocialLink>
        <SocialLink href="https://linkedin.com" target="_blank"><FaLinkedin /></SocialLink>
      </SocialLinks>
    </ContactFormContainer>
  );
}

export default Contactus;
