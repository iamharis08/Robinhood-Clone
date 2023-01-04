import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import HomeNavBars from "../../css/HomeNavBar.css";
import logoIcon from "../../css/images/risinghoodblackicon.png";
import searchIcon from "../../css/images/searchIcon.svg";
import { fetchStockSearch } from "../../store/stocks";

const HomeNavBar = () => {
  const dispatch = useDispatch();
  const [searchName, setSearchName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => {
    dispatch(fetchStockSearch(searchName));
  }, [searchName]);

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    const closeMenu = (event) => {
      if (event.target.tagName !== 'INPUT') {
        setIsFocused(false);
      }
    };

    // click event listener to whole doc -- if we click on page it will run
    // closeMenu!! -- really sets 'setShowMenu' to false or our slice of state on showing menu
    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [isFocused]);

  return (
    <div className="home-nav-container">
      <div className="home-logo-container">
        <NavLink to="/home">
          <img src={logoIcon} alt="logo" />
        </NavLink>
      </div>

      <div className="home-search-bar-container">
        <div className="home-search-bar">
          <div className="home-left-search-box">
            <img src={searchIcon} alt="search" />
          </div>
          <div className="home-main-search-input">
            <form>
              <label></label>

              <input
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                  }
                }}
                ref={inputRef}
                name={
                  searchName && isFocused ? "expanded-search-bar" : "search-bar"
                }
                placeholder="Search"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onClick={() => {
                  const selectedInput = document.getElementById('myInput');
                  if (document.activeElement === inputRef.current){
                    setIsFocused(true)
                  }
                }}
                autoComplete="off"
              />
            </form>
          </div>
          {searchName && isFocused && (
            <div className="stock-search-container"></div>
          )}
        </div>
      </div>
      <div className="home-nav-links">
        <NavLink className="home-link" to="/stocks/AAPL">
          Rewards
        </NavLink>
        <NavLink className="home-link" to="/stocks/TSLA">
          Investing
        </NavLink>
        <NavLink className="home-link" to="/stocks/GM">
          Spending
        </NavLink>
        <NavLink className="home-link" to="/stocks/GOOGL">
          Retirement
        </NavLink>
        <NavLink className="home-link" to="/stocks/AMC">
          Notifications
        </NavLink>
        <NavLink className="home-link" to="/stocks/GME">
          Account
        </NavLink>
      </div>
    </div>
  );
};

export default HomeNavBar;
