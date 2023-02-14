import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import styles from "../../styles/my-account/my-account.module.scss"


var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;

const ProgressAccount = (props: any) => {
    const [showingExpiredDiv, setshowingExpiredDiv] = useState(true);
    const [showingInprogDiv, setshowingInprogDiv] = useState(true);
    const [ishidingIcon, setishidingIcon] = useState("");
    const router = useRouter();
    return (
        <>
            <div className='container px-1 mt-3'>
                <div className="row">
                    <div className={`${styles.go_back} px-3 text-end`}>
                        <a onClick={()=>{router.push("/add-account")}} className={`btn me-lg-2 ${styles.go_back_main} ${styles.go_back_main_add}`}>
                        <img className='mb-2' src={imageHost + "/plus.svg"} alt="" /><span className={styles.go_back_a}> Add Account</span>
                        </a>
                        <a onClick={()=>{router.push("/users-portfolio")}} className={`btn me-lg-2 ${styles.go_back_main}`}>
                        <img className={styles.go_back_img} src={imageHost + "/arrow-left-port.svg"} alt="" /><span className={styles.go_back_a}> Portfolio</span>
                        </a>
                        {/* <a onClick={() => { navigate("/add-account"); }}className={`btn me-lg-2 ${styles.go_back_main} ${styles.go_back_main_add}`}>
                            <img className='mb-2' src={imageHost + "/plus.svg"} alt="" /><span className={styles.go_back_a}> Add Account</span>
                        </a>
                        <a onClick={() => { navigate("/users-portfolio"); }} className={`btn me-lg-2 ${styles.go_back_main}`}>
                            <img className={styles.go_back_img} src={imageHost + "/arrow-left-port.svg"} alt="" /><span className={styles.go_back_a}> Portfolio</span>
                        </a> */}
                    </div>
                    <div className={`col-12 col-xl-6 ${styles.first_part}`}>
                        <h3 className={styles.main_heading}>Expired Accounts(s)</h3>
                        <div className={`${styles.mobile_expired_account} py-2`}>
                            <h2 className={`${styles.main_heading_mobile} ps-2 mb-0`}>Expired Account(s)</h2>
                            {showingExpiredDiv === true ?
                                <img className='pe-3 arrows' onClick={(e) => { setshowingExpiredDiv(false) }} src={imageHost + "/arrow-up-account.svg"} alt="" />
                                :
                                <img className='pe-3 arrows' onClick={(e) => { setshowingExpiredDiv(true) }} src={imageHost + "/arrow-down-account.svg"} alt="" />
                            }

                        </div>
                        {showingExpiredDiv &&
                            <div>
                                    <>
                                        {props.expiredAccounts.length != 0 ?
                                            <>
                                                <table className="table mb-0 table-head-size">
                                                    <thead className={styles.static_border_bottom}>
                                                        <tr>
                                                            <th scope="col" className={`border-adjustment col-9 ${styles.border_adjustment }`}>Account Name </th>
                                                            <th scope="col" className={`border-adjustment col-3 text-center ${styles.border_adjustment }`}>Action</th>
                                                        </tr>
                                                    </thead>
                                                </table>
                                                <div className={`${styles.expired_accounts} px-2`}>
                                                    {props.expiredAccounts.map((expiredExch: any) => {
                                                        return <>
                                                            <div key={expiredExch.account.accountNameInLC} className={`${styles.expired_list} d-block py-2`}>
                                                                <div className='row'>
                                                                    <div className="col-9">
                                                                        <div className={styles.account_name}>
                                                                            <img className={styles.inprog_account_img} src={imageHost + `/exchanges/` + expiredExch.account.accountNameInLC + `.png`}
                                                                                alt="" />{expiredExch.account.accountDisplayName}
                                                                            {expiredExch.uaStatus === "EXPIRED" ?
                                                                                <div className={`d-inline-block ${styles.info_icon_adjustment}`}>
                                                                                    <img className={`ms-1 mt-1 ${styles.user_portfolio_info_icon}`} onClick={() => props.showingerrorInSync(expiredExch.uniqueAccountName)} src={imageHost + "/error-warning-icon.svg"} />
                                                                                </div> : <></>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-3 d-flex justify-content-center'>
                                                                        <div className={`${styles.account_name} text-center px-2`} onMouseDown={() => props.retryFunctionality(expiredExch.account.accountNameInLC)}>
                                                                            {/* <Link to="/add-account/import" state={{ account: props.retryaccount, newAccount: expiredExch.userDefinedAccountName, uniqueAccName: expiredExch.uniqueAccountName }}>
                                                                                <img className={styles.reconnect_logo} src={imageHost + "/retry-new-link.svg"} alt="" />
                                                                            </Link> */}
                                                                        </div>
                                                                        <div className={`${styles.account_name} text-center px-2`}>
                                                                            <img src={imageHost + "/loader-small.gif"} alt="" className={styles.syncing_connected} id={"image" + expiredExch.uniqueAccountName} />
                                                                            <img onClick={() => props.connectedDelete(expiredExch.uniqueAccountName)} id={"delete" + expiredExch.uniqueAccountName} className={styles.delete_icon} src={imageHost + "/delete-new-icon.svg"} alt="" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {props.showdeletewarning === expiredExch.uniqueAccountName && (
                                                                    <div className={styles.error_connected}>
                                                                        <div>
                                                                            <img className={styles.error_connect_img} src={imageHost + "/Polygon-upper.png"} />
                                                                        </div>
                                                                        <div className={`border border-1 ${styles.error2} ${styles.error_2_warning} ps-3 pe-3`}>
                                                                            <a className={styles.cross_connected}> <img onClick={() => props.hideWarning()}
                                                                                src={imageHost + "/cross-icon.png"} alt="" className={styles.src} />
                                                                            </a>
                                                                            <p className={styles.error2_para}>
                                                                                <span>Alert :</span>
                                                                                Do you want to Delete the account? If yes,please click on &nbsp;
                                                                                <a onMouseDown={() => props.deleteAccount(expiredExch.uniqueAccountName)} className={`${styles.href} ${styles.error_2_img}`}
                                                                                >continue</a>
                                                                            </p>
                                                                        </div>
                                                                    </div>)}
                                                                {props.showingErrorDiv === expiredExch.uniqueAccountName && expiredExch.uaStatus === "EXPIRED" ? (
                                                                    <div className={`d-block ${styles.error_connected}`}>
                                                                        <div>
                                                                            <img className={styles.error_connect_img} src={imageHost + "/Polygon-upper.png"} />
                                                                        </div>
                                                                        <div className={`border border-1 ${styles.error2} ${styles.error_2_warning} ps-3 pe-3`}>
                                                                            <a onClick={() => props.hideWarning()} className={styles.cross_connected}> <img
                                                                                src={imageHost + "/cross-icon.png"} alt="" className={styles.src} />
                                                                            </a>
                                                                            <p className={styles.error2_para}>
                                                                                <span>Alert :</span>
                                                                                {expiredExch.error.message}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ) : <></>}
                                                            </div>
                                                        </>
                                                    })}
                                                </div></> :
                                            <div className={styles.no_account}>
                                                <img className={styles.expired_img} src={imageHost + "/no-expired-account.svg"} alt="" />
                                                <p className={styles.expired_para}>You don't have any <span>Expired Account </span></p>
                                            </div>
                                        }
                                    </>
                            </div>
                        }
                    </div>
                    <div className={`col-12 col-xl-6 ${styles.second_part}`}>
                        <h3 className={styles.main_heading}>Incomplete Account(s)</h3>
                        <div className={`${styles.mobile_expired_account} py-2`}>
                            <h2 className={`${styles.main_heading_mobile} ps-2 mb-0`}>Incomplete Account(s)</h2>
                            {showingInprogDiv === true ?
                                <img className='pe-3 arrows' onClick={(e) => { setshowingInprogDiv(false) }} src={imageHost + "/arrow-up-account.svg"} alt="" />
                                :
                                <img className='pe-3 arrows' onClick={(e) => { setshowingInprogDiv(true) }} src={imageHost + "/arrow-down-account.svg"} alt="" />
                            }
                        </div>
                        {showingInprogDiv &&
                            <div>
                                {props.isLoader === true ? <div className={styles.loader_account}><img className={styles.loader_image} src={imageHost + '/loader-small.gif'} alt='' /></div> : <>
                                    {props.inprogAccounts.length != 0 ?
                                        <>
                                            <table className="table mb-0 table-head-size">
                                                <thead className={`static-border-bottom ${styles.static_border_bottom}`}>
                                                    <tr>
                                                        <th scope="col" className={`border-adjustment col-9 ${styles.border_adjustment }`}>Account Name </th>
                                                        <th scope="col" className={`border-adjustment col-3 text-center ${styles.border_adjustment }`}>Action</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                            <div className={`${styles.inprogress_accounts} px-3`}>
                                                {props.inprogAccounts.map((inprogAccounts: any) => {
                                                    return <>
                                                        <div key={inprogAccounts.account.accountNameInLC} className={`${styles.expired_list} d-block py-2`}>
                                                            <div className='row'>
                                                                <div className={`${styles.account_name} col-9 ps-0`}>
                                                                    <img className={styles.inprog_account_img} src={imageHost + `/exchanges/` + inprogAccounts.account.accountNameInLC + `.png`}
                                                                        alt="" />{inprogAccounts.userDefinedAccountName}
                                                                    {inprogAccounts.uaStatus === "TEMP_ERROR" ?
                                                                        <div className={`d-inline-block ${styles.info_icon_adjustment}`}>
                                                                            <img className={`ms-1 mt-1 ${styles.user_portfolio_info_icon}`} src={imageHost + "/error-warning-icon.svg"} onClick={() => props.showingerrorInSync(inprogAccounts.uniqueAccountName)} />
                                                                        </div> : ""
                                                                    }{
                                                                        inprogAccounts.uaStatus === "IN_PROGRESS" ? <div className={`d-inline-block ${styles.info_icon_adjustment}`}>
                                                                            <img className={`ms-1 mt-1 ${styles.user_portfolio_info_icon}`} src={imageHost + "/error-warning-icon.svg"} onClick={() => props.showingerrorInSync(inprogAccounts.uniqueAccountName)} />
                                                                        </div> : ""
                                                                    }

                                                                </div>
                                                                <div className='col-3 px-0 d-flex justify-content-center'>
                                                                    <div className={`${styles.account_name} text-center px-2`} onMouseDown={() => props.retryFunctionality(inprogAccounts.account.accountNameInLC)}>
                                                                        {/* <Link to="/add-account/import" state={{ account: props.retryaccount, newAccount: inprogAccounts.userDefinedAccountName, uniqueAccName: inprogAccounts.uniqueAccountName }}>
                                                                            <img className={styles.reconnect_logo} src={imageHost + "/retry-new-link.svg"} alt="" />
                                                                        </Link> */}
                                                                    </div>
                                                                    <div className={`${styles.account_name} px-2`}>
                                                                        <img src={imageHost + "/loader-small.gif"} alt="" className={styles.syncing_connected} id={"image" + inprogAccounts.uniqueAccountName} />
                                                                        <img onClick={() => props.connectedDelete(inprogAccounts.uniqueAccountName)} id={"delete" + inprogAccounts.uniqueAccountName} className={styles.delete_icon} src={imageHost + "/delete-new-icon.svg"} alt="" />
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            {props.showingErrorDiv === inprogAccounts.uniqueAccountName && inprogAccounts.uaStatus === "IN_PROGRESS" ? (
                                                                <div className={`d-block ${styles.error_connected}`}>
                                                                    <div>
                                                                        <img className={styles.error_connect_img} src={imageHost + "/Polygon-upper.png"} />
                                                                    </div>
                                                                    <div className={`border border-1 ${styles.error2} ${styles.error_2_warning} ps-3 pe-3`}>
                                                                        <a onClick={() => props.hideWarning()} className={styles.cross_connected}> <img
                                                                            src={imageHost + "/cross-icon.png"} alt="" className={styles.src} />
                                                                        </a>
                                                                        <p className={styles.error2_para}>
                                                                            <span>Alert :</span>
                                                                            Connection setup is Incomplete
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ) : <></>}
                                                            {props.showingErrorDiv === inprogAccounts.uniqueAccountName && inprogAccounts.uaStatus === "TEMP_ERROR" ? (
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
                                                                            {inprogAccounts.error.message}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ) : <></>}
                                                            {props.showdeletewarning === inprogAccounts.uniqueAccountName && (
                                                                <div className={styles.error_connected}>
                                                                    <div>
                                                                        <img className={styles.error_connect_img} src={imageHost + "/Polygon-upper.png"} />
                                                                    </div>
                                                                    <div className={`border border-1 ${styles.error2} ${styles.error_2_warning} ps-3 pe-3`}>
                                                                        <a onClick={() => props.hideWarning(inprogAccounts.uniqueAccountName)} className={styles.cross_connected}> <img
                                                                            src={imageHost + "/cross-icon.png"} alt="" className={styles.src} />
                                                                        </a>
                                                                        <p className={styles.error2_para}>
                                                                            <span>Alert :</span>
                                                                            Do you want to Delete the account? If yes,please click on &nbsp;
                                                                            <a onMouseDown={() => props.deleteAccount(inprogAccounts.uniqueAccountName)} className={`${styles.href} ${styles.error_2_img}`}
                                                                            >continue</a>
                                                                        </p >
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </>
                                                })}</div></> : <>
                                            <div className={styles.no_account}>
                                                <img className={styles.inprog_img} src={imageHost + "/no-expired-account.svg"} alt="" />
                                                <p className={styles.inprog_para}>You don't have any <span>Inprogress Account </span></p>
                                            </div>
                                        </>}
                                </>}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProgressAccount