import styled from "styled-components";
import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { TfiYoutube } from "react-icons/tfi";
import { ImMail } from "react-icons/im";

const FooterWrapper = styled.header`
  display: flex;
  height: 6rem;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 4.8rem;
  background-color: rgb(1, 50, 32);
  border-top: 1px solid rgb(0, 128, 0);

  @media (max-width: 1470px) {
    padding: 1rem;
    /* flex-direction: column; */
  }
`;
const Contact = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
`;

const Content1 = styled.div`
  color: white;
  display: flex;
  font-weight: bold;
  margin-left: 5rem;
  flex-direction: column;
  height: 4rem;
  margin-bottom: 1rem;
`;
const Content2 = styled.div`
  color: white;
  display: flex;
  margin-right: 5rem;
  flex-direction: column;
  gap: 0.2rem;
`;
const Icon = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`;
const StyledLink = styled.a`
  color: inherit;
  text-decoration: none;
  &:hover {
    color: #fff;
  }
`;

function Footer() {
  return (
    <FooterWrapper>
      <Content1>
        <div>About This Website</div>
        <div>Copyright Reserved &#169;</div>
        <div>Terms and condition</div>
        <div>Policy</div>
      </Content1>
      <Content2>
        <Contact>Contact Me</Contact>
        <Icon>
          <StyledLink
            href="https://www.facebook.com/najmul"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookSquare size={32} />
          </StyledLink>
          <StyledLink
            href="https://twitter.com/Najmul"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaSquareXTwitter size={32} />
          </StyledLink>
          <StyledLink
            href="mailto:Najmul@gmail.com?view=cm&fs=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ImMail size={32} />
          </StyledLink>
          <StyledLink
            href="https://www.youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TfiYoutube size={32} />
          </StyledLink>
        </Icon>
      </Content2>
    </FooterWrapper>
  );
}

export default Footer;
