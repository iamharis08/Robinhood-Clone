import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../../css/HomePage.css";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistoricalData } from "../../store/stocks";
import { useParams } from "react-router-dom";

const UserInvestmentChart = ({setPrice, setRegularMarketPrice, setToolTipPrice }) => {
  const dispatch = useDispatch();
  const allUserStocks = useSelector(
    (state) => state.transactions.allUserStocks
  );
  const watchlists = useSelector((state) => state.lists.watchlists);
  //   const { stockSymbol } = useParams();
  const historicalData = useSelector((state) => state.stocks.historicalData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [y, setY] = useState([]);
  const [x, setX] = useState([]);
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


  const seriesFormatter = () => {

   if(Object.values(historicalData).length > 0){
    const userStocksArray = Object.values(allUserStocks)?.map((stock) => {return {[stock.stockSymbol]: stock.stockShares}})
    const totalsArray = userStocksArray?.map((stock) => {
        let symbolPrices = Object.values(historicalData[stock.stockSymbol])

        let stockTotal = symbolPrices?.map((price) => {
            return stock.shares * price
        })

        return stockTotal
    })


    let series = totalsArray.map((arr, i) => {
        return arr.map((ele, j) => {
           return ele + totalsArray[j][i]
        });
    });
    return series
    }




}



useEffect(() => {
    // console.log(seriesFormatter(), "FORMATERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")

    // console.log(
    //   { stock_symbols: [stockSymbol] },
    //   "STOCKINFOOOOOOOOOOOOOOOOOOOOO"
    // );


    //   const historicalDataTimestamps = Object.keys(data[stockSymbol]);
    //   const historicalDataPrices = Object.values(data[stockSymbol]);
    // console.log(historicalData, "PRICEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");

    console.log(x , y, "DATAXAANDYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY")
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
                categories: x.length ? x :  [1,2,3,4,5,6,7,8,9,10],
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
              axisTicks: {
                show: false,
              },
              responsive: [{
                breakpoint: 1200,
                options: {
                  chart: {
                    width: 600
                  },
                  legend: {
                    position: 'bottom'
                  }
                }
              }],
              annotations: {
                yaxis: [

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
              noData: {
                text: "Loading...",
                align: "center",
                verticalAlign: "center",
                style: {
                  color: "black",
                  fontSize: "30px",
                },
              },
            },
            series: [
              {
                name: "price",
                data: y.length ? y : [1, 1, 1, 1, 1, 1, 1, 1, 1],
              },
            ],
          });


        }, [historicalData, allUserStocks, isLoaded]);

  useEffect(() => {
    (async function () {
      try {
        const response = await fetch(
          `/api/stocks/portfolio-chart-data/current-user`
        );
        const data = await response.json();
          setIsLoaded(!isLoaded)
          setY(data.prices)
          setX(data.dates)
          console.log(data, "DATAAAAPINT")
        console.log(
          data,
          "DATEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEARRRAYYYYYYYYYYYYYYYYY"
        );
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div className="user-investment-chart-container">
      {Object.keys(historicalData).length ? ( wait && (Object.values(allUserStocks).length ? <Chart options={data.options} series={data.series} width={1014}  height={196} /> : <Chart options={{
              chart: {
                id: "basic-bar",
                type: "line",
                events: {
                  mouseLeave: () => {
                    // setPrice(series[series.length - 1])
                    // setRegularMarketPrice(true)

                },
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
              responsive: [{
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200
                  },
                  legend: {
                    position: 'bottom'
                  }
                }
              }],
              grid: {
                show: false,
              },
              stroke: {
                width: 2,
              },
              colors: ["#00C805"],
              xaxis: {
                position: "top",
                categories: [1,2,3,4,5,6,7,8,9,10],
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
                    // formatter: function (value, timestamp) {
                    //   return `$${value.toFixed(2)}`;
                    // },
                    show: false,
                  },
                  axisBorder: {
                    show: false,
                  },
                },
              ],
              axisTicks: {
                show: false,
              },
              tooltip: {
                enabled: false,
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
                //   title: {
                //     formatter: (seriesName) => (seriesName = "price"),
                //   },
                //   formatter: (value) => {
                //     setRegularMarketPrice(false);
                //     setToolTipPrice(value);
                //   },
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
            }} series={[
                {
                  name: "price",
                  data: [1, 1, 1, 1, 1, 1, 1, 1, 1],
                },
              ]} width={1014}  height={196} />)) : <Chart options={{
                chart: {
                  id: "basic-bar",
                  type: "line",
                  events: {
                    mouseLeave: () => {
                      // setPrice(series[series.length - 1])
                      // setRegularMarketPrice(true)

                  },
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
                  categories: [1,2,3,4,5,6,7,8,9,10],
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
                      // formatter: function (value, timestamp) {
                      //   return `$${value.toFixed(2)}`;
                      // },
                      show: false,
                    },
                    axisBorder: {
                      show: false,
                    },
                  },
                ],
                axisTicks: {
                  show: false,
                },
                tooltip: {
                  enabled: false,
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
                  //   title: {
                  //     formatter: (seriesName) => (seriesName = "price"),
                  //   },
                  //   formatter: (value) => {
                  //     setRegularMarketPrice(false);
                  //     setToolTipPrice(value);
                  //   },
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
              }} series={[
                  {
                    name: "price",
                    data: [1, 1, 1, 1, 1, 1, 1, 1, 1],
                  },
                ]} width={1014}  height={196} />}
    </div>
  );
};

export default UserInvestmentChart;
