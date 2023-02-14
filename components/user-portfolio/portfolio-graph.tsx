import React, { useEffect, useState } from 'react';
import ReactEcharts from "echarts-for-react";
import { format, parseISO } from 'date-fns';
import ClientService from '../../services/main-serviceClient';
import styles from "../../styles/users-portfolio/portfolio-graph.module.scss";
import * as echarts from 'echarts';

// var numberToWords = require("number-to-words");
type EChartsOption = echarts.EChartsOption;
var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;
const mainService: any = ClientService("get");
let varToday: Date | any;
let counts = 0;
let backup90daysChart: any = {};
let portfolioPercentage = 0;
let lastDateFor90Graph: string | undefined;
let lastValueFor90Graph: number | undefined;
let datesArr: string[] = [];
let valueArr: any = [];
let first: number = 0;
let last: number = 0;
let totalPortfolioValue: any = {};
let changeValue = "";
let colorChart = "";
let portfolio90Graph = 0;
let addingNextDayPortfolio: any = {};
let temp: any;
let changeDiffValue: any;
let newValueForDifference: any;


const PortfolioGraph = (props: any) => {
  const [reload, setreload] = useState(false);
  const [showNewsFeed, setShowNewsFeed] = useState("idle");
  const [showLoader, setShowLoader] = useState("idle");
  const [showingExpiredDiv, setShowingExpiredDiv] = useState("idle");

  // format date in typescript to implement in the 90 days portfolio graph
  function getFormatedDate(date: Date, dateFormat: string) {
    return format(date, dateFormat);
  }
  function getDiffDays(sDate: any, eDate: any) {
    var startDate = new Date(sDate);
    var endDate = new Date(eDate);
    var Time = endDate.getTime() - startDate.getTime();
    return Time / (1000 * 3600 * 24);
  }
  function getToday() {
    varToday = new Date();
    return varToday.toISOString();
  }

  function get1DayAgo() {
    varToday = new Date();
    varToday.setDate(varToday.getDate() - 1);
    return varToday.toISOString();
  }
  function get1WeekAgo() {
    varToday = new Date();
    varToday.setDate(varToday.getDate() - 7);;
    return varToday.toISOString();
  }
  function get1MonthAgo() {
    varToday = new Date();
    varToday.setMonth(varToday.getMonth() - 1);;
    return varToday.toISOString();
  }
  function get1YearAgo() {
    varToday = new Date();
    varToday.setFullYear(varToday.getFullYear() - 1);;
    return varToday.toISOString();
  }

  function get1WeekAgoMinus1() {
    varToday = new Date();
    varToday.setDate(varToday.getDate() - 6);;
    return varToday.toISOString();
  }
  function get1MonthAgoMinus1() {
    varToday = new Date();
    varToday.setDate(varToday.getDate() - 29);;
    return varToday.toISOString();
  }
  function get90AgoMinus1() {
    varToday = new Date();
    varToday.setDate(varToday.getDate() - 89);;
    return varToday.toISOString();
  }


  // To get and edit the 90 days graph using weeks and months and 90 days
  const get90DayPortfolioGraph = async (startDate: string, endDate: string, secondCall: boolean) => {
    try {
      setShowLoader("inprogress");
      let url = "portfolio/overview/USD"
      let params = { "startDate": startDate, "endDate": endDate }
      let clientservice: any = ClientService("get");
      let response = await clientservice(`/api/v1/users-portfolio/get90daysPortfolio?startDate=${startDate}&endDate=${endDate}`);
      console.log(response);
      if (response.data.portfolioExist) {
        backup90daysChart = response.data.portfolioOverview;
        let getNewDate = endDate.toString();
        backup90daysChart[getNewDate] = totalPortfolioValue.totalValue;
        load90daysGraph(backup90daysChart, false, secondCall);
        console.log(backup90daysChart);
        setreload(!reload)
      } else {
        counts = 0;
        setShowLoader("error");
      }
    }
    catch (e: any) {
      console.log(e);
      setShowLoader("error");
    }
  }

  useEffect(() => {
    if (props.allportfolioData.portfolioExist && props.portfolioValue !== null) {
      console.log("data exist");
      load90daysGraph(props.getportfolioData, false, false);
      setreload(!reload)
    } else {
      setShowLoader("error");
    }
    totalPortfolioValue = props.portfolioValue;
    if (totalPortfolioValue !== null) {
      changeDiffValue = props.portfolioValue.valueChange;
      temp = changeDiffValue;
      if (temp >= 0) {
        changeValue = "up";
        colorChart = '#40BAA0'
      } else if (temp < 0) {
        changeValue = "down"
        colorChart = '#C25358'
      }
    } else {
      changeValue = "up";
      colorChart = '#40BAA0'
    }

    portfolio90Graph = 6
    // numberToWords.toWords(12141231);

  }, [])
  function load90daysGraph(data: any, isResize: boolean, secondCall: boolean) {
    valueArr = [];
    datesArr = [];
    console.log(data);
    setShowLoader("inprogress");
    Object.entries(data).forEach(([key, value], index) => {
      let dateObj = getFormatedDate(parseISO(String(key)), "dd-MMM-yy");
      datesArr.push(String(dateObj));
      valueArr.push((Number(value).toFixed(10)));
      if (value !== 0 && first === 0) {
        first = value as number;
      } else if (index === Object.entries(data).length - 1) {
        last = value as number
        portfolioPercentage = ((last - first) / first) * 100;
        let date = new Date(key);
        let dateMinus1 = new Date(get1DayAgo());
        if (date.getUTCDate() === dateMinus1.getUTCDate() && lastDateFor90Graph) {
          datesArr.push(getFormatedDate(parseISO(lastDateFor90Graph), "dd-MMM-yy"));
          valueArr.push(lastValueFor90Graph);
        }
      } else {
        setTimeout(() => {
          setShowLoader("idle")
        }, 50);
      }
    });
    newValueForDifference = Object.values(data)[0];
    console.log(newValueForDifference);
    valueChangeDifference(last, newValueForDifference);
  }

  function valueChangeDifference(first: any, last: any) {
    if (totalPortfolioValue !== null) {
      let finalChange = first - last;
      changeDiffValue = finalChange.toFixed(2)
      temp = changeDiffValue;
      if (temp >= 0) {
        changeValue = "up";
        colorChart = '#40BAA0'
      } else if (temp < 0) {
        changeValue = "down"
        colorChart = '#C25358'
      }
    } else {
      changeValue = "up";
      colorChart = '#40BAA0'
    }
    setreload(!reload)
  }

  var contrastColor = "#000"
  const option = {
    color: colorChart,
    title: {
      left: 'center'
    },
    textStyle: {
      color: contrastColor
    },

    tooltip: {
      trigger: "axis",
      iconStyle: {
        borderColor: contrastColor
      },
      axisPointer: {
        lineStyle: {
          color: '#fff'
        },
        crossStyle: {
          color: '#817f91'
        },
        type: "shadow"
      }
    },
    xAxis: {
      type: 'category',
      data: datesArr
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (o: any) {
          let text = "$" + (Intl.NumberFormat('en-US', {
            notation: "compact",
            compactDisplay: "short"
          }).format(o));

          return text;
        }
      }
    },
    series: [
      {
        data: valueArr,
        type: 'line',
        barWidth: "60%",

      }
    ]
  };

  return (
    <div className={`container ${styles.portfolio_main}`}>
      <div className={`${styles.mobile_feed} mb-0 pb-0`}>
        {showNewsFeed === "idle" ?
          <div className='d-flex mt-2'>
            <img src={imageHost + "/news-feed-market.svg"} alt="" />
            <h5 className={`text-start mb-0 ${styles.market_heading} ${styles.animate_market}`} onClick={() => { setShowNewsFeed("inprogress") }}>Market trend</h5>
          </div>
          : <></>
        }
        <div className={showNewsFeed === "inprogress" ? `${styles.news_data} position-absolute ${styles.animate_feed}` : `${styles.news_data} position-absolute ${styles.animate_out}`} style={{ "zIndex": "1" }}>
          <div className={`${styles.feed_portfolio} px-0`}>
            <div className='text-end'>
              <img onClick={() => setShowNewsFeed("idle")} className='me-2 mt-2' src={imageHost + "/cross-icon-news.svg"} alt="" />
            </div>
            <div className={`${styles.top_gainers} px-3`}>
              <div className='d-flex justify-content-between'>
                <h4 className={`${styles.top_gainers_heading} mt-4`}>Did you know?</h4>
              </div>
              <div className={`${styles.gainer_div} border border-1 mb-3`}>
                <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-inner text-center">
                    <div className="carousel-item active" data-bs-interval="2000">
                      <p className="d-block w-100">The first commercial bitcoin transaction was done for 10,000 BTC for 2 pizzas</p>
                    </div>
                    <div className="carousel-item" data-bs-interval="2000">
                      <p className="d-block w-100">There are more than 16,000 cryptocurrencies in existence</p>
                    </div>
                    <div className="carousel-item" data-bs-interval="2000">
                      <p className="d-block w-100">The total 21 million of bitcoins can be created.</p>
                    </div>
                    <div className="carousel-item" data-bs-interval="2000">
                      <p className="d-block w-100">US owns the maximum crypto ATMs</p>
                    </div>
                    <div className="carousel-item" data-bs-interval="2000">
                      <p className="d-block w-100">Crypto currencies are taxable </p>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className={`${styles.crypto_feed} px-3`}>
              <div className='d-flex justify-content-between'>
                <h4 className={`${styles.top_gainers_heading} mt-4`}>Learn About Cryptos</h4>
              </div>
              <div className={styles.feed_div}>
                <p className={`${styles.feed_content_news} mt-3`}>The current crypto environment is composed of an amazing variety of digital assets with varied technical specifications and intended purposes...</p>
                <a href="https://stg.crptomarket.com/blog/what-are-the-different-types-of-cryptocurrency" target="_blank" className={styles.feed_link}>Find out more...</a>
              </div>
            </div>
            {/* <div className="latest-act px_3">
                            <div className='d-flex justify-content-between'>
                                <h4 className='top_gainers_heading mt-4'>Latest Activities</h4>
                            </div>
                            <div className="feed_div">
                                <h5 className='feed_head_news text-center mt-3'>To crytpos to trade with now</h5>
                                <p className='feed_content_news'>This is the demo data which is being used to show the demo all the latest news you will find on the blog page...</p>
                                <a href="">Read more</a>
                            </div>
                        </div> */}
          </div>
        </div>
      </div>
      <div className={styles.portfolio_graph}>
        <div className="row">
          <div className={`col-12 col-sm-12 col-lg-11 col-xl-8 ${styles.main_graph} mt-4 border border-1`}>
            <button className={styles.top_account_heading_btn}><h4 className={styles.top_account_heading}>Portfolio</h4></button>
            <div className='row'>
              {totalPortfolioValue !== null && totalPortfolioValue !== undefined ?
                <div className={`col-12 col-xl-6 ${styles.circle_data_tab} ${styles.tab_data} text-center`}>
                  <div className='position-relative'>
                    <p className={styles.total_amount}>USD</p>
                    <p className={styles.total_portfolio_value}>${totalPortfolioValue.totalValue}</p>
                    {changeValue === "up" ?
                      <>
                        <span className={`${styles.total_value_change_positive} px-1`}>+{changeDiffValue}</span>
                        <img className={styles.inside_arrow_image} src={imageHost + "/round-up-arrow.svg"} alt="" />
                      </>
                      :
                      <>
                        <span className={`${styles.total_value_change_negative} px-1`}>{changeDiffValue}</span>
                        <img className={styles.inside_arrow_image} src={imageHost + "/round-down-arrow.svg"} alt="" />
                      </>

                    }
                  </div>
                </div>
                :
                <div className={`col-12 col-xl-6 ${styles.circle_data_tab} ${styles.tab_data} text-center`}>
                  <p className={`${styles.total_amoun} mb-0`}>$0</p>
                  <img className={styles.inside_arrow_image} src={imageHost + "/round-up-arrow.svg"} alt="" />
                </div>
              }
              <div className={`${styles.desktop_div} col-6`}>
                &nbsp;
              </div>
              <div className={`col-12 col-xl-6 ${styles.desktop_month} text-end ${styles.line_chart_time_filter}  position-relative`}>
                <a onClick={() => { get90DayPortfolioGraph(get1WeekAgoMinus1(), getToday(), true); portfolio90Graph = 6 }} className={portfolio90Graph === 6 ? `pe-auto btn ${styles.btn_link} px-2 ${styles.active_btn}` : `pe-auto btn ${styles.btn_link} px-2 ${styles.normal_btn}`}>1W</a>
                <a onClick={() => { get90DayPortfolioGraph(get1MonthAgoMinus1(), getToday(), true); portfolio90Graph = 29 }} className={portfolio90Graph === 29 ? ` pe-auto btn ${styles.btn_link} px-2 ${styles.active_btn}` : `pe-auto btn ${styles.btn_link} px-2 ${styles.normal_btn}`}>1M</a>
                <a onClick={() => { get90DayPortfolioGraph(get90AgoMinus1(), getToday(), true); portfolio90Graph = 89 }} className={portfolio90Graph === 89 ? ` pe-auto btn ${styles.btn_link} px-2 ${styles.active_btn}` : `pe-auto btn ${styles.btn_link} px-2 ${styles.normal_btn}`}>3M</a>
              </div>
            </div>
            <div className={`col-12 text-end ${styles.mobile_month} ${styles.line_chart_time_filter}  position-relative`}>
              <a onClick={() => { get90DayPortfolioGraph(get1WeekAgoMinus1(), getToday(), true); portfolio90Graph = 6 }} className={portfolio90Graph === 6 ? `pe-auto btn ${styles.btn_link} px-2 ${styles.active_btn}` : `pe-auto btn ${styles.btn_link} px-2 ${styles.normal_btn}`}>1W</a>
              <a onClick={() => { get90DayPortfolioGraph(get1MonthAgoMinus1(), getToday(), true); portfolio90Graph = 29 }} className={portfolio90Graph === 29 ? ` pe-auto btn ${styles.btn_link} px-2 ${styles.active_btn}` : `pe-auto btn ${styles.btn_link} px-2 ${styles.normal_btn}`}>1M</a>
              <a onClick={() => { get90DayPortfolioGraph(get90AgoMinus1(), getToday(), true); portfolio90Graph = 89 }} className={portfolio90Graph === 89 ? ` pe-auto btn ${styles.btn_link} px-2 ${styles.active_btn}` : `pe-auto btn ${styles.btn_link} px-2 ${styles.normal_btn}`}>3M</a>
            </div>
            <div className="row">
              {totalPortfolioValue !== null && totalPortfolioValue !== undefined ?
                <div className={`col-5 ${styles.circle_data} ${styles.desktop_data}`}>
                  <p className={styles.total_amount}>USD</p>
                  <p className={styles.total_portfolio_value}>${totalPortfolioValue.totalValue}</p>
                  {changeValue === "up" ?
                    <>
                      <span className={`${styles.total_value_change_positive} px-1`}>+{changeDiffValue}</span>
                      <img src={imageHost + "/round-up-arrow.svg"} alt="" />
                    </>
                    :
                    <>
                      <span className={`${styles.total_value_change_negative} px-1`}>{changeDiffValue}</span>
                      <img src={imageHost + "/round-down-arrow.svg"} alt="" />
                    </>

                  }
                </div> :
                <div className={`col-5 ${styles.circle_data} ${styles.desktop_data} text-center`}>
                  <p className={`${styles.total_no_amount} mb-0`}>$0</p>
                  <img src={imageHost + "/round-up-arrow.svg"} alt="" />
                </div>
              }
              <div className={`${styles.mainChart} col-12 col-xl-10 mt-3 ms-auto`}>
                {showLoader === "idle" ?
                  <ReactEcharts option={option} />
                  :
                  <>
                    {showLoader === "inprogress" ?
                      <div className={styles.loader_div}><img src={imageHost + "/loader-small.gif"} alt="" /></div>
                      :
                      <img className={`mt-5 ${styles.no_data_image}`} src={imageHost + "/no-data-exists.svg"} alt="" />
                    }
                  </>
                }
              </div>
            </div>

          </div>
        </div>
      </div>
      {
        props.accountsStatusAndCount !== null ?
          <>
            {showingExpiredDiv === "idle" ?
              <div className={styles.expired_warning}>
                <div className="row">
                  <div className={`col-12 col-lg-11 ${styles.warning_div} mt-5 mt-lg-0 ps-0 ms-auto`}>
                    <div className={styles.warning2}>
                      <p className={styles.warning_para}>
                        <a onClick={() => setShowingExpiredDiv("noShow")} className={styles.cross_connected}> <img
                          src={imageHost + "/cross-warning-port.svg"} alt="" className={styles.src} />
                        </a>
                        You have {props.accountsStatusAndCount.EXPIRED} <span>Expired Accounts</span>.Please connect them again from <a href="/add-account" className={styles.warning_anchor}>Add account</a> page to
                        get the updated portfolio.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              : <>
              </>}
          </>
          :
          <></>
      }
    </div >
  )
}

export default PortfolioGraph