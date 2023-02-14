import React, { useEffect, useState } from 'react'
import styles from "../styles/my-account/my-account.module.scss";
import LeftFeed from '../components/shared/left-feed';
import RightFeed from '../components/shared/right-feed';
import Allaccounts from "../components/addAccount/all-accounts";
import CompletedAccounts from '../components/myAccounts/connected-accounts';
import ProgressAccount from "../components/myAccounts/inprog-accounts";
import ClientService from "../services/main-serviceClient";
import MainService from '../services/main-service';
import nookies from 'nookies';
import getCurrenturl from "../components/currentUrlCheck";
import getInsideAllPromiseFunction from "../components/getInsideAllServerPromise";

var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;
let mainservice: any = MainService("get")

let allAccounts: any;

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
function callingAllDetails(tokens: any) {
  let data: any;
  return new Promise(async (resolve, reject) => {
    try {
      let res = await mainservice("accounts/details", "ups", null, tokens);
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
  let fnsArr = [callingAllAccounts, callingAllDetails]
  let storePromise = await getData(cookies.accessTokens, context, fnsArr)
  return storePromise
}

async function getData(tokens: any, context: any, fnsArr: any[]) {
  let supportedAcc: any;
  let userAccountDetails: any;
  console.log("Connect");
  let storePromise = await getInsideAllPromiseFunction(tokens, context, fnsArr)
  console.log("StorePromise props");
  console.log(storePromise.props);

  if (storePromise.props) {
    storePromise.props.forEach((ele: any, i: any) => {
      if (i === 0) {
        supportedAcc = ele.value.allSupportedAccounts
      } else {
        userAccountDetails = ele.value.userAccountWithCurrencyDetail
      }
    })
    if (userAccountDetails) {
      return {
        props: {
          allSupportedAccounts: supportedAcc,
          allUserDetails: userAccountDetails
        }
      }
    } else {
      return {
        props: {
          allSupportedAccounts: {},
          allUserDetails: {}
        }
      }
    }
  }
  return storePromise
}




const clientserviceget: any = ClientService("get");
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
let currentAccounttoRetry: any = "";
type AllSupportedAccounts = {
  accountNameInLC: string,
  accountDisplayName: string,
  supportedFlowType: [],
}
let accountDetails: any[] = [];
let clickedsync = "";
let selectedAccount = "";
let connectedAccountsMap = new Map<string, Array<userAccountsArr>>();
let allUserInprogressAccountsArray = new Array<userAccountsArr>();
let allUserExpiredAccountsArray = new Array<userAccountsArr>();
let allUserConnectedAccountsArray = new Array<userAccountsArr>();
let totalValueOfTransaction = new Map<String, Number>();
let totalValueOfCoins = new Map<String, Number>();
let totalNumberOfTxns: any;

const Accounts = (props: any) => {
  accountDetails = props.allUserDetails;
  totalValueOfTransaction = new Map();
  totalValueOfCoins = new Map();
  allUserInprogressAccountsArray = [];
  allUserExpiredAccountsArray = [];
  allUserConnectedAccountsArray = [];
  connectedAccountsMap = new Map;
  accountDetails.forEach((element: any) => {
    console.log(element.uniqueAccountName + " :" + element.totalTxns);
    if (element.uaStatus === "CONNECTED") {
      totalNumberOfTxns = totalValueOfTransaction.get(element.account.account);
      if (totalNumberOfTxns === undefined || totalNumberOfTxns === null) {
        totalNumberOfTxns = 0;
      }
      totalNumberOfTxns = Number(totalNumberOfTxns) + Number(element.totalTxns);
      totalValueOfTransaction.set(element.account.account, totalNumberOfTxns);
      let totalNumberOfCoins = totalValueOfCoins.get(element.account.account);
      if (totalNumberOfCoins === undefined || totalNumberOfCoins === null) {
        totalNumberOfCoins = 0;
      }
      totalNumberOfCoins = Number(totalNumberOfCoins) + Number(element.wallets.length);
      totalValueOfCoins.set(element.account.account, totalNumberOfCoins)
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
  console.log("Array check");
  
  console.log(allUserExpiredAccountsArray);
  console.log(allUserInprogressAccountsArray);
  console.log(allUserConnectedAccountsArray);
  
  const [retryaccount, setretryaccount] = useState(Array());
  const [accounts, setAccounts] = useState(props.allSupportedAccounts);
  const [connectedAccounts, setConnectedAccounts] = useState(allUserConnectedAccountsArray);
  const [expiredAccounts, setexpiredAccounts] = useState(allUserExpiredAccountsArray);
  const [inprogAccounts, setinprogAccounts] = useState(allUserInprogressAccountsArray);
  const [checkingResponse, setcheckingResponse] = useState(false);
  const [showdeletewarning, setshowDeletewarning] = useState("idle");
  const [accounttoDelete, setAccounttoDelete] = useState(selectedAccount);
  const [showingErrorDiv, setshowingErrorDiv] = useState("idle");
  const [allcoinsdiv, setallcoinsdiv] = useState("idle");
  // const [isLoader, setisLoader] = useState(true);
  const [reload, setreload] = useState(false);
  const [isErrorMain, setisErrorMain] = useState(false);
  const [deleteAccountName, setDeleteAccountName] = useState('');
  const [selected, setselected] = useState(null);
  const [warningSignErrorReason, setwarningSignErrorReason] = useState("idle");
  const toggle = (i: any) => {
    setselected(i)
    console.log(selected);
    if (selected === i) {
      return setselected(null)
    }
  }
  // const getAccounts = async () => {
  //   try {
  //     const accountRes = await clientserviceget("supported/accounts", null, 'ups', null);
  //     setAccounts(accountRes.data.allSupportedAccounts);
  //     getalldata();
  //   }
  //   catch (e: any) {
  //     setisErrorMain(true);
  //     setcheckingResponse(true);
  //     console.log(e);
  //   }
  // }
  // Getting all data
  // const getalldata = async () => {
  //   allUserInprogressAccountsArray = [];
  //   allUserExpiredAccountsArray = [];
  //   allUserConnectedAccountsArray = [];
  //   connectedAccountsMap = new Map;
  //   try {
  //     const accountsdata = await clientserviceget("accounts/details", null, 'ups', null);
  //     console.log(accountsdata);
  //     setisLoader(false);
  //     accountDetails = accountsdata.data.userAccountWithCurrencyDetail;
  //     totalValueOfTransaction = new Map();
  //     totalValueOfCoins = new Map();
  //     accountDetails.forEach((element: any) => {
  //       console.log(element.uniqueAccountName + " :" + element.totalTxns);
  //       if (element.uaStatus === "CONNECTED") {
  //         totalNumberOfTxns = totalValueOfTransaction.get(element.account.account);
  //         if (totalNumberOfTxns === undefined || totalNumberOfTxns === null) {
  //           totalNumberOfTxns = 0;
  //         }
  //         totalNumberOfTxns = Number(totalNumberOfTxns) + Number(element.totalTxns);
  //         totalValueOfTransaction.set(element.account.account, totalNumberOfTxns);
  //         let totalNumberOfCoins = totalValueOfCoins.get(element.account.account);
  //         if (totalNumberOfCoins === undefined || totalNumberOfCoins === null) {
  //           totalNumberOfCoins = 0;
  //         }
  //         totalNumberOfCoins = Number(totalNumberOfCoins) + Number(element.wallets.length);
  //         totalValueOfCoins.set(element.account.account, totalNumberOfCoins)
  //         let arrayOfConnectedAccounts = connectedAccountsMap.get(element.account.account);
  //         if (arrayOfConnectedAccounts === undefined || arrayOfConnectedAccounts === null) {
  //           arrayOfConnectedAccounts = new Array<userAccountsArr>();
  //         }
  //         arrayOfConnectedAccounts.push(element);
  //         connectedAccountsMap.set(element.account.account, arrayOfConnectedAccounts)
  //       }
  //       else if (element.uaStatus === "IN_PROGRESS" || element.uaStatus === "TEMP_ERROR") {
  //         allUserInprogressAccountsArray.push(element);
  //       } else {
  //         allUserExpiredAccountsArray.push(element);
  //       }
  //     })
  //     connectedAccountsMap.forEach((element: any) => {
  //       allUserConnectedAccountsArray.push(element);
  //     })
  //     setcheckingResponse(true)
  //     setexpiredAccounts(allUserExpiredAccountsArray);
  //     setinprogAccounts(allUserInprogressAccountsArray);
  //     setConnectedAccounts(allUserConnectedAccountsArray);
  //   }
  //   catch (e: any) {
  //     console.log(e);
  //     setcheckingResponse(true);
  //     setisErrorMain(true);
  //     if (e.status === 500) {
  //       window.location.href = "/500-error"
  //     } else {
  //       setisLoader(true);
  //       console.log(e);
  //     }
  //   }
  // }
  // Going to another page
  function retryFunctionality(accountName: any) {
    currentAccounttoRetry = getAccountDetailsByName(accountName);
    setretryaccount(currentAccounttoRetry)
    return
  }
  function getAccountDetailsByName(accountName: any) {
    for (let account of accounts) {
      if (account.accountNameInLC == accountName) {
        return account;
      }
    }
    return null;
  }
  // Deleting element id
  function deletingAccount(selectedAccountToDelete: any) {
    let deletingElement = document.getElementById("image" + selectedAccountToDelete);
    deletingElement!.style.display = "inline";
    let syncingbtnelement = document.getElementById("delete" + selectedAccountToDelete);
    syncingbtnelement!.style.display = "none";
  }
  function deletingAccountEnd(accountName: any) {
    let deletingElement = document.getElementById("image" + accountName);
    deletingElement!.style.display = "none";
    let syncingbtnelement = document.getElementById("delete" + accountName);
    syncingbtnelement!.style.display = "inline";
  }
  // Showing the delete warning
  function connectedDelete(event: any) {
    console.log(event);
    clickedsync = event;
    setshowDeletewarning(event);
    setshowingErrorDiv("idle");
  }
  function showingerrorInSync(event: any) {
    clickedsync = event;
    setshowingErrorDiv(event);
    setshowDeletewarning("idle");
  }
  // Showing all coins
  function showingAllCoins(event: any) {
    clickedsync = event;
    setallcoinsdiv(event);
  }
  // Hiding the delete warning
  function hideWarning() {
    setreload(true);
    setshowDeletewarning("idle");
    setallcoinsdiv("idle");
    setshowingErrorDiv("idle");
  }
  // Deleting the selected account
  const deleteAccount = async (selectedAccountToDelete: any) => {
    const clientservicedelete: any = ClientService("delete");
    console.log(selectedAccountToDelete);
    clickedsync = selectedAccountToDelete;
    deletingAccount(selectedAccountToDelete);
    setshowDeletewarning("idle");
    try {
      const deleteCall = await clientservicedelete(`/api/v1/add-account/deleteAccount?accountToDelete=${selectedAccountToDelete}`, null, null);
      console.log(deleteCall);
      if (deleteCall.data.error === null) {
        deletingAccountEnd(selectedAccountToDelete);
        // getAccounts();
        setAccounttoDelete(selectedAccountToDelete);
        setDeleteAccountName(selectedAccountToDelete);
      } else {
        deletingAccountEnd(selectedAccountToDelete);
        setAccounttoDelete(selectedAccountToDelete);
      }
      setreload(!reload)
    } catch (e: any) {
      setshowingErrorDiv(selectedAccountToDelete)
      deletingAccountEnd(selectedAccountToDelete);
      setwarningSignErrorReason(e.data.error.message)
      console.log(e);
    }
  }
  // useEffect(() => {
  //   getAccounts();
  // }, [])
  console.log(connectedAccounts);
  return (
    <>
    { console.log(connectedAccounts)}
      <div className='d-block d-lg-flex justify-content-between'>
        <div className="d-none d-lg-block">
          <LeftFeed />
        </div>
        <div className='w-100'>
            <div className={styles.accounts}>
                <div style={{ "overflowY": "scroll", "height": "100vh", "overflowX": "hidden" }}>
                  <div className="row">
                    <div><ProgressAccount  retryaccount={retryaccount} inprogAccounts={inprogAccounts} connectedAccounts={connectedAccounts} expiredAccounts={expiredAccounts} retryFunctionality={retryFunctionality} connectedDelete={connectedDelete} showdeletewarning={showdeletewarning} hideWarning={hideWarning} deleteAccount={deleteAccount} showingErrorDiv={showingErrorDiv} showingerrorInSync={showingerrorInSync} /></div>
                  </div>
                  <div>
                    <CompletedAccounts allUserConnectedAccountsArray={allUserConnectedAccountsArray} totalValueOfCoins={totalValueOfCoins} totalValueOfTransaction={totalValueOfTransaction} connectedAccounts={connectedAccounts} accountDetails={accountDetails} deleteAccountName={deleteAccountName} connectedDelete={connectedDelete} showdeletewarning={showdeletewarning} hideWarning={hideWarning} deleteAccount={deleteAccount} showingAllCoins={showingAllCoins} allcoinsdiv={allcoinsdiv} showingErrorDiv={showingErrorDiv} showingerrorInSync={showingerrorInSync} setselected={setselected} selected={selected} toggle={toggle} setshowDeletewarning={setshowDeletewarning} setwarningSignErrorReason={setwarningSignErrorReason} warningSignErrorReason={warningSignErrorReason} />
                  </div>
                </div>
            </div> 
        </div>
        <div className="d-none d-lg-block">
          <RightFeed />
        </div>
      </div>
    </>
  )
}
export default Accounts