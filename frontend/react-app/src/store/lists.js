
const GET_WATCHLISTS = 'watchlists/GET_WATCHLISTS';
const ADD_WATCHLIST = 'watchlists/ADD_WATCHLIST';

const getAllWatchlists = (watchlists) => ({
    type: GET_WATCHLISTS,
    watchlists
})

const addOneWatchlist = (watchlist) => ({
  type: ADD_WATCHLIST,
  watchlist
})


export const fetchAllWatchlists = () => async (dispatch) => {
    const response = await fetch('/api/watchlists/');
    console.log("HITTTTTTTTTTTTTTTTTT")
    if (response.ok) {
      const data = await response.json();
      if (data.errors) {
        return;
      }

      dispatch(getAllWatchlists(data));
    }
  }

  export const fetchAddWatchlist = (name) => async (dispatch) => {
    const response = await fetch('/api/watchlists/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: name}),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.errors) {
        return;
      }
      dispatch(fetchAllWatchlists());
    }
  }

  export const fetchUpdateWatchlist = (name, listId) => async (dispatch) => {
    const response = await fetch(`/api/watchlists/${listId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: name}),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.errors) {
        return;
      }
      dispatch(fetchAllWatchlists());
    }
  }

  export const fetchDeleteWatchlist = (listId) => async (dispatch) => {
    const response = await fetch(`/api/watchlists/${listId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      const data = await response.json();
      if (data.errors) {
        return;
      }
      dispatch(fetchAllWatchlists());
    }
  }

  export const fetchAddWatchlistStocks = (watchlistArray, stockSymbol) => async (dispatch) => {

    const response = await fetch(`/api/watchlists/stocks/${stockSymbol}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ array: JSON.stringify(watchlistArray) }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data, "WORKKKKKKKSS RESPONSEEEE")
      if (data.errors) {
        return;
      }
      dispatch(fetchAllWatchlists());
    }
  }
  export const fetchDeleteWatchlistStocks = (watchlistArray, stockSymbol) => async (dispatch) => {
    const response = await fetch(`/api/watchlists/stocks/${stockSymbol}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ array: JSON.stringify(watchlistArray) }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.errors) {
        return;
      }
      dispatch(fetchAllWatchlists());
    }
  }


// Normalization function

const normalize = (dataArray) => {   //{'1': message1, '2': message2}
  let newObj = {}
  dataArray.forEach(watchlist => {
  newObj[watchlist.id] = watchlist
})
 return newObj
}

  const initialState = {watchlists: {}}

  export default function reducer(state = initialState, action) {
    switch (action.type) {
      case GET_WATCHLISTS:{
        let normalizedLists = normalize(action.watchlists.watchlists)
        console.log(normalizedLists, "NORMALIZESDDDDDDDDDDDDDDD")
        return { ...state, watchlists:{...normalizedLists} }
      }
      case ADD_WATCHLIST:{
        // let normalized_list = normalize(action.watchlist.watchlist)

        return { ...state, watchlists:{...state.watchlists, [action.watchlist.watchlist?.id]: action.watchlist.watchlist} }
      }
      default:
        return state;
    }
  }
