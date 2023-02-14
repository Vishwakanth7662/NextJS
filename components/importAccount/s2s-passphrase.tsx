
import React, { useEffect, useState } from 'react';
import { iosInformationOutline } from 'react-icons-kit/ionicons/iosInformationOutline'
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
    "passphrase": "",
    "uniqueAccountName": null
}
var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;
const S2sPassPhrase = (props: any) => {
    const router = useRouter();
    const [sendRequest, setSendRequest] = useState(false);
    const [apikey, setApikey] = useState("");
    const [apisecret, setApisecret] = useState("");
    const [passphrase, setpassphrase] = useState("");
    const [userDefinedname, setuserDefinedname] = useState("");
    const [error, setError] = useState("");
    const [iserror, setisError] = useState(false);
    const [key, setKey] = useState({});
    const [isloaders2s, setisloaders2s] = useState('idle');

    // Making connect s2s call
    const ueConnectUrl = async () => {
        const clientservice :any = ClientService("post");
        setisloaders2s('inprogress');
        if (userDefinedname === "") {
            bodyOfConnectReq.userDefinedAccountName = props.newDefinedAccount;
        } else {
            bodyOfConnectReq.userDefinedAccountName = userDefinedname;
        }
        bodyOfConnectReq.uniqueAccountName = props.newDefinedAccount.uniqueAccName;
        console.log(bodyOfConnectReq);

        try {
            const abc = await clientservice('/api/v1/import-account/connectRequest', bodyOfConnectReq, 'ups', null);
            if (abc.data.error == null && abc.data.uaConnectStatus == "CONNECTED") {
                router.push(`/add-account?status=connected&account=${abc.data.accountNameInLC}&accountDisplay=${abc.data.accountDisplayName}&uniqueaccountname=${abc.data.uniqueAccountName}&userdefinedName=${abc.data.userDefinedAccountName}`);
                setisloaders2s('completed');
            } else {
                setisloaders2s('error');
                const errorconnected = abc.data.error.message;
                setError(errorconnected);
                setisError(true);
            }
        }
        catch (e: any) {
            setisloaders2s('error');
            setError(e.data.error.message);
            setisError(true);
        }

    }
    const hideError = () => setisError(false);

    useEffect(() => {
        if (sendRequest) {
            ueConnectUrl();
            setSendRequest(false);
        }
    }, [sendRequest]);
    const submitForm = (e: any) => {
        e.preventDefault();
        const newEntry = { apiKey: apikey, apiSecret: apisecret, passphrase: passphrase, userDefinedAccountName: userDefinedname };
        setKey({ newEntry });
        setSendRequest(true);
    }
    bodyOfConnectReq.account = props.parsedAccount.account;
    bodyOfConnectReq.flowType = "S2S_PASSPHRASE";
    bodyOfConnectReq.apiKey = apikey;
    bodyOfConnectReq.apiSecret = apisecret;
    bodyOfConnectReq.passphrase = passphrase;
    bodyOfConnectReq.userDefinedAccountName = userDefinedname;
    bodyOfConnectReq.uniqueAccountName = props.newDefinedAccount.uniqueAccName;;
    return (
        (
            <div className="d-lg-flex justify-content-between">
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
                            <div className="row">
                                {
                                    iserror ? <div className={`alert mt-4 alert-danger ${styles.error_key} col-lg-11 col-sm-11 col-11 mx-auto d-flex justify-content-between`}>
                                        <p className={styles.error_para}><span>{error}</span></p>
                                        <a className={styles.error_anchor} onClick={() => hideError()}><span><img className={styles.error_crypto} src={imageHost + "/cross-icon.png"} alt="" /></span></a>
                                    </div> : <div className='d-none'></div>
                                }
                                <div className={`${styles.content_api} col-lg-6`}>
                                    <form className="form-group" onSubmit={submitForm}>
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
                                                placeholder={props.newDefinedAccount} value={userDefinedname} onChange={(e) => setuserDefinedname(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={styles.content_api_label}>API Key</label>
                                            <input type="any" className="form-control mb-2" autoComplete='off' name="apiKey" id="api_Key"
                                                placeholder="* * * * * * * * * * *" value={apikey} onChange={(e) => setApikey(e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className={styles.content_api_label}>API Secret</label>
                                            <input type="any" className="form-control" name="apiSecret" id="api_secret"
                                                placeholder="* * * * * * * * * * *" value={apisecret} onChange={(e) => setApisecret(e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className={styles.content_api_label}>Passphrase</label>
                                            <input type="any" className="form-control" name="passphrase" id="passphrase"
                                                placeholder="* * * * * * * * * * *" value={passphrase} onChange={(e) => setpassphrase(e.target.value)} required />
                                        </div>
                                        <p className={styles.content_api_para}><span>CRPTM</span> uses a secure, read-only access for connecting
                                            to {props.parsedAccount.account.accountDisplayName}. &nbsp;
                                            <a className={styles.content_api_anchor} target="_blank" href={"/integrations/" + props.parsedAccount.accountNameInLC}>Need help? Follow our <span className={styles.text_purple}>step by step guide</span> to connect with {props.parsedAccount.accountDisplayName}
                                            </a> </p>
                                        {isloaders2s === "idle" || isloaders2s === "completed" || isloaders2s === "error" ? <button type="submit"
                                            className={`btn ${styles.btn_connect} ${styles.btn_success}`}>Connect</button> : <img className={styles.loader_connect_s2s} src={imageHost + '/loader2.gif'} alt="loader" />}
                                    </form>
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
    )
}

export default S2sPassPhrase