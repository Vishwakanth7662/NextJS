import { format } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import Cookies from 'js-cookie'
import MainService from "../services/main-service";
import ClientService from '../services/main-serviceClient';
import { useRouter } from "next/router";
import nookies from 'nookies';
import style from "../styles/pricing/pricing.module.scss"
import getInsideAllPromiseFunction from "../components/getInsideAllServerPromise";
import getCurrenturl from "../components/currentUrlCheck";

let mainServiceNoTokenGet: any = MainService('noTokenGet');
let mainServiceGet: any = MainService('get');

function getPlans(tokens: any | null) {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await mainServiceNoTokenGet('plans', 'user', null);
            resolve(res.data);
        }
        catch (e: any) {
            reject(e);
        }
    })
}

function userPlans(tokens: any | null) {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await mainServiceGet('subscriptions', 'user', null, tokens);
            resolve(res);
        }
        catch (e: any) {
            reject(e);
        }
    })
}

export async function getServerSideProps(context: any) {
    const cookies = nookies.get(context);
    getCurrenturl(context);
    console.log(context);
    let fnsArr: any[] = [];
    if (cookies.accessTokens)
        fnsArr = [getPlans, userPlans]
    else
        fnsArr = [getPlans]

    let storePromise = await getData(cookies.accessTokens, context, fnsArr)
    return storePromise
}

async function getData(tokens: any, context: any, fnsArr: any[]) {
    const cookies = nookies.get(context);
    let subscriptions: any;
    let userPlans: any;
    let storePromise = await getInsideAllPromiseFunction(tokens, context, fnsArr)
    console.log("StorePromise props");
    console.log(storePromise.props);
    if (storePromise.props) {
        if (cookies.accessTokens) {
            storePromise.props.forEach((ele: any, i: any) => {
                if (i === 0) {
                    subscriptions = ele.value.subscriptions
                } else {
                    userPlans = ele.value.data.userSubscriptions
                }

            })
            console.log("Inside user plans");
            console.log(userPlans);
            return {
                props: {
                    subscriptions: subscriptions,
                    userPlans: userPlans
                }
            }
        }
        else {
            subscriptions = storePromise.props[0].value.subscriptions;
            return {
                props: {
                    subscriptions: subscriptions,
                }
            }
        }


    }
    return storePromise
}

