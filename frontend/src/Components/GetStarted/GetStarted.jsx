import React from "react";
import "./GetStarted.css";
import { BRAND_NAME } from "../../utils/siteContent";

const GetStarted = () => {
  return (
    <div id="get-started" className="g-wrapper">
      <div className="paddings innerWidth g-container">
        <div className="flexColCenter inner-container">
          <span className="primaryText">Get started with {BRAND_NAME}</span>
          <span className="secondaryText">
            Join us to discover verified listings and secure the right Kenyan
            property with more confidence.
            <br />
            Find your next home, plot, or workspace faster.
          </span>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
