import React, { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import "../../css/NavBar.css";
import logoIcon from "../../css/images/risinghoodblackicon.png";
import HomeNavBar from "./HomeNavBar";
import "../../css/HomePage.css";
import "../../css/marketNews.css";
import Watchlists from "../Watchlists/watchlists";
import { useSelector } from "react-redux";
import UserInvestmentChart from "./UserInvestmentChart";

const HomePage = () => {
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  const [regularMarketPrice, setRegularMarketPrice] = useState(false);
  const [price, setPrice] = useState("");
  const [tooltipPrice, setToolTipPrice] = useState("0");
  const [marketNews, setMarketNews] = useState([]);
  const historicalData = useSelector((state) => state.stocks.historicalData);
  const allUserStocks = useSelector(
    (state) => state.transactions.allUserStocks
  );

  console.log(marketNews, "INITIALLLL MARKETTTT NEWSSSSSSSSSSSSSS");
  useEffect(() => {
    const finnhub = require("finnhub");
    const api_key = finnhub.ApiClient.instance.authentications["api_key"];
    api_key.apiKey = process.env.REACT_APP_FINNHUB_API_KEY_FIRST;
    const finnhubClient = new finnhub.DefaultApi();
    finnhubClient.marketNews("general", {}, (error, data, response) => {
      setMarketNews(data);
      console.log(marketNews, "MARKET NEWWWWWWWWWWWSSSWSSSSS REASSIGNEDDDD");
    });
  }, []);

  useEffect(() => {
    console.log(marketNews, "INITIALLLL MARKETTTT NEWSSSSSSSSSSSSSS USEEFECTT");
  }, [marketNews]);
  // useEffect(() => {
  //   (async function () {
  //     try {
  //       const response = await fetch(
  //         `/api/stocks/portfolio-chart-data/current-user`
  //       );
  //       const data = await response.json();
  //       console.log(
  //         data,
  //         "DATEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEARRRAYYYYYYYYYYYYYYYYY"
  //       );
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   })();
  // }, []);
  // let marketNews = [
  //   {
  //     category: "top news",
  //     datetime: 1675292417,
  //     headline:
  //       "Former McKinsey Chief Barton Denies Trudeau Ties Helped Win Contracts From Canada",
  //     id: 7228025,
  //     image:
  //       "https://data.bloomberglp.com/company/sites/2/2019/01/logobbg-wht.png",
  //     related: "",
  //     source: "Bloomberg",
  //     summary:
  //       "Dominic Barton, the former head of global consulting giant McKinsey & Co., dismissed claims that his ties to Prime Minister Justin Trudeau led to his firm being favored for Canadian government contracts.",
  //     url: "https://www.bloomberg.com/news/articles/2023-02-01/former-mckinsey-chief-barton-denies-trudeau-ties-helped-win-business-from-canada",
  //   },
  // ];

  function getTimeAgo(timestamp) {
    const currentTime = Date.now();
    const articlePublished = new Date(timestamp * 1000);
    const difference = currentTime - articlePublished;
    const oneDay = 24 * 60 * 60 * 1000;
    const oneHour = 60 * 60 * 1000;
    const oneMinute = 60 * 1000;

    if (difference >= oneDay) {
      const daysAgo = Math.floor(difference / oneDay);
      return daysAgo + (daysAgo === 1 ? " day ago" : " days ago");
    } else if (difference >= oneHour) {
      const hoursAgo = Math.floor(difference / oneHour);
      return hoursAgo + (hoursAgo === 1 ? " hour ago" : " hours ago");
    } else {
      const minutesAgo = Math.floor(difference / oneMinute);
      return minutesAgo + (minutesAgo === 1 ? " minute ago" : " minutes ago");
    }
  }

  const marketNewsComponents = marketNews?.map((article, index) => {
    return (
      <a href={`${article.url}`}>
        <div className="market-news-article">
          <div className="market-news-header">
            <div className="market-news-source">{article.source}</div>
            <div className="market-news-date">
              {getTimeAgo(article.datetime)}
            </div>
          </div>
          <div className="market-news-middle-content">
            <div className="market-news-content">
              <div className="market-news-description">
                <div className="market-news-headline">{article.headline}</div>
                <div className="market-news-summary">{article.summary}</div>
              </div>
            </div>
            <div className="market-news-image">
              <img src={article.image} alt="market news image" />
            </div>
          </div>
        </div>
      </a>
    );
  });

  return (
    <div className="home-container">
      <div className="nav-bar-home">
        <HomeNavBar />
      </div>
      <div className="home-body-container">
        <div className="left-content">
          <div className="home-chart">
            <div className="investment-container">
              <div className="investment">
                {" "}
                $
                {Object.values(allUserStocks).length
                  ? (
                      (price ? price : 0) -
                      (Object.values(allUserStocks)[0]["total_invested"]
                        ? Object.values(allUserStocks)[0]["total_invested"]
                        : 0) +
                      user?.total_investment
                    ).toFixed(2)
                  : user.total_investment}
              </div>
            </div>
            <UserInvestmentChart
              setPrice={setPrice}
              setRegularMarketPrice={setRegularMarketPrice}
              setToolTipPrice={setToolTipPrice}
            />
          </div>
          <div className="buying-power">
            Buying Power <span>${user.buying_power}</span>
          </div>
          <div className="market-news-container">
            <div className="market-news-title">News</div>
            {marketNewsComponents}
          </div>
        </div>
        <Watchlists />
      </div>
    </div>
  );
};

export default HomePage;
