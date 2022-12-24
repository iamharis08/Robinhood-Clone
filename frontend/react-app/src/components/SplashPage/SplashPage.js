import React from "react";
import { NavLink } from "react-router-dom";
import NavBar from "./NavBar";
import "../../css/SplashPage.css"

const SplashPage = () => {
  return (
    <div className="splash-page">
      <div className="nav">
        <NavBar />
      </div>
        <div className="splash-video-container">
        <video className="splash-video" src={"https://cdn.robinhood.com/assets/generated_assets/brand/_next/static/images/retirement-hero-hq__67df1aeb147a73f52166e1f391f37f0e.mp4"} width="600" height="300" controls="" autoplay="true" />
        </div>
    </div>
  );
};

export default SplashPage;
