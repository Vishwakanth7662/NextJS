import React, { useEffect, useState } from 'react'
import * as _ from 'lodash';
import { format, parseISO } from 'date-fns';
import ReactEcharts from "echarts-for-react";
import * as echarts from 'echarts';
import ClientService from '../../services/main-serviceClient';
import styles from "../../styles/users-portfolio/market-trend.module.scss";

type EChartsOption = echarts.EChartsOption;
interface CarouselFinalData {
    name: string,
    logo_url: string,
    id: string,
    rates: number,
    diff: string
}
interface MainGraphDataArray {
    timestamp: string,
    open: string,
    high: string,
    low: string,
    close: string
}
interface Currencies {
    id: string,
    logo_url: string,
    name: string

}


let allInOneArray = Array<CarouselFinalData>();
let finalArray = Array<CarouselFinalData>();

let diff = "";
var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;
let varToday: Date | any;
let varCarouselData = Array();
let allcurrencies: any = [];
let timer: number | any;
let currentCrypto: String = "BTC";
let mainGraphTimmings = 0;
let varMainGraphCurrencyName: String | undefined;
let varMainGraphCurrencyImageURL: String | undefined;
let backupGraphData: any;

const MarketTrend = (props: any) => {
    let clientservice: any = ClientService("get");
    const [reload, setreload] = useState(false);
    const [is500ErrorGraph, setis500ErrorGraph] = useState(false);
    const [isChartData, setisChartData] = useState(false);
    const [isDataLoading, setisDataLoading] = useState(false);
    const [isShowList, setisShowList] = useState(false);
    const [isShowingSearch, setisShowingSearch] = useState(true);
    const [showNewList, setshowNewList] = useState(false);
    const [graphData, setgraphData] = useState<any>();

    function setMainGraph(data: any, isResize: boolean) {
        setisDataLoading(false);
        var chartDom = document.getElementById('mainChart')!;
        var myChart = echarts.init(chartDom);
        myChart.dispose();
        myChart.dispose();
        myChart = echarts.init(chartDom);
        var option: EChartsOption;
        if (isResize) {
            setTimeout(() => {
                myChart.resize({
                    width: "auto"
                });
            }, 100);
        }
        if (data) {
            try {
                let dateArr = [''];
                //should be in sequence of (close, open, low, high)
                let dataArr = [
                    [0, 0, 0, 0]
                ];
                let gridLeftpadding = "50"
                dateArr.shift();
                dataArr.shift();
                data.forEach((element: { timestamp: any; close: any; open: any; low: any; high: any; }) => {
                    if (mainGraphTimmings == 1) {
                        let dateObj = getFormatedDate(parseISO(element.timestamp), "HH:mm");
                        dateArr.push(String(dateObj))
                    }
                    else if (mainGraphTimmings === 7) {
                        let dateObj = getFormatedDate(parseISO(element.timestamp), "dd-MMM-yy HH:mm");
                        dateArr.push(String(dateObj))
                    }
                    else {
                        let dateObj = getFormatedDate(parseISO(element.timestamp), "dd-MMM-yy");
                        dateArr.push(String(dateObj))
                    }

                    let itemArr = [element.close, element.open, element.low, element.high];
                    dataArr.push(itemArr);
                });
                let largestHigh = largest(dataArr);
                if (largestHigh > 99999) {
                    gridLeftpadding = "100"
                } else {
                    gridLeftpadding = "50"
                }
                console.log(dateArr);

                option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: function (o: any) {
                            return o.name + '<br>' + 'Close :' + o.data[1] + '<br>' + 'Open :' + o.data[2] + '<br>' + 'Low :' + o.data[3] + '<br>' + 'High :' + o.data[4];
                        }
                    },
                    xAxis: {
                        data: dateArr,
                        scale: true,
                        type: "category",
                        nameLocation: "middle"
                    },
                    yAxis: { scale: true, },
                    grid: {
                        left: gridLeftpadding,
                        right: '25',
                        top: '15',
                        bottom: '25',
                    },
                    dataZoom: [
                        {
                            type: 'inside',
                            start: 0,
                            end: 100
                        },
                    ],
                    series: [
                        {
                            type: 'candlestick',
                            data: dataArr
                        }
                    ]
                };
                option && myChart.setOption(option);
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    function largest(array: any) {
        let max = 0;
        array.forEach((element: any) => {
            if (Math.ceil(element[3]) > max) {
                max = Math.ceil(element[3]);
            }
        });
        return max
    }
    // Getting the difference in the caraousel 
    function getTopMarketDetails() {
        varCarouselData.forEach((element: any) => {
            let dataArray = element;
            if (dataArray.rates.length != 0) {
                let rate = Number(dataArray.rates[dataArray.rates.length - 1].close);
                let temp = Number(dataArray.rates[dataArray.rates.length - 1].close) - Number(dataArray.rates[0].open);
                if (temp >= 0) {
                    diff = "up"
                    let obj = {
                        name: element.name,
                        logo_url: element.logo,
                        id: element.id,
                        rates: rate,
                        diff: diff,
                        currency: element.currency,
                        symbol: element.symbol
                    }
                    finalArray.push(obj);
                } else {
                    diff = "down"
                    let obj = {
                        name: element.name,
                        logo_url: element.logo,
                        id: element.idiffd,
                        rates: rate,
                        diff: diff,
                        currency: element.currency,
                        symbol: element.symbol
                    }
                    finalArray.push(obj);
                }
            }
            allInOneArray = finalArray;
            setreload(!reload);
        });
    }


    function showList() {
        setisShowList(true);
        setisShowingSearch(false);
    }

    function hideList() {
        setisShowList(false);
        setisShowingSearch(true);
    }
    //Setting the dates and days and months for the 90 days portfolio graph
    function getFormatedDate(date: Date, dateFormat: string) {
        return format(date, dateFormat);
    }
    function getToday() {
        varToday = new Date();
        return varToday.toISOString();
    }
    function getDiffDays(sDate: any, eDate: any) {
        var startDate = new Date(sDate);
        var endDate = new Date(eDate);
        var Time = endDate.getTime() - startDate.getTime();
        return Time / (1000 * 3600 * 24);
    }

    function get1DayAgo() {
        varToday = new Date();
        varToday.setDate(varToday.getDate() - 1);;
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


    // Searching the graph using search bar
    function searchMainCrypto(val: any) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            onSearchComplete(val.target.value);
        }, 500);
    }
    function onSearchComplete(id: string) {
        if (id === '') {
            setingCryptoCurrencies();
        } else {
            getCryptoByPatternData(id);
            console.log("In patteren data");
        }
    }
    function onSearchCryptoClicked(val: any) {
        setisDataLoading(true)
        setisChartData(true);
        checkCurrency(val.target.id, allcurrencies);
        hideList();
        setshowNewList(false);
    }
    function checkCurrency(cryptoName: any, CurrenciesArray: any) {
        let currency = cryptoName
        let array = CurrenciesArray;
        let data: Currencies = _.find(array, function (obj: any) {
            if (obj.id === currency) {
                return obj;
            }
        })
        try {
            if (mainGraphTimmings === 1 || mainGraphTimmings === 2) {
                getCryptoByPatternWithDateData(data.id, get1DayAgo(), getToday());
            } else if (mainGraphTimmings === 7) {
                getCryptoByPatternWithDateData(data.id, get1WeekAgo(), getToday());
            } else if (mainGraphTimmings === 30) {
                getCryptoByPatternWithDateData(data.id, get1MonthAgo(), getToday());
            } else if (mainGraphTimmings === 365) {
                getCryptoByPatternWithDateData(data.id, get1YearAgo(), getToday());
            } else {
                console.log("unknown date");
            }
        }
        catch (e) {
            console.log(e);
            setisChartData(false);
            setisDataLoading(false)
        }
    }
    function setingCryptoCurrencies() {
        allcurrencies = [];
        allcurrencies = props.forStoringExc;
        setreload(!reload);
    }
    const getCryptoByPatternData = async (dataString: String) => {
        try {
            let url = "search/currency/" + dataString;
            let response = await clientservice(`/api/v1/users-portfolio/getCryptoByPatternData?data=${dataString}`);
            console.log(response);
            allcurrencies = []
            response.data.currencies.forEach((item: Currencies) => {
                let data: Currencies = item;
                if (data.logo_url === "") {
                    data.logo_url = "https://placehold.jp/150x150.png"
                    allcurrencies.push(data);
                } else {
                    allcurrencies.push(data);
                }
            })
            setreload(!reload);
        }
        catch (e) {
            console.log(e);
        }
    }

    function setCryptoNameAndImage(data: any) {
        let dataObj: Currencies = _.find(allcurrencies, function (obj: any) {
            console.log(obj);
            if (obj.id === data) {
                return obj;
            }
        })
        let abcObj: any;
        if (dataObj === undefined) {
            abcObj = _.find(finalArray, function (obj: any) {
                if (obj.id === data) {
                    return obj;
                }
            })
            dataObj = abcObj;
        }
        console.log(dataObj.name);
        if (dataObj.name !== null) {
            varMainGraphCurrencyName = String(dataObj.name);
        } else {
            varMainGraphCurrencyName = "NaN"
        }
        if (dataObj.logo_url !== null) {
            console.log(data.logo_url);
            varMainGraphCurrencyImageURL = String(dataObj.logo_url);
        } else {
            varMainGraphCurrencyImageURL = "https://placehold.jp/150x150.png"
        }
    }

    const getCryptoByPatternWithDateData = async (crypto: String, startDate: String, endDate: String) => {
        setisChartData(true);
        setisDataLoading(true)
        try {
            let url = "currency/rate/" + crypto;
            currentCrypto = crypto
            let params = { "startDate": startDate, "endDate": endDate }
            console.log(currentCrypto);
            
            let response = await clientservice(`/api/v1/users-portfolio/getCryptoByPatternWithDateData?data=${currentCrypto}&startDate=${startDate}&endDate=${endDate}`);
            console.log(response);
            if (response.data.currencyRate.length === 0) {
                setisChartData(false);
                setCryptoNameAndImage(crypto);
                setisDataLoading(false)
                setreload(!reload);
            } else {
                setCryptoNameAndImage(crypto);
                setMainGraph(response.data.currencyRate, false)
                setisChartData(true);
                setis500ErrorGraph(false);
            }
        }
        catch (e: any) {
            setisDataLoading(false)
            setisChartData(false);
            console.log(e);
            let data: Currencies = _.find(allcurrencies, function (obj: any) {
                if (obj.id === crypto) {
                    return obj;
                }
            })
            varMainGraphCurrencyName = data.name;
            varMainGraphCurrencyImageURL = "https://placehold.jp/150x150.png";
            if (e.status === 500) {
                setis500ErrorGraph(true);
            } else {
                setis500ErrorGraph(true)
            }
            setreload(!reload)
        }
    }

    function callGraphWith1Day() {
        getCryptoByPatternWithDateData(currentCrypto, get1DayAgo(), getToday());
        mainGraphTimmings = 1

    }
    function callGraphWith1Week() {
        getCryptoByPatternWithDateData(currentCrypto, get1WeekAgo(), getToday());
        mainGraphTimmings = 7

    }
    function callGraphWith1Month() {
        getCryptoByPatternWithDateData(currentCrypto, get1MonthAgo(), getToday());
        mainGraphTimmings = 30

    }
    function callGraphWith1Year() {
        getCryptoByPatternWithDateData(currentCrypto, get1YearAgo(), getToday());
        mainGraphTimmings = 365

    }
    function getMarketDiff() {
        let marketPastDays = Math.ceil(getDiffDays(props.allportfolioData.marketStartDate, props.allportfolioData.marketEndDate));
        if (marketPastDays === 2) {
            mainGraphTimmings = 1;
        } else {
            mainGraphTimmings = marketPastDays;
        }
    }

    useEffect(() => {
        varCarouselData = props.getingToExchangeRates;
        allcurrencies = props.allportfolioData.currencies;
        getTopMarketDetails();
        getMarketDiff();
        checkCurrency(currentCrypto, allcurrencies);
    }, [])

    return (
        <div className={styles.market_main_graph}>
            <button className={styles.trends_heading_btn}><h5 className={styles.trends_heading}>Market trends</h5></button>
            {/* Mobile and smaller view */}
            <div id="portfolioCarouselMobileControls" className="carousel slide container my-3 d-sm-block d-md-none" data-bs-ride="carousel" >
                <div className="carousel-inner">
                    {allInOneArray.map((element, index) => {
                        return (
                            <div className={index === 0 ? "carousel-item active" : "carousel-item"} key={`mobile${index.toString()}`} data-bs-interval="3000">
                                <div className="row" key={`mobile${index.toString()}`}>
                                    <div className="col-md-12 px-4" key={`mobile${index.toString()}`}>
                                        <div className={styles.crypto_box}>
                                            <div className="row g-0 px-2">
                                                <div className="col-6 text-end px-0" >
                                                    <img
                                                        className={styles.carousel_graph_image}
                                                        src={String(element.logo_url)}
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-6 text-start px-0" >

                                                    {
                                                        element.diff === "up" ? <img
                                                            className={`${styles.carousel_graph_arrow} mx-2`}
                                                            src={imageHost + "/up.svg"}
                                                            alt=""
                                                        /> : <img
                                                            className={`${styles.carousel_graph_arrow} mx-2`}
                                                            src={imageHost + "/down.svg"}
                                                            alt=""
                                                        />
                                                    }


                                                </div>
                                                <div className="col-12 text-center px-0">
                                                    <p className={`m-0 ${styles.crypto_heading}`}>{element.name}</p>
                                                    <p className={`m-0 ${styles.crypto_sub_heading}`}>
                                                        1 {element.id} = <span className={element.diff === "up" ? `${styles.color_green_1} ${styles.fw_bold} ${styles.price_rate}` : `${styles.color_red} ${styles.fw_bold} ${styles.price_rate}`}>${element.rates}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={styles.clicklable_section_carousel} key={`mobile${String(element.id)}`} id={String(element.id)} >
                                                &nbsp;
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>)
                    })}

                </div>
                <button className={`carousel-control-prev ${styles.carousel_control_prev}`} type="button" data-bs-slide="prev" data-bs-target="#portfolioCarouselMobileControls">
                    <span className={`carousel-control-prev-icon ${styles.carousel_control_prev_icon}`} aria-hidden="true" ></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className={`carousel-control-next ${styles.carousel_control_next}`} type="button" data-bs-slide="next" data-bs-target="#portfolioCarouselMobileControls">
                    <span className={`carousel-control-next-icon ${styles.carousel_control_next_icon}`} aria-hidden="true" ></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            {/* For desktop */}
            <div id="portfolioCarouselDesktopControls" className="carousel position-relative slide container my-5 d-none d-md-block" data-bs-ride="carousel" >
                <div className="carousel-inner">
                    {["0", "1", "2", "3"].map((mainElement, mainIndex) => {
                        return <div className={mainIndex === 0 ? "carousel-item active" : "carousel-item"} key={`mainId${mainIndex.toString()}`} data-bs-interval="3000">
                            <div className="row" key={`row${mainElement}`}>
                                {
                                    allInOneArray.map((element: any, index: any) => {
                                        {
                                            return mainIndex === 0 && index < 3 ?
                                                <div className={`col-md-4 px-4 ${styles.item}`} key={element.currency} id={String(index)}>
                                                    <div className={styles.crypto_box}>
                                                        <div className="row g-0 px-2">
                                                            <div className="col-6 text-end px-0" >
                                                                <img
                                                                    className={styles.carousel_graph_image}
                                                                    src={String(element.logo_url)}
                                                                    alt=""
                                                                />
                                                            </div>
                                                            <div className="col-6 text-start px-0" >

                                                                {
                                                                    element.diff === "up" ? <img
                                                                        className={`${styles.carousel_graph_arrow} mx-2`}
                                                                        src={imageHost + "/up.svg"}
                                                                        alt=""
                                                                    /> : <img
                                                                        className={`mx-2 ${styles.carousel_graph_arrow}`}
                                                                        src={imageHost + "/down.svg"}
                                                                        alt=""
                                                                    />
                                                                }


                                                            </div>
                                                            <div className="col-12 text-center px-0">
                                                                <p className={`m-0 ${styles.crypto_heading}`}>{element.name}</p>
                                                                <p className={`m-0 ${styles.crypto_sub_heading}`}>
                                                                    1 {element.currency} = <span className={element.diff === "up" ? `${styles.color_green_1} ${styles.fw_bold} ${styles.price_rate}` : `${styles.color_red} ${styles.fw_bold} ${styles.price_rate}`}>${element.rates}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className={styles.clicklable_section_carousel} key={String(element.id)} id={String(element.id)}>
                                                            &nbsp;
                                                        </div>
                                                    </div>
                                                </div>
                                                : <></>
                                        }
                                    })
                                }
                                {
                                    allInOneArray.map((element: any, index: any) => {
                                        {
                                            return mainIndex === 1 && index > 2 && index < 6 ?
                                                <div className={`col-md-4 px-4 ${styles.item}`} key={element.currency} id={String(index)}>
                                                    <div className={styles.crypto_box} >
                                                        <div className="row g-0 px-2">
                                                            <div className="col-6 text-end px-0" >
                                                                <img
                                                                    className={styles.carousel_graph_image}
                                                                    src={String(element.logo_url)}
                                                                    alt=""
                                                                />
                                                            </div>
                                                            <div className="col-6 text-start px-0" >

                                                                {
                                                                    element.diff === "up" ? <img
                                                                        className={`${styles.carousel_graph_arrow} mx-2`}
                                                                        src={imageHost + "/up.svg"}
                                                                        alt=""
                                                                    /> : <img
                                                                        className={`${styles.carousel_graph_arrow} mx-2`}
                                                                        src={imageHost + "/down.svg"}
                                                                        alt=""
                                                                    />
                                                                }


                                                            </div>
                                                            <div className="col-12 text-center px-0">
                                                                <p className={`m-0 ${styles.crypto_heading}`} >{element.name}</p>
                                                                <p className={`m-0 ${styles.crypto_sub_heading}`}>
                                                                    1 {element.currency} = <span className={element.diff === "up" ? `${styles.color_green_1} ${styles.fw_bold} ${styles.price_rate}` : `${styles.color_red} ${styles.fw_bold} ${styles.price_rate}`}>${element.rates}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className={styles.clicklable_section_carousel} key={String(element.id)} id={String(element.id)}>
                                                            &nbsp;
                                                        </div>
                                                    </div>
                                                </div>
                                                : <></>
                                        }
                                    })
                                }
                                {
                                    allInOneArray.map((element: any, index: any) => {
                                        {
                                            return mainIndex === 2 && index > 5 && index < 9 ?
                                                <div className={`col-md-4 px-4 ${styles.item}`} key={element.currency} id={String(index)}>
                                                    <div className={styles.crypto_box}  >
                                                        <div className="row g-0 px-2">
                                                            <div className="col-6 text_end px-0" >
                                                                <img
                                                                    className={styles.carousel_graph_image}
                                                                    src={String(element.logo_url)}
                                                                    alt=""
                                                                />
                                                            </div>
                                                            <div className="col-6 text-start px-0" >

                                                                {
                                                                    element.diff === "up" ? <img
                                                                        className={`${styles.carousel_graph_arrow} mx-2`}
                                                                        src={imageHost + "/up.svg"}
                                                                        alt=""
                                                                    /> : <img
                                                                        className={`${styles.carousel_graph_arrow} mx-2`}
                                                                        src={imageHost + "/down.svg"}
                                                                        alt=""
                                                                    />
                                                                }


                                                            </div>
                                                            <div className="col-12 text-center px-0">
                                                                <p className={`m-0 ${styles.crypto_heading}`} >{element.name}</p>
                                                                <p className={`m-0 ${styles.crypto_sub_heading}`}>
                                                                    1 {element.currency} = <span className={element.diff === "up" ? `${styles.color_green_1} ${styles.fw_bold} ${styles.price_rate}` : `${styles.color_red} ${styles.fw_bold} ${styles.price_rate}`}>${element.rates}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className={styles.clicklable_section_carousel} key={String(element.id)} id={String(element.id)}>
                                                            &nbsp;
                                                        </div>
                                                    </div>
                                                </div>
                                                : <></>
                                        }
                                    })
                                }
                                {
                                    allInOneArray.map((element: any, index: any) => {
                                        {
                                            return mainIndex === 3 && index > 8 && index < 12 ?
                                                <div className={`col-md-4 px-4 ${styles.item}`} key={element.currency} id={String(index)}>
                                                    <div className={styles.crypto_box}  >
                                                        <div className="row g-0 px-2">
                                                            <div className="col-6 text-end px-0" >
                                                                <img
                                                                    className={styles.carousel_graph_image}
                                                                    src={String(element.logo_url)}
                                                                    alt=""
                                                                />
                                                            </div>
                                                            <div className="col-6 text-start px-0" >

                                                                {
                                                                    element.diff === "up" ? <img
                                                                        className={`${styles.carousel_graph_arrow} mx-2`}
                                                                        src={imageHost + "/up.svg"}
                                                                        alt=""
                                                                    /> : <img
                                                                        className={`${styles.carousel_graph_arrow} mx-2`}
                                                                        src={imageHost + "/down.svg"}
                                                                        alt=""
                                                                    />
                                                                }


                                                            </div>
                                                            <div className="col-12 text-center px-0">
                                                                <p className={`m-0 ${styles.crypto_heading}`} >{element.name}</p>
                                                                <p className={`m-0 ${styles.crypto_sub_heading}`}>
                                                                    1 {element.currency} = <span className={element.diff === "up" ? `${styles.color_green_1} ${styles.fw_bold} ${styles.price_rate}` : `${styles.color_red} ${styles.fw_bold} ${styles.price_rate}`}>${element.rates}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className={styles.clicklable_section_carousel} key={String(element.id)} id={String(element.id)}>
                                                            &nbsp;
                                                        </div>
                                                    </div>
                                                </div>
                                                : <></>
                                        }
                                    })
                                }
                            </div>
                        </div>
                    })}
                </div>
                <button className={`carousel-control-prev ${styles.carousel_control_prev}`} type="button" data-bs-slide="prev" data-bs-target="#portfolioCarouselDesktopControls">
                    <span className={`carousel-control-prev-icon ${styles.carousel_control_prev_icon}`} aria-hidden="true" ></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className={`carousel-control-next ${styles.carousel_control_next}`} type="button" data-bs-slide="next" data-bs-target="#portfolioCarouselDesktopControls">
                    <span className={`carousel-control-next-icon ${styles.carousel_control_next_icon}`} aria-hidden="true" ></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            <section className={`${styles.main_graph} border border-0`}>
                <div className="row">
                    {/* Desktop View */}
                    <div className="col-md-3 d-none d-md-block">
                        <form action="" className={styles.search_div}>
                            <input
                                className={`form-control px-3 ${styles.input_field}`}
                                type="text"
                                placeholder="Search"
                                onChange={(e) => searchMainCrypto(e)}
                            />
                            <img
                                src={imageHost + "/search-icon.svg"}
                                alt=""
                                className={styles.search_icon}
                            />
                        </form>
                        <div className={`${styles.below_search} pt-2`}>
                            {
                                allcurrencies.map((element: any, index: number) => {
                                    return (
                                        <div className={styles.currencies_list} key={index.toString()} id={String(element.id)} onClick={(e) => onSearchCryptoClicked(e)} >
                                            <span id={String(element.id)} key={String(element.id)}>
                                                <img alt="" className={styles.currencies_img} id={String(element.id)} key={String(element.id)} src={String(element.logo_url)} />
                                                {element.name}
                                            </span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    {/* Tablet and Smaller View */}
                    <div className="col-md-3 d-block d-md-none" tabIndex={0} >
                        {
                            isShowList ? <div className={styles.form_and_list_view}>
                                <form action="" className={styles.search_div}>
                                    <img onClick={() => hideList()}
                                        src={imageHost + "/cross-close-red.svg"}
                                        alt=""
                                        className={styles.search_icon}
                                    />
                                    <input
                                        className={`form-control px-3 ${styles.input_field}`}
                                        type="text"
                                        placeholder="Search"
                                        onChange={(e) => searchMainCrypto(e)}
                                    />
                                </form>
                                <div className={`${styles.below_search} pt-2`}>
                                    {
                                        allcurrencies.map((element: any, index: number) => {
                                            return (
                                                <div className={styles.currencies_list} key={index.toString()} id={String(element.id)} onClick={(e) => onSearchCryptoClicked(e)}>
                                                    <span id={String(element.id)} key={String(element.id)}>
                                                        <img alt="" className={styles.currencies_img} id={String(element.id)} key={String(element.id)} src={String(element.logo_url)} />
                                                        {element.name}
                                                    </span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div> : <></>
                        }
                    </div>
                    <div className='col-md-9'>
                        <div className={`row ${styles.main_chart_container_with_text}`}>
                            <div className="col-md-6 position-relative">
                                <div className={`${styles.search_btn_container} d-block d-md-none`}>
                                    {isShowingSearch === true ?
                                        <button className={`btn ${styles.search_btn}`}><img
                                            className={styles.image}
                                            src={imageHost + "/search-icon.svg"}
                                            alt=""
                                            onClick={() => showList()}
                                        /></button> : <></>
                                    }

                                </div>
                                <div className={`py-2 ${styles.currency_details}`}>
                                    <img
                                        className={styles.main_graph_currency_image}
                                        src={String(varMainGraphCurrencyImageURL)}
                                        alt=""
                                    />
                                    <span className={styles.main_graph_currency_heading}>
                                        {varMainGraphCurrencyName}
                                        /
                                        <span className={styles.color_purple}><strong>USD</strong></span>
                                    </span>
                                </div>
                            </div>
                            <div className={`col-md-6 ${styles.filter}`}>
                                <div className={`py-2 ${styles.line_chart_time_filter}`}>
                                    {
                                        isDataLoading ?
                                            <img className={`me-1 ${styles.sync_loader}`} src={imageHost + "/loader-small.gif"} alt="" />
                                            :
                                            <></>
                                    }
                                    <a
                                        onClick={() => { callGraphWith1Day() }}
                                        className={mainGraphTimmings === 1 || mainGraphTimmings === 2 ? `pe-auto btn ${styles.btn_link} px-1 ${styles.active} active` : `pe-auto btn ${styles.btn_link} px-1`}
                                    >
                                        24h
                                    </a>
                                    <a
                                        onClick={() => { callGraphWith1Week() }}
                                        className={mainGraphTimmings === 7 ? `pe-auto btn ${styles.btn_link} px-1 ${styles.active} active` : `pe-auto btn ${styles.btn_link} px-1`}
                                    >
                                        1W
                                    </a>
                                    <a
                                        onClick={() => { callGraphWith1Month() }}
                                        className={mainGraphTimmings === 30 ? `pe-auto btn ${styles.btn_link} px-1 ${styles.active} active` : `pe-auto btn ${styles.btn_link} px-1`}
                                    >
                                        1M
                                    </a>
                                    <a
                                        onClick={() => { callGraphWith1Year() }}
                                        className={mainGraphTimmings === 365 ? `pe-auto btn btn_link px-1 ${styles.active} active` : `pe-auto btn ${styles.btn_link} px-1`}
                                    >
                                        1Y
                                    </a>

                                </div>
                            </div>
                        </div>
                        <div className='h-100'>
                            {
                                isChartData ?
                                    <div id="mainChart" className={isChartData ? `${styles.main_chart}` : "d-none"}>

                                    </div>
                                    :
                                    <div className={styles.error_popup_view}>
                                        {
                                            is500ErrorGraph ? <img
                                                className={styles.error_500_img}
                                                src={imageHost + "/500-error.svg"}
                                                alt=""
                                            /> : <img
                                                className={styles.img_fluid}
                                                src={imageHost + "/no-data-exists.svg"}
                                                alt=""
                                            />
                                        }

                                    </div>
                            }
                        </div>
                    </div>
                </div>
                {
                    isDataLoading ?
                        <div className={styles.loader_overley}>
                            <img className={`${styles.sync_loader} absolute-center`} src={imageHost + "/loader2.gif"} alt="" />
                        </div>
                        :
                        <></>
                }
            </section>
        </div >
    )
}

export default MarketTrend
