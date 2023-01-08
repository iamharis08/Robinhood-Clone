import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import HomeNavBar from "../HomePage/HomeNavBar";
import "../../css/StockPage.css";
import addImg from "../../css/images/add.svg";
import {
  fetchStockInfo,
  clearStockInfo,
  fetchStockPrice,
} from "../../store/stocks";
import { Modal } from "../context/Modal";
import WatchlistStockModal from "./WatchlistStockModal.js";
import {
  fetchAllUserStocks,
  fetchBuyNewStocks,
  fetchSellAllStocks,
  fetchUpdateStocks,
} from "../../store/transactions";
import { fetchUser } from "../../store/session";

const StockPage = () => {
  const dispatch = useDispatch();
  const stockInfo = useSelector((state) => state.stocks.stockInfo);
  const watchlists = useSelector((state) => state.lists.watchlists);
  const { stockSymbol } = useParams();
  const allUserStocks = useSelector(
    (state) => state.transactions.allUserStocks
  );
  const liveStockPrice = useSelector((state) => state.stocks.liveStockPrice);
  const user = useSelector((state) => state.session.user);
  const [clickedBuyIn, setClickedBuyIn] = useState("shares");
  const [clickedDropdown, setClickedDropDown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isBuy, setIsBuy] = useState(true);
  const [hasStock, setHasStock] = useState([]);
  const [sharesInput, setSharesInput] = useState(0);
  const [dollarsInput, setDollarsInput] = useState(0);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState([]);
  const [click, setClick] = useState(false);
  const [sellAll, setSellAll] = useState(false);
  const livePrice = liveStockPrice?.liveStockPrice?.toFixed(2);
  console.log(errors, "ERRRRRRRRRRRRRORSSS");
    console.log(allUserStocks, "ALLUSER STOCKSSS")
  const handleSelect = (e) => {
    return setClickedBuyIn(e.target.value);
  };

  const handleSellAll = () => {
    const sellTransaction = {
      stock_symbol: stockSymbol
    }
    dispatch(fetchSellAllStocks(sellTransaction))
    .then((data) => {
      setSellAll(false)
      setIsBuy(true)
      setSuccess(["All shares sold successfully"])
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess([])
    setErrors([]);



    let shares;

    if (clickedBuyIn === "dollars") {
      let dollarsToShares = dollarsInput / livePrice;
      shares = dollarsToShares;
    } else shares = sharesInput;

    const buyNewStock = {
      stock_symbol: stockSymbol,
      stock_shares: shares,
      price_per_share: livePrice,
    };

    if (allUserStocks[stockSymbol]) {
      const updateBuyStock = {
        stock_symbol: stockSymbol,
        stock_shares_bought: shares,
        price_per_share: livePrice,
      };
      const updateSellStock = {
        stock_symbol: stockSymbol,
        stock_shares_sold: shares,
        price_per_share: livePrice,
      };

      if (isBuy) {
        const data = await dispatch(fetchUpdateStocks(updateBuyStock));
        if (data.error) {
          setErrors([data.error]);
        }
        if (data.success){
          setSuccess([])
          setSuccess([data.success])
        }
      } else {
        if (sharesInput > allUserStocks[stockSymbol].stockShares || sharesInput > allUserStocks[stockSymbol].stockShares){
          return setErrors(["You do not have enough shares"])
        }
        const data = await dispatch(fetchUpdateStocks(updateSellStock));
        if (data.error) {
          setErrors([data.error]);
        }
        console.log(data, "DATAAAAAAAAAAAAAAAAAAAAA FRONT")
        if (data.success === "All shares sold successfully"){
          setIsBuy(true)
          setSuccess([])
          setSuccess([data.success])
        }
      }
    } else {
      const data = await dispatch(fetchBuyNewStocks(buyNewStock));
      if (data.error) {
        setErrors([data.error]);
      }
      console.log(data, "BUY NEEWWWW STOCKKKKKK")
      if (data.success){

        setSuccess([])
        setSuccess([data.success])
      }
    }
    setClick(!click)
  };

  useEffect(() => {
    let includedStocks = [];
    Object.values(watchlists)?.forEach((watchlist) => {
      if (
        watchlist.stocks.find((stock) => stock.stock_symbol === stockSymbol)
      ) {
        includedStocks.push(watchlist.id);
      }
    });
    setHasStock([...includedStocks]);
  }, [watchlists, stockSymbol]);

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchAllUserStocks())
  }, [click]);



  useEffect(() => {
    dispatch(clearStockInfo());
    dispatch(fetchStockInfo(stockSymbol));
    liveStockPrice.liveStockPrice = 0;
  }, [dispatch, stockSymbol]);

  useEffect(() => {
    dispatch(fetchStockPrice(stockSymbol));
    const interval = setInterval(() => {
      dispatch(fetchStockPrice(stockSymbol));
    }, 5000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="stock-page-container">
      <div className="stock-page-nav">
        <HomeNavBar />
      </div>
      <div className="stock-page-body">
        <div className="first-column">
          <div className="chart-container">
            <div className="chart-header">
              <div className="main-name">{stockSymbol}</div>
              <div className="stock-price">$129.97</div>
              <div className="price-change">-$18.33(-12.36%) Past month</div>
            </div>
            <div className="chart">
              <div className="line-chart"></div>
              <div className="time-period"></div>
            </div>
          </div>
          <div className="stock-info-container">
            <div className="about-title">
              <div className="about">About</div>
            </div>
            <div className="stock-description">
              {stockInfo.stockDescription}
            </div>
            <div className="company-info-container">
              {/* <div className="ceo-container">
                    <div className="ceo-title">CEO</div>
                    <div className="ceo-name">Timothy Donald Cook</div>
                </div> */}
              <div className="employees-container">
                <div className="employees-title">Employees</div>
                <div className="employees-name">{stockInfo.employees}</div>
              </div>
              <div className="headquarters-container">
                <div className="headquarters-title">Headquarters</div>
                <div className="headquarters-name">
                  {stockInfo.headquarters}
                </div>
              </div>
              <div className="founded-container">
                <div className="founded-title">Sector</div>
                <div className="founded-name">{stockInfo.Sector}</div>
              </div>
            </div>
            <div className="key-statistics-container">
              <div className="key-statistics-title">Key statistics</div>
              <div className="key-info-container">
                <div className="key-info-title">Market cap</div>
                <div className="key-info-name">{stockInfo.marketCap}</div>
              </div>
              <div className="key-info-container">
                <div className="key-info-title">Price-Earnings ratio</div>
                <div className="key-info-name">
                  {stockInfo.priceEarningsRatio}
                </div>
              </div>
              <div className="key-info-container">
                <div className="key-info-title">Dividend yield</div>
                <div className="key-info-name">{stockInfo.dividendYield}</div>
              </div>
              <div className="key-info-container">
                <div className="key-info-title">Average volume</div>
                <div className="key-info-name">{stockInfo.averageVolume}</div>
              </div>
              <div className="key-info-container">
                <div className="key-info-title">High today</div>
                <div className="key-info-name">{stockInfo.highToday}</div>
              </div>
              <div className="key-info-container">
                <div className="key-info-title">Low today</div>
                <div className="key-info-name">{stockInfo.lowToday}</div>
              </div>
              <div className="key-info-container">
                <div className="key-info-title">Open price</div>
                <div className="employees-name">{stockInfo.openPrice}</div>
              </div>
              <div className="key-info-container">
                <div className="key-info-title">Volume</div>
                <div className="key-info-name">{stockInfo.volume}</div>
              </div>
              <div className="key-info-container">
                <div className="key-info-title">52 Week high</div>
                <div className="key-info-name">
                  {stockInfo.fiftyTwoWeekHigh}
                </div>
              </div>
              <div className="key-info-container">
                <div className="key-info-title">52 Week low</div>
                <div className="key-info-name">{stockInfo.fiftyTwoWeekLow}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="second-column">
          <div className="stock-transaction-container">
            <div className="stock-transaction">
              {!allUserStocks[stockSymbol] ? (
                <div className="transaction-header">
                  <div
                    className={
                      isBuy ? "clicked-transaction-type" : "buy-stock-title"
                    }
                    onClick={() => {
                      setIsBuy(true)
                      setSellAll(false)
                    }}
                  >
                    Buy {stockSymbol}
                  </div>
                </div>
              ) : (
                <div className="transaction-header">
                  <div
                    className={
                      isBuy ? "clicked-transaction-type" : "buy-stock-title"
                    }
                    onClick={() => {
                      setIsBuy(true)
                      setSellAll(false)
                    }}
                  >
                    Buy {stockSymbol}
                  </div>
                  <div
                    className={
                      isBuy ? "buy-stock-title" : "clicked-transaction-type"
                    }
                    onClick={() => setIsBuy(false)}
                  >
                    Sell {stockSymbol}
                  </div>
                </div>
              )}

              <div className="transaction-form">
                <div className="order-type">
                  Order Type <span>Market Order</span>
                </div>
                <div className="buy-in">
                  {isBuy ? <span>Buy In </span> : <span>Sell In </span>}
                  {/* <div
                    className="buy-type-dropdown-container"
                    onClick={() => setClickedDropDown(!clickedDropdown)}
                  ></div> */}
                  <div className="buy-type-dropdown">
                    <select
                      name="buyType"
                      id="buy-type-select"
                      onChange={handleSelect}
                    >
                      <option value="shares" selected>
                        Shares
                      </option>
                      <option value="dollars">Dollars</option>
                    </select>
                  </div>
                </div>

                {clickedBuyIn === "dollars" ? (
                  <div className="amount">
                    <div className="amount-text">Amount</div>
                    <div className="amount-input">
                      <input
                        name="amount"
                        placeholder="$0.00"
                        type="number"
                        min="0"
                        value={dollarsInput}
                        onChange={(e) => setDollarsInput(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="share-amount">
                    <div className="share-amount-text">Shares</div>
                    <div className="share-amount-input">
                      <input
                        placeholder="0"
                        type="number"
                        min="0"
                        value={sharesInput}
                        onChange={(e) => setSharesInput(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}
                <div className="market-price">
                  <div className="market-price-text">Market Price</div>
                  <div className="market-price-amount">${livePrice}</div>
                </div>
                {isBuy ? (
                  <div className="transaction-total">
                    <div className="estimated-text">{clickedBuyIn === "shares" ? "Estimated Cost" : "Estimated Qty."}</div>
                    <div className="estimated-price">
                      {clickedBuyIn === "shares"
                        ? `$${(livePrice * sharesInput).toFixed(2)}`
                        : `${(dollarsInput / livePrice).toFixed(2)}`}
                    </div>
                  </div>
                ) : (
                  <div className="transaction-total">
                    <div className="estimated-text">{clickedBuyIn === "shares" ? "Estimated Credit" : "Estimated Qty."}</div>
                    <div className="estimated-price">
                      {clickedBuyIn === "shares"
                        ? `$${(livePrice * sharesInput).toFixed(2)}`
                        : `${(dollarsInput / livePrice).toFixed(2)}`}
                    </div>
                  </div>
                )}

                {!sellAll ?
                <div className="transactions-submit-button">
                  <div className="errors">
                    {errors?.map((error, ind) => (
                      <div key={ind}>{error}</div>
                    ))}
                  </div>
                    <div className="success">
                      {success?.map((message, ind) => (
                      <div key={ind}>{message}</div>
                    ))}
                    </div>
                   <div className="review-order-button" onClick={handleSubmit}>
                    Review Order
                  </div>

                </div> : null}

                {sellAll ? (
                    <div className="sell-all-confirmation">
                        <div className="sell-all-message">
                        You are placing an order to sell all your shares of {stockSymbol}
                       </div>
                       <div className="accept-sell-all" onClick={handleSellAll}>Sell All</div>
                       <div className="cancel-sell-all" onClick={() => setSellAll(false)}>Cancel</div>
                       </div>) : null}
                {/* {clickedDropdown && (
                    <div className="buy-type-dropdown">
                      <div className="Shares">Shares</div>
                      <div className="Dollars">Dollars</div>
                    </div>
                  )} */}
              </div>
              {isBuy ? (
                <div className="transactions-power">
                  <div className="transactions-power-text">
                    ${user?.buying_power} buying power avaialable
                  </div>
                </div>
              ) : (
                <div className="transactions-power">
                  <div className="transactions-power-text-sell">

                    {clickedBuyIn === 'shares' ? (<><div className="investment-power">About {(allUserStocks[stockSymbol]?.stockShares)?.toFixed(4)} Shares Avaialable</div><div className="sell-all" onClick={() => setSellAll(true)}>-<span>Sell All</span></div></>) : (<><div className="investment-power">About ${(allUserStocks[stockSymbol]?.stockShares * livePrice)?.toFixed(4)} Avaialable</div><div className="sell-all" onClick={() => setSellAll(true)}>- <span>Sell All</span></div></>)}
                  </div>
                </div>
              )}
            </div>
            <div
              className="add-stock-watchlist"
              onClick={() => setShowAddModal(true)}
            >
              <div className="add-stock-button">Add to Lists</div>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          {console.log(hasStock, "HASSSSSS STOCKKkk STOCK PAGE")}
          <WatchlistStockModal
            hasStock={hasStock}
            setShowAddModal={setShowAddModal}
            stockSymbol={stockSymbol}
            setHasStock={setHasStock}
          />
        </Modal>
      )}
    </div>
  );
};

export default StockPage;
