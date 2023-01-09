
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
      if (data.error) {
        return;
      }

      dispatch(getUserStocks(data));
    }
  }

export const fetchBuyNewStocks = (stockTransaction) => async (dispatch) => {
    console.log(stockTransaction, "STOCKTRANSACTIONNN")
    const response = await fetch(`/api/users/stocks`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(stockTransaction),
        });
    if (response.ok) {
      const data = await response.json();
      console.log(data, "BUYYYYYYYY")

      if (data.error) {
          return data;
        }


        if(data.message){
          console.log(data.message, "SUCCEEEEEEESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS")
        dispatch(getBoughtStock(data));
        return {"success": "Shares bought successfully"}
      }else return data

    }else return response.json()
  }
export const fetchUpdateStocks = (stockTransaction) => async (dispatch) => {
    console.log(stockTransaction, "PUTTTTTT")
    const response = await fetch(`/api/users/stocks`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(stockTransaction),
        });
    if (response.ok) {
      const data = await response.json();
      console.log(data, "UPDATEEEEEEEEEEEEEE")

      if(data.message){
        dispatch(deleteSoldStock({userStock: {stockSymbol: data.stockSymbol}}))
        return {"success": data.message}
      }

      if (data.error) {
        return data;
      }

      dispatch(getUpdateStock(data));
      if(data.message === "Stock Sold Successfully"){

        return {"success": "Shares successfully sold"}
      }
    }else return response.json()
  }

export const fetchSellAllStocks = (stockTransaction) => async (dispatch) => {
    const response = await fetch(`/api/users/stocks`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(stockTransaction),
        });
    if (response.ok) {
      const data = await response.json();
      if (data.error) {
        return data.error;
      }
      console.log(data.soldStock, "SOLD STOCKKKKKKKKKKKKKKKKKKKKSSSSSSSSSSSSSSSSSSSSSS")
      dispatch(deleteSoldStock(data.soldStock))
      if(data.message === "Stock Sold Successfully"){

        return {"success": "Shares successfully sold"}
      }
    }
  }

// Normalization function

const normalize = (dataArray) => {   //{'1': message1, '2': message2}
    let newObj = {}
    dataArray.forEach(stock => {
    newObj[stock.stockSymbol] = stock
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
        let userStock = action.stock.userStock
        return { ...state, allUserStocks: {...state.allUserStocks, [userStock.stockSymbol]: userStock }, stock: action.stock.userStock }
      }
      case GET_UPDATE_STOCK:{
        let userStock = action.stock.userStock
        return { ...state, allUserStocks: {...state.allUserStocks, [userStock.stockSymbol]: userStock }, stock: action.stock.userStock }
      }
      case DELETE_SOLD_STOCK:{
        let soldStock = action.stock
        console.log(state.allUserStocks, "STATEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
        console.log([soldStock], "REMOVEDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
        let removed_stock_obj = state.allUserStocks
        delete removed_stock_obj[soldStock.stockSymbol]
        return { ...state, allUserStocks: {...removed_stock_obj }, stock: {} }
      }
      case CLEAR_STOCK:{

        return { ...state, stock:{} }
      }

      default:
        return state;
    }
  }
