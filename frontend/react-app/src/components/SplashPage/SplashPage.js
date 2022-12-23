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
        <div className="splash-video">

        </div>
    </div>
  );
};

export default SplashPage;
