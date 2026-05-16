import React from "react";
import Companies from "../Components/Companies/Companies";
import GetStarted from "../Components/GetStarted/GetStarted";

import Hero from "../Components/Hero/Hero";

const Website = () => {
  return (
    <div className="App">
      <div>
        <div className="white-gradient" />
        <Hero />
      </div>
      <Companies />
          {/* <Contact />        */}
      <GetStarted />
    </div>
  );
};

export default Website;
