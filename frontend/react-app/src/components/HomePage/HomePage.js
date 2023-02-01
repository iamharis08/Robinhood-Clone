import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import "../../css/NavBar.css"
import logoIcon from "../../css/images/risinghoodblackicon.png"
import HomeNavBar from "./HomeNavBar";
import "../../css/HomePage.css"
import Watchlists from "../Watchlists/watchlists";
import { useSelector } from "react-redux";
import UserInvestmentChart from "./UserInvestmentChart";
const HomePage = () => {
  const user = useSelector((state) => state.session.user);
  const [regularMarketPrice, setRegularMarketPrice] = useState(false);
  const [price, setPrice] = useState('');
  const [tooltipPrice, setToolTipPrice] = useState('0');
  const historicalData = useSelector((state) => state.stocks.historicalData);
  const allUserStocks = useSelector(
    (state) => state.transactions.allUserStocks
  );
  useEffect(() => {
    (async function() {
      try {
        const response = await fetch(`/api/stocks/portfolio-chart-data/current-user`)
        const data = await response.json();
        console.log(data, "DATEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEARRRAYYYYYYYYYYYYYYYYY");
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div className="home-container">
      <div className="nav-bar-home">
        <HomeNavBar />
      </div>
        <div className="home-body-container">
          <div className="left-content">
            <div className="home-chart">
              <div className="investment-container">
                  <div className="investment"> ${Object.values(allUserStocks).length ? ( ((price ? price : 0) - (Object.values(allUserStocks)[0]["total_invested"] ? Object.values(allUserStocks)[0]["total_invested"] : 0) + user?.total_investment ).toFixed(2) ) : user.total_investment}</div>

              </div>
              <UserInvestmentChart setPrice={setPrice} setRegularMarketPrice={setRegularMarketPrice} setToolTipPrice={setToolTipPrice} />
            </div>
            <div className="buying-power">
              Buying Power <span>${user.buying_power}</span>
            </div>

            {/* <div className="buying-power">
             Trending List
            </div>
            <div className="buying-power">
              News
            </div>
            <div className="buying-power">
              News
            </div>
            <div className="buying-power">
              News
            </div>
            <div className="buying-power">
              News
            </div>
            <div className="buying-power">
              News
            </div>
            <div className="buying-power">
              News
            </div>
            <div className="buying-power">
              News
            </div>
            <div className="buying-power">
              News
            </div>
            <div className="buying-power">
              News
            </div>
            <div className="buying-power">
              News
            </div> */}
          </div>
          <Watchlists />
          {/* <div className="lists-container">
            <div className="stocks-list">
              <div className="stocks-title">Stock</div>

            </div>
          </div> */}
        </div>
    </div>

  );
};

export default HomePage;
