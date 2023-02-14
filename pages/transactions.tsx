import React, { useEffect, useState } from 'react'
import MainService from '../services/main-service';
import mainServiceClient from '../services/main-serviceClient';
import nookies from 'nookies';
import check401 from '../components/401-check';
import style from '../styles/transactions/transactions.module.scss';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useRouter } from 'next/router';
import getCurrencies from '../components/getCurrencies';
import DateTimePicker from 'react-datetime-picker';
import { format } from 'date-fns';
import getCategories from '../components/getCategories';
import { DateRange } from 'react-date-range';
import "react-datepicker/dist/react-datepicker.css";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import LeftFeed from '../components/shared/left-feed';
import getInsideAllPromiseFunction from '../components/getInsideAllServerPromise';
import getCurrenturl from '../components/currentUrlCheck';

let mainservice: any = MainService("get");

function getTxns(tokens: any) {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await mainservice('get/txns', 'ups', null, tokens);
            resolve(res.data)
        }
        catch (e: any) {
            reject(e);
        }
    })
}



function userAccs(tokens: any | null) {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await mainservice('user/accounts', 'ups', null, tokens);
            resolve(res.data);
        }
        catch (e: any) {
            reject(e)
        }
    })
}

async function getData(tokens: any, context: any, fnsArr: any[]) {
    let subscriptions: any;
    let getTxnsRes: any;
    let userAccs: any;
    let storePromise = await getInsideAllPromiseFunction(tokens, context, fnsArr)
    console.log("StorePromise props");
    console.log(storePromise.props);
    if (storePromise.props) {
        storePromise.props.forEach((ele: any, i: any) => {
            if (i === 0) {
                getTxnsRes = ele.value
            } else {
                userAccs = ele.value
            }

        })
        return {
            props: {
                getTxnsRes: getTxnsRes,
                userAccsRes: userAccs,
                accessTokens: tokens
            }
        }
    }
    return storePromise
}

export async function getServerSideProps(context: any) {
    const cookies = nookies.get(context);
    getCurrenturl(context);
    let fnsArr = [getTxns, userAccs]
    let storePromise = await getData(cookies.accessTokens, context, fnsArr)
    return storePromise
}

