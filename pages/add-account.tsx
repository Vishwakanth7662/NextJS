import axios from 'axios';
import React, { useEffect, useState } from 'react'
import MainService from '../services/main-service';
import nookies from 'nookies'
import { useRouter } from 'next/router';
import getTokens from "../components/newtoken";
import ClientService from "../services/main-serviceClient";
import Link from 'next/link';
import check401 from '../components/401-check';
import getInsideAllPromiseFunction from "../components/getInsideAllServerPromise";
import LeftFeed from '../components/shared/left-feed';
import RightFeed from '../components/shared/right-feed';
import Allaccounts from "../components/addAccount/all-accounts";
import ConnectedAccount from '../components/addAccount/connected-accounts';
import styles from "../styles/add-account/add-account.module.scss";
import getCurrenturl from "../components/currentUrlCheck";

let mainservice: any = MainService("get")
var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;
let allAccounts: any;
let errorConnected: any;
let errorTotal: any;
let connectStatus: any = null;
let s2sAccountName: any = null;
let s2sAccountDisplayName: any = null;
let getUniqueAccountName: any = null;
let getUserDefinedName: any = null;
let message: any = null;
let code: any = null;
let accountId: any = null;
let connectionState: any = null;

function callingAllAccounts(tokens: any | null) {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await mainservice('supported/accounts', 'ups', null);
            allAccounts = res.data;
            resolve(allAccounts)
        }
        catch (e: any) {
            reject(e);
        }
    })
}

function callingConnectedAccounts(tokens: any) {
    let data: any;
    return new Promise(async (resolve, reject) => {
        try {
            let res = await mainservice("user/accounts", "ups", null, tokens);
            data = res.data;
            resolve(data);
            console.log("Response in data");
        } catch (e: any) {
            reject(e);
        }
    })
}
export async function getServerSideProps(context: any) {
    const cookies = nookies.get(context);
    getCurrenturl(context)
    let fnsArr = [callingAllAccounts, callingConnectedAccounts]
    let storePromise = await getData(cookies.accessTokens, context, fnsArr)
    return storePromise
}
async function getData(tokens: any, context: any, fnsArr: any[]) {
    let supportedAcc: any;
    let userAccount: any;
    if (context.query) {
        connectStatus = context.query.status;
        s2sAccountName = context.query.account;
        s2sAccountDisplayName = context.query.accountDisplay;
        getUniqueAccountName = context.query.uniqueaccountname;
        getUserDefinedName = context.query.userdefinedName;
        message = context.query.message ? context.query.message : {};
        code = context.query.error_type ? context.query.error_type : {};
        connectionState = context.query.state ? context.query.state : {};
        accountId = context.query.code ? context.query.code : {};
    }
    console.log("Connect");
    console.log(connectStatus, s2sAccountName, s2sAccountDisplayName, getUniqueAccountName, getUserDefinedName, message, code, connectionState, accountId);
    let storePromise = await getInsideAllPromiseFunction(tokens, context, fnsArr)
    console.log("StorePromise props");
    if (storePromise.props) {
        storePromise.props.forEach((ele: any, i: any) => {
            if (i === 0) {
                supportedAcc = ele.value.allSupportedAccounts
            } else {
                userAccount = ele.value.allConnectedAccounts
            }

        })
        if (supportedAcc) {
            if (connectStatus !== undefined && s2sAccountName !== undefined && s2sAccountDisplayName !== undefined && getUniqueAccountName !== undefined && getUserDefinedName !== undefined) {
                return {
                    props: {
                        connectStatus: connectStatus,
                        s2sAccountName: s2sAccountName,
                        s2sAccountDisplayName: s2sAccountDisplayName,
                        getUniqueAccountName: getUniqueAccountName,
                        getUserDefinedName: getUserDefinedName,
                        allAccounts: supportedAcc,
                        connectedAccounts: userAccount,
                        connectionState: {},
                        accountId: {},
                        code: {},
                        message: {}
                    }
                }
            } else if (accountId) {
                return {
                    props: {
                        connectionState: connectionState,
                        accountId: accountId,
                        allAccounts: supportedAcc,
                        connectedAccounts: userAccount,
                        code: {},
                        message: {},
                        connectStatus: {},
                        s2sAccountName: {},
                        s2sAccountDisplayName: {},
                        getUniqueAccountName: {},
                        getUserDefinedName: {},
                    }
                }
            }
        } else {
            return {
                props: {
                    allAccounts: supportedAcc,
                    connectedAccounts: userAccount,
                    connectStatus: {},
                    s2sAccountName: {},
                    s2sAccountDisplayName: {},
                    getUniqueAccountName: {},
                    getUserDefinedName: {},
                    connectionState: {},
                    accountId: {},
                    code: {},
                    message: {}
                }
            }
        }
    }
    return storePromise
}

