
const GET_USER_STOCKS = 'transactions/GET_USER_STOCKS'
const GET_BOUGHT_STOCK = 'transactions/GET_BOUGHT_STOCK'
const GET_UPDATE_STOCK = 'transactions/GET_UPDATE_STOCK'
const DELETE_SOLD_STOCK = 'transactions/DELETE_SOLD_STOCK'
const CLEAR_STOCK = 'transactions/CLEAR_STOCK'

const getUserStocks = (stocks) => ({
    type: GET_USER_STOCKS,
    stocks
})
const getBoughtStock = (stock) => ({
    type: GET_BOUGHT_STOCK,
    stock
})
const getUpdateStock = (stock) => ({
    type: GET_UPDATE_STOCK,
    stock
})
const deleteSoldStock = (stock) => ({
    type: DELETE_SOLD_STOCK,
    stock
})

export const clearStockInfo = () => ({
    type: CLEAR_STOCK
})

export const fetchAllUserStocks = () => async (dispatch) => {
    const response = await fetch(`/api/users/stocks`);
    if (response.ok) {
      const data = await response.json();
      if (data.errors) {
        return;
      }

      dispatch(getUserStocks(data));
    }
  }

export const fetchBuyNewStocks = (stockTransaction) => async (dispatch) => {
    const response = await fetch(`/api/users/stocks/`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(stockTransaction),
        });
    if (response.ok) {
      const data = await response.json();
      if (data.errors) {
        return;
      }

      dispatch(getBoughtStock(data));
    }
  }
export const fetchUpdateStocks = (stockTransaction) => async (dispatch) => {
    const response = await fetch(`/api/users/stocks/`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(stockTransaction),
        });
    if (response.ok) {
      const data = await response.json();
      if (data.errors) {
        return;
      }

      dispatch(getUpdateStock(data));
    }
  }

export const fetchSellAllStocks = (stockTransaction) => async (dispatch) => {
    const response = await fetch(`/api/users/stocks/`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(stockTransaction),
        });
    if (response.ok) {
      const data = await response.json();
      if (data.errors) {
        return;
      }

      dispatch(deleteSoldStock(data.soldStock));
    }
  }

// Normalization function

const normalize = (dataArray) => {   //{'1': message1, '2': message2}
    let newObj = {}
    dataArray.forEach(stock => {
    newObj[stock.id] = stock
  })
   return newObj
  }

  const initialState = {allUserStocks: {}, stock: {}}

  export default function reducer(state = initialState, action) {
    switch (action.type) {
      case GET_USER_STOCKS:{
        let normalizedUserStocks = normalize(action.stocks.userStocks)

        return { ...state, allUserStocks: normalizedUserStocks }
      }
      case GET_BOUGHT_STOCK:{
        let normalizedUserStock = normalize(action.stock.userStock)
        return { ...state, allUserStocks: {...state.allUserStocks, [normalizedUserStock.id]: normalizedUserStock }, stock: action.stock.userStock }
      }
      case GET_UPDATE_STOCK:{
        let normalizedUserStock = normalize(action.stock.userStock)
        return { ...state, allUserStocks: {...state.allUserStocks, [normalizedUserStock.id]: normalizedUserStock }, stock: action.stock.userStock }
      }
      case DELETE_SOLD_STOCK:{
        let normalizedSoldStock = normalize(action.stock.userStock)
        removed_stock_obj = state.allUserStocks
        delete removed_stock_obj[normalizedSoldStock.id]
        return { ...state, allUserStocks: {...removed_stock_obj }, stock: {} }
      }
      case CLEAR_STOCK:{

        return { ...state, stock:{} }
      }

      default:
        return state;
    }
  }
