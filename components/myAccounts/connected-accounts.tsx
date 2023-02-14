import React, { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns';
import ClientService from '../../services/main-serviceClient';
import Icon from 'react-icons-kit';
import { filter } from 'react-icons-kit/fa/filter'
import _ from 'lodash';
import { Button, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';
import styles from "../../styles/my-account/my-account.module.scss"

var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;






let localAccount = "";
let isResetBtnActive = true;
let timer: any;
var isError = false;
var isAccountSync = false;
const clientservice: any = ClientService("post");

interface userAccountsArr {
  "account": {
    "account": string,
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
  "uniqueAccountName": string,
  "wallets": Array<wallettypearr>;
}
interface wallettypearr {
  "id": string,
  "address": string,
  "currency": string,
  "amount": number,
  "walletType": string,
  "currencyDetails": {
    "id": string,
    "currency": string,
    "symbol": string,
    "name": string,
    "logo_url": string,
    "rank": number
  }
}

export interface CarouselData {
  id: string,
  symbol: string,
  name: string,
  logo: string,
  currency: string,
  rates: Array<Rates>
}
type Rates = {
  timestamp: string,
  open: string,
  high: string,
  low: string,
  close: string
}

let userAccountAssets: Array<userAccountsArr> = [];
let assetsListFilter: Array<userAccountsArr> = [];
let assetsListFilterAfterCheck: Array<userAccountsArr> = [];
let varUserEchangesBackup: Array<userAccountsArr> = [];
let CoinsMap = new Map<string, number>();
let userCoinAssets = new Map<string, Array<userAccountsArr>>();
let completedItem: any[] = [];

const CompletedAccounts = (props: any) => {
  const [reloadtime, setreloadtime] = useState(false);
  const [disbalingDeleteButtonAsSyncing, setdisbalingDeleteButtonAsSyncing] = useState(false);
  const [disablingFilterButton, setdisablingFilterButton] = useState(false);
  const [disablingFilterCoins, setdisablingFilterCoins] = useState(false);
  const [isDropdown, setisDropdown] = useState("");
  const [isShowingInsideAccount, setisShowingInsideAccount] = useState(false);
  const [showingConnectedDiv, setshowingConnectedDiv] = useState(true);
  const [ishidingIcon, setishidingIcon] = useState("");
  const [isreload, setisreload] = useState(false);
  const [issyncEnabled, setissyncEnabled] = useState(false);

  useEffect(() => {
    setisreload(!isreload);
  }, [props.selected])

  // For Account Filter
  function searchAssets(e: any) {
    assetsListFilter = varUserEchangesBackup
    let newArr = [];
    newArr = _.filter(assetsListFilter, (o) => {
      console.log(assetsListFilter);
      if (o.account.account.includes(e)) {
        return o;
      }
    });
    if (e !== "") {
      assetsListFilter = newArr as Array<userAccountsArr>;
    }
    if (assetsListFilter.length !== 0) {
      assetsListFilter.forEach((item: any) => {
        if (assetsListFilterAfterCheck.includes(item)) {
          setTimeout(() => {
            let ele = document.getElementById(`id${item.account.accountDisplayName}`) as HTMLInputElement;
            ele.checked = true
          }, 1);
        } else {
          setTimeout(() => {
            let ele = document.getElementById(`id${item.account.accountDisplayName}`) as HTMLInputElement;
            ele.checked = false
          }, 1);
        }
      })

      isResetBtnActive = true
    } else {
      isResetBtnActive = false
    }
    setreloadtime(!reloadtime)
  }
  function setFilterArr(e: any, key: any, valueCoin: any) {
    assetsListFilterAfterCheck = [];
    if (e.target.checked) {
      valueCoin.forEach((value: any) => {
        value.forEach((ele: any) => {
          let value: any = CoinsMap.get(ele.account.accountNameInLc);
          value = value + 1;
          CoinsMap.set(ele.account.accountNameInLC, value);
        });
      });
    } else {
      valueCoin.forEach((value: any) => {
        value.forEach((ele: any) => {
          let value: any = CoinsMap.get(ele.account.accountNameInLC);
          value = value - 1;
          CoinsMap.set(ele.account.accountNameInLC, value);
        });
        value.forEach((ele: any) => {
          let value: any = CoinsMap.get(ele.account.accountDisplayName);
          value = value - 1;
          CoinsMap.set(ele.account.accountDisplayName, value);
        });
      });

    }
    CoinsMap.forEach((value: any, key: any) => {
      if (value != 0) {
        varUserEchangesBackup.forEach((item: any) => {
          item.forEach((ele: any) => {
            if (ele.account.accountNameInLC === key) {
              assetsListFilterAfterCheck.push(item);
            }
          })
        })
      }
    })
    if (assetsListFilterAfterCheck.length != 0) {
      userAccountAssets = assetsListFilterAfterCheck;
      setdisablingFilterButton(true);
    } else {
      userAccountAssets = varUserEchangesBackup;
      setdisablingFilterButton(false);
    }
    setreloadtime(!reloadtime)
  }

  // Searching for Accounts
  function setFilterAssetArr(e: any, element: any) {
    userAccountAssets = [];
    if (e.target.checked) {
      assetsListFilterAfterCheck.push(element);
    } else {
      if (assetsListFilterAfterCheck.includes(element)) {
        let index = assetsListFilterAfterCheck.indexOf(element);
        if (index !== -1) {
          assetsListFilterAfterCheck.splice(index, 1);
        }
      }
    }
    if (assetsListFilterAfterCheck.length !== 0) {
      userAccountAssets = assetsListFilterAfterCheck
      setdisablingFilterCoins(true)
    } else {
      userAccountAssets = varUserEchangesBackup;
      setdisablingFilterCoins(false);
    }
    setreloadtime(!reloadtime)
  }
  function resetFilter() {
    userAccountAssets = [];
    setdisablingFilterButton(false);
    setdisablingFilterCoins(false);
    assetsListFilterAfterCheck.forEach((ele: any) => {
      try {
        ele.forEach((element: any) => {
          let item = document.getElementById(`id${ele[0].account.account}`) as HTMLInputElement;
          if (item) {
            item.checked = false
          }
        });
      }
      catch (e) {
        console.log(e);
      }
      setreloadtime(!reloadtime)
    })
    assetsListFilter = varUserEchangesBackup;
    assetsListFilterAfterCheck = [];
    userAccountAssets = varUserEchangesBackup
    setreloadtime(!reloadtime);
  }
  useEffect(() => {
    userAccountAssets = props.allUserConnectedAccountsArray;
    assetsListFilter = props.allUserConnectedAccountsArray;
    varUserEchangesBackup = props.allUserConnectedAccountsArray;
    props.allUserConnectedAccountsArray.map((ele: any, index: any) => {
      ele.map((insidearr: any) => {
        insidearr.wallets.map((element: any) => {
          let UserAssetsArray = userCoinAssets.get(element.currency);
          if (!UserAssetsArray || UserAssetsArray.length === 0) {
            UserAssetsArray = new Array<userAccountsArr>();
          }
          UserAssetsArray.push(ele);
          userCoinAssets.set(element.currency, UserAssetsArray);
        })
        CoinsMap.set(insidearr.account.accountNameInLc, 0);
      })
    })
    userCoinAssets = new Map([...userCoinAssets.entries()].sort());
    setisreload(true);
  }, [props.connectedAccounts])


  async function callingAllElementToSync(data: any) {
    completedItem = [];
    setisDropdown("down" + data[0].account.account);
    setisShowingInsideAccount(true);
    setdisablingFilterButton(true);
    data.forEach((element: any) => {
      setTimeout(() => {
        syncingStart(element.uniqueAccountName);
        syncErrorDateStart(element.uniqueAccountName);
        userAccountTriggerSync(element.uniqueAccountName, element.account.account, data);
      }, 200);
      syncingstartMain(element.account.account);
      setdisbalingDeleteButtonAsSyncing(true);
    });
  }

  const userTriggerSeparate = async (accountName: any, mainAccountName: any, connectedAcc: any) => {
    localAccount = accountName;
    syncingStart(accountName);
    syncErrorDateStart(accountName);
    setdisbalingDeleteButtonAsSyncing(true);
    setissyncEnabled(true);
    setdisablingFilterButton(true);
    props.setshowDeletewarning("idle")
    try {
      const userAccountTriggerApi = await clientservice(`/api/v1/add-account/triggerSync?accountoSync=${accountName}`, null, null);
      if (userAccountTriggerApi.data.error === null && userAccountTriggerApi.data.status === "COMPLETED") {
        userSynctxnsSeparate(accountName, mainAccountName, connectedAcc);
        let dom = document.getElementById('errorTip' + accountName);
        dom!.style.display = "none";
        let domMobile = document.getElementById('errorTip_mobile' + accountName);
        domMobile!.style.display = "none";
      } else {
        setreloadtime(!reloadtime);
        setissyncEnabled(false);
        let dom = document.getElementById('errorTip' + accountName);
        dom!.style.display = "inline-block";
        let domMobile = document.getElementById('errorTip_mobile' + accountName);
        domMobile!.style.display = "inline-block";
        syncingEnd(accountName);
        setreloadtime(!reloadtime);
        syncSuccessHide(accountName);
        props.setwarningSignErrorReason(userAccountTriggerApi.data.error.message)
        setdisablingFilterButton(false);
      }
    } catch (e: any) {
      setissyncEnabled(false);
      setdisablingFilterButton(false);
      console.log(e);
      let dom = document.getElementById('errorTip' + accountName);
      dom!.style.display = "inline-block";
      let domMobile = document.getElementById('errorTip_mobile' + accountName);
      domMobile!.style.display = "inline-block";
      syncingEnd(accountName);
      setdisbalingDeleteButtonAsSyncing(false);
      setreloadtime(!reloadtime);
      syncSuccessHide(accountName);
      props.setwarningSignErrorReason(e.data.error.message)
    }
  }
function checkingTimeStamp(userSyncAccountApi:any){
  userAccountAssets.forEach((assets: any) => {
    if (assets[0].uniqueAccountName === userSyncAccountApi.data.account) {
      let objectAccount:any = [{
        "account": {
          "account": assets[0].account.account,
          "accountNameInLC": assets[0].account.accountNameInLC,
          "accountDisplayName": assets[0].account.accountDisplayName,
          "supportedFlowType": assets[0].account.supportedFlowType,
          "accountType": assets[0].account.accountType
        },
        "code": assets[0].code,
        "error": assets[0].error,
        "flowType": assets[0].flowType,
        "uaStatus": assets[0].uaStatus,
        "syncCompletedAt": userSyncAccountApi.data.time,
        "syncTxnStatus": assets[0].syncTxnStatus,
        "totalTxns": assets[0].totalTxns,
        "createdAt": assets[0].createdAt,
        "uniqueAccountName": assets[0].uniqueAccountName,
        "userDefinedAccountName": assets[0].userDefinedAccountName,
        "wallets":assets[0].wallets
      }]
      userAccountAssets.splice(userAccountAssets.indexOf(assets), 1,objectAccount)
    }
  })
}
  const userSynctxnsSeparate = async (accountName: any, mainAccountName: any, connectedAcc: any) => {
    setdisablingFilterButton(true);
    setdisbalingDeleteButtonAsSyncing(true);
    props.setshowDeletewarning("idle");
    setissyncEnabled(true);
    try {
      const userSyncAccountApi = await clientservice(`/api/v1/add-account/syncAccount?accountoSync=${accountName}`, null, null);
      if (userSyncAccountApi.data.status === "COMPLETED") {
        console.log(userSyncAccountApi);
        setissyncEnabled(false);
        setreloadtime(!reloadtime);
        checkingTimeStamp(userSyncAccountApi)
        console.log(userAccountAssets);
        let dom = document.getElementById('errorTip' + accountName);
        dom!.style.display = "none";
        let domMobile = document.getElementById('errorTip_mobile' + accountName);
        domMobile!.style.display = "none";
        syncingEnd(accountName);
        syncErrorDateEnd(accountName);
        setdisbalingDeleteButtonAsSyncing(false);
        setdisablingFilterButton(false);
      }
      else if (userSyncAccountApi.data.status === "IN_PROGRESS" || userSyncAccountApi.data.status === "VEZGO_SYNC_IN_PROGRESS") {
        setTimeout(() => {
          userSynctxnsSeparate(accountName, mainAccountName, connectedAcc);
        }, 5000);
        let dom = document.getElementById('errorTip' + accountName);
        dom!.style.display = "none";
        let domMobile = document.getElementById('errorTip_mobile' + accountName);
        domMobile!.style.display = "none";
        syncingStart(accountName);
        syncErrorDateStart(accountName);
      }
      else {
        setissyncEnabled(false);
        setdisablingFilterButton(false);
        let dom = document.getElementById('errorTip' + accountName);
        dom!.style.display = "inline-block";
        let domMobile = document.getElementById('errorTip_mobile' + accountName);
        domMobile!.style.display = "inline-block";
        setreloadtime(!reloadtime);
        setdisbalingDeleteButtonAsSyncing(false);
        syncingEnd(accountName);
        syncSuccessHide(accountName);
        props.setwarningSignErrorReason(userSyncAccountApi.data.error.message)
      }

    } catch (e: any) {
      setissyncEnabled(false);
      setdisablingFilterButton(false);
      let dom = document.getElementById('errorTip' + accountName);
      dom!.style.display = "inline-block";
      let domMobile = document.getElementById('errorTip_mobile' + accountName);
      domMobile!.style.display = "inline-block";
      setreloadtime(!reloadtime);
      syncSuccessHide(accountName);
      setdisbalingDeleteButtonAsSyncing(false);
      syncingEnd(accountName);
    }
  }
  // Sync trigger api only one 1 account at time
  const userAccountTriggerSync = async (accountName: any, mainAccountName: any, connectedAcc: any) => {
    localAccount = accountName;
    syncingStart(accountName);
    syncErrorDateStart(accountName);
    setdisbalingDeleteButtonAsSyncing(true);
    setissyncEnabled(true);
    setdisablingFilterButton(true);
    props.setshowDeletewarning("idle");
    try {
      const userAccountTriggerApi = await clientservice(`/api/v1/add-account/triggerSync?accountoSync=${accountName}`, null, null);
      if (userAccountTriggerApi.data.error === null && userAccountTriggerApi.data.status === "COMPLETED") {
        userAccountSyncTxnsAndAccount(accountName, mainAccountName, connectedAcc);
        let dom = document.getElementById('errorTip' + accountName);
        dom!.style.display = "none";
        let domMobile = document.getElementById('errorTip_mobile' + accountName);
        domMobile!.style.display = "none";
      } else {
        completedItem.push(accountName);
        if (completedItem.length === connectedAcc.length) {
          setreloadtime(!reloadtime);
          setissyncEnabled(false);
          syncingendMain(connectedAcc[0].account.account);
          setdisablingFilterButton(false);
        }
        let dom = document.getElementById('errorTip' + accountName);
        dom!.style.display = "inline-block";
        let domMobile = document.getElementById('errorTip_mobile' + accountName);
        domMobile!.style.display = "inline-block";
        syncingEnd(accountName);
        setreloadtime(!reloadtime);
        syncSuccessHide(accountName);
        props.setwarningSignErrorReason(userAccountTriggerApi.data.error.message)
      }
    } catch (e: any) {
      completedItem.push(accountName);
      if (completedItem.length === connectedAcc.length) {
        syncingendMain(connectedAcc[0].account.account);
        setissyncEnabled(false);
      }
      console.log(e);
      let dom = document.getElementById('errorTip' + accountName);
      dom!.style.display = "inline-block";
      let domMobile = document.getElementById('errorTip_mobile' + accountName);
      domMobile!.style.display = "inline-block";
      syncingEnd(accountName);
      setdisbalingDeleteButtonAsSyncing(false);
      setreloadtime(!reloadtime);
      syncSuccessHide(accountName);
      props.setwarningSignErrorReason(e.data.error.message)
    }
  }
  const userAccountSyncTxnsAndAccount = async (accountName: any, mainAccountName: any, connectedAcc: any) => {
    setdisablingFilterButton(true);
    props.setshowDeletewarning("idle");
    setissyncEnabled(true);
    setdisbalingDeleteButtonAsSyncing(true);
    try {
      const userSyncAccountApi = await clientservice(`/api/v1/add-account/syncAccount?accountoSync=${accountName}`, null, null);
      if (userSyncAccountApi.data.status === "COMPLETED") {
        checkingTimeStamp(userSyncAccountApi);
        completedItem.push(accountName);
        console.log("Sync account done");
        console.log(userSyncAccountApi);
        
        if (completedItem.length === connectedAcc.length) {
          console.log("Sync account done all");
          console.log(userSyncAccountApi);
          setissyncEnabled(false);
          setreloadtime(!reloadtime);
          syncingendMain(connectedAcc[0].account.account);
          setdisablingFilterButton(false);
          setdisbalingDeleteButtonAsSyncing(false);
        }
        let dom = document.getElementById('errorTip' + accountName);
        dom!.style.display = "none";
        let domMobile = document.getElementById('errorTip_mobile' + accountName);
        domMobile!.style.display = "none";
        syncingEnd(accountName);
        syncErrorDateEnd(accountName);
      }
      else if (userSyncAccountApi.data.status === "IN_PROGRESS" || userSyncAccountApi.data.status === "VEZGO_SYNC_IN_PROGRESS") {
        setTimeout(() => {
          userAccountSyncTxnsAndAccount(accountName, mainAccountName, connectedAcc);
        }, 5000);
        let dom = document.getElementById('errorTip' + accountName);
        dom!.style.display = "none";
        let domMobile = document.getElementById('errorTip_mobile' + accountName);
        domMobile!.style.display = "none";
        syncingStart(accountName);
        syncErrorDateStart(accountName);
      }
      else {
        completedItem.push(accountName);
        if (completedItem.length === connectedAcc.length) {
          setreloadtime(!reloadtime);
          setissyncEnabled(false);
          syncingendMain(connectedAcc[0].account.account);
          setdisablingFilterButton(false);
        }
        let dom = document.getElementById('errorTip' + accountName);
        dom!.style.display = "inline-block";
        let domMobile = document.getElementById('errorTip_mobile' + accountName);
        domMobile!.style.display = "inline-block";
        setreloadtime(!reloadtime);
        setdisbalingDeleteButtonAsSyncing(false);
        syncingEnd(accountName);
        syncSuccessHide(accountName);
        props.setwarningSignErrorReason(userSyncAccountApi.data.error.message)
      }

    } catch (e: any) {
      completedItem.push(accountName);
      if (completedItem.length === connectedAcc.length) {
        setreloadtime(!reloadtime);
        syncingendMain(connectedAcc[0].account.account);
        setissyncEnabled(false);
        setdisablingFilterButton(false);
      }
      let dom = document.getElementById('errorTip' + accountName);
      dom!.style.display = "inline-block";
      let domMobile = document.getElementById('errorTip_mobile' + accountName);
      domMobile!.style.display = "inline-block";
      setreloadtime(!reloadtime);
      syncSuccessHide(accountName);
      setdisbalingDeleteButtonAsSyncing(false);
      syncingEnd(accountName);
    }
  }

  // To stop the sync progress
  function stopInterval(timer: any) {
    if (timer) {
      clearInterval(timer);
    }
  }

  // Syncing the account
  function syncingStart(selectedElementToSync: any) {
    let syncingImageelement = document.getElementById("syncImage" + selectedElementToSync);
    syncingImageelement!.style.display = "inline";
    let synicingRightElement = document.getElementById("sync" + selectedElementToSync);
    synicingRightElement!.style.display = "none";
    let syncingImageelementMobile = document.getElementById("syncImage_mobile" + selectedElementToSync);
    syncingImageelementMobile!.style.display = "inline";
    let synicingRightElementMobile = document.getElementById("sync_mobile" + selectedElementToSync);
    synicingRightElementMobile!.style.display = "none";
  }
  function syncingEnd(selectedElementToSync: any) {
    let syncingImageelement = document.getElementById("syncImage" + selectedElementToSync);
    syncingImageelement!.style.display = "none";
    let synicingRightElement = document.getElementById("sync" + selectedElementToSync);
    synicingRightElement!.style.display = "inline";
    let syncingImageelementMobile = document.getElementById("syncImage_mobile" + selectedElementToSync);
    syncingImageelementMobile!.style.display = "none";
    let synicingRightElementMobile = document.getElementById("sync_mobile" + selectedElementToSync);
    synicingRightElementMobile!.style.display = "inline";
  }

  // Syncing error in date
  function syncErrorDateStart(selectedElementToShow: any) {
    let syncingImageRightelement = document.getElementById("rightImage" + selectedElementToShow);
    syncingImageRightelement!.style.display = "inline";
    let syncingRefreshElement = document.getElementById("right" + selectedElementToShow);
    syncingRefreshElement!.style.display = "none";
    let syncingImageRightelementMobile = document.getElementById("rightImage_mobile" + selectedElementToShow);
    syncingImageRightelementMobile!.style.display = "inline";
    let syncingRefreshElementMobile = document.getElementById("right_mobile" + selectedElementToShow);
    syncingRefreshElementMobile!.style.display = "none";
  }
  function syncErrorDateEnd(selectedElementToShow: any) {
    let syncingImageRightelement = document.getElementById("rightImage" + selectedElementToShow);
    syncingImageRightelement!.style.display = "none";
    let syncingRefreshElement = document.getElementById("right" + selectedElementToShow);
    syncingRefreshElement!.style.display = "inline";
    let syncingImageRightelementMobile = document.getElementById("rightImage_mobile" + selectedElementToShow);
    syncingImageRightelementMobile!.style.display = "none";
    let syncingRefreshElementMobile = document.getElementById("right_mobile" + selectedElementToShow);
    syncingRefreshElementMobile!.style.display = "inline";
  }

  function syncSuccessHide(selectedElementToShow: any) {
    let syncingImageRightelement = document.getElementById("rightImage" + selectedElementToShow);
    syncingImageRightelement!.style.display = "none";
    let syncingRefreshElement = document.getElementById("right" + selectedElementToShow);
    syncingRefreshElement!.style.display = "none";
    let syncingImageRightelementMobile = document.getElementById("rightImage_mobile" + selectedElementToShow);
    syncingImageRightelementMobile!.style.display = "none";
    let syncingRefreshElementMobile = document.getElementById("right_mobile" + selectedElementToShow);
    syncingRefreshElementMobile!.style.display = "none";
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
  // format date in typescript
  function getFormatedDate(date: Date, dateFormat: string) {
    return format(date, dateFormat);
  }

  function usingArrowDiv(selectedAccount: any) {
    setishidingIcon(selectedAccount.target.id)
    let imageArrow = selectedAccount.target;
    if (ishidingIcon !== selectedAccount.target.id) {
      imageArrow.style.transform = `rotate(${180}deg)`;
      setisShowingInsideAccount(!isShowingInsideAccount)
      setisDropdown(selectedAccount.target.id)
    } else if (ishidingIcon === selectedAccount.target.id) {
      imageArrow.style.transform = `rotate(${0}deg)`;
      setishidingIcon("");
      setisShowingInsideAccount(!isShowingInsideAccount);
    }
  }
  // Main jsx
  return (
    <>
      <div className='container px-2'>
        <div className="row">
          <div className={styles.third_part}>
            <div className={`${styles.mobile_head} mb-2`}>
              <div className={`${styles.mobile_expired_account}  py-2`}>
                <h2 className={`${styles.main_heading_mobile} ps-2 mb-0`}>Connected Account(s)</h2>
                <img className='me-3 arrows' id={"down"} onClick={(e) => {
                  usingArrowDiv(e); setshowingConnectedDiv(!showingConnectedDiv)
                }} src={imageHost + "/arrow-up-account.svg"} alt="" />
              </div>
            </div>
            <div className={styles.main_sync}>
              <h3 className={`${styles.main_heading} text_start`}>Connected Account(s)</h3>
              {/* Coins Filter */}
              {showingConnectedDiv &&
                <div className={`d-flex ${styles.main_filter}`}>
                  {props.connectedAccounts.length != 0 ?
                    <div className={`text-end dropdown me-2`}>
                      {disablingFilterButton === true ?
                        <div className={styles.info_icon_adjustment}>
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="popover_contained">
                                <div className={`${styles.tooltip_text_size} m-0`}>My Accounts filter Disabled. You can use this filter after sync completed</div>
                              </Tooltip>
                            }
                          >
                            <div>
                              <button type="button" className={`btn ${styles.btn_myaccount} dropdown-toggle ${styles.filter_btn}`} data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" id='btn_accounts' disabled={disablingFilterButton}>
                                <Icon icon={filter} className={`${styles.filter_icon} pe-1`} size={20} />My Accounts
                              </button>
                            </div>
                          </OverlayTrigger>
                        </div>
                        : <button type="button" className={`btn ${styles.btn_myaccount} dropdown-toggle ${styles.filter_btn}`} data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" id='btn_accounts'>
                          <Icon icon={filter} className={`${styles.filter_icon} pe-1`} size={20} />My Accounts
                        </button>}

                      <form className={`dropdown-menu p-2 ${styles.filter_container}`}>
                        {
                          assetsListFilter ?
                            <div className={styles.checklist_view}>
                              {
                                assetsListFilter.map((element: any, index: any) => {
                                  return <>
                                    <div className="form-check" key={index}>
                                      <input className={`form-check-input ${styles.checkbox_resize}`} type="checkbox" value={element[0].account.account} onClick={(e) => { setFilterAssetArr(e, element) }} id={`id${element[0].account.account}`} />
                                      <label className="form-check-label" htmlFor="flexCheckDefault">
                                        {element[0].account.account}
                                      </label>
                                    </div>
                                  </>
                                })
                              }
                            </div> : <></>
                        }
                        <hr className="dropdown-divider" />
                        <button type="button" className={isResetBtnActive ? `btn btn_app_primary ${styles.btn_sm}` : "d-none"} onClick={() => resetFilter()}>Reset</button>
                      </form>
                    </div> : <></>}
                </div>
              }
            </div>
            <div className={`${styles.desktop_completed_div} mt-1`}>
              <>
                {userAccountAssets.length != 0 ?
                  <>
                    <table className="table mb-0 table-head-size">
                      <thead className="static-border-bottom">
                        <tr>
                          <th scope="col" className=" border-adjustment col-2">Account Name </th>
                          <th scope="col" className=" border-adjustment col-2 text-center">Total Account</th>
                          <th scope="col" className=" border-adjustment col-2 text-center">Last Update</th>
                          <th scope="col" className=" border-adjustment col-2 text-center">Total txns</th>
                          <th scope="col" className=" border-adjustment col-2 text-center">Total Coins</th>
                          <th scope="col" className=" border-adjustment col-2 text-center">Action</th>
                        </tr>
                      </thead>
                    </table>
                    <div className={`${styles.connected_accounts} px-3`}>
                      <div className="accordion" id="accordionExample">
                        {userAccountAssets.map((connectedAcc: any, i: any) => {
                          return <>
                            {console.log(connectedAcc)}
                            <div key={i} className={props.totalValueOfTransaction.get(connectedAcc[0].account.account) === null || props.totalValueOfTransaction.get(connectedAcc[0].account.account) === undefined ? "d-none" : `${styles.connected_list} row`}>
                              <div className={`accordion-item px-0 ${styles.accordion_item}`} style={{ "border": "none" }}>
                                <h2 className={`accordion-header ${styles.accordion_header}`} id={connectedAcc.userDefinedAccountName}>
                                  <button className={`accordion-button ${styles.accordion_button} collapsed border-none`} type="button" data-bs-toggle="collapse" data-bs-target={"#collapse" + connectedAcc[0].account.account} aria-expanded="true" aria-controls={"collapse" + connectedAcc.userDefinedAccountName}>
                                    <div className="col-lg-12">
                                      <div className="row">
                                        <div className="pe-0 col-2">
                                          <div className={styles.account_name}>
                                            <img className={styles.inprog_account_img} src={imageHost + `/exchanges/` + connectedAcc[0].account.accountNameInLC + `.png?v=1`}
                                              alt="" />{connectedAcc[0].account.account}
                                          </div>
                                        </div>
                                        <div className="pe-0 text-center col-2">
                                          <div className={styles.account_name}>
                                            {connectedAcc.length}
                                          </div>
                                        </div>
                                        <div className="text-center col-2">
                                          <div className={styles.account_name}>
                                            {connectedAcc[0].syncCompletedAt ? <>{getFormatedDate(parseISO(String(connectedAcc[0].syncCompletedAt)), "dd-MMM-yy HH:mm:ss")}</> : <></>}
                                          </div>
                                        </div>
                                        <div className="col-2 p-0">
                                          <div className={`${styles.account_name} text-center text-lg-center ps-3 ps-lg-0`}>
                                            {props.totalValueOfTransaction.get(connectedAcc[0].account.account)}
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className={`${styles.account_name} text-center`}>
                                            {props.totalValueOfCoins.get(connectedAcc[0].account.account)}
                                          </div>
                                        </div>
                                        <div className="col-2 text-lg-center d-flex justify-content-center position-relative">
                                          <div className={styles.account_name}>
                                            <img src={imageHost + "/loader-small.gif"} alt="" className={styles.syncing_refresh} id={"img_main" + connectedAcc[0].account.account} />
                                            <button className='px-0 py-0' onClick={() => { callingAllElementToSync(connectedAcc); props.toggle(i) }} disabled={issyncEnabled} ><img className={styles.refresh_icon} id={"btn_main" + connectedAcc[0].account.account} src={imageHost + "/refresh-sync-connected.svg"} alt="" /></button>
                                          </div>
                                          {/* <div className='text-end ps-3 ms-3'>
                                            <div className='position-relative'>
                                              {props.selected === i ?
                                                <button className='btn-disable' disabled={issyncEnabled} onClick={() => props.toggle(i)}>
                                                  <img className='d-block py-2' id={"down" + connectedAcc[0].account.account} src={imageHost + "/arrow-up-account.svg"} alt="" />
                                                </button> :
                                                <button className='btn-disable' disabled={issyncEnabled} onClick={() => props.toggle(i)}>
                                                  <img className='d-block py-2' src={imageHost + "/arrow-down-account.svg"} alt="" />
                                                </button>
                                              }
                                            </div>
                                          </div> */}
                                        </div>
                                      </div>
                                    </div>
                                  </button>
                                </h2>
                                {connectedAcc.map((insideAccount: any) => {
                                  return <>
                                    <div id={"collapse" + insideAccount.account.account} className="accordion-collapse collapse" aria-labelledby={connectedAcc.userDefinedAccountName}>
                                      <div className="accordion-body">
                                        <div className={props.deleteAccountName === insideAccount.uniqueAccountName ? "d-none" : "row"}>
                                          <div className={`col-4 ${styles.account_name} ${styles.account_name_2}`}>
                                            <img className={styles.inprog_account_img} src={imageHost + `/exchanges/` + insideAccount.account.accountNameInLC + `.png?v=1`}
                                              alt="" />{insideAccount.userDefinedAccountName}
                                          </div>
                                          <div className={`col-2 ${styles.account_name} ${styles.account_name_2}`}>
                                            <img src={imageHost + "/loader-small.gif"} alt="" className={styles.syncing_refresh} id={"rightImage" + insideAccount.uniqueAccountName} />
                                            <div className={`${styles.info_icon_adjustment} pe-1`} style={{ display: "none" }} id={'errorTip' + insideAccount.uniqueAccountName}>
                                              <img src={imageHost + "/error-warning-icon.svg"} alt="" onClick={() => props.showingerrorInSync(insideAccount.uniqueAccountName)} className={styles.syncing_error} id={'syncError' + insideAccount.uniqueAccountName} />
                                            </div>
                                            <img className={styles.right_img} id={"right" + insideAccount.uniqueAccountName} src={imageHost + "/right-click-exchanges.svg"} alt="" />
                                            {insideAccount.syncCompletedAt ? <>{getFormatedDate(parseISO(String(insideAccount.syncCompletedAt)), "dd-MMM-yy HH:mm:ss")}</> : <></>}
                                          </div>
                                          <div className={`col-2 text-center ${styles.account_name}  ${styles.account_name_2}`}>
                                            {insideAccount.totalTxns}
                                          </div>
                                          <div className={`col-2 ${styles.account_name} ${styles.account_name_2}`}>
                                            {insideAccount.wallets.length === 0 ?
                                              <div className='text-center ps-4'>
                                                ---
                                              </div> :
                                              <div className='d-flex justify-content-center'>
                                                {insideAccount.wallets.map((walletarr: any, innerindex: number) => {
                                                  return <div key={innerindex}>
                                                    {insideAccount.wallets.length <= 3 ?
                                                      <img className={`${styles.coins_img} p-1`} src={walletarr.currencyDetails.logo_url} alt="" /> :
                                                      <>
                                                        {innerindex < 2 ? <img className={`${styles.coins_img} p-1`} src={walletarr.currencyDetails.logo_url} alt="" /> : <></>}
                                                        {innerindex === insideAccount.wallets.length - 1 ? <span onClick={() => props.showingAllCoins(insideAccount.uniqueAccountName)} className={styles.length}>+{insideAccount.wallets.length - 2} </span> : <></>
                                                        }

                                                      </>
                                                    }
                                                  </div>
                                                })}
                                              </div>
                                            }
                                          </div>
                                          <div className={`col-2 text-center ${styles.account_name}  ${styles.account_name_2}`}>
                                            <img src={imageHost + "/loader-small.gif"} alt="" className={styles.syncing_refresh} id={"syncImage" + insideAccount.uniqueAccountName} />
                                            <img onClick={() => userTriggerSeparate(insideAccount.uniqueAccountName, insideAccount.account.account, connectedAcc)} id={"sync" + insideAccount.uniqueAccountName} className={`${styles.inside_element_img} me-3`} src={imageHost + "/refresh-sync-connected.svg"} alt="" />
                                            <img src={imageHost + "/loader-small.gif"} alt="" className={styles.syncing_connected} id={"image" + insideAccount.uniqueAccountName} />
                                            <button className='btn p-0 mb-1' onClick={() => props.connectedDelete(insideAccount.uniqueAccountName)} disabled={disbalingDeleteButtonAsSyncing}><img id={"delete" + insideAccount.uniqueAccountName} className={`${styles.inside_element_img} ms-2`} src={imageHost + "/delete-new-icon.svg"} alt="" /></button>
                                          </div>
                                        </div>
                                        {
                                          props.showdeletewarning === insideAccount.uniqueAccountName && (
                                            <div className={styles.error_connected}>
                                              <div>
                                                <img className={styles.error_connect_img} src={imageHost + "/Polygon-upper.png"} />
                                              </div>
                                              <div className={`border border-1 ${styles.error2} ${styles.error_2_warning} ps-3 pe-3`}>
                                                <a onClick={() => props.hideWarning()} className={styles.cross_connected}> <img
                                                  src={imageHost + "/cross-icon.png"} alt="" className={styles.src} />
                                                </a>
                                                <p className={styles.error2_para}>
                                                  <span>Alert :</span>
                                                  Do you want to Delete the account? If yes,please click on &nbsp;
                                                  <a onMouseDown={() => props.deleteAccount(insideAccount.uniqueAccountName)} className={`${styles.href} ${styles.error_2_img}`}
                                                  >continue</a>
                                                </p>
                                              </div>
                                            </div>)
                                        }
                                        {
                                          props.allcoinsdiv === insideAccount.uniqueAccountName ?
                                            <div className={`${styles.all_coins} mt-2`}>
                                              <div className='ps-3 pe-3'>
                                                <a onClick={() => props.hideWarning()} className={styles.cross_connected}> <img
                                                  src={imageHost + "/cross-icon.png"} alt="" className={styles.src} />
                                                </a>
                                                <div className={`${styles.main_coins_div} d-flex flex-wrap`}>
                                                  {insideAccount.wallets.map((walletarr: any, index: any) => {
                                                    return <>
                                                      {walletarr.currencyDetails.logo_url !== "" ?
                                                        <p key={index} className={styles.coins_para}><img className={`${styles.coins_total_img} p-1`} src={walletarr.currencyDetails.logo_url} alt="" /><span className={styles.coins_span}>{walletarr.currencyDetails.name}</span></p> :
                                                        <>
                                                          <p className={styles.coins_para}><img className={styles.default_coin} src={imageHost + "/default-crypto-icon.svg"} alt="" /> <span className={styles.coins_span}>{walletarr.currency}</span></p>
                                                        </>
                                                      }
                                                    </>
                                                  })}
                                                </div>
                                              </div>
                                            </div> : <></>
                                        }
                                        {
                                          props.showingErrorDiv === insideAccount.uniqueAccountName ? <div className={styles.error_connected}>
                                            <div>
                                              <img className={styles.error_connect_img} src={imageHost + "/Polygon-upper.png"} />
                                            </div>
                                            <div className={`border border-1 ${styles.error2} ${styles.error_2_warning} ps-3 pe-3`}>
                                              <a onClick={() => props.hideWarning()} className={styles.cross_connected}> <img
                                                src={imageHost + "/cross-icon.png"} alt="" className={styles.src} />
                                              </a>
                                              <p className={styles.error2_para}>
                                                <span>Alert :</span>
                                                {props.warningSignErrorReason}
                                              </p>
                                            </div>
                                          </div> : <></>
                                        }
                                      </div>
                                    </div>
                                  </>
                                })}

                              </div>
                            </div>
                          </>
                        })}
                      </div>
                    </div>
                  </> : <div className={`${styles.no_account} ${styles.no_account_desktop}`}>
                    <img className={styles.complete_img} src={imageHost + "/no-connected-account.svg"} alt="" />
                    <p className={`${styles.complete_para} mt-2`}>You don't have any <span>Connected Account </span></p>
                  </div>
                }
              </>
            </div>
            {showingConnectedDiv &&
              <div className='mt-3'>
                {props.isLoader === true ? <div className={styles.loader_account}><img className={styles.loader_image} src={imageHost + '/loader-small.gif'} alt='' /></div> : <>
                  {userAccountAssets.length != 0 ?
                    <div className={`${styles.connected_accounts} ${styles.mobile_completed_version} px-3`}>
                      {userAccountAssets.map((connectedAcc: any, i: any) => {
                        return <div key={i} className={props.totalValueOfTransaction.get(connectedAcc[0].account.account) === null || props.totalValueOfTransaction.get(connectedAcc[0].account.account) === undefined ? "d-none" : `${styles.connected_list} row mt-4`}>
                          <div className="col-xl-6">
                            <div className="row">
                              <div className="pe-0 col-3">
                                <div className={styles.account_name}>
                                  <p className={styles.light_color}>Accounts</p>
                                  <div className={styles.account_name}>
                                    <img className={styles.inprog_account_img} src={imageHost + `/exchanges/` + connectedAcc[0].account.accountNameInLC + `.png?v=1`}
                                      alt="" />{connectedAcc[0].account.account}
                                  </div>
                                </div>
                              </div>
                              <div className="col-4 text-end">
                                <div className={styles.account_name}>
                                  <p className={styles.light_color}>Total Account</p>
                                  <p className='text_center'>{connectedAcc.length}</p>
                                </div>
                              </div>
                              <div className="col-5 text-end">
                                <div className={styles.account_name}>
                                  <p className={styles.light_color}>Last Update</p>
                                  {connectedAcc[0].syncCompletedAt ? <>{getFormatedDate(parseISO(String(connectedAcc[0].syncCompletedAt)), "dd-MMM-yy HH:mm:ss")}</> : <></>}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={`col-xl-6 ${styles.second_thing} mt-2`}>
                            <div className="row">
                              <div className="col-4 p-0">
                                <div className={`${styles.account_name} text-start text-lg-center ps-3 ps-lg-0`}>
                                  <p className={styles.light_color}>Total txns</p>
                                  {props.totalValueOfTransaction.get(connectedAcc[0].account.account)}
                                </div>
                              </div>
                              <div className="col-4">
                                <div className={`${styles.account_name} text-start`}>
                                  <p className={`${styles.light_color} ps-3`}>Coins</p>
                                  <p className='ps-4'>{props.totalValueOfCoins.get(connectedAcc[0].account.account)}</p>
                                </div>
                              </div>
                              <div className="col-4 text-lg-center text-end">
                                <div className={`${styles.account_name} text-end`}>
                                  <p className={`${styles.light_color} text-center`}>Action</p>
                                  <div className='d-flex justify-content-center'>
                                    <div className={styles.account_name}>
                                      <img src={imageHost + "/loader-small.gif"} alt="" className={styles.syncing_refresh} id={"img_main" + connectedAcc[0].account.account} />
                                      <button className='px-0 py-0' onClick={() => { callingAllElementToSync(connectedAcc); props.toggle(i) }} disabled={issyncEnabled} ><img className={styles.refresh_icon} id={"btn_main" + connectedAcc[0].account.account} src={imageHost + "/refresh-sync-connected.svg"} alt="" /></button>
                                    </div>
                                    <div className='text-end ps-2 ms-2'>
                                      <div className='position-relative' onClick={() => props.toggle(i)}>
                                        {props.selected === i ?
                                          <button className={styles.btn_disable} disabled={issyncEnabled}>
                                            <img className='d-block py-0' id={"down" + connectedAcc[0].account.account} src={imageHost + "/arrow-up-account.svg"} alt="" />
                                          </button> :
                                          <button className={styles.btn_disable} disabled={issyncEnabled}>
                                            <img className='d-block py-0' src={imageHost + "/arrow-down-account.svg"} alt="" />
                                          </button>
                                        }
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={props.selected === i ? `border border-1 ${styles.showing_real_account} mt-2 mb-3` : `${styles.showing_para}`}>
                            {connectedAcc.map((insideAccount: any) => {
                              return <>
                                <div className={props.deleteAccountName === insideAccount.uniqueAccountName ? "d-none" : "row"}>
                                  <div className={`col-6 col-lg-6 ${styles.account_name} ${styles.account_name_2}`}>
                                    {insideAccount.userDefinedAccountName}
                                  </div>
                                  <div className={`col-6 col-lg-6 ${styles.account_name} text-end ${styles.account_name_2}`}>
                                    <img src={imageHost + "/loader-small.gif"} alt="" className={styles.syncing_refresh} id={"rightImage_mobile" + insideAccount.uniqueAccountName} />
                                    <div className={`${styles.info_icon_adjustment} pe-1`} style={{ display: "none" }} id={'errorTip_mobile' + insideAccount.uniqueAccountName}>
                                      <img src={imageHost + "/error-warning-icon.svg"} alt="" onClick={() => props.showingerrorInSync(insideAccount.uniqueAccountName)} className={styles.syncing_error} id={'syncError_mobile' + insideAccount.uniqueAccountName} />
                                    </div>
                                    <img className={styles.right_img} id={"right_mobile" + insideAccount.uniqueAccountName} src={imageHost + "/right-click-exchanges.svg"} alt="" />
                                    {insideAccount.syncCompletedAt ? <>{getFormatedDate(parseISO(String(insideAccount.syncCompletedAt)), "dd-MMM-yy HH:mm:ss")}</> : <></>}
                                  </div>
                                  <div className={`col-3 col-lg-2 text-center ${styles.account_name}  ${styles.account_name_2}`}>
                                    {insideAccount.totalTxns}
                                  </div>
                                  <div className={`col-5 ${styles.account_name} ${styles.account_name_2}`}>
                                    {insideAccount.wallets.length === 0 ?
                                      <div className='text-center ps-4'>
                                        ---
                                      </div> :
                                      <div className='d-flex justify-content-center'>
                                        {insideAccount.wallets.map((walletarr: any, innerindex: number) => {
                                          return <div key={innerindex}>
                                            {insideAccount.wallets.length <= 3 ?
                                              <img className={`${styles.coins_img} p-1`} src={walletarr.currencyDetails.logo_url} alt="" /> :
                                              <>
                                                {innerindex < 2 ? <img className={`${styles.coins_img} p-1`} src={walletarr.currencyDetails.logo_url} alt="" /> : <></>}
                                                {innerindex === insideAccount.wallets.length - 1 ? <span onClick={() => props.showingAllCoins(insideAccount.uniqueAccountName)} className={styles.length}>+{insideAccount.wallets.length - 2} </span> : <></>
                                                }

                                              </>
                                            }
                                          </div>
                                        })}
                                      </div>
                                    }
                                  </div>
                                  <div className={`col-4 ${styles.account_name} text-end  ${styles.account_name_2}`}>
                                    <img src={imageHost + "/loader-small.gif"} alt="" className={styles.syncing_refresh} id={"syncImage_mobile" + insideAccount.uniqueAccountName} />
                                    <img onClick={() => userTriggerSeparate(insideAccount.uniqueAccountName, insideAccount.account.account, connectedAcc)} id={"sync_mobile" + insideAccount.uniqueAccountName} className={`${styles.inside_element_img} me-3`} src={imageHost + "/refresh-sync-connected.svg"} alt="" />
                                    <img src={imageHost + "/loader-small.gif"} alt="" className={styles.syncing_connected} id={"image_mobile" + insideAccount.uniqueAccountName} />
                                    <button className='btn p-0 mb-1' onClick={() => props.connectedDelete(insideAccount.uniqueAccountName)} disabled={disbalingDeleteButtonAsSyncing}><img id={"delete_mobile" + insideAccount.uniqueAccountName} className='inside_element_img ms-2' src={imageHost + "/delete-new-icon.svg"} alt="" /></button>
                                  </div>
                                </div>
                                {
                                  props.showdeletewarning === insideAccount.uniqueAccountName && (
                                    <div className={styles.error_connected}>
                                      <div>
                                        <img className={styles.error_connect_img} src={imageHost + "/Polygon-upper.png"} />
                                      </div>
                                      <div className={`border border-1 ${styles.error2} ${styles.error_2_warning} ps-3 pe-3`}>
                                        <a onClick={() => props.hideWarning()} className={styles.cross_connected}> <img
                                          src={imageHost + "/cross-icon.png"} alt="" className={styles.src} />
                                        </a>
                                        <p className={styles.error2_para}>
                                          <span>Alert :</span>
                                          Do you want to Delete the account? If yes,please click on &nbsp;
                                          <a onMouseDown={() => props.deleteAccount(insideAccount.uniqueAccountName)} className={`${styles.href} ${styles.error_2_img}`}
                                          >continue</a>
                                        </p>
                                      </div>
                                    </div>)
                                }
                                {
                                  props.allcoinsdiv === insideAccount.uniqueAccountName ?
                                    <div className={`${styles.all_coins} mt-2`}>
                                      <div className='ps-3 pe-3'>
                                        <a onClick={() => props.hideWarning()} className={styles.cross_connected}> <img
                                          src={imageHost + "/cross-icon.png"} alt="" className={styles.src} />
                                        </a>
                                        <div className={`${styles.main_coins_div} d-flex flex-wrap`}>
                                          {insideAccount.wallets.map((walletarr: any, index: any) => {
                                            return <>
                                              {walletarr.currencyDetails.logo_url !== "" ?
                                                <p key={index} className={styles.coins_para}><img className={`${styles.coins_total_img} p-1`} src={walletarr.currencyDetails.logo_url} alt="" /><span className={styles.coins_span}>{walletarr.currencyDetails.name}</span></p> :
                                                <>
                                                  <p className={styles.coins_para}><img className={styles.default_coin} src={imageHost + "/default-crypto-icon.svg"} alt="" /> <span className={styles.coins_span}>{walletarr.currency}</span></p>
                                                </>
                                              }
                                            </>
                                          })}
                                        </div>
                                      </div>
                                    </div> : <></>
                                }
                                {
                                  props.showingErrorDiv === insideAccount.uniqueAccountName ? <div className={styles.error_connected}>
                                    <div>
                                      <img className={styles.error_connect_img} src={imageHost + "/Polygon-upper.png"} />
                                    </div>
                                    <div className={`border border-1 ${styles.error2} ${styles.error_2_warning} ps-3 pe-3`}>
                                      <a onClick={() => props.hideWarning()} className={styles.cross_connected}> <img
                                        src={imageHost + "/cross-icon.png"} alt="" className={styles.src} />
                                      </a>
                                      <p className={styles.error2_para}>
                                        <span>Alert :</span>
                                        {props.warningSignErrorReason}
                                      </p>
                                    </div>
                                  </div> : <></>
                                }
                              </>
                            })}
                          </div>
                        </div>
                      })}
                    </div> :
                    <div className={`${styles.no_account_mobile} ${styles.no_account}`}>
                      <img className={styles.complete_img} src={imageHost + "/no-connected-account.svg"} alt="" />
                      <p className={`${styles.complete_para}1 mt-2`}>You don't have any <span>Connected Account </span></p>
                    </div>
                  }
                </>}
              </div>
            }
          </div>
        </div>
      </div></>
  )
}

export default CompletedAccounts


