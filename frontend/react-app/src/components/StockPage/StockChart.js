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


  console.log(isLoaded, "HISTORICALLLLLLLLLLLLLLLLLLLLL");

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
        },
        yaxis: {
          show: true,
          labels: {
            show: true,
          },
          axisBorder: {
            show: false,
          },
        },
      },
      noData: {
        text: "Loading...",
        align: "center",
        verticalAlign: "top",
        style: {
          color: "black",
          fontSize: "30px",
        },
      },
    },


    series: [],
  });

  useEffect(() => {
    setIsLoaded(false);
    dispatch(fetchHistoricalData([stockSymbol])).then((data) => {
      setIsLoaded(true);

      const historicalDataTimestamps = Object.keys(data);
      const historicalDataPrices = Object.values(data);
      console.log(historicalDataPrices, "PRICEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
      setData({
        options: {
          chart: {
            id: "basic-bar",
            type: "line",
            events: {
                mouseLeave: () => setRegularMarketPrice(true)
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
            categories: Object.keys(data[stockSymbol]),
            labels: {
              format: "MMM/d/h/mm",
              formatter: function (value, timestamp) {
                let options = {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
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
            yaxis: [{
                y: Object.values(data[stockSymbol])[0],

            }]
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
                setRegularMarketPrice(false)
                setToolTipPrice(value)}
            },
          },
        },
        series: [
          {
            name: "series-1",
            data: Object.values(data[stockSymbol]),
          },
        ],
      });
    });
  }, [stockSymbol]);

  return (
    <div className="stock-chart-container">
      <Chart
        options={data.options}
        series={data.series}
        width="676"
        height="auto"
      />
    </div>
  );
};

export default StockChart;
