import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import styles from "../../styles/users-portfolio/transaction.module.scss";


var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;
let showingToAcc: any = [];
let showingToAssets: any = [];
let transactionImageShow: any = [];
const TransactionAccounts = (props: any) => {
    const [showingAccount, setshowingAccount] = useState([]);
    const [reload, setreload] = useState(false);
    const [thisAccountClicked, setThisAccountClicked] = useState("firstClicked");
    const [thisAssetClicked, setThiAssetClicked] = useState("firstAsset")
    const [transactionClicked, setTransacionClicked] = useState("clickedTransaction");

    // Formatting the date
    function getFormatedDate(date: Date, dateFormat: string) {
        return format(date, dateFormat);
    }
    // To show the dynamic account on click on image
    function gettingTopAccountsToShow(acc: any) {
        showingToAcc = acc;
        setreload(!reload);
    }

    // To show the dynamic assets on click on image
    function gettingTopAssetsToShow(assets: any) {
        showingToAssets = assets;
        setreload(!reload);
    }
    // To get the transaction type details
    function getTransactionToShow(data: any) {
        transactionImageShow = data;
        setreload(!reload);
    }
    // To make the first work capital
    function toTitles(s: any) { return s.replace(/\w\S*/g, function (t: any) { return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase(); }); }
    return (
        <>
            <div className={`${styles.allAccountsDetails} container`}>
                <div className={`${styles.top_accounts} ps-4`}>
                    <div className="row">
                        {props.totalUserConnectedAccounts !== null && props.totalUserConnectedAccounts !== undefined ?
                            <div className={`${styles.top_accounts_subhead} col-12 col-sm-12 col-lg-11 col-xl-8 border border-1 mt-4`}>
                                <button className={styles.top_account_heading_btn}><h4 className={styles.top_account_heading}>Top Account</h4></button>
                                <div className="row">
                                    <div className={styles.account_mobile}>
                                        <div className="col-12 col-sm-12 col-md-10 col-lg-3">
                                            {/* For 1 account */}
                                            {props.totalUserConnectedAccounts.length === 1 ?
                                                <div className={styles.background_accounts}>
                                                    <img className={thisAccountClicked === "firstClicked" ? `${styles.image_inside_accounts}  ${styles.pulse}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts); setThisAccountClicked("firstClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[0].account.accountNameInLC + `.png?v=1`} alt="" />
                                                    <div className={styles.background_inside_accounts}>
                                                        &nbsp;
                                                        <img className={styles.image_home_inside} src={imageHost + "/home-acounts.svg"} />
                                                        <p className={styles.inside_account_name}>{props.userTopAccounts.accountsCount}</p>
                                                        <p className={styles.inside_account_total}>Total Account</p>
                                                    </div>
                                                    <div className={styles.background_double_inside_accounts}>
                                                        &nbsp;
                                                    </div>
                                                </div> : <></>
                                            }
                                            {/* For 2 accounts */}
                                            {props.totalUserConnectedAccounts.length === 2 ?
                                                <div className={styles.background_accounts}>
                                                    &nbsp;
                                                    <img className={thisAccountClicked === "firstClicked" ? `${styles.image_inside_accounts} + ${styles.pulse}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); setThisAccountClicked("firstClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[0].account.accountNameInLC + `.png?v=1`} alt="" />
                                                    <div className={styles.background_inside_accounts}>
                                                        &nbsp;
                                                        <img className={styles.image_home_inside} src={imageHost + "/home-acounts.svg"} />
                                                        <p className={styles.inside_account_name}>{props.userTopAccounts.accountsCount}</p>
                                                        <p className={styles.inside_account_total}>Total Account</p>
                                                    </div>
                                                    <div className={styles.background_double_inside_accounts}>
                                                        &nbsp;
                                                    </div>
                                                    <img className={thisAccountClicked === "2Clicked" ?  `${styles.image_inside_accounts_2}  ${styles.pulse}` : `${styles.image_inside_accounts_2}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[1]); setThisAccountClicked("2Clicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[1].account.accountNameInLC + `.png?v=1`} alt="" />
                                                </div> : <></>
                                            }
                                            {/* For 3 accounts */}
                                            {props.totalUserConnectedAccounts.length === 3 ?
                                                <div className={styles.background_accounts}>
                                                    &nbsp;
                                                    <img className={thisAccountClicked === "firstClicked" ? `${styles.image_inside_accounts}  ${styles.pulse}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); setThisAccountClicked("firstClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[0].account.accountNameInLC + `.png?v=1`} alt="" />
                                                    <div className={styles.background_inside_accounts}>
                                                        &nbsp;
                                                        <img className={styles.image_home_inside} src={imageHost + "/home-acounts.svg"} />
                                                        <p className={styles.inside_account_name}>{props.userTopAccounts.accountsCount}</p>
                                                        <p className={styles.inside_account_total}>Total Account</p>
                                                    </div>
                                                    <div className={styles.background_double_inside_accounts}>
                                                        &nbsp;
                                                    </div>
                                                    <img className={thisAccountClicked === "secondClicked" ? `${styles.image_inside_accounts_second}  ${styles.pulse}` : `${styles.image_inside_accounts_second}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[1]); setThisAccountClicked("secondClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[1].account.accountNameInLC + `.png?v=1`} alt="" />
                                                    <img className={thisAccountClicked === "thirdClicked" ? `${styles.image_inside_accounts_third}  ${styles.pulse}` : `${styles.image_inside_accounts_third}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[2]); setThisAccountClicked("thirdClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[2].account.accountNameInLC + `.png?v=1`} alt="" />
                                                </div> : <></>
                                            }
                                            {/* For 4 accounts */}
                                            {props.totalUserConnectedAccounts.length === 4 ?
                                                <div className={styles.background_accounts}>
                                                    &nbsp;
                                                    <img className={thisAccountClicked === "firstClicked" ? `${styles.image_inside_accounts}  ${styles.pulse}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); setThisAccountClicked("firstClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[0].account.accountNameInLC + `.png?v=1`} alt="" />
                                                    <div className={styles.background_inside_accounts}>
                                                        &nbsp;
                                                        <img className={styles.image_home_inside} src={imageHost + "/home-acounts.svg"} />
                                                        <p className={styles.inside_account_name}>{props.userTopAccounts.accountsCount}</p>
                                                        <p className={styles.inside_account_total}>Total Account</p>
                                                    </div>
                                                    <div className={styles.background_double_inside_accounts}>
                                                        &nbsp;
                                                    </div>
                                                    <img className={thisAccountClicked === "secClicked" ? `${styles.image_inside_accounts_sec}  ${styles.pulse}` : `${styles.image_inside_accounts_sec}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[1]); setThisAccountClicked("secClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[1].account.accountNameInLC + `.png?v=1`} alt="" />
                                                    <img className={thisAccountClicked === "thClicked" ? `${styles.image_inside_accounts_th}  ${styles.pulse}` : `${styles.image_inside_accounts_th}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[2]); setThisAccountClicked("thClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[2].account.accountNameInLC + `.png?v=1`} alt="" />
                                                    <img className={thisAccountClicked === "forthClicked" ? `${styles.image_inside_accounts_forth}  ${styles.pulse}` : `${styles.image_inside_accounts_forth}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[3]); setThisAccountClicked("forthClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[3].account.accountNameInLC + `.png?v=1`} alt="" />
                                                </div> : <></>
                                            }
                                            {/* For 5 or more accounts */}
                                            {props.totalUserConnectedAccounts.length === 5 || props.totalUserConnectedAccounts.length >= 5 ?
                                                <div className={styles.background_accounts}>
                                                    &nbsp;
                                                    <img className={thisAccountClicked === "firstClicked" ? `${styles.image_inside_accounts}  ${styles.pulse}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); setThisAccountClicked("firstClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[0].account.accountNameInLC + `.png?v=1`} alt="" />
                                                    <div className={styles.background_inside_accounts}>
                                                        &nbsp;
                                                        <img className={styles.image_home_inside} src={imageHost + "/home-acounts.svg"} />
                                                        <p className={styles.inside_account_name}>{props.userTopAccounts.accountsCount}</p>
                                                        <p className={styles.inside_account_total}>Total Account</p>
                                                    </div>
                                                    <div className={styles.background_double_inside_accounts}>
                                                        &nbsp;
                                                    </div>
                                                    <img className={thisAccountClicked === "secondClicked" ? `${styles.image_inside_accounts_second}  ${styles.pulse}` : `${styles.image_inside_accounts_second}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[1]); setThisAccountClicked("secondClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[1].account.accountNameInLC + `.png?v=1`} alt="" />
                                                    <img className={thisAccountClicked === "thirdClicked" ? `${styles.image_inside_accounts_third}  ${styles.pulse}` : `${styles.image_inside_accounts_third}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[2]); setThisAccountClicked("thirdClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[2].account.accountNameInLC + `.png?v=1`} alt="" />
                                                    <img className={thisAccountClicked === "4Clicked" ? `${styles.image_inside_accounts_4}  ${styles.pulse}` : `${styles.image_inside_accounts_4}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[3]); setThisAccountClicked("4Clicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[3].account.accountNameInLC + `.png?v=1`} alt="" />
                                                    <img className={thisAccountClicked === "5Clicked" ? `${styles.image_inside_accounts_5}  ${styles.pulse}` : `${styles.image_inside_accounts_5}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[4]); setThisAccountClicked("5Clicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[4].account.accountNameInLC + `.png?v=1`} alt="" />
                                                </div> : <></>
                                            }
                                        </div>
                                    </div>
                                    {showingToAcc.length === 0 ?
                                        <div className={`col-11 col-sm-11 col-lg-11 col-xl-8  ${styles.account_allocation}  mt-5`}>
                                            <div className="row">
                                                <div className="col-12 col-lg-6 text-center">
                                                    <button className={styles.top_account_heading_btn_2}><h4 className={styles.top_account_heading}>{props.totalUserConnectedAccounts[0].account.accountDisplayName}</h4></button>
                                                    <div className={`mt-5 mt-md-4 text-start d-flex ${styles.para_inside}`}>
                                                        <img src={imageHost + "/portfolio-allocation.svg"} alt="" />
                                                        <div className={`ms-3 mt-3 ${styles.portfolio_allocation}`}>
                                                            <p className={styles.allocation_para}>Portfolio Allocation</p>
                                                            <p className={styles.allocation_amount}>{props.totalUserConnectedAccounts[0].percent}%</p>
                                                        </div>
                                                    </div>
                                                    <div className={`mt-2 text-start d-flex ${styles.para_inside}`}>
                                                        <img src={imageHost + "/total-transaction-port.svg"} alt="" />
                                                        <div className={`ms-3 mt-3 ${styles.portfolio_allocation}`}>
                                                            <p className={styles.allocation_para}>Total Transactions</p>
                                                            <p className={styles.allocation_amount}>{props.totalUserConnectedAccounts[0].txnCounts}</p>
                                                        </div>
                                                    </div>
                                                    <div className={`mt-2 mb-1 text-start d-flex ${styles.para_inside}`}>
                                                        <img src={imageHost + "/current-value.svg"} alt="" />
                                                        <div className={`ms-3 mt-3 ${styles.portfolio_allocation}`}>
                                                            <p className={styles.allocation_para}>Current Value</p>
                                                            <p className={styles.allocation_amount}>${props.totalUserConnectedAccounts[0].value}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`${styles.account_tab} col-6`}>
                                                    <div className="col-3 col-sm-12 col-md-10 col-lg-3">
                                                        {/* For 1 account */}
                                                        {props.totalUserConnectedAccounts.length === 1 ?
                                                            <div className={styles.background_accounts}>
                                                                &nbsp;
                                                                <img className={`${styles.image_inside_accounts}  ${styles.pulse}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[0].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                <div className={styles.background_inside_accounts}>
                                                                    &nbsp;
                                                                    <img className={styles.image_home_inside} src={imageHost + "/home-acounts.svg"} />
                                                                    <p className={styles.inside_account_name}>{props.userTopAccounts.accountsCount}</p>
                                                                    <p className={styles.inside_account_total}>Total Account</p>
                                                                </div>
                                                                <div className={styles.background_double_inside_accounts}>
                                                                    &nbsp;
                                                                </div>
                                                            </div> : <></>
                                                        }
                                                        {/* For 2 accounts */}
                                                        {props.totalUserConnectedAccounts.length === 2 ?
                                                            <div className={styles.background_accounts}>
                                                                &nbsp;
                                                                <img className={`${styles.image_inside_accounts}  ${styles.pulse}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[0].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                <div className={styles.background_inside_accounts}>
                                                                    &nbsp;
                                                                    <img className={styles.image_home_inside} src={imageHost + "/home-acounts.svg"} />
                                                                    <p className={styles.inside_account_name}>{props.userTopAccounts.accountsCount}</p>
                                                                    <p className={styles.inside_account_total}>Total Account</p>
                                                                </div>
                                                                <div className={styles.background_double_inside_accounts}>
                                                                    &nbsp;
                                                                </div>
                                                                <img className={styles.image_inside_accounts_2} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[1]); }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[1].account.accountNameInLC + `.png?v=1`} alt="" />
                                                            </div> : <></>
                                                        }
                                                        {/* For 3 accounts */}
                                                        {props.totalUserConnectedAccounts.length === 3 ?
                                                            <div className={styles.background_accounts}>
                                                                &nbsp;
                                                                <img className={thisAccountClicked === "firstClicked" ? `${styles.image_inside_accounts}  ${styles.pulse}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); setThisAccountClicked("firstClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[0].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                <div className={styles.background_inside_accounts}>
                                                                    &nbsp;
                                                                    <img className={styles.image_home_inside} src={imageHost + "/home-acounts.svg"} />
                                                                    <p className={styles.inside_account_name}>{props.userTopAccounts.accountsCount}</p>
                                                                    <p className={styles.inside_account_total}>Total Account</p>
                                                                </div>
                                                                <div className={styles.background_double_inside_accounts}>
                                                                    &nbsp;
                                                                </div>
                                                                <img className={thisAccountClicked === "secondClicked" ? `${styles.image_inside_accounts_second}  ${styles.pulse}` : `${styles.image_inside_accounts_second}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[1]); setThisAccountClicked("secondClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[1].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                <img className={thisAccountClicked === "thirdClicked" ? `${styles.image_inside_accounts_third}  ${styles.pulse}` : `${styles.image_inside_accounts_third}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[2]); setThisAccountClicked("thirdClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[2].account.accountNameInLC + `.png?v=1`} alt="" />
                                                            </div> : <></>
                                                        }
                                                        {/* For 4 accounts */}
                                                        {props.totalUserConnectedAccounts.length === 4 ?
                                                            <div className={styles.background_accounts}>
                                                                &nbsp;
                                                                <img className={thisAccountClicked === "firstClicked" ? `${styles.image_inside_accounts}  ${styles.pulse}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); setThisAccountClicked("firstClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[0].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                <div className={styles.background_inside_accounts}>
                                                                    &nbsp;
                                                                    <img className={styles.image_home_inside} src={imageHost + "/home-acounts.svg"} />
                                                                    <p className={styles.inside_account_name}>{props.userTopAccounts.accountsCount}</p>
                                                                    <p className={styles.inside_account_total}>Total Account</p>
                                                                </div>
                                                                <div className={styles.background_double_inside_accounts}>
                                                                    &nbsp;
                                                                </div>
                                                                <img className={thisAccountClicked === "secClicked" ? `${styles.image_inside_accounts_sec}  ${styles.pulse}` : "image_inside_accounts_sec"} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); setThisAccountClicked("secClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[1].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                <img className={thisAccountClicked === "thClicked" ? `${styles.image_inside_accounts_th}  ${styles.pulse}` : "image_inside_accounts_th"} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); setThisAccountClicked("thClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[2].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                <img className={thisAccountClicked === "forthClicked" ? `${styles.image_inside_accounts_forth}  ${styles.pulse}` : "image_inside_accounts_forth"} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); setThisAccountClicked("forthClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[3].account.accountNameInLC + `.png?v=1`} alt="" />
                                                            </div> : <></>
                                                        }
                                                        {/* For 5 or more accounts */}
                                                        {props.totalUserConnectedAccounts.length === 5 || props.totalUserConnectedAccounts.length >= 5 ?
                                                            <div className={styles.background_accounts}>
                                                                &nbsp;
                                                                <img className={thisAccountClicked === "firstClicked" ? `${styles.image_inside_accounts}  ${styles.pulse}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); setThisAccountClicked("firstClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[0].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                <div className={styles.background_inside_accounts}>
                                                                    &nbsp;
                                                                    <img className={styles.image_home_inside} src={imageHost + "/home-acounts.svg"} />
                                                                    <p className={styles.inside_account_name}>{props.userTopAccounts.accountsCount}</p>
                                                                    <p className={styles.inside_account_total}>Total Account</p>
                                                                </div>
                                                                <div className={styles.background_double_inside_accounts}>
                                                                    &nbsp;
                                                                </div>
                                                                <img className={thisAccountClicked === "secondClicked" ? `${styles.image_inside_accounts_second}  ${styles.pulse}` : `${styles.image_inside_accounts_second}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); setThisAccountClicked("secondClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[1].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                <img className={thisAccountClicked === "thirdClicked" ? `${styles.image_inside_accounts_third}  ${styles.pulse}` : `${styles.image_inside_accounts_third}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); setThisAccountClicked("thirdClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[2].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                <img className={thisAccountClicked === "4Clicked" ? `${styles.image_inside_accounts_4}  ${styles.pulse}` : `${styles.image_inside_accounts_4}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); setThisAccountClicked("4Clicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[3].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                <img className={thisAccountClicked === "5Clicked" ? `${styles.image_inside_accounts_5}  ${styles.pulse}` : `${styles.image_inside_accounts_5}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); setThisAccountClicked("5Clicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[4].account.accountNameInLC + `.png?v=1`} alt="" />
                                                            </div> : <></>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div> : <>
                                            <div className={`col-11 col-sm-11 col-lg-11 col-xl-8  mt-5 ${styles.account_allocation}`}>
                                                <div className="row">
                                                    <div className="col-12 col-lg-6">
                                                        <button className={styles.top_account_heading_btn_2}><h4 className={styles.top_account_heading}>{showingToAcc.account.accountDisplayName}</h4></button>
                                                        <div className={`mt-5 mt-md-4 text-start d-flex ${styles.para_inside}`}>
                                                            <img src={imageHost + "/portfolio-allocation.svg"} alt="" />
                                                            <div className={`ms-3 mt-3 ${styles.portfolio_allocation}`}>
                                                                <p className={styles.allocation_para}>Portfolio Allocation</p>
                                                                <p className={styles.allocation_amount}>{showingToAcc.percent}%</p>
                                                            </div>
                                                        </div>
                                                        <div className={`mt-2 text-start d-flex ${styles.para_inside}`}>
                                                            <img src={imageHost + "/total-transaction-port.svg"} alt="" />
                                                            <div className={`ms-3 mt-3 ${styles.portfolio_allocation}`}>
                                                                <p className={styles.allocation_para}>Total Transactions</p>
                                                                <p className={styles.allocation_amount}>{showingToAcc.txnCounts}</p>
                                                            </div>
                                                        </div>
                                                        <div className={`mt-2 mb-1 text-start d-flex ${styles.para_inside}`}>
                                                            <img src={imageHost + "/current-value.svg"} alt="" />
                                                            <div className={`ms-3 mt-3 ${styles.portfolio_allocation}`}>
                                                                <p className={styles.allocation_para}>Current Value</p>
                                                                <p className={styles.allocation_amount}>${showingToAcc.value}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`${styles.account_tab} col-6`}>
                                                        <div className="col-3 col-sm-12 col-md-10 col-lg-3">
                                                            {/* For 1 account */}
                                                            {props.totalUserConnectedAccounts.length === 1 ?
                                                                <div className={styles.background_accounts}>
                                                                    &nbsp;
                                                                    <img className={thisAccountClicked === "firstClicked" ? `${styles.image_inside_accounts}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0].account); setThisAccountClicked("firstClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[0].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                    <div className={styles.background_inside_accounts}>
                                                                        &nbsp;
                                                                        <img className={styles.image_home_inside} src={imageHost + "/home_acounts.svg"} />
                                                                        <p className={styles.inside_account_name}>{props.userTopAccounts.accountsCount}</p>
                                                                        <p className={styles.inside_account_total}>Total Account</p>
                                                                    </div>
                                                                    <div className={styles.background_double_inside_accounts}>
                                                                        &nbsp;
                                                                    </div>
                                                                </div> : <></>
                                                            }
                                                            {/* For 2 accounts */}
                                                            {props.totalUserConnectedAccounts.length === 2 ?
                                                                <div className={styles.background_accounts}>
                                                                    &nbsp;
                                                                    <img className={thisAccountClicked === "firstClicked" ? `${styles.image_inside_accounts}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); setThisAccountClicked("firstClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[0].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                    <div className={styles.background_inside_accounts}>
                                                                        &nbsp;
                                                                        <img className={styles.image_home_inside} src={imageHost + "/home-acounts.svg"} />
                                                                        <p className={styles.inside_account_name}>{props.userTopAccounts.accountsCount}</p>
                                                                        <p className={styles.inside_account_total}>Total Account</p>
                                                                    </div>
                                                                    <div className={styles.background_double_inside_accounts}>
                                                                        &nbsp;
                                                                    </div>
                                                                    <img className={thisAccountClicked === "2Clicked" ? `${styles.image_inside_accounts_2}  ${styles.pulse}` : `${styles.image_inside_accounts_2}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[1]); setThisAccountClicked("2Clicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[1].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                </div> : <></>
                                                            }
                                                            {/* For 3 accounts */}
                                                            {props.totalUserConnectedAccounts.length === 3 ?
                                                                <div className={styles.background_accounts}>
                                                                    &nbsp;
                                                                    <img className={thisAccountClicked === "firstClicked" ? `${styles.image_inside_accounts}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); setThisAccountClicked("firstClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[0].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                    <div className={styles.background_inside_accounts}>
                                                                        &nbsp;
                                                                        <img className={styles.image_home_inside} src={imageHost + "/home-acounts.svg"} />
                                                                        <p className={styles.inside_account_name}>{props.userTopAccounts.accountsCount}</p>
                                                                        <p className={styles.inside_account_total}>Total Account</p>
                                                                    </div>
                                                                    <div className={styles.background_double_inside_accounts}>
                                                                        &nbsp;
                                                                    </div>
                                                                    <img className={thisAccountClicked === "secondClicked" ? `${styles.image_inside_accounts_second}  ${styles.pulse}` : 'image_inside_accounts_second'} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[1]); setThisAccountClicked("secondClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[1].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                    <img className={thisAccountClicked === "thirdClicked" ? `${styles.image_inside_accounts_third}  ${styles.pulse}` : 'image_inside_accounts_third'} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[2]); setThisAccountClicked("thirdClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[2].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                </div> : <></>
                                                            }
                                                            {/* For 4 accounts */}
                                                            {props.totalUserConnectedAccounts.length === 4 ?
                                                                <div className={styles.background_accounts}>
                                                                    &nbsp;
                                                                    <img className={thisAccountClicked === "firstClicked" ? `${styles.image_inside_accounts}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); setThisAccountClicked("firstClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[0].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                    <div className={styles.background_inside_accounts}>
                                                                        &nbsp;
                                                                        <img className={styles.image_home_inside} src={imageHost + "/home-acounts.svg"} />
                                                                        <p className={styles.inside_account_name}>{props.userTopAccounts.accountsCount}</p>
                                                                        <p className={styles.inside_account_total}>Total Account</p>
                                                                    </div>
                                                                    <div className={styles.background_double_inside_accounts}>
                                                                        &nbsp;
                                                                    </div>
                                                                    <img className={thisAccountClicked === "secClicked" ? `${styles.image_inside_accounts_sec}  ${styles.pulse}` : "image_inside_accounts_sec"} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[1]); setThisAccountClicked("secClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[1].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                    <img className={thisAccountClicked === "thClicked" ? `${styles.image_inside_accounts_th}  ${styles.pulse}` : "image_inside_accounts_th"} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[2]); setThisAccountClicked("thClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[2].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                    <img className={thisAccountClicked === "forthClicked" ? `${styles.image_inside_accounts_forth}  ${styles.pulse}` : "image_inside_accounts_forth"} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[3]); setThisAccountClicked("forthClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[3].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                </div> : <></>
                                                            }
                                                            {/* For 5 or more accounts */}
                                                            {props.totalUserConnectedAccounts.length === 5 || props.totalUserConnectedAccounts.length >= 5 ?
                                                                <div className={styles.background_accounts}>
                                                                    &nbsp;
                                                                    <img className={thisAccountClicked === "firstClicked" ? `${styles.image_inside_accounts}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); setThisAccountClicked("firstClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[0].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                    <div className={styles.background_inside_accounts}>
                                                                        &nbsp;
                                                                        <img className={styles.image_home_inside} src={imageHost + "/home-acounts.svg"} />
                                                                        <p className={styles.inside_account_name}>{props.userTopAccounts.accountsCount}</p>
                                                                        <p className={styles.inside_account_total}>Total Account</p>
                                                                    </div>
                                                                    <div className={styles.background_double_inside_accounts}>
                                                                        &nbsp;
                                                                    </div>
                                                                    <img className={thisAccountClicked === "secondClicked" ? `${styles.image_inside_accounts_second}  ${styles.pulse}` : `${styles.image_inside_accounts_second}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[1]); setThisAccountClicked("secondClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[1].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                    <img className={thisAccountClicked === "thirdClicked" ? `${styles.image_inside_accounts_third}  ${styles.pulse}` : `${styles.image_inside_accounts_third}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[2]); setThisAccountClicked("thirdClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[2].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                    <img className={thisAccountClicked === "4Clicked" ? `${styles.image_inside_accounts_4}  ${styles.pulse}` : `${styles.image_inside_accounts_4}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[3]); setThisAccountClicked("4Clicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[3].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                    <img className={thisAccountClicked === "5Clicked" ? `${styles.image_inside_accounts_5}  ${styles.pulse}` : "image_inside_accounts_5 "} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[4]); setThisAccountClicked("5Clicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[4].account.accountNameInLC + `.png?v=1`} alt="" />
                                                                </div> : <></>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    }
                                    <div className={styles.account_desktop}>
                                        <div className="col-3 col-sm-12 col-md-10 col-lg-3">
                                            {/* For 1 account */}
                                            {props.totalUserConnectedAccounts.length === 1 ?
                                                <div className={styles.background_accounts}>
                                                    &nbsp;
                                                    <img className={thisAccountClicked === "firstClicked" ? `${styles.image_inside_accounts}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); setThisAccountClicked("firstClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[0].account.accountNameInLC + `.png?v=1`} alt="" />
                                                    <div className={styles.background_inside_accounts}>
                                                        &nbsp;
                                                        <img className={styles.image_home_inside} src={imageHost + "/home-acounts.svg"} />
                                                        <p className={styles.inside_account_name}>{props.userTopAccounts.accountsCount}</p>
                                                        <p className={styles.inside_account_total}>Total Account</p>
                                                    </div>
                                                    <div className={styles.background_double_inside_accounts}>
                                                        &nbsp;
                                                    </div>
                                                </div> : <></>

                                            }
                                            {/* For 2 accounts */}
                                            {props.totalUserConnectedAccounts.length === 2 ?
                                                <div className={styles.background_accounts}>
                                                    &nbsp;
                                                    <img className={thisAccountClicked === "firstClicked" ? `${styles.image_inside_accounts}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); setThisAccountClicked("firstClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[0].account.accountNameInLC + `.png?v=1`} alt="" />
                                                    <div className={styles.background_inside_accounts}>
                                                        &nbsp;
                                                        <img className={styles.image_home_inside} src={imageHost + "/home-acounts.svg"} />
                                                        <p className={styles.inside_account_name}>{props.userTopAccounts.accountsCount}</p>
                                                        <p className={styles.inside_account_total}>Total Account</p>
                                                    </div>
                                                    <div className={styles.background_double_inside_accounts}>
                                                        &nbsp;
                                                    </div>
                                                    <img className={thisAccountClicked === "2Clicked" ? `${styles.image_inside_accounts_2}  ${styles.pulse}` : `${styles.image_inside_accounts_2}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[1]); setThisAccountClicked("2Clicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[1].account.accountNameInLC + `.png?v=1`} alt="" />
                                                </div> : <></>
                                            }
                                            {/* For 3 accounts */}
                                            {props.totalUserConnectedAccounts.length === 3 ?
                                                <div className={styles.background_accounts}>
                                                    &nbsp;
                                                    <img className={thisAccountClicked === "firstClicked" ? `${styles.image_inside_accounts}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); setThisAccountClicked("firstClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[0].account.accountNameInLC + `.png?v=1`} alt="" />
                                                    <div className={styles.background_inside_accounts}>
                                                        &nbsp;
                                                        <img className={styles.image_home_inside} src={imageHost + "/home-acounts.svg"} />
                                                        <p className={styles.inside_account_name}>{props.userTopAccounts.accountsCount}</p>
                                                        <p className={styles.inside_account_total}>Total Account</p>
                                                    </div>
                                                    <div className={styles.background_double_inside_accounts}>
                                                        &nbsp;
                                                    </div>
                                                    <img className={thisAccountClicked === "secondClicked" ? `${styles.image_inside_accounts_second}  ${styles.pulse}` : 'image_inside_accounts_second'} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[1]); setThisAccountClicked("secondClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[1].account.accountNameInLC + `.png?v=1`} alt="" />
                                                    <img className={thisAccountClicked === "thirdClicked" ? `${styles.image_inside_accounts_third}  ${styles.pulse}` : 'image_inside_accounts_third'} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[2]); setThisAccountClicked("thirdClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[2].account.accountNameInLC + `.png?v=1`} alt="" />
                                                </div> : <></>
                                            }
                                            {/* For 4 accounts */}
                                            {props.totalUserConnectedAccounts.length === 4 ?
                                                <div className={styles.background_accounts}>
                                                    &nbsp;
                                                    <img className={thisAccountClicked === "firstClicked" ? `${styles.image_inside_accounts}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); setThisAccountClicked("firstClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[0].account.accountNameInLC + `.png?v=1`} alt="" />
                                                    <div className={styles.background_inside_accounts}>
                                                        &nbsp;
                                                        <img className={styles.image_home_inside} src={imageHost + "/home-acounts.svg"} />
                                                        <p className={styles.inside_account_name}>{props.userTopAccounts.accountsCount}</p>
                                                        <p className={styles.inside_account_total}>Total Account</p>
                                                    </div>
                                                    <div className={styles.background_double_inside_accounts}>
                                                        &nbsp;
                                                    </div>
                                                    <img className={thisAccountClicked === "secClicked" ? `${styles.image_inside_accounts_sec}  ${styles.pulse}` : "image_inside_accounts_sec"} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[1]); setThisAccountClicked("secClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[1].account.accountNameInLC + `.png?v=1`} alt="" />
                                                    <img className={thisAccountClicked === "thClicked" ? `${styles.image_inside_accounts_th}  ${styles.pulse}` : "image_inside_accounts_th"} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[2]); setThisAccountClicked("thClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[2].account.accountNameInLC + `.png?v=1`} alt="" />
                                                    <img className={thisAccountClicked === "forthClicked" ? `${styles.image_inside_accounts_forth}  ${styles.pulse}` : "image_inside_accounts_forth"} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[3]); setThisAccountClicked("forthClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[3].account.accountNameInLC + `.png?v=1`} alt="" />
                                                </div> : <></>
                                            }
                                            {/* For 5 or more accounts */}
                                            {props.totalUserConnectedAccounts.length === 5 || props.totalUserConnectedAccounts.length >= 5 ?
                                                <div className={styles.background_accounts}>
                                                    &nbsp;
                                                    <img className={thisAccountClicked === "firstClicked" ? `${styles.image_inside_accounts}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[0]); setThisAccountClicked("firstClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[0].account.accountNameInLC + `.png?v=1`} alt="" />
                                                    <div className={styles.background_inside_accounts}>
                                                        &nbsp;
                                                        <img className={styles.image_home_inside} src={imageHost + "/home-acounts.svg"} />
                                                        <p className={styles.inside_account_name}>{props.userTopAccounts.accountsCount}</p>
                                                        <p className={styles.inside_account_total}>Total Account</p>
                                                    </div>
                                                    <div className={styles.background_double_inside_accounts}>
                                                        &nbsp;
                                                    </div>
                                                    <img className={thisAccountClicked === "secondClicked" ? `${styles.image_inside_accounts_second}  ${styles.pulse}` : `${styles.image_inside_accounts_second}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[1]); setThisAccountClicked("secondClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[1].account.accountNameInLC + `.png?v=1`} alt="" />
                                                    <img className={thisAccountClicked === "thirdClicked" ? `${styles.image_inside_accounts_third}  ${styles.pulse}` : `${styles.image_inside_accounts_third}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[2]); setThisAccountClicked("thirdClicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[2].account.accountNameInLC + `.png?v=1`} alt="" />
                                                    <img className={thisAccountClicked === "4Clicked" ? `${styles.image_inside_accounts_4}  ${styles.pulse}` : `${styles.image_inside_accounts_4}`} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[3]); setThisAccountClicked("4Clicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[3].account.accountNameInLC + `.png?v=1`} alt="" />
                                                    <img className={thisAccountClicked === "5Clicked" ? `${styles.image_inside_accounts_5}  ${styles.pulse}` : "image_inside_accounts_5 "} onClick={() => { gettingTopAccountsToShow(props.totalUserConnectedAccounts[4]); setThisAccountClicked("5Clicked") }} src={imageHost + `/exchanges/` + props.totalUserConnectedAccounts[4].account.accountNameInLC + `.png?v=1`} alt="" />
                                                </div> : <></>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className={`text-center text-lg-start ${styles.btn_div}`}>
                                    <a href='/add-account' className={`btn ${styles.add_account_btn} px-3 py-2 me-3 mt-2`} type='submit'>Add Account</a>
                                    <a href='/my-accounts' className={`btn ${styles.all_account_btn} px-3 py-2 ms-2 mt-2`}>View All  {props.userTopAccounts.accountsCount} Account</a>
                                </div>
                            </div> :
                            <>
                                <div className={`col-12 col-lg-11 ${styles.top_accounts_subhead} border border-1 mb-3`}>
                                    <button className={styles.top_transaction_heading_btn}><h4 className={styles.top_transaction_heading}>Top Accounts</h4></button>
                                    <div className='d-block d-xl-none'>
                                        <img className='my-4' src={imageHost + "/no-data-portfolio-img.svg"} alt="" />
                                        <p>You do not have any account</p>
                                    </div>
                                    <div className='d-none d-xl-flex justify-content-center'>
                                        <img className='my-4' src={imageHost + "/no-data-portfolio-img.svg"} alt="" />
                                        <p className='mt-auto mb-auto'>You do not have any Top Account</p>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </div>
                <div className={`px-0 mt-5 ${styles.top_assets}`}>
                    <div className="row">
                        {props.userTopAssets !== null && props.userTopAssets !== undefined ?
                            <div className={`col-12 col-lg-11 col-xl-8 mb-3 border border-1 ${styles.top_accounts_subhead}`}>
                                <button className={styles.top_assets_heading_btn}><h4 className={styles.top_assets_heading}>Top Assets</h4></button>
                                <div className="row">
                                    <div className={`col-12 col-sm-12 col-md-10 col-lg-3 ${styles.mobile_assets_tab}`}>
                                        {/* For 1 account */}
                                        {props.userTopAssets.userAssets.length === 1 ?
                                            <div className={styles.background_accounts}>
                                                &nbsp;
                                                <img className={thisAssetClicked === "firstAsset" ? `${styles.image_inside_accounts}  ${styles.pulse}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[0]); setThiAssetClicked("firstAsset") }} src={props.userTopAssets.userAssets[0].currencyDetails.logo_url} alt="" />
                                                <div className={styles.background_inside_accounts}>
                                                    &nbsp;
                                                    <p className={styles.inside_account_name}>{props.userTopAssets.assetCount}</p>
                                                    <p className={styles.inside_account_total}>Total Assets</p>
                                                </div>
                                            </div> : <></>
                                        }
                                        {/* For 2 accounts */}
                                        {props.userTopAssets.userAssets.length === 2 ?
                                            <div className={styles.background_accounts}>
                                                &nbsp;
                                                <img className={thisAssetClicked === "firstAsset" ? `${styles.image_inside_accounts}  ${styles.pulse}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[0]); setThiAssetClicked("firstAsset") }} src={props.userTopAssets.userAssets[0].currencyDetails.logo_url} alt="" />
                                                <div className={styles.background_inside_accounts}>
                                                    &nbsp;
                                                    <p className={styles.inside_account_name}>{props.userTopAssets.assetCount}</p>
                                                    <p className={styles.inside_account_total}>Total Assets</p>
                                                </div>
                                                <div className={styles.background_double_inside_accounts}>
                                                    &nbsp;
                                                </div>
                                                <img className={thisAssetClicked === "2Asset" ? `${styles.image_inside_accounts_2}  ${styles.pulse}` : `${styles.image_inside_accounts_2}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[1]); setThiAssetClicked("2Asset") }} src={props.userTopAssets.userAssets[1].currencyDetails.logo_url} alt="" />
                                            </div> : <></>
                                        }
                                        {/* For 3 accounts */}
                                        {props.userTopAssets.userAssets.length === 3 ?
                                            <div className={styles.background_accounts}>
                                                &nbsp;
                                                <img className={thisAssetClicked === "firstAsset" ? `${styles.image_inside_accounts}  ${styles.pulse}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[0]); setThiAssetClicked("firstAsset") }} src={props.userTopAssets.userAssets[0].currencyDetails.logo_url} alt="" />
                                                <div className={styles.background_inside_accounts}>
                                                    &nbsp;
                                                    <p className={styles.inside_account_name}>{props.userTopAssets.assetCount}</p>
                                                    <p className={styles.inside_account_total}>Total Assets</p>
                                                </div>
                                                <div className={styles.background_double_inside_accounts}>
                                                    &nbsp;
                                                </div>
                                                <img className={thisAssetClicked === "secondAsset" ? `${styles.image_inside_accounts_second}  ${styles.pulse}` : `${styles.image_inside_accounts_second}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[1]); setThiAssetClicked("secondAsset") }} src={props.userTopAssets.userAssets[1].currencyDetails.logo_url} alt="" />
                                                <img className={thisAssetClicked === "thirdAsset" ? `${styles.image_inside_accounts_third}  ${styles.pulse}` : `${styles.image_inside_accounts_third}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[2]); setThiAssetClicked("thirdAsset") }} src={props.userTopAssets.userAssets[2].currencyDetails.logo_url} alt="" />
                                            </div> : <></>
                                        }
                                        {/* For 4 accounts */}
                                        {props.userTopAssets.userAssets.length === 4 ?
                                            <div className={styles.background_accounts}>
                                                &nbsp;
                                                <img className={thisAssetClicked === "firstAsset" ? `${styles.image_inside_accounts}  ${styles.pulse}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[0]); setThiAssetClicked("firstAsset") }} src={props.userTopAssets.userAssets[0].currencyDetails.logo_url} alt="" />
                                                <div className={styles.background_inside_accounts}>
                                                    &nbsp;
                                                    <p className={styles.inside_account_name}>{props.userTopAssets.assetCount}</p>
                                                    <p className={styles.inside_account_total}>Total Assets</p>
                                                </div>
                                                <div className={styles.background_double_inside_accounts}>
                                                    &nbsp;
                                                </div>
                                                <img className={thisAssetClicked === "secAsset" ? `${styles.image_inside_accounts_sec}  ${styles.pulse}` : "image_inside_accounts_sec"} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[1]); setThiAssetClicked("secAsset") }} src={props.userTopAssets.userAssets[1].currencyDetails.logo_url} alt="" />
                                                <img className={thisAssetClicked === "thAsset" ? `${styles.image_inside_accounts_th}  ${styles.pulse}` : "image_inside_accounts_th"} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[2]); setThiAssetClicked("thAsset") }} src={props.userTopAssets.userAssets[2].currencyDetails.logo_url} alt="" />
                                                <img className={thisAssetClicked === "forthAsset" ? `${styles.image_inside_accounts_forth}  ${styles.pulse}` : "image_inside_accounts_forth"} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[3]); setThiAssetClicked("forthAsset") }} src={props.userTopAssets.userAssets[3].currencyDetails.logo_url} alt="" />
                                            </div> : <></>
                                        }
                                        {/* For 5 or more accounts */}
                                        {props.userTopAssets.userAssets.length === 5 || props.userTopAssets.userAssets.length >= 5 ?
                                            <div className={styles.background_accounts}>
                                                &nbsp;
                                                <img className={thisAssetClicked === "firstAsset" ? `${styles.image_inside_accounts}  ${styles.pulse}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[0]); setThiAssetClicked("firstAsset") }} src={props.userTopAssets.userAssets[0].currencyDetails.logo_url} alt="" />
                                                <div className={styles.background_inside_accounts}>
                                                    <p className={styles.inside_account_name}>{props.userTopAssets.assetCount}</p>
                                                    <p className={styles.inside_account_total}>Total Assets</p>
                                                </div>
                                                <div className={styles.background_double_inside_accounts}>
                                                    &nbsp;
                                                </div>
                                                <img className={thisAssetClicked === "secondAsset" ? `${styles.image_inside_accounts_second}  ${styles.pulse}` : `${styles.image_inside_accounts_second}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[1]); setThiAssetClicked("secondAsset") }} src={props.userTopAssets.userAssets[1].currencyDetails.logo_url} alt="" />
                                                <img className={thisAssetClicked === "thirdAsset" ? `${styles.image_inside_accounts_third}  ${styles.pulse}` : `${styles.image_inside_accounts_third}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[2]); setThiAssetClicked("thirdAsset") }} src={props.userTopAssets.userAssets[2].currencyDetails.logo_url} alt="" />
                                                <img className={thisAssetClicked === "4Asset" ? `${styles.image_inside_accounts_4}  ${styles.pulse}` : `${styles.image_inside_accounts_4}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[3]); setThiAssetClicked("4Asset") }} src={props.userTopAssets.userAssets[3].currencyDetails.logo_url} alt="" />
                                                <img className={thisAssetClicked === "5Asset" ? `${styles.image_inside_accounts_5}  ${styles.pulse}` : `${styles.image_inside_accounts_5}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[4]); setThiAssetClicked("5Asset") }} src={props.userTopAssets.userAssets[4].currencyDetails.logo_url} alt="" />
                                            </div> : <></>
                                        }
                                    </div>
                                    <div className={`col-11 col-md-10 col-lg-11 col-xl-9 me-2 mt-5 ${styles.account_allocation}`}>
                                        {showingToAssets.length === 0 ?
                                            <>
                                                <div className="row">
                                                    <div className={`col-6 ${styles.assets_tab}`}>
                                                        <div className="col-12 col-sm-12 col-md-10 col-lg-3">
                                                            {/* For 1 account */}
                                                            {props.userTopAssets.userAssets.length === 1 ?
                                                                <div className={styles.background_accounts}>
                                                                    &nbsp;
                                                                    <img className={thisAssetClicked === "firstAsset" ? `${styles.image_inside_accounts}  ${styles.pulse}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[0]); setThiAssetClicked("firstAsset") }} src={props.userTopAssets.userAssets[0].currencyDetails.logo_url} alt="" />
                                                                    <div className={styles.background_inside_accounts}>
                                                                        &nbsp;
                                                                        <p className={styles.inside_account_name}>{props.userTopAssets.assetCount}</p>
                                                                        <p className={styles.inside_account_total}>Total Assets</p>
                                                                    </div>
                                                                    <div className={styles.background_double_inside_accounts}>
                                                                        &nbsp;
                                                                    </div>
                                                                </div> : <></>
                                                            }
                                                            {/* For 2 accounts */}
                                                            {props.userTopAssets.userAssets.length === 2 ?
                                                                <div className={styles.background_accounts}>
                                                                    &nbsp;
                                                                    <img className={thisAssetClicked === "firstAsset" ? `${styles.image_inside_accounts}  ${styles.pulse}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[0]); setThiAssetClicked("firstAsset") }} src={props.userTopAssets.userAssets[0].currencyDetails.logo_url} alt="" />
                                                                    <div className={styles.background_inside_accounts}>
                                                                        &nbsp;
                                                                        <p className={styles.inside_account_name}>{props.userTopAssets.assetCount}</p>
                                                                        <p className={styles.inside_account_total}>Total Assets</p>
                                                                    </div>
                                                                    <div className={styles.background_double_inside_accounts}>
                                                                        &nbsp;
                                                                    </div>
                                                                    <img className={thisAssetClicked === "2Asset" ? `${styles.image_inside_accounts_2}  ${styles.pulse}` : `${styles.image_inside_accounts_2}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[1]); setThiAssetClicked("2Asset") }} src={props.userTopAssets.userAssets[1].currencyDetails.logo_url} alt="" />
                                                                </div> : <></>
                                                            }
                                                            {/* For 3 accounts */}
                                                            {props.userTopAssets.userAssets.length === 3 ?
                                                                <div className={styles.background_accounts}>
                                                                    &nbsp;
                                                                    <img className={thisAssetClicked === "firstAsset" ? `${styles.image_inside_accounts}  ${styles.pulse}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[0]); setThiAssetClicked("firstAsset") }} src={props.userTopAssets.userAssets[0].currencyDetails.logo_url} alt="" />
                                                                    <div className={styles.background_inside_accounts}>
                                                                        &nbsp;
                                                                        <p className={styles.inside_account_name}>{props.userTopAssets.assetCount}</p>
                                                                        <p className={styles.inside_account_total}>Total Assets</p>
                                                                    </div>
                                                                    <div className={styles.background_double_inside_accounts}>
                                                                        &nbsp;
                                                                    </div>
                                                                    <img className={thisAssetClicked === "secondAsset" ? `${styles.image_inside_accounts_second}  ${styles.pulse}` : `${styles.image_inside_accounts_second}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[1]); setThiAssetClicked("secondAsset") }} src={props.userTopAssets.userAssets[1].currencyDetails.logo_url} alt="" />
                                                                    <img className={thisAssetClicked === "thirdAsset" ? `${styles.image_inside_accounts_third}  ${styles.pulse}` : `${styles.image_inside_accounts_third}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[2]); setThiAssetClicked("thirdAsset") }} src={props.userTopAssets.userAssets[2].currencyDetails.logo_url} alt="" />
                                                                </div> : <></>
                                                            }
                                                            {/* For 4 accounts */}
                                                            {props.userTopAssets.userAssets.length === 4 ?
                                                                <div className={styles.background_accounts}>
                                                                    &nbsp;
                                                                    <img className={thisAssetClicked === "firstAsset" ? `${styles.image_inside_accounts}  ${styles.pulse}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[0]); setThiAssetClicked("firstAsset") }} src={props.userTopAssets.userAssets[0].currencyDetails.logo_url} alt="" />
                                                                    <div className={styles.background_inside_accounts}>
                                                                        &nbsp;
                                                                        <p className={styles.inside_account_name}>{props.userTopAssets.assetCount}</p>
                                                                        <p className={styles.inside_account_total}>Total Assets</p>
                                                                    </div>
                                                                    <div className={styles.background_double_inside_accounts}>
                                                                        &nbsp;
                                                                    </div>
                                                                    <img className={thisAssetClicked === "secAsset" ? `${styles.image_inside_accounts_sec}  ${styles.pulse}` : "image_inside_accounts_sec"} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[1]); setThiAssetClicked("secAsset") }} src={props.userTopAssets.userAssets[1].currencyDetails.logo_url} alt="" />
                                                                    <img className={thisAssetClicked === "thAsset" ? `${styles.image_inside_accounts_th}  ${styles.pulse}` : "image_inside_accounts_th"} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[2]); setThiAssetClicked("thAsset") }} src={props.userTopAssets.userAssets[2].currencyDetails.logo_url} alt="" />
                                                                    <img className={thisAssetClicked === "forthAsset" ? `${styles.image_inside_accounts_forth}  ${styles.pulse}` : "image_inside_accounts_forth"} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[3]); setThiAssetClicked("forthAsset") }} src={props.userTopAssets.userAssets[3].currencyDetails.logo_url} alt="" />
                                                                </div> : <></>
                                                            }
                                                            {/* For 5 or more accounts */}
                                                            {props.userTopAssets.userAssets.length === 5 || props.userTopAssets.userAssets.length >= 5 ?
                                                                <div className={styles.background_accounts}>
                                                                    &nbsp;
                                                                    <img className={thisAssetClicked === "firstAsset" ? `${styles.image_inside_accounts}  ${styles.pulse}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[0]); setThiAssetClicked("firstAsset") }} src={props.userTopAssets.userAssets[0].currencyDetails.logo_url} alt="" />
                                                                    <div className={styles.background_inside_accounts}>
                                                                        &nbsp;
                                                                        <p className={styles.inside_account_name}>{props.userTopAssets.assetCount}</p>
                                                                        <p className={styles.inside_account_total}>Total Assets</p>
                                                                    </div>
                                                                    <div className={styles.background_double_inside_accounts}>
                                                                        &nbsp;
                                                                    </div>
                                                                    <img className={thisAssetClicked === "secondAsset" ? `${styles.image_inside_accounts_second}  ${styles.pulse}` : `${styles.image_inside_accounts_second}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[1]); setThiAssetClicked("secondAsset") }} src={props.userTopAssets.userAssets[1].currencyDetails.logo_url} alt="" />
                                                                    <img className={thisAssetClicked === "thirdAsset" ? `${styles.image_inside_accounts_third}  ${styles.pulse}` : `${styles.image_inside_accounts_third}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[2]); setThiAssetClicked("thirdAsset") }} src={props.userTopAssets.userAssets[2].currencyDetails.logo_url} alt="" />
                                                                    <img className={thisAssetClicked === "4Asset" ? `${styles.image_inside_accounts_4}  ${styles.pulse}` : `${styles.image_inside_accounts_4}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[3]); setThiAssetClicked("4Asset") }} src={props.userTopAssets.userAssets[3].currencyDetails.logo_url} alt="" />
                                                                    <img className={thisAssetClicked === "5Asset" ? `${styles.image_inside_accounts_5}  ${styles.pulse}` : `${styles.image_inside_accounts_5}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[4]); setThiAssetClicked("5Asset") }} src={props.userTopAssets.userAssets[4].currencyDetails.logo_url} alt="" />
                                                                </div> : <></>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-lg-6">
                                                        <button className={styles.top_assets_heading_btn} style={{ "transform": "translateX(-50%) !important" }}><h4 className={styles.top_assets_heading}>{props.userTopAssets.userAssets[0].currencyDetails.name}</h4></button>
                                                        <div className={`mt-5 mt-md-4 text-start d-flex ${styles.para_inside}`}>
                                                            <img src={imageHost + "/portfolio-allocation.svg"} alt="" />
                                                            <div className={`ms-3 mt-3 ${styles.portfolio_allocation}`}>
                                                                <p className={styles.allocation_para}>Portfolio Allocation</p>
                                                                <p className={styles.allocation_amount}>{props.userTopAssets.userAssets[0].percent}%</p>
                                                            </div>
                                                        </div>
                                                        <div className={`mt-2 text-start d-flex ${styles.para_inside}`}>
                                                            <img src={imageHost + "/total-transaction-port.svg"} alt="" />
                                                            <div className={`ms-3 mt-3 ${styles.portfolio_allocation}`}>
                                                                <p className={styles.allocation_para}>Total Transaction</p>
                                                                <p className={styles.allocation_amount}>{props.userTopAssets.userAssets[0].txnCount}</p>
                                                            </div>
                                                        </div>
                                                        <div className={`mt-2 mb-1 text-start d-flex ${styles.para_inside}`}>
                                                            <img src={imageHost + "/current-value.svg"} alt="" />
                                                            <div className={`ms-3 mt-3 ${styles.portfolio_allocation}`}>
                                                                <p className={styles.allocation_para}>Current Value</p>
                                                                <p className={styles.allocation_amount}>${props.userTopAssets.userAssets[0].value}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className="row">
                                                    <div className={`col-6 ${styles.assets_tab}`}>
                                                        <div className="col-12 col-sm-12 col-md-10 col-lg-3">
                                                            {/* For 1 account */}
                                                            {props.userTopAssets.userAssets.length === 1 ?
                                                                <div className={styles.background_accounts}>
                                                                    &nbsp;
                                                                    <img className={thisAssetClicked === "firstAsset" ? `${styles.image_inside_accounts}  ${styles.pulse}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[0]); setThiAssetClicked("firstAsset") }} src={props.userTopAssets.userAssets[0].currencyDetails.logo_url} alt="" />
                                                                    <div className={styles.background_inside_accounts}>
                                                                        &nbsp;
                                                                        <p className={styles.inside_account_name}>{props.userTopAssets.assetCount}</p>
                                                                        <p className={styles.inside_account_total}>Total Assets</p>
                                                                    </div>
                                                                    <div className={styles.background_double_inside_accounts}>
                                                                        &nbsp;
                                                                    </div>
                                                                </div> : <></>
                                                            }
                                                            {/* For 2 accounts */}
                                                            {props.userTopAssets.userAssets.length === 2 ?
                                                                <div className={styles.background_accounts}>
                                                                    &nbsp;
                                                                    <img className={thisAssetClicked === "firstAsset" ? `${styles.image_inside_accounts}  ${styles.pulse}` : `${styles.image_inside_accounts}`} src={props.userTopAssets.userAssets[0].currencyDetails.logo_url} alt="" />
                                                                    <div className={styles.background_inside_accounts}>
                                                                        &nbsp;
                                                                        <p className={styles.inside_account_name}>{props.userTopAssets.assetCount}</p>
                                                                        <p className={styles.inside_account_total}>Total Assets</p>
                                                                    </div>
                                                                    <div className={styles.background_double_inside_accounts}>
                                                                        &nbsp;
                                                                    </div>
                                                                    <img className={thisAssetClicked === "2Asset" ? `${styles.image_inside_accounts_2}  ${styles.pulse}` : `${styles.image_inside_accounts_2}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[1]); setThiAssetClicked("2Asset") }} src={props.userTopAssets.userAssets[1].currencyDetails.logo_url} alt="" />
                                                                </div> : <></>
                                                            }
                                                            {/* For 3 accounts */}
                                                            {props.userTopAssets.userAssets.length === 3 ?
                                                                <div className={styles.background_accounts}>
                                                                    &nbsp;
                                                                    <img className={thisAssetClicked === "firstAsset" ? `${styles.image_inside_accounts}  ${styles.pulse}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[0]); setThiAssetClicked("firstAsset") }} src={props.userTopAssets.userAssets[0].currencyDetails.logo_url} alt="" />
                                                                    <div className={styles.background_inside_accounts}>
                                                                        &nbsp;
                                                                        <p className={styles.inside_account_name}>{props.userTopAssets.assetCount}</p>
                                                                        <p className={styles.inside_account_total}>Total Assets</p>
                                                                    </div>
                                                                    <div className={styles.background_double_inside_accounts}>
                                                                        &nbsp;
                                                                    </div>
                                                                    <img className={thisAssetClicked === "secondAsset" ? `${styles.image_inside_accounts_second}  ${styles.pulse}` : `${styles.image_inside_accounts_second}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[1]); setThiAssetClicked("secondAsset") }} src={props.userTopAssets.userAssets[1].currencyDetails.logo_url} alt="" />
                                                                    <img className={thisAssetClicked === "thirdAsset" ? `${styles.image_inside_accounts_third}  ${styles.pulse}` : `${styles.image_inside_accounts_third}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[2]); setThiAssetClicked("thirdAsset") }} src={props.userTopAssets.userAssets[2].currencyDetails.logo_url} alt="" />
                                                                </div> : <></>
                                                            }
                                                            {/* For 4 accounts */}
                                                            {props.userTopAssets.userAssets.length === 4 ?
                                                                <div className={styles.background_accounts}>
                                                                    <img className={thisAssetClicked === "firstAsset" ? `${styles.image_inside_accounts}  ${styles.pulse}` : `${styles.image_inside_accounts}`} src={props.userTopAssets.userAssets[0].currencyDetails.logo_url} alt="" />
                                                                    <div className={styles.background_inside_accounts}>
                                                                        &nbsp;
                                                                        <p className={styles.inside_account_name}>{props.userTopAssets.assetCount}</p>
                                                                        <p className={styles.inside_account_total}>Total Assets</p>
                                                                    </div>
                                                                    <div className={styles.background_double_inside_accounts}>
                                                                        &nbsp;
                                                                    </div>
                                                                    <img className={thisAssetClicked === "secAsset" ? `${styles.image_inside_accounts_sec}  ${styles.pulse}` : "image_inside_accounts_sec"} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[1]); setThiAssetClicked("secAsset") }} src={props.userTopAssets.userAssets[1].currencyDetails.logo_url} alt="" />
                                                                    <img className={thisAssetClicked === "thAsset" ? `${styles.image_inside_accounts_th}  ${styles.pulse}` : "image_inside_accounts_th"} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[2]); setThiAssetClicked("thAsset") }} src={props.userTopAssets.userAssets[2].currencyDetails.logo_url} alt="" />
                                                                    <img className={thisAssetClicked === "forthAsset" ? `${styles.image_inside_accounts_forth}  ${styles.pulse}` : "image_inside_accounts_forth"} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[3]); setThiAssetClicked("forthAsset") }} src={props.userTopAssets.userAssets[3].currencyDetails.logo_url} alt="" />
                                                                </div> : <></>
                                                            }
                                                            {/* For 5 or more accounts */}
                                                            {props.userTopAssets.userAssets.length === 5 || props.userTopAssets.userAssets.length >= 5 ?
                                                                <div className={styles.background_accounts}>
                                                                    &nbsp;
                                                                    <img className={thisAssetClicked === "firstAsset" ? `${styles.image_inside_accounts}  ${styles.pulse}` : `${styles.image_inside_accounts}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[0]); setThiAssetClicked("firstAsset") }} src={props.userTopAssets.userAssets[0].currencyDetails.logo_url} alt="" />
                                                                    <div className={styles.background_inside_accounts}>
                                                                        <p className={styles.inside_account_name}>{props.userTopAssets.assetCount}</p>
                                                                        <p className={styles.inside_account_total}>Total Assets</p>
                                                                    </div>
                                                                    <div className={styles.background_double_inside_accounts}>
                                                                        &nbsp;
                                                                    </div>
                                                                    <img className={thisAssetClicked === "secondAsset" ? `${styles.image_inside_accounts_second}  ${styles.pulse}` : `${styles.image_inside_accounts_second}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[1]); setThiAssetClicked("secondAsset") }} src={props.userTopAssets.userAssets[1].currencyDetails.logo_url} alt="" />
                                                                    <img className={thisAssetClicked === "thirdAsset" ? `${styles.image_inside_accounts_third}  ${styles.pulse}` : `${styles.image_inside_accounts_third}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[2]); setThiAssetClicked("thirdAsset") }} src={props.userTopAssets.userAssets[2].currencyDetails.logo_url} alt="" />
                                                                    <img className={thisAssetClicked === "4Asset" ? `${styles.image_inside_accounts_4}  ${styles.pulse}` : `${styles.image_inside_accounts_4}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[3]); setThiAssetClicked("4Asset") }} src={props.userTopAssets.userAssets[3].currencyDetails.logo_url} alt="" />
                                                                    <img className={thisAssetClicked === "5Asset" ? `${styles.image_inside_accounts_5}  ${styles.pulse}` : `${styles.image_inside_accounts_5}`} onClick={() => { gettingTopAssetsToShow(props.userTopAssets.userAssets[4]); setThiAssetClicked("5Asset") }} src={props.userTopAssets.userAssets[4].currencyDetails.logo_url} alt="" />
                                                                </div> : <></>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-lg-6">
                                                        <button className={styles.top_assets_heading_btn}><h4 className={styles.top_assets_heading}>{showingToAssets.currencyDetails.name}</h4></button>
                                                        <div className={`mt-5 mt-md-4 text-start d-flex ${styles.para_inside}`}>
                                                            <img src={imageHost + "/portfolio-allocation.svg"} alt="" />
                                                            <div className={`ms-3 mt-3 ${styles.portfolio_allocation}`}>
                                                                <p className={styles.allocation_para}>Portfolio Allocation</p>
                                                                <p className={styles.allocation_amount}>{showingToAssets.percent}%</p>
                                                            </div>
                                                        </div>
                                                        <div className={`mt-2 text-start d-flex ${styles.para_inside}`}>
                                                            <img src={imageHost + "/total-transaction-port.svg"} alt="" />
                                                            <div className={`ms-3 mt-3 ${styles.portfolio_allocation}`}>
                                                                <p className={styles.allocation_para}>Total Transaction</p>
                                                                <p className={styles.allocation_amount}>{showingToAssets.txnCount}</p>
                                                            </div>
                                                        </div>
                                                        <div className={`mt-2 mb-1 text-start d-flex ${styles.para_inside}`}>
                                                            <img src={imageHost + "/current-value.svg"} alt="" />
                                                            <div className={`ms-3 mt-3 ${styles.portfolio_allocation}`}>
                                                                <p className={styles.allocation_para}>Current Value</p>
                                                                <p className={styles.allocation_amount}>${showingToAssets.value}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className={`ms-auto ${styles.btn_div}`}>
                                    <a href='/my-accounts' className={`${styles.all_account_btn} btn px-3 py-2 ms-2`}>View All {props.userTopAssets.assetCount} Assets</a>
                                </div>
                            </div> : <>
                                <div className={`col-12 col-lg-11 ${styles.top_accounts_subhead} border border-1 mb-3`}>
                                    <button className={styles.top_transaction_heading_btn}><h4 className={styles.top_transaction_heading}>Top Assets</h4></button>
                                    <div className='d-none d-xl-flex justify-content-center'>
                                        <img className='my-4' src={imageHost + "/no-data-portfolio-img.svg"} alt="" />
                                        <p className='mt-auto mb-auto'>You do not have any Top Assets in your account</p>
                                    </div>
                                    <div className='d-block d-xl-none'>
                                        <img className='my-4' src={imageHost + "/no-data-portfolio-img.svg"} alt="" />
                                        <p>You do not have any transactions in your account</p>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </div>
                <div className={`mt-5 px-0 ${styles.total_transactions}`}>
                    <div className="row">
                        {props.userTopLatestTxn.length !== 0 ?
                            <>
                                <div className={`col-12 col-lg-11 col-xl-8 mb-3 border border-1 ${styles.top_accounts_subhead}`}>
                                    <button className={styles.top_transaction_heading_btn}><h4 className={styles.top_transaction_heading}>Latest Transactions</h4></button>
                                    <div className={`row mt-5 ${styles.transaction_row}`}>
                                        <div className={styles.account_mobile}>
                                            <div className="col-12 col-sm-12 col-md-10 col-lg-4">
                                                {transactionImageShow.length === 0 ?
                                                    <>
                                                        {props.userTopLatestTxn.latestTxns[0].txnType === "TRADE" ?
                                                            <div className={styles.background_accounts}>
                                                                <img className={styles.image_arrow_right} src={imageHost + "/left-arrow-portfolio.svg"} alt="" />
                                                                {props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails !== null ?
                                                                    <>
                                                                        <img className={styles.image_inside_trade} src={props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails.logo_url} alt="" />
                                                                        <p className={styles.coin_value_trade}>{props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails.currency} </p>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <img className={styles.image_inside_trade} style={{ "borderRadius": "50%" }} src={imageHost + "/default-crypto-icon.svg"} alt="" />
                                                                        <p className={styles.coin_value_trade}>USD</p>
                                                                    </>
                                                                }
                                                                {props.userTopLatestTxn.latestTxns[0].currencies[1].currencyDetails !== null ?
                                                                    <>
                                                                        <img className={styles.image_inside_trade_1} src={props.userTopLatestTxn.latestTxns[0].currencies[1].currencyDetails.logo_url} alt="" />
                                                                        <p className={styles.coin_value_trade_1}> {props.userTopLatestTxn.latestTxns[0].currencies[1].currencyDetails.currency}</p>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <img className={styles.image_inside_trade_1} style={{ "borderRadius": "50%" }} src={imageHost + "/default-crypto-icon.svg"} alt="" />
                                                                        <p className={styles.coin_value_trade_1}> USD</p>
                                                                    </>
                                                                }
                                                            </div>
                                                            : <div>
                                                                {props.userTopLatestTxn.latestTxns[0].txnType === "WITHDRAWAL" ?
                                                                    <div className={styles.background_accounts}>
                                                                        &nbsp;
                                                                        <img className={styles.image_arrow_up} src={imageHost + "/up-arrow-portfolio.svg"} alt="" />
                                                                        <img className={styles.image_arrow_up_1} src={imageHost + "/up-arrow-portfolio.svg"} alt="" />
                                                                        <img className={styles.image_inside_box} src={imageHost + "/transaction-box.svg"} alt="" />
                                                                        {props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails !== null ?
                                                                            <img className={styles.image_inside_accounts} src={props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails.logo_url} alt="" />
                                                                            : <img className={styles.image_inside_accounts} style={{ "borderRadius": "50%" }} src={imageHost + "/default-crypto-icon.svg"} alt="" />
                                                                        }
                                                                        {props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails !== null ?
                                                                            <p className={styles.default_coin_name}>{props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails.currency}</p> :
                                                                            <p className={styles.default_coin_name}>USD</p>
                                                                        }
                                                                    </div>
                                                                    : <div>
                                                                        {props.userTopLatestTxn.latestTxns[0].txnType === "DEPOSIT" ?
                                                                            <div className={styles.background_accounts}>
                                                                                &nbsp;
                                                                                <img className={styles.image_arrow_down} src={imageHost + "/up-arrow-portfolio.svg"} alt="" />
                                                                                <img className={styles.image_arrow_down_1} src={imageHost + "/up-arrow-portfolio.svg"} alt="" />
                                                                                <img className={styles.image_inside_box} src={imageHost + "/transaction-box.svg"} alt="" />
                                                                                {props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails !== null ?
                                                                                    <img className={styles.image_inside_accounts} src={props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails.logo_url} alt="" />
                                                                                    : <img className={styles.image_inside_accounts} src={imageHost + "/default-crypto-icon.svg"} alt="" />
                                                                                }
                                                                                {props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails !== null ?
                                                                                    <p className={styles.default_coin_name}>{props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails.currency}</p> :
                                                                                    <p className={styles.default_coin_name}>USD</p>
                                                                                }
                                                                            </div>
                                                                            : <div><p>abc</p></div>
                                                                        }
                                                                    </div>}
                                                            </div>}
                                                    </>
                                                    :
                                                    <>
                                                        {transactionImageShow.txnType === "TRADE" ?
                                                            <div className={styles.background_accounts}>
                                                                <img className={styles.image_arrow_right} src={imageHost + "/left-arrow-portfolio.svg"} alt="" />
                                                                {transactionImageShow.currencies[0].currencyDetails !== null ?
                                                                    <>
                                                                        <img className={styles.image_inside_trade} src={transactionImageShow.currencies[0].currencyDetails.logo_url} alt="" />
                                                                        <p className={styles.coin_value_trade}>{transactionImageShow.currencies[0].currencyDetails.currency} </p>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <img className={styles.image_inside_trade} style={{ "borderRadius": "50%" }} src={imageHost + "/default-crypto-icon.svg"} alt="" />
                                                                        <p className={styles.coin_value_trade}>USD</p>
                                                                    </>
                                                                }
                                                                {transactionImageShow.currencies[1].currencyDetails !== null ?
                                                                    <>
                                                                        <img className={styles.image_inside_trade_1} src={transactionImageShow.currencies[1].currencyDetails.logo_url} alt="" />
                                                                        <p className={styles.coin_value_trade_1}>{transactionImageShow.currencies[1].currencyDetails.currency} </p>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <img className={styles.image_inside_trade_1} style={{ "borderRadius": "50%" }} src={imageHost + "/default-crypto-icon.svg"} alt="" />
                                                                        <p className={styles.coin_value_trade_1}>USD</p>
                                                                    </>
                                                                }
                                                            </div>
                                                            : <div>
                                                                {transactionImageShow.txnType === "WITHDRAWAL" ?
                                                                    <div className={styles.background_accounts}>
                                                                        <img className={styles.image_arrow_up} src={imageHost + "/up-arrow-portfolio.svg"} alt="" />
                                                                        <img className={styles.image_arrow_up_1} src={imageHost + "/up-arrow-portfolio.svg"} alt="" />

                                                                        {transactionImageShow.currencies[0].currencyDetails !== null ?
                                                                            <img className={styles.image_inside_accounts} src={transactionImageShow.currencies[0].currencyDetails.logo_url} alt="" />
                                                                            : <img className={styles.image_inside_accounts} style={{ "borderRadius": "50%" }} src={imageHost + "/default-crypto-icon.svg"} alt="" />
                                                                        }
                                                                        {transactionImageShow.currencies[0].currencyDetails !== null ?
                                                                            <p className={styles.default_coin_name}>{transactionImageShow.currencies[0].currencyDetails.currency}</p> :
                                                                            <p className={styles.default_coin_name}>USD</p>
                                                                        }
                                                                        <img className={styles.image_inside_box} src={imageHost + "/transaction-box.svg"} alt="" />
                                                                    </div>
                                                                    : <></>
                                                                }
                                                                {transactionImageShow.txnType === "DEPOSIT" ?
                                                                    <div className={styles.background_accounts}>

                                                                        &nbsp;
                                                                        <img className={styles.image_arrow_down} src={imageHost + "/up-arrow-portfolio.svg"} alt="" />
                                                                        <img className={styles.image_arrow_down_1} src={imageHost + "/up-arrow-portfolio.svg"} alt="" />
                                                                        {transactionImageShow.currencies[0].currencyDetails !== null ?
                                                                            <img className={styles.image_inside_accounts} src={transactionImageShow.currencies[0].currencyDetails.logo_url} alt="" />
                                                                            : <img className={styles.image_inside_accounts} style={{ "borderRadius": "50%" }} src={imageHost + "/default-crypto-icon.svg"} alt="" />
                                                                        }
                                                                        {transactionImageShow.currencies[0].currencyDetails !== null ?
                                                                            <p className={styles.default_coin_name}>{transactionImageShow.currencies[0].currencyDetails.currency}</p> :
                                                                            <p className={styles.default_coin_name}>USD</p>
                                                                        }
                                                                        <img className={styles.image_inside_box} src={imageHost + "/transaction-box.svg"} alt="" />
                                                                        <div className={styles.background_double_inside_accounts}>
                                                                            &nbsp;
                                                                        </div>
                                                                    </div>
                                                                    : <></>
                                                                }
                                                            </div>
                                                        }
                                                    </>
                                                }
                                            </div>
                                        </div>
                                        <div className={`col-11 mb-4 col-md-10 col-lg-11 col-xl-8 ${styles.transaction_list}`}>
                                            {props.userTopLatestTxn.latestTxns.map((account: any) => {
                                                return <>
                                                    <div className={`d-flex justify-content-between ${styles.transaction_map}`} onClick={(e) => { getTransactionToShow(account); setTransacionClicked("abc") }}>
                                                        <div className='d-flex'>
                                                            <div className={`text-start ps-2 ${styles.transaction_category}`}>
                                                                <p className={styles.main_category}>{toTitles(account.txnType)}</p>
                                                                <p className={styles.date_syntax}>{getFormatedDate(parseISO(account.txnDate), "dd-MMM-yy")}</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className={`text-end ${styles.transaction_category}`}>
                                                                {account.currencies.length !== 0 ?
                                                                    <>
                                                                        {account.txnType === "TRADE" ?
                                                                            <>
                                                                                <p className={account.currencies[0].direction === "RECEIVED" ? `${styles.main_category} ${styles.color_green_1} ${styles.fw_3}` : `${styles.main_category} ${styles.color_red} ${styles.fw_3}`}>{account.currencies[0].holdings} {account.currencies[0].currency}</p>
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <p className={account.txnType === "OTHER" || account.txnType === "DEPOSIT" ? `${styles.main_category} ${styles.color_green_1} ${styles.fw_3}` : `${styles.main_category} ${styles.color_red} ${styles.fw_3}`}>{account.currencies[0].holdings} {account.currencies[0].currency}</p><p className={account.txnType === "WITHDRAWAL" || account.txnType === "DEPOSIT" ? "main-category color-green-1 fw-3" : "main-category color-red fw-3"}>{account.currencies.holdings} {account.currencies.currency}</p>
                                                                            </>

                                                                        }
                                                                        <p className={styles.date_syntax}>{account.account}  {account.txnType === "TRADE" ? <>
                                                                            <span className={account.currencies[1].direction === "SENT" ? `${styles.main_category} ${styles.color_red} ${styles.fw_3}` : `${styles.main_category} ${styles.color_green_1} ${styles.fw_3}`}>| {account.currencies[1].holdings} {account.currencies[1].currency}</span>
                                                                        </> : <></>}</p>
                                                                    </> :
                                                                    <>
                                                                    </>}

                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            })}
                                        </div>
                                        <div className={styles.account_desktop}>
                                            <div className="col-12 col-sm-12 col-md-10 col-lg-4">
                                                {transactionImageShow.length === 0 ?
                                                    <>
                                                        {props.userTopLatestTxn.latestTxns[0].txnType === "TRADE" ?
                                                            <div className={styles.background_accounts}>
                                                                {props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails === null && props.userTopLatestTxn.latestTxns[0].currencies[0].currency === "USD" ?
                                                                    <>
                                                                        <img className={styles.image_inside_trade} src={imageHost + "/dollor-transaction.svg"} alt="" />
                                                                        <p className={styles.coin_value_trade}>USD</p>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        {props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails === null && props.userTopLatestTxn.latestTxns[0].currencies[0].currency !== "USD" ?
                                                                            <>
                                                                                <img className={styles.image_inside_trade} style={{ "borderRadius": "50%" }} src={imageHost + "/default-crypto-icon.svg"} alt="" />
                                                                            </> :
                                                                            <>
                                                                                {console.log(props.userTopLatestTxn.latestTxns[0].currencies[0])}
                                                                                <img className={styles.image_inside_trade} src={props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails.logo_url} alt="" />
                                                                                <p className={styles.coin_value_trade}>{props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails.currency}</p>
                                                                            </>
                                                                        }
                                                                    </>
                                                                }
                                                                <img className={styles.image_arrow_right} src={imageHost + "/left-arrow-portfolio.svg"} alt="" />
                                                                {props.userTopLatestTxn.latestTxns[0].currencies[1].currencyDetails === null && props.userTopLatestTxn.latestTxns[0].currencies[1].currency === "USD" ?
                                                                    <>
                                                                        <img className={styles.image_inside_trade_1} src={imageHost + "/dollor-transaction.svg"} alt="" />
                                                                        <p className={styles.coin_value_trade_1}>{props.userTopLatestTxn.latestTxns[0].currencies[1].currency}</p>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        {props.userTopLatestTxn.latestTxns[0].currencies[1].currencyDetails === null && props.userTopLatestTxn.latestTxns[0].currencies[1].currency !== "USD" ?
                                                                            <>
                                                                                <img className={styles.image_inside_trade_1} style={{ "borderRadius": "50%" }} src={imageHost + "/default-crypto-icon.svg"} alt="" />
                                                                                <p className={styles.coin_value_trade_1}>{props.userTopLatestTxn.latestTxns[0].currencies[1].currency}</p>
                                                                            </> :
                                                                            <>
                                                                                <img className={styles.image_inside_trade_1} src={props.userTopLatestTxn.latestTxns[0].currencies[1].currencyDetails.logo_url} alt="" />
                                                                                <p className={styles.coin_value_trade_1}>{props.userTopLatestTxn.latestTxns[0].currencies[1].currencyDetails.currency}</p>
                                                                            </>
                                                                        }
                                                                    </>
                                                                }
                                                            </div>
                                                            : <div>
                                                                {props.userTopLatestTxn.latestTxns[0].txnType === "WITHDRAWAL" ?
                                                                    <div className={styles.background_accounts}>
                                                                        &nbsp;
                                                                        <img className={styles.image_arrow_up} src={imageHost + "/up-arrow-portfolio.svg"} alt="" />
                                                                        <img className={styles.image_arrow_up_1} src={imageHost + "/up-arrow-portfolio.svg"} alt="" />
                                                                        <img className={styles.image_inside_box} src={imageHost + "/transaction-box.svg"} alt="" />
                                                                        {props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails !== null ?
                                                                            <img className={styles.image_inside_accounts} src={props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails.logo_url} alt="" />
                                                                            : <img className={styles.image_inside_accounts} style={{ "borderRadius": "50%" }} src={imageHost + "/default-crypto-icon.svg"} alt="" />
                                                                        }
                                                                        {props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails !== null ?
                                                                            <p className={styles.default_coin_name}>{props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails.currency}</p> :
                                                                            <p className={styles.default_coin_name}>USD</p>
                                                                        }
                                                                    </div>
                                                                    : <div>
                                                                        {props.userTopLatestTxn.latestTxns[0].txnType === "DEPOSIT" ?
                                                                            <div className={styles.background_accounts}>
                                                                                &nbsp;
                                                                                <img className={styles.image_arrow_down} src={imageHost + "/up-arrow-portfolio.svg"} alt="" />
                                                                                <img className={styles.image_arrow_down_1} src={imageHost + "/up-arrow-portfolio.svg"} alt="" />
                                                                                <img className={styles.image_inside_box} src={imageHost + "/transaction-box.svg"} alt="" />
                                                                                {props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails !== null ?
                                                                                    <img className={styles.image_inside_accounts} src={props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails.logo_url} alt="" />
                                                                                    : <img className={styles.image_inside_accounts} src={imageHost + "/default-crypto-icon.svg"} alt="" />
                                                                                }
                                                                                {props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails !== null ?
                                                                                    <p className={styles.default_coin_name}>{props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails.currency}</p> :
                                                                                    <p className={styles.default_coin_name}>USD</p>
                                                                                }
                                                                            </div>
                                                                            : <div><p>abc</p></div>
                                                                        }
                                                                    </div>}
                                                            </div>}
                                                    </> : <>
                                                        {transactionImageShow.txnType === "TRADE" ?
                                                            <div className={styles.background_accounts}>
                                                                <img className={styles.image_arrow_right} src={imageHost + "/left-arrow-portfolio.svg"} alt="" />
                                                                {transactionImageShow.currencies[0].currencyDetails === null && transactionImageShow.currencies[0].currency === "USD" ?
                                                                    <>
                                                                        <img className={styles.image_inside_trade} src={imageHost + "/dollor-transaction.svg"} alt="" />
                                                                        <p className={styles.coin_value_trade}>USD</p>
                                                                    </> :
                                                                    <>
                                                                        {transactionImageShow.currencies[0].currencyDetails === null && transactionImageShow.currencies[0].currency !== "USD" ?
                                                                            <>
                                                                                <img className={styles.image_inside_trade} style={{ "borderRadius": "50%" }} src={imageHost + "/default-crypto-icon.svg"} alt="" />
                                                                            </> :
                                                                            <>
                                                                                <img className={styles.image_inside_trade} src={transactionImageShow.currencies[0].currencyDetails.logo_url} alt="" />
                                                                                <p className={styles.coin_value_trade}>{transactionImageShow.currencies[0].currencyDetails.currency}</p>
                                                                            </>
                                                                        }
                                                                    </>
                                                                }
                                                                {transactionImageShow.currencies[1].currencyDetails === null && transactionImageShow.currencies[1].currency === "USD" ?
                                                                    <>
                                                                        <img className={styles.image_inside_trade_1} src={imageHost + "/dollor-transaction.svg"} alt="" />
                                                                        <p className={styles.coin_value_trade_1}>{transactionImageShow.currencies[1].currency}</p>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        {transactionImageShow.currencies[1].currencyDetails === null && transactionImageShow.currencies[1].currency !== "USD" ?
                                                                            <>
                                                                                <img className={styles.image_inside_trade_1} style={{ "borderRadius": "50%" }} src={imageHost + "/default-crypto-icon.svg"} alt="" />
                                                                                <p className={styles.coin_value_trade_1}>{transactionImageShow.currencies[1].currency}</p>
                                                                            </> :
                                                                            <>
                                                                                <img className={styles.image_inside_trade_1} src={transactionImageShow.currencies[1].currencyDetails.logo_url} alt="" />
                                                                                <p className={styles.coin_value_trade_1}>{transactionImageShow.currencies[1].currencyDetails.currency}</p>
                                                                            </>
                                                                        }
                                                                    </>
                                                                }
                                                            </div>
                                                            : <div>
                                                                {transactionImageShow.txnType === "WITHDRAWAL" ?
                                                                    <div className={styles.background_accounts}>
                                                                        <img className={styles.image_arrow_up} src={imageHost + "/up-arrow-portfolio.svg"} alt="" />
                                                                        <img className={styles.image_arrow_up_1} src={imageHost + "/up-arrow-portfolio.svg"} alt="" />
                                                                        {transactionImageShow.currencies[0].currencyDetails === null ?
                                                                            <img className={styles.image_inside_accounts} src={transactionImageShow.currencies[0].currencyDetails.logo_url} alt="" />
                                                                            : <img className={styles.image_inside_accounts} style={{ "borderRadius": "50%" }} src={imageHost + "/default-crypto-icon.svg"} alt="" />
                                                                        }
                                                                        {transactionImageShow.currencies[0].currencyDetails !== null ?
                                                                            <p className={styles.default_coin_name}>{transactionImageShow.currencies[0].currencyDetails.currency}</p> :
                                                                            <p className={styles.default_coin_name}>USD</p>
                                                                        }
                                                                        <img className={styles.image_inside_box} src={imageHost + "/transaction-box.svg"} alt="" />
                                                                    </div>
                                                                    : <></>
                                                                }
                                                                {transactionImageShow.txnType === "DEPOSIT" ?
                                                                    <div className={styles.background_accounts}>
                                                                        &nbsp;
                                                                        <img className={styles.image_arrow_down} src={imageHost + "/up-arrow-portfolio.svg"} alt="" />
                                                                        <img className={styles.image_arrow_down_1} src={imageHost + "/up-arrow-portfolio.svg"} alt="" />
                                                                        {transactionImageShow.currencies[0].currencyDetails !== null ?
                                                                            <img className={styles.image_inside_accounts} src={transactionImageShow.currencies[0].currencyDetails.logo_url} alt="" />
                                                                            : <img className={styles.image_inside_accounts} style={{ "borderRadius": "50%" }} src={imageHost + "/default-crypto-icon.svg"} alt="" />
                                                                        }
                                                                        {transactionImageShow.currencies[0].currencyDetails !== null ?
                                                                            <p className={styles.default_coin_name}>{transactionImageShow.currencies[0].currencyDetails.currency}</p> :
                                                                            <p className={styles.default_coin_name}>USD</p>
                                                                        }
                                                                        <img className={styles.image_inside_box} src={imageHost + "/transaction-box.svg"} alt="" />
                                                                        <div className={styles.background_double_inside_accounts}>
                                                                            &nbsp;
                                                                        </div>
                                                                    </div>
                                                                    : <></>
                                                                }
                                                            </div>
                                                        }
                                                    </>
                                                }
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className={`col-6 d-xl-flex justify-content-between ps-0 col-xl-9 ${styles.transaction_btn}`}>
                                                <p className={` ${styles.transaction_amount_head} mb-2 mt-1`}>Total Transaction <br /><span>{props.userTopLatestTxn.totalTxns}</span></p>
                                                <a href='/transactions' className={`btn mb-2 px-2 pt-2 ${styles.add_transaction_btn}`}>View All Transactions</a>
                                            </div>
                                            <div className={`col-6 ${styles.transaction_tab}`}>
                                                <div>
                                                    {transactionImageShow.length === 0 ?
                                                        <>
                                                            {props.userTopLatestTxn.latestTxns[0].txnType === "TRADE" ?
                                                                <div className={styles.background_transactions}>
                                                                    &nbsp;
                                                                    <img className={styles.image_arrow_right} src={imageHost + "/left-arrow-portfolio.svg"} alt="" />
                                                                    {props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails === null && props.userTopLatestTxn.latestTxns[0].currency === "USD" ?
                                                                        <>
                                                                            <img className={styles.image_inside_trade} src={imageHost + "/dollor-transaction.svg"} alt="" />
                                                                            <p className={styles.coin_value_trade}>USD</p>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            {props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails === null && props.userTopLatestTxn.latestTxns[0].currency !== "USD" ?
                                                                                <>
                                                                                    <img src={imageHost + "/default-crypto-icon.svg"} alt="" />
                                                                                    <p className={styles.coin_value_trade}>{props.userTopLatestTxn.latestTxns[0].currencies[0].currency}</p>
                                                                                </>
                                                                                :
                                                                                <img className={styles.image_inside_trade} src={props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails.logo_url} alt="" />
                                                                            }
                                                                        </>
                                                                    }
                                                                    {props.userTopLatestTxn.latestTxns[0].currencies[1].currencyDetails === null && props.userTopLatestTxn.latestTxns[0].currency === "USD" ?
                                                                        <img src={imageHost + "/dollor-transaction.svg"} alt="" /> :
                                                                        <>
                                                                            {props.userTopLatestTxn.latestTxns[0].currencies[1].currencyDetails === null && props.userTopLatestTxn.latestTxns[0].currency !== "USD" ?
                                                                                <img src={imageHost + "/default-crypto-icon.svg"} alt="" /> :
                                                                                <img className={styles.image_inside_trade_1} src={props.userTopLatestTxn.latestTxns[0].currencies[1].currencyDetails.logo_url} alt="" />
                                                                            }
                                                                        </>
                                                                    }
                                                                    &nbsp;
                                                                    <div className={styles.background_double_inside_accounts}>
                                                                        &nbsp;
                                                                    </div>
                                                                </div>
                                                                : <div>
                                                                    {props.userTopLatestTxn.latestTxns[0].txnType === "WITHDRAWAL" ?
                                                                        <div className={styles.background_transactions}>
                                                                            &nbsp;
                                                                            <img className={styles.image_arrow_up} src={imageHost + "/up-arrow-portfolio.svg"} alt="" />
                                                                            <img className={styles.image_arrow_up_1} src={imageHost + "/up-arrow-portfolio.svg"} alt="" />
                                                                            {props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails === null && props.userTopLatestTxn.latestTxns[0].currency === "USD" ?
                                                                                <img src={imageHost + "/dollor-transaction.svg"} alt="" /> :
                                                                                <>
                                                                                    {props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails === null && props.userTopLatestTxn.latestTxns[0].currency !== "USD" ?
                                                                                        <img src={imageHost + "/default-crypto-icon.svg"} alt="" /> :
                                                                                        <img className={styles.image_inside_accounts} src={props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails.logo_url} alt="" />
                                                                                    }
                                                                                </>
                                                                            }
                                                                            <img className={styles.image_inside_box} src={imageHost + "/transaction-box.svg"} alt="" />
                                                                            &nbsp;
                                                                            <div className={styles.background_double_inside_accounts}>
                                                                                &nbsp;
                                                                            </div>
                                                                        </div>
                                                                        : <div>
                                                                            {props.userTopLatestTxn.latestTxns[0].txnType === "DEPOSIT" ?
                                                                                <div className={styles.background_transactions}>
                                                                                    &nbsp;
                                                                                    <img className={styles.image_arrow_down} src={imageHost + "/up-arrow-portfolio.svg"} alt="" />
                                                                                    <img className={styles.image_arrow_down_1} src={imageHost + "/up-arrow-portfolio.svg"} alt="" />
                                                                                    {props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails === null && props.userTopLatestTxn.latestTxns[0].currency === "USD" ?
                                                                                        <img src={imageHost + "/dollor-transaction.svg"} alt="" /> :
                                                                                        <>
                                                                                            {props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails === null && props.userTopLatestTxn.latestTxns[0].currency !== "USD" ?
                                                                                                <img src={imageHost + "/default-crypto-icon.svg"} alt="" /> :
                                                                                                <img className={styles.image_inside_accounts} src={props.userTopLatestTxn.latestTxns[0].currencies[0].currencyDetails.logo_url} alt="" />
                                                                                            }
                                                                                        </>
                                                                                    }
                                                                                    <img className={styles.image_inside_box} src={imageHost + "/transaction-box.svg"} alt="" />
                                                                                    &nbsp;
                                                                                    <div className={styles.background_double_inside_accounts}>
                                                                                        &nbsp;
                                                                                    </div>
                                                                                </div>
                                                                                : <div><p>abc</p></div>
                                                                            }
                                                                        </div>}
                                                                </div>}
                                                        </> : <>
                                                            {transactionImageShow.txnType === "TRADE" ?
                                                                <div className={styles.background_transactions}>
                                                                    <img className={styles.image_arrow_right} src={imageHost + "/left-arrow-portfolio.svg"} alt="" />
                                                                    {transactionImageShow.currencies[0].currencyDetails !== null ?
                                                                        <>
                                                                            <img className={styles.image_inside_trade} src={transactionImageShow.currencies[0].currencyDetails.logo_url} alt="" />
                                                                            <p className={styles.coin_value_trade}>{transactionImageShow.currencies[0].currencyDetails.currency}</p>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <img className={styles.image_inside_trade} style={{ "borderRadius": "50%" }} src={imageHost + "/default-crypto-icon.svg"} alt="" />
                                                                            <p className={styles.coin_value_trade}>USD</p>
                                                                        </>
                                                                    }
                                                                    {transactionImageShow.currencies[1].currencyDetails !== null ?
                                                                        <>
                                                                            <img className={styles.image_inside_trade_1} src={transactionImageShow.currencies[1].currencyDetails.logo_url} alt="" />
                                                                            <p className={styles.coin_value_trade_1}>{transactionImageShow.currencies[1].currencyDetails.currency}</p>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <img className={styles.image_inside_trade_1} style={{ "borderRadius": "50%" }} src={imageHost + "/default-crypto-icon.svg"} alt="" />
                                                                            <p className={styles.coin_value_trade_1}>USD</p>
                                                                        </>
                                                                    }
                                                                </div>
                                                                : <div>
                                                                    {transactionImageShow.txnType === "WITHDRAWAL" ?
                                                                        <div className={styles.background_transactions}>
                                                                            <img className={styles.image_arrow_up} src={imageHost + "/up-arrow-portfolio.svg"} alt="" />
                                                                            <img className={styles.image_arrow_up_1} src={imageHost + "/up-arrow-portfolio.svg"} alt="" />

                                                                            {transactionImageShow.currencies[0].currencyDetails !== null ?
                                                                                <img className={styles.image_inside_accounts} src={transactionImageShow.currencies[0].currencyDetails.logo_url} alt="" />
                                                                                : <img className={styles.image_inside_accounts} style={{ "borderRadius": "50%" }} src={imageHost + "/default-crypto-icon.svg"} alt="" />
                                                                            }
                                                                            {transactionImageShow.currencies[0].currencyDetails !== null ?
                                                                                <p className={styles.default_coin_name}>{transactionImageShow.currencies[0].currencyDetails.currency}</p> :
                                                                                <p className={styles.default_coin_name}>USD</p>
                                                                            }
                                                                            <img className={styles.image_inside_box} src={imageHost + "/transaction-box.svg"} alt="" />
                                                                        </div>
                                                                        : <></>
                                                                    }
                                                                    {transactionImageShow.txnType === "DEPOSIT" ?
                                                                        <div className={styles.background_transactions}>

                                                                            &nbsp;
                                                                            <img className={styles.image_arrow_down} src={imageHost + "/up-arrow-portfolio.svg"} alt="" />
                                                                            <img className={styles.image_arrow_down_1} src={imageHost + "/up-arrow-portfolio.svg"} alt="" />
                                                                            {transactionImageShow.currencies[0].currencyDetails !== null ?
                                                                                <img className={styles.image_inside_accounts} src={transactionImageShow.currencies[0].currencyDetails.logo_url} alt="" />
                                                                                : <img className={styles.image_inside_accounts} style={{ "borderRadius": "50%" }} src={imageHost + "/default-crypto-icon.svg"} alt="" />
                                                                            }
                                                                            {transactionImageShow.currencies[0].currencyDetails !== null ?
                                                                                <p className={styles.default_coin_name}>{transactionImageShow.currencies[0].currencyDetails.currency}</p> :
                                                                                <p className={styles.default_coin_name}>USD</p>
                                                                            }
                                                                            <img className={styles.image_inside_box} src={imageHost + "/transaction-box.svg"} alt="" />
                                                                            <div className={styles.background_double_inside_accounts}>
                                                                                &nbsp;
                                                                            </div>
                                                                        </div>
                                                                        : <></>
                                                                    }
                                                                </div>
                                                            }
                                                        </>}
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </>
                            : <div className={`col-12 col-lg-11  border border-1 mb-3 ${styles.top_accounts_subhead}`}>
                                <button className={styles.top_transaction_heading_btn}><h4 className={styles.top_transaction_heading}>Latest Transactions</h4></button>
                                <div className='d-block d-xl-none'>
                                    <img className='my-4' src={imageHost + "/no-data-portfolio-img.svg"} alt="" />
                                    <p>You do not have any transactions in your account</p>
                                </div>
                                <div className='d-none d-xl-flex justify-content-center'>
                                    <img className='my-4' src={imageHost + "/no-data-portfolio-img.svg"} alt="" />
                                    <p className='mt-auto mb-auto'>You do not have any transactions in your account</p>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default TransactionAccounts