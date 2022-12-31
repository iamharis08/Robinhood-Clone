import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import "../../css/NavBar.css";
// import logoIcon from "../../css/images/risinghoodblackicon.png";
// import HomeNavBar from "./HomeNavBar";
import "../../css/HomePage.css";
import "../../css/Watchlists.css"
import editImg from "../../css/images/edit.svg"
import { fetchAllWatchlists } from "../../store/lists";


const Watchlists = () => {
  const dispatch = useDispatch()
  const watchlists = useSelector(state => state.lists.watchlists)
  const [hoveredList, setHoveredList] = useState(null);

  useEffect(() => {
    dispatch(fetchAllWatchlists())

  }, []);

  const watchlistsComponents = Object.values(watchlists)?.map((watchlist, index) => {

    return (
      <div key={watchlist.id}
      onMouseEnter={() => setHoveredList(index)}
      onMouseLeave={() => setHoveredList(null)}
      >
        <div className="watchlist-container">
          <div className="watchlist_header">
            <div className="watchlist_name">
              <div className="bulb"><img src={"https://cdn.robinhood.com/emoji/v0/128/1f4a1.png"} alt="bulb" /></div>
            {watchlist.watchlistName}
            </div>
            {hoveredList === index && <div className="watchlist_edit_button"><button><img src={editImg} alt="edit" /></button></div>}
          </div>
        </div>
      </div>
    );
  });

  return (

    <div className="lists-container">
      <div className="stocks-list">
        <div className="header-title">
            <div className="header-text">Stocks</div>
        </div>
        <div className="user-stocks">

        </div>
      </div>
      <div className="stocks-list">
        <div className="header-title">
            <div className="header-text">Lists</div>
        </div>
        <div className="watchlists">
        {watchlistsComponents}
      </div>
      </div>

    </div>
  );
};

export default Watchlists;
