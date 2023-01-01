import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import "../../css/NavBar.css";
// import logoIcon from "../../css/images/risinghoodblackicon.png";
// import HomeNavBar from "./HomeNavBar";
import "../../css/HomePage.css";
import "../../css/Watchlists.css";
import editImg from "../../css/images/edit.svg";
import arrowImg from "../../css/images/arrow.svg";

import { fetchAllWatchlists } from "../../store/lists";

const Watchlists = () => {
  const dispatch = useDispatch();
  const watchlists = useSelector((state) => state.lists.watchlists);
  const [hoveredList, setHoveredList] = useState(null);
  const [isClicked, setIsClicked] = useState([]);

  useEffect(() => {
    dispatch(fetchAllWatchlists());
  }, []);

  const watchlistsComponents = Object.values(watchlists)?.map(
    (watchlist, index) => {
      return (
        <div
          key={watchlist.id}
          onMouseEnter={() => setHoveredList(index)}
          onMouseLeave={() => setHoveredList(null)}
        >
          <div
            className="watchlist-header"
            onClick={() => {
              if (!isClicked.includes(index)) {
                setIsClicked([...isClicked, index]);
              } else {
                let i = isClicked.indexOf(index);
                let removedIndex = isClicked;
                removedIndex.splice(i, 1);
                setIsClicked([...removedIndex]);
              }
            }}
          >
            <div className="watchlist-name">
              <div className="bulb">
                <img
                  src={"https://cdn.robinhood.com/emoji/v0/128/1f4a1.png"}
                  alt="bulb"
                />
              </div>
              {watchlist.watchlistName}
            </div>
            <div className="watchlist-buttons">
              {hoveredList === index && (
                <div className="watchlist-edit-button">
                  <button>
                    <img src={editImg} alt="edit" />
                  </button>
                </div>
              )}
              <div className="watchlist-arrow">
                <img src={arrowImg} />
              </div>
            </div>
          </div>
          {isClicked.includes(index) &&
            watchlist.stocks.map((stock, index) => {
              return (
                <div key={index} className="watchlist-header">
                  <div className="watchlist-name stocks">{stock.stock_symbol} </div>

                </div>
              );
            })}
        </div>
      );
    }
  );

  return (
    <div className="lists-container">
      <div className="stocks-list">
        <div className="header-title">
          <div className="header-text">Stocks</div>
        </div>
        <div className="user-stocks"></div>
      </div>
      <div className="stocks-list">
        <div className="header-title">
          <div className="header-text">Lists</div>
        </div>
        <div className="watchlists">{watchlistsComponents}</div>
      </div>
    </div>
  );
};

export default Watchlists;
