import React, { useEffect, useState } from 'react';
import MainService from '../services/main-service';
import nookies from 'nookies'
import getTokens from "../components/newtoken";
import TradingModule from '../components/user-portfolio/trading-module';
import TransactionAccounts from '../components/user-portfolio/transaction-accounts';
import PortfolioGraph from '../components/user-portfolio/portfolio-graph';
import { useRouter } from 'next/router';
import MarketTrend from '../components/user-portfolio/market-trend-graph';
import LeftFeed from '../components/shared/left-feed';
import RightFeedPortfolio from "../components/shared/right-feed"
import styles from "../styles/users-portfolio/users-portfolio.module.scss";
import getInsideAllPromiseFunction from '../components/getInsideAllServerPromise';

var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;

function callingAllPortfolioData(tokens: any | null) {
    let mainservice: any = MainService("get")
    let allData: any;
    return new Promise(async (resolve, reject) => {
        try {
            let res = await mainservice('portfolio', 'ups', null, tokens);
            allData = res.data;
            resolve(allData)
        }
        catch (e: any) {
            reject(e);
        }
    })
}
export async function getServerSideProps(context: any) {
    const cookies = nookies.get(context);
    console.log(context);
    let fnsArr = [callingAllPortfolioData]
    let storePromise = await getData(cookies.accessTokens, context, fnsArr)
    console.log("Promise Store");
    console.log(storePromise);
    return storePromise
}
async function getData(tokens: any, context: any, fnsArr: any[]) {
    let data:any;
    let storePromise = await getInsideAllPromiseFunction(tokens, context, fnsArr)
    console.log("StorePromise props");
    console.log(storePromise.props);
    if (storePromise.props) {
        storePromise.props.forEach((ele: any, i: any) => {
            data = ele.value
        });
        return {
            props: {
                data: data
            }
        }
    }
    return storePromise
}

// export async function getServerSideProps(context: any) {
//     let data: any;
//     const cookies = nookies.get(context);
//     console.log("Token inside portoflio");
//     console.log(context);
//     try {
//         let res = await mainservice("portfolio", "ups", null, cookies.accessTokens);
//         data = res.data;
//         console.log(data);
//         console.log("Response in data");
//     } catch (e: any) {
//         console.log(e);
//         if (e.status === 401) {
//             console.log(e);
//             console.log("401 error");
//             nookies.destroy(context, 'accessTokens')
//             let redirect: boolean = false;
//             await getTokens(context).then((res: any) => {
//                 console.log(res);
//                 nookies.set(context, 'accessTokens', JSON.stringify(res))
//             }).catch((e: any) => {
//                 console.log("Redirct to login");
//                 redirect = true;
//             })
//             if (redirect) {
//                 return {
//                     redirect: {
//                         destination: "/login",
//                         permanent: false
//                     }
//                 }
//             }
//         } else {
//             console.log("Error in console");
//         }
//     }
//     if (data !== undefined) {
//         return {
//             props: {
//                 data: data
//             }
//         }
//     } else {
//         return {
//             props: {
//                 todo: ""
//             }
//         }
//     }
// }

