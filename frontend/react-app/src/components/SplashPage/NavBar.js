import React from "react";
import { NavLink } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import "../../css/NavBar.css";
import logoIcon from "../../css/images/risinghoodblackicon.png";
import github from "../../css/images/github.svg";

const NavBar = () => {
  return (
    <nav>
      <div className="nav-container">
        <div className="left-nav-container">
          <div className="logo-container">
            <NavLink to="/" id="splash-logo">
              Risinghood <img src={logoIcon} alt="logo" />{" "}
            </NavLink>
          </div>
          <div className="nav-links">
            <div className="haris-developer">
            <a href="https://github.com/iamharis08">
              <div className="github">
                <img
                  id="github-logo"
                  src={github}
                  alt=""
                ></img>

              <div className="haris-text">Haris Ahmed</div>
              </div>
              </a>
            </div>
            {/* <NavLink className="link" to='/'> Invest</NavLink>
            <NavLink className="link"to='/'> Crypto</NavLink>
            <NavLink className="link"to='/'> Retirement</NavLink>
            <NavLink className="link"to='/'> Cash Card</NavLink>
            <NavLink className="link"to='/'> Learn</NavLink>
            <NavLink className="link" to='/'> Snacks</NavLink>
            <NavLink className="link"to='/'> Support</NavLink> */}
          </div>
        </div>
        <div className="right-nav-container">
          <NavLink className="login" to="/login">
            {" "}
            Log in
          </NavLink>

          <NavLink className="signup" to="/sign-up">
            {" "}
            Sign up
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
