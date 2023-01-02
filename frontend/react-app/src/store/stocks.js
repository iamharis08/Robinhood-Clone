
const GET_STOCK = 'stocks/GET_STOCK';


const getStockInfo = (stockInfo) => ({
    type: GET_STOCK,
    stockInfo
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


// Normalization function

// const normalize = (dataArray) => {   //{'1': message1, '2': message2}
//   let newObj = {}
//   dataArray.forEach(watchlist => {
//   newObj[watchlist.id] = watchlist
// })
//  return newObj
// }

  const initialState = {stockInfo: {}}

  export default function reducer(state = initialState, action) {
    switch (action.type) {
      case GET_STOCK:{

        return { ...state, stockInfo:{...action.stockInfo} }
      }
      default:
        return state;
    }
  }
