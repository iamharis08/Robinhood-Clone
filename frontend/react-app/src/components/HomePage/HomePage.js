import React from "react";
import { NavLink } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import "../../css/NavBar.css"
import logoIcon from "../../css/images/risinghoodblackicon.png"
import HomeNavBar from "./HomeNavBar";

const HomePage = () => {
  return (
    <div className="home-container">
        <HomeNavBar />
    </div>
  );
};

export default HomePage;
