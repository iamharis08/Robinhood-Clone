const GET_USER_STOCKS = "transactions/GET_USER_STOCKS";
const BUY_NEW_STOCK = "transactions/GET_BOUGHT_STOCK";
const UPDATE_STOCK = "transactions/GET_UPDATE_STOCK";
const DELETE_SOLD_STOCK = "transactions/DELETE_SOLD_STOCK";
const CLEAR_STOCK = "transactions/CLEAR_STOCK";

const getUserStocks = (stocks) => ({
  type: GET_USER_STOCKS,
  stocks,
});
const buyNewStock = (stock) => ({
  type: BUY_NEW_STOCK,
  stock,
});
const updateStock = (stock) => ({
  type: UPDATE_STOCK,
  stock,
});
const deleteSoldStock = (stock) => ({
  type: DELETE_SOLD_STOCK,
  stock,
});

export const clearStockInfo = () => ({
  type: CLEAR_STOCK,
});

export const fetchAllUserStocks = (userId) => async (dispatch) => {
  const response = await fetch(`/api/users/${userId}/stocks`);
  if (response.ok) {
    const data = await response.json();
    if (data.error) {
      return;
    }

    dispatch(getUserStocks(data));
  }
};

export const fetchBuyNewStocks = (userId, stockSymbol, stockTransaction) => async (dispatch) => {

    const response = await fetch(`/api/users/${userId}/stocks/${stockSymbol}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stockTransaction),
    });
    if (response.ok) {
      const data = await response.json();


      if (data.error) {
        return data;
      }

      if (data.message) {
        dispatch(buyNewStock(data));
        return { success: "Shares bought successfully" };
      } else return data;
    } else return response.json();
  };


export const fetchUpdateStocks = (userId, userStockId, stockTransaction) => async (dispatch) => {

  const response = await fetch(`/api/users/${userId}/stocks/${userStockId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(stockTransaction),
  });
  if (response.ok) {
    const data = await response.json();

    if (data.message) {
      dispatch(
        deleteSoldStock({ userStock: { stockSymbol: data.stockSymbol } })
      );
      return { success: data.message };
    }

    if (data.error) {
      return data;
    }

    dispatch(updateStock(data));
    if (data.message === "Stock Sold Successfully") {
      return { success: "Shares successfully sold" };
    }
  } else return response.json();
};

export const fetchSellAllStocks = (userId, userStockId, stockTransaction) => async (dispatch) => {
  const response = await fetch(`/api/users/${userId}/stocks/${userStockId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(stockTransaction),
  });
  if (response.ok) {
    const data = await response.json();
    if (data.error) {
      return data.error;
    }

    dispatch(deleteSoldStock(data.soldStock));
    if (data.message === "Stock Sold Successfully") {
      return { success: "Shares successfully sold" };
    }
  }
};

// Normalization function
const normalize = (dataArray) => {
  let newObj = {};
  dataArray.forEach((stock) => {
    newObj[stock.stockSymbol] = stock;
  });
  return newObj;
};

const initialState = { allUserStocks: {}, stock: {} };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER_STOCKS: {
      let normalizedUserStocks = normalize(action.stocks.userStocks);

      return { ...state, allUserStocks: normalizedUserStocks };
    }
    case BUY_NEW_STOCK: {
      let userStock = action.stock.userStock;
      return {
        ...state,
        allUserStocks: {
          ...state.allUserStocks,
          [userStock.stockSymbol]: userStock,
        },
        stock: action.stock.userStock,
      };
    }
    case UPDATE_STOCK: {
      let userStock = action.stock.userStock;
      return {
        ...state,
        allUserStocks: {
          ...state.allUserStocks,
          [userStock.stockSymbol]: userStock,
        },
        stock: action.stock.userStock,
      };
    }
    case DELETE_SOLD_STOCK: {
      let soldStock = action.stock;
      let removed_stock_obj = state.allUserStocks;
      delete removed_stock_obj[soldStock.stockSymbol];
      return { ...state, allUserStocks: { ...removed_stock_obj }, stock: {} };
    }
    case CLEAR_STOCK: {
      return { ...state, stock: {} };
    }

    default:
      return state;
  }
}
