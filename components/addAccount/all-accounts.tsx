import { useRouter } from 'next/router';
import React, { useState } from 'react';
// import { Link } from "react-router-dom"
import styles from "../../styles/add-account/add-account.module.scss";

var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;

export const AccountsFun = (props: any) => {
    const router = useRouter();
    const [searchaccount, setsearchaccount] = useState("");
    function triggerSyncAgain(accountName: any, booleanValue: boolean) {
        props.setwarningSignActivation("idle");
        props.setwarningTrigger("idle");
        props.userAccountTriggerSync(accountName, booleanValue);
    }

    const deletingErrorDiv = (deletingObj: any) => {
        let inprogId = document.getElementById(deletingObj);
        inprogId!.style.display = "none";
    }




    // For the import page data, which need accounts and different data
    function sendingDataTonextPage(accounts: any, totalNoAccs: any) {
        console.log(accounts, totalNoAccs);
        router.push({
            pathname: '/import-account',
            query: {
                account: JSON.stringify(accounts),
                totalNoAcc: JSON.stringify([...totalNoAccs])
            }
        });
    }
    function sendingRetryToNextPage(account: any, newAccount: any, totalNoOfAcc: any, uniqueAccName: any) {
        router.push({
            pathname: '/import-account',
            query: {
                account: JSON.stringify(account),
                newAccount: JSON.stringify(newAccount),
                totalNoAcc: JSON.stringify([...totalNoOfAcc]),
                uniqueAccName: JSON.stringify(uniqueAccName),
            }
        });
    }

    return (
        <>
            {props.errorVezgo === "inprogress" ?
                <div className={styles.error}>
                    <div className={`border border-1 ${styles.error2}`}>
                        <p className={styles.warning_para}>
                            <span>Error :</span>&nbsp;
                            {props.errorVezgoShow}
                        </p>
                    </div>
                </div>
                : <></>}
            {props.accountAddingActivation === "inprogress" ?
                <div className={styles.new_account}>
                    <div>
                        <h1 className={styles.first_header}>New Account Added</h1>
                    </div>
                    {/* Loader Activation  */}
                    {props.loaderActivation === "inprogress" ?
                        <div className={styles.loader_prog}>
                            <img src={imageHost + "/loader2.gif"} alt="" />
                        </div> : ""
                    }
                    {props.progressBarActivation === "inprogress" ?
                        <div className={styles.main_progress}>
                            <div>
                                <p className={styles.main_progress_account} style={{ "wordBreak": "break-all" }}><img src={imageHost + "/exchanges/" + props.progressBarImageSource + ".png?v=2"} alt="" />
                                    {props.progressAccount}
                                </p>
                                <p className='ps-4 ms-1' style={{ "lineHeight": "0.8", "fontSize": "14px", "wordBreak": "break-all" }}>({props.getUserDefinedName})</p>
                            </div>
                            {props.syncingprogress === "inprogress" ?
                                <p className={styles.main_progress_sync}>
                                    <img className={styles.loader_main_progress} src={imageHost + "/loader-small.gif"} alt="" />
                                    <span className={styles.syncing_span}>Retrieving Data</span>
                                </p> : <></>
                            }
                            {props.fetchingsuccess === "inprogress" ?
                                <p className={styles.main_progress_sync}>
                                    <img className={styles.loader_main_progress} src={imageHost + "/right-sync.svg"} alt="" />
                                    <span className={styles.syncing_span}>Synced</span>
                                </p> : <></>
                            }
                            {props.isErrorinProgBar === "inprogress" ?
                                <p className={styles.sync_icon}>
                                    <img className={styles.sync_error} src={imageHost + "/sync-error-icon.svg"} alt="" />
                                </p> : <></>
                            }
                        </div> : <></>
                    }
                    {props.warningSignActivation === "inprogress" ?
                        <div>
                            <img src={imageHost + "/Polygon-upper.png"} className={styles.polygon_2_prog} />
                            <div className={`border border-1 ${styles.error_2_warning} ${styles.error2}`}>
                                <div>
                                    <img onClick={() => { props.hideWarning() }} src={imageHost + "/cross-icon.png"} alt=""
                                        className={`${styles.src} ${styles.cross_prog}`} />
                                </div>
                                {props.waringSignActivateBecauseOfError === "inprogress" ?
                                    <p className={styles.warning_para}>
                                        <span>Error :</span>
                                        &nbsp;
                                        {props.waringSignActivateBecauseOfErrorReason}&nbsp;
                                        <a onClick={() => triggerSyncAgain(props.localAccount, true)} className={`${styles.href} ${styles.war_continue}`}>Retry</a>
                                    </p> : ""
                                }
                            </div>
                        </div> : ""
                    }
                    {props.syncsuccesprogress === "inprogress" ?
                        <div className={styles.error_warning}>
                            <img src={imageHost + "/polygon-success.svg"} className={styles.polygon_warning} />
                            <div className={`border border-1 ${styles.error2}`}>
                                <div>
                                    <img onClick={() => { props.hideWarning() }} src={imageHost + "/cross-success.svg"} alt=""
                                        className={`${styles.src} ${styles.cross_prog}`} />
                                </div>
                                <p className={styles.warning_para}>
                                    <span>Success: </span>
                                    Sync of Transactions is successful.
                                </p>
                            </div>
                        </div> : <></>
                    }
                    {props.progresscontinue === "inprogress" ?
                        <div className={styles.error_warning}>
                            <img src={imageHost + "/polygon-success.svg"} className={styles.polygon_warning} />
                            <div className={`border border-1 ${styles.error2}`}>
                                <div>
                                    <img onClick={() => { props.hideWarning() }} src={imageHost + "/cross-success.svg"} alt=""
                                        className={`${styles.src} ${styles.cross_prog}`} />
                                </div>
                                <p className={styles.warning_para}>
                                    We are connected to account and are retrieving the transactions.  You can either wait or can add more accounts or go to <a href="/users-portfolio" className={`${styles.href} ${styles.war_continue}`}>portfolio</a>
                                </p>
                            </div>
                        </div> : <></>
                    }
                </div> : ""
            }
            {/* Incomplete Accounts */}
            {props.inprogdiv ?
                <div className={styles.incomp_exch_div}>
                    {props.inprogressAccounts.length != 0 ?
                        <div>
                            <h1 className={`${styles.first_header} ${styles.first_header_progress}`}>Account Connection Incomplete</h1>
                        </div> : ""
                    }
                    <div className={styles.scroll_div}>
                        {props.inprogressAccounts.map((inprog: any, index: any) => {
                            return <>
                                <div key={inprog.account.accountDisplayName} className={`${styles.inprog_main} row g-0`}>
                                    <div className='col-7 mt-2'>
                                        <img
                                            src={`${imageHost}` + `/exchanges/` + inprog.account.accountNameInLC + `.png?v=1`} alt=""
                                            className={`${styles.incom_img} me-2`} /><span className='pt-1'>{inprog.account.accountDisplayName}</span>
                                    </div>
                                    <div className={`${styles.incomplete_retry_div} pe-2 col-4 text-end`}>
                                        <div onClick={()=>sendingRetryToNextPage(inprog.account,inprog.userDefinedAccountName,props.totalNumberOfAccounts,inprog.uniqueAccountName)}>
                                            <img className={`${styles.reconnect_logo} col-1`} src={imageHost + "/retry-new-link.svg"} alt="" />
                                            <a className={styles.retry_prog}>Retry</a>
                                        </div>
                                        {/* <Link to='/add-account/import' state={{ account: inprog.account, newAccount: inprog.userDefinedAccountName, totalNoOfAcc: props.totalNumberOfAccounts, uniqueAccName: inprog.uniqueAccountName }}>
                                            <img className={`${styles.reconnect_logo} col-1`} src={imageHost + "/retry-new-link.svg"} alt="" />
                                            <a className={styles.retry_prog}>Retry</a>
                                        </Link> */}
                                    </div>
                                    <img src={imageHost + "/loader-small.gif"} alt="" className={`${styles.inprog_loader} col-1`} id={"image" + inprog.uniqueAccountName} />
                                    <img id={"delete" + inprog.uniqueAccountName} onMouseDown={() => props.deleteAccount(inprog.uniqueAccountName, false)}
                                        src={imageHost + "/delete-new-icon.svg"} alt="" className={`${styles.incomplete_delete} text-end col-1`} />
                                </div>
                                {inprog.uaStatus === "TEMP_ERROR" ?
                                    <div>
                                        {props.warningProgress !== inprog.account.uniqueAccountName || props.warningProgress === "inprogress" ?
                                            <div className={styles.inprog_warning} id={inprog.account.namaccountNameInLCe + "deleteId"}>
                                                <div>
                                                    <img src={imageHost + "/Polygon-upper.png"} className={styles.polygon_2_prog} />
                                                </div>
                                                <div className={styles.incomplete_error}>
                                                    <img onClick={() => { deletingErrorDiv(inprog.account.uniqueAccountName + "deleteId") }} src={imageHost + "/cross-icon.png"} alt=""
                                                        className={`${styles.src} ${styles.cross_prog}`} />
                                                    <div>
                                                        <p className={styles.incomplete_para}>
                                                            <span>Error: </span>{inprog.error.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div> : ""}
                                    </div>
                                    : ""}
                                {inprog.uaStatus === "IN_PROGRESS" ?
                                    <div>
                                        {props.warningProgress === "inprogress" || props.warningProgress !== inprog.account.accountNameInLC ? <div className={styles.inprog_warning}>
                                            <div>
                                                <img src={`${imageHost}` + "/Polygon-upper.png"} className={styles.polygon_2_prog} />
                                            </div>
                                            <div className={styles.incomplete_error}>
                                                <img onClick={() => { props.hideWarning(inprog.account.accountNameInLC) }} src={imageHost + "/cross-icon.png"} alt=""
                                                    className={`${styles.src} ${styles.cross_prog}`} />
                                                <div>
                                                    <p className={styles.incomplete_para}>
                                                        <span>Alert:</span> Connection setup is Incomplete
                                                    </p>
                                                </div>
                                            </div>
                                        </div> : ""}
                                    </div> : ""
                                }
                            </>
                        })}
                    </div>
                </div> : ""
            }
            <h1 className={styles.first_header}>Add <span>Account</span></h1>
            <p className={styles.first_para}>Select the account that you want to add</p>
            <input type="text" className={`px-3 ${styles.first_input}`} placeholder='E.g. Coinbase,Bitcoin' onChange={event => { setsearchaccount(event.target.value) }} />
            <div className={`row ${styles.boxes}`}>
                {props.isLoader === true ? <div className={styles.loader_accounts}><img src={imageHost + '/loader-small.gif'} alt='' /> </div> :
                    <>
                        {props.accounts.filter((val: any) => {
                            if (searchaccount == "") {
                                return val;
                            } else if (val.accountDisplayName.toLowerCase().includes(searchaccount.toLowerCase())) {
                                return val;
                            }
                        }).map((currExch: any) => {
                            return <>
                                <div key={currExch.accountNameInLC} className={`${styles.all_btns}  text-center col-4 col-xs-6 col-sm-3 col-md-2 col-lg-3 col-xl-3 ps-1 py-2 position-relative`}>
                                    <div onClick={() => { sendingDataTonextPage(currExch, props.totalNumberOfAccounts) }}>
                                        <img className={styles.boxes_account} src={imageHost + `/exchanges/` + currExch.accountNameInLC + `.png?v=1`} alt={currExch.accountDisplayName} />
                                        <div style={{ "textDecoration": "none" }}>{currExch.accountDisplayName}</div>
                                    </div>
                                </div>
                            </>
                        })}
                    </>}
            </div>
        </>
    )
}
export default AccountsFun;


