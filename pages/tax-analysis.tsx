import React, { useEffect, useRef, useState } from 'react'
import MainService from '../services/main-service';
import mainServiceClient from '../services/main-serviceClient'
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import nookies from 'nookies';
import style from '../styles/tax-analysis/tax-analysis.module.scss'
import "react-datepicker/dist/react-datepicker.css";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useRouter } from 'next/router'
import check401 from '../components/401-check';
import getInsideAllPromiseFunction from '../components/getInsideAllServerPromise';
import LeftFeed from '../components/shared/left-feed';
import RightFeed from '../components/shared/right-feed';

let lastKeyy: any;
let mainservice: any = MainService("get");

function getForms(tokens: any) {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await mainservice("forms", 'ups', null, tokens);
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
            let res = await mainservice('subscriptions', 'user', null, tokens);
            resolve(res);
        }
        catch (e: any) {
            reject(e);
        }
    })
}

async function getData(tokens: any, context: any, fnsArr: any[]) {
    let access: boolean = false;
    let planName: string = '';
    let userPlans: any;
    let formsDataRes: any;
    let storePromise = await getInsideAllPromiseFunction(tokens, context, fnsArr)
    console.log("StorePromise props");
    console.log(storePromise.props);
    if (storePromise.props) {
        storePromise.props.forEach((ele: any, i: any) => {
            if (i === 0) {
                formsDataRes = ele.value.forms
            } else {
                userPlans = ele.value.data.userSubscriptions
            }

        })
        userPlans.forEach((sub: any) => {
            if (sub.subscriptionStatus === "ACTIVE" && sub.planType === 'SUBSCRIPTION') {
                nookies.set(context, 'userPlan', sub.subscriptionPlanName, {
                    path: '/',
                    maxAge: 3600, // 30 days in seconds
                });
                planName = sub.subscriptionPlanName;
            }
        })
        if (planName === "NEWBIE")
            access = false;
        else
            access = true;
        return {
            props: {
                userPlan: planName,
                tokens: tokens,
                access: access,
                allForms: formsDataRes
            }
        }
    }
    return storePromise
}

export async function getServerSideProps(context: any) {
    const cookies = nookies.get(context);
    console.log(context);
    let fnsArr = [getForms, userPlans]
    let storePromise = await getData(cookies.accessTokens, context, fnsArr)
    return storePromise
}

