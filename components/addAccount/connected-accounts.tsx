import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ClientService from '../../services/main-serviceClient';
import styles from "../../styles/add-account/add-account.module.scss";

var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;
var isError = false;
var isAccountSync = false;
let completedItem: any[] = [];
let clientservice: any = ClientService("post");
const ConnectedAccount = (props: any) => {
    const [isSyncLoading, setisSyncLoading] = useState("idle");
    const [reload, setreload] = useState(false);
    const [isDropdown, setisDropdown] = useState("");
    const [isShowingInsideAccount, setisShowingInsideAccount] = useState(false);
    const [ishidingIcon, setishidingIcon] = useState("");
    const [showingExpiredDiv, setshowingExpiredDiv] = useState(true);
    const [showingConnectedDiv, setshowingConnectedDiv] = useState(true);
    const [selected, setselected] = useState(null);

    const toggle = (i: any) => {
        if (selected === i) {
            return setselected(null)
        }

        setselected(i)
    }

    let connectedAccountArray: any[] = [];
    connectedAccountArray = props.connectedArray;
    function synxUserTransactions(accountName: any, booleanValue: boolean) {
        console.log(accountName);
        props.setshowDeletewarning("idle");
        props.syncingstart(accountName);
        props.userAccountTriggerSync(accountName, booleanValue);
        props.setwarningInSync("idle");
    }

    async function callingAllElementToSync(data: any) {
        completedItem = [];
        setisDropdown("down" + data[0].account.account);
        setisShowingInsideAccount(true);
        data.forEach((accountSync: any) => {
            setTimeout(() => {
                props.syncingstart(accountSync.uniqueAccountName)
                userAccountTriggerSyncMain(accountSync.uniqueAccountName, accountSync.account.account, data);
            }, 200);
            props.syncingstartMain(accountSync.account.account);
        });
    }

    // Sync trigger api
    const userAccountTriggerSyncMain = async (accountName: any, mainAccountName: any, connectedAcc: any) => {
        props.setsyncsuccess("idle");
        props.setwarningInSync("idle");
        props.setdisbalingDeleteButtonAsSyncing(accountName);
        props.setissyncEnabled(true);
        console.log("AccountName");
        console.log(accountName);
        
        try {
            const userAccountTriggerSyncApi = await clientservice(`/api/v1/add-account/triggerSync?accountoSync=${accountName}`, null, null);
            console.log("Resoonse aa gya");
            console.log(userAccountTriggerSyncApi);
            props.syncingstart(accountName);
            if (userAccountTriggerSyncApi.data.error === null && userAccountTriggerSyncApi.data.status === "COMPLETED") {
                userSyncAccountAndTxnsMain(accountName, mainAccountName, connectedAcc);
                console.log("Completed");
            } else {
                props.setwarningInSync(accountName)
                props.setwaringSignActivateBecauseOfError("inprogress");
                props.setprogresscontinue("idle");
                props.setwaringSignActivateBecauseOfErrorReason(userAccountTriggerSyncApi.data.error.message)
                props.setdisbalingDeleteButtonAsSyncing("idle")
                props.syncingendMain(mainAccountName);
                props.syncingend(accountName)
                if (completedItem.length === connectedAcc.length) {
                    props.setissyncEnabled(false);
                    props.syncingendMain(mainAccountName);
                }
            }
        } catch (e: any) {
            props.setissyncEnabled(false);
            props.syncingendMain(mainAccountName);
            console.log(e);
            props.syncingend(accountName);
            props.setwarningInSync(accountName);
            props.setwaringSignActivateBecauseOfError("inprogress")
            props.setwaringSignActivateBecauseOfErrorReason(e.data.error);
        }
    }
    const userSyncAccountAndTxnsMain = async (accountName: any, mainAccountName: any, connectedAcc: any) => {
        props.setsyncsuccess("idle");
        props.setwarningInSync("idle");
        try {
            const syncaccountcalling = await clientservice(`/api/v1/add-account/syncAccount?accountoSync=${accountName}`, null, "ups", null);
            console.log("syncaccountcalling");
            console.log(syncaccountcalling);
            if (syncaccountcalling.data.status === "COMPLETED") {
                completedItem.push(syncaccountcalling.data.account)
                if (completedItem.length === connectedAcc.length) {
                    props.setissyncEnabled(false);
                    props.syncingendMain(mainAccountName);
                    setreload(true);
                    props.setdisbalingDeleteButtonAsSyncing("idle");
                }
                props.setsyncsuccess(accountName);
                props.syncingend(accountName)
            } else if (syncaccountcalling.data.status === "IN_PROGRESS" || syncaccountcalling.data.status === "VEZGO_SYNC_IN_PROGRESS") {
                setTimeout(() => {
                    userSyncAccountAndTxnsMain(accountName, mainAccountName, connectedAcc);
                }, 10000);
            }
            else {
                props.setdisbalingDeleteButtonAsSyncing("idle");
                props.syncingend(accountName);
                props.syncingendMain(mainAccountName);
                setisSyncLoading("idle");
                setreload(true);
                isError = true;
                props.setwarningInSync(accountName);
                props.setwaringSignActivateBecauseOfError("inprogress");
                props.setwaringSignActivateBecauseOfErrorReason(syncaccountcalling.data.error.message);
                completedItem.push(syncaccountcalling.data.account);
                if (completedItem.length === connectedAcc.length) {
                    props.setissyncEnabled(false);
                    props.setdisbalingDeleteButtonAsSyncing("idle");
                    props.syncingendMain(mainAccountName);
                    setreload(true);
                }
            }
        }
        catch (e: any) {
            console.log(e);
            props.syncingendMain(mainAccountName);
            props.setdisbalingDeleteButtonAsSyncing("idle");
            setreload(true);
            setisSyncLoading("idle");
            completedItem.push(mainAccountName);
            if (completedItem.length === connectedAcc.length) {
                props.setissyncEnabled(false);
                props.syncingendMain(mainAccountName);
                setreload(true);
            }
            isError = true
        }
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

    return (
        <>
            <div className={`${styles.second_part} col-12 col-xl-6 mt-3`}>
                <h1 className={`${styles.second_header} ${styles.second_header_expired} d-none d-xl-block`}>Expired <span>Account</span></h1>
                <div className={`${styles.mobile_expired_account} py-2`}>
                    <h4 className={`${styles.second_header_mobile} ps-2 mb-0`}>Expired Account(s)</h4>
                    {showingExpiredDiv === true ?
                        <img onClick={(e) => { setshowingExpiredDiv(!showingExpiredDiv) }} className={`pe-3 ${styles.arrows}`} src={imageHost + "/arrow-up-account.svg"} alt="" />
                        :
                        <img onClick={(e) => { setshowingExpiredDiv(!showingExpiredDiv) }} className={`pe-3 ${styles.arrows}`} src={imageHost + "/arrow-down-account.svg"} alt="" />
                    }
                </div>
                {showingExpiredDiv &&
                    <div className={styles.scroll_div}>
                        {props.expiredAccounts.length === 0 ?
                            <div className={`text-center ${styles.no_account_expired} mt-1 py-5`}>
                                <img src={imageHost + "/no-expired-account.svg"} alt="" />
                                <p className={styles.no_expired_para}>You don't have any <span>Expired Account</span> at this time</p>
                            </div>
                            :
                            <div className={`info-table-border mt-2 me-0`}>
                                <table className={`table mb-0 table-head-size`}>
                                    <thead className={styles.static_border_bottom}>
                                        <tr>
                                            <th scope="col" className={`border-top-0 ${styles.border_adjustment} col-9`}>Account Name </th>
                                            <th scope="col" className={`border-top-0 col-3 ${styles.border_adjustment} text-center`}>Action</th>
                                        </tr>
                                    </thead>
                                </table>
                                {props.isLoader === true ? <div className={styles.loader_account}><img className={styles.loader_image} src={imageHost + '/loader-small.gif'} alt='' /></div> : <>
                                    {props.expiredAccounts.map((expiredExch: any) => {
                                        return <>
                                            <div className={`row g-0 ${styles.main_expired} py-2`}>
                                                <div className='col-9'>
                                                    <img className={styles.account_image} src={imageHost + `/exchanges/` + expiredExch.account.accountNameInLC + `.png?v=1`} alt="" /> {expiredExch.userDefinedAccountName}
                                                </div>
                                                <div className='col-3'>
                                                    <div className='d-flex justify-content-center'>
                                                        <div className='px-2' onMouseDown={() => props.retryFunctionality(expiredExch.account.accountNameInLC)}>
                                                            <Link to="/add-account/import" state={{ account: props.retryaccount, newAccount: expiredExch.userDefinedAccountName, uniqueAccName: expiredExch.uniqueAccountName }}>
                                                                <button className={styles.expired_retry_btn} id={"btn" + expiredExch.uniqueAccountName}>
                                                                    <img className={styles.function_img} src={imageHost + "/retry-new-link.svg"} alt="" />
                                                                </button>
                                                            </Link>
                                                        </div>
                                                        <div className='px-2'>
                                                            <img src={imageHost + "/loader-small.gif"} alt="" className={styles.syncing_expired_loader} id={"image" + expiredExch.uniqueAccountName} />
                                                            <img className={styles.function_img} onClick={() => props.connectedDelete(expiredExch.uniqueAccountName)} id={"delete" + expiredExch.uniqueAccountName} src={imageHost + "/delete-new-icon.svg"} alt="" />
                                                        </div>
                                                    </div>
                                                </div>
                                                {props.showdeletewarning === expiredExch.uniqueAccountName && (
                                                    <div className={`${styles.error_connected} col-12`}>
                                                        <div>
                                                            <img className={styles.error_connect_img} src={imageHost + "/Polygon-upper.png"} />
                                                        </div>
                                                        <div className={`border border-1 ${styles.error2} ${styles.error_2_warning} ps-3 pe-3`}>
                                                            <p className={styles.error2_para}>
                                                                <a onClick={() => props.hideWarning(expiredExch.uniqueAccountName)} className={styles.cross_connected}> <img
                                                                    src={imageHost + "/cross-icon.png"} alt="" className={styles.src} />
                                                                </a>
                                                                <span>Alert :</span>
                                                                Do you want to Delete the account? If yes,please click on
                                                                <a className={`${styles.href} ${styles.error_2_img}`} onMouseDown={() => props.deleteAccount(expiredExch.uniqueAccountName)}
                                                                >continue</a>
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    })}
                                </>}
                            </div>
                        }
                    </div>
                }
                {/* Connected Account  */}
                <div className='d-none justify-content-between d-xl-flex'>
                    <h1 className={styles.second_header}>Connected <span>Account</span></h1>
                </div>
                <div className={`${styles.mobile_expired_account} py-2 mb-1`}>
                    <h4 className={`${styles.second_header_mobile} ps-2 mb-0`}>Connected Account(s)</h4>
                    {showingConnectedDiv === true ?
                        <img onClick={(e) => { setshowingConnectedDiv(!showingConnectedDiv) }} className={`pe-3 ${styles.arrows}`} src={imageHost + "/arrow-up-account.svg"} alt="" />
                        :
                        <img onClick={(e) => { setshowingConnectedDiv(!showingConnectedDiv) }} className={`pe-3 ${styles.arrows}`} src={imageHost + "/arrow-down-account.svg"} alt="" />
                    }
                </div>
                {showingConnectedDiv &&
                    <div className={styles.scroll_div} id="deleting_connected">
                        {props.connectedAccounts.length === 0 ?
                            <div className={`text-center ${styles.no_account_expired} mt-1 py-5`}>
                                <img src={imageHost + "/no-connected-account.svg"} alt="" />
                                <p className={`mt-2 ${styles.no_expired_para}`}>You don't have any <span>Connected Account</span> at this time</p>
                            </div> :
                            <>
                                <table className={`table mb-0 table-head-size`}>
                                    <thead className={styles.static_border_bottom}>
                                        <tr>
                                            <th scope="col" className={`border-top-0 ${styles.border_adjustment} col-4`}>Account Name </th>
                                            <th scope="col" className={`border-top-0 ${styles.border_adjustment} col-4 text-center`}>Total Accounts</th>
                                            <th scope="col" className={`border-top-0 ${styles.border_adjustment} col-3 text-center`}>Sync</th>
                                            <th scope="col" className={`border-top-0 ${styles.border_adjustment} col-1 text-center`}> </th>
                                        </tr>
                                    </thead>
                                </table>
                                {props.isLoader === true ? <div className={styles.loader_account}><img className={styles.loader_image} src={imageHost + '/loader-small.gif'} alt='' /></div> :
                                    <>
                                        {props.connectedAccounts.map((connectedAcc: any, i: any) => (
                                            <div>
                                                <div key={connectedAcc[0].account.account} className={`row g-0 ${styles.connected_main} py-2`}>
                                                    <div className={`col-4 ${styles.account_div}`}>
                                                        <img className={styles.account_image} src={imageHost + `/exchanges/` + connectedAcc[0].account.accountNameInLC + `.png?v=1`} alt="" /> {connectedAcc[0].account.account}
                                                    </div>
                                                    <div className={`col-4 text-center ${styles.trades_type}`}>
                                                        <div className='px-2'>
                                                            {connectedAcc.length}
                                                        </div>
                                                    </div>
                                                    <div className={`col-3 text-center ${styles.trades_type}`}>
                                                        <div className='px-2'>
                                                            <img src={imageHost + "/loader-small.gif"} alt="" className={`${styles.syncing_connected} ps-2`} id={"img_main" + connectedAcc[0].account.account} />
                                                            <button className={styles.btn_main_disable} onClick={(e) => { callingAllElementToSync(connectedAcc); toggle(i) }} disabled={props.issyncEnabled}><img className={styles.function_img} id={"btn_main" + connectedAcc[0].account.account} src={imageHost + "/refresh-sync-connected.svg"} alt="" /></button>
                                                        </div>
                                                    </div>
                                                    <div className='col-1'>
                                                        <div className='position-relative' onClick={() => toggle(i)}>
                                                            {selected === i ?
                                                                <button className={styles.arrow_disable} disabled={props.issyncEnabled}>
                                                                    <img className='d-block py-2' id={"down" + connectedAcc[0].account.account} src={imageHost + "/arrow-up-account.svg"} alt="" />
                                                                </button> :
                                                                <button className={styles.arrow_disable} disabled={props.issyncEnabled}>
                                                                    <img className='d-block py-2' src={imageHost + "/arrow-down-account.svg"} alt="" />
                                                                </button>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={selected === i ? `${styles.showing_real_account}` : `${styles.showing_para}`}>
                                                    {connectedAcc.map((accountInside: any) => {
                                                        return <>
                                                            <div className={`row g-0 py-2 ${styles.inside_connected}`}>
                                                                <div className={`col-8 ${styles.account_div}`}>
                                                                    <img className={styles.account_image} src={imageHost + `/exchanges/` + accountInside.account.accountNameInLC + `.png?v=1`} alt="" /> {accountInside.userDefinedAccountName}
                                                                </div>
                                                                <div className='col-4 text-center'>
                                                                    <div className='d-flex justify-content-center'>
                                                                        <img src={imageHost + "/loader-small.gif"} alt="" className={styles.syncing_connected} id={"img" + accountInside.uniqueAccountName} />
                                                                        <div onClick={() => { userAccountTriggerSyncMain(accountInside.uniqueAccountName, connectedAcc[0].account.account, connectedAcc) }} className='px-2'>
                                                                            <button id={"btn" + accountInside.uniqueAccountName} className={styles.expired_retry_btn}>
                                                                                <img className={styles.connected_inside_img} src={imageHost + "/refresh-sync-connected.svg"} alt="" />
                                                                            </button>
                                                                        </div>
                                                                        <div className='px-2'>
                                                                            <img src={imageHost + "/loader-small.gif"} alt="" className={styles.syncing_connected} id={"image" + accountInside.uniqueAccountName} />
                                                                            {accountInside.uniqueAccountName === props.disbalingDeleteButtonAsSyncing ?
                                                                                <button className={styles.expired_retry_btn} id={"delete" + accountInside.uniqueAccountName} onClick={() => props.connectedDelete(accountInside.uniqueAccountName)} disabled={true}>
                                                                                    <img className={`${styles.function_img} pb_1`} src={imageHost + "/delete-new-icon.svg"} alt="" />
                                                                                </button> :
                                                                                <button className={styles.expired_retry_btn} id={"delete" + accountInside.uniqueAccountName} onClick={() => props.connectedDelete(accountInside.uniqueAccountName)} disabled={false}>
                                                                                    <img className={`${styles.function_img} pb-1`} src={imageHost + "/delete-new-icon.svg"} alt="" />
                                                                                </button>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {props.showdeletewarning === accountInside.uniqueAccountName && (
                                                                    <div className={styles.error_connected}>
                                                                        <div>
                                                                            <img className={styles.error_connect_img} src={imageHost + "/Polygon-upper.png"} />
                                                                        </div>
                                                                        <div className={`border border-1 ${styles.error2} ${styles.error_2_warning} ps-3 pe-3`}>
                                                                            <a onClick={() => props.hideWarning(accountInside.uniqueAccountName)} className={styles.cross_connected}> <img
                                                                                src={imageHost + "/cross-icon.png"} alt="" className={styles.src} />
                                                                            </a>
                                                                            <p className={styles.error2_para}>
                                                                                <span>Alert :</span>
                                                                                Do you want to Delete the account? If yes,please click on &nbsp;
                                                                                <a className={`${styles.href} ${styles.error_2_img}`} onMouseDown={() => props.deleteAccount(accountInside.uniqueAccountName)}
                                                                                >continue</a>
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {/* Warning In SYNC txns */}
                                                                {props.warningInSync === accountInside.uniqueAccountName ?
                                                                    <div className={styles.sync_warning}>
                                                                        <div>
                                                                            <div>
                                                                                <img src={imageHost + "/Polygon-upper.png"} className={styles.polygon_2_prog} />
                                                                            </div>
                                                                            <div className={`border border-1 ${styles.error_2_warning} ${styles.error2}`}>
                                                                                <div>
                                                                                    <img onClick={() => props.hideSyncwarning()} src={imageHost + "/cross-icon.png"} alt=""
                                                                                        className={`${styles.src} ${styles.cross_prog}`} />
                                                                                </div>
                                                                                {props.waringSignActivateBecauseOfError === "inprogress" ?
                                                                                    <p className={styles.warning_para}>
                                                                                        <span>Error :</span>&nbsp;
                                                                                        {props.waringSignActivateBecauseOfErrorReason}&nbsp;
                                                                                    </p> : ""
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div> : ""
                                                                }
                                                                {props.syncsuccess === accountInside.uniqueAccountName ?
                                                                    <div className={styles.transaction_success}>
                                                                        <div>
                                                                            <img className={styles.polygon_2_prog} src={imageHost + "/polygon-success.svg"} />
                                                                        </div>
                                                                        <div className={`border border-1 ${styles.success_2} ${styles.error_2_warning}  ps-3 pe-3`}>
                                                                            <a onClick={() => props.hideSyncwarning()} className={styles.cross_connected}> <img
                                                                                src={imageHost + "/cross-success.svg"} alt="" />
                                                                            </a>
                                                                            <p className={styles.success_para}>
                                                                                <span>Success :</span>
                                                                                Sync of Transactions is successful!
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    : ""}
                                                            </div>
                                                        </>
                                                    })}
                                                </div>
                                            </div>
                                        ))
                                        }
                                    </>
                                }
                            </>
                        }
                    </div >
                }
            </div >
        </>
    )
}

export default ConnectedAccount
