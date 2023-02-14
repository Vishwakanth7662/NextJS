import React, { useEffect, useState } from 'react'
import * as echarts from 'echarts';
import { format, parseISO } from 'date-fns';
import ReactEcharts from "echarts-for-react";
import styles from "../../styles/users-portfolio/trading.module.scss";

var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;
let currencyArr: any = [];
let valuecryptoArr: any = [];
type EChartsOption = echarts.EChartsOption
const TradingModule = (props: any) => {
    const [reload, setreload] = useState(false);
    //  Formatting the date
    function getFormatedDate(date: Date, dateFormat: string) {
        return format(date, dateFormat); 
    }
    useEffect(() => {
        props.getCryptoGraph(props.crptodata);
        props.getExchangeTradeGraph(props.currentExchange);
    }, [])
    function handleNextCrypto() {
        props.setCurrentCrptoCage(props.currentCrptoPage + 1);
        if (props.currentCrptoPage + 1 > props.maxCryptoPageNoLimit) {
            props.setmaxCryptoPageNoLimit(props.maxCryptoPageNoLimit + props.cryptoPageLimit);
            props.setminCryptoPageNoLimit(props.minCryptoPageNoLimit + props.cryptoPageLimit)
        }
        console.log(props.crptodata); 
        setTimeout(() => {
            console.log("Trading crypto called");
            console.log(props.crptodata);
            props.getCryptoGraph(props.crptodata);
        }, 2000);
        setreload(!reload)
    }
    function handlePreCrypto() {
        props.setCurrentCrptoCage(props.currentCrptoPage - 1);
        if ((props.currentCrptoPage - 1) % props.cryptoPageLimit == 0) {
            props.setmaxCryptoPageNoLimit(props.maxCryptoPageNoLimit - props.cryptoPageLimit);
            props.setminCryptoPageNoLimit(props.minCryptoPageNoLimit - props.cryptoPageLimit)
        }
        console.log(props.crptodata)
        setTimeout(() => {
             console.log(props.crptodata)
            props.getCryptoGraph(props.crptodata);
        },100);
        setreload(!reload);
    }
    function handlePreExchange() {
        props.setcurrentExchangePage(props.currentExchangePage - 1)
        if ((props.currentExchangePage - 1) % props.exchangePageLimit == 0) {
            props.setmaxExchangePageNoLimit(props.maxExchangePageNoLimit - props.exchangePageLimit);
            props.setminExchangePageNoLimit(props.minExchangePageNoLimit - props.exchangePageLimit);
        }
        setTimeout(() => {
            props.getExchangeTradeGraph(props.currentExchange);
        }, 200);
        setreload(!reload);
    }
    function handleNextExchange() {
        props.setcurrentExchangePage(props.currentExchangePage + 1)
        if ((props.currentExchangePage + 1) > props.maxExchangePageNoLimit) {
            props.setmaxExchangePageNoLimit(props.maxExchangePageNoLimit - props.exchangePageLimit);
            props.setminExchangePageNoLimit(props.minExchangePageNoLimit - props.exchangePageLimit);
        }
        setTimeout(() => {
            props.getExchangeTradeGraph(props.currentExchange);
        }, 200);
        setreload(!reload);
    }


    //Graph Data for crypto trading activity
    var colorChart = '#FFF'
    var contrastColor = "#FFF"
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
            data: props.currencyArray,
            minInterval: 1
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: props.valuecryptoArray,
                type: 'bar',
                barWidth: "60%",
                name: "No. of txns"
            }
        ]
    };

    //Graph Data for exchange trading activity
    const option2 = {
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
            data: props.exchangeArray,
            minInterval: 0,
            maxInterval: 1,
            nameTextStyle: {
                fontStyle: 'normal'
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: props.exchangeTxnsArray,
                type: 'bar',
                barWidth: "60%",
                name: "No. of txns"
            }
        ]
    };

    return (
        <div className={`${styles.trading_main} container`}>
            <div className={`mt-5 ${styles.trading_accounts}`}>
                <div className="row">
                    {/* For crypto trading activity */}
                    {props.crptodatafinal !== null ?
                        <div className={`col-12 col-lg-11 col-xl-8 ms-auto mb-3 border border-1 ${styles.top_accounts_subhead} ${styles.top_trading}`}>
                            <button className={styles.top_trading_heading_btn}><h4 className={styles.top_trading_heading}>Crypto Trading Activity</h4></button>
                            <div className="row">
                                <div className={`col-12 ps-0 col-md-12 col-lg-3 ${styles.exchange_section}`}>
                                    <div className={styles.background_accounts}>
                                        <div className={styles.mainChart}>
                                            <ReactEcharts option={option} />
                                        </div>
                                    </div>
                                </div>
                                <div className={`col-12 col-md-12 col-xl-9 ms-auto mt-4 me-4 ${styles.trading_table}}`}>
                                    <table className={`table mb-0 ${styles.table_head_size}`}>
                                        <thead className={styles.static_border_bottom}>
                                            <tr>
                                                <th scope="col" className={`${styles.border_adjustment} col-2 text-start px-0`}>Crypto</th>
                                                <th scope="col" className={`${styles.border_adjustment} col-2 text-center px-0`} >No. of txn</th>
                                                <th scope="col" className={`${styles.border_adjustment} col-3`}>Last txn Date</th>
                                                <th scope="col" className={`${styles.border_adjustment} col-4`}>Last txn Details</th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div className={styles.all_crypto_trading}>
                                        {console.log(props.crptodata)
                                        }
                                        {props.crptodata.map((cryptos: any) => {
                                            return <div className={`row ${styles.row_trading}`} key={cryptos.id}>
                                                <div className="col-3 text-start">
                                                    <p className={styles.main_crypto}>{cryptos.currency}</p>
                                                </div>
                                                <div className="col-2 text-start">
                                                    <p>{cryptos.txnCounts}</p>
                                                </div>
                                                <div className="col-3 ps-0">
                                                    <p>{getFormatedDate(parseISO(cryptos.txnDate), "dd-MMM-yy")}</p>
                                                </div>
                                                <div className="col-4">
                                                    {cryptos.txnType === "TRADE" ?
                                                        <div className='d-flex text-end'>
                                                            <img className={styles.icon_size} style={{marginTop:"-12px"}} src={imageHost + "/trade-new-icon.svg"} alt="" /> <p className='text-end' style={{"wordBreak":"break-all"}}>{cryptos.holdings}</p>
                                                        </div> : <>
                                                            {cryptos.txnType === "WITHDRAWAL" ?
                                                                <div className='d-flex text-end'>
                                                                    <img className={styles.icon_size}  style={{marginTop:"-12px"}} src={imageHost + "/withdrawal-new-icon.svg"} alt="" /> <p className='text-end' style={{"wordBreak":"break-all"}}>{cryptos.holdings}</p>
                                                                </div> :
                                                                <>
                                                                    {cryptos.txnType === "DEPOSIT" ?
                                                                        <div className='d-flex text-end'>
                                                                            <img className={styles.icon_size}  style={{marginTop:"-12px"}} src={imageHost + "/deposit-new-icon.svg"} alt="" /> <p style={{"wordBreak":"break-all"}}>{cryptos.holdings}</p>
                                                                        </div> :
                                                                        <>
                                                                            <p style={{"wordBreak":"break-all"}}>{cryptos.holdings}</p>
                                                                        </>}
                                                                </>}
                                                        </>}
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                    <nav className='d-flex justify-content-center'>
                                        <ul className={`pagination ${styles.pagination}`}>
                                            {props.totalCrptoPage !== 1 ?
                                                <>
                                                    {props.currentCrptoPage !== 1 ?
                                                        <a className={`btn ${styles.pre_anchor}`} onClick={() => handlePreCrypto()}>Previous</a>
                                                        : <></>
                                                    }
                                                    {props.pageNumbers.map((number: string) => {
                                                        return <>
                                                            {number < props.maxCryptoPageNoLimit + 1 && number > props.minCryptoPageNoLimit ?
                                                                <li key={number} id={number} className={props.currentCrptoPage === number ? `${styles.active_page}  mx-1 page-item pt-2` : `${styles.page} ${styles.page_item} mx-1 pt-2`}>{number}</li> : <></>
                                                            }
                                                        </>
                                                    })}
                                                    {props.totalCrptoPage !== props.currentCrptoPage ?
                                                        <a className={`btn ${styles.next_anchor}`} onClick={() => handleNextCrypto()}>Next</a>
                                                        : <></>
                                                    }
                                                </> : <></>
                                            }

                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                        :
                        <div className={`col-12 col-lg-11 ms-auto mb-3 border border-1 ${styles.top_accounts_subhead}`}>
                            <button className={styles.top_trading_heading_btn}><h4 className={styles.top_trading_heading}>Crypto Trading Activity</h4></button>
                            <div className='d-block d-xl-none'>
                                <img className='my-4' src={imageHost + "/no-data-portfolio-img.svg"} alt="" />
                                <p>You do not have any crypto trading activity in your account</p>
                            </div>
                            <div className='d-none d-xl-flex justify-content-center'>
                                <p className='mt-auto mb-auto'>You do not have any crypto trading activity in your account</p>
                                <img className='my-4' src={imageHost + "/no-data-portfolio-img.svg"} alt="" />
                            </div>
                        </div>
                    }
                </div>
            </div>
            {/* For the exchange trading activity */}
            <div className={`${styles.trading_accounts} mt-5`}>
                <div className="row">
                    {props.exchangeData !== null ?
                        <div className={`col-12 col-lg-11 col-xl-8 mb-3 border border-1 ${styles.top_accounts_subhead}`}>
                            <button className={styles.top_trading_heading_btn}><h4 className={styles.top_trading_heading}>Exchange Trading Activity</h4></button>
                            <div className="row">
                                <div className={`col-12 col-md-12 col-xl-9 mt-4 me-4 ${styles.trading_table}`}>
                                    <table className={`table mb-0 ${styles.table_head_size}`}>
                                        <thead className={styles.static_border_bottom}>
                                            <tr>
                                                <th scope="col" className={`${styles.border_adjustment} col-2 text-start ps-0`}>Crypto</th>
                                                <th scope="col" className={`${styles.border_adjustment} col-2`}>No. of txn</th>
                                                <th scope="col" className={`${styles.border_adjustment} col-3`}>Last txn Date</th>
                                                <th scope="col" className={`${styles.border_adjustment} col-4`}>Last txn Details</th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div className={styles.all_crypto_trading}>
                                        {props.currentExchange.map((cryptos: any) => {
                                            return <div className={`row ${styles.row_trading}`} key={cryptos.id}>
                                                <div className="col-3 text-start">
                                                    <p className={styles.main_crypto}>{cryptos.account}</p>
                                                </div>
                                                <div className="col-2">
                                                    <p>{cryptos.txnCounts}</p>
                                                </div>
                                                <div className="col-3 ps-0">
                                                    <p>{getFormatedDate(parseISO(cryptos.txnDate), "dd-MMM-yy")}</p>
                                                </div>
                                                <div className="col-4">
                                                    {cryptos.txnType === "TRADE" ?
                                                        <div className={`d-flex ${styles.inside_trade}`}>
                                                            <img className='mb-4' style={{ width: "13px" }} src={imageHost + "/trade-new-icon.svg"} /><p className='text-start ps-3' style={{"wordBreak":"break-all"}}><span className={cryptos.currencies[0].direction === "RECEIVED" ? `${styles.color_green_1}` : `${styles.color_red}`}>{cryptos.currencies[0].holdings} {cryptos.currencies[0].currency}</span><br /><span className={cryptos.currencies[1].direction === "RECEIVED" ? `${styles.color_green_1}` : `${styles.color_red}`}>{cryptos.currencies[1].holdings} {cryptos.currencies[1].currency}</span></p>
                                                        </div>
                                                        : <>
                                                            {cryptos.txnType === "WITHDRAWAL" ?
                                                                <div className='d-flex text-end'>
                                                                    <img className={styles.icon_size} src={imageHost + "/withdrawal-new-icon.svg"} alt="" /> <p className={cryptos.currencies[0].direction === "RECEIVED" ? `${styles.color_green_1} text-end` : `${styles.color_red} text-end`} style={{wordBreak:"break-all"}}>{cryptos.currencies[0].holdings} {cryptos.currencies[0].currency}</p>
                                                                </div> :
                                                                <>
                                                                    {cryptos.txnType === "DEPOSIT" ?
                                                                        <div className='d-flex text-end'>
                                                                            <img className={styles.icon_size} src={imageHost + "/deposit-new-icon.svg"} alt="" /> <p className={cryptos.currencies[0].direction === "RECEIVED" ? `${styles.color_green_1} text-end` : `${styles.color_red} text-end`} style={{wordBreak:"break-all"}}>{cryptos.currencies[0].holdings} {cryptos.currencies[0].currency}</p>
                                                                        </div> :
                                                                        <>
                                                                            <p style={{wordBreak:"break-all"}}>{cryptos.holdings}</p>
                                                                        </>}
                                                                </>}
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        })}

                                    </div>
                                    <nav>
                                        <ul className={`${styles.pagination} d-flex justify-content-center`}>
                                            {props.totalExchangePage !== 1 ?
                                                <>
                                                    {props.currentExchangePage !== 1 ?
                                                        <a className={`btn ${styles.pre_anchor}`} onClick={() => handlePreExchange()}>Previous</a>
                                                        : <></>
                                                    }
                                                    {props.exchangePageNumbers.map((number: any) => {
                                                        return <>
                                                            {number < props.maxExchangePageNoLimit + 1 && number > props.minExchangePageNoLimit ?
                                                                <li key={number} id={number} className={props.currentExchangePage === number ? ` ${styles.active_page} mx-1 ${styles.page_item} pt-2` : `page ${styles.page_item}  mx-1 pt-2`}>{number}</li> : <></>
                                                            }
                                                        </>
                                                    })}
                                                    {props.totalExchangePage !== props.currentExchangePage ?
                                                        <a className={`btn ${styles.next_anchor}`} onClick={() => handleNextExchange()}>Next</a>
                                                        : <></>
                                                    }
                                                </> : <></>
                                            }

                                        </ul>
                                    </nav>
                                </div>
                                <div className={`col-12 col-md-12 ps-0 col-lg-3 ${styles.exchange_section}`}>
                                    <div className={styles.background_exchange_trading}>
                                        <div className={styles.mainChart}>
                                            <ReactEcharts option={option2} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className={`col-12 col-lg-11 ms-auto mb-3 border border-1 ${styles.top_accounts_subhead}`}>
                            <button className={styles.top_trading_heading_btn}><h4 className={styles.top_trading_heading}>Exchange Trading Activity</h4></button>
                            <div className='d-block d-lg-none'>
                                <p style={{"marginTop":"5rem"}}>You do not have any exchange trading activity in your account</p>
                                <img className='my-4' src={imageHost + "/no-data-portfolio-img.svg"} alt="" />
                            </div>
                            <div className='d-none d-lg-flex justify-content-center'>
                                <img className='my-4' src={imageHost + "/no-data-portfolio-img.svg"} alt="" />
                                <p className='mt-auto mb-auto'>You do not have any exchange trading activity in your account</p>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div >
    )
}

export default TradingModule