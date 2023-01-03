import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import closeImg from "../../css/images/close.svg";
import { fetchAllWatchlists } from "../../store/lists";
import "../../css/WatchlistStockModal.css";

function WatchlistStockModal({ setShowAddModal, stockSymbol }) {
  const dispatch = useDispatch();
  const watchlists = useSelector((state) => state.lists.watchlists);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    dispatch(fetchAllWatchlists());
  }, []);

  // const handleSubmit = (e) => {
  //   if (!stringCheck(newListName)) return;

  //   e.preventDefault();
  //   dispatch(fetchUpdateWatchlist(inputReducer(newListName))).then(() =>
  //     setShowAddModal(false)
  //   );
  // };

  const stringCheck = (str) =>
    str
      .split(" ")
      .filter((c) => c !== "")
      .join("").length >= 3;
  const inputReducer = (str) => str.replace(/\s+/g, " ").trim();

  const watchlistsComponents = Object.values(watchlists)?.map(
    (watchlist, index) => {
      return (
        <div key={watchlist.id}>
          <div className="watchlist-checkbox-container">
            <div className="add-watchlist-icon">
              <img
                src={"https://cdn.robinhood.com/emoji/v0/128/1f4a1.png"}
                alt="bulb"
              />
            </div>
          </div>
        </div>
      );
    }
  );

  return (
    <div className="add-stock-container">
      <div className="add-stock-header">
        <div className="add-stock-title">Add {stockSymbol} to Your Lists</div>
        <div className="close-stock-modal">
          <img id="close" src={closeImg} alt="close" />
        </div>
      </div>

      <div className="add-watchlists-container">
        {watchlistsComponents}
        <button className="edit-list-submit" type="submit">
          Save
        </button>
      </div>
    </div>
  );
}

export default WatchlistStockModal;
