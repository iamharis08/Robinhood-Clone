import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import closeImg from "../../css/images/close.svg";
import { fetchAllWatchlists, fetchAddWatchlistStocks, fetchDeleteWatchlistStocks } from "../../store/lists";
import "../../css/WatchlistStockModal.css";
import uncheckedImg from "../../css/images/unchecked.svg";
import checkedImg from "../../css/images/check.svg";

function WatchlistStockModal({ setShowAddModal, stockSymbol, hasStock }) {
  console.log(hasStock, "HASSSSSS TOCKKkk")
  const dispatch = useDispatch();
  const watchlists = useSelector((state) => state.lists.watchlists);
  const [newListName, setNewListName] = useState("");
  // const [hasStock, setHasStock] = useState([]);
  const [isClicked, setIsClicked] = useState([]);

  console.log(isClicked, "ISCLICKEDDDDDDDD")
  useEffect(() => {

    const storedHasStock = localStorage.getItem("hasStock");
    if (!hasStock && storedHasStock) {
      setIsClicked(JSON.parse(storedHasStock));
    }
  }, []);

  useEffect(() => {

    localStorage.setItem("hasStock", JSON.stringify(hasStock));
  }, [stockSymbol]);

  useEffect(() => {

    setIsClicked(hasStock);
  }, [hasStock]);

  useEffect(() => {

    dispatch(fetchAllWatchlists());

  }, []);

  // useEffect(() => {


  // }, [hasStock]);

  // useEffect(() => {

  // }, [isClicked])



  const handleSubmit = (e) => {
    e.preventDefault();
    let watchlist_array = Object.values(watchlists).map((watchlist) => watchlist.id)
   let removeStocksFromWatchlists = watchlist_array.filter(id => !isClicked.includes(id))

   dispatch(fetchAddWatchlistStocks(isClicked, stockSymbol)).then(() => dispatch(fetchDeleteWatchlistStocks(removeStocksFromWatchlists, stockSymbol)))

   .then(() => setShowAddModal(false))
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
        <div key={watchlist.id}>
          <div
            className="watchlist-checkbox-container"
            onClick={() => {
              console.log(isClicked.filter((element) => element !== watchlist.id), watchlist.id, "CLEARRRCHECKKKK")
              if (!isClicked.includes(watchlist.id)) {
                setIsClicked([...isClicked, watchlist.id]);
              } else
                setIsClicked(isClicked.filter((element, i) => element !== watchlist.id));
            }}
          >
            <div className="checkbox">
              {isClicked.includes(watchlist.id) ? (
                <img src={checkedImg} alt="checked" />
              ) : (
                <img src={uncheckedImg} alt="unchecked" />
              )}
            </div>
            <div className="add-watchlist-icon">
              <img
                src={"https://cdn.robinhood.com/emoji/v0/128/1f4a1.png"}
                alt="bulb"
              />
            </div>
            <div className="name-watchlist">{watchlist.watchlistName}</div>
          </div>
        </div>
      );
    }
  );

  return (
    <div className="add-stock-container">
      <div className="add-stock-header">
        <div className="add-stock-title">Add {stockSymbol} to Your Lists</div>
        <div className="close-stock-modal" onClick={() => setShowAddModal(false)}>
          <img src={closeImg} alt="close" />
        </div>
      </div>

      <div className="add-watchlists-container">{watchlistsComponents}</div>
      <button className="edit-list-submit" onClick={handleSubmit}>
        Save Changes
      </button>
    </div>
  );
}

export default WatchlistStockModal;
