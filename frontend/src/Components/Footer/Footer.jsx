import React from "react";
import "./Footer.css";
import { useNavigate } from "react-router-dom";
const Footer = () => {
  const navigate = useNavigate();
  return (   
    <div className="f-wrapper">
      <div className="paddings innerWidth flexCenter f-container">
        {/* left side */}
        <div className="flexColStart f-left">
          <img className="footer-logo" src="./logo_1.2.png" alt="" width={250} />
          <span className="secondaryText">
          Your next dream house finder  <br />
           and dream builder
          </span>
        </div>

        <div className="flexColStart f-right">
          <span className="primaryText">Information</span>
          <span className="secondaryText">Dhaka, Uttara</span>
          <div className="flexCenter f-menu">
            <span onClick={() => navigate("/property")}>Property</span>
            <span onClick={() => navigate("contact")}>Services</span>
            <span onClick={() => navigate("contact")}>About Us</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
