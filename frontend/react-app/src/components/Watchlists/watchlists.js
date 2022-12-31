import React from "react";
import { NavLink } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import "../../css/NavBar.css";
// import logoIcon from "../../css/images/risinghoodblackicon.png";
// import HomeNavBar from "./HomeNavBar";
import "../../css/HomePage.css";
import "../../css/Watchlists.css"
const Watchlists = () => {
  return (
    <div className="lists-container">
      <div className="stocks-list">
        <div className="stocks-title">
            <div className="stock-title-text">Stock</div>
        </div>
        <div className="user-stocks">

        </div>
      </div>
      <div className="watchlists">
        
      </div>
    </div>
  );
};

export default Watchlists;
