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
import addImg from "../../css/images/add.svg";
import { fetchAddWatchlist, fetchAllWatchlists } from "../../store/lists";

const Watchlists = () => {
  const dispatch = useDispatch();
  const watchlists = useSelector((state) => state.lists.watchlists);
  const [hoveredList, setHoveredList] = useState(null);
  const [isClicked, setIsClicked] = useState([]);
  const [listName, setListName] = useState("");
  const [clickedList, setClickedList] = useState(null);
  const [isAddingWatchlist, setIsAddingWatchlist] = useState(false);
  const [showEditWatchlistMenu, setshowEditWatchlistMenu] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    dispatch(fetchAllWatchlists());
  }, []);

  // const handleClick = (e) => {
  //   e.stopPropagation();
  //   if (showEditWatchlistMenu) return;
  //   setshowEditWatchlistMenu(true);
  //   setClickedList(index);
  // };

  useEffect(() => {
    if (!showEditWatchlistMenu) {
      return;
    }
    const closeMenu = () => {
      setshowEditWatchlistMenu(false);
    };

    // click event listener to whole doc -- if we click on page it will run
    // closeMenu!! -- really sets 'setShowMenu' to false or our slice of state on showing menu
    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showEditWatchlistMenu]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);

    if (stringCheck(listName)) {
      let name = inputReducer(listName);

      return dispatch(fetchAddWatchlist(name))
        .then(() => {
          setIsAddingWatchlist(false);
          setListName("");
        })
        .catch(async (res) => {
          const data = await res.json();
          if (data) setErrors(Object.values(data));
          else return setIsAddingWatchlist(false);
        });
    } else {
      setErrors(["Name needs to be at least three characters"]);
    }
  };

  const stringCheck = (str) =>
    str
      .split(" ")
      .filter((c) => c !== "")
      .join("").length >= 3;

  const inputReducer = (str) => str.replace(/\s+/g, " ").trim();

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
            {clickedList === index && showEditWatchlistMenu && (
                  <div className="edit-dropdown" onClick={(e) => {
                    e.stopPropagation()}}>
                    <div className="edit-list">Edit list</div>
                    <div className="delete-list">Delete list</div>
                  </div>
                )}
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setshowEditWatchlistMenu(!showEditWatchlistMenu);
                      setClickedList(index);
                    }}
                  >
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
                  <div className="watchlist-name stocks">
                    {stock.stock_symbol}{" "}
                  </div>
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
          <div
            className="add-watchlist-button"
            onClick={() => setIsAddingWatchlist(true)}
          >
            <img src={addImg} alt="add" />
          </div>
        </div>
        {isAddingWatchlist && (
          <div className="add-watchlist-container">
            <div className="watchlist-form">
              <div className="bulb">
                <img
                  src={"https://cdn.robinhood.com/emoji/v0/128/1f4a1.png"}
                  alt="bulb"
                />
              </div>
              <form onSubmit={handleSubmit}>
                <input
                  placeholder="List Name"
                  minlength="3"
                  maxlength="20"
                  type="text"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  required
                />
                <div
                  className="cancel-add-list"
                  onClick={() => setIsAddingWatchlist(false)}
                >
                  Cancel
                </div>
                <button className="add-list-submit" type="submit">
                  Create List
                </button>
              </form>
            </div>
          </div>
        )}
        <div className="watchlists">{watchlistsComponents}</div>
      </div>
    </div>
  );
};

export default Watchlists;
