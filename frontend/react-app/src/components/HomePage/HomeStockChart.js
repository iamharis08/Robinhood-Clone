import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../../css/Watchlists.css";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistoricalData } from "../../store/stocks";
import { useParams } from "react-router-dom";

const HomeStockChart = ({ stockSymbol }) => {
  const dispatch = useDispatch();
  const allUserStocks = useSelector(
    (state) => state.transactions.allUserStocks
  );
  const watchlists = useSelector((state) => state.lists.watchlists);
  //   const { stockSymbol } = useParams();
  const historicalData = useSelector((state) => state.stocks.historicalData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [wait, setWait] = useState(false);

  setTimeout(() => {
    setWait(true);
  }, 100);
  //   const [isSelected, setIsSelected] = useState('1w');
  //   const [timeInterval, setTimeInterval] = useState("5m");
  //   const [period, setPeriod] = useState("1wk");

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
        tickAmount: 0,
        categories: [],
        labels: {
          show: false,
          showAlways: false,
        },
        yaxis: {
          show: false,
          showAlways: false,
          showForNullSeries: false,
          tickAmount: 0,
          labels: {
            show: false,
            style: {
              colors: ["#FFFFF"],
            },
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
      },
      axisY: {
        show: false
      },
      noData: {
        text: "Loading...",
        align: "center",
        verticalAlign: "center",
        style: {
          color: "black",
          fontSize: "13px",
        },
      },
      legend: {
        show: false,
      },
      tooltip: {
        show: false,
      },
    },

    series: [],
  });

  useEffect(() => {

    console.log(
      { stock_symbols: [stockSymbol] },
      "STOCKINFOOOOOOOOOOOOOOOOOOOOO"
    );



      //   const historicalDataTimestamps = Object.keys(data[stockSymbol]);
      //   const historicalDataPrices = Object.values(data[stockSymbol]);
        console.log(historicalData, "PRICEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
      if (Object.keys(historicalData).length){setData({
        options: {
          chart: {
            id: "basic-bar",
            type: "line",
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
            width: 1.75,
          },
          colors: ["#00C805"],
          xaxis: {
            tickAmount: 0,
            position: "top",
            categories: Object.keys(historicalData[stockSymbol] ? historicalData[stockSymbol] : []),
            labels: {
              show: false,
            },
          },
          // axisY: {
          //   show: false
          // },
          yaxis: [
            {
              tickAmount: 0,
              show: false,
              showAlways: false,
              showForNullSeries: false,
              y: 8800,
              borderColor: "#00E396",
              labels: {
                show: false,
                enabled: false,
                style: {
                  colors: ["#FFFFF"],
                },
              },
              axisBorder: {
                show: false,
              },
              floating: false,
              axisTicks: {
                show: false,
              },
            },
          ],
          axisTicks: {
            show: false,
          },
          annotations: {
            yaxis: [
              {
                y: Object.values(historicalData[stockSymbol] ? historicalData[stockSymbol] : [])[0],
              },
            ],
          },
          noData: {
            text: "Loading...",
            align: "center",
            verticalAlign: "center",
            style: {
              color: "black",
              fontSize: "8px",
            },
          },
          tooltip: {
            show: false,
            enabled: false,

          },
          dataLabels: {
            enabled: false,
          },

        },
        series: [
          {
            name: "price",
            data: Object.values(historicalData[stockSymbol] ? historicalData[stockSymbol] : []),
          },
        ],

      });}

  }, [stockSymbol, historicalData]);

  return (
    <div className="home-stocks-chart-container">
      {Object.keys(historicalData).length ? ( wait && <Chart options={data.options} series={data.series} width={100}  height={80} />) : "...Loading"}
    </div>
  );
};

export default HomeStockChart;
