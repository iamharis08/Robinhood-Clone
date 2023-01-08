import React from "react";
import { NavLink } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import "../../css/NavBar.css"
import logoIcon from "../../css/images/risinghoodblackicon.png"
import HomeNavBar from "./HomeNavBar";
import "../../css/HomePage.css"
import Watchlists from "../Watchlists/watchlists";
import { useSelector } from "react-redux";
const HomePage = () => {
  const user = useSelector((state) => state.session.user);
  return (
    <div className="home-container">
      <div className="nav-bar-home">
        <HomeNavBar />
      </div>
        <div className="home-body-container">
          <div className="left-content">
            <div className="home-chart"></div>
            <div className="buying-power">
              Buying Power <span>${user.buying_power}</span>
            </div>
            <div className="buying-power">
             Trending List
            </div>
            <div className="buying-power">
              News
            </div>
            <div className="buying-power">
              News
            </div>
            <div className="buying-power">
              News
            </div>
            <div className="buying-power">
              News
            </div>
            <div className="buying-power">
              News
            </div>
            <div className="buying-power">
              News
            </div>
            <div className="buying-power">
              News
            </div>
            <div className="buying-power">
              News
            </div>
            <div className="buying-power">
              News
            </div>
            <div className="buying-power">
              News
            </div>
          </div>
          <Watchlists />
          {/* <div className="lists-container">
            <div className="stocks-list">
              <div className="stocks-title">Stock</div>

            </div>
          </div> */}
        </div>
    </div>

  );
};

export default HomePage;