interface userAccountsArr {
    "account": {
        "accountNameInLC": string,
        "accountDisplayName": string,
        "supportedFlowType": null,
        "accountType": null
    },
    "uaStatus": string,
    "syncCompletedAt": string,
    "syncTxnStatus": string,
    "totalTxns": string,
    "createdAt": string,
    "uniqueAccountName": string
}

type AllSupportedAccounts = {
    accountNameInLC: string,
    accountDisplayName: string,
    supportedFlowType: [],
}

const userAccountConnectedRequest: any = {
    "accountId": null, "connectionState": null, "error": null
}
const error: any = {
    "code": null, "message": null
}
let localAccount = "";
// variable used in syncing
let timer: any;
let clickedsync = "";
let connectedAccountsMap = new Map<string, Array<userAccountsArr>>();
let allUserInprogressAccountsArray = new Array<userAccountsArr>();
let allUserExpiredAccountsArray = new Array<userAccountsArr>();
let allUserConnectedAccountsArray = new Array<userAccountsArr>();
let totalNumberOfAccounts = new Map<string, number>();
// After getting redirection
let booleanValue: any = true;
let isUserConnectedAccountsCallRequire = true;
let progressBarImageSource: any;
let progressAccount: any;

const Addaccount = (props: any) => {
    console.log(props.connectStatus, props.s2sAccountName, props.s2sAccountDisplayName, props.getUniqueAccountName, props.getUserDefinedName, props.message, props.code, props.connectionState, props.accountId);
    console.log(props);
    allUserInprogressAccountsArray = [];
    allUserExpiredAccountsArray = [];
    allUserConnectedAccountsArray = [];
    connectedAccountsMap = new Map;
    totalNumberOfAccounts = new Map();
    let allUsersAccounts = props.connectedAccounts;
    console.log(allUsersAccounts);
    allUsersAccounts.forEach((element: any) => {
        let numberOfAccount = totalNumberOfAccounts.get(element.account.account);
        if (numberOfAccount === undefined || numberOfAccount === null) {
            numberOfAccount = 0;
        }
        numberOfAccount = Number(numberOfAccount) + 1;
        totalNumberOfAccounts.set(element.account.account, numberOfAccount)
        if (element.uaStatus === "CONNECTED") {
            let arrayOfConnectedAccounts = connectedAccountsMap.get(element.account.account);
            if (arrayOfConnectedAccounts === undefined || arrayOfConnectedAccounts === null) {
                arrayOfConnectedAccounts = new Array<userAccountsArr>();
            }
            arrayOfConnectedAccounts.push(element);
            connectedAccountsMap.set(element.account.account, arrayOfConnectedAccounts)
        }
        else if (element.uaStatus === "IN_PROGRESS" || element.uaStatus === "TEMP_ERROR") {
            allUserInprogressAccountsArray.push(element);
        } else {
            allUserExpiredAccountsArray.push(element);
        }
    })
    connectedAccountsMap.forEach((element: any) => {
        allUserConnectedAccountsArray.push(element);
    })
    const [inprogAccounts, setinprogAccounts] = useState<any>(allUserInprogressAccountsArray);
    const [expiredAccounts, setexpiredAccounts] = useState<any>(allUserExpiredAccountsArray);
    const [connectedAccounts, setConnectedAccounts] = useState<any>(allUserConnectedAccountsArray ? allUserConnectedAccountsArray : null);
    const [accounts, setAccounts] = useState(props.allAccounts ? props.allAccounts : []);
    const [isErrorMain, setisErrorMain] = useState(errorTotal ? true : false);
    const [isErrorinProgBar, setisErrorinProgBar] = useState("");
    const [checkingResponse, setcheckingResponse] = useState(props.allAccounts ? true : false);
    const [errorTemp, setErrorTemp] = useState("");
    const [accountAddingActivation, setaccountAddingActivation] = useState("idle");
    const [inprogdiv, setinprogdiv] = useState(true);
    const [progressBarActivation, setprogressBarActivation] = useState("idle");
    const [loaderActivation, setloaderActivation] = useState("idle");
    const [syncingprogress, setsyncingprogress] = useState("idle");
    const [fetchingsuccess, setfetchingsuccess] = useState("idle");
    const [warningSignActivation, setwarningSignActivation] = useState("idle");
    const [waringSignActivateBecauseOfError, setwaringSignActivateBecauseOfError] = useState("idle");
    const [waringSignActivateBecauseOfErrorReason, setwaringSignActivateBecauseOfErrorReason] = useState("");
    const [syncsuccesprogress, setsyncsuccesprogress] = useState("idle");
    const [warningProgress, setwarningProgress] = useState("inprogress");
    const [currentProgressValue, setcurrentProgressValue] = useState("");
    const [smallLoader, setsmallLoader] = useState("");
    const [disbalingDeleteButtonAsSyncing, setdisbalingDeleteButtonAsSyncing] = useState("")
    const [allaccountdisable, setallaccountdisable] = useState("idle")
    const [retryaccount, setretryaccount] = useState(Array());
    const [issyncEnabled, setissyncEnabled] = useState(false);
    const [syncsuccess, setsyncsuccess] = useState("idle")
    const [warningInSync, setwarningInSync] = useState("idle")
    const [background, setbackground] = useState(0)
    const [reload, setrelod] = useState(false);
    const [warningTrigger, setwarningTrigger] = useState("idle");
    const [progresscontinue, setprogresscontinue] = useState("idle");
    const [showdeletewarning, setshowDeletewarning] = useState("idle");
    const [isLoader, setisLoader] = useState(props.allAccounts ? false : true);

    function checkqueryParams() {
        if (props.connectStatus === "connected") {
            console.log("In Connected");
            isUserConnectedAccountsCallRequire = false;
            // userConnectedAccounts();
            progressBarImageSource = props.s2sAccountName;
            progressAccount = props.s2sAccountDisplayName;
            setaccountAddingActivation("inprogress");
            setloaderActivation("inprogress");
            setprogressBarActivation("inprogress")
            // await timeout(900);
            console.log("props.getUniqueAccountName");
            console.log(props.getUniqueAccountName);
            userAccountTriggerSync(props.getUniqueAccountName, booleanValue);
            setinprogdiv(false);
        }
        //--------------------If vezgo redirect back to this page-------------------------------
        else if (props.saccountId != null || props.code != null) {
            console.log("In else if");
            //If redirect back with account and state or code and state
            if (props.accountId != null) {
                isUserConnectedAccountsCallRequire = false;
                userAccountConnectedRequest.accountId = props.accountId;
                userAccountConnectedRequest.connectionState = props.connectionState;
                setinprogdiv(false);
            }
            //If redirect back with state, error_type and message
            if (props.code != null) {
                error.code = props.code;
                error.message = props.message;
                setErrorTemp(error.message);
                userAccountConnectedRequest.connectionState = props.connectionState;
                userAccountConnectedRequest.error = props.error;
                setinprogdiv(true);
            }
            userAccountConnectedAPICall();
        }
    }

    // User account connected... (API call to UPS)
    const userAccountConnectedAPICall = async () => {
        const clientservice: any = ClientService("post");
        try {
            const userAccountConnectedApi = await clientservice("/api/v1/add-account/userConnectedApiCall", userAccountConnectedRequest, "ups", null);
            if (userAccountConnectedApi.data.error == null) {
                console.log("Connected Response");
                progressBarImageSource = userAccountConnectedApi.data.accountNameInLC;
                progressAccount = userAccountConnectedApi.data.accountDisplayName;
                getUserDefinedName = userAccountConnectedApi.data.userDefinedAccountName;
                setaccountAddingActivation("inprogress");
                setloaderActivation("inprogress");
                userAccountTriggerSync(userAccountConnectedApi.data.uniqueAccountName, booleanValue);
            } else {
                console.log("else connected Response");
                setErrorTemp(userAccountConnectedApi.data.error.message);
                setprogressBarActivation("inprogress");
            }
        } catch (e: any) {
            console.log("Catch block runs");
            setprogressBarActivation("inprogress")
            console.log(e);
            setinprogdiv(true);
            setErrorTemp(e.data.error.message);
            setloaderActivation("error");
        }
    }


    console.log("progressBarImageSource");
    console.log(progressBarImageSource);
    console.log(progressAccount);
    console.log(isUserConnectedAccountsCallRequire);
    useEffect(() => {
        checkqueryParams();
        console.log("effect run");
        
    }, [])
    function syncingstart(accountName: any) {
        let syncingimageelement = document.getElementById("img" + accountName);
        let syncingbtnelement = document.getElementById("btn" + accountName);
        let deleteelement = document.getElementById("delete" + accountName);
        deleteelement!.style.opacity = "0.5";
        syncingimageelement!.style.display = "block";
        syncingbtnelement!.style.display = "none";
    }
    function syncingstartMain(accountName: any) {
        let syncingimageelement = document.getElementById("img_main" + accountName);
        let syncingbtnelement = document.getElementById("btn_main" + accountName);
        syncingimageelement!.style.display = "block";
        syncingbtnelement!.style.display = "none";
    }
    function syncingendMain(accountName: any) {
        let syncingimageelement = document.getElementById("img_main" + accountName);
        syncingimageelement!.style.display = "none";
        let syncingbtnelement = document.getElementById("btn_main" + accountName);
        syncingbtnelement!.style.display = "inline";
    }
    function syncingend(accountName: any) {
        let syncingimageelement = document.getElementById("img" + accountName);
        syncingimageelement!.style.display = "none";
        let syncingbtnelement = document.getElementById("btn" + accountName);
        syncingbtnelement!.style.display = "block";
        let deleteelement = document.getElementById("delete" + accountName);
        deleteelement!.style.opacity = "1";
    }
    function deletingAccount(selectedElementToDelete: any) {
        let syncingimageelement = document.getElementById("image" + selectedElementToDelete);
        syncingimageelement!.style.display = "block";
        let syncingbtnelement = document.getElementById("delete" + selectedElementToDelete);
        syncingbtnelement!.style.display = "none";
        let deleteelement = document.getElementById("btn" + selectedElementToDelete);
        deleteelement!.style.opacity = "0.5";
    }
    function deletingAccountInprog(selectedElementToDelete: any) {
        let syncingimageelement = document.getElementById("image" + selectedElementToDelete);
        syncingimageelement!.style.display = "block";
        let syncingbtnelement = document.getElementById("delete" + selectedElementToDelete);
        syncingbtnelement!.style.display = "none";
    }
    function deletingAccountEndInprog(selectedElementToDelete: any) {
        let syncingimageelement = document.getElementById("image" + selectedElementToDelete);
        syncingimageelement!.style.display = "none";
        let syncingbtnelement = document.getElementById("delete" + selectedElementToDelete);
        syncingbtnelement!.style.display = "block";
    }
    function deletingAccountEnd(accountName: any) {
        let syncingimageelement = document.getElementById("image" + accountName);
        syncingimageelement!.style.display = "none";
        let syncingbtnelement = document.getElementById("delete" + accountName);
        syncingbtnelement!.style.display = "block";
        let deleteelement = document.getElementById("btn" + accountName);
        deleteelement!.style.opacity = "1";
    }
    // Triger Sync api hit
    const userAccountTriggerSync = async (accountName: any, booleanValue: boolean) => {
        const clientservice: any = ClientService("post");
        setdisbalingDeleteButtonAsSyncing(accountName);
        localAccount = accountName;
        setissyncEnabled(true);
        try {
            const userAccountTriggerSyncApi = await clientservice(`/api/v1/add-account/triggerSync?accountoSync=${accountName}`, null, null);
            setprogressBarActivation("inprogress");
            console.log("trigger call done");
            setloaderActivation("idle");
            setsyncingprogress("inprogress")
            if (booleanValue === false) {
                setaccountAddingActivation("idle");
                syncingstart(accountName);
            } else {
                setprogresscontinue("inprogress");
                setaccountAddingActivation("inprogress");
            }
            if (userAccountTriggerSyncApi.data.error === null && userAccountTriggerSyncApi.data.status === "COMPLETED") {
                console.log("Completed syncing account");
                syncUserAccountTxnAndAccount(accountName, booleanValue, timer);
                setdisbalingDeleteButtonAsSyncing("");
                setissyncEnabled(false);
            } else {
                setwarningInSync(accountName)
                setwaringSignActivateBecauseOfError("inprogress");
                setprogresscontinue("idle");
                setwaringSignActivateBecauseOfErrorReason(userAccountTriggerSyncApi.data.error)
                setdisbalingDeleteButtonAsSyncing("idle")
                if (booleanValue === false) {
                    syncingend(accountName);
                }
            }
        } catch (e: any) {
            setprogressBarActivation("inprogress");
            console.log(e);
            stopInterval(timer);
            setloaderActivation("idle")
            setsyncingprogress("idle");
            setprogresscontinue("idle");
            if (booleanValue === false) {
                syncingend(accountName);
            }
            setissyncEnabled(false);
            setwarningInSync(accountName);
            setwarningSignActivation("inprogress");
            setisErrorinProgBar("inprogress")
            setwaringSignActivateBecauseOfError("inprogress")
            setwaringSignActivateBecauseOfErrorReason(e.data.error);
        }
    }

    // Sync txns
    const syncUserAccountTxnAndAccount = async (accountName: any, booleanValue: boolean, timer: any) => {
        const clientservice: any = ClientService("post");
        setsmallLoader(accountName);
        setdisbalingDeleteButtonAsSyncing(accountName);
        setissyncEnabled(true);
        try {
            const syncUserAccountTxnAndAccountApi = await clientservice(`/api/v1/add-account/syncAccount?accountoSync=${accountName}`, null, null);
            if (syncUserAccountTxnAndAccountApi.data.status === "IN_PROGRESS") {
                console.log("syncing account in progress");
                setTimeout(() => {
                    syncUserAccountTxnAndAccount(accountName, booleanValue, timer);
                }, 10000);
            }
            else if (syncUserAccountTxnAndAccountApi.data.status === "ERROR" || syncUserAccountTxnAndAccountApi.data.error !== null) {
                setwarningSignActivation("inprogress");
                setisErrorinProgBar("inprogress")
                setprogresscontinue("idle")
                setwaringSignActivateBecauseOfError("inprogress");
                setwaringSignActivateBecauseOfErrorReason(syncUserAccountTxnAndAccountApi.data.error);
                setdisbalingDeleteButtonAsSyncing("");
                setallaccountdisable("idle");
                setsyncingprogress("idle");
                setissyncEnabled(false);
                if (booleanValue === false) {
                    syncingend(accountName);
                    setwarningInSync(accountName);
                    setshowDeletewarning("idle");
                    setwaringSignActivateBecauseOfError("inprogress");
                    setwaringSignActivateBecauseOfErrorReason(syncUserAccountTxnAndAccountApi.data.error)
                    setdisbalingDeleteButtonAsSyncing("");
                    setallaccountdisable("idle");
                    setsyncingprogress("idle");
                    setrelod(true);
                }
            }
            else {
                console.log("syncing account completed");
                setsyncingprogress("idle")
                setfetchingsuccess("inprogress");
                setrelod(true);
                setdisbalingDeleteButtonAsSyncing("");
                setissyncEnabled(false);
                setallaccountdisable("idle");
                if (booleanValue === false) {
                    syncingend(accountName);
                    setsyncsuccess(accountName);
                } else {
                    setprogresscontinue("idle");
                    setsyncsuccesprogress("inprogress");
                }
            }
        } catch (e: any) {
            console.log(e);
            setwarningSignActivation("inprogress");
            setisErrorinProgBar("inprogress")
            setwaringSignActivateBecauseOfError("inprogress");
            stopInterval(timer);
            setwaringSignActivateBecauseOfErrorReason(e.data.error.message);
            setdisbalingDeleteButtonAsSyncing("idle");
            setallaccountdisable("idle");
            setissyncEnabled(false);
            setsyncingprogress("idle");
            if (booleanValue === false) {
                syncingend(accountName);
                setwarningInSync(accountName);
            } else {
                setprogresscontinue("idle");
            }
        }
    }


    // To stop the sync progress
    function stopInterval(timer: any) {
        if (timer) {
            clearInterval(timer);
        }
    }
    console.log(props.allAccounts);

    // Deleting the selected account
    const deleteAccount = async (selectedElementToDelete: any, booleanValue: boolean) => {
        const clientserviceDelete: any = ClientService("delete");
        console.log(selectedElementToDelete);
        clickedsync = selectedElementToDelete;
        console.log("delete called");

        if (booleanValue === false) {
            deletingAccountInprog(selectedElementToDelete);
        } else {
            deletingAccount(selectedElementToDelete);
        }
        try {
            const deletecall = await clientserviceDelete(`/api/v1/add-account/deleteAccount?accountToDelete=${selectedElementToDelete}`, null, null)
            console.log(deletecall);
            if (deletecall.data.error === null) {
                setshowDeletewarning("idle");
                if (booleanValue === false) {
                    deletingAccountEndInprog(selectedElementToDelete);
                } else {
                    deletingAccountEnd(selectedElementToDelete);
                }
                // userConnectedAccounts();
            } else {
                if (booleanValue === false) {
                    deletingAccountEndInprog(selectedElementToDelete);
                } else {
                    deletingAccountEnd(selectedElementToDelete);
                }
                setwarningInSync("inprogress");
                setwaringSignActivateBecauseOfError("inprogress");
                setwaringSignActivateBecauseOfErrorReason(deletecall.data.error.message);
            }
        } catch (e: any) {
            if (booleanValue === false) {
                deletingAccountEndInprog(selectedElementToDelete);
            } else {
                deletingAccountEnd(selectedElementToDelete);
            }            
            console.log(e);
            setshowDeletewarning("idle");
            setwarningInSync(selectedElementToDelete);
            setwaringSignActivateBecauseOfError("inprogress");
            setwaringSignActivateBecauseOfErrorReason(e.data.error.message);
        }
    }
    // Showing the delete warning
    function connectedDelete(event: any) {
        clickedsync = event;
        console.log(event);
        setshowDeletewarning(event);
        setwarningInSync("idle");
    }
    // Hiding the delete warning
    function hideWarning(event: any) {
        setrelod(true);
        setshowDeletewarning("idle");
        setwarningSignActivation("idle");
        setwarningProgress(event);
        setsyncsuccesprogress("idle");
        setprogresscontinue("idle");
    }
    function hideSyncwarning(account: any) {
        setwarningInSync("idle")
        setsyncsuccess("idle");
    }

    const [accs, setAccs] = useState<any>();
    const router = useRouter();
    {
        return (
            <>
                {/* <Allaccounts accounts={accounts} /> */}
                <div className="d-block d-lg-flex justify-content-between">
                    <div className="d-none d-lg-block">
                        <LeftFeed />
                    </div>
                    <div>
                        {checkingResponse === true ?
                            <div className={styles.add_account}>
                                {isErrorMain === false ?
                                    <div>
                                        <div id="abc" className={`col-12 mt-3 mb-4 bg-white m-auto container ${styles.main_container}`}>
                                            <div className="row g-0">
                                                <div className={`${styles.go_back} px-4 text-end`}>
                                                    <a className={`btn me-lg-2 ${styles.anchor_port}`}>
                                                        <img src={imageHost + "/arrow-left-port.svg"} alt="" /><span> Portfolio</span>
                                                    </a>
                                                </div>
                                                <div className={`col-12 col-xl-6 ${styles.first_part}`}>
                                                    <Allaccounts isErrorinProgBar={isErrorinProgBar} totalNumberOfAccounts={totalNumberOfAccounts} connectedAccounts={connectedAccounts} inprogressAccounts={inprogAccounts} progressAccount={progressAccount} allUserInprogressAccountsArray={allUserInprogressAccountsArray} progresscontinue={progresscontinue} setwarningSignActivation={setwarningSignActivation} accounts={accounts} errorTemp={errorTemp} progressBarActivation={progressBarActivation} loaderActivation={loaderActivation} userAccountTriggerSync={userAccountTriggerSync} warningSignActivation={warningSignActivation} accountAddingActivation={accountAddingActivation} waringSignActivateBecauseOfError={waringSignActivateBecauseOfError} syncsuccesprogress={syncsuccesprogress} waringSignActivateBecauseOfErrorReason={waringSignActivateBecauseOfErrorReason} background={background} currentProgressValue={currentProgressValue} retryaccount={retryaccount} disbalingDeleteButtonAsSyncing={disbalingDeleteButtonAsSyncing} warningProgress={warningProgress} allaccountdisable={allaccountdisable} localAccount={localAccount} setwarningTrigger={setwarningTrigger} warningTrigger={warningTrigger} fetchingsuccess={fetchingsuccess} syncingprogress={syncingprogress} isLoader={isLoader} getUserDefinedName={getUserDefinedName} deleteAccount={deleteAccount} hideSyncwarning={hideSyncwarning} progressBarImageSource={progressBarImageSource} hideWarning={hideWarning} inprogdiv={inprogdiv} />
                                                    {/* <FormDiv2 /> */}
                                                </div>
                                                <ConnectedAccount inprogressAccounts={inprogAccounts} connectedAccounts={connectedAccounts} expiredAccounts={expiredAccounts} userAccountTriggerSync={userAccountTriggerSync} waringSignActivateBecauseOfError={waringSignActivateBecauseOfError} setwaringSignActivateBecauseOfError={setwaringSignActivateBecauseOfError} setwaringSignActivateBecauseOfErrorReason={setwaringSignActivateBecauseOfErrorReason} waringSignActivateBecauseOfErrorReason={waringSignActivateBecauseOfErrorReason} smallLoader={smallLoader} disbalingDeleteButtonAsSyncing={disbalingDeleteButtonAsSyncing} retryaccount={retryaccount} setwarningInSync={setwarningInSync} warningInSync={warningInSync} setsyncsuccess={setsyncsuccess} syncsuccess={syncsuccess} localAccount={localAccount} setaccountAddingActivation={setaccountAddingActivation} syncingstart={syncingstart} syncingend={syncingend} setdisbalingDeleteButtonAsSyncing={setdisbalingDeleteButtonAsSyncing} isLoader={isLoader} syncingstartMain={syncingstartMain} syncingendMain={syncingendMain} setissyncEnabled={setissyncEnabled} issyncEnabled={issyncEnabled} deleteAccount={deleteAccount} connectedDelete={connectedDelete} showdeletewarning={showdeletewarning} setshowDeletewarning={setshowDeletewarning} hideSyncwarning={hideSyncwarning} hideWarning={hideWarning} />
                                                <div>
                                                    {/* < FormDiv /> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div> :
                                    <div className={styles.error_div_500}>
                                        <img src={imageHost + "/transaction-500-error.svg"} alt="" />
                                        <h2 className={styles.error_heading}>Internal Server Error!</h2>
                                        <p className={styles.error_paragraph}>The server encountered an unexpected condition and we have notified our CRPTM <br /> Support team about the same.Please try again after sometime.</p>
                                        {/* <button className='btn error_button' onClick={() => getAccounts()}>Try Again</button> */}
                                    </div>
                                }
                            </div>
                            :
                            <div className={`${styles.nothing_showing} text-center`}>
                                <img className={styles.loader_image_nothing} src={imageHost + '/loader2.gif'} alt='' />
                            </div>
                        }
                    </div>
                    <div className='d-none d-lg-block'>
                        <RightFeed />
                    </div>
                </div>
            </>

        )
    }
}

export default Addaccount