const UserPortfolio = ({ data }: any) => {
    console.log(data);
    const router = useRouter()
    const [reload, setreload] = useState(false);
    const [topexchangerRates, settopExchangeRates] = useState([]);
    const [crptodata, setcrptodata] = useState(data.assetsWithLastTxns);
    const [exchangeData, setExchangeData] = useState(data.accountsWithTxn);
    const [currentCrptoPage, setCurrentCrptoCage] = useState(1);
    const [exchangePerPage] = useState(4);
    const [currentExchangePage, setcurrentExchangePage] = useState(1);
    const [crptoPerPage] = useState(5);
    const [cryptoPageLimit] = useState(5);
    const [maxCryptoPageNoLimit, setmaxCryptoPageNoLimit] = useState(5);
    const [minCryptoPageNoLimit, setminCryptoPageNoLimit] = useState(0);
    const [exchangePageLimit, setExchangePageLimit] = useState(4);
    const [maxExchangePageNoLimit, setmaxExchangePageNoLimit] = useState(5);
    const [minExchangePageNoLimit, setminExchangePageNoLimit] = useState(0);
    const [showUi, setshowUi] = useState("inprogress");
    const [currencyArray, setCurrencyArray] = useState([]);
    const [valuecryptoArray, setvaluecryptoArray] = useState([]);
    const [exchangeArray, setExchangeArray] = useState([]);
    const [exchangeTxnsArray, setExchangeTxnsAray] = useState([]);
    const [forStoringExc, setForStoringExc] = useState<any>(data.currencies);
    const [valePort, setValuePort] = useState("");
    //   let getingToExchangeRates: any = [];


    let totalUserConnectedAccounts: any;
    // let userTopAccounts: any;
    // let userTopAssets: any = [];
    // let userAssetAllocation: any = [];
    let userTopLatestTxn: any = [];
    // let topCurrencyRateHistoryAPIResponse: any = [];
    // let getportfolioData: any = [];
    // let allportfolioData: any = [];
    // let portfolioValue: any = {};
    let currencyArr: any = [];
    let valuecryptoArr: any = [];
    let exchangeArr: any = [];
    let exchangeTxnsArr: any = [];
    // let specificPortfolio = [];
    let crptoDataArr: any[] = [];
    let totalAccountCounts: any;
    // Cryptos pagination
    let currentCryptos: any;
    let pageNumbers: any = [];
    let totalCrptoPage: Number = 0;

    // Exchange pagination
    let currentExchange: any = 0;
    let exchangePageNumbers: any = [];
    let totalExchangePage: Number = 0;
    let accountsStatusAndCount: any = [];
    let allportfolioData: any = data;
    let getingToExchangeRates: any = data.topCurrencyRateHistoryAPIResponse;
    let userTopAccounts = data.userAccountsWithValue;
    let userTopAssets = data.userAssetsWithValues;

    let userAssetAllocation = data.userAssetsAllocation;
    if (data.userAccountsWithValue !== null) {
        totalUserConnectedAccounts = (data.userAccountsWithValue.accountsWithValue);
        totalAccountCounts = data.userAccountsWithValue.accountsCount;
    }
    if (data.latestTxnsAndCounts !== null) {
        userTopLatestTxn = data.latestTxnsAndCounts;
    }
    // accountsStatusAndCount = data.accountsStatusAndCount;
    let getportfolioData = data.portfolioData;
    let portfolioValue = data.portfolioValue;
    let topCurrencyRateHistoryAPIResponse = data.topCurrencyRateHistoryAPIResponse;
    crptoDataArr = data.assetsWithLastTxns;
    // Graph for the crypto trading activity
    function getCryptoGraph(data: any) {
        console.log("crypto graph called");
        console.log(data);
        setreload(!reload)
        currencyArr = [];
        valuecryptoArr = [];
        data.forEach((element: any) => {
            currencyArr.push(element.currency)
            valuecryptoArr.push(element.txnCounts);
        });
        setCurrencyArray(currencyArr)
        setvaluecryptoArray(valuecryptoArr)
        console.log(currencyArray);
    }
    console.log(showUi)

    // Get current exchange
    const indexOfLastExchange = currentExchangePage * exchangePerPage;
    const indexOfFirstExchange = indexOfLastExchange - exchangePerPage;
    if (exchangeData !== null) {
        exchangePageNumbers = [];
        let totalExchanges = exchangeData.length;
        totalExchangePage = Math.ceil(totalExchanges / exchangePerPage);
        for (let i = 1; i <= Math.ceil(totalExchanges / exchangePerPage); i++) {
            exchangePageNumbers.push(i);
        }
        currentExchange = exchangeData.slice(indexOfFirstExchange, indexOfLastExchange)
    }


    //Graph for the exchange trading activity
    function getExchangeTradeGraph(data: any) {
        exchangeArr = [];
        exchangeTxnsArr = [];
        data.forEach((element: any) => {
            exchangeArr.push(element.account)
            exchangeTxnsArr.push(element.txnCounts);
        });
        setExchangeArray(exchangeArr)
        setExchangeTxnsAray(exchangeTxnsArr)
        console.log(exchangeArr);
        console.log(exchangeTxnsArr);
    }

    const paginateCrypto = (event: any) => { console.log(event.target.id); setCurrentCrptoCage(event.target.id) };
    const paginateExchange = (exchangePageNumber: any) => setcurrentExchangePage(exchangePageNumber);
    // Get current cryptos
    const indexOfLastCrypto = currentCrptoPage * crptoPerPage;
    const indexOfFirstCrypto = indexOfLastCrypto - crptoPerPage;
    // Doing Pagination for cryptos
    if (crptodata !== null) {
        pageNumbers = [];
        let totalCryptos = crptodata.length;
        totalCrptoPage = Math.ceil(totalCryptos / crptoPerPage);
        for (let i = 1; i <= Math.ceil(totalCryptos / crptoPerPage); i++) {
            pageNumbers.push(i);
        }
        console.log(crptodata);
        currentCryptos = crptodata.slice(indexOfFirstCrypto, indexOfLastCrypto);
        console.log("current cryptos called");
        console.log(currentCryptos);
    }


    console.log(userTopAccounts);
    console.log(userTopAssets);
    console.log(valePort);
    console.log(currentCryptos);
 {
        return (
            <div className="d-flex justify-content-between">
                <div className={`px-0 ${styles.left_feed} d-none d-lg-block`}>
                    <LeftFeed />
                </div>
                <div className='w-100'>
                    {showUi === "inprogress" ?
                        <div className={styles.main_portfolio}>
                            <div className={`container-fluid px-0 text-center ${styles.no_user_portfolio}`}>
                                <div className="d-flex justify-content-between">
                                    <div className={`${styles.main_data} w-100`}>
                                        {userTopAccounts === null || userTopAccounts === undefined ?
                                            <div className={styles.coming_data}>
                                                <div className={`row container m-auto mt-3 ${styles.without_data} position-relative`}>
                                                    <div className={`position-absolute ${styles.body_change_btn} w-50 text-center`}>
                                                        <button className={`${styles.mobile_btn} text-end bg-white px-2`}>Portfolio</button>
                                                    </div>
                                                    <div className={`${styles.no_user_content} col-12 col-xl-9 col-xxl-11 mx-1 ms-auto`}>
                                                        <img className={`${styles.mobile_portfolio_exchange} img-fluid`} src={imageHost + "/no-portfolio-image.svg"} alt="" />
                                                        <div className={`${styles.no_user_inside} row col-9 pe-3`}>
                                                            <h3 className={styles.no_account_head}>Demystifying Crypto</h3>
                                                            <p className={styles.no_account_para}>
                                                                You can add the exchange with CRPTM account by clicking on the Add Account.
                                                            </p>
                                                            <p className={`${styles.no_account_para} ps-5`}>
                                                                You can check your transaction details from this,you can get help in Tax Filing and you will be easy to know Profit or Loss in your transaction.
                                                            </p>
                                                        </div>
                                                        <a href='/add-account' className={`btn ${styles.add_account_btn} text-center`}>Add Account</a>
                                                    </div>
                                                    <img className={`${styles.portfolio_img} position-absolute ps-4 mb-3 ${styles.desktop_portfolio_exchange}`} src={imageHost + "/no-portfolio-image.svg"} alt="" />
                                                </div>
                                                <div className='px-2'>
                                                    <MarketTrend getingToExchangeRates={getingToExchangeRates} allportfolioData={allportfolioData} forStoringExc={forStoringExc} />
                                                </div>
                                            </div>
                                            :
                                            <div className={`${styles.coming_data} w-100`}>
                                                <div className='px-2'>
                                                    <PortfolioGraph getportfolioData={getportfolioData} allportfolioData={allportfolioData} portfolioValue={portfolioValue} topCurrencyRateHistoryAPIResponse={topCurrencyRateHistoryAPIResponse} accountsStatusAndCount={accountsStatusAndCount} />
                                                    <TransactionAccounts totalUserConnectedAccounts={totalUserConnectedAccounts} userTopAccounts={userTopAccounts} userTopAssets={userTopAssets} userAssetAllocation={userAssetAllocation} userTopLatestTxn={userTopLatestTxn} />
                                                    <TradingModule exchangeData={exchangeData} crptodatafinal={crptodata} crptodata={currentCryptos} currentCrptoPage={currentCrptoPage} currentExchangePage={currentExchangePage} setCurrentCrptoCage={setCurrentCrptoCage} setcurrentExchangePage={setcurrentExchangePage} pageNumbers={pageNumbers} paginateCrypto={paginateCrypto} currentExchange={currentExchange} exchangePageNumbers={exchangePageNumbers} paginateExchange={paginateExchange} getCryptoGraph={() => getCryptoGraph(currentCryptos)} getExchangeTradeGraph={() => getExchangeTradeGraph(currentExchange)} currencyArray={currencyArray} valuecryptoArray={valuecryptoArray} exchangeArray={exchangeArray} exchangeTxnsArray={exchangeTxnsArray} maxCryptoPageNoLimit={maxCryptoPageNoLimit} minCryptoPageNoLimit={minCryptoPageNoLimit} setmaxCryptoPageNoLimit={setmaxCryptoPageNoLimit} setminCryptoPageNoLimit={setminCryptoPageNoLimit} cryptoPageLimit={cryptoPageLimit} totalCrptoPage={totalCrptoPage} maxExchangePageNoLimit={maxExchangePageNoLimit} setmaxExchangePageNoLimit={setmaxExchangePageNoLimit} minExchangePageNoLimit={minExchangePageNoLimit} setminExchangePageNoLimit={setminExchangePageNoLimit} exchangePageLimit={exchangePageLimit} totalExchangePage={totalExchangePage} />
                                                </div>
                                                <div className='px-2'>
                                                    <MarketTrend getingToExchangeRates={getingToExchangeRates} allportfolioData={allportfolioData} forStoringExc={forStoringExc} />
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        : <>
                            <div className={`py-5 ${styles.user_portfolio_show_loader}`}>
                                <div className='absolute-center mt-3 text-center'>
                                    <div className='d-block d-xl-flex justify-content-around'>
                                        <div className='d-block d-xl-none'>
                                            <h5 className={`mb-3 ${styles.showing_quotes}`} style={{ "marginTop": "3rem" }}>"{valePort}"</h5>
                                            <h5 className='mb-2'>Please wait while we load your portfolio...</h5>
                                        </div>
                                        <img src={process.env.REACT_APP_IMAGEHOST + "/portfolio-loader.gif"} alt="" />
                                        <div className='d-none d-xl-block'>
                                            <h5 className={`mb-3 ${styles.showing_quotes}`} style={{ "marginTop": "3rem" }}>"{valePort}"</h5>
                                            <h5>Please wait while we load your portfolio...</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </div>
                <div className={`${styles.feed_final} d-none d-lg-block`}>
                    <RightFeedPortfolio />
                </div>
            </div>
        )
    } 
}

export default UserPortfolio