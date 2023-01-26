
const GET_STOCK = 'stocks/GET_STOCK';
const CLEAR_STOCK = 'stocks/CLEAR_STOCK';
const FIND_STOCKS = 'stocks/FIND_STOCKS'
const GET_LIVE_PRICE = 'stock/GET_LIVE_PRICE'
const GET_LIVE_PRICES = 'stock/GET_LIVE_PRICES'
const GET_HISTORICAL_DATA = 'stock/GET_HISTORICAL_DATA'
const CLEAR_HISTORICAL_DATA = 'stock/CLEAR_HISTORICAL_DATA'

const getStockInfo = (stockInfo) => ({
    type: GET_STOCK,
    stockInfo
})
const getHistoricalData = (stocksInfo) => ({
    type: GET_HISTORICAL_DATA,
    stocksInfo
})
export const clearHistoricalData = () => ({
    type: CLEAR_HISTORICAL_DATA,

})

const getLiveStockPrice = (liveStockPrice) => ({
    type: GET_LIVE_PRICE,
    liveStockPrice
})
const getLiveStocksPrices = (liveStocksPrices) => ({
    type: GET_LIVE_PRICES,
    liveStocksPrices
})

const findStocks = (stocks) => ({
    type: FIND_STOCKS,
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
export const fetchStockPrice = (stockSymbol) => async (dispatch) => {
    const response = await fetch(`/api/stocks/price/${stockSymbol}`);
    if (response.ok) {
      const data = await response.json();
      if (data.errors) {
        return;
      }
      console.log(data, "RESPONSEEEEEEEE")
      dispatch(getLiveStockPrice(data));
      return data
    }
  }
export const fetchStocksPrices = (stockSymbols) => async (dispatch) => {
  console.log(JSON.stringify({stock_symbols: JSON.stringify(stockSymbols)}), "STOCKARRAYYYYYY BEFOREEEEEEEEEEEEE")
    const response = await fetch(`/api/stocks/prices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({stock_symbols: JSON.stringify(stockSymbols)}),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.errors) {
        return;
      }
      console.log(data, "RESPONSEEEEEEEE")
      dispatch(getLiveStocksPrices(data));
    }
  }

export const fetchHistoricalData = (stocksInfo) => async (dispatch) => {
  console.log(JSON.stringify({stocks_info : JSON.stringify(stocksInfo)}), "STOCKARRAYYYYYY BEFOREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
    const response = await fetch(`/api/stocks/historical`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({stocks_info : JSON.stringify(stocksInfo)}),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data, "RESPONSEEEEEEEEDATAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
      if (data.errors) {
        return;
      }
      dispatch(getHistoricalData(data));
      return data
    }else {
      let newData = await response.json()
      console.log(newData, "RESPONSEEEEEEEEDATAAAAAAAAAAAAAAAAAAAAAAAAAAAANEWWWWWWWWWWWWW")

    }

  }

export const fetchStockSearch = (name) => async (dispatch) => {
  const response = await fetch(`/api/stocks/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: name }),
  });
  if (response.ok) {
    const data = await response.json();
    console.log(data, "RESPONSEEEEEEEEEEEEEEEE")
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

  const initialState = {stockInfo: {}, searchedStocks: {}, liveStockPrice: {}, liveStocksPrices: {}, historicalData: {}}

  export default function reducer(state = initialState, action) {
    switch (action.type) {
      case GET_STOCK:{

        return { ...state, stockInfo:{...action.stockInfo} }
      }
      case GET_LIVE_PRICE:{

        return { ...state, liveStockPrice: action.liveStockPrice }
      }
      case GET_LIVE_PRICES:{

        return { ...state, liveStocksPrices: action.liveStocksPrices.liveStockPrices }
      }
      case GET_HISTORICAL_DATA:{

        return { ...state, historicalData: action.stocksInfo }
      }
      case CLEAR_HISTORICAL_DATA:{

        return { ...state, historicalData: {} }
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
