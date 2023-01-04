
const GET_STOCK = 'stocks/GET_STOCK';
const CLEAR_STOCK = 'stocks/CLEAR_STOCK';
const FIND_STOCKS = 'stocks/FIND_STOCKS'

const getStockInfo = (stockInfo) => ({
    type: GET_STOCK,
    stockInfo
})

const findStocks = (stocks) => ({
    type: GET_STOCK,
    stocks
})


export const clearStockInfo = () => ({
    type: CLEAR_STOCK
})

export const fetchStockInfo = (stockSymbol) => async (dispatch) => {
    const response = await fetch(`/api/stocks/${stockSymbol}`);
    if (response.ok) {
      const data = await response.json();
      if (data.errors) {
        return;
      }

      dispatch(getStockInfo(data));
    }
  }

export const fetchStockSearch = (name) => async (dispatch) => {
  const response = await fetch(`/api/stocks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: name }),
  });
    if (response.ok) {
      const data = await response.json();
      if (data.errors) {
        return;
      }

      dispatch(findStocks(data));
    }
  }


// Normalization function

// const normalize = (dataArray) => {   //{'1': message1, '2': message2}
//   let newObj = {}
//   dataArray.forEach(watchlist => {
//   newObj[watchlist.id] = watchlist
// })
//  return newObj
// }

  const initialState = {stockInfo: {}, searchedStocks: {}}

  export default function reducer(state = initialState, action) {
    switch (action.type) {
      case GET_STOCK:{

        return { ...state, stockInfo:{...action.stockInfo} }
      }
      case CLEAR_STOCK:{

        return { ...state, stockInfo:{} }
      }
      case FIND_STOCKS:{

        return { ...state, searchedStocks: action.stocks }
      }
      default:
        return state;
    }
  }
