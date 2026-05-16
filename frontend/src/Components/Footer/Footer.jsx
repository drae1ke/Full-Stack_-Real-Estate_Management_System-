import React from "react";
import "./Footer.css";
import { useNavigate } from "react-router-dom";
import { SITE_LOCATION } from "../../utils/siteContent";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="f-wrapper">
      <div className="paddings innerWidth flexCenter f-container">
        <div className="flexColStart f-left">
          <img className="footer-logo" src="./logo_1.2.png" alt="" width={250} />
          <span className="secondaryText">
            Your trusted guide for homes, land,
            <br />
            and commercial spaces in Kenya
          </span>
        </div>

        <div className="flexColStart f-right">
          <span className="primaryText">Information</span>
          <span className="secondaryText">{SITE_LOCATION}</span>
          <div className="flexCenter f-menu">
            <span onClick={() => navigate("/property")}>Properties</span>
            <span onClick={() => navigate("contact")}>Services</span>
            <span onClick={() => navigate("contact")}>About Us</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
