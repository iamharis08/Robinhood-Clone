import React from "react";
import { NavLink } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import HomeNavBars from "../../css/HomeNavBar.css"
import logoIcon from "../../css/images/risinghoodblackicon.png"

const HomeNavBar = () => {
  return (
  <div className="home-nav-container">
        <div className="left-logo-container">
          <div className="logo-container">
             <NavLink to= '/home'><img src={logoIcon} alt='logo' /> </NavLink>
          </div>

          <div className="search-bar-container">
            <div className="search-bar">
                <div className='left-search-box'>
                </div>
                <div className="main-search-input">
                    <form>
                    <label></label>

                    <input
                    placeholder="Search"
                    />
                    </form>

                </div>
            </div>
          </div>
          <div className="nav-links">
            <NavLink className="link" to='/'> Invest</NavLink>
            <NavLink className="link"to='/'> Crypto</NavLink>
            <NavLink className="link"to='/'> Retirement</NavLink>
            <NavLink className="link"to='/'> Cash Card</NavLink>
            <NavLink className="link"to='/'> Learn</NavLink>
            <NavLink className="link" to='/'> Snacks</NavLink>
            <NavLink className="link"to='/'> Support</NavLink>
          </div>
        </div>
      </div>

  );
};

export default HomeNavBar;
