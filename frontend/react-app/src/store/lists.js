
const GET_WATCHLISTS = 'watchlists/GET_WATCHLISTS';


const getAllWatchlists = (watchlists) => ({
    type: GET_WATCHLISTS,
    watchlists
})


export const fetchAllWatchlists = () => async (dispatch) => {
    const response = await fetch('/api/watchlists/', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      const data = await response.json();
      if (data.errors) {
        return;
      }

      dispatch(getAllWatchlists(data));
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
        let normalized_lists = normalize(action.watchlists.watchlists)
        console.log(normalized_lists, "NORMALIZESDDDDDDDDDDDDDDD")
        return { ...state, watchlists:{...normalized_lists} }
      }
      default:
        return state;
    }
  }
