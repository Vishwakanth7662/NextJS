import React, { useEffect, useState } from 'react'
import { iosInformationOutline } from 'react-icons-kit/ionicons/iosInformationOutline';
import Icon from 'react-icons-kit';
import { Button, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';
import RightFeed from '../../components/shared/right-feed';
import LeftFeed from '../../components/shared/left-feed';
import styles from "../../styles/import-account/import.module.scss";
import ClientService from "../../services/main-serviceClient";
import { useRouter } from 'next/router';

const bodyOfConnectReq = {
    "userDefinedAccountName": "",
    "account": null,
    "flowType": "",
    "apiKey": "",
    "apiSecret": "",
    "passphrase": null,
    "uniqueAccountName": null
}
const bodyOfConnectoauth = {
    "userDefinedAccountName": "",
    "account": null,
    "flowType": "",
    "apiKey": "",
    "apiSecret": "",
    "passphrase": null,
    "uniqueAccountName": null
}
const clientservice:any = ClientService("post");
var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;

const BothValid = (props: any) => {
    const router = useRouter();
    // Defining different states
    const [sendRequestss, setsendRequestss] = useState(false);
    const [sendRequestoauth, setSendRequestoauth] = useState(false);
    const [apikey, setApikey] = useState("");
    const [error, setError] = useState("");
    const [userDefinedname, setuserDefinedname] = useState(props.newDefinedAccount);
    const [apisecret, setApisecret] = useState("");
    const [iserror, setisError] = useState(false);
    const [isloaders2s, setisloaders2s] = useState('idle');
    const [isloaderoauth, setisloaderoauth] = useState('idle');


    const [key, setKey] = useState({});
    const ueConnectUrls2s = async () => {
        setisloaders2s('inprogress');
        if (userDefinedname === "") {
            bodyOfConnectReq.userDefinedAccountName = props.newDefinedAccount;
        } else {
            bodyOfConnectReq.userDefinedAccountName = userDefinedname;
        }
        bodyOfConnectReq.uniqueAccountName = props.newDefinedAccount.uniqueAccName;
        try {
            const abc = await clientservice('/api/v1/import-account/connectRequest', bodyOfConnectReq, 'ups', null);
            if (abc.data.error == null && abc.data.uaConnectStatus == "CONNECTED") {
                router.push(`/add-account?status=connected&account=${abc.data.accountNameInLC}&accountDisplay=${abc.data.accountDisplayName}&uniqueaccountname=${abc.data.uniqueAccountName}&userdefinedName=${abc.data.userDefinedAccountName}`);
                setisloaders2s('completed')
            } else {
                setisloaders2s('error')
                const errorconnected = abc.data.error.message;
                setError(errorconnected);
                setisError(true);
            }
        }
        catch (e: any) {
            setisError(true);
            setisloaders2s('error')
            console.log(e.data.error.message);
            setError(e.data.error.message);
        }
    }
    const ueConnectUrloauth = async () => {
        setisloaderoauth('inprogress');
        if (userDefinedname === "") {
            bodyOfConnectoauth.userDefinedAccountName = props.newDefinedAccount;
        } else {
            bodyOfConnectoauth.userDefinedAccountName = userDefinedname;
        }
        bodyOfConnectoauth.uniqueAccountName = props.newDefinedAccount.uniqueAccName;
        try {
            const responseoauth = await clientservice('/api/v1/import-account/connectRequest', bodyOfConnectoauth, 'ups', null)
            if (responseoauth.data.error == null) {
                setisloaderoauth('completed');
                router.push(`${responseoauth.data.url}`)
            } else {
                setisloaderoauth('error');
                setError(responseoauth.data.error.message)
                setisError(true);
            }
        } catch (e: any) {
            setisloaderoauth('error');
            const rbc = setError(e.data.error.message);
            console.log(e.data.error.message);
            setisError(true);
        }
    }

    const hideError = () => setisError(false);
    useEffect(() => {
        if (sendRequestss) {
            ueConnectUrls2s();
            setsendRequestss(false);
        } else if (sendRequestoauth) {
            ueConnectUrloauth();
            setSendRequestoauth(false);
        }
    }, [sendRequestss, sendRequestoauth]);

    const submitForm = (e: any) => {
        e.preventDefault();
        const newEntry = { apiKey: apikey, apiSecret: apisecret };
        setKey({ newEntry });
        setsendRequestss(true);
    }

    bodyOfConnectReq.account = props.parsedAccount.account;
    bodyOfConnectReq.flowType = "S2S";
    bodyOfConnectReq.apiKey = apikey;
    bodyOfConnectReq.apiSecret = apisecret;
    bodyOfConnectoauth.account = props.parsedAccount.account;
    bodyOfConnectReq.userDefinedAccountName = userDefinedname;
    bodyOfConnectoauth.userDefinedAccountName = userDefinedname;
    bodyOfConnectoauth.uniqueAccountName = props.newDefinedAccount.uniqueAccName;
    bodyOfConnectReq.uniqueAccountName = props.newDefinedAccount.uniqueAccName;
    bodyOfConnectoauth.flowType = "OAUTH";
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
                                        src={`${imageHost}/exchanges/${props.parsedAccount.accountNameInLC}.png?v=1`} />{props.parsedAccount.accountDisplayName}</button>
                                </div>

                                <hr className={styles.main_hr} />
                            </div>

                        </div>
                        <div className='text-center row col-10 col-lg-7 ms-auto m-auto mt-4'>
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
                            <input type="any" className="form-control mb-2 mt-2" autoComplete='off' name="apiKey" id="api_Key"
                                placeholder={props.newDefinedAccount} value={userDefinedname} onChange={(e) => setuserDefinedname(e.target.value)} required />
                        </div>
                        <div className="row">
                            {
                                iserror ? <div className={`alert mt-4 alert-danger ${styles.error_key} col-lg-11 col-sm-11 col-11 mx-auto d-flex justify-content-between`}>
                                    <p className={styles.error_para}><span>{error ? error : "Something Went Wrong"}</span></p>
                                    <a className={styles.error_anchor} onClick={() => hideError()}><span><img className={styles.error_crypto} src={imageHost + "/cross-icon.png"} alt="" /></span></a>
                                </div> : <div className='d-none'></div>
                            }
                            <div className={`col-sm-12 col-xl-6 ${styles.oauth} pe-0 text-center`}>
                                <div className={`${styles.description} text-center`}>
                                    <h2 className={styles.description_head}>Continue with {props.parsedAccount.accountDisplayName}</h2>
                                </div>
                                <p className={`${styles.description_para_mobile} mb-3`}><span>Note:</span>This will redirect you to the {props.parsedAccount.accountDisplayName} website.Sign in and give access authrization to crptm.Once done you will be redirected back to CRPTM.</p>
                                <div className={`border border-1 position-relative mt-5 w-50 ms-auto m-auto ${styles.fake_div} text-center`}>
                                    <img className={`${styles.oauth_image} position-absolute px-2 bg-white`} src={imageHost + "/oauth-img.svg"} alt="" />
                                    <br />
                                    <div className={`bg-white px-1 ${styles.oauth_btn_div}`}>
                                        {isloaderoauth === "idle" || isloaderoauth === "completed" || isloaderoauth === "error" ? <button onClick={() => setSendRequestoauth(true)} type="submit"
                                            className={`btn btn_success px-4 ${styles.oauth_button}`}>Connect</button> : <img className={styles.loader_connect} src={imageHost + '/loader2.gif'} alt="loader" />}
                                    </div>
                                </div>
                                <p className={`${styles.description_para_desktop} pe-3`}><span>Note:</span>This will redirect you to the {props.parsedAccount.accountDisplayName} website.Sign in and give access authrization to crptm.Once done you will be redirected back to CRPTM.</p>
                            </div>
                            <div className={styles.next_row}>
                                <hr className={styles.hr} />
                                <div className='text-center w-100 position-relative'><h4 className={`${styles.or} ms-auto position-absolute bg-white`}>OR</h4></div>
                            </div>
                            <div className={`${styles.content_api} ${styles.content_api_2} mt-5 col-xl-5`}>
                                <h2 className={styles.import_header}>Connect using API Key/secret</h2>
                                <form className="form-group" onSubmit={submitForm}>
                                    <div>
                                        <label className={styles.content_api_label}>API Key</label>
                                        <input type="any" className="form-control mb-2" autoComplete='off' name="apiKey" id="api_Key"
                                            placeholder="* * * * * * * * * * *" value={apikey} onChange={(e) => setApikey(e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className={`${styles.content_api_label} mt-2`}>API Secret</label>
                                        <input type="any" className="form-control" name="apiSecret" id="api_secret"
                                            placeholder="* * * * * * * * * * *" value={apisecret} onChange={(e) => setApisecret(e.target.value)} required />
                                    </div>
                                    {isloaders2s === "idle" || isloaders2s === "completed" || isloaders2s === "error" ? <button type="submit"
                                        className={`btn ${styles.btn_connect} ${styles.btn_success} mt-5`}>Connect</button> : <img className={`${styles.loader_connect}  mt-5`} src={imageHost + '/loader2.gif'} alt="loader" />}
                                </form>
                            </div>

                        </div>
                        <p className={`${styles.content_api_para} text-center mb-4`}><span>CRPTM</span> uses a secure, read-only access for connecting
                            to {props.parsedAccount.accountDisplayName}.
                            <a className={styles.api_anchor_both} target="_blank" href={"/integrations/" + props.parsedAccount.accountNameInLC}>Follow the instructions from the {props.parsedAccount.accountDisplayName} support</a> Site
                            for obtaining the key and Secret need to connect to {props.parsedAccount.accountDisplayName}</p>
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

export default BothValid
