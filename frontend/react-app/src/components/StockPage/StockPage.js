import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import HomeNavBar from "../HomePage/HomeNavBar";
import "../../css/StockPage.css";
import addImg from "../../css/images/add.svg";
import { fetchStockInfo, clearStockInfo } from "../../store/stocks";
import { Modal } from "../context/Modal";
import WatchlistStockModal from "./WatchlistStockModal.js";

const StockPage = () => {
  const dispatch = useDispatch();
  const stockInfo = useSelector((state) => state.stocks.stockInfo);
  const watchlists = useSelector((state) => state.lists.watchlists);
  const { stockSymbol } = useParams();
  const [clickedBuyIn, setClickedBuyIn] = useState("shares");
  const [clickedDropdown, setClickedDropDown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isBuy, setIsBuy] = useState(true);
  const [hasStock, setHasStock] = useState([]);
  const [errors, setErrors] = useState([]);

  const handleSelect = (e) => {
    return setClickedBuyIn(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const data = await dispatch();
    // if (data) {
    //   setErrors(data);
    // }
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

  //   useEffect(() => {

  //   }, [hasStock]);

  useEffect(() => {
    dispatch(clearStockInfo());
    dispatch(fetchStockInfo(stockSymbol));
  }, [dispatch, stockSymbol]);

  useEffect(() => {}, [clickedBuyIn]);

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
              <div className="transaction-header">
                <div
                  className={
                    isBuy ? "clicked-transaction-type" : "buy-stock-title"
                  }
                  onClick={() => setIsBuy(true)}
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

              <div className="transaction-form">
                <div className="order-type">
                  Order Type <span>Market Order</span>
                </div>
                <div className="buy-in">
                  {isBuy ? <span>Buy In </span> : <span>Sell In </span>}
                  <div
                    className="buy-type-dropdown-container"
                    onClick={() => setClickedDropDown(!clickedDropdown)}
                  ></div>
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
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="share-amount">
                    <div className="share-amount-text">Shares</div>
                    <div className="share-amount-input">
                      <input placeholder="0" type="number" min="0" required />
                    </div>
                  </div>
                )}
                <div className="market-price">
                  <div className="market-price-text">Market Price</div>
                  <div className="market-price-amount">N/A</div>
                </div>
                {isBuy ? (
                  <div className="transaction-total">
                    <div className="estimated-text">Estimated Cost</div>
                    <div className="estimated-price">{"$10000000"}</div>
                  </div>
                ) : (
                  <div className="transaction-total">
                    <div className="estimated-text">Estimated Credit</div>
                    <div className="estimated-price">{"$1000"}</div>
                  </div>
                )}
                <div className="transactions-submit-button">
                  <div className="review-order-button" onClick={handleSubmit}>
                    Review Order
                  </div>
                </div>

                {/* {clickedDropdown && (
                    <div className="buy-type-dropdown">
                      <div className="Shares">Shares</div>
                      <div className="Dollars">Dollars</div>
                    </div>
                  )} */}
              </div>
              {isBuy ? (
                <div className="transactions-power">
                  <div className="transactions-power-text">{"$200"} buying power avaialable</div>

                </div>
              ) : (
                <div className="transactions-power">
                  <div className="transactions-power-text">{"1"} Shares Avaialable -<span>Sell All</span> </div>
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