function Plans(props: any) {
    console.log(props.subscriptions);
    console.log(props.userPlans);
    const router = useRouter();
    var clientServicePost: any = ClientService('post');
    var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;
    let isLoggedIn: any = false;
    if (Cookies.get('accessTokens'))
        isLoggedIn = true
    const [subsArr, setSubsArr] = useState<any[]>();
    const [activePlan, setActivePlan] = useState<any>();
    const [viewMore, setViewMore] = useState(false);
    const [showAll, setShowAll] = useState("");
    const [showSubsChoice, setShowSubsChoice] = useState(false);
    const [clicked, setClicked] = useState("");
    const [newFrequency, setNewFrequency] = useState<any>();
    const [newDisplayPrice, setNewDisplayPrice] = useState<any>();
    const [freq, setFreq] = useState<any>();
    const [userPaidPrice, setUserPaidPrice] = useState<any>();
    const [userFreq, setUserFreq] = useState<any>();
    const [buyLoader, setBuyLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [selectClicked, setSelectClicked] = useState("");
    const [err, setErr] = useState<any>();
    const [userOrder, setUserOrder] = useState<any>(0);
    const [selectedOrder, setSelectedOrder] = useState<any>();
    const [openConfirmBox, setOpenConfirmBox] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>();
    const [selectedFrequency, setSelectedFrequency] = useState<any>();
    const [reload, setReload] = useState(false);
    let orderSelected: any = 0;

    console.log(selectedOrder);
    let currentYr = format(new Date(), 'yyyy');
    console.log(currentYr);

    function redirectCheck() {
        window.location.href = "/signup"
    }
    function redirectToPage() {
        window.location.href = "/tax-report"
    }
    // useEffect(() => {
    //   orderSelected = selectedOrder;
    // }, [selectedOrder])

    // let features = ['Exchanges/Wallets Integration', 'Portfolio transactions', 'Transactions for tax calculation', 'Realtime Portfolio Performance', 'Portfolio performance over last 90 days', 'Daily portfolio updates', 'Exchange API sync', 'Custom CSV File Support', '10000+ cryptocurrencies', '8+ years of historical market data', 'Transaction Sorting and Filtering', 'Crypto as Income, Defi', 'Mining or donations', 'ICOs & Airdrops', 'Defi, Margin trades, Futures, NFTs', 'Mining, Staking, Lending, Forks', 'Self transfer matching', 'Exchange & transaction fee tracking', 'Current year tax Summary', 'Capital gains preview for last 6 years', 'HIFO/FIFO/LIFO', 'Download tax forms (2021 and 2022)', 'Tax Analysis', 'Form 8949, Schedule D', 'Tax summary by wallet/Exchanges', 'Portfolio Performance over time', 'Performance by crypto'];
    let features = [
        "Exchanges/Wallets Integration",
        "Portfolio transactions",
        "Transactions for tax calculation",
        "Realtime Portfolio Performance",
        "Portfolio performance over last 90 days",
        "Daily portfolio updates",
        "Exchange API sync",
        "Custom CSV File Support",
        "10000+ cryptocurrencies",
        "8+ years of historical market data",
        "Transaction Sorting and Filtering",
        "Crypto as Income, Defi",
        "Mining or donations",
        "ICOs & Airdrops",
        "Mining, Staking, Lending, Forks",
        "Self transfer matching",
        "Exchange & transaction fee tracking",
        "HIFO/FIFO/LIFO",
        "Capital gains preview",
        "Current year tax Summary",
        `Download tax forms (${Number(currentYr) - 1} and ${currentYr})`,
        "Tax Analysis",
        "Form 8949, Schedule D, Schedule 1",
        "Tax summary by wallet/Exchanges",
    ];
    let newbieFeatures: any[] = [
        "Exchanges/Wallets Integration",
        "Portfolio transactions",
        "Transactions for tax calculation",
        "Realtime Portfolio Performance",
        "Portfolio performance over last 90 days",
        "Daily portfolio updates",
        "Exchange API sync",
        "Custom CSV File Support",
        "10000+ cryptocurrencies",
        "8+ years of historical market data",
        "Transaction Sorting and Filtering",
        "Crypto as Income, Defi",
        "Mining or donations",
        "ICOs & Airdrops",
        "Mining, Staking, Lending, Forks",
        "Self transfer matching",
        "Exchange & transaction fee tracking",
        "Current year tax Summary",
        "Capital gains preview",
        "HIFO/FIFO/LIFO",
    ];
    let starterFeatures: any[] = [
        "Exchanges/Wallets Integration",
        "Portfolio transactions",
        "Transactions for tax calculation",
        "Realtime Portfolio Performance",
        "Portfolio performance over last 90 days",
        "Daily portfolio updates",
        "Exchange API sync",
        "Custom CSV File Support",
        "10000+ cryptocurrencies",
        "8+ years of historical market data",
        "Transaction Sorting and Filtering",
        "Crypto as Income, Defi",
        "Mining or donations",
        "ICOs & Airdrops",
        "Mining, Staking, Lending, Forks",
        "Self transfer matching",
        "Exchange & transaction fee tracking",
        "Current year tax Summary",
        "Capital gains preview",
        "HIFO/FIFO/LIFO",
        `Download tax forms (${Number(currentYr) - 1} and ${currentYr})`,
        "Tax Analysis",
        "Form 8949, Schedule D, Schedule 1"
    ];

    async function userSubscriptions() {
        if (props.userPlans) {
            props.userPlans.forEach((sub: any) => {
                if (sub.subscriptionStatus === "ACTIVE" && sub.planType === "SUBSCRIPTION") {
                    setActivePlan(sub.subscriptionPlanName);
                    setUserPaidPrice(sub.planPrice);
                    setUserFreq(sub.frequencyDisplayName);
                    console.log("abcdd");
                    console.log(sub.order);
                    setUserOrder(sub.order);
                }
            });
        }
    }

    function buyPlan(planName: string, frequencyy: any) {
        setSelectedPlan(planName);
        setSelectedFrequency(frequencyy);
        console.log(orderSelected);
        console.log(userOrder);
        if (orderSelected < userOrder) {
            setOpenConfirmBox(true);
        }
        else {
            confirmedBuy(planName, frequencyy);
        }
    }

    async function confirmedBuy(planName: string, frequencyy: any) {
        setBuyLoader(true);
        try {
            const res = await clientServicePost(
                "/api/v1/plans/buyPlan",
                {
                    subscriptionPlan: planName,
                    renewal: "AUTO",
                    frequency: frequencyy,
                    currency: "USD",
                },
                null
            );
            setOpenConfirmBox(false);
            setBuyLoader(false);
            console.log(res.data);
            Cookies.set('paymentDetails', JSON.stringify(res.data), { expires: 1, path: '/' });
            if (res.data.paymentId) {
                Cookies.set('paymentIntentId', res.data.paymentId, { expires: 1, path: '/' });
                router.push("/payment");
            } else {
                router.push("/pay-success");
            }
        } catch (e: any) {
            console.log(e);
            setOpenConfirmBox(false);
            setBuyLoader(false);
            setShowError(true);
            setErr(e.data.error.message);
            setTimeout(() => {
                setShowError(false);
            }, 10000)
            console.log(e);
        }
    }

    useEffect(() => {
        setSubsArr(props.subscriptions)
        if (isLoggedIn)
            userSubscriptions();
    }, []);

    return (
        <div className={`${style.pricing}`}>
            <div className="container position-relative">
                {
                    openConfirmBox ?
                        <div className={`${style.confirmPopup} position-fixed`}>
                            By changing the plan, you will loose access to the upgraded features. Are you sure you want to change the plan?
                            <div className="d-flex justify-content-center align-items-center mt-3">
                                {
                                    buyLoader ?
                                        <img src={imageHost + '/loader-small.gif'} alt="loading" className="me-2" /> :
                                        <button className="me-2" onClick={() => { confirmedBuy(selectedPlan, selectedFrequency) }}>Yes</button>
                                }
                                <button className="ms-2" onClick={() => { setOpenConfirmBox(false); }}>No</button>
                            </div>
                        </div> :
                        <></>
                }
                {
                    showError ?
                        <div className={`${style.errorPopup} position-fixed`}>
                            {err ? err : 'Something Went Wrong, Please Try Again!'}
                            <button className="position-fixed" onClick={() => { setShowError(false) }}><img src={imageHost + '/cross-icon.png'} alt="" /></button>
                        </div> :
                        <></>
                }

                <div style={{ "marginTop": "6rem" }} className="text-start">
                    {isLoggedIn ?
                        <div className={`${style.free_portfolio} d-flex justify-content-start my-4`}>
                            <div onClick={() => redirectToPage()} className={`${style.free_portfolio_inside} d-flex justify-content-center`}>
                                <img className={`${style.imgInsideOffer}`} src={imageHost + "/launching-offer.svg"} alt="" />
                                <span className={`${style.launchOffer}`}>Launch offer</span>
                                <p className='px-2 pt-2'>Get your crypto tax reports in just <span>$1.</span> <span className={`${style.bold_free}`}>Hurry up!!</span></p>
                            </div>
                        </div>
                        :
                        <div className={`${style.free_portfolio} d-flex justify-content-start my-4`}>
                            <div onClick={() => redirectCheck()} className={`${style.free_portfolio_inside} d-flex justify-content-center`}>
                                <img className={`${style.imgInsideOffer}`} src={imageHost + "/launching-offer.svg"} alt="" />
                                <span className={`${style.launchOffer}`}>Launch offer</span>
                                <p className='px-2 pt-2'>Get your crypto tax reports in just <span>$1.</span> <span className={`${style.bold_free}`}>Hurry up!!</span></p>
                            </div>
                        </div>

                    }
                    <h1 className={`${style.mainHeading} mb-4`}>
                        GOT STUNG BY CONFUSING CRYPTO PROCESSES?
                    </h1>
                    <h2 className={`${style.mainSubheading} mb-4`}>
                        Don't worry. We've got your back.
                    </h2>
                    <p className={`${style.mainPara}`}>
                        We've made the entire process so <b>convenient</b>, <b>simple</b>{" "}
                        and <b>easy for YOU!</b>
                    </p>
                    <p className={`${style.mainPara} mb-0`}>
                        CRPTM has designed the plans keeping YOU and YOUR needs in mind.
                    </p>
                    <p className={`${style.mainPara}`}>
                        We believe in simplifying the process for you so that you are free
                        from all the hassles of managing your portfolio, syncing exchanges,
                        calculating and putting your crypto taxes in order, generating and
                        exporting reports, while gaining access to uninterrupted support,
                        and more.
                    </p>
                    <p className={`${style.mainPara}`}>
                        Choose a plan that best meets your needs. We also have the Newbie
                        plan that we’re currently offering absolutely <b>FREE OF COST</b>.
                    </p>
                    <p className={`${style.mainPara} mb-5`}>
                        <b>You can save upto 20% when purchasing for multiple years</b>
                    </p>
                </div>
                <div className="d-none d-md-flex row w-100 m-0">
                    <div className="col-4">
                        <div className={`${style.leftColumn}`}>
                            <p className={`${style.subHeading}`}>Features</p>
                            {features.map((feature) => {
                                return <p className={`${style.subParaLeft}`}>{feature}</p>;
                            })}
                        </div>
                    </div>
                    <div className={`col-8 d-flex justify-content-start ${style.plansContainer}`}>
                        {subsArr ? (
                            <>
                                {subsArr.map((plan: any) => {
                                    if (plan.frequency === "YEARLY") {
                                        return (
                                            <>
                                                <div className={`${style.centerColumn} mx-1 mx-lg-3 position-relative`}>
                                                    <div className="text-center">
                                                        {isLoggedIn ? (
                                                            <>
                                                                {buyLoader && selectClicked === plan.name ? (
                                                                    <>
                                                                        <img src={imageHost + "/loader-small.gif"}
                                                                            alt="loading"
                                                                            className="mt-4"
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    <button disabled={activePlan === plan.name} className={activePlan === plan.name ? `${style.centerColBtnSelected} py-1 px-4 mt-4` : `${style.centerColBtn} py-1 px-4 mt-4`}
                                                                        onClick={() => {
                                                                            setSelectClicked(plan.name);
                                                                            console.log(plan.order);
                                                                            orderSelected = plan.order;
                                                                            setSelectedOrder(plan.order);
                                                                            if (freq) {
                                                                                buyPlan(plan.name, freq);
                                                                            } else {
                                                                                buyPlan(plan.name, plan.frequency);
                                                                            }
                                                                        }}
                                                                    >
                                                                        {activePlan === plan.name
                                                                            ? "Selected"
                                                                            : "Select"}
                                                                    </button>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <button className={`${style.centerColBtn} py-1 px-4 mt-4`} onClick={() => { router.push("/login"); }}>
                                                                Get Started
                                                            </button>
                                                        )}
                                                    </div>

                                                    <p className={`${style.titleName} text-center mt-2`}>
                                                        {plan.name}
                                                    </p>
                                                    <div className={`${style.topPrice} text-center`}>
                                                        {plan.offerPrice === 0 ? (
                                                            <p className=" w-100 text-center">
                                                                <span>FREE</span>
                                                            </p>
                                                        ) : (
                                                            <button
                                                                className=" text-center"
                                                                onClick={() => {
                                                                    setFreq(plan.frequency);
                                                                    if (clicked === plan.name) {
                                                                        setShowSubsChoice(!showSubsChoice);
                                                                    } else {
                                                                        setShowSubsChoice(true);
                                                                    }
                                                                    setClicked(plan.name);
                                                                    setNewFrequency(
                                                                        userFreq && activePlan === plan.name
                                                                            ? userFreq
                                                                            : plan.frequencyDisplayName
                                                                    );
                                                                    setNewDisplayPrice(
                                                                        userPaidPrice && activePlan === plan.name
                                                                            ? userPaidPrice
                                                                            : plan.offerPrice
                                                                    );
                                                                }}
                                                            >
                                                                <p className="mb-0">
                                                                    <span>{`$${newDisplayPrice && clicked === plan.name
                                                                        ? newDisplayPrice
                                                                        : userPaidPrice &&
                                                                            activePlan === plan.name
                                                                            ? userPaidPrice
                                                                            : plan.offerPrice
                                                                        }`}</span>
                                                                </p>
                                                                <div className="d-flex justify-content-center">
                                                                    <div>
                                                                        Per{" "}
                                                                        {newFrequency && clicked === plan.name
                                                                            ? newFrequency
                                                                            : userFreq && activePlan === plan.name
                                                                                ? userFreq
                                                                                : plan.frequencyDisplayName}
                                                                    </div>
                                                                    <img
                                                                        className="ms-2"
                                                                        src={imageHost + "/dropdown-icon.svg"}
                                                                        alt=""
                                                                    />
                                                                </div>
                                                            </button>
                                                        )}
                                                    </div>
                                                    {showSubsChoice && clicked === plan.name ? (
                                                        <>
                                                            <div className={`${style.subsChoice} position-absolute`}>
                                                                {subsArr.map((plan1: any) => {
                                                                    if (plan1.name === plan.name) {
                                                                        return (
                                                                            <div>
                                                                                <button
                                                                                    className={
                                                                                        newFrequency ===
                                                                                            plan1.frequencyDisplayName
                                                                                            ? `${style.selectedYearlyChoice} w-100 d-flex justify-content-between`
                                                                                            : `${style.yearlyChoice} w-100 d-flex justify-content-between`
                                                                                    }
                                                                                    onClick={() => {
                                                                                        setNewFrequency(
                                                                                            plan1.frequencyDisplayName
                                                                                        );
                                                                                        setNewDisplayPrice(
                                                                                            plan1.offerPrice
                                                                                        );
                                                                                        setFreq(plan1.frequency);
                                                                                        setShowSubsChoice(false);
                                                                                    }}
                                                                                >
                                                                                    <div>
                                                                                        {plan1.frequencyDisplayName}
                                                                                    </div>{" "}
                                                                                    <div className={`${style.choicePrice}`}>
                                                                                        <span className={`${style.cut} me-2`}>
                                                                                            ${plan1.price}
                                                                                        </span>
                                                                                        ${plan1.offerPrice}
                                                                                    </div>
                                                                                </button>
                                                                            </div>
                                                                        );
                                                                    }
                                                                })}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <></>
                                                    )}
                                                    <div className="text-center purple-band position-relative"></div>
                                                    <div className="text-center p-1 p-lg-3 pt-4">
                                                        {plan.name === "NEWBIE" ? (
                                                            <>
                                                                <p className={`${style.subPara}`}>
                                                                    Unlimited
                                                                    <div className="d-block d-xl-none">
                                                                        &nbsp;
                                                                    </div>
                                                                </p>
                                                                <p className={`${style.subPara}`}>Unlimited</p>
                                                                <p className={`${style.subPara}`}>
                                                                    500
                                                                    <div className="d-block d-xl-none">
                                                                        &nbsp;
                                                                    </div>
                                                                </p>
                                                                <p className={`${style.subPara}`}>
                                                                    With 1 day delay
                                                                    <div className="d-block d-xl-none">
                                                                        &nbsp;
                                                                    </div>
                                                                </p>
                                                                <p className={`${style.subPara}`}>
                                                                    <img
                                                                        src={imageHost + "/pricing-tick.svg"}
                                                                        alt=""
                                                                    />
                                                                    <div className={`${style.largeScreensSpace}`}>
                                                                        &nbsp;
                                                                    </div>
                                                                </p>
                                                                <p className={`${style.subPara}`}>
                                                                    <img
                                                                        src={imageHost + "/pricing-tick.svg"}
                                                                        alt=""
                                                                    />
                                                                </p>
                                                                <p className={`${style.subPara}`}>
                                                                    <img
                                                                        src={imageHost + "/pricing-tick.svg"}
                                                                        alt=""
                                                                    />
                                                                </p>
                                                                <p className={`${style.subPara}`}>
                                                                    <img
                                                                        src={imageHost + "/pricing-tick.svg"}
                                                                        alt=""
                                                                    />
                                                                </p>
                                                                <p className={`${style.subPara}`}>
                                                                    <img
                                                                        src={imageHost + "/pricing-tick.svg"}
                                                                        alt=""
                                                                    />
                                                                </p>
                                                                <p className={`${style.subPara}`}>
                                                                    <img
                                                                        src={imageHost + "/pricing-tick.svg"}
                                                                        alt=""
                                                                    />
                                                                    <div className="d-block d-xl-none">
                                                                        &nbsp;
                                                                    </div>
                                                                </p>
                                                                <p className={`${style.subPara}`}>
                                                                    <img
                                                                        src={imageHost + "/pricing-tick.svg"}
                                                                        alt=""
                                                                    />
                                                                    <div className="d-block d-xl-none">
                                                                        &nbsp;
                                                                    </div>
                                                                </p>

                                                                <p className={`${style.subPara}`}>
                                                                    <img
                                                                        src={imageHost + "/pricing-tick.svg"}
                                                                        alt=""
                                                                    />
                                                                </p>
                                                                <p className={`${style.subPara}`}>
                                                                    <img
                                                                        src={imageHost + "/pricing-tick.svg"}
                                                                        alt=""
                                                                    />
                                                                </p>
                                                                <p className={`${style.subPara}`}>
                                                                    <img
                                                                        src={imageHost + "/pricing-tick.svg"}
                                                                        alt=""
                                                                    />
                                                                </p>

                                                                <p className={`${style.subPara}`}>
                                                                    <img
                                                                        src={imageHost + "/pricing-tick.svg"}
                                                                        alt=""
                                                                    />
                                                                    <div className="d-block d-xl-none">
                                                                        &nbsp;
                                                                    </div>
                                                                </p>
                                                                <p className={`${style.subPara}`}>
                                                                    <img
                                                                        src={imageHost + "/pricing-tick.svg"}
                                                                        alt=""
                                                                    />
                                                                </p>
                                                                <p className={`${style.subPara}`}>
                                                                    <img
                                                                        src={imageHost + "/pricing-tick.svg"}
                                                                        alt=""
                                                                    />
                                                                    <div className="d-block d-xl-none">
                                                                        &nbsp;
                                                                    </div>
                                                                </p>
                                                                <p className={`${style.subPara}`}>
                                                                    <img
                                                                        src={imageHost + "/pricing-tick.svg"}
                                                                        alt=""
                                                                    />
                                                                </p>
                                                                <p className={`${style.subPara}`}>
                                                                    <img
                                                                        src={imageHost + "/pricing-tick.svg"}
                                                                        alt=""
                                                                    />

                                                                </p>
                                                                <p className={`${style.subPara}`}>
                                                                    <img
                                                                        src={imageHost + "/pricing-tick.svg"}
                                                                        alt=""
                                                                    />
                                                                </p>
                                                                <p className={`${style.subPara}`}>
                                                                    <img
                                                                        src={imageHost + "/pricing-cross.svg"}
                                                                        alt=""
                                                                    />
                                                                    <div className="d-block d-xl-none">
                                                                        &nbsp;
                                                                    </div>
                                                                </p>
                                                                <p className={`${style.subPara}`}>
                                                                    <img
                                                                        src={imageHost + "/pricing-cross.svg"}
                                                                        alt=""
                                                                    />
                                                                </p>
                                                                <p className={`${style.subPara}`}>
                                                                    <img
                                                                        src={imageHost + "/pricing-cross.svg"}
                                                                        alt=""
                                                                    />
                                                                    <div className="d-block d-xl-none">
                                                                        &nbsp;
                                                                    </div>
                                                                </p>
                                                                <p className={`${style.subPara}`}>
                                                                    <img
                                                                        src={imageHost + "/pricing-cross.svg"}
                                                                        alt=""
                                                                    />
                                                                    <div className="d-block d-xl-none">
                                                                        &nbsp;
                                                                    </div>
                                                                </p>
                                                                {/* <p className={`${style.subPara}`}><img src={imageHost + "/pricing-cross.svg"} alt="" /><div className='d-block d-xl-none'>&nbsp;</div></p>
                                    <p className={`${style.subPara}`}><img src={imageHost + "/pricing-cross.svg"} alt="" /></p> */}
                                                                {isLoggedIn ? (
                                                                    <>
                                                                        {buyLoader &&
                                                                            selectClicked === plan.name ? (
                                                                            <>
                                                                                <img
                                                                                    src={imageHost + "/loader-small.gif"}
                                                                                    alt="loading"
                                                                                    className="mt-4"
                                                                                />
                                                                            </>
                                                                        ) : (
                                                                            <button
                                                                                disabled={activePlan === plan.name}
                                                                                className={
                                                                                    activePlan === plan.name
                                                                                        ? `${style.centerColBtnSelected} py-1 px-4 mt-4`
                                                                                        : `${style.centerColBtn} py-1 px-4 mt-4`
                                                                                }
                                                                                onClick={() => {
                                                                                    setSelectClicked(plan.name);
                                                                                    setSelectedOrder(plan.order);
                                                                                    orderSelected = plan.order;
                                                                                    if (freq) {
                                                                                        buyPlan(plan.name, freq);
                                                                                    } else {
                                                                                        buyPlan(plan.name, plan.frequency);
                                                                                    }
                                                                                }}
                                                                            >
                                                                                {activePlan === plan.name
                                                                                    ? "Selected"
                                                                                    : "Select"}
                                                                            </button>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <button
                                                                        className={`${style.centerColBtn} py-1 px-4 mt-4`}
                                                                        onClick={() => {
                                                                            router.push("/login");
                                                                        }}
                                                                    >
                                                                        Get Started
                                                                    </button>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {plan.name === "STARTER" ? (
                                                                    <>
                                                                        <p className={`${style.subPara}`}>
                                                                            Unlimited
                                                                            <div className="d-block d-xl-none">
                                                                                &nbsp;
                                                                            </div>
                                                                        </p>
                                                                        <p className={`${style.subPara}`}>Unlimited</p>
                                                                        <p className={`${style.subPara}`}>
                                                                            5000
                                                                            <div className="d-block d-xl-none">
                                                                                &nbsp;
                                                                            </div>
                                                                        </p>
                                                                        <p className={`${style.subPara}`}>
                                                                            <img
                                                                                src={imageHost + "/pricing-tick.svg"}
                                                                                alt=""
                                                                            />
                                                                            <div className="d-block d-xl-none">
                                                                                &nbsp;
                                                                            </div>
                                                                        </p>
                                                                        <p className={`${style.subPara}`}>
                                                                            <img
                                                                                src={imageHost + "/pricing-tick.svg"}
                                                                                alt=""
                                                                            />
                                                                            <div className={`${style.largeScreensSpace}`}>
                                                                                &nbsp;
                                                                            </div>
                                                                        </p>
                                                                        <p className={`${style.subPara}`}>
                                                                            <img
                                                                                src={imageHost + "/pricing-tick.svg"}
                                                                                alt=""
                                                                            />
                                                                        </p>
                                                                        <p className={`${style.subPara}`}>
                                                                            <img
                                                                                src={imageHost + "/pricing-tick.svg"}
                                                                                alt=""
                                                                            />
                                                                        </p>
                                                                        <p className={`${style.subPara}`}>
                                                                            <img
                                                                                src={imageHost + "/pricing-tick.svg"}
                                                                                alt=""
                                                                            />
                                                                        </p>
                                                                        <p className={`${style.subPara}`}>
                                                                            <img
                                                                                src={imageHost + "/pricing-tick.svg"}
                                                                                alt=""
                                                                            />
                                                                        </p>
                                                                        <p className={`${style.subPara}`}>
                                                                            <img
                                                                                src={imageHost + "/pricing-tick.svg"}
                                                                                alt=""
                                                                            />
                                                                            <div className="d-block d-xl-none">
                                                                                &nbsp;
                                                                            </div>
                                                                        </p>
                                                                        <p className={`${style.subPara}`}>
                                                                            <img
                                                                                src={imageHost + "/pricing-tick.svg"}
                                                                                alt=""
                                                                            />
                                                                            <div className="d-block d-xl-none">
                                                                                &nbsp;
                                                                            </div>
                                                                        </p>

                                                                        <p className={`${style.subPara}`}>
                                                                            <img
                                                                                src={imageHost + "/pricing-tick.svg"}
                                                                                alt=""
                                                                            />
                                                                        </p>
                                                                        <p className={`${style.subPara}`}>
                                                                            <img
                                                                                src={imageHost + "/pricing-tick.svg"}
                                                                                alt=""
                                                                            />
                                                                        </p>
                                                                        <p className={`${style.subPara}`}>
                                                                            <img
                                                                                src={imageHost + "/pricing-tick.svg"}
                                                                                alt=""
                                                                            />
                                                                        </p>

                                                                        <p className={`${style.subPara}`}>
                                                                            <img
                                                                                src={imageHost + "/pricing-tick.svg"}
                                                                                alt=""
                                                                            />
                                                                            <div className="d-block d-xl-none">
                                                                                &nbsp;
                                                                            </div>
                                                                        </p>
                                                                        <p className={`${style.subPara}`}>
                                                                            <img
                                                                                src={imageHost + "/pricing-tick.svg"}
                                                                                alt=""
                                                                            />
                                                                        </p>
                                                                        <p className={`${style.subPara}`}>
                                                                            <img
                                                                                src={imageHost + "/pricing-tick.svg"}
                                                                                alt=""
                                                                            />
                                                                            <div className="d-block d-xl-none">
                                                                                &nbsp;
                                                                            </div>
                                                                        </p>
                                                                        <p className={`${style.subPara}`}>
                                                                            <img
                                                                                src={imageHost + "/pricing-tick.svg"}
                                                                                alt=""
                                                                            />
                                                                        </p>
                                                                        <p className={`${style.subPara}`}>
                                                                            <img
                                                                                src={imageHost + "/pricing-tick.svg"}
                                                                                alt=""
                                                                            />

                                                                        </p>
                                                                        <p className={`${style.subPara}`}>
                                                                            <img
                                                                                src={imageHost + "/pricing-tick.svg"}
                                                                                alt=""
                                                                            />
                                                                        </p>
                                                                        <p className={`${style.subPara}`}>
                                                                            <img
                                                                                src={imageHost + "/pricing-tick.svg"}
                                                                                alt=""
                                                                            />
                                                                            <div className="d-block d-xl-none">
                                                                                &nbsp;
                                                                            </div>
                                                                        </p>
                                                                        <p className={`${style.subPara}`}>
                                                                            <img
                                                                                src={imageHost + "/pricing-tick.svg"}
                                                                                alt=""
                                                                            />
                                                                        </p>
                                                                        <p className={`${style.subPara}`}>
                                                                            <img
                                                                                src={imageHost + "/pricing-tick.svg"}
                                                                                alt=""
                                                                            />
                                                                            <div className="d-block d-xl-none">
                                                                                &nbsp;
                                                                            </div>
                                                                        </p>
                                                                        <p className={`${style.subPara}`}>
                                                                            <img
                                                                                src={imageHost + "/pricing-cross.svg"}
                                                                                alt=""
                                                                            />
                                                                            <div className="d-block d-xl-none">
                                                                                &nbsp;
                                                                            </div>
                                                                        </p>
                                                                        {/* <p className={`${style.subPara}`}><img src={imageHost + "/pricing-cross.svg"} alt="" /><div className='d-block d-xl-none'>&nbsp;</div></p>
                                          <p className={`${style.subPara}`}><img src={imageHost + "/pricing-cross.svg"} alt="" /></p> */}
                                                                        {isLoggedIn ? (
                                                                            <>
                                                                                {buyLoader &&
                                                                                    selectClicked === plan.name ? (
                                                                                    <>
                                                                                        <img
                                                                                            src={
                                                                                                imageHost + "/loader-small.gif"
                                                                                            }
                                                                                            alt="loading"
                                                                                            className="mt-4"
                                                                                        />
                                                                                    </>
                                                                                ) : (
                                                                                    <button
                                                                                        disabled={activePlan === plan.name}
                                                                                        className={
                                                                                            activePlan === plan.name
                                                                                                ? `${style.centerColBtnSelected} py-1 px-4 mt-4`
                                                                                                : `${style.centerColBtn} py-1 px-4 mt-4`
                                                                                        }
                                                                                        onClick={() => {
                                                                                            setSelectClicked(plan.name);
                                                                                            setSelectedOrder(plan.order);
                                                                                            orderSelected = plan.order;
                                                                                            if (freq) {
                                                                                                buyPlan(plan.name, freq);
                                                                                            } else {
                                                                                                buyPlan(
                                                                                                    plan.name,
                                                                                                    plan.frequency
                                                                                                );
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        {activePlan === plan.name
                                                                                            ? "Selected"
                                                                                            : "Select"}
                                                                                    </button>
                                                                                )}
                                                                            </>
                                                                        ) : (
                                                                            <button
                                                                                className={`${style.centerColBtn} py-1 px-4 mt-4`}
                                                                                onClick={() => {
                                                                                    router.push("/login");
                                                                                }}
                                                                            >
                                                                                Get Started
                                                                            </button>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {plan.name === "STANDARD" ? (
                                                                            <>
                                                                                <p className={`${style.subPara}`}>
                                                                                    Unlimited
                                                                                    <div className="d-block d-xl-none">
                                                                                        &nbsp;
                                                                                    </div>
                                                                                </p>
                                                                                <p className={`${style.subPara}`}>Unlimited</p>
                                                                                <p className={`${style.subPara}`}>
                                                                                    Unlimited
                                                                                    <div className="d-block d-xl-none">
                                                                                        &nbsp;
                                                                                    </div>
                                                                                </p>
                                                                                <p className={`${style.subPara}`}>
                                                                                    <img
                                                                                        src={
                                                                                            imageHost + "/pricing-tick.svg"
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                    <div className="d-block d-xl-none">
                                                                                        &nbsp;
                                                                                    </div>
                                                                                </p>
                                                                                <p className={`${style.subPara}`}>
                                                                                    <img
                                                                                        src={
                                                                                            imageHost + "/pricing-tick.svg"
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                    <div className={`${style.largeScreensSpace}`}>
                                                                                        &nbsp;
                                                                                    </div>
                                                                                </p>
                                                                                <p className={`${style.subPara}`}>
                                                                                    <img
                                                                                        src={
                                                                                            imageHost + "/pricing-tick.svg"
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                </p>
                                                                                <p className={`${style.subPara}`}>
                                                                                    <img
                                                                                        src={
                                                                                            imageHost + "/pricing-tick.svg"
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                </p>
                                                                                <p className={`${style.subPara}`}>
                                                                                    <img
                                                                                        src={
                                                                                            imageHost + "/pricing-tick.svg"
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                </p>
                                                                                <p className={`${style.subPara}`}>
                                                                                    <img
                                                                                        src={
                                                                                            imageHost + "/pricing-tick.svg"
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                </p>
                                                                                <p className={`${style.subPara}`}>
                                                                                    <img
                                                                                        src={
                                                                                            imageHost + "/pricing-tick.svg"
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                    <div className="d-block d-xl-none">
                                                                                        &nbsp;
                                                                                    </div>
                                                                                </p>
                                                                                <p className={`${style.subPara}`}>
                                                                                    <img
                                                                                        src={
                                                                                            imageHost + "/pricing-tick.svg"
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                    <div className="d-block d-xl-none">
                                                                                        &nbsp;
                                                                                    </div>
                                                                                </p>

                                                                                <p className={`${style.subPara}`}>
                                                                                    <img
                                                                                        src={
                                                                                            imageHost + "/pricing-tick.svg"
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                </p>
                                                                                <p className={`${style.subPara}`}>
                                                                                    <img
                                                                                        src={
                                                                                            imageHost + "/pricing-tick.svg"
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                </p>
                                                                                <p className={`${style.subPara}`}>
                                                                                    <img
                                                                                        src={
                                                                                            imageHost + "/pricing-tick.svg"
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                </p>

                                                                                <p className={`${style.subPara}`}>
                                                                                    <img
                                                                                        src={
                                                                                            imageHost + "/pricing-tick.svg"
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                    <div className="d-block d-xl-none">
                                                                                        &nbsp;
                                                                                    </div>
                                                                                </p>
                                                                                <p className={`${style.subPara}`}>
                                                                                    <img
                                                                                        src={
                                                                                            imageHost + "/pricing-tick.svg"
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                </p>
                                                                                <p className={`${style.subPara}`}>
                                                                                    <img
                                                                                        src={
                                                                                            imageHost + "/pricing-tick.svg"
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                    <div className="d-block d-xl-none">
                                                                                        &nbsp;
                                                                                    </div>
                                                                                </p>
                                                                                <p className={`${style.subPara}`}>
                                                                                    <img
                                                                                        src={
                                                                                            imageHost + "/pricing-tick.svg"
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                </p>
                                                                                <p className={`${style.subPara}`}>
                                                                                    <img
                                                                                        src={
                                                                                            imageHost + "/pricing-tick.svg"
                                                                                        }
                                                                                        alt=""
                                                                                    />

                                                                                </p>
                                                                                <p className={`${style.subPara}`}>
                                                                                    <img
                                                                                        src={
                                                                                            imageHost + "/pricing-tick.svg"
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                </p>
                                                                                <p className={`${style.subPara}`}>
                                                                                    <img
                                                                                        src={
                                                                                            imageHost + "/pricing-tick.svg"
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                    <div className="d-block d-xl-none">
                                                                                        &nbsp;
                                                                                    </div>
                                                                                </p>
                                                                                <p className={`${style.subPara}`}>
                                                                                    <img
                                                                                        src={
                                                                                            imageHost + "/pricing-tick.svg"
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                </p>
                                                                                <p className={`${style.subPara}`}>
                                                                                    <img
                                                                                        src={
                                                                                            imageHost + "/pricing-tick.svg"
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                    <div className="d-block d-xl-none">
                                                                                        &nbsp;
                                                                                    </div>
                                                                                </p>
                                                                                <p className={`${style.subPara}`}>
                                                                                    <img
                                                                                        src={
                                                                                            imageHost + "/pricing-tick.svg"
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                    <div className="d-block d-xl-none">
                                                                                        &nbsp;
                                                                                    </div>
                                                                                </p>
                                                                                {/* <p className='sub-para'><img src={imageHost + "/pricing-tick.svg"} alt="" /><div className='d-block d-xl-none'>&nbsp;</div></p>
                                                <p className='sub-para'><img src={imageHost + "/pricing-tick.svg"} alt="" /></p> */}
                                                                                {isLoggedIn ? (
                                                                                    <>
                                                                                        {buyLoader &&
                                                                                            selectClicked === plan.name ? (
                                                                                            <>
                                                                                                <img
                                                                                                    src={
                                                                                                        imageHost +
                                                                                                        "/loader-small.gif"
                                                                                                    }
                                                                                                    alt="loading"
                                                                                                    className="mt-4"
                                                                                                />
                                                                                            </>
                                                                                        ) : (
                                                                                            <button
                                                                                                disabled={
                                                                                                    activePlan === plan.name
                                                                                                }
                                                                                                className={
                                                                                                    activePlan === plan.name
                                                                                                        ? `${style.centerColBtnSelected} py-1 px-4 mt-4`
                                                                                                        : `${style.centerColBtn} py-1 px-4 mt-4`
                                                                                                }
                                                                                                onClick={() => {
                                                                                                    setSelectClicked(plan.name);
                                                                                                    setSelectedOrder(plan.order);
                                                                                                    orderSelected = plan.order;
                                                                                                    if (freq) {
                                                                                                        buyPlan(plan.name, freq);
                                                                                                    } else {
                                                                                                        buyPlan(
                                                                                                            plan.name,
                                                                                                            plan.frequency
                                                                                                        );
                                                                                                    }
                                                                                                }}
                                                                                            >
                                                                                                {activePlan === plan.name
                                                                                                    ? "Selected"
                                                                                                    : "Select"}
                                                                                            </button>
                                                                                        )}
                                                                                    </>
                                                                                ) : (
                                                                                    <button
                                                                                        className={`${style.centerColBtn} py-1 px-4 mt-4`}
                                                                                        onClick={() => {
                                                                                            router.push("/login");
                                                                                        }}
                                                                                    >
                                                                                        Get Started
                                                                                    </button>
                                                                                )}
                                                                            </>
                                                                        ) : (
                                                                            <></>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    } else {
                                        return <></>;
                                    }
                                })}
                            </>
                        ) : (
                            <>
                                <div>No Plans To Show</div>
                            </>
                        )}
                    </div>
                </div>
                <div className={`${style.mobileView} d-block d-md-none`} id="plans-mobile">
                    <div className={`${style.plansGrid}`}>
                        {
                            subsArr && subsArr.length !== 0 ?
                                <>
                                    {
                                        subsArr.map((plan: any) => {
                                            if (plan.frequency === "YEARLY") {
                                                return (
                                                    <>
                                                        <div className={`${style.mobilePlan} position-relative`}>
                                                            <div className={`text-center w-100 ${style.selectDiv} mb-3`}>
                                                                {isLoggedIn ? (
                                                                    <>
                                                                        {buyLoader ? (
                                                                            <>
                                                                                <img
                                                                                    src={imageHost + "/loader-small.gif"}
                                                                                    alt="loading"
                                                                                />
                                                                            </>
                                                                        ) : (
                                                                            <button
                                                                                disabled={
                                                                                    activePlan === plan.name &&
                                                                                    (userPaidPrice === newDisplayPrice ||
                                                                                        !newDisplayPrice)
                                                                                }
                                                                                className={
                                                                                    activePlan === plan.name &&
                                                                                        (userPaidPrice === newDisplayPrice ||
                                                                                            !newDisplayPrice)
                                                                                        ? `${style.centerColBtnSelected} py-1 px-4`
                                                                                        : `${style.centerColBtn} py-1 px-4`
                                                                                }
                                                                                onClick={() => {
                                                                                    setSelectedOrder(plan.order);
                                                                                    orderSelected = plan.order;
                                                                                    if (freq) {
                                                                                        buyPlan(plan.name, freq);
                                                                                    } else {
                                                                                        buyPlan(plan.name, plan.frequency);
                                                                                    }
                                                                                }}
                                                                            >
                                                                                {activePlan === plan.name &&
                                                                                    (userPaidPrice === newDisplayPrice ||
                                                                                        !newDisplayPrice)
                                                                                    ? "Selected"
                                                                                    : "Select"}
                                                                            </button>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <button
                                                                        className={`${style.centerColBtn} py-1 px-4`}
                                                                        onClick={() => {
                                                                            router.push("/login");
                                                                        }}
                                                                    >
                                                                        Get Started
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <div className={`${style.name} text-center`}>{plan.name}</div>
                                                            <div className="w-100 text-center">
                                                                <button
                                                                    onClick={() => {
                                                                        setFreq(plan.frequency);
                                                                        if (clicked === plan.name) {
                                                                            setShowSubsChoice(!showSubsChoice);
                                                                        } else {
                                                                            setShowSubsChoice(true);
                                                                        }
                                                                        setClicked(plan.name);
                                                                        setNewFrequency(
                                                                            userFreq && activePlan === plan.name
                                                                                ? userFreq
                                                                                : plan.frequencyDisplayName
                                                                        );
                                                                        setNewDisplayPrice(
                                                                            userPaidPrice && activePlan === plan.name
                                                                                ? userPaidPrice
                                                                                : plan.offerPrice
                                                                        );
                                                                    }}
                                                                    className={`${style.price} w-75 text-center mt-0`}
                                                                >
                                                                    <p className="mb-0 me-2">
                                                                        <span>{`$${newDisplayPrice && clicked === plan.name
                                                                            ? newDisplayPrice
                                                                            : userPaidPrice && activePlan === plan.name
                                                                                ? userPaidPrice
                                                                                : plan.offerPrice
                                                                            }`}</span>
                                                                        <br />
                                                                        Per{" "}
                                                                        {newFrequency && clicked === plan.name
                                                                            ? newFrequency
                                                                            : userFreq && activePlan === plan.name
                                                                                ? userFreq
                                                                                : plan.frequencyDisplayName}
                                                                    </p>
                                                                    <img src={imageHost + "/dropdown-icon.svg"} alt="" />
                                                                </button>
                                                            </div>
                                                            {showSubsChoice && clicked === plan.name ? (
                                                                <>
                                                                    <div className={`${style.subsChoice} position-absolute`}>
                                                                        {subsArr.map((plan1: any) => {
                                                                            if (plan1.name === plan.name) {
                                                                                return (
                                                                                    <div>
                                                                                        <button
                                                                                            className={
                                                                                                newFrequency ===
                                                                                                    plan1.frequencyDisplayName
                                                                                                    ? `${style.selectedYearlyChoice} w-100 d-flex justify-content-between`
                                                                                                    : `${style.yearlyChoice} w-100 d-flex justify-content-between`
                                                                                            }
                                                                                            onClick={() => {
                                                                                                setNewFrequency(
                                                                                                    plan1.frequencyDisplayName
                                                                                                );
                                                                                                setNewDisplayPrice(plan1.offerPrice);
                                                                                                setFreq(plan1.frequency);
                                                                                                setShowSubsChoice(false);
                                                                                            }}
                                                                                        >
                                                                                            <div>{plan1.frequencyDisplayName}</div>{" "}
                                                                                            <div className={`${style.choicePrice}`}>
                                                                                                <span className={`${style.cut} me-2`}>
                                                                                                    ${plan1.price}
                                                                                                </span>
                                                                                                ${plan1.offerPrice}
                                                                                            </div>
                                                                                        </button>
                                                                                    </div>
                                                                                );
                                                                            }
                                                                        })}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <></>
                                                            )}
                                                            <div className="row mt-2 mb-4">
                                                                {plan.name === "NEWBIE" ? (
                                                                    <>
                                                                        {(showAll === plan.name
                                                                            ? newbieFeatures
                                                                            : newbieFeatures.slice(0, 7)
                                                                        ).map((feature: string) => {
                                                                            return (
                                                                                <>
                                                                                    <div className={`${style.feature} col-6 text-start`}>
                                                                                        {feature}
                                                                                    </div>
                                                                                    {feature ===
                                                                                        "Exchanges/Wallets Integration" ? (
                                                                                        <div className={`${style.availability} col-6 text-end`}>
                                                                                            Unlimited
                                                                                        </div>
                                                                                    ) : (
                                                                                        <>
                                                                                            {feature === "Portfolio transactions" ? (
                                                                                                <div className={`${style.availability} col-6 text-end`}>
                                                                                                    Unlimited
                                                                                                </div>
                                                                                            ) : (
                                                                                                <>
                                                                                                    {feature ===
                                                                                                        "Realtime Portfolio Performance" ? (
                                                                                                        <div className={`${style.availability} col-6 text-end`}>
                                                                                                            With 1 day delay
                                                                                                        </div>
                                                                                                    ) : (
                                                                                                        <div className={`${style.availability} col-6 text-end`}>
                                                                                                            <img
                                                                                                                src={
                                                                                                                    imageHost +
                                                                                                                    "/pricing-tick.svg"
                                                                                                                }
                                                                                                                alt=""
                                                                                                            />
                                                                                                        </div>
                                                                                                    )}
                                                                                                </>
                                                                                            )}
                                                                                        </>
                                                                                    )}
                                                                                </>
                                                                            );
                                                                        })}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {plan.name === "STARTER" ? (
                                                                            <>
                                                                                {(showAll === plan.name
                                                                                    ? starterFeatures
                                                                                    : starterFeatures.slice(0, 7)
                                                                                ).map((feature: string) => {
                                                                                    return (
                                                                                        <>
                                                                                            <div className={`${style.feature} col-6 text-start`}>
                                                                                                {feature}
                                                                                            </div>
                                                                                            {feature ===
                                                                                                "Exchanges/Wallets Integration" ? (
                                                                                                <div className={`${style.availability} col-6 text-end`}>
                                                                                                    Unlimited
                                                                                                </div>
                                                                                            ) : (
                                                                                                <>
                                                                                                    {feature ===
                                                                                                        "Portfolio transactions" ? (
                                                                                                        <div className={`${style.availability} col-6 text-end`}>
                                                                                                            Unlimited
                                                                                                        </div>
                                                                                                    ) : (
                                                                                                        <div className={`${style.availability} col-6 text-end`}>
                                                                                                            <img
                                                                                                                src={
                                                                                                                    imageHost +
                                                                                                                    "/pricing-tick.svg"
                                                                                                                }
                                                                                                                alt=""
                                                                                                            />
                                                                                                        </div>
                                                                                                    )}
                                                                                                </>
                                                                                            )}
                                                                                        </>
                                                                                    );
                                                                                })}
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                {plan.name === "STANDARD" ? (
                                                                                    <>
                                                                                        {(showAll === plan.name
                                                                                            ? features
                                                                                            : features.slice(0, 7)
                                                                                        ).map((feature: string) => {
                                                                                            return (
                                                                                                <>
                                                                                                    <div className={`${style.feature} col-6 text-start`}>
                                                                                                        {feature}
                                                                                                    </div>
                                                                                                    {feature ===
                                                                                                        "Exchanges/Wallets Integration" ? (
                                                                                                        <div className={`${style.availability} col-6 text-end`}>
                                                                                                            Unlimited
                                                                                                        </div>
                                                                                                    ) : (
                                                                                                        <>
                                                                                                            {feature ===
                                                                                                                "Portfolio transactions" ? (
                                                                                                                <div className={`${style.availability} col-6 text-end`}>
                                                                                                                    Unlimited
                                                                                                                </div>
                                                                                                            ) : (
                                                                                                                <div className={`${style.availability} col-6 text-end`}>
                                                                                                                    <img
                                                                                                                        src={
                                                                                                                            imageHost +
                                                                                                                            "/pricing-tick.svg"
                                                                                                                        }
                                                                                                                        alt=""
                                                                                                                    />
                                                                                                                </div>
                                                                                                            )}
                                                                                                        </>
                                                                                                    )}
                                                                                                </>
                                                                                            );
                                                                                        })}
                                                                                    </>
                                                                                ) : (
                                                                                    <></>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                            <div className={`text-center w-100 ${style.selectDiv} mb-3`}>
                                                                {isLoggedIn ? (
                                                                    <>
                                                                        {buyLoader ? (
                                                                            <>
                                                                                <img
                                                                                    src={imageHost + "/loader-small.gif"}
                                                                                    alt="loading"
                                                                                />
                                                                            </>
                                                                        ) : (
                                                                            <button
                                                                                disabled={
                                                                                    activePlan === plan.name &&
                                                                                    (userPaidPrice === newDisplayPrice ||
                                                                                        !newDisplayPrice)
                                                                                }
                                                                                className={
                                                                                    activePlan === plan.name &&
                                                                                        (userPaidPrice === newDisplayPrice ||
                                                                                            !newDisplayPrice)
                                                                                        ? `${style.centerColBtnSelected} py-1 px-4`
                                                                                        : `${style.centerColBtn} py-1 px-4`
                                                                                }
                                                                                onClick={() => {
                                                                                    setSelectedOrder(plan.order);
                                                                                    orderSelected = plan.order;
                                                                                    if (freq) {
                                                                                        buyPlan(plan.name, freq);
                                                                                    } else {
                                                                                        buyPlan(plan.name, plan.frequency);
                                                                                    }
                                                                                }}
                                                                            >
                                                                                {activePlan === plan.name &&
                                                                                    (userPaidPrice === newDisplayPrice ||
                                                                                        !newDisplayPrice)
                                                                                    ? "Selected"
                                                                                    : "Select"}
                                                                            </button>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <button
                                                                        className={`${style.centerColBtn} py-1 px-4`}
                                                                        onClick={() => {
                                                                            router.push("/login");
                                                                        }}
                                                                    >
                                                                        Get Started
                                                                    </button>
                                                                )}
                                                            </div>
                                                            {showAll === plan.name ? (
                                                                <>
                                                                    <div className={`${style.showAll} text-center position-relative pb-5`}>
                                                                        <div className={`w-100 text-center position-absolute ${style.arrow}`}>
                                                                            <button
                                                                                className="position-absolute"
                                                                                onClick={() => {
                                                                                    setShowAll("");
                                                                                }}
                                                                            >
                                                                                <img
                                                                                    src={imageHost + "/collapse-features.svg"}
                                                                                    alt="expand"
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className={`${style.showAll} text-center position-relative pb-5`}>
                                                                        <button
                                                                            onClick={() => {
                                                                                setShowAll(plan.name);
                                                                            }}
                                                                        >
                                                                            Show All Features
                                                                        </button>
                                                                        <div className={`w-100 text-center position-absolute ${style.arrow}`}>
                                                                            <button
                                                                                className="position-absolute"
                                                                                onClick={() => {
                                                                                    setShowAll(plan.name);
                                                                                }}
                                                                            >
                                                                                <img
                                                                                    src={imageHost + "/expand-features.svg"}
                                                                                    alt="expand"
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </>
                                                );
                                            } else {
                                                return <></>;
                                            }
                                        })
                                    }
                                </>
                                :
                                <></>
                        }

                    </div>
                </div>
                <p className={`${style.mainPara} mt-5`}>
                    <b>CRPTM steps in to wash off all your worries.</b>
                    <br />
                    We have a robust integrated system in place, built from the bottom up,
                    to assist cryptocurrency investors just like you.
                </p>
                <p className={`${style.mainPara} mb-5`}>
                    All you have to do is sign up for our plans and CRPTM will handle the
                    rest!
                </p>
                <hr />
            </div>
        </div>
    );
}

export default Plans;
