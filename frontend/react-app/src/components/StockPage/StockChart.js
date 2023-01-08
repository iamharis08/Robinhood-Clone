import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../../css/StockPage.css";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistoricalData } from "../../store/stocks";
import { useParams } from "react-router-dom";

const StockChart = ({ setToolTipPrice, setRegularMarketPrice }) => {
  const dispatch = useDispatch();
  const { stockSymbol } = useParams();
  const historicalData = useSelector((state) => state.stocks.historicalData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSelected, setIsSelected] = useState('1w');
  const [timeInterval, setTimeInterval] = useState("5m");
  const [period, setPeriod] = useState("1wk");

  //   console.log(isLoaded, "HISTORICALLLLLLLLLLLLLLLLLLLLL");

  const [data, setData] = useState({
    options: {
      chart: {
        id: "basic-bar",
        // type: "line",
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      grid: {
        show: false,
      },
      stroke: {
        width: 2,
      },
      colors: ["#00C805"],
      xaxis: {
        // categories: [0],
        categories: [],
        labels: {
          show: false,
          showAlways: false,
        },
        yaxis: {
          show: false,
          showAlways: false,
          labels: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
        },
      },
      noData: {
        text: "Loading...",
        align: "center",
        verticalAlign: "center",
        style: {
          color: "black",
          fontSize: "30px",
        },
      },
      legend: {
        show: false,
      },
    },

    series: [],
  });

  useEffect(() => {
    setIsLoaded(false);
    console.log(
      { stock_symbols: [stockSymbol] },
      "STOCKINFOOOOOOOOOOOOOOOOOOOOO"
    );
    dispatch(
      fetchHistoricalData({ stock_symbols: [[stockSymbol, timeInterval, period]] })
    ).then((data) => {
      setIsLoaded(true);

      //   const historicalDataTimestamps = Object.keys(data[stockSymbol]);
      //   const historicalDataPrices = Object.values(data[stockSymbol]);
      //   console.log(historicalDataPrices, "PRICEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
      setData({
        options: {
          chart: {
            id: "basic-bar",
            type: "line",
            events: {
              mouseLeave: () => setRegularMarketPrice(true),
            },
            toolbar: {
              show: false,
            },
            zoom: {
              enabled: false,
            },
            animations: {
              enabled: false,
            },
          },
          grid: {
            show: false,
          },
          stroke: {
            width: 2,
          },
          colors: ["#00C805"],
          xaxis: {
            position: "top",
            categories: Object.keys(data),
            labels: {
              format: "MMM/d/h/mm",
              formatter: function (value, timestamp) {
                let options = {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                  year: "2-digit"
                };

                return new Date(Number(value)).toLocaleDateString(
                  "en-US",
                  options
                );
              },
              show: false,
            },
          },
          yaxis: [
            {
              show: false,
              y: 8800,
              borderColor: "#00E396",
              labels: {
                formatter: function (value, timestamp) {
                  return `$${value.toFixed(2)}`;
                },
                show: false,
              },
              axisBorder: {
                show: false,
              },
            },
          ],
          annotations: {
            yaxis: [
              {
                y: Object.values(data)[0],
              },
            ],
          },
          tooltip: {
            enabled: true,
            items: {
              display: "none",
            },
            marker: {
              show: false,
            },

            x: {
              show: false,
            },
            y: {
              title: {
                formatter: (seriesName) => (seriesName = "price"),
              },
              formatter: (value) => {
                setRegularMarketPrice(false);
                setToolTipPrice(value);
              },
            },
          },
        },
        series: [
          {
            name: "series-1",
            data: Object.values(data),
          },
        ],
      });
    });
  }, [stockSymbol, timeInterval, period]);

  return (
    <div className="stock-chart-container">
      <Chart
        options={data.options}
        series={data.series}
        width="676"
        height="auto"
      />
      <div className="time-interval">
        <div
          className={isSelected == '1d' ? "selected" : "date"}
          onClick={() => {
            setTimeInterval("5m");
            setPeriod("1d");
            setIsSelected('1d')

          }}
        >
          1D
        </div>
        <div
          className={isSelected == '1wk' ? "selected" : "date"}
          onClick={() => {
            setTimeInterval("5m");
            setPeriod("1wk");
            setIsSelected('1wk')
          }}
        >
          1W
        </div>
        <div className={isSelected == '1m' ? "selected" : "date"} onClick={() => {
            setTimeInterval('1h')
            setPeriod('1mo')
            setIsSelected('1m')
        }}>1M</div>
        <div className={isSelected == '3m' ? "selected" : "date"} onClick={() => {
            setTimeInterval('1d')
            setPeriod('3mo')
            setIsSelected('3m')
        }}>3M</div>
        <div className={isSelected == '1y' ? "selected" : "date"} onClick={() => {
            setTimeInterval('1d')
            setPeriod('1y')
            setIsSelected('1y')
        }}>1Y</div>
        <div className={isSelected == '5y' ? "selected" : "date" } onClick={() => {
            setTimeInterval('1wk')
            setPeriod('5y')
            setIsSelected('5y')
        }}>5Y</div>
      </div>
    </div>
  );
};

export default StockChart;
