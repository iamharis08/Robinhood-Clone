import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import closeImg from "../../css/images/close.svg";
import { fetchDeleteWatchlist } from "../../store/lists";

function DeleteWatchlistModal({ setShowDeleteModal, listId }) {
  const dispatch = useDispatch();


  const handleSubmit = (e) => {


    e.preventDefault();
    dispatch(fetchDeleteWatchlist(listId))
    .then(() => setShowDeleteModal(false))
  };


  return (
    <div className="delete-form-container">
      <div className="delete-form-header">
        <div className="delete-title">Delete</div>
        <div className="close-delete-modal">
          <img src={closeImg} alt="close" />
        </div>
      </div>
      <div className="delete-form">
        <div className="watchlist-icon">
          <img
            src={"https://cdn.robinhood.com/emoji/v0/128/1f4a1.png"}
            alt="bulb"
          />
        </div>
          <button className="delete-list-submit" onClick={handleSubmit}>
            Delete
          </button>

      </div>
    </div>
  );
}

export default DeleteWatchlistModal;