function TaxAnalysis(props: any) {
    const router = useRouter()
    let mainServiceGet: any = MainService("get");
    let mainServicePost: any = MainService("post");
    let clientSideGet: any = mainServiceClient("get");
    let clientSidePost: any = mainServiceClient("post")

    let tokens = props.accessTokens;
    console.log(props.allForms);
    console.log(props.userPlan);
    const userPlan = props.userPlan;
    // console.log(tokens)
    // const cookies = parseCookies();
    // let token = cookies.accessTokens;
    // console.log(token)
    // const userPlan = localStorage.getItem('userPlan')
    const formDisplayMap = new Map([
        ['FORM1040_SCH_D', 'Total Capital Gain/Loss'],
        ['FORM1040_SCH_1', 'Additional Income Reports'],
        ['FORM1040_SCH_C', 'Additional Income Reports'],
        ['FORM8949', 'Total Capital Gain/Loss'],
        ['FORM709', 'Gift Transactions'],
        ['FORM8283', 'Donation Transaction'],
        ['FORM14039', 'Stolen Transaction'],
        ['FORM4684', 'Lost Transactions']
    ]);
    let formHeaders: any = {
        'FORM1040_SCH_C': ['Asset Description', 'Date Acquired', 'Type', 'Fair Market Value'],
        'FORM1040_SCH_1': ['Asset Description', 'Date Acquired', 'Type', 'Fair Market Value'],
        'FORM1040_SCH_D': ['Asset Description', 'Date Acquired', 'Cost Basis', 'Proceeds', '(Sale Price)', 'Date sold', 'Gain Or Loss'],
        'FORM8949': ['Asset Description', 'Date Acquired', 'Cost Basis', 'Proceeds', '(Sale Price)', 'Date sold', 'Gain Or Loss'],
        'FORM709': ['Gift Currency', 'Date Acquisition', 'Cost Basis', 'Gift Amount', '', 'Date of Gift'],
        'FORM8283': ['Donation Currency', 'Date Acquisition', 'Cost Basis', 'Donation Amount', '', 'Date of Donation'],
        'FORM14039': ['Stolen Currency', 'Date Acquisition', 'Cost Basis', 'Stolen Amount', '', 'Date of Stolen'],
        'FORM4684': ['Lost Currency', 'Date Acquisition', 'Cost Basis', 'Lost Amount', '', 'Date of Lost']
    }
    // let router.push = userouter.push();

    var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;
    const [rangeDateAcquired, setrangeDateAcquired] = useState<any[]>([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const [rangeDateSpent, setrangeDateSpent] = useState<any[]>([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    let yearRanges = ["2023", "2022", "2021", "2020", "2019", "2018", "2017"];
    const [selectedCalc, setSelectedCalc] = useState('FIFO - First In, First Out');
    const [selectedForm, setSelectedForm] = useState('Select Form Type');
    const [selectedYr, setSelectedYr] = useState('2023');
    const [forms, setForms] = useState<any[]>(props.allForms ? props.allForms : []);
    const [showFormsLoader, setShowFormsLoader] = useState(false);
    const [viewTxnsLoader, setViewTxnsLoader] = useState(false);
    const [viewTxns, setViewTxns] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [showErr, setShowErr] = useState(false);
    const [currencies, setCurrencies] = useState<any[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState<any>([]);
    const [openCurrencyDropdown, setOpenCurrencyDropdown] = useState(false);
    const [invalidPlan, setInvalidPlan] = useState(false);
    const [plDropdown, setPlDropdown] = useState(false);
    const [gainType, setGainType] = useState<any>(null);
    const [acquiredCalendar, setAcquiredCalendar] = useState(false);
    const [spentCalendar, setSpentCalendar] = useState(false);
    const [lastKey, setLastKey] = useState<any>(null);
    const [showNoAccErr, setShowNoAccErr] = useState(false);
    const [invalidErr, setInvalidErr] = useState('');
    const [downloadLoader, setDownloadLoader] = useState(false);
    const [showDownloadError, setShowDownloadError] = useState(false);
    const [downloadErr, setDownloadErr] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [showUpgradePlan, setShowUpgradePlan] = useState(true);
    const [viewId, setViewId] = useState(false);
    const [idClicked, setIdClicked] = useState<any>();
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [userComment, setUserComment] = useState('');
    const [showEditSuccess, setShowEditSuccess] = useState(false);
    const [saveCommentLoader, setSaveCommentLoader] = useState(false);
    const [showEditError, setShowEditError] = useState(false);
    const [noAccess, showNoAccess] = useState(!props.access);
    const [accDropdown, showAccDropdown] = useState(false);
    const [userAccs, setUserAccs] = useState<any[]>([]);
    const [selectedAcc, setSelectedAcc] = useState<any[]>([]);
    const [reload, setReload] = useState(false);
    const [showAddOnBtn, setShowAddOnBtn] = useState(false);
    const [startingLoader, setStartingLoader] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const [orderDate, setorderDate] = useState("DSC");

    let selectedHeaders: any[] = [];

    if (selectedForm) {
        selectedHeaders = formHeaders[selectedForm];
    }

    var allFilters = [];
    let methodArr = selectedCalc.split(' ');
    let startDateIn = format(rangeDateAcquired[0].startDate, 'yyyy-MM-dd');
    let endDateIn = format(rangeDateAcquired[0].endDate, 'yyyy-MM-dd');
    let startDateOut = format(rangeDateSpent[0].startDate, 'yyyy-MM-dd');
    let endDateOut = format(rangeDateSpent[0].endDate, 'yyyy-MM-dd');
    let inDisplay = startDateIn && endDateIn && startDateIn !== endDateIn ? startDateIn + ' to ' + endDateIn : 'Select Range';
    let outDisplay = startDateOut && endDateOut && startDateOut !== endDateOut ? startDateOut + ' to ' + endDateOut : 'Select Range';

    let currencyRef: any = useRef();
    let acquiredRef: any = useRef();
    let spentRef: any = useRef();
    let plRef: any = useRef();
    let accRef: any = useRef();
    let idRef: any = useRef();


    function closeDropdown(reference: any) {
        function handleClose(e: any) {
            if (reference.current) {
                if (!reference.current.contains(e.target) && reference === currencyRef) {
                    setOpenCurrencyDropdown(false);
                }
                if (!reference.current.contains(e.target) && reference === acquiredRef) {
                    setAcquiredCalendar(false);
                }
                if (!reference.current.contains(e.target) && reference === spentRef) {
                    setSpentCalendar(false);
                }
                if (!reference.current.contains(e.target) && reference === plRef) {
                    setPlDropdown(false);
                }
                if (!reference.current.contains(e.target) && reference === accRef) {
                    showAccDropdown(false);
                }
                if (!reference.current.contains(e.target) && reference === idRef) {
                    setViewId(false);
                }
            }
            else {
                console.log('No reference rn')
            }
        }

        document.addEventListener("mousedown", handleClose);

        return () => {
            document.removeEventListener("mousedown", handleClose);
        }
    }

    useEffect(() => {

        // usersPlan();
        if (viewTxns) {
            closeDropdown(currencyRef);
            closeDropdown(acquiredRef);
            closeDropdown(spentRef);
            closeDropdown(plRef);
            closeDropdown(accRef);
            closeDropdown(idRef);
        }

    }, [viewTxns]);

    var resObj = {
        year: selectedYr,
        costBasis: methodArr[0],
        formType: selectedForm === 'Select Form Type' ? null : selectedForm,
        currency: selectedCurrency.length === 0 ? null : selectedCurrency,
        gainType: gainType,
        startDateIn: startDateIn === endDateIn ? null : startDateIn,
        endDateIn: startDateIn === endDateIn ? null : endDateIn,
        startDateOut: startDateOut === endDateOut ? null : startDateOut,
        endDateOut: startDateOut === endDateOut ? null : endDateOut,
        accounts: selectedAcc.length === 0 ? null : selectedAcc
    }

    var resObjForNext = {
        year: selectedYr,
        costBasis: methodArr[0],
        formType: selectedForm === 'Select Form Type' ? null : selectedForm,
        currency: selectedCurrency.length === 0 ? null : selectedCurrency,
        gainType: gainType,
        startDateIn: startDateIn === endDateIn ? null : startDateIn,
        endDateIn: startDateIn === endDateIn ? null : endDateIn,
        startDateOut: startDateOut === endDateOut ? null : startDateOut,
        endDateOut: startDateOut === endDateOut ? null : endDateOut,
        lastEvaluatedKeys: lastKey ? lastKey : null,
        accounts: selectedAcc.length === 0 ? null : selectedAcc
    }

    console.log(resObj);

    async function getCurrencies(crypto: any) {
        let url = "search/currency/" + crypto;
        try {
            let res = await mainServiceGet(url, null, 'ups', null, tokens);
            setCurrencies(res.data.currencies);
        }
        catch (e: any) {
            console.log(e);
            if (e.status === 500) {
                window.location.href = '/500-error'
            }
        }
    }

    async function getUserAccs() {
        try {
            let res = await mainServiceGet('user/accounts', 'ups', null, tokens);
            console.log(res);
            let accounts = res.data.allConnectedAccounts;
            accounts.map((acc: any) => {
                let accObj = {
                    account: acc.account.account,
                    accountDisplayName: acc.account.accountDisplayName
                }
                if (userAccs.length !== 0) {
                    userAccs.map((userAcc: any) => {
                        if (userAcc.account !== accObj.account)
                            setUserAccs(userAccs => [...userAccs, accObj]);
                        else
                            userAccs.splice(userAccs.indexOf(accObj), 1);
                    })
                }
                else
                    setUserAccs(userAccs => [...userAccs, accObj]);
            })
        }
        catch (e: any) {
            console.log(e);
        }
    }

    async function downloadForm() {
        setDownloadLoader(true);
        try {
            let res = await clientSidePost('/api/v1/tax-analysis/download-form', { year: selectedYr, costBasis: methodArr[0], formType: selectedForm }, null);
            console.log(res);
            window.location.href = res.data.fileUrl;
            setShowDownloadError(false);
            setDownloadLoader(false);
        }
        catch (e: any) {
            setShowDownloadError(true);
            console.log(e);
            if (e.status === 500) {
                window.location.href = '/500-error'
            }
            if (e.data.error) {
                setDownloadErr(e.data.error ? e.data.error.message : 'Something Went Wrong');
                if (e.data.error.code === 9936) {
                    setShowAddOnBtn(true);
                    setInvalidPlan(true);
                    setInvalidErr("Your current plan doesnt support the reports for the selected year. Please buy add-on to get the report for selected year.")
                    setShowUpgradePlan(false);
                }
                if (e.data.error.code === 9930 || e.data.error.code === 9934) {
                    setInvalidPlan(true);
                    setViewTxns(false);

                    if (e.data.error.code === 9930) {
                        setInvalidErr("Your Current Plan does not support this operation. Please upgrade");
                    }
                    else {
                        if (e.data.error.code === 9934)
                            setInvalidErr(`You need to upgrade your plan because your total transaction is ${e.data.userTxnCount} and you have taken a plan to support ${e.data.userPlanCountLimit} transactions.`);
                        else
                            setInvalidErr(e.data.error.message);
                    }
                }
            }
            else {
                setShowDownloadError(true);
            }

            setDownloadLoader(false);
        }
    }

    async function getTxns() {
        setViewTxnsLoader(true);
        try {
            let res = await clientSidePost('/api/v1/tax-analysis/getTxns', resObj, null);
            console.log(res);
            setShowErr(false);
            if (res.data.lastEvaluatedKeys) {
                setLastKey(res.data.lastEvaluatedKeys);
            }
            else {
                setLastKey(null);
            }
            setViewTxnsLoader(false);
            setViewTxns(true);
            setTransactions(res.data.formTxnList);
        }
        catch (e: any) {
            console.log(e);
            setViewTxnsLoader(false);
            setViewTxns(false);
            setShowErr(true);
            if (e.status === 500) {
                window.location.href = '/500-error'
            }
            if (e.data.error.code === 9936) {
                setShowAddOnBtn(true);
                setInvalidPlan(true);
                setInvalidErr("Your current plan doesnt support the reports for the selected year. Please buy add-on to get the report for selected year.")
                setShowUpgradePlan(false);
            }
            if (e.data.error.code === 9930 || e.data.error.code === 9934) {
                setInvalidPlan(true);

                if (e.data.error.code === 9930) {
                    setInvalidErr("Your Current Plan does not support this operation. Please upgrade");
                }
                else {
                    if (e.data.error.code === 9934)
                        setInvalidErr(`You need to upgrade your plan because your total transaction is ${e.data.userTxnCount} and you have taken a plan to support ${e.data.userPlanCountLimit} transactions.`);
                    else
                        setInvalidErr(e.data.error.message);
                }
            }
            else if (e.data.error.code === 9937) {
                setShowNoAccErr(true);
            }
            else {
                setShowErr(true);
            }
        }
    }

    async function getNextTxns() {
        setViewTxnsLoader(true);
        try {
            let res = await clientSidePost('/api/v1/tax-analysis/getTxns', resObjForNext, null);
            console.log(res);
            if (res.data.lastEvaluatedKeys) {
                setLastKey(res.data.lastEvaluatedKeys);
            }
            else {
                setLastKey(null);
            }
            setViewTxnsLoader(false);
            setViewTxns(true);
            let txnsList = res.data.formTxnList;
            if (txnsList.length !== 0) {
                txnsList.map((txn: any) => {
                    setTransactions(transactions => [...transactions, txn]);
                })
            }
            if (res.data.error) {
                if (res.data.error.code === 9930)
                    setInvalidPlan(true);
            }
        }
        catch (e: any) {
            console.log(e);
            setViewTxnsLoader(false);
            setViewTxns(false);
            setShowErr(true);
            if (e.status === 500) {
                window.location.href = '/500-error'
            }
            if (e.data.error.code === 9936) {
                setShowAddOnBtn(true);
                setInvalidPlan(true);
                setShowUpgradePlan(false);
                setInvalidErr("Your current plan doesnt support the reports for the selected year. Please buy add-on to get the report for selected year.")
            }
            if (e.data.error.code === 9930 || e.data.error.code === 9934) {
                setInvalidPlan(true);
                if (e.data.error.code === 9930) {
                    setInvalidErr("Your Current Plan does not support this operation. Please upgrade");
                }
                else {
                    if (e.data.error.code === 9934)
                        setInvalidErr(`You need to upgrade your plan because your total transaction is ${e.data.userTxnCount} and you have taken a plan to support ${e.data.userPlanCountLimit} transactions.`);
                    else
                        setInvalidErr(e.data.error.message);
                }
            }
            else if (e.data.error.code === 9937) {
                setShowNoAccErr(true);
            }
            else {
                setShowErr(true);
            }
        }
    }

    async function saveComment(comment: string, txnId: any) {
        setSaveCommentLoader(true);
        try {
            let res = await clientSidePost('/api/v1/tax-analysis/updateAnalysis', { comment: comment, formTxnId: txnId }, null);
            setSaveCommentLoader(false);
            setShowCommentBox(false);
            setShowEditSuccess(true);
            console.log(res);
            let updatedTxn = res.data.formTxn;
            transactions.map((transaction: any) => {
                if (transaction.formTxnId === updatedTxn.formTxnId) {
                    transactions.splice(transactions.indexOf(transaction), 1, updatedTxn);
                }
            })
            setReload(!reload);
        }
        catch (e: any) {
            setShowEditError(true);
            setSaveCommentLoader(false);
            setShowCommentBox(false);
            console.log(e);
        }
    }

    useEffect(() => {
        lastKeyy = lastKey;
    }, [lastKey])


    function handleScroll(event: any) {
        const { scrollHeight, scrollTop, clientHeight } = event.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 1) {
            setTimeout(() => {

                if (lastKeyy) {
                    getNextTxns();
                }
            }, 1000);
        }
    }

    function resetFilter(dismissed: any) {
        if (dismissed === gainType) {
            setGainType(null)
        }

        if (dismissed === inDisplay) {
            setrangeDateAcquired([
                {
                    startDate: new Date(),
                    endDate: new Date(),
                    key: 'selection'
                }
            ]);
        }

        if (dismissed === outDisplay) {
            setrangeDateSpent([
                {
                    startDate: new Date(),
                    endDate: new Date(),
                    key: 'selection'
                }
            ]);
        }

        if (selectedAcc.includes(dismissed))
            removeSelectedAccount(dismissed);

        if (selectedCurrency.includes(dismissed)) {
            removeSelectedCurrency(dismissed);
        }
    }

    function resetAllFilters() {
        setGainType(null);
        setSelectedAcc([]);
        setSelectedCurrency([]);
        setrangeDateSpent([
            {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection'
            }
        ]);
        setrangeDateAcquired([
            {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection'
            }
        ]);
    }

    function removeSelectedCurrency(currency: any) {
        selectedCurrency.splice(selectedCurrency.indexOf(currency), 1);
        let temp = selectedCurrency;
        setSelectedCurrency([]);
        temp.forEach((el: any) => {
            setSelectedCurrency((selectedCurrency: any) => [...selectedCurrency, el]);
        })
    }

    function removeSelectedAccount(acc: any) {
        selectedAcc.splice(selectedAcc.indexOf(acc), 1);
        let temp = selectedAcc;
        setSelectedAcc([]);
        temp.forEach((el: any) => {
            setSelectedAcc((selectedAcc: any) => [...selectedAcc, el]);
        })
    }

    function sortingData(data: any) {

        // FOR ACQUIRED DATE

        if (data === "dateAcquired" && orderDate === "ASC") {
            const sorted = [...transactions].sort((a: any, b: any) =>
                a[data]?.toLowerCase() > b[data]?.toLowerCase() ? 1 : -1
            );
            setorderDate("DSC");
            setTransactions(sorted);
        }
        if (data === "dateAcquired" && orderDate === "DSC") {
            const sorted = [...transactions].sort((a: any, b: any) =>
                a[data]?.toLowerCase() < b[data]?.toLowerCase() ? 1 : -1
            );
            setorderDate("ASC");
            setTransactions(sorted);
        }

        // FOR DATE SOLD

        if (data === "dateOut" && orderDate === "ASC") {
            const sorted = [...transactions].sort((a: any, b: any) =>
                a[data]?.toLowerCase() > b[data]?.toLowerCase() ? 1 : -1
            );
            setorderDate("DSC");
            setTransactions(sorted);
        }
        if (data === "dateOut" && orderDate === "DSC") {
            const sorted = [...transactions].sort((a: any, b: any) =>
                a[data]?.toLowerCase() < b[data]?.toLowerCase() ? 1 : -1
            );
            setorderDate("ASC");
            setTransactions(sorted);
        }

        // FOR GAIN/LOSS

        if (data === "gainOrLoss" && orderDate === "ASC") {
            const sorted = [...transactions].sort((a: any, b: any) =>
                Number(a[data]) > Number(b[data]) ? 1 : -1
            );
            setorderDate("DSC");
            setTransactions(sorted);
        }
        if (data === "gainOrLoss" && orderDate === "DSC") {
            const sorted = [...transactions].sort((a: any, b: any) =>
                Number(a[data]) < Number(b[data]) ? 1 : -1
            );
            setorderDate("ASC");
            setTransactions(sorted);
        }
    }

    function toUtc(date: any) {
        let dateObj = new Date(date).toUTCString();
        let temp = dateObj.split(" ");
        let time = temp[4].split(':');
        return temp[2] + " " + temp[1] + ", " + temp[3] + " " + time[0] + ':' + time[1];
    }

    if (selectedCurrency.length !== 0) {
        selectedCurrency.map((currency: any) => {
            allFilters.push(currency);
        })
    }
    if (gainType)
        allFilters.push(gainType);
    if (inDisplay !== 'Select Range')
        allFilters.push(inDisplay);
    if (outDisplay !== 'Select Range')
        allFilters.push(outDisplay);
    if (selectedAcc.length !== 0) {
        selectedAcc.map((accs: any) => {
            allFilters.push(accs);
        })
    }

    useEffect(() => {
        if (viewTxns)
            getTxns();
    }, [selectedCurrency, rangeDateAcquired, gainType, rangeDateSpent, selectedAcc]);


    return (
        <>
            <div className="d-flex justify-content-between">
                <div className="d-none d-lg-block">
                    <LeftFeed />
                </div>
                {
                    startingLoader ?
                        <div className="h-100 w-100 text-center"><img className='first-loader' src={imageHost + '/loader3.gif'} alt="Loading" /></div>
                        :
                        <>
                            {
                                noAccess ?
                                    <>
                                        <div className={`text-center ${style.noAccess}`}>
                                            <img src={imageHost + '/upgrade-plan-mascot.svg'} alt="" className="img-fluid mb-4" />
                                            <div>Your current plan does not support this feature. To access this feature, please upgrade the plan.</div>
                                            <button onClick={() => { router.push('/plans') }} className={`mt-3 ${style.viewSummary}`}>Upgrade Plan</button>
                                        </div>
                                    </> :
                                    <div className={`${style.taxAnalysis} container`}>
                                        <div className="d-flex justify-content-between align-items-center w-100">
                                            <div className={`${style.mainHeading} mt-0`}>
                                                <div className={`${style.title} text-center w-100`}><h1>Taxable Transactions Report</h1></div>
                                            </div>
                                            <button className={`${style.taxSummaryRedirect}`} onClick={() => { router.push('/tax-report') }}>Go To Tax Summary</button>
                                        </div>


                                        {/* MAIN INPUTS */}

                                        <div className={`d-flex flex-wrap justify-content-start align-items-start mt-5 ${style.mainInputs}`}>
                                            <div className='me-3 flex-fill'>
                                                <div className='mb-2'><b className='pt-3'>Report for</b></div>
                                                <div className={`accordion ${style.yearSelect}`}>
                                                    <div className="accordion-item position-relative">
                                                        <h2 className="accordion-header" id="headingOne">
                                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                                {selectedYr}
                                                            </button>
                                                        </h2>
                                                        <div id="collapseOne" className={`${style.dropdownBox} accordion-collapse position-absolute collapse`} aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                            <div className={`${style.dropdownBody} accordion-body`}>
                                                                {
                                                                    yearRanges.map(year => {
                                                                        return (
                                                                            <button className={`${style.years} text-start`} type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" onClick={() => { setSelectedYr(year) }}>{year}</button>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='me-3 flex-fill'>
                                                <div className='mb-2'><b>Calculation Method</b></div>
                                                <div className={`accordion ${style.method}`}>
                                                    <div className="accordion-item position-relative">
                                                        <h2 className="accordion-header" id="headingMethod">
                                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMethod" aria-expanded="true" aria-controls="collapseMethod">
                                                                {selectedCalc}
                                                            </button>
                                                        </h2>
                                                        <div id="collapseMethod" className={`${style.dropdownBox} accordion-collapse position-absolute collapse`} aria-labelledby="headingMethod" data-bs-parent="#accordionExample">
                                                            <div className={`${style.dropdownBody} accordion-body pt-4 pb-4`}>
                                                                <div className={selectedCalc === 'LIFO - Last In First Out' ? 'd-none' : 'w-100'}><button type="button" data-bs-toggle="collapse" data-bs-target="#collapseMethod" onClick={() => { setSelectedCalc('LIFO - Last In First Out') }}>LIFO - Last In First Out</button></div>
                                                                <div className={selectedCalc === 'HIFO - Highest In First Out' ? 'd-none' : 'w-100'}><button type="button" data-bs-toggle="collapse" data-bs-target="#collapseMethod" onClick={() => { setSelectedCalc('HIFO - Highest In First Out') }}>HIFO - Highest In First Out</button></div>
                                                                <div className={selectedCalc === 'FIFO - First In, First Out' ? 'd-none' : 'w-100'}><button type="button" data-bs-toggle="collapse" data-bs-target="#collapseMethod" onClick={() => { setSelectedCalc('FIFO - First In, First Out') }}>FIFO - First In, First Out</button></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='me-3 flex-fill'>
                                                <div className="mb-2"><b>Form</b></div>
                                                <div className={`accordion ${style.formsSelection}`}>
                                                    <div className="accordion-item position-relative">
                                                        <h2 className="accordion-header" id="headingThree">
                                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                                                                {selectedForm}
                                                            </button>
                                                        </h2>
                                                        <div id="collapseThree" className={`${style.dropdownBox} accordion-collapse position-absolute collapse`} aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                                            <div className={`${style.dropdownBody} accordion-body`}>
                                                                {
                                                                    showFormsLoader ?
                                                                        <div className='text-center mt-3 mb-3'>
                                                                            <img src={imageHost + '/loader-small.gif'} alt="loading" />
                                                                        </div>
                                                                        :
                                                                        <>
                                                                            {
                                                                                forms.map(form => {
                                                                                    return (
                                                                                        <button type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" onClick={() => { setSelectedForm(form.formName); }} className={form.formName === selectedForm ? "d-none" : "ranges"}>{form.displayName} - {form.formDescription}</button>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </>
                                                                }

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className=' flex-fill text-center text-md-start'>
                                                {
                                                    viewTxnsLoader ?
                                                        <img className='mt-5' src={imageHost + '/loader-small.gif'} alt="loading" /> :
                                                        <button onClick={() => { setTransactions([]); getTxns() }} className={`${style.viewTransactions}`} disabled={selectedForm === 'Select Form Type'}>View Transactions</button>
                                                }
                                            </div>
                                        </div>

                                        {/* ANALYSIS SECTION */}
                                        {
                                            transactions ?
                                                <>
                                                    {
                                                        viewTxns ?
                                                            <>

                                                                <div>
                                                                    {/* DESKTOP FILTERS */}

                                                                    <div className={`d-none d-lg-flex flex-wrap mt-3 ${style.filters} justify-content-center align-items-end`}>
                                                                        <div className={`position-relative ${style.filterDiv} me-2`} ref={currencyRef}>
                                                                            <button className={`${style.filterButton}`} onClick={() => { setOpenCurrencyDropdown(!openCurrencyDropdown) }}><img src={imageHost + '/tax-filters.svg'} alt="" /> Select Currency</button>
                                                                            {
                                                                                openCurrencyDropdown ?
                                                                                    <div className={`w-100 position-absolute ${style.currenciesList}`}>
                                                                                        <input className='w-100' type="text" name="currency" placeholder='Search Currency' id="" onChange={(e) => { getCurrencies(e.target.value) }} />
                                                                                        {
                                                                                            currencies.length === 0 ?
                                                                                                <></> :
                                                                                                <>
                                                                                                    {
                                                                                                        currencies.map((currency: any) => {
                                                                                                            return (
                                                                                                                <>
                                                                                                                    <div className="form-check">
                                                                                                                        <input className="form-check-input" type="checkbox" checked={selectedCurrency.includes(currency.currency)} name="flexRadioDefault" id={currency.id} onChange={(e) => { if (e.target.checked) { setSelectedCurrency((selectedCurrency: any) => [...selectedCurrency, currency.currency]); } else { removeSelectedCurrency(currency.currency) } }} />
                                                                                                                        <label className="form-check-label" htmlFor={currency.id}>
                                                                                                                            {currency.name} - {currency.currency}
                                                                                                                        </label>
                                                                                                                    </div>
                                                                                                                </>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </>
                                                                                        }
                                                                                    </div> :
                                                                                    <></>
                                                                            }
                                                                        </div>
                                                                        <div className={`position-relative ${style.filterDiv} me-2`} ref={acquiredRef}>
                                                                            <b>Acquired Date</b>
                                                                            <button onClick={() => { setAcquiredCalendar(!acquiredCalendar) }} className={`w-100 ${style.filterButton} d-flex justify-content-between`}>{inDisplay} <img src={imageHost + '/tax-filters.svg'} alt="" />{acquiredCalendar && <button className='close'>Close</button>} </button>
                                                                            {acquiredCalendar ?
                                                                                <DateRange
                                                                                    editableDateInputs={false}
                                                                                    onChange={(item: any) => { setrangeDateAcquired([item.selection]); }}
                                                                                    moveRangeOnFirstSelection={false}
                                                                                    months={1}
                                                                                    ranges={rangeDateAcquired}
                                                                                    direction='horizontal'
                                                                                    className={`calendarElement ${style.calendarEl}`}
                                                                                />
                                                                                : <></>
                                                                            }
                                                                        </div>
                                                                        <div className={`position-relative ${style.filterDiv} me-2`} ref={spentRef}>
                                                                            <b>Spent Date</b>
                                                                            <button onClick={() => { setSpentCalendar(!spentCalendar) }} className={`w-100 ${style.filterButton} d-flex justify-content-between`}>{outDisplay} <img src={imageHost + '/tax-filters.svg'} alt="" />{spentCalendar && <button className='close'>Close</button>} </button>
                                                                            {spentCalendar ?
                                                                                <DateRange
                                                                                    editableDateInputs={false}
                                                                                    onChange={(item: any) => { setrangeDateSpent([item.selection]); }}
                                                                                    moveRangeOnFirstSelection={false}
                                                                                    months={1}
                                                                                    ranges={rangeDateSpent}
                                                                                    direction='horizontal'
                                                                                    className={`calendarElement ${style.calendarEl}`}
                                                                                /> : <></>
                                                                            }
                                                                        </div>
                                                                        <div className={`position-relative ${style.filterDiv} me-2`} ref={plRef}>
                                                                            <button className={`${style.filterButton}`} onClick={() => { setPlDropdown(!plDropdown) }}><img src={imageHost + '/tax-filters.svg'} alt="" />Short/Long Term</button>
                                                                            {
                                                                                plDropdown ?
                                                                                    <div className={`${style.plDropdown} position-absolute w-100`}>
                                                                                        <div className="form-check w-100">
                                                                                            <input className='form-check-input' type="checkbox" id="short" checked={gainType === 'SHORT_TERM'} onChange={(e) => { if (e.target.checked) { setGainType('SHORT_TERM') } else { setGainType(null) } setPlDropdown(false) }} />
                                                                                            <label className='form-check-label w-100' htmlFor='short'>Short Term</label>
                                                                                        </div>
                                                                                        <div className="form-check w-100">
                                                                                            <input className='form-check-input' type="checkbox" id="long" checked={gainType === 'LONG_TERM'} onChange={(e) => { if (e.target.checked) { setGainType('LONG_TERM') } else { setGainType(null) } setPlDropdown(false) }} />
                                                                                            <label className='form-check-label w-100' htmlFor='long'>Long Term</label>
                                                                                        </div>
                                                                                    </div> :
                                                                                    <></>
                                                                            }
                                                                        </div>
                                                                        <div className={`position-relative ${style.filterDiv} me-2`} ref={accRef}>
                                                                            <button className={`${style.filterButton}`} onClick={() => { showAccDropdown(!accDropdown) }}><img src={imageHost + '/tax-filters.svg'} alt="" />Accounts</button>
                                                                            {
                                                                                accDropdown ?
                                                                                    <div className={`${style.plDropdown} position-absolute w-100`}>
                                                                                        {
                                                                                            userAccs.length === 0 ?
                                                                                                <div>No Connected Accounts</div> :
                                                                                                <>
                                                                                                    {
                                                                                                        userAccs.map((acc: any) => {
                                                                                                            return (
                                                                                                                <div className="form-check w-100">
                                                                                                                    <input className='form-check-input' type="checkbox" id={acc.account} checked={selectedAcc.includes(acc.account)} onChange={(e) => { if (e.target.checked) { setSelectedAcc(selectedAcc => [...selectedAcc, acc.account]) } else { removeSelectedAccount(acc.account) } }} />
                                                                                                                    <label className='form-check-label w-100' htmlFor={acc.account}>{acc.accountDisplayName}</label>
                                                                                                                </div>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </>
                                                                                        }
                                                                                    </div> :
                                                                                    <></>
                                                                            }
                                                                        </div>

                                                                    </div>

                                                                    {/* SHOWING SELECTED FILTERS */}

                                                                    {
                                                                        allFilters.length !== 0 ?
                                                                            <>
                                                                                <div className={`${style.showSelectedFilters} mt-5 d-flex flex-wrap align-items-center`}>
                                                                                    <b>Filters :</b>
                                                                                    {
                                                                                        allFilters.map((filter: any) => {
                                                                                            if (filter && filter !== 'Select Range') {
                                                                                                return (
                                                                                                    <div className={`${style.filter} ms-3 me-3 mt-2 d-flex align-items-center`}>
                                                                                                        <button onClick={() => {
                                                                                                            resetFilter(filter);
                                                                                                        }}>
                                                                                                            <img className='' src={imageHost + '/filter-cross.svg'} alt="remove" />
                                                                                                        </button>
                                                                                                        <div className='ms-2'> {filter === inDisplay ? 'Acquired Date : ' + filter : filter === outDisplay ? 'Date Sold : ' + filter : filter}</div>
                                                                                                    </div>
                                                                                                )
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                    <button onClick={resetAllFilters} className={`ms-2 mt-2 ${style.clearAll}`}>Clear All</button>
                                                                                </div>
                                                                            </> :
                                                                            <></>
                                                                    }


                                                                    <div className={`${style.tableLabel} mt-5 d-flex justify-content-between align-items-center`}>
                                                                        <b>{formDisplayMap.get(selectedForm)}</b>
                                                                        {
                                                                            downloadLoader ?
                                                                                <img src={imageHost + '/loader-small.gif'} alt="loading" className="d-none d-lg-block" /> :
                                                                                <button className='d-none d-lg-block' onClick={downloadForm}>Download Form</button>
                                                                        }
                                                                    </div>

                                                                    {/* ERROR IN DOWNLOADING */}
                                                                    {
                                                                        showDownloadError ?
                                                                            <div className={`w-100 ${style.error}`}>{downloadErr}</div> :
                                                                            <></>
                                                                    }
                                                                    {/* MOBILE FILTERS */}

                                                                    <div className={`mt-3 mb-3 d-flex d-lg-none justify-content-between ${style.mobileFiltersDiv} position-relative align-items-center`}>
                                                                        {
                                                                            downloadLoader ?
                                                                                <img className={`${style.downloadLoader}`} src={imageHost + '/loader-small.gif'} alt="loading" /> :
                                                                                <button className={`${style.download}`} onClick={downloadForm}>Download Form</button>
                                                                        }
                                                                        <button onClick={() => { setShowFilters(!showFilters) }} className={`${style.filtersBtn}`}><img className='me-2 mb-1' src={imageHost + '/tax-filters.svg'} alt="" />Filters</button>
                                                                        {
                                                                            showFilters ?
                                                                                <div className={`w-100 position-absolute ${style.filtersDiv}`}>
                                                                                    <div className={`position-relative ${style.filterDiv}`} ref={currencyRef}>
                                                                                        <button className={`${style.filterButton}`} onClick={() => { setOpenCurrencyDropdown(!openCurrencyDropdown) }}><img src={imageHost + '/tax-filters.svg'} alt="" /> Select Currency</button>
                                                                                        {
                                                                                            openCurrencyDropdown ?
                                                                                                <div className={`w-100 position-absolute ${style.currenciesList}`}>
                                                                                                    <input className='w-100' type="text" name="currency" placeholder='Search Currency' id="" onChange={(e) => { getCurrencies(e.target.value) }} />
                                                                                                    {
                                                                                                        currencies.length === 0 ?
                                                                                                            <></> :
                                                                                                            <>
                                                                                                                {
                                                                                                                    currencies.map((currency: any) => {
                                                                                                                        return (
                                                                                                                            <>
                                                                                                                                <div className="form-check">
                                                                                                                                    <input className="form-check-input" type="checkbox" checked={selectedCurrency.includes(currency.currency)} name="flexRadioDefault" id={currency.id} onChange={(e) => { if (e.target.checked) { setSelectedCurrency((selectedCurrency: any) => [...selectedCurrency, currency.currency]); } else { removeSelectedCurrency(currency.currency) } }} />
                                                                                                                                    <label className="form-check-label" htmlFor={currency.id}>
                                                                                                                                        {currency.name} - {currency.currency}
                                                                                                                                    </label>
                                                                                                                                </div>
                                                                                                                            </>
                                                                                                                        )
                                                                                                                    })
                                                                                                                }
                                                                                                            </>
                                                                                                    }
                                                                                                </div> :
                                                                                                <></>
                                                                                        }
                                                                                    </div>
                                                                                    <div className={`position-relative ${style.filterDiv}`} ref={acquiredRef}>
                                                                                        <b>Acquired Date</b>
                                                                                        <button onClick={() => { setAcquiredCalendar(!acquiredCalendar) }} className={`w-100 ${style.filterButton} d-flex justify-content-between`}>{inDisplay} <img src={imageHost + '/tax-filters.svg'} alt="" />{acquiredCalendar && <button className='close'>Close</button>}</button>
                                                                                        {acquiredCalendar ?
                                                                                            <DateRange
                                                                                                editableDateInputs={false}
                                                                                                onChange={(item: any) => { setrangeDateAcquired([item.selection]); }}
                                                                                                moveRangeOnFirstSelection={false}
                                                                                                months={1}
                                                                                                ranges={rangeDateAcquired}
                                                                                                direction='horizontal'
                                                                                                className={`calendarElement ${style.calendarEl}`}
                                                                                            /> : <></>
                                                                                        }
                                                                                    </div>
                                                                                    <div className={`position-relative ${style.filterDiv}`} ref={spentRef}>
                                                                                        <b>Spent Date</b>
                                                                                        <button onClick={() => { setSpentCalendar(!spentCalendar) }} className={`w-100 ${style.filterButton} d-flex justify-content-between`}>{outDisplay} <img src={imageHost + '/tax-filters.svg'} alt="" />{spentCalendar && <button className='close'>Close</button>}</button>
                                                                                        {spentCalendar ?
                                                                                            <DateRange
                                                                                                editableDateInputs={false}
                                                                                                onChange={(item: any) => { setrangeDateSpent([item.selection]); }}
                                                                                                moveRangeOnFirstSelection={false}
                                                                                                months={1}
                                                                                                ranges={rangeDateSpent}
                                                                                                direction='horizontal'
                                                                                                className={`calendarElement ${style.calendarEl}`}
                                                                                            /> : <></>
                                                                                        }
                                                                                    </div>
                                                                                    <div className={`position-relative ${style.filterDiv}`} ref={plRef}>
                                                                                        <button className='${style.filterButton}' onClick={() => { setPlDropdown(!plDropdown) }}><img src={imageHost + '/tax-filters.svg'} alt="" />Short/Long Term</button>
                                                                                        {
                                                                                            plDropdown ?
                                                                                                <div className={`${style.plDropdown} position-absolute w-100`}>
                                                                                                    <div className="form-check w-100">
                                                                                                        <input className='form-check-input' type="checkbox" id="short" checked={gainType === 'SHORT_TERM'} onChange={(e) => { if (e.target.checked) { setGainType('SHORT_TERM') } else { setGainType(null) } setPlDropdown(false) }} />
                                                                                                        <label className='form-check-label w-100' htmlFor='short'>Short Term</label>
                                                                                                    </div>
                                                                                                    <div className="form-check w-100">
                                                                                                        <input className='form-check-input' type="checkbox" id="long" checked={gainType === 'LONG_TERM'} onChange={(e) => { if (e.target.checked) { setGainType('LONG_TERM') } else { setGainType(null) } setPlDropdown(false) }} />
                                                                                                        <label className='form-check-label w-100' htmlFor='long'>Long Term</label>
                                                                                                    </div>
                                                                                                </div> :
                                                                                                <></>
                                                                                        }
                                                                                    </div>
                                                                                    <div className={`position-relative ${style.filterDiv}`} ref={accRef}>
                                                                                        <button className={`${style.filterButton}`} onClick={() => { showAccDropdown(!accDropdown) }}><img src={imageHost + '/tax-filters.svg'} alt="" />Accounts</button>
                                                                                        {
                                                                                            accDropdown ?
                                                                                                <div className={`${style.plDropdown} position-absolute w-100`}>
                                                                                                    {
                                                                                                        userAccs.length === 0 ?
                                                                                                            <div>No Connected Accounts</div> :
                                                                                                            <>
                                                                                                                {
                                                                                                                    userAccs.map((acc: any) => {
                                                                                                                        return (
                                                                                                                            <div className="form-check w-100">
                                                                                                                                <input className='form-check-input' type="checkbox" id={acc.account} checked={selectedAcc.includes(acc.account)} onChange={(e) => { if (e.target.checked) { setSelectedAcc(selectedAcc => [...selectedAcc, acc.account]) } else { removeSelectedAccount(acc.account) } }} />
                                                                                                                                <label className='form-check-label w-100' htmlFor={acc.account}>{acc.accountDisplayName}</label>
                                                                                                                            </div>
                                                                                                                        )
                                                                                                                    })
                                                                                                                }
                                                                                                            </>
                                                                                                    }
                                                                                                </div> :
                                                                                                <></>
                                                                                        }
                                                                                    </div>
                                                                                    <div className="w-100 d-flex mt-3 justify-content-center">
                                                                                        <button className={`${style.clear} me-2`} onClick={resetAllFilters}>Clear</button>
                                                                                        <button className={`${style.apply} ms-2`} onClick={() => { setShowFilters(false) }}>Apply</button>
                                                                                    </div>
                                                                                </div> :
                                                                                <></>
                                                                        }

                                                                    </div>

                                                                    {/* MAIN TABLE - DESKTOP*/}

                                                                    <div className={`d-none d-lg-block ${style.analysis} position-relative mt-2 mb-5`} onScroll={(e) => { handleScroll(e) }}>

                                                                        <div className={`${style.headings} position-sticky pt-2 pb-2 w-100 m-auto row`}>
                                                                            {
                                                                                selectedForm === ("FORM1040_SCH_1" || "FORM1040_SCH_C") ?
                                                                                    <>
                                                                                        {
                                                                                            selectedHeaders ?
                                                                                                <>
                                                                                                    <b className="col">{selectedHeaders[0]}</b>
                                                                                                    <b className="col">{selectedHeaders[1]} <button onClick={() => sortingData('dateAcquired')}><img src={imageHost + '/sorting-trans.svg'} /></button></b>
                                                                                                    <b className="col">{selectedHeaders[2]}</b>
                                                                                                    <b className="col">{selectedHeaders[3]}</b>
                                                                                                    <b className="col">Comment</b>
                                                                                                </> :
                                                                                                <></>
                                                                                        }
                                                                                    </> :
                                                                                    <>
                                                                                        {
                                                                                            selectedHeaders ?
                                                                                                <>
                                                                                                    <b className="col">{selectedHeaders[0]}</b>
                                                                                                    <b className="col">{selectedHeaders[1]} <button onClick={() => sortingData('dateAcquired')}><img src={imageHost + '/sorting-trans.svg'} /></button></b>
                                                                                                    <b className="col">{selectedHeaders[2]}</b>
                                                                                                    <b className="col">{selectedHeaders[3]}<br />{selectedHeaders[4]}</b>
                                                                                                    <b className="col">{selectedHeaders[5]} <button onClick={() => sortingData('dateOut')}><img src={imageHost + '/sorting-trans.svg'} /></button></b>
                                                                                                    {
                                                                                                        selectedForm === ('FORM8949' || 'FORM1040_SCH_D') && <b className="col">Gain or loss<button onClick={() => sortingData('gainOrLoss')}><img src={imageHost + '/sorting-trans.svg'} /></button></b>
                                                                                                    }

                                                                                                    <b className="col">Comment</b>
                                                                                                </> :
                                                                                                <></>
                                                                                        }
                                                                                    </>
                                                                            }
                                                                        </div>
                                                                        {
                                                                            viewTxnsLoader ?
                                                                                <div className={`${style.loading} w-100 text-center position-sticky`}><img src={imageHost + '/loader-small.gif'} alt="Loading" /></div> :
                                                                                <></>
                                                                        }

                                                                        {
                                                                            transactions.length === 0 ?
                                                                                <>
                                                                                    <div className="mt-5 text-center">
                                                                                        <img src={imageHost + '/no-transactions-mascot.svg'} alt="" className="img-fluid" />
                                                                                        <p className="mt-3">You do not have any transactions for the the selected criteria</p>
                                                                                    </div>
                                                                                </> :
                                                                                <>
                                                                                    {
                                                                                        transactions.map((transaction: any, index: any) => {
                                                                                            return (
                                                                                                <>
                                                                                                    <div className={`w-100 ${style.transactions} row m-auto pb-3 pt-2`}>
                                                                                                        {
                                                                                                            selectedForm === ("FORM1040_SCH_1" || "FORM1040_SCH_C") ?
                                                                                                                <>

                                                                                                                    <div className="col position-relative">{transaction.coins}<br />{transaction.currency}<br /><button className={`${style.viewId}`} onClick={() => { setViewId(!viewId); setIdClicked(index); }}>View ID</button>
                                                                                                                        {
                                                                                                                            viewId && idClicked === index ?
                                                                                                                                <div ref={idRef} className={`${style.idBox} position-absolute`}>{transaction.description.split(' ')[4]}</div> :
                                                                                                                                <></>
                                                                                                                        }
                                                                                                                    </div>
                                                                                                                    <div className="col">{transaction.dateAcquired ? toUtc(transaction.dateAcquired) : '--'}<br />{transaction.inAccount ? transaction.inAccount : ''}</div>
                                                                                                                    <div className="col">{transaction.txnCategory ? transaction.txnCategory : 'N/A'}</div>
                                                                                                                    <div className="col">{transaction.outPrice === 'N/A' ? 'N/A' : `$${transaction.outPrice ? transaction.outPrice : '--'}`}</div>
                                                                                                                    <div className="col">
                                                                                                                        <button onClick={() => { setIdClicked(index); setShowCommentBox(!showCommentBox); setShowEditSuccess(false); setCharCount(transaction.comment ? transaction.comment.length : 0) }} className={`${style.comment}`}>
                                                                                                                            {transaction.comment ?
                                                                                                                                <OverlayTrigger
                                                                                                                                    placement='bottom'
                                                                                                                                    overlay={
                                                                                                                                        <Tooltip id="popover-contained"><div className={`${style.tooptipComment}`}>{transaction.comment}</div></Tooltip>
                                                                                                                                    }
                                                                                                                                >
                                                                                                                                    <img src={imageHost + '/comment-icon-edited.svg'} alt="" />
                                                                                                                                </OverlayTrigger> :

                                                                                                                                <img src={imageHost + '/comment-icon.svg'} alt="" />
                                                                                                                            }
                                                                                                                        </button></div>
                                                                                                                    {
                                                                                                                        showCommentBox && idClicked === index ?
                                                                                                                            <>
                                                                                                                                <div className="position-relative">
                                                                                                                                    <textarea placeholder='Type Your Message Here' defaultValue={transaction.comment ? transaction.comment : ''} maxLength={100} name="comment" id="" onChange={(e) => { setUserComment(e.target.value); setCharCount(e.target.value.length); }} className={`${style.commentBox} w-100 mt-3`} />
                                                                                                                                    <div className={`${style.wordLimit} position-absolute`}>({charCount}/100)</div>
                                                                                                                                    {
                                                                                                                                        saveCommentLoader ?
                                                                                                                                            <img className={`${style.loader} position-absolute`} src={imageHost + '/loader-small.gif'} alt="loading" /> :
                                                                                                                                            <button className={`${style.save} position-absolute`} onClick={() => { saveComment(userComment, transaction.formTxnId) }}>Save</button>
                                                                                                                                    }

                                                                                                                                    <button onClick={() => { setShowCommentBox(false) }} className={`${style.cross} position-absolute`}><img src={imageHost + '/comment-cross.svg'} alt="close" /></button>
                                                                                                                                </div>
                                                                                                                            </>

                                                                                                                            :
                                                                                                                            <>
                                                                                                                                {
                                                                                                                                    showEditSuccess && idClicked === index ?
                                                                                                                                        <div className={`${style.success} position-relative text-center mt-3`}>your comment has been successfully saved <button onClick={() => { setShowEditSuccess(false) }} className='position-absolute'><img src={imageHost + '/close-success.svg'} alt="" /></button></div> :
                                                                                                                                        <>
                                                                                                                                            {
                                                                                                                                                showEditError && idClicked === index ?
                                                                                                                                                    <div className={`${style.error} position-relative text-center mt-3`}>An error encountered. Please try again <button onClick={() => { setShowEditError(false) }} className='position-absolute'><img src={imageHost + '/cross-icon.png'} alt="" /></button></div> :
                                                                                                                                                    <></>
                                                                                                                                            }
                                                                                                                                        </>
                                                                                                                                }
                                                                                                                            </>
                                                                                                                    }

                                                                                                                </> :
                                                                                                                <>

                                                                                                                    <div className="col position-relative">{transaction.coins}<br />{transaction.currency}<br /><button className={`${style.viewId}`} onClick={() => { setViewId(!viewId); setIdClicked(index); }}>View ID</button>
                                                                                                                        {
                                                                                                                            viewId && idClicked === index ?
                                                                                                                                <div ref={idRef} className={`${style.idBox} position-absolute`}>{transaction.description.split(' ')[4]}</div> :
                                                                                                                                <></>
                                                                                                                        }
                                                                                                                    </div>
                                                                                                                    <div className="col">{transaction.dateAcquired ? toUtc(transaction.dateAcquired) : '--'}<br />{transaction.inAccount ? transaction.inAccount : ''}</div>
                                                                                                                    <div className="col">{transaction.cost === 'N/A' ? 'N/A' : `$${transaction.cost ? transaction.cost : '--'}`}</div>
                                                                                                                    <div className="col">{transaction.outPrice === 'N/A' ? 'N/A' : `$${transaction.outPrice ? transaction.outPrice : '--'}`}</div>
                                                                                                                    <div className="col">{transaction.dateOut ? toUtc(transaction.dateOut) : '--'}<br />{transaction.outAccount ? transaction.outAccount : ''}</div>
                                                                                                                    {
                                                                                                                        selectedForm === ("FORM8949" || "FORM1040_SCH_D") && <div className={transaction.gainOrLoss ? transaction.gainOrLoss.charAt(0) === '-' ? "col loss" : "col gain" : ''}>{transaction.gainOrLoss === 'N/A' ? 'N/A' : `$${transaction.gainOrLoss ? transaction.gainOrLoss : '--'}`}</div>
                                                                                                                    }
                                                                                                                    <div className="col">
                                                                                                                        <button onClick={() => { setIdClicked(index); setShowCommentBox(!showCommentBox); setShowEditSuccess(false); setCharCount(transaction.comment ? transaction.comment.length : 0) }} className={`${style.comment}`}>
                                                                                                                            {transaction.comment ?
                                                                                                                                <OverlayTrigger
                                                                                                                                    placement='bottom'
                                                                                                                                    overlay={
                                                                                                                                        <Tooltip id="popover-contained"><div className={`${style.tooptipComment}`}>{transaction.comment}</div></Tooltip>
                                                                                                                                    }
                                                                                                                                >
                                                                                                                                    <img src={imageHost + '/comment-icon-edited.svg'} alt="" />
                                                                                                                                </OverlayTrigger> :

                                                                                                                                <img src={imageHost + '/comment-icon.svg'} alt="" />
                                                                                                                            }
                                                                                                                        </button></div>
                                                                                                                    {
                                                                                                                        showCommentBox && idClicked === index ?
                                                                                                                            <>
                                                                                                                                <div className="position-relative">
                                                                                                                                    <textarea placeholder='Type Your Message Here' defaultValue={transaction.comment ? transaction.comment : ''} maxLength={100} name="comment" id="" onChange={(e) => { setUserComment(e.target.value); setCharCount(e.target.value.length); }} className={`${style.commentBox} w-100 mt-3`} />
                                                                                                                                    <div className={`position-absolute ${style.wordLimit}`}>({charCount}/100)</div>
                                                                                                                                    {
                                                                                                                                        saveCommentLoader ?
                                                                                                                                            <img className={`${style.loader} position-absolute`} src={imageHost + '/loader-small.gif'} alt="loading" /> :
                                                                                                                                            <button className={`${style.save} position-absolute`} onClick={() => { saveComment(userComment, transaction.formTxnId) }}>Save</button>
                                                                                                                                    }

                                                                                                                                    <button onClick={() => { setShowCommentBox(false) }} className={`${style.cross} position-absolute`}><img src={imageHost + '/comment-cross.svg'} alt="close" /></button>
                                                                                                                                </div>
                                                                                                                            </>

                                                                                                                            :
                                                                                                                            <>
                                                                                                                                {
                                                                                                                                    showEditSuccess && idClicked === index ?
                                                                                                                                        <div className={`${style.success} position-relative text-center mt-3`}>your comment has been successfully saved <button onClick={() => { setShowEditSuccess(false) }} className='position-absolute'><img src={imageHost + '/close-success.svg'} alt="" /></button></div> :
                                                                                                                                        <>
                                                                                                                                            {
                                                                                                                                                showEditError && idClicked === index ?
                                                                                                                                                    <div className={`${style.error} position-relative text-center mt-3`}>An error encountered. Please try again <button onClick={() => { setShowEditError(false) }} className='position-absolute'><img src={imageHost + '/cross-icon.png'} alt="" /></button></div> :
                                                                                                                                                    <></>
                                                                                                                                            }
                                                                                                                                        </>
                                                                                                                                }
                                                                                                                            </>
                                                                                                                    }

                                                                                                                </>
                                                                                                        }


                                                                                                    </div>


                                                                                                </>

                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </>
                                                                        }

                                                                    </div>

                                                                    {/* MAIN TABLE - MOBILE */}

                                                                    <div className={`d-block d-lg-none position-relative mt-2 mb-5 ${style.analysisMobile}`} onScroll={(e) => { handleScroll(e) }}>
                                                                        {
                                                                            viewTxnsLoader ?
                                                                                <div className={`${style.loading} w-100 text-center position-sticky`}><img src={imageHost + '/loader-small.gif'} alt="Loading" /></div> :
                                                                                <></>
                                                                        }
                                                                        {
                                                                            transactions.length !== 0 ?
                                                                                <>
                                                                                    {
                                                                                        transactions.map((transaction: any, index: any) => {
                                                                                            return (
                                                                                                <>
                                                                                                    <div className={`${style.transactionDivMobile} row w-100 m-auto`}>
                                                                                                        {
                                                                                                            selectedForm === ("FORM1040_SCH_1" || "FORM1040_SCH_C") ?
                                                                                                                <>
                                                                                                                    <div className={`${style.col6} col-6`}>Description</div>
                                                                                                                    <div className={`${style.col6} col-6`}>{transaction.coins}<br />{transaction.currency}<br /><b>id :</b> {transaction.description.split(' ')[4]}</div>
                                                                                                                    <div className={`${style.col6} col-6`}>Date Acquired</div>
                                                                                                                    <div className={`${style.col6} col-6`}>{transaction.dateAcquired ? toUtc(transaction.dateAcquired) : '--'}</div>
                                                                                                                    <div className={`${style.col6} col-6`}>Type</div>
                                                                                                                    <div className={`${style.col6} col-6`}>{transaction.txnCategory ? transaction.txnCategory : 'N/A'}</div>
                                                                                                                    <div className={`${style.col6} col-6`}>Fair Market Value</div>
                                                                                                                    <div className={`${style.col6} col-6`}>{transaction.outPrice === 'N/A' ? 'N/A' : `$${transaction.outPrice ? transaction.outPrice : '--'}`}</div>
                                                                                                                    <div className={`${style.col6} col-6`}>
                                                                                                                        <div className={`${style.col6} col-6`}>
                                                                                                                            <button className={`${style.comment}`} onClick={() => { setIdClicked(index); setShowCommentBox(!showCommentBox); setShowEditSuccess(false); setCharCount(transaction.comment ? transaction.comment.length : 0) }}>
                                                                                                                                {transaction.comment ?
                                                                                                                                    <OverlayTrigger
                                                                                                                                        placement='bottom'
                                                                                                                                        overlay={
                                                                                                                                            <Tooltip id="popover-contained">{transaction.comment}</Tooltip>
                                                                                                                                        }
                                                                                                                                    >
                                                                                                                                        <img src={imageHost + '/comment-icon-edited.svg'} alt="" />
                                                                                                                                    </OverlayTrigger> :

                                                                                                                                    <img src={imageHost + '/comment-icon.svg'} alt="" />
                                                                                                                                }
                                                                                                                            </button></div>
                                                                                                                        {
                                                                                                                            showCommentBox && idClicked === index ?
                                                                                                                                <>
                                                                                                                                    <div className="position-relative">
                                                                                                                                        <textarea placeholder='Type Your Message Here' defaultValue={transaction.comment ? transaction.comment : ''} maxLength={100} name="comment" id="" onChange={(e) => { setUserComment(e.target.value); setCharCount(e.target.value.length); }} className={`${style.commentBox} w-100 mt-3`} />
                                                                                                                                        <div className={`${style.wordLimit} position-absolute`}>({charCount}/100)</div>
                                                                                                                                        {
                                                                                                                                            saveCommentLoader ?
                                                                                                                                                <img className={`${style.loader} position-absolute`} src={imageHost + '/loader-small.gif'} alt="loading" /> :
                                                                                                                                                <button className={`${style.save} position-absolute`} onClick={() => { saveComment(userComment, transaction.formTxnId) }}>Save</button>
                                                                                                                                        }
                                                                                                                                        <button onClick={() => { setShowCommentBox(false) }} className={`${style.cross} position-absolute`}><img src={imageHost + '/comment-cross.svg'} alt="close" /></button>
                                                                                                                                    </div>
                                                                                                                                </>

                                                                                                                                :
                                                                                                                                <>
                                                                                                                                    {
                                                                                                                                        showEditSuccess && idClicked === index ?
                                                                                                                                            <div className={`${style.success} text-center mt-3 mb-3 position-relative`}>your comment has been successfully saved <button onClick={() => { setShowEditSuccess(false) }} className='position-absolute'><img src={imageHost + '/close-success.svg'} alt="" /></button></div> :
                                                                                                                                            <></>
                                                                                                                                    }
                                                                                                                                </>
                                                                                                                        }
                                                                                                                    </div>
                                                                                                                </> :
                                                                                                                <>
                                                                                                                    <div className={`${style.col6} col-6`}>{transaction.coins}<br />{transaction.currency}<br /><b>id :</b> {transaction.description.split(' ')[4]}</div>
                                                                                                                    {
                                                                                                                        selectedForm === ("FORM8949" || "FORM1040_SCH_D") ? <div className={transaction.gainOrLoss ? transaction.gainOrLoss.charAt(0) === '-' ? `${style.col6} col-6 loss` : `${style.col6} col-6 gain` : ''}>{transaction.gainOrLoss === 'N/A' ? 'N/A' : `$${transaction.gainOrLoss ? transaction.gainOrLoss : ''}`}</div> :
                                                                                                                            <div className={`${style.col6} col-6`}></div>
                                                                                                                    }

                                                                                                                    <div className={`${style.col6} col-6`}>
                                                                                                                        <b>Cost or Other Basis</b><br />
                                                                                                                        <span>{transaction.dateAcquired ? toUtc(transaction.dateAcquired) : '--'}</span>
                                                                                                                    </div>
                                                                                                                    <div className={`${style.col6} col-6`}>{transaction.cost === 'N/A' ? 'N/A' : `$${transaction.cost ? transaction.cost : '--'}`}</div>
                                                                                                                    <div className={`${style.col6} col-6`}>
                                                                                                                        <b>{selectedHeaders[3]} {selectedHeaders[4]}</b><br />
                                                                                                                        <span>{transaction.dateOut ? toUtc(transaction.dateOut) : '--'}</span>
                                                                                                                    </div>
                                                                                                                    <div className={`${style.col6} col-6`}>{transaction.outPrice === 'N/A' ? 'N/A' : `$${transaction.outPrice ? transaction.outPrice : '--'}`}</div>
                                                                                                                    <div className={`${style.col6} col-6`}><b>Comment</b></div>
                                                                                                                    <div className={`${style.col6} col-6`}>
                                                                                                                        <button className={`${style.comment}`} onClick={() => { setIdClicked(index); setShowCommentBox(!showCommentBox); setShowEditSuccess(false); setCharCount(transaction.comment ? transaction.comment.length : 0) }}>
                                                                                                                            {transaction.comment ?
                                                                                                                                <OverlayTrigger
                                                                                                                                    placement='bottom'
                                                                                                                                    overlay={
                                                                                                                                        <Tooltip id="popover-contained">{transaction.comment}</Tooltip>
                                                                                                                                    }
                                                                                                                                >
                                                                                                                                    <img src={imageHost + '/comment-icon-edited.svg'} alt="" />
                                                                                                                                </OverlayTrigger> :

                                                                                                                                <img src={imageHost + '/comment-icon.svg'} alt="" />
                                                                                                                            }
                                                                                                                        </button></div>
                                                                                                                    {
                                                                                                                        showCommentBox && idClicked === index ?
                                                                                                                            <>
                                                                                                                                <div className="position-relative">
                                                                                                                                    <textarea placeholder='Type Your Message Here' defaultValue={transaction.comment ? transaction.comment : ''} maxLength={100} name="comment" id="" onChange={(e) => { setUserComment(e.target.value); setCharCount(e.target.value.length); }} className={`${style.commentBox} w-100 mt-3`} />
                                                                                                                                    <div className={`${style.wordLimit} position-absolute`}>({charCount}/100)</div>
                                                                                                                                    {
                                                                                                                                        saveCommentLoader ?
                                                                                                                                            <img className={`${style.loader} position-absolute`} src={imageHost + '/loader-small.gif'} alt="loading" /> :
                                                                                                                                            <button className={`${style.save} position-absolute`} onClick={() => { saveComment(userComment, transaction.formTxnId) }}>Save</button>
                                                                                                                                    }
                                                                                                                                    <button onClick={() => { setShowCommentBox(false) }} className={`${style.cross} position-absolute`}><img src={imageHost + '/comment-cross.svg'} alt="close" /></button>
                                                                                                                                </div>
                                                                                                                            </>

                                                                                                                            :
                                                                                                                            <>
                                                                                                                                {
                                                                                                                                    showEditSuccess && idClicked === index ?
                                                                                                                                        <div className={`${style.success} text-center mt-3 mb-3 position-relative`}>your comment has been successfully saved <button onClick={() => { setShowEditSuccess(false) }} className='position-absolute'><img src={imageHost + '/close-success.svg'} alt="" /></button></div> :
                                                                                                                                        <></>
                                                                                                                                }
                                                                                                                            </>
                                                                                                                    }
                                                                                                                </>
                                                                                                        }

                                                                                                    </div>
                                                                                                </>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </> :
                                                                                <>
                                                                                    <div className="mt-5 text-center">
                                                                                        <img src={imageHost + '/no-transactions-mascot.svg'} alt="" className="img-fluid" />
                                                                                        <p className="mt-3">You do not have any transactions for the the selected criteria</p>
                                                                                    </div>
                                                                                </>
                                                                        }

                                                                    </div>
                                                                </div>
                                                            </>
                                                            :
                                                            <>
                                                                {
                                                                    invalidPlan ?
                                                                        <>
                                                                            <div className="text-center mt-5 mb-5">
                                                                                <img className='img-fluid' src={imageHost + '/mascot-upgrade.svg'} alt="" />
                                                                                <div className="mt-3 text-center">{invalidErr}</div>
                                                                                {showUpgradePlan &&
                                                                                    <button onClick={() => { router.push('/plans') }} className={`mt-3 ${style.planBtn}`}>Change Plan</button>
                                                                                }
                                                                                {
                                                                                    showAddOnBtn &&
                                                                                    <button onClick={() => { router.push('/add-on') }} className={`mt-3 ${style.viewSummary}`}>Buy Add On</button>
                                                                                }
                                                                            </div>
                                                                        </> :
                                                                        <>
                                                                            {
                                                                                showNoAccErr ?
                                                                                    <>
                                                                                        <div className="text-center mt-5 mb-5">
                                                                                            <img src={imageHost + '/add-account-mascot.svg'} alt="" />
                                                                                            <div>Please add the account to Generate the Tax summary</div>
                                                                                            <button onClick={() => { router.push('/add-account') }} className={`mt-3 ${style.viewSummary}`}>Add Account</button>
                                                                                        </div>
                                                                                    </> :
                                                                                    <>
                                                                                        {
                                                                                            showErr ?
                                                                                                <>
                                                                                                    <div className="mt-5 text-center mb-5">
                                                                                                        <img className='img-fluid' src={imageHost + '/raised-hands-mascot.svg'} alt="" />
                                                                                                        <p className='mt-3'>Some Error Came Up. Please Try Again</p>
                                                                                                    </div>
                                                                                                </> :
                                                                                                <div className="mt-5 text-center mb-5">
                                                                                                    <img className='img-fluid' src={imageHost + '/raised-hands-mascot.svg'} alt="" />
                                                                                                    <p className='mt-3'>You can check your transactions report by selecting Year, calculation method and form
                                                                                                        and clicking on View Transaction Button.</p>
                                                                                                </div>
                                                                                        }

                                                                                    </>
                                                                            }
                                                                        </>
                                                                }




                                                            </>
                                                    }
                                                </> :
                                                <>
                                                </>
                                        }
                                        <hr className='mt-5' />
                                        <div className={`${style.taxFooter} mt-5`}>
                                            <b>Found our tax analysis tool helpful? Check out our other products</b>
                                            <div className={`${style.products} d-none d-md-flex`}>
                                                <div className='text-center me-2 position-relative'>
                                                    <img src={imageHost + '/tax-footer-img1.svg'} alt="" className="img-fluid position-absolute" />
                                                    <p className={`${style.productName}`}>confused about your next investment?</p>
                                                    <p className={`${style.description}`}>
                                                        Try our AI/ML based investment strategies tailored specifically for you and save big</p>
                                                    <button onClick={() => { router.push('/investment-strategies'); window.scrollTo(0, 0); }}>Explore</button>
                                                </div>
                                                <div className='text-center ms-1 me-1 position-relative'>
                                                    <img src={imageHost + '/tax-footer-img2.svg'} alt="" className="img-fluid position-absolute" />
                                                    <p className={`${style.productName}`}>Want to see the real time portfolio performance?</p>
                                                    <p className={`${style.description}`}>Checkout our portfolio manager which tracks your crypto assets and performance</p>
                                                    <button onClick={() => { router.push('/users-portfolio'); window.scrollTo(0, 0); }}>Explore</button>
                                                </div>
                                                <div className='text-center ms-2 position-relative'>
                                                    <img src={imageHost + '/tax-footer-img3.svg'} alt="" className="img-fluid position-absolute" />
                                                    <p className={`${style.productName}`}>Pay By Crypto</p>
                                                    <p className={`${style.description}`}>spend crypto at your favorite outlets through our secure, fast and affordable payment gateway</p>
                                                    <button onClick={() => { router.push('/pay-by-crypto'); window.scrollTo(0, 0); }}>Explore</button>
                                                </div>
                                            </div>
                                            <div className={`${style.productsMobile} d-block d-md-none`}>
                                                <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel" data-bs-interval="10000">
                                                    <div className={`${style.carouselInner} carousel-inner`}>
                                                        <div className="carousel-item active">
                                                            <div className={`text-center me-2 position-relative ${style.productDiv}`}>
                                                                <img src={imageHost + '/tax-footer-img1.svg'} alt="" className="img-fluid position-absolute" />
                                                                <p className={`${style.productName}`}>confused about your next investment?</p>
                                                                <p className={`${style.description}`}>
                                                                    Try our AI/ML based investment strategies tailored specifically for you and save big</p>
                                                                <button onClick={() => { router.push('/investment-strategies'); window.scrollTo(0, 0); }}>Explore</button>
                                                            </div>
                                                        </div>
                                                        <div className="carousel-item">
                                                            <div className={`text-center ms-1 me-1 position-relative ${style.productDiv}`}>
                                                                <img src={imageHost + '/tax-footer-img2.svg'} alt="" className="img-fluid position-absolute" />
                                                                <p className={`${style.productName}`}>Want to see the real time portfolio performance?</p>
                                                                <p className={`${style.description}`}>Checkout our portfolio manager which tracks your crypto assets and performance</p>
                                                                <button onClick={() => { router.push('/users-portfolio'); window.scrollTo(0, 0); }}>Explore</button>
                                                            </div>
                                                        </div>
                                                        <div className="carousel-item">
                                                            <div className={`text-center ms-2 position-relative ${style.productDiv}`}>
                                                                <img src={imageHost + '/tax-footer-img3.svg'} alt="" className="img-fluid position-absolute" />
                                                                <p className={`${style.productName}`}>Pay By Crypto</p>
                                                                <p className={`${style.description}`}>spend crypto at your favorite outlets through our secure, fast and affordable payment gateway</p>
                                                                <button onClick={() => { router.push('/pay-by-crypto'); window.scrollTo(0, 0); }}>Explore</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                        <span className="visually-hidden">Previous</span>
                                                    </button>
                                                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                        <span className="visually-hidden">Next</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            }
                        </>
                }
                <div className='d-none d-lg-block'>
                    <RightFeed />
                </div>
            </div>
        </>
    )


}

export default TaxAnalysis