function Transactions(props: any) {
    let getTxnErr: any = null;
    let clientSidePost: any = mainServiceClient("post");
    let clientSideGet: any = mainServiceClient("get");
    const router = useRouter()
    let isLogin: any = MainService("isLogin");
    var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;
    let defaultTxnsCounts = {
        allTransactionsCount: 0, depositCount: 0, needsReviewTxnCount: 0, pendingCount: 0, tradeCount: 0, userUpdatedTxnCount: 0, withdrawalCount: 0
    }
    const [check, setCheck] = useState<any>();
    const [searchFilter, setSearch] = useState("");
    const [editClicked, setEditClicked] = useState(false);
    const [openEditDropdown, setOpenDropdown] = useState(false);
    const [clicked, setClicked] = useState('');
    const [accountId, setId] = useState<any>();
    const [newDate, setNewDate] = useState<any>(null);
    const [newCategory, setNewCategory] = useState<any>(null);
    const [txnCounts, setTxnCounts] = useState<any>(defaultTxnsCounts);
    const [connectedAccs, setConnectedAccs] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [allTypes, setAllTypes] = useState([]);
    useEffect(() => {
        setTxnCounts(props.getTxnsRes.transactionCounts);
        setConnectedAccs(props.userAccsRes.allConnectedAccounts);
        setTransactions(props.getTxnsRes.userTxnResponse);
        setAllTypes(props.getTxnsRes.txnCategories)
    }, [])
    const [reload, setReload] = useState(false);
    const [searchedInCurrency, setSearchedInCurrency] = useState<any[]>([]);
    const [searchedCurrency, setSearchedCurrency] = useState<any[]>([]);
    const [currencyDropdown, setCurrencyDropdown] = useState(false);
    const [inDropdown, setInDropdown] = useState(false);
    const [inCurrency, setInCurrency] = useState<any>(null);
    const [selectedAccs, setSelectedAccs] = useState<any[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<any>(null);
    const [selectedSource, setSelectedSource] = useState<any[]>([]);
    const [selectedType, setSelectedType] = useState<any>(null);
    const [outCurrency, setOutCurrency] = useState<any>(null);
    const [nativeAmount, setNativeAmount] = useState<any>(null);
    const [showNativeWarning, setShowNativeWarning] = useState(false);
    const [showErr, setShowErr] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [showPopUp, setShowPopUp] = useState(false);
    const [switchTradePop, setSwitchTradePop] = useState(false);
    const [switchCurrency, setSwitchCurrency] = useState(null);
    const [showNextPage, setShowNextPage] = useState(false);
    const [swapTradePop, setSwapTradePop] = useState(false);
    const [swapCurrency, setSwapCurrency] = useState(null);
    const [mappedLoader, setMappedLoader] = useState(false);
    const [orderaccount, setorderaccount] = useState("ASC");
    const [orderCategory, setorderCategory] = useState("ASC");
    const [orderDate, setorderDate] = useState("DSC");
    const [allMappedTransactions, setAllMappedTransactions] = useState<any[]>([]);
    const [saveLoader, showSaveLoader] = useState(false);
    const [mappedUnique, setMapped] = useState<any>(null);
    const [enableSave, setEnableSave] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [gettingTypesLoader, setGettingTypesLoader] = useState(false);
    const [purple, setPurple] = useState('transactions');
    const [userReview, setUserReview] = useState<any>(null);
    const [isUpdated, setIsUpdated] = useState<any>(null);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [saveEditsLoader, setSaveEditsLoader] = useState(false);
    const [rangeDate, setrangeDate] = useState<any[]>([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const [dateLabel, setdateLabel] = useState("Select Date Range");
    const [mainTableLoader, setMainTableLoader] = useState(false);
    const [lastEvalKey, setLastEvalKey] = useState<any>(null);
    const [selectedMainType, setSelectedMainType] = useState('All Transactions');
    const [mainTypeImg, setMainTypeImg] = useState("/total-transaction.svg");
    const [openTypesDropdown, setOpenTypesDropdown] = useState(false);
    const [openFiltersBox, setOpenFiltersBox] = useState(false);
    let allFilters: any[] = [];

    function isDateSame() {
        return format(rangeDate[0].startDate, 'yyyy-MM-dd') === format(rangeDate[0].endDate, 'yyyy-MM-dd')
    }

    useEffect(() => {
        setdateLabel(`${format(rangeDate[0].startDate, 'yyyy-MM-dd')} to ${format(rangeDate[0].endDate, 'yyyy-MM-dd')}`);
    }, [rangeDate]);

    console.log(dateLabel);

    let mainResObj = {
        accounts: selectedAccs.length === 0 ? null : selectedAccs,
        txnCategories: selectedCategories.length === 0 ? null : selectedCategories,
        txnStatus: selectedStatus,
        createdBy: selectedSource.length === 0 ? null : selectedSource,
        txnTypes: selectedType,
        userReviewExist: userReview,
        userUpdated: isUpdated,
        startDate: isDateSame() ? null : format(rangeDate[0].startDate, 'yyyy-MM-dd'),
        endDate: isDateSame() ? null : format(rangeDate[0].endDate, 'yyyy-MM-dd')
    }

    let mainResObjNext = {
        accounts: selectedAccs.length === 0 ? null : selectedAccs,
        txnCategories: selectedCategories.length === 0 ? null : selectedCategories,
        txnStatus: selectedStatus,
        createdBy: selectedSource.length === 0 ? null : selectedSource,
        txnTypes: selectedType,
        userReviewExist: userReview,
        userUpdated: isUpdated,
        startDate: isDateSame() ? null : format(rangeDate[0].startDate, 'yyyy-MM-dd'),
        endDate: isDateSame() ? null : format(rangeDate[0].endDate, 'yyyy-MM-dd'),
        lastEvaluatedKeys: lastEvalKey
    }

    function clearAllFilters() {
        // EXCEPT DATE FILTER
        setSelectedAccs([]);
        setSelectedCategories([]);
        setSelectedStatus(null);
        setSelectedSource([]);
    }

    let updateTxnArr: any = [];

    if (inCurrency && !outCurrency) {
        updateTxnArr = [
            {
                "direction": "RECEIVED",
                "currency": inCurrency
            }
        ]
    }
    else if (!inCurrency && outCurrency) {
        updateTxnArr = [
            {
                "direction": "SENT",
                "currency": outCurrency,
            }
        ]
    }
    else {

        updateTxnArr = [
            {
                "direction": "RECEIVED",
                "currency": inCurrency

            },
            {
                "direction": "SENT",
                "currency": outCurrency

            }
        ]
    }
    if (!inCurrency && !outCurrency) {
        updateTxnArr = null;
    }

    let editObj = {}

    if (newCategory === 'SWAP_TRADE_INWARD' && !mappedUnique) {
        editObj = {
            "uniqueTxnId": accountId,
            "userTxnCategory": newCategory,
            "nativeAmount": nativeAmount,
            "mappedUniqueTxnId": mappedUnique,
            "userTxnDate": newDate ? newDate + ':00Z' : null,
            "currencies": updateTxnArr,
            "swapOutwardCurrency": {
                "amount": null,
                "swapOutwardCurrency": swapCurrency
            }
        }
    }
    else {
        editObj = {
            "uniqueTxnId": accountId,
            "userTxnCategory": newCategory,
            "nativeAmount": nativeAmount,
            "mappedUniqueTxnId": mappedUnique,
            "userTxnDate": newDate ? newDate + ':00Z' : null,
            "currencies": updateTxnArr,
            "swapOutwardCurrency": null
        }
    }

    async function getFilteredTxns() {
        setMainTableLoader(true);
        try {
            let res = await clientSidePost('/api/v1/transactions/getTransactions', mainResObj, null);
            setMainTableLoader(false);
            console.log(res);
            setTransactions(res.data.userTxnResponse);
            setLastEvalKey(res.data.lastEvaluatedKeys);
        }
        catch (e: any) {
            setMainTableLoader(false);
            console.log(e);
        }
    }

    async function getNextTxns() {
        setMainTableLoader(true);
        try {
            let res = await clientSidePost('/api/v1/transactions/getTransactions', mainResObjNext, null);
            setMainTableLoader(false);
            console.log(res);
            let incomingTxns = res.data.userTxnResponse;
            let mergedTxns = [...transactions, ...incomingTxns];
            setTransactions(mergedTxns);
            setLastEvalKey(res.data.lastEvaluatedKeys);
        }
        catch (e: any) {
            setMainTableLoader(false);
            console.log(e);
        }
    }

    // Sorting data
    const sortingData = (data: any) => {
        cancelEdit();
        // For account
        if (data === "account" && orderaccount === "ASC") {
            const sorted = [...transactions].sort((a: any, b: any) =>
                a[data].toLowerCase() > b[data].toLowerCase() ? 1 : -1
            );
            setorderaccount("DSC");
            setTransactions(sorted);
        }
        if (data === "account" && orderaccount === "DSC") {
            const sorted = [...transactions].sort((a: any, b: any) =>
                a[data].toLowerCase() < b[data].toLowerCase() ? 1 : -1
            );
            setorderaccount("ASC");
            setTransactions(sorted);
        }

        // For txns category
        if (data === "txnCategory" && orderCategory === "ASC") {
            const sorted = [...transactions].sort((a: any, b: any) =>
                a[data].toLowerCase() > b[data].toLowerCase() ? 1 : -1
            );
            setorderCategory("DSC");
            setTransactions(sorted);
        }
        if (data === "txnCategory" && orderCategory === "DSC") {
            const sorted = [...transactions].sort((a: any, b: any) =>
                a[data].toLowerCase() < b[data].toLowerCase() ? 1 : -1
            );
            setorderCategory("ASC");
            setTransactions(sorted);
        }

        // For txns date
        if (data === "txnDate" && orderDate === "ASC") {
            const sorted = [...transactions].sort((a: any, b: any) =>
                a[data].toLowerCase() > b[data].toLowerCase() ? 1 : -1
            );
            setorderDate("DSC");
            setTransactions(sorted);
        }
        if (data === "txnDate" && orderDate === "DSC") {
            const sorted = [...transactions].sort((a: any, b: any) =>
                a[data].toLowerCase() < b[data].toLowerCase() ? 1 : -1
            );
            setorderDate("ASC");
            setTransactions(sorted);
        }
    }

    function convertToDisplay(categoryName: string) {
        let displayedName: string = '';
        allTypes.map((typeObj: any) => {
            if (typeObj.name === categoryName)
                displayedName = typeObj.displayName;
        })
        if (displayedName === '') {
            if (categoryName === "SELF_TRANSFER_OUTWARD")
                return 'Self Transfer'
            else {
                if (categoryName === 'SWITCH_TRADE_OUTWARD')
                    return 'Switch Trade'
                else
                    return categoryName
            }
        }
        else {
            return displayedName
        }
    }

    function toUtc(date: any) {
        let dateObj = new Date(date).toUTCString();
        let temp = dateObj.split(" ");
        return temp[2] + " " + temp[1] + ", " + temp[3] + " " + temp[4];
    }

    function checkParts(part: any[], txnType: any) {
        type partsType = {
            nativeAmount: any,
            nativeCurrency: any,
            userNativeAmount: any
        }
        let x: partsType | null = { nativeAmount: 0, nativeCurrency: '', userNativeAmount: 0 }
        for (let i = 0; i < part.length; i++) {
            let el = part[i];
            if (txnType === "TRADE") {
                if (el.direction === "SENT" && el.nativeCurrencyAndAmount.USD) {
                    x = el.nativeCurrencyAndAmount.USD;
                    break;
                }
                else if (el.direction === "RECEIVED" && el.nativeCurrencyAndAmount.USD) {
                    x = el.nativeCurrencyAndAmount.USD
                }
            }
            else if (el.nativeCurrencyAndAmount.USD) {
                x = el.nativeCurrencyAndAmount.USD
            }
            else if (el.currency === "USD") {
                x = null
            }
        }
        return x;
    }

    function displayNativeAmount(transaction: any) {
        return checkParts(transaction.parts, transaction.txnType)?.userNativeAmount !== null ? checkParts(transaction.parts, transaction.txnType)?.userNativeAmount.toFixed(2) : checkParts(transaction.parts, transaction.txnType)?.nativeAmount.toFixed(2)
    }

    async function getInCurrencies(crypto: any) {
        let url = "search/currency/" + crypto;
        try {
            let res: any = await getCurrencies(crypto, props.accessTokens);
            setSearchedInCurrency(res.currencies)
            console.log(res.currencies);
        }
        catch (e: any) {
            console.log(e);
        }
    }

    async function getOutCurrencies(crypto: any) {
        let url = "search/currency/" + crypto;
        try {
            let res: any = await getCurrencies(crypto, props.accessTokens);
            setSearchedCurrency(res.currencies)
            console.log(res.currencies);
        }
        catch (e: any) {
            console.log(e);
        }
    }

    function closeDropdowns(dropdownClicked: string) {
        if (dropdownClicked === 'type') {
            setInDropdown(false);
            setCurrencyDropdown(false);
        }
        if (dropdownClicked === 'inAmount') {
            setOpenDropdown(false);
            setCurrencyDropdown(false);
        }
        if (dropdownClicked === 'outAmount') {
            setOpenDropdown(false);
            setInDropdown(false);
        }
        if (dropdownClicked === 'calender') {
            setOpenDropdown(false);
            setInDropdown(false);
            setCurrencyDropdown(false);
        }
    }

    function cancelEdit() {
        setEditClicked(false);
        setClicked('cancel');
        setNewCategory(null);
        setNewDate(null);
        setNativeAmount(null);
        setInCurrency(null);
        setOutCurrency(null);
        setSearchedCurrency([]);
        setInDropdown(false);
        setCurrencyDropdown(false);
        setOpenDropdown(false);
        setSearchedInCurrency([]);
        setShowNativeWarning(false);
    }

    async function getMappedTxn(cat: any) {
        setMappedLoader(true);
        let mappedTxnObj = {}
        if (cat === 'SWITCH_TRADE_INWARD') {
            mappedTxnObj = {
                "txnDate": newDate ? newDate.replace(' ', 'T') + 'Z' : null,
                "currency": switchCurrency,
                "userTxnCategory": cat,
                "uniqueTxnId": accountId
            }
        }
        else {
            if (cat === 'SWAP_TRADE_INWARD' || cat === 'SWAP_TRADE_OUTWARD') {
                mappedTxnObj = {
                    "txnDate": newDate ? newDate.replace(' ', 'T') + 'Z' : null,
                    "currency": swapCurrency,
                    "userTxnCategory": cat,
                    "uniqueTxnId": accountId
                }
            }
            else {
                mappedTxnObj = {
                    "txnDate": newDate ? newDate.replace(' ', 'T') + 'Z' : null,
                    "currency": inCurrency,
                    "userTxnCategory": cat,
                    "uniqueTxnId": accountId
                }
            }
        }
        showSaveLoader(true);
        try {
            let res = await clientSidePost('/api/v1/transactions/mappedTxns', mappedTxnObj, null);
            setMappedLoader(false);
            showSaveLoader(false);
            console.log(res);
            setAllMappedTransactions(res.data.mappedTxns);
        }
        catch (e: any) {
            setMappedLoader(false);
            showSaveLoader(false);
            console.log(e);
        }
    }

    async function saveEdits() {
        setSaveEditsLoader(true);
        try {
            let res = await clientSidePost('/api/v1/transactions/saveEdits', editObj, null);
            setSaveEditsLoader(false);
            console.log(res);
            setShowErr(false);
            setShowSuccess(true);
            setShowNativeWarning(false);
            transactions.map((transaction: any) => {
                if (transaction.uniqueAccountNameAndTxnId === res.data.userTxns[0].uniqueAccountNameAndTxnId) {
                    transactions.splice(transactions.indexOf(transaction), 1, res.data.userTxns[0]);

                }
                if (res.data.userTxns.length > 1) {
                    if (res.data.userTxns[1]) {
                        if (transaction.uniqueAccountNameAndTxnId === res.data.userTxns[1].uniqueAccountNameAndTxnId) {
                            transactions.splice(transactions.indexOf(transaction), 1, res.data.userTxns[1]);

                        }
                    }
                }
            })
            setReload(!reload);
        }
        catch (e: any) {
            setSaveEditsLoader(false);
            setShowNativeWarning(false);
            console.log(e);
        }
    }

    function nameToDisplayName(categoryArray: any[]) {
        allTypes.map((typeObj: any) => {
            if (categoryArray.includes(typeObj.name)) {
                if (!categories.includes(typeObj))
                    setCategories(categories => [...categories, typeObj]);
            }
        })
    }

    async function searchCategory(cat: any) {
        setGettingTypesLoader(true);
        try {
            let res: any = await getCategories(cat, props.accessTokens);
            console.log(res);
            nameToDisplayName(res.txnCategories);
            setGettingTypesLoader(false);
        }
        catch (e: any) {
            console.log(e);
            setGettingTypesLoader(false);
        }
    }

    console.log(categories);

    const handleScroll = (event: any) => {
        const { scrollHeight, scrollTop, clientHeight } = event.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 1) {

            console.log("Reached Bottom");
            if (lastEvalKey)
                getNextTxns();

        }
    }

    useEffect(() => {
        getFilteredTxns();
    }, [selectedAccs, selectedCategories, selectedStatus, selectedSource, reload, selectedType, userReview, isUpdated]);

    // SETTING FILTERS

    if (selectedAccs.length !== 0) {
        selectedAccs.map((acc: any) => {
            allFilters.push(acc);
        })
    }
    if (selectedCategories.length !== 0) {
        selectedCategories.map((cat: any) => {
            allFilters.push(cat);
        })
    }
    if (selectedStatus)
        allFilters.push(selectedStatus);

    if (selectedSource.length !== 0) {
        selectedSource.map((source: any) => {
            allFilters.push(source);
        })
    }

    // FUNCTION TO REMOVE SPECIFIC FILTERS

    function removeFilter(filter: any) {
        if (selectedAccs.includes(filter)) {
            selectedAccs.splice(selectedAccs.indexOf(filter), 1);
            setReload(!reload);
        }

        if (selectedCategories.includes(filter)) {
            selectedCategories.splice(selectedCategories.indexOf(filter), 1);
            setReload(!reload);
        }

        if (selectedSource.includes(filter)) {
            selectedSource.splice(selectedSource.indexOf(filter), 1);
            setReload(!reload);
        }

        if (filter === selectedStatus)
            setSelectedStatus(null);
    }

    console.log(format(rangeDate[0].startDate, 'yyyy-MM-dd'));

    return (
        <>
            {
                showPopUp ?
                    <>
                        <div className={`${style.black} position-fixed`}></div>
                        <div className={`${style.popUp} position-fixed`}>
                            <b className={`${style.title}`}>Please select matching Outgoing Transaction</b>
                            <div className={`row ${style.headings} mt-3 pt-3`}>
                                <b className="col-3">Exchange</b>
                                <b className="col-3">Type</b>
                                <b className="col-3">Date</b>
                                <b className="col-3">In Amount</b>
                            </div>
                            {
                                mappedLoader ?
                                    <><div className={`${style.loader} mt-5 w-100 text-center`}><img src={imageHost + '/loader-small.gif'} alt="" /></div></> :
                                    <>
                                        {
                                            allMappedTransactions ?
                                                <>
                                                    {
                                                        allMappedTransactions.length === 0 ?
                                                            <>
                                                                <div className={`${style.mappedTxn} mt-4 text-center`}>
                                                                    No Transactions to show
                                                                </div>
                                                            </> :
                                                            <>
                                                                {
                                                                    allMappedTransactions.map((transaction: any) => {
                                                                        return (
                                                                            <>
                                                                                <div className={`form-check position-relative ${style.mappedTxnsRows}`}>
                                                                                    <input className={`form-check-input position-absolute ${style.checkBox}`} type="checkbox" name="" id={transaction.uniqueAccountNameAndTxnId} onChange={(e) => { if (e.target.checked) { setMapped(transaction.uniqueAccountNameAndTxnId) } else { setMapped(null) } }} />
                                                                                    <label htmlFor={transaction.uniqueAccountNameAndTxnId} className="form-check-label w-100">
                                                                                        <div className={`row ${style.mappedTxn}`}>
                                                                                            <div className="col-3"><img className={`me-2 ${style.accountImage}`} src={imageHost + "/exchanges/" + transaction.accountDetails.accountNameInLC + ".png?v=1"} alt="" />{transaction.accountDetails.accountDisplayName}</div>
                                                                                            <div className="col-3">{transaction.userTxnCategory ? transaction.userTxnCategory : transaction.txnCategory}</div>
                                                                                            <div className="col-3">{transaction.userTxnDate ? toUtc(transaction.userTxnDate) : toUtc(transaction.txnDate)}</div>
                                                                                            <div className="col-3">{transaction.parts[0].amount}{transaction.parts[0].currency}</div>
                                                                                        </div>
                                                                                    </label>
                                                                                </div>

                                                                            </>
                                                                        )
                                                                    })
                                                                }
                                                            </>
                                                    }
                                                </> :
                                                <></>
                                        }

                                    </>
                            }
                            <div className="d-flex justify-content-center w-100 mt-5">
                                <button type="button" className={`${style.save} me-2`} disabled={!mappedUnique} onClick={() => { saveEdits(); setShowPopUp(false); }}>Save</button>
                                <button type="button" className={`${style.cancel} ms-1`} onClick={() => { setShowPopUp(false); cancelEdit(); }}>Cancel</button>
                            </div>
                        </div>
                    </> :
                    <></>
            }
            {
                switchTradePop ?
                    <>
                        <div className={`${style.black} position-fixed`}></div>
                        <div className={`${style.popUp} position-fixed`}>
                            {
                                !showNextPage ?
                                    <>
                                        <div className={`${style.firstPage}`}>
                                            <b className={`${style.title}`}>Please select Switch Currency</b>
                                            <div className='mt-5'>
                                                <p><b>Search Currency</b></p>
                                                <input className={`${style.searchCurrency}`} type="text" name="search-currency" id="currency-input" placeholder='Search Currency' onChange={(e) => { getInCurrencies(e.target.value) }} value={switchCurrency === '' ? inCurrency : switchCurrency} />
                                                {
                                                    searchedInCurrency.length === 0 ?
                                                        <></> :
                                                        <>
                                                            <div className={`${style.currencies}`} id='select-currency-dropdown'>
                                                                {
                                                                    searchedInCurrency.map((currency: any) => {
                                                                        return (
                                                                            <div><button onClick={() => { setSwitchCurrency(currency.currency); setSearchedInCurrency([]); }}>{currency.currency} - {currency.name}</button></div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </>
                                                }
                                                <p className='mt-4'>You can skip this by clicking on next</p>
                                            </div>
                                            <div className="d-flex w-100 justify-content-center">
                                                <button className={`mt-4 ${style.save}`} onClick={() => { setShowNextPage(true); getMappedTxn('SWITCH_TRADE_INWARD'); }}>Next</button>
                                                <button type="button" className={`${style.cancel} ms-1 mt-4`} onClick={() => { setSwitchTradePop(false); cancelEdit(); }}>Cancel</button>
                                            </div>

                                        </div>
                                    </> :
                                    <>
                                        <div className={`${style.secondPage}`}>
                                            <b className={`${style.title}`}>Please select matching Incoming Transaction</b>
                                            <div className={`row ${style.headings} mt-3 pt-3`}>
                                                <b className="col-3">Exchange</b>
                                                <b className="col-3">Type</b>
                                                <b className="col-3">Date</b>
                                                <b className="col-3">In Amount</b>
                                            </div>
                                            {
                                                mappedLoader ?
                                                    <><div className={`${style.loader} mt-5 w-100 text-center`}><img src={imageHost + '/loader-small.gif'} alt="" /></div></> :
                                                    <>
                                                        {
                                                            allMappedTransactions.length === 0 ?
                                                                <>
                                                                    <div className={`${style.mappedTxn} mt-4 text-center`}>
                                                                        No Transactions to show
                                                                    </div>
                                                                </> :
                                                                <>
                                                                    {
                                                                        allMappedTransactions.map((transaction: any) => {
                                                                            return (
                                                                                <>
                                                                                    <div className={`form-check position-relative ${style.mappedTxnsRows}`}>
                                                                                        <input className={`form-check-input position-absolute ${style.checkBox}`} type="checkbox" name="" id={transaction.uniqueAccountNameAndTxnId} onChange={(e) => { if (e.target.checked) { setMapped(transaction.uniqueAccountNameAndTxnId) } else { setMapped(null) } }} />
                                                                                        <label htmlFor={transaction.uniqueAccountNameAndTxnId} className="form-check-label w-100">
                                                                                            <div className={`row ${style.mappedTxn}`}>
                                                                                                <div className="col-3"><img className={`me-2 ${style.accountImage}`} src={imageHost + "/exchanges/" + transaction.accountDetails.accountNameInLC + ".png?v=1"} alt="" />{transaction.accountDetails.accountDisplayName}</div>
                                                                                                <div className="col-3">{transaction.userTxnCategory ? transaction.userTxnCategory : transaction.txnCategory}</div>
                                                                                                <div className="col-3">{transaction.userTxnDate ? toUtc(transaction.userTxnDate) : toUtc(transaction.txnDate)}</div>
                                                                                                <div className="col-3">{transaction.parts[0].amount}{transaction.parts[0].currency}</div>
                                                                                            </div>
                                                                                        </label>
                                                                                    </div>
                                                                                </>
                                                                            )
                                                                        })
                                                                    }
                                                                </>

                                                        }
                                                    </>
                                            }

                                            <div className="d-flex justify-content-center w-100 mt-5">
                                                <button type="button" disabled={!mappedUnique} className={`me-2 ${style.save}`} onClick={() => { saveEdits(); setSwitchTradePop(false); setShowNextPage(false); }}>Save</button>
                                                <button type="button" className={`ms-1 ${style.cancel}`} onClick={() => { setSwitchTradePop(false); setShowNextPage(false); cancelEdit(); }}>Cancel</button>
                                            </div>
                                        </div>
                                    </>
                            }
                        </div>
                    </> :
                    <></>
            }
            {
                swapTradePop ?
                    <>
                        <div className={`${style.black} position-fixed`}></div>
                        <div className={`${style.popUp} position-fixed`}>
                            {
                                !showNextPage ?
                                    <>
                                        <div className={`${style.firstPage}`}>
                                            <b className={`${style.title}`}>Please select Swapped Currency</b>
                                            <div className='mt-5'>
                                                <p><b>Search Currency<span>*</span></b></p>
                                                <input className={`${style.searchCurrency}`} type="text" name="search-currency" id="" placeholder='Search Currency' onChange={(e) => { getInCurrencies(e.target.value) }} value={swapCurrency === '' ? inCurrency : swapCurrency} />
                                                {
                                                    searchedInCurrency.length === 0 ?
                                                        <></> :
                                                        <>
                                                            <div className={`${style.currencies}`} id='select-currency-dropdown'>
                                                                {
                                                                    searchedInCurrency.map((currency: any) => {
                                                                        return (
                                                                            <div><button onClick={() => { setSwapCurrency(currency.currency); setSearchedInCurrency([]); }}>{currency.currency} - {currency.name}</button></div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </>
                                                }
                                            </div>
                                            <div className="d-flex w-100 justify-content-center">
                                                <button className='mt-5 save' onClick={() => { setShowNextPage(true); getMappedTxn(newCategory); }} disabled={!swapCurrency}>Next</button>
                                                <button type="button" className="cancel ms-1 mt-5" onClick={() => { setSwapTradePop(false); cancelEdit(); }}>Cancel</button>
                                            </div>
                                        </div>
                                    </> :
                                    <>
                                        <div className={`${style.secondPage}`}>
                                            <b className={`${style.title}`}>Please select matching Outgoing Transaction</b>
                                            <div className={`row ${style.headings} mt-3 pt-3`}>
                                                <b className="col-3">Exchange</b>
                                                <b className="col-3">Type</b>
                                                <b className="col-3">Date</b>
                                                <b className="col-3">In Amount</b>
                                            </div>
                                            {
                                                mappedLoader ?
                                                    <><div className={`${style.loader} mt-5 w-100 text-center`}><img src={imageHost + '/loader-small.gif'} alt="" /></div></> :
                                                    <>
                                                        {
                                                            allMappedTransactions.length === 0 ?
                                                                <>
                                                                    <div className={`form-check ${style.mappedTxn} mt-4`}>
                                                                        <input className='form-check-input' type="checkbox" name="" id="no-txn" onChange={(e) => { if (e.target.checked) { setEnableSave(true); setMapped(null) } else { setEnableSave(false) } }} />
                                                                        <label htmlFor="no-txn" className="form-check-label">Couldn’t find the matching transactions. Add New Transaction?</label>
                                                                    </div>
                                                                </> :
                                                                <>
                                                                    {
                                                                        allMappedTransactions.map((transaction: any) => {
                                                                            return (
                                                                                <>
                                                                                    <div className={`form-check position-relative ${style.mappedTxnsRows}`}>
                                                                                        <input className={`form-check-input position-absolute ${style.checkBox}`} type="checkbox" name="" id={transaction.uniqueAccountNameAndTxnId} onChange={(e) => { if (e.target.checked) { setMapped(transaction.uniqueAccountNameAndTxnId) } else { setMapped(null) } }} />
                                                                                        <label htmlFor={transaction.uniqueAccountNameAndTxnId} className="form-check-label w-100">
                                                                                            <div className={`row ${style.mappedTxn}`}>
                                                                                                <div className="col-3"><img className={`me-2 ${style.accountImage}`} src={imageHost + "/exchanges/" + transaction.accountDetails.accountNameInLC + ".png?v=1"} alt="" />{transaction.accountDetails.accountDisplayName}</div>
                                                                                                <div className="col-3">{transaction.userTxnCategory ? transaction.userTxnCategory : transaction.txnCategory}</div>
                                                                                                <div className="col-3">{transaction.userTxnDate ? toUtc(transaction.userTxnDate) : toUtc(transaction.txnDate)}</div>
                                                                                                <div className="col-3">{transaction.parts[0].amount}{transaction.parts[0].currency}</div>
                                                                                            </div>
                                                                                        </label>
                                                                                    </div>
                                                                                </>
                                                                            )
                                                                        })
                                                                    }
                                                                    {
                                                                        !mappedUnique && enableSave ?
                                                                            <button className={`position-absolute ${style.generateUnchecked}`} onClick={() => { setEnableSave(true); setMapped(null) }}><img src={imageHost + '/radio-checked.svg'} alt="" /></button> :
                                                                            <button className={`position-absolute ${style.generateUnchecked}`} onClick={() => { setEnableSave(true); setMapped(null) }}><img src={imageHost + '/radio-unchecked.svg'} alt="" /></button>
                                                                    }
                                                                    <div className='mt-4'>Couldn’t find the matching transaction? Add New Transaction</div>
                                                                </>
                                                        }
                                                    </>
                                            }
                                            <div className="d-flex justify-content-center w-100 mt-5">
                                                <button type="button" className={`me-2 ${style.save}`} disabled={(!mappedUnique && !enableSave)} onClick={() => { saveEdits(); setSwapTradePop(false); setShowNextPage(false); }}>Save</button>
                                                <button type="button" className={`ms-1 ${style.cancel}`} onClick={() => { setSwapTradePop(false); setShowNextPage(false); cancelEdit(); }}>Cancel</button>
                                            </div>
                                        </div>
                                    </>
                            }
                        </div>
                    </> :
                    <></>
            }
            <div className="d-none d-md-flex justify-content-between ">
                <LeftFeed />
                <div className={`${style.transactions} container`}>
                    <div className="d-flex mt-4 justify-content-between">
                        <div className={`${style.mainHeading}`}>Transaction History</div>
                        <div className={`${style.redirection} d-flex`}>
                            <button className={`${style.addAccBtn} me-2`}><img className='mb-1 pe-1' src={imageHost + "/plus.svg"} alt="" />Add Account</button>
                            <button className={`${style.myAccBtn}`}><img className='pe-1 mb-1' src={imageHost + "/my-account-orange.svg"} alt="" />My Accounts</button>
                        </div>
                    </div>
                    <div className={`${style.mainTypes} d-flex justify-content-center mt-4 flex-wrap`}>
                        <button className={purple === 'transactions' ? `${style.purpleFilter} me-3 mt-3` : 'me-3 mt-3'} onClick={() => { setPurple('transactions'); setUserReview(null); setIsUpdated(null); setSelectedType(null); clearAllFilters(); }}>
                            <div className="d-flex">
                                <img className='me-3' src={imageHost + "/total-transaction.svg"} alt="" />
                                <div>All Transactions<br /><b>{txnCounts.allTransactionsCount}</b></div>
                            </div>
                        </button>
                        <button className={purple === 'deposit' ? `${style.purpleFilter} me-3 mt-3` : 'me-3 mt-3'} onClick={() => { setSelectedType(['DEPOSIT']); setUserReview(null); setIsUpdated(null); setPurple('deposit'); clearAllFilters(); }}>
                            <div className="d-flex">
                                <img className='me-3' src={imageHost + "/deposits.svg"} alt="" />
                                <div>Deposits<br /><b>{txnCounts.depositCount}</b></div>
                            </div>
                        </button>
                        <button className={purple === 'withdrawls' ? `${style.purpleFilter} me-3 mt-3` : 'me-3 mt-3'} onClick={() => { setSelectedType(['WITHDRAWAL']); setUserReview(null); setIsUpdated(null); setPurple('withdrawls'); clearAllFilters(); }}>
                            <div className="d-flex">
                                <img className='me-3' src={imageHost + "/withdrawals.svg"} alt="" />
                                <div>Withdrawls<br /><b>{txnCounts.withdrawalCount}</b></div>
                            </div>
                        </button>
                        <button className={purple === 'trades' ? `${style.purpleFilter} me-3 mt-3` : 'me-3 mt-3'} onClick={() => { setSelectedType(['TRADE']); setUserReview(null); setPurple('trades'); setIsUpdated(null); clearAllFilters(); }}>
                            <div className="d-flex">
                                <img className='me-3' src={imageHost + "/trades.svg"} alt="" />
                                <div>Trades<br /><b>{txnCounts.tradeCount}</b></div>
                            </div>
                        </button>
                        <button className={purple === 'needs-review' ? `${style.purpleFilter} me-3 mt-3` : 'me-3 mt-3'} onClick={() => { setPurple('needs-review'); setUserReview("TRUE"); setSelectedType(null); setIsUpdated(null); clearAllFilters(); }}>
                            <div className="d-flex">
                                <img className='me-3' src={imageHost + "/needs-review.svg"} alt="" />
                                <div>Needs Review<br /><b>{txnCounts.needsReviewTxnCount}</b></div>
                            </div>
                        </button>
                        <button className={purple === 'revised' ? `${style.purpleFilter} mt-3` : 'mt-3'} onClick={() => { setPurple('revised'); setUserReview(null); setSelectedType(null); setIsUpdated(true); clearAllFilters(); }}>
                            <div className="d-flex" >
                                <img className='me-3' src={imageHost + "/revised-icon.svg"} alt="" />
                                <div>Revised<br /><b>{txnCounts.userUpdatedTxnCount}</b></div>
                            </div>
                        </button>
                    </div>
                    <div className={`${style.mainFilters} d-flex justify-content-center mt-4 flex-wrap`}>
                        <div className="dropdown me-3 mt-3">
                            <button className={`dropdown-toggle btn ${style.dropdownOpenBtn}`} type='button' data-bs-toggle="dropdown">Select Accounts</button>
                            <div className={`${style.dropdownContent} dropdown-menu`}>
                                {
                                    connectedAccs.length === 0 ?
                                        <><div>No Connected Accounts</div></> :
                                        <>
                                            <div className={`${style.checksDiv}`}>
                                                {
                                                    connectedAccs.map((acc: any, index: any) => {
                                                        return (
                                                            <div className="form-check" key={index}>
                                                                <input className="form-check-input checkbox-resize" type="checkbox" id={acc.uniqueAccountName}
                                                                    onChange={(e) => { if (e.target.checked) { setSelectedAccs(selectedAccs => [...selectedAccs, acc.account.account]) } else { selectedAccs.splice(selectedAccs.indexOf(acc.account.account), 1); setReload(!reload) } }}
                                                                    checked={selectedAccs.includes(acc.account.account)}
                                                                />
                                                                <label className="form-check-label" htmlFor={acc.uniqueAccountName}>
                                                                    {acc.account.accountDisplayName}
                                                                </label>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </>
                                }
                                <hr className={`${style.dropdownDivider}`} />
                                <button type="button" className={`${style.reset}`}>Reset</button>
                            </div>
                        </div>
                        <div className="dropdown me-3 mt-3">
                            <button className={`dropdown-toggle btn ${style.dropdownOpenBtn}`} type='button' data-bs-toggle="dropdown">Select Type</button>
                            <div className={`${style.dropdownContent} dropdown-menu`}>
                                {
                                    allTypes.length === 0 ?
                                        <><div>No Types To Show</div></> :
                                        <>
                                            <div className={`${style.checksDiv}`}>
                                                {
                                                    allTypes.map((type: any, index: any) => {
                                                        return (
                                                            <div className="form-check" key={index}>
                                                                <input className="form-check-input checkbox-resize" type="checkbox" id={type.name}
                                                                    onChange={(e) => { if (e.target.checked) { setSelectedCategories(selectedCategories => [...selectedCategories, type.name]) } else { selectedCategories.splice(selectedCategories.indexOf(type.name), 1); setReload(!reload) } }}
                                                                    checked={selectedCategories.includes(type.name)}
                                                                />
                                                                <label className="form-check-label" htmlFor={type.name}>
                                                                    {type.displayName}
                                                                </label>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>

                                        </>
                                }
                                <hr className={`${style.dropdownDivider}`} />
                                <button type="button" className={`${style.reset}`}>Reset</button>
                            </div>
                        </div>
                        <div className="dropdown me-3 mt-3">
                            <button className={`dropdown-toggle btn ${style.dropdownOpenBtn}`} type='button' data-bs-toggle="dropdown">Select Status</button>
                            <div className={`${style.dropdownContent} dropdown-menu`}>
                                {
                                    [{ name: 'COMPLETED', value: 'SUCCESS' }, { name: 'PENDING', value: 'PENDING' }].map((status: any, index: any) => {
                                        return (
                                            <div className="form-check" key={index}>
                                                <input className="form-check-input checkbox-resize" type="radio" name='status' id='status'
                                                    onChange={(e) => { if (e.target.checked) { setSelectedStatus(status.value) } else { setSelectedStatus(null) } }}
                                                    checked={selectedStatus === status.value}
                                                />
                                                <label className="form-check-label" htmlFor='status'>
                                                    {status.name}
                                                </label>
                                            </div>
                                        )
                                    })
                                }
                                <hr className={`${style.dropdownDivider}`} />
                                <button type="button" className={`${style.reset}`}>Reset</button>
                            </div>
                        </div>
                        <div className="dropdown me-3 mt-3">
                            <button className={`dropdown-toggle btn ${style.dropdownOpenBtn}`} type='button' data-bs-toggle="dropdown">Transaction Source</button>
                            <div className={`${style.dropdownContent} dropdown-menu`}>
                                {
                                    [{ name: 'CSV Import', value: 'FILE' }, { name: 'Added Manually', value: 'PORTAL' }].map((source: any, index: any) => {
                                        return (
                                            <div className="form-check" key={index}>
                                                <input className="form-check-input checkbox-resize" type="checkbox" id={source.value}
                                                    onChange={(e) => { if (e.target.checked) { setSelectedSource(selectedSource => [...selectedSource, source.value]) } else { selectedSource.splice(selectedSource.indexOf(source.value), 1); setReload(!reload) } }}
                                                    checked={selectedSource.includes(source.value)}
                                                />
                                                <label className="form-check-label" htmlFor={source.value}>
                                                    {source.name}
                                                </label>
                                            </div>
                                        )
                                    })
                                }
                                <hr className={`${style.dropdownDivider}`} />
                                <button type="button" className={`${style.reset}`}>Reset</button>
                            </div>
                        </div>
                        <div className=" position-relative mt-3">
                            <div className={` ${style.dropdownOpenBtnDate} d-flex justify-content-between`}  >
                                <button className={`${style.labelBtn}`} onClick={() => { setOpenCalendar(!openCalendar) }}>
                                    {isDateSame() ? 'Select Date Range' : dateLabel}
                                </button>
                                <div>
                                    {
                                        openCalendar && <button className={`${style.applyDate}`} onClick={() => { getFilteredTxns(); setOpenCalendar(false); }}>Apply</button>
                                    }
                                    {
                                        !isDateSame() && !openCalendar ?
                                            <button className={`${style.resetDateFilter}`} onClick={() => {
                                                setOpenCalendar(false);
                                                setrangeDate([{ startDate: new Date(), endDate: new Date(), key: 'selection' }]);
                                                setReload(!reload);
                                            }}><img src={imageHost + '/cross-icon.png'} alt="cancel" /></button>
                                            :
                                            <></>
                                    }
                                </div>

                            </div>
                            {
                                openCalendar ?
                                    <div>
                                        <DateRange
                                            editableDateInputs={false}
                                            onChange={(item: any) => { setrangeDate([item.selection]); }}
                                            moveRangeOnFirstSelection={false}
                                            months={1}
                                            ranges={rangeDate}
                                            direction='horizontal'
                                            className={`calendarElement ${style.calendarEl} `}
                                        />
                                    </div> :
                                    <></>
                            }
                        </div>
                    </div>
                    <div className={`${style.showSelectedFilters} d-flex mt-4 align-items-center`}>
                        {
                            allFilters.length !== 0 ?
                                <>
                                    <b>Filters : </b>
                                    {
                                        allFilters.map((filter: any) => {
                                            return (
                                                <div className={`${style.filter} ms-3 position-relative d-flex justify-content-between`}>
                                                    {filter}
                                                    <button className='ms-2 h-100' onClick={() => { removeFilter(filter) }}>
                                                        <img className='mb-1' src={imageHost + '/filter-cross.svg'} alt="remove filter" title='remove filter' />
                                                    </button>
                                                </div>
                                            )
                                        })
                                    }
                                </> :
                                <></>
                        }
                    </div>
                    <div className="d-flex mb-3 mt-4 justify-content-start">
                        <div className='me-5'><img src={imageHost + '/need-review.svg'} alt="" /> Need Review</div>
                        <div className='me-5'><img src={imageHost + '/reviewed-1.svg'} alt="" /> Reviewed</div>
                        <div className='me-5'><img src={imageHost + '/pending.svg'} alt="" /> Pending</div>
                        <div className='me-5'><img src={imageHost + '/add-manuall.svg'} alt="" /> Added Manually</div>
                    </div>
                    {/* MAIN TABLE DESKTOP */}
                    <div className={`${style.txnTable} mt-4 position-relative`} onScroll={(e) => handleScroll(e)}>
                        <div className={`row ${style.headings} pb-3 pt-3 w-100 m-auto position-sticky`}>
                            <b className="col">Account Name<span><img className={`${style.sortingIcon} ps-1`} onClick={() => sortingData("account")} src={imageHost + "/sorting-trans.svg"} alt="" /></span></b>
                            <b className="col">Type<span><img className={`${style.sortingIcon} ps-1`} onClick={() => sortingData("txnCategory")} src={imageHost + "/sorting-trans.svg"} alt="" /></span></b>
                            <b className="col">Date<span><img className={`${style.sortingIcon} ps-1`} onClick={() => sortingData("txnDate")} src={imageHost + "/sorting-trans.svg"} alt="" /></span></b>
                            <b className="col">In Amount</b>
                            <b className="col">Out Amount</b>
                            <b className="col">Native Amount</b>
                            <b className="col">Fee</b>
                        </div>
                        {
                            getTxnErr ?
                                <div className="mt-5 text-center">SOME ERROR CAME UP</div> :
                                <>
                                    <div className={`${style.allTxns}`}>
                                        {
                                            mainTableLoader &&
                                            <>
                                                <div className={`${style.mainLoader}`}>
                                                    <img className={`${style.syncLoader}`} src={imageHost + '/loader2.gif'} alt="loading" />
                                                </div>
                                            </>
                                        }
                                        {
                                            transactions.length === 0 ?
                                                <>
                                                    <div className="text-center mb-5 d-flex align-items-center justify-content-center mt-5">
                                                        <img className='broken-robot img-fluid' src={imageHost + "/neutral-mascot.svg"} alt="mascot" />
                                                        <div className='no-txns'>No Transactions Found</div>
                                                    </div>
                                                </> :
                                                <>
                                                    {
                                                        transactions.map((transaction: any) => {
                                                            return (
                                                                <>
                                                                    <div className={(showErr || showSuccess) && check === transaction.uniqueAccountNameAndTxnId ? `row position-relative py-3 ${style.txnRow} border-white w-100 m-auto` : `row position-relative py-3 ${style.txnRow} w-100 m-auto`} >
                                                                        <div className="col">
                                                                            <div className={`position-absolute ${style.txnIcon}`}>
                                                                                {
                                                                                    transaction.txnStatus === "PENDING" ?
                                                                                        <>
                                                                                            <img src={imageHost + '/pending.svg'} alt="" />
                                                                                        </> :
                                                                                        <>
                                                                                            {
                                                                                                transaction.userReviewExist === "TRUE" ? <img src={imageHost + '/need-review.svg'} alt="" /> :
                                                                                                    <>
                                                                                                        {
                                                                                                            transaction.updatedAt ? <img src={imageHost + '/reviewed-1.svg'} alt="" /> : <></>
                                                                                                        }
                                                                                                    </>
                                                                                            }
                                                                                        </>
                                                                                }

                                                                            </div>
                                                                            <img className={`${style.accountImage}`} src={imageHost + "/exchanges/" + transaction.accountDetails.accountNameInLC + ".png?v=1"} alt="" /> {transaction.account}
                                                                        </div>
                                                                        <div className="col">
                                                                            {
                                                                                editClicked && check === transaction.uniqueAccountNameAndTxnId ?
                                                                                    <>
                                                                                        <div className="dropdown">
                                                                                            <button onClick={() => { searchCategory(transaction.txnCategory); }} className={`dropdown-toggle btn ${style.editDropdownBtn}`} type='button' data-bs-toggle="dropdown">
                                                                                                {newCategory ? convertToDisplay(newCategory) : transaction.userTxnCategory ? convertToDisplay(transaction.userTxnCategory) : convertToDisplay(transaction.txnCategory)}
                                                                                            </button>
                                                                                            <div className={`dropdown-menu ${style.dropdownMenu}`}>
                                                                                                {
                                                                                                    gettingTypesLoader && check === transaction.uniqueAccountNameAndTxnId ?
                                                                                                        <div className="text-center"><img src={imageHost + '/loader-small.gif'} alt="loading" /></div> :
                                                                                                        <>
                                                                                                            <input type="text" className='search-type w-100' name="search-type" placeholder='search type' onChange={(e) => { setSearch(e.target.value) }} />
                                                                                                            {
                                                                                                                categories.map((type: any) => {
                                                                                                                    if (type.displayName.toLowerCase().includes(searchFilter.toLowerCase()) || type.displayName.toUpperCase().includes(searchFilter.toUpperCase())) {
                                                                                                                        return (
                                                                                                                            <>
                                                                                                                                {
                                                                                                                                    type.name === 'SELF_TRANSFER_INWARD' ?
                                                                                                                                        <>
                                                                                                                                            <button onClick={() => { setNewCategory(type.name); getMappedTxn(type.name); setShowPopUp(true); setSearch("") }}>{type.displayName}</button>

                                                                                                                                        </> :
                                                                                                                                        <>{
                                                                                                                                            type.name === 'SWITCH_TRADE_INWARD' ?
                                                                                                                                                <>
                                                                                                                                                    <button onClick={() => { setNewCategory(type.name); getMappedTxn(type.name); setSwitchTradePop(true); setSearch("") }}>{type.displayName}</button>
                                                                                                                                                </> :
                                                                                                                                                <>
                                                                                                                                                    {
                                                                                                                                                        type.name === 'SWAP_TRADE_INWARD' || type.name === 'SWAP_TRADE_OUTWARD' ?
                                                                                                                                                            <>
                                                                                                                                                                <button onClick={() => { setNewCategory(type.name); getMappedTxn(type.name); setSwapTradePop(true); setSearch("") }}>{type.displayName}</button>
                                                                                                                                                            </> :
                                                                                                                                                            <>
                                                                                                                                                                <button onClick={() => { setNewCategory(type.name); setSearch("") }}>{type.displayName}</button>
                                                                                                                                                            </>
                                                                                                                                                    }
                                                                                                                                                </>
                                                                                                                                        }</>

                                                                                                                                }
                                                                                                                            </>

                                                                                                                        )
                                                                                                                    }
                                                                                                                })
                                                                                                            }
                                                                                                        </>
                                                                                                }

                                                                                            </div>
                                                                                        </div>
                                                                                    </> :
                                                                                    <> {transaction.userTxnCategory ? convertToDisplay(transaction.userTxnCategory) : convertToDisplay(transaction.txnCategory)}</>
                                                                            }
                                                                        </div>
                                                                        <div className="col">
                                                                            {
                                                                                editClicked && check === transaction.uniqueAccountNameAndTxnId ?
                                                                                    <>
                                                                                        <div>
                                                                                            <input type="datetime-local" name="new-date" id="date" defaultValue={newDate ? newDate : transaction.userTxnDate ? transaction.userTxnDate : transaction.txnDate} onChange={(e) => { console.log(e.target.value); setNewDate(e.target.value) }}
                                                                                            />
                                                                                        </div>

                                                                                    </> :
                                                                                    <>
                                                                                        {transaction.userTxnDate ? <>{toUtc(transaction.userTxnDate)}</>
                                                                                            : transaction.txnDate ? <>{toUtc(transaction.txnDate)}</> : <></>}
                                                                                    </>
                                                                            }
                                                                        </div>
                                                                        <div className="col">
                                                                            {
                                                                                editClicked && check === transaction.uniqueAccountNameAndTxnId ?
                                                                                    <>
                                                                                        <div className={`${style.editOutAmount} position-relative`}>
                                                                                            {transaction.parts.map((key: any, index: any) => {
                                                                                                return <>
                                                                                                    {key.direction === "RECEIVED" ? <><input className='w-100' type="text" defaultValue={key.amount} name="set-out-amount" id="set-out-amount" readOnly />
                                                                                                        <button className={`position-absolute ${style.editDropdown} text-start`} onClick={() => { setInDropdown(!inDropdown); closeDropdowns('inAmount') }}>{inCurrency ? inCurrency : key.userCurrency ? key.userCurrency : key.currency}<img src={imageHost + '/search-currency.svg'} alt="search-currency" title='search-currency' /></button>
                                                                                                        {
                                                                                                            inDropdown ? <>
                                                                                                                <div className={`${style.searchCurrency} p-0 position-absolute`}>
                                                                                                                    <input type="text" className={`${style.searchBar}`} onChange={(e) => { getInCurrencies(e.target.value) }} name="search-currency" placeholder='Search Currency' id="" />
                                                                                                                    {
                                                                                                                        searchedInCurrency.map(currency => {
                                                                                                                            return (<>
                                                                                                                                <button className='text-start w-100' onClick={() => { setInCurrency(currency.currency); setInDropdown(false) }}><div className={`${style.currency} w-100`}>{currency.currency} - {currency.name}</div></button>
                                                                                                                            </>)
                                                                                                                        })
                                                                                                                    }
                                                                                                                </div>
                                                                                                            </> : <></>
                                                                                                        }
                                                                                                    </> :
                                                                                                        <></>}
                                                                                                </>
                                                                                            })}
                                                                                        </div>
                                                                                    </> :
                                                                                    <>
                                                                                        {transaction.parts.map((key: any, index: any) => {
                                                                                            return <>
                                                                                                {key.direction === "RECEIVED" && key.currency !== "USD" ? <><img className={`${style.currencyImg}`} src={key.currencyDetails ? key.currencyDetails.logo_url ? `${key.currencyDetails.logo_url}` : imageHost + '/default-crypto-icon.svg' : imageHost + '/default-crypto-icon.svg'} alt="" /> <span>{key.amount} {key.userCurrency ? key.userCurrency : key.currency}</span></> :
                                                                                                    <>
                                                                                                        {key.direction === "RECEIVED" && key.currency === "USD" ? <><div><img className={`${style.currencyImg}`} src={imageHost + "/dollor-transaction.svg"} alt="" /> {key.amount.toFixed(2)} {key.userCurrency ? key.userCurrency : key.currency}</div></> : <> {index === 0 && transaction.parts.length === 1 ? <><div className=' ps-4'>--</div></> : <></>}</>}
                                                                                                    </>}
                                                                                            </>
                                                                                        })}
                                                                                    </>
                                                                            }

                                                                        </div>
                                                                        <div className="col">
                                                                            {
                                                                                editClicked && check === transaction.uniqueAccountNameAndTxnId ?
                                                                                    <>
                                                                                        <div className={`${style.editOutAmount} position-relative`}>
                                                                                            {transaction.parts.map((key: any, index: any) => {
                                                                                                return <>
                                                                                                    {key.direction === "SENT" ? <><input className='w-100' type="text" defaultValue={key.amount} name="set-out-amount" id="edit-amount" readOnly />
                                                                                                        <button className={`position-absolute ${style.editDropdown} text-start`} onClick={() => { setCurrencyDropdown(!currencyDropdown); closeDropdowns('outAmount') }}>
                                                                                                            {outCurrency ? outCurrency : key.currency}
                                                                                                            <img src={imageHost + '/search-currency.svg'} title='search-currency' alt="search-currency" />
                                                                                                        </button>
                                                                                                        {
                                                                                                            currencyDropdown ? <>
                                                                                                                <div className={`${style.searchCurrency} position-absolute`}>
                                                                                                                    <input type="text" className={`${style.searchBar}`} onChange={(e) => { getOutCurrencies(e.target.value) }} name="search-currency" placeholder='Search Currency' id="" />
                                                                                                                    {
                                                                                                                        searchedCurrency.map(currency => {
                                                                                                                            return (<>
                                                                                                                                <button className='text-start w-100' onClick={() => { setOutCurrency(currency.currency); setCurrencyDropdown(false) }}><div className={`${style.currency} w-100`}>{currency.currency} - {currency.name}</div></button>
                                                                                                                            </>)
                                                                                                                        })
                                                                                                                    }
                                                                                                                </div>
                                                                                                            </> : <></>
                                                                                                        }
                                                                                                    </> :
                                                                                                        <></>}
                                                                                                </>
                                                                                            })}
                                                                                        </div>
                                                                                    </> :
                                                                                    <>
                                                                                        {transaction.parts.map((key: any, index: any) => {
                                                                                            return <>
                                                                                                {key.direction === "SENT" && key.currency !== "USD" ? <><img className={`${style.currencyImg}`} src={key.currencyDetails ? key.currencyDetails.logo_url ? `${key.currencyDetails.logo_url}` : imageHost + '/default-crypto-icon.svg' : imageHost + '/default-crypto-icon.svg'} alt="" /> <span>{key.amount} {key.userCurrency ? key.userCurrency : key.currency}</span></> :
                                                                                                    <>
                                                                                                        {key.direction === "SENT" && key.currency === "USD" ? <><div><img className={`${style.currencyImg}`} src={imageHost + "/dollor-transaction.svg"} alt="" /> {key.amount.toFixed(2)} <span>{key.userCurrency ? key.userCurrency : key.currency}</span></div></> : <> {index === 0 && transaction.parts.length === 1 ? <><div className='ps-4'>--</div></> :
                                                                                                            <></>}</>}
                                                                                                    </>}
                                                                                            </>
                                                                                        })}
                                                                                    </>
                                                                            }

                                                                        </div>
                                                                        <div className="col">
                                                                            {
                                                                                transaction.txnStatus === 'PENDING' ?
                                                                                    <OverlayTrigger
                                                                                        placement='top'
                                                                                        overlay={
                                                                                            <Tooltip id="popover-contained">
                                                                                                <div>This transaction is pending confirmation from exchange</div>
                                                                                            </Tooltip>
                                                                                        }>
                                                                                        <div className='ps-4'>Pending</div>
                                                                                    </OverlayTrigger> :
                                                                                    <>
                                                                                        {
                                                                                            editClicked && check === transaction.uniqueAccountNameAndTxnId && checkParts(transaction.parts, transaction.txnType) ?
                                                                                                <>
                                                                                                    <input type="text" onChange={(e) => { setNativeAmount(e.target.value); setShowNativeWarning(true); }} className='w-75 edit-native' name="edit-native-amount" defaultValue={checkParts(transaction.parts, transaction.txnType)?.userNativeAmount !== null ? checkParts(transaction.parts, transaction.txnType)?.userNativeAmount : checkParts(transaction.parts, transaction.txnType)?.nativeAmount} />
                                                                                                </> :
                                                                                                <>
                                                                                                    {
                                                                                                        checkParts(transaction.parts, transaction.txnType) ?
                                                                                                            <>

                                                                                                                <img className={`${style.currencyImg}`} src={imageHost + "/dollor-transaction.svg"} alt="" />
                                                                                                                <OverlayTrigger
                                                                                                                    placement='top'
                                                                                                                    overlay={
                                                                                                                        <Tooltip id="popover-contained">
                                                                                                                            <div>{checkParts(transaction.parts, transaction.txnType)?.userNativeAmount !== null ? checkParts(transaction.parts, transaction.txnType)?.userNativeAmount : checkParts(transaction.parts, transaction.txnType)?.nativeAmount} {checkParts(transaction.parts, transaction.txnType)?.nativeCurrency}</div>
                                                                                                                        </Tooltip>
                                                                                                                    }
                                                                                                                >
                                                                                                                    <span>{displayNativeAmount(transaction) < 0.01 && displayNativeAmount(transaction) > 0 ? '>0.00' : displayNativeAmount(transaction)} {checkParts(transaction.parts, transaction.txnType)?.nativeCurrency}</span>
                                                                                                                </OverlayTrigger>
                                                                                                            </> :
                                                                                                            <><div className='ps-4'>--</div></>
                                                                                                    }
                                                                                                </>
                                                                                        }
                                                                                    </>
                                                                            }
                                                                        </div>
                                                                        <div className="col position-relative">
                                                                            {
                                                                                transaction.fees.length !== 0 ?
                                                                                    <>
                                                                                        {transaction.fees.map((fee: any) => {
                                                                                            {/* Showing the original fee in tooltip */ }
                                                                                            return (
                                                                                                <>
                                                                                                    <OverlayTrigger placement='top' overlay={
                                                                                                        <Tooltip id="popover-contained">
                                                                                                            <div className='tooltip-text-size m-0'>{fee.amount}</div>
                                                                                                        </Tooltip>
                                                                                                    }>
                                                                                                        <div>{fee.amount < 0.01 && fee.amount > 0 ? '>0.00' : fee.amount.toFixed(2)} {fee.currency}</div>
                                                                                                    </OverlayTrigger>
                                                                                                </>
                                                                                            )

                                                                                        })}
                                                                                    </> :
                                                                                    <>--</>
                                                                            }
                                                                            {/* ICONS */}
                                                                            {
                                                                                saveEditsLoader && check === transaction.uniqueAccountNameAndTxnId ?
                                                                                    <img className={`position-absolute ${style.editIcon}`} src={imageHost + '/loader-small.gif'} alt="" /> :
                                                                                    <>
                                                                                        {
                                                                                            editClicked && check === transaction.uniqueAccountNameAndTxnId ? <>
                                                                                                <button onClick={saveEdits} className={`position-absolute ${style.editIcon}`}><img src={imageHost + "/save-tsxn.svg"} alt="save" title='save' className="img-fluid" /></button>
                                                                                                <button onClick={cancelEdit} className={`position-absolute ${style.cancel}`}><img src={imageHost + '/cancel-edit.svg'} alt="" title='cancel edit' /></button>
                                                                                            </> :
                                                                                                <button onClick={() => { setEditClicked(true); setCheck(transaction.uniqueAccountNameAndTxnId); setId(transaction.uniqueAccountNameAndTxnId); setClicked('edit'); }} disabled={clicked === 'edit'} className={`position-absolute ${style.editIcon}`}><img src={imageHost + "/edit-icon.svg"} alt="edit" title='edit' className="img-fluid" /></button>
                                                                                        }
                                                                                    </>
                                                                            }
                                                                            {
                                                                                transaction.userUpdated && !(editClicked && check === transaction.uniqueAccountNameAndTxnId) ?
                                                                                    <OverlayTrigger placement='top' overlay={
                                                                                        <Tooltip id="popover-contained">
                                                                                            <div className='tooltip-text-size m-0'>You Updated this transaction on {toUtc(transaction.updatedAt)}</div>
                                                                                        </Tooltip>
                                                                                    }>
                                                                                        <img className={`${style.flag}`} src={imageHost + '/flag-txn.svg'} alt="flag" />
                                                                                    </OverlayTrigger>
                                                                                    :
                                                                                    <></>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    {
                                                                        showNativeWarning && check === transaction.uniqueAccountNameAndTxnId && nativeAmount ?
                                                                            <div className={`${style.nativeWarning} text-center`}>
                                                                                <div className='w-100'>You are updating native value from {checkParts(transaction.parts, transaction.txnType)?.userNativeAmount !== null ? checkParts(transaction.parts, transaction.txnType)?.userNativeAmount : checkParts(transaction.parts, transaction.txnType)?.nativeAmount} to {nativeAmount}</div>
                                                                            </div> :
                                                                            <></>
                                                                    }

                                                                    {
                                                                        showErr && check === transaction.uniqueAccountNameAndTxnId ?
                                                                            <>
                                                                                <div className={`${style.error} text-center`}><div className='w-100'><div><img className='me-2' src={imageHost + '/exclamation.svg'} alt="" /><b>Error : </b>{errMsg ? errMsg : "Something Went Wrong, Please try again later"}</div></div></div>
                                                                            </> :
                                                                            showSuccess && check === transaction.uniqueAccountNameAndTxnId ?
                                                                                <>
                                                                                    <div className={`${style.success} text-center`}><div className='w-100'><div className='position-relative'>Data Saved Successfully! <button onClick={() => { setEditClicked(false); setShowSuccess(false); setNewCategory(null); setClicked('saved'); }} className='position-absolute'><img src={imageHost + '/close-success.svg'} alt="" /></button></div></div></div>
                                                                                </> :
                                                                                <></>
                                                                    }
                                                                </>
                                                            )
                                                        })
                                                    }
                                                </>
                                        }

                                    </div>
                                </>
                        }

                    </div>
                </div>
            </div>

            {/* MOBILE VIEW */}

            <div className={`${style.transactionsMobile} d-block d-md-none container`}>
                <div className={`${style.heading}`}>Transactions History</div>
                <div className="d-flex justify-content-between mt-3">
                    <button className={`${style.addAcc}`}><img className='mb-1' src={imageHost + '/plus.svg'} alt="" /> Add Account</button>
                    <button className={`${style.myAcc}`}><img className='mb-1 me-1' src={imageHost + '/my-account-orange.svg'} alt="" />My Account</button>
                </div>

                {/* MAIN TYPES MOBILE */}

                <div className="w-100">
                    <button className={`${style.mainTypes} mt-4 d-flex justify-content-between align-items-center`} onClick={() => { setOpenTypesDropdown(!openTypesDropdown) }}>
                        <div><img className='me-3' src={imageHost + mainTypeImg} alt="" />{purple}</div>
                        <img className={`${style.dropdownArrow}`} src={imageHost + '/dropdown-down.svg'} alt="" />
                    </button>

                    {
                        openTypesDropdown ?
                            <>
                                <div className={`${style.typesDropdown}`}>
                                    <button className={`${style.mainTypesInDropdown}`} onClick={() => { setMainTypeImg("/total-transaction.svg"); setPurple('transactions'); setUserReview(null); setIsUpdated(null); setSelectedType(null); clearAllFilters(); }}>
                                        <div className="d-flex w-100 justify-content-between align-items-center">
                                            <div><img className='me-3' src={imageHost + "/total-transaction.svg"} alt="" /> All Transactions</div>
                                            <b>{txnCounts.allTransactionsCount}</b>
                                        </div>
                                    </button>
                                    <button className={`${style.mainTypesInDropdown}`} onClick={() => { setMainTypeImg("/deposits.svg"); setSelectedType(['DEPOSIT']); setUserReview(null); setIsUpdated(null); setPurple('deposit'); clearAllFilters(); }}>
                                        <div className="d-flex w-100 justify-content-between align-items-center">
                                            <div><img className='me-3' src={imageHost + "/deposits.svg"} alt="" /> Deposits</div>
                                            <b>{txnCounts.depositCount}</b>
                                        </div>
                                    </button>
                                    <button className={`${style.mainTypesInDropdown}`} onClick={() => { setMainTypeImg("/withdrawals.svg"); setSelectedType(['WITHDRAWAL']); setUserReview(null); setIsUpdated(null); setPurple('withdrawls'); clearAllFilters(); }}>
                                        <div className="d-flex w-100 justify-content-between align-items-center">
                                            <div><img className='me-3' src={imageHost + "/withdrawals.svg"} alt="" /> Withdrawls</div>
                                            <b>{txnCounts.withdrawalCount}</b>
                                        </div>
                                    </button>
                                    <button className={`${style.mainTypesInDropdown}`} onClick={() => { setMainTypeImg("/trades.svg"); setSelectedType(['TRADE']); setUserReview(null); setPurple('trades'); setIsUpdated(null); clearAllFilters(); }}>
                                        <div className="d-flex w-100 justify-content-between align-items-center">
                                            <div><img className='me-3' src={imageHost + "/trades.svg"} alt="" /> Trades</div>
                                            <b>{txnCounts.tradeCount}</b>
                                        </div>
                                    </button>
                                    <button className={`${style.mainTypesInDropdown}`} onClick={() => { setMainTypeImg("/needs-review.svg"); setPurple('needs-review'); setUserReview("TRUE"); setSelectedType(null); setIsUpdated(null); clearAllFilters(); }}>
                                        <div className="d-flex w-100 justify-content-between align-items-center">
                                            <div><img className='me-3' src={imageHost + "/needs-review.svg"} alt="" /> Needs Review</div>
                                            <b>{txnCounts.needsReviewTxnCount}</b>
                                        </div>
                                    </button>
                                    <button className={`${style.mainTypesInDropdown}`} onClick={() => { setMainTypeImg("/revised-icon.svg"); setPurple('revised'); setUserReview(null); setSelectedType(null); setIsUpdated(true); clearAllFilters(); }}>
                                        <div className="d-flex w-100 justify-content-between align-items-center" >
                                            <div><img className='me-3' src={imageHost + "/revised-icon.svg"} alt="" /> Revised</div>
                                            <b>{txnCounts.userUpdatedTxnCount}</b>
                                        </div>
                                    </button>
                                </div>

                            </> :
                            <></>
                    }
                </div>

                {/* FILTERS IN MOBILE */}

                <div className="text-end w-100 mt-4 position-relative">
                    <button onClick={() => { setOpenFiltersBox(!openFiltersBox) }} className={`${style.filtersBtn}`}><img src={imageHost + '/filter-icon.svg'} alt="" /> Filters</button>
                    {
                        openFiltersBox ?
                            <>
                                <div className={`${style.filtersBox} w-100 position-absolute`}>
                                    <div className="dropdown me-3 mt-3">
                                        <button className={`dropdown-toggle btn ${style.dropdownOpenBtn}`} type='button' data-bs-toggle="dropdown">Select Accounts</button>
                                        <div className={`${style.dropdownContent} dropdown-menu`}>
                                            {
                                                connectedAccs.length === 0 ?
                                                    <><div>No Connected Accounts</div></> :
                                                    <>
                                                        <div className={`${style.checksDiv}`}>
                                                            {
                                                                connectedAccs.map((acc: any, index: any) => {
                                                                    return (
                                                                        <div className="form-check" key={index}>
                                                                            <input className="form-check-input checkbox-resize" type="checkbox" id={acc.uniqueAccountName}
                                                                                onChange={(e) => { if (e.target.checked) { setSelectedAccs(selectedAccs => [...selectedAccs, acc.account.account]) } else { selectedAccs.splice(selectedAccs.indexOf(acc.account.account), 1); setReload(!reload) } }}
                                                                                checked={selectedAccs.includes(acc.account.account)}
                                                                            />
                                                                            <label className="form-check-label" htmlFor={acc.uniqueAccountName}>
                                                                                {acc.account.accountDisplayName}
                                                                            </label>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </>
                                            }
                                            <hr className={`${style.dropdownDivider}`} />
                                            <button type="button" className={`${style.reset}`}>Reset</button>
                                        </div>
                                    </div>
                                    <div className="dropdown me-3 mt-3">
                                        <button className={`dropdown-toggle btn ${style.dropdownOpenBtn}`} type='button' data-bs-toggle="dropdown">Select Type</button>
                                        <div className={`${style.dropdownContent} dropdown-menu`}>
                                            {
                                                allTypes.length === 0 ?
                                                    <><div>No Types To Show</div></> :
                                                    <>
                                                        <div className={`${style.checksDiv}`}>
                                                            {
                                                                allTypes.map((type: any, index: any) => {
                                                                    return (
                                                                        <div className="form-check" key={index}>
                                                                            <input className="form-check-input checkbox-resize" type="checkbox" id={type.name}
                                                                                onChange={(e) => { if (e.target.checked) { setSelectedCategories(selectedCategories => [...selectedCategories, type.name]) } else { selectedCategories.splice(selectedCategories.indexOf(type.name), 1); setReload(!reload) } }}
                                                                                checked={selectedCategories.includes(type.name)}
                                                                            />
                                                                            <label className="form-check-label" htmlFor={type.name}>
                                                                                {type.displayName}
                                                                            </label>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>

                                                    </>
                                            }
                                            <hr className={`${style.dropdownDivider}`} />
                                            <button type="button" className={`${style.reset}`}>Reset</button>
                                        </div>
                                    </div>
                                    <div className="dropdown me-3 mt-3">
                                        <button className={`dropdown-toggle btn ${style.dropdownOpenBtn}`} type='button' data-bs-toggle="dropdown">Select Status</button>
                                        <div className={`${style.dropdownContent} dropdown-menu`}>
                                            {
                                                [{ name: 'COMPLETED', value: 'SUCCESS' }, { name: 'PENDING', value: 'PENDING' }].map((status: any, index: any) => {
                                                    return (
                                                        <div className="form-check" key={index}>
                                                            <input className="form-check-input checkbox-resize" type="radio" name='status' id='status'
                                                                onChange={(e) => { if (e.target.checked) { setSelectedStatus(status.value) } else { setSelectedStatus(null) } }}
                                                                checked={selectedStatus === status.value}
                                                            />
                                                            <label className="form-check-label" htmlFor='status'>
                                                                {status.name}
                                                            </label>
                                                        </div>
                                                    )
                                                })
                                            }
                                            <hr className={`${style.dropdownDivider}`} />
                                            <button type="button" className={`${style.reset}`}>Reset</button>
                                        </div>
                                    </div>
                                    <div className="dropdown me-3 mt-3">
                                        <button className={`dropdown-toggle btn ${style.dropdownOpenBtn}`} type='button' data-bs-toggle="dropdown">Transaction Source</button>
                                        <div className={`${style.dropdownContent} dropdown-menu`}>
                                            {
                                                [{ name: 'CSV Import', value: 'FILE' }, { name: 'Added Manually', value: 'PORTAL' }].map((source: any, index: any) => {
                                                    return (
                                                        <div className="form-check" key={index}>
                                                            <input className="form-check-input checkbox-resize" type="checkbox" id={source.value}
                                                                onChange={(e) => { if (e.target.checked) { setSelectedSource(selectedSource => [...selectedSource, source.value]) } else { selectedSource.splice(selectedSource.indexOf(source.value), 1); setReload(!reload) } }}
                                                                checked={selectedSource.includes(source.value)}
                                                            />
                                                            <label className="form-check-label" htmlFor={source.value}>
                                                                {source.name}
                                                            </label>
                                                        </div>
                                                    )
                                                })
                                            }
                                            <hr className={`${style.dropdownDivider}`} />
                                            <button type="button" className={`${style.reset}`}>Reset</button>
                                        </div>
                                    </div>
                                    <div className=" position-relative mt-3">
                                        <div className={` ${style.dropdownOpenBtnDate} d-flex justify-content-between`}  >
                                            <button className={`${style.labelBtn}`} onClick={() => { setOpenCalendar(!openCalendar) }}>
                                                {isDateSame() ? 'Select Date Range' : dateLabel}
                                            </button>
                                            <div>
                                                {
                                                    openCalendar && <button className={`${style.applyDate}`} onClick={() => { getFilteredTxns(); setOpenCalendar(false); }}>Apply</button>
                                                }
                                                {
                                                    !isDateSame() && !openCalendar ?
                                                        <button className={`${style.resetDateFilter}`} onClick={() => {
                                                            setOpenCalendar(false);
                                                            setrangeDate([{ startDate: new Date(), endDate: new Date(), key: 'selection' }]);
                                                            setReload(!reload);
                                                        }}><img src={imageHost + '/cross-icon.png'} alt="cancel" /></button>
                                                        :
                                                        <></>
                                                }
                                            </div>

                                        </div>
                                        {
                                            openCalendar ?
                                                <div>
                                                    <DateRange
                                                        editableDateInputs={false}
                                                        onChange={(item: any) => { setrangeDate([item.selection]); }}
                                                        moveRangeOnFirstSelection={false}
                                                        months={1}
                                                        ranges={rangeDate}
                                                        direction='horizontal'
                                                        className={`calendarElement ${style.calendarEl} `}
                                                    />
                                                </div> :
                                                <></>
                                        }
                                    </div>
                                </div>
                            </> :
                            <></>
                    }
                </div>

                {/* SHOWING SELECTED FILTERS */}

                <div className={`${style.showSelectedFilters} d-flex mt-4 align-items-center`}>
                    {
                        allFilters.length !== 0 ?
                            <>
                                <b>Filters : </b>
                                {
                                    allFilters.map((filter: any) => {
                                        return (
                                            <div className={`${style.filter} ms-3 position-relative d-flex justify-content-between`}>
                                                {filter}
                                                <button className='ms-2 h-100' onClick={() => { removeFilter(filter) }}>
                                                    <img className='mb-1' src={imageHost + '/filter-cross.svg'} alt="remove filter" title='remove filter' />
                                                </button>
                                            </div>
                                        )
                                    })
                                }
                            </> :
                            <></>
                    }
                </div>

                {/* MAIN TABLE MOBILE */}

                <div className={`${style.mobileTable} mt-4`}>
                    {
                        getTxnErr ?
                            <div className="mt-5 text-center">SOME ERROR CAME UP</div> :
                            <>
                                <div className={`${style.allTxns}`} onScroll={handleScroll}>
                                    {
                                        mainTableLoader &&
                                        <>
                                            <div className={`${style.mainLoader}`}>
                                                <img className={`${style.syncLoader}`} src={imageHost + '/loader2.gif'} alt="loading" />
                                            </div>
                                        </>
                                    }
                                    {
                                        transactions.length === 0 ?
                                            <>
                                                <div className="text-center mb-5 d-flex align-items-center justify-content-center mt-5">
                                                    <img className='broken-robot img-fluid' src={imageHost + "/neutral-mascot.svg"} alt="mascot" />
                                                    <div className='no-txns'>No Transactions Found</div>
                                                </div>
                                            </> :
                                            <>
                                                {
                                                    transactions.map((transaction: any) => {
                                                        return (
                                                            <>
                                                                <div className={(showErr || showSuccess) && check === transaction.uniqueAccountNameAndTxnId ? `row position-relative py-3 ${style.txnRow} border-white w-100 m-auto` : `row position-relative py-3 ${style.txnRow} w-100 m-auto`} >
                                                                    <div className={`row ${style.mobileTxnRow} w-100 m-auto`}>
                                                                        <div className="col-6"><img className={`${style.accountImage}`} src={imageHost + "/exchanges/" + transaction.accountDetails.accountNameInLC + ".png?v=1"} alt="" /> {transaction.account}</div>
                                                                        <div className="col-6 text-center">
                                                                            {
                                                                                saveEditsLoader && check === transaction.uniqueAccountNameAndTxnId ?
                                                                                    <img className={` ${style.editIcon}`} src={imageHost + '/loader-small.gif'} alt="" /> :
                                                                                    <>
                                                                                        {
                                                                                            editClicked && check === transaction.uniqueAccountNameAndTxnId ? <>
                                                                                                <button onClick={saveEdits} className={` ${style.editIcon}`}><img src={imageHost + "/save-tsxn.svg"} alt="save" title='save' className="img-fluid" /></button>
                                                                                                <button onClick={cancelEdit} className={` ${style.cancel}`}><img src={imageHost + '/cancel-edit.svg'} alt="" title='cancel edit' /></button>
                                                                                            </> :
                                                                                                <button onClick={() => { setEditClicked(true); setCheck(transaction.uniqueAccountNameAndTxnId); setId(transaction.uniqueAccountNameAndTxnId); setClicked('edit'); }} disabled={clicked === 'edit'} className={`${style.editIcon}`}><img src={imageHost + "/edit-icon.svg"} alt="edit" title='edit' className="img-fluid" /></button>
                                                                                        }
                                                                                    </>
                                                                            }
                                                                            {
                                                                                transaction.userUpdated && !(editClicked && check === transaction.uniqueAccountNameAndTxnId) ?
                                                                                    <OverlayTrigger placement='top' overlay={
                                                                                        <Tooltip id="popover-contained">
                                                                                            <div className='tooltip-text-size m-0'>You Updated this transaction on {toUtc(transaction.updatedAt)}</div>
                                                                                        </Tooltip>
                                                                                    }>
                                                                                        <img className={`${style.flag} ms-2`} src={imageHost + '/flag-txn.svg'} alt="flag" />
                                                                                    </OverlayTrigger>
                                                                                    :
                                                                                    <></>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div className={`row ${style.mobileTxnRow} w-100 m-auto`}>
                                                                        <div className="col-6">Type</div>
                                                                        <div className={editClicked && check === transaction.uniqueAccountNameAndTxnId ? "col-12" : "col-6 text-center"}>
                                                                            {
                                                                                editClicked && check === transaction.uniqueAccountNameAndTxnId ?
                                                                                    <>
                                                                                        <div className="dropdown">
                                                                                            <button onClick={() => { searchCategory(transaction.txnCategory); }} className={`dropdown-toggle btn ${style.editDropdownBtn}`} type='button' data-bs-toggle="dropdown">
                                                                                                {newCategory ? convertToDisplay(newCategory) : transaction.userTxnCategory ? convertToDisplay(transaction.userTxnCategory) : convertToDisplay(transaction.txnCategory)}
                                                                                            </button>
                                                                                            <div className={`dropdown-menu ${style.dropdownMenu}`}>
                                                                                                {
                                                                                                    gettingTypesLoader && check === transaction.uniqueAccountNameAndTxnId ?
                                                                                                        <div className="text-center"><img src={imageHost + '/loader-small.gif'} alt="loading" /></div> :
                                                                                                        <>
                                                                                                            <input type="text" className='search-type w-100' name="search-type" placeholder='search type' onChange={(e) => { setSearch(e.target.value) }} />
                                                                                                            {
                                                                                                                categories.map((type: any) => {
                                                                                                                    if (type.displayName.toLowerCase().includes(searchFilter.toLowerCase()) || type.displayName.toUpperCase().includes(searchFilter.toUpperCase())) {
                                                                                                                        return (
                                                                                                                            <>
                                                                                                                                {
                                                                                                                                    type.name === 'SELF_TRANSFER_INWARD' ?
                                                                                                                                        <>
                                                                                                                                            <button onClick={() => { setNewCategory(type.name); getMappedTxn(type.name); setShowPopUp(true); setSearch("") }}>{type.displayName}</button>

                                                                                                                                        </> :
                                                                                                                                        <>{
                                                                                                                                            type.name === 'SWITCH_TRADE_INWARD' ?
                                                                                                                                                <>
                                                                                                                                                    <button onClick={() => { setNewCategory(type.name); getMappedTxn(type.name); setSwitchTradePop(true); setSearch("") }}>{type.displayName}</button>
                                                                                                                                                </> :
                                                                                                                                                <>
                                                                                                                                                    {
                                                                                                                                                        type.name === 'SWAP_TRADE_INWARD' || type.name === 'SWAP_TRADE_OUTWARD' ?
                                                                                                                                                            <>
                                                                                                                                                                <button onClick={() => { setNewCategory(type.name); getMappedTxn(type.name); setSwapTradePop(true); setSearch("") }}>{type.displayName}</button>
                                                                                                                                                            </> :
                                                                                                                                                            <>
                                                                                                                                                                <button onClick={() => { setNewCategory(type.name); setSearch("") }}>{type.displayName}</button>
                                                                                                                                                            </>
                                                                                                                                                    }
                                                                                                                                                </>
                                                                                                                                        }</>

                                                                                                                                }
                                                                                                                            </>

                                                                                                                        )
                                                                                                                    }
                                                                                                                })
                                                                                                            }
                                                                                                        </>
                                                                                                }

                                                                                            </div>
                                                                                        </div>
                                                                                    </> :
                                                                                    <> {transaction.userTxnCategory ? convertToDisplay(transaction.userTxnCategory) : convertToDisplay(transaction.txnCategory)}</>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div className={`row ${style.mobileTxnRow} w-100 m-auto`}>
                                                                        <div className="col-6">Date</div>
                                                                        <div className={editClicked && check === transaction.uniqueAccountNameAndTxnId ? "col-12" : "col-6 text-center"}>
                                                                            {
                                                                                editClicked && check === transaction.uniqueAccountNameAndTxnId ?
                                                                                    <>
                                                                                        <div>
                                                                                            <input type="datetime-local" name="new-date" id="date" defaultValue={newDate ? newDate : transaction.userTxnDate ? transaction.userTxnDate : transaction.txnDate} onChange={(e) => { console.log(e.target.value); setNewDate(e.target.value) }}
                                                                                            />
                                                                                        </div>

                                                                                    </> :
                                                                                    <>
                                                                                        {transaction.userTxnDate ? <>{toUtc(transaction.userTxnDate)}</>
                                                                                            : transaction.txnDate ? <>{toUtc(transaction.txnDate)}</> : <></>}
                                                                                    </>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div className={`row ${style.mobileTxnRow} w-100 m-auto`}>
                                                                        <div className="col-6">In Amount</div>
                                                                        <div className={editClicked && check === transaction.uniqueAccountNameAndTxnId ? "col-12" : "col-6 text-center"}>
                                                                            {
                                                                                editClicked && check === transaction.uniqueAccountNameAndTxnId ?
                                                                                    <>
                                                                                        <div className={`${style.editOutAmount} position-relative`}>
                                                                                            {transaction.parts.map((key: any, index: any) => {
                                                                                                return <>
                                                                                                    {key.direction === "RECEIVED" ? <><input className='w-100' type="text" defaultValue={key.amount} name="set-out-amount" id="set-out-amount" readOnly />
                                                                                                        <button className={`position-absolute ${style.editDropdown} text-start`} onClick={() => { setInDropdown(!inDropdown); closeDropdowns('inAmount') }}>{inCurrency ? inCurrency : key.userCurrency ? key.userCurrency : key.currency}<img src={imageHost + '/search-currency.svg'} alt="search-currency" title='search-currency' /></button>
                                                                                                        {
                                                                                                            inDropdown ? <>
                                                                                                                <div className={`${style.searchCurrency} p-0 position-absolute`}>
                                                                                                                    <input type="text" className={`${style.searchBar}`} onChange={(e) => { getInCurrencies(e.target.value) }} name="search-currency" placeholder='Search Currency' id="" />
                                                                                                                    {
                                                                                                                        searchedInCurrency.map(currency => {
                                                                                                                            return (<>
                                                                                                                                <button className='text-start w-100' onClick={() => { setInCurrency(currency.currency); setInDropdown(false) }}><div className={`${style.currency} w-100`}>{currency.currency} - {currency.name}</div></button>
                                                                                                                            </>)
                                                                                                                        })
                                                                                                                    }
                                                                                                                </div>
                                                                                                            </> : <></>
                                                                                                        }
                                                                                                    </> :
                                                                                                        <></>}
                                                                                                </>
                                                                                            })}
                                                                                        </div>
                                                                                    </> :
                                                                                    <>
                                                                                        {transaction.parts.map((key: any, index: any) => {
                                                                                            return <>
                                                                                                {key.direction === "RECEIVED" && key.currency !== "USD" ? <><img className={`${style.currencyImg}`} src={key.currencyDetails ? key.currencyDetails.logo_url ? `${key.currencyDetails.logo_url}` : imageHost + '/default-crypto-icon.svg' : imageHost + '/default-crypto-icon.svg'} alt="" /> <span>{key.amount} {key.userCurrency ? key.userCurrency : key.currency}</span></> :
                                                                                                    <>
                                                                                                        {key.direction === "RECEIVED" && key.currency === "USD" ? <><div><img className={`${style.currencyImg}`} src={imageHost + "/dollor-transaction.svg"} alt="" /> {key.amount.toFixed(2)} {key.userCurrency ? key.userCurrency : key.currency}</div></> : <> {index === 0 && transaction.parts.length === 1 ? <><div className=' ps-4'>--</div></> : <></>}</>}
                                                                                                    </>}
                                                                                            </>
                                                                                        })}
                                                                                    </>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div className={`row ${style.mobileTxnRow} w-100 m-auto`}>
                                                                        <div className="col-6">Out Amount</div>
                                                                        <div className={editClicked && check === transaction.uniqueAccountNameAndTxnId ? "col-12" : "col-6 text-center"}>
                                                                            {
                                                                                editClicked && check === transaction.uniqueAccountNameAndTxnId ?
                                                                                    <>
                                                                                        <div className={`${style.editOutAmount} position-relative`}>
                                                                                            {transaction.parts.map((key: any, index: any) => {
                                                                                                return <>
                                                                                                    {key.direction === "SENT" ? <><input className='w-100' type="text" defaultValue={key.amount} name="set-out-amount" id="edit-amount" readOnly />
                                                                                                        <button className={`position-absolute ${style.editDropdown} text-start`} onClick={() => { setCurrencyDropdown(!currencyDropdown); closeDropdowns('outAmount') }}>
                                                                                                            {outCurrency ? outCurrency : key.currency}
                                                                                                            <img src={imageHost + '/search-currency.svg'} title='search-currency' alt="search-currency" />
                                                                                                        </button>
                                                                                                        {
                                                                                                            currencyDropdown ? <>
                                                                                                                <div className={`${style.searchCurrency} position-absolute`}>
                                                                                                                    <input type="text" className={`${style.searchBar}`} onChange={(e) => { getOutCurrencies(e.target.value) }} name="search-currency" placeholder='Search Currency' id="" />
                                                                                                                    {
                                                                                                                        searchedCurrency.map(currency => {
                                                                                                                            return (<>
                                                                                                                                <button className='text-start w-100' onClick={() => { setOutCurrency(currency.currency); setCurrencyDropdown(false) }}><div className={`${style.currency} w-100`}>{currency.currency} - {currency.name}</div></button>
                                                                                                                            </>)
                                                                                                                        })
                                                                                                                    }
                                                                                                                </div>
                                                                                                            </> : <></>
                                                                                                        }
                                                                                                    </> :
                                                                                                        <></>}
                                                                                                </>
                                                                                            })}
                                                                                        </div>
                                                                                    </> :
                                                                                    <>
                                                                                        {transaction.parts.map((key: any, index: any) => {
                                                                                            return <>
                                                                                                {key.direction === "SENT" && key.currency !== "USD" ? <><img className={`${style.currencyImg}`} src={key.currencyDetails ? key.currencyDetails.logo_url ? `${key.currencyDetails.logo_url}` : imageHost + '/default-crypto-icon.svg' : imageHost + '/default-crypto-icon.svg'} alt="" /> <span>{key.amount} {key.userCurrency ? key.userCurrency : key.currency}</span></> :
                                                                                                    <>
                                                                                                        {key.direction === "SENT" && key.currency === "USD" ? <><div><img className={`${style.currencyImg}`} src={imageHost + "/dollor-transaction.svg"} alt="" /> {key.amount.toFixed(2)} <span>{key.userCurrency ? key.userCurrency : key.currency}</span></div></> : <> {index === 0 && transaction.parts.length === 1 ? <><div className='ps-4'>--</div></> :
                                                                                                            <></>}</>}
                                                                                                    </>}
                                                                                            </>
                                                                                        })}
                                                                                    </>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div className={`row ${style.mobileTxnRow} w-100 m-auto`}>
                                                                        <div className="col-6">Native Amount</div>
                                                                        <div className={editClicked && check === transaction.uniqueAccountNameAndTxnId ? "col-12" : "col-6 text-center"}>
                                                                            {
                                                                                transaction.txnStatus === 'PENDING' ?
                                                                                    <OverlayTrigger
                                                                                        placement='top'
                                                                                        overlay={
                                                                                            <Tooltip id="popover-contained">
                                                                                                <div>This transaction is pending confirmation from exchange</div>
                                                                                            </Tooltip>
                                                                                        }>
                                                                                        <div className='ps-4'>Pending</div>
                                                                                    </OverlayTrigger> :
                                                                                    <>
                                                                                        {
                                                                                            editClicked && check === transaction.uniqueAccountNameAndTxnId && checkParts(transaction.parts, transaction.txnType) ?
                                                                                                <>
                                                                                                    <input type="text" onChange={(e) => { setNativeAmount(e.target.value); setShowNativeWarning(true); }} className='w-75 edit-native' name="edit-native-amount" defaultValue={checkParts(transaction.parts, transaction.txnType)?.userNativeAmount !== null ? checkParts(transaction.parts, transaction.txnType)?.userNativeAmount : checkParts(transaction.parts, transaction.txnType)?.nativeAmount} />
                                                                                                </> :
                                                                                                <>
                                                                                                    {
                                                                                                        checkParts(transaction.parts, transaction.txnType) ?
                                                                                                            <>

                                                                                                                <img className={`${style.currencyImg}`} src={imageHost + "/dollor-transaction.svg"} alt="" />
                                                                                                                <OverlayTrigger
                                                                                                                    placement='top'
                                                                                                                    overlay={
                                                                                                                        <Tooltip id="popover-contained">
                                                                                                                            <div>{checkParts(transaction.parts, transaction.txnType)?.userNativeAmount !== null ? checkParts(transaction.parts, transaction.txnType)?.userNativeAmount : checkParts(transaction.parts, transaction.txnType)?.nativeAmount} {checkParts(transaction.parts, transaction.txnType)?.nativeCurrency}</div>
                                                                                                                        </Tooltip>
                                                                                                                    }
                                                                                                                >
                                                                                                                    <span>{displayNativeAmount(transaction) < 0.01 && displayNativeAmount(transaction) > 0 ? '>0.00' : displayNativeAmount(transaction)} {checkParts(transaction.parts, transaction.txnType)?.nativeCurrency}</span>
                                                                                                                </OverlayTrigger>
                                                                                                            </> :
                                                                                                            <><div className='ps-4'>--</div></>
                                                                                                    }
                                                                                                </>
                                                                                        }
                                                                                    </>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div className={`row ${style.mobileTxnRow} w-100 m-auto`}>
                                                                        <div className="col-6">Fee</div>
                                                                        <div className="col-6 text-center">
                                                                            {
                                                                                transaction.fees.length !== 0 ?
                                                                                    <>
                                                                                        {transaction.fees.map((fee: any) => {
                                                                                            {/* Showing the original fee in tooltip */ }
                                                                                            return (
                                                                                                <>
                                                                                                    <OverlayTrigger placement='top' overlay={
                                                                                                        <Tooltip id="popover-contained">
                                                                                                            <div className='tooltip-text-size m-0'>{fee.amount}</div>
                                                                                                        </Tooltip>
                                                                                                    }>
                                                                                                        <div>{fee.amount < 0.01 && fee.amount > 0 ? '>0.00' : fee.amount.toFixed(2)} {fee.currency}</div>
                                                                                                    </OverlayTrigger>
                                                                                                </>
                                                                                            )

                                                                                        })}
                                                                                    </> :
                                                                                    <>--</>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {
                                                                    showNativeWarning && check === transaction.uniqueAccountNameAndTxnId && nativeAmount ?
                                                                        <div className={`${style.nativeWarning} text-center`}>
                                                                            <div className='w-100'>You are updating native value from {checkParts(transaction.parts, transaction.txnType)?.userNativeAmount !== null ? checkParts(transaction.parts, transaction.txnType)?.userNativeAmount : checkParts(transaction.parts, transaction.txnType)?.nativeAmount} to {nativeAmount}</div>
                                                                        </div> :
                                                                        <></>
                                                                }

                                                                {
                                                                    showErr && check === transaction.uniqueAccountNameAndTxnId ?
                                                                        <>
                                                                            <div className={`${style.error} text-center`}><div className='w-100'><div><img className='me-2' src={imageHost + '/exclamation.svg'} alt="" /><b>Error : </b>{errMsg ? errMsg : "Something Went Wrong, Please try again later"}</div></div></div>
                                                                        </> :
                                                                        showSuccess && check === transaction.uniqueAccountNameAndTxnId ?
                                                                            <>
                                                                                <div className={`${style.success} text-center`}><div className='w-100'><div className='position-relative'>Data Saved Successfully! <button onClick={() => { setEditClicked(false); setShowSuccess(false); setNewCategory(null); setClicked('saved'); }} className='position-absolute'><img src={imageHost + '/close-success.svg'} alt="" /></button></div></div></div>
                                                                            </> :
                                                                            <></>
                                                                }
                                                            </>
                                                        )
                                                    })
                                                }
                                            </>
                                    }

                                </div>
                            </>
                    }
                </div>

            </div>
        </>
    )

}

export default Transactions