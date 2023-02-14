import Axios from 'axios';
import React, { useState, useEffect } from 'react'
import { iosInformationOutline } from 'react-icons-kit/ionicons/iosInformationOutline'
import Icon from 'react-icons-kit';
import { Button, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';
import LeftFeed from '../../components/shared/left-feed';
import RightFeed from '../../components/shared/right-feed';
import styles from "../../styles/import-account/import.module.scss";
import ClientService from "../../services/main-serviceClient";
import { useRouter } from 'next/router';

const bodyOfConnectReq = {
    "userDefinedAccountName": "",
    "account": null,
    "flowType": "",
    "apiKey": null,
    "apiSecret": null,
    "uniqueAccountName": null
}

var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;
const Oauth = (props: any) => {
    const router = useRouter();
    const clientservice:any = ClientService("post");
    const [sendRequest, setSendRequest] = useState(false);
    const [error, setError] = useState("");
    const [userDefinedname, setuserDefinedname] = useState("");
    const [iserror, setisError] = useState(false);
    const [isloaderoauth, setisloaderoauth] = useState('idle');

    const ueConnectUrl = async () => {
        setisloaderoauth('inprogress')
        if (userDefinedname === "") {
            bodyOfConnectReq.userDefinedAccountName = props.newDefinedAccount;
        } else {
            bodyOfConnectReq.userDefinedAccountName = userDefinedname;
        }
        bodyOfConnectReq.uniqueAccountName = props.newDefinedAccount.uniqueAccName;
        try {
            const abc = await clientservice('/api/v1/import-account/connectRequest', bodyOfConnectReq, 'ups', null)
            if (abc.data.error == null) {
                router.push(`${abc.data.url}`);
                setisloaderoauth('completed')
            } else {
                setisloaderoauth('error')
                const errorconnected = abc.data.error.message;
                setError(errorconnected);
                setisError(true);
            }
        }
        catch (e: any) {
            setisloaderoauth('error')
            const rbc = setError(e.data.error.message);
            setisError(true);
        }
    }

    const hideError = () => setisError(false);
    useEffect(() => {
        if (sendRequest) {
            ueConnectUrl();
            setSendRequest(false);
        }
    },
        [sendRequest]);
    const imageHost = process.env.NEXT_PUBLIC_IMAGEHOST;
    bodyOfConnectReq.account = props.parsedAccount.account;
    bodyOfConnectReq.userDefinedAccountName = userDefinedname;
    bodyOfConnectReq.flowType = "OAUTH";
    return (
        <div className='d-lg-flex justify-content-between'>
            <div className='d-none d-lg-block'>
                <LeftFeed />
            </div>
            <div className={`${styles.import} px-2`}>
                <div className={`container ${styles.main_contain} col-12 mt-3`}>
                    <div className="row">
                        <div className='position-relative text-center'>
                            <div className={styles.body_change}>
                                <div className={`text-center ${styles.setting_height}`}>
                                    <h1 className={`${styles.main_h1} mb-5 ps-3`}>Import Account</h1>
                                </div>
                                <div className={`position-absolute ${styles.body_change_btn} w-100 text-center`}>
                                    <button className={`${styles.mobile_btn} text-end bg-white px-3`}><img className={`me-2 ${styles.btn_image}`}
                                        src={`${imageHost}/exchanges/${props.parsedAccount.accountNameInLC}.png?v=1`} alt="coin-img" title={`${props.parsedAccount.accountDisplayName}`} />{props.parsedAccount.accountDisplayName}</button>
                                </div>
                                <hr className={styles.main_hr} />
                            </div>
                        </div>
                        <div>
                            {
                                iserror ? <div className={`alert mt-2 alert-danger ${styles.error_key} col-lg-11 col-sm-11 col-11 mx-auto d-flex justify-content-between`}>
                                    <p className={styles.error_para}><span>{error}</span></p>
                                    <a className={styles.error_anchor} onClick={() => hideError()}><span><img className={styles.error_crypto} src={imageHost + "/cross-icon.png"} alt="" /></span></a>
                                </div> : <div className='d-none'></div>
                            }
                            <div className='text-center row col-10 col-lg-7 mt-4 m-auto '>
                                <form className="form-group">
                                    <div>
                                        <div className='d-flex'>
                                            <label className={styles.content_api_label}>Account Name</label>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip>
                                                        <div className=' m-0'>Enter a name of your choice.</div>
                                                    </Tooltip>
                                                }
                                            >
                                                <Button variant="link" className={`${styles.info_hover} p-0 pb-1`}><Icon icon={iosInformationOutline} className={styles.user_portfolio_info_icon} size={21} /></Button>
                                            </OverlayTrigger>
                                        </div>
                                        <input type="any" className="form-control mb-2" autoComplete='off' name="apiKey" id="api_Key"
                                            placeholder={props.newDefinedAccount} value={userDefinedname} onChange={(e) => setuserDefinedname(e.target.value)} required />
                                    </div>
                                </form>
                            </div>
                            <div className={`${styles.content_section} m-auto mb-4 col-lg-10`}>
                                <div className="d-flex justify-content-center">
                                    <img src={imageHost + "/oauth-cloud-img.svg"} alt="" className="src" />
                                </div>
                                <div className="d-flex justify-content-center">
                                    <h4 className={styles.content_section_header}>Import Automatically <span>Using the API</span></h4>
                                </div>
                            </div>
                            <div>
                                <div className={`${styles.import_trades} text-center`}>
                                    {isloaderoauth === "idle" || isloaderoauth === "completed" || isloaderoauth === "error" ? <button onClick={() => setSendRequest(true)} className={`btn ${styles.btn_connect} py-1 px-4`}>Import
                                        Your
                                        Trades</button> : <img className={styles.loader_oauth} src={imageHost + '/loader2.gif'} alt="loader" />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className={`container ${styles.sub_btn} col-lg-6  col-sm-12 mt-3 m-auto d-flex justify-content-center`}>
                    <button onClick={() => { navigation(-1) }} type="submit" className="btn">Back</button>
                </div> */}
            </div>
            <div className='d-none d-lg-block'>
                <RightFeed />
            </div>
        </div>

    )
}

export default Oauth

