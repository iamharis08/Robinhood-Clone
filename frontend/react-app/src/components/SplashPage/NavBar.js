import React from "react";
import { NavLink } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import "../../css/NavBar.css"
import logoIcon from "../../css/images/risinghoodblackicon.png"

const NavBar = () => {
  return (
    <nav>
      <div className="nav-container">
        <div className="left-nav-container">
          <div className="logo-container">
            <div id='splash-logo'>Risinghood <img src={logoIcon} alt='logo' /> </div>
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
        <div className="right-nav-container">
          <NavLink className="login" to='/login'> Log in</NavLink>

          <NavLink className="signup" to='/sign-up'> Sign up</NavLink>
         
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
