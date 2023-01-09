import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import closeImg from "../../css/images/close.svg";
import { fetchUpdateWatchlist } from "../../store/lists";
import "../../css/Watchlists.css"

function EditWatchlistModal({ setShowEditModal, listId }) {
  const dispatch = useDispatch();
  const [newListName, setNewListName] = useState("");

  const handleSubmit = (e) => {
    if(!stringCheck(newListName)) return

    e.preventDefault();
    dispatch(fetchUpdateWatchlist(inputReducer(newListName), listId))
    .then(() => setShowEditModal(false))
  };

  const stringCheck = str => str.split(' ').filter(c => c !== '').join('').length >= 3
  const inputReducer = str => str.replace(/\s+/g, ' ').trim()

  return (
    <div className="edit-form-container">
      <div className="edit-form-header">
        <div className="edit-title">Edit</div>
        {/* <div className="close-edit-modal">
          <img src={closeImg} alt="close" />
        </div> */}
      </div>
      <div className="edit-form">

        <form onSubmit={handleSubmit}>
          <div className="bulb-input-container">
        <div className="bulb edit">
          <img
            src={"https://cdn.robinhood.com/emoji/v0/128/1f4a1.png"}
            alt="bulb"
          />
        </div>
          <input
            placeholder="List Name"
            minlength="3"
            maxlength="20"
            type="text"
            name="edit"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            required
          />
          </div>
          <div className="submit-button-edit">
          <button className="edit-list-submit edit" type="submit">
            Save
          </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditWatchlistModal;
