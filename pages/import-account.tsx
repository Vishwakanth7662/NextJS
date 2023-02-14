import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import BothValid from '../components/importAccount/both-valid';
import Oauth from '../components/importAccount/oauth-import';
import S2s from '../components/importAccount/s2s-import';
import S2sPassPhrase from '../components/importAccount/s2s-passphrase';

const Import = () => {
    const router = useRouter();
    const [linkaccount, setlinkaccount] = useState("");
    const [newDefinedAccount, setnewDefinedAccount] = useState("")
    const [previousAccount, setPreviousAccount] = useState("")

    const state: any = router.query;
    console.log(state);
    const account = state.account;
    const newAccountMap = state.totalNoAcc;
    console.log(account);

    // Parsing the data because query always get string
    let parsedAccount: any;
    try {
        parsedAccount = JSON.parse(account);
    } catch (error) {
        parsedAccount = {};
    }

    let flowType: any = [];
    if (parsedAccount === null || parsedAccount === undefined) {
        console.log("abc");
    }
    else {
        flowType = parsedAccount.supportedFlowType ? parsedAccount.supportedFlowType: ['S2S','OAUTH']
    }

    let parsedMap: any;
    try {
        parsedMap = new Map(JSON.parse(newAccountMap));
    } catch (error) {
        parsedMap = new Map();
    }
    console.log(parsedMap);
    console.log(parsedAccount);

    // Get the num value for account Number
    function gettingNewValue() {
        let num: number = 0;
        let newAccount: any;
        if (newAccount === null || newAccount === undefined) {
            num = (parsedMap.get(parsedAccount.account));
            if (num === null || num === undefined) num = 0;
            newAccount = parsedAccount.account + "_" + (Number(num) + 1)
            // parsedAccount.newAccount = parsedAccount.account.account + "_" + (Number(num) + 1)
            setnewDefinedAccount(newAccount);
        } else {
            setnewDefinedAccount(newAccount);
        }
    }
    useEffect(() => {
        gettingNewValue();
    }, [parsedAccount]);
    console.log(flowType);
    if (`${parsedAccount.supportedFlowType}` == "OAUTH") {
        return (
            <Oauth newDefinedAccount={newDefinedAccount} parsedAccount={parsedAccount} />
        )
    } else if (`${parsedAccount.supportedFlowType}` == "S2S") {
        return (
            <S2s linkaccount={linkaccount} newDefinedAccount={newDefinedAccount} parsedAccount={parsedAccount} />
        )
    } else if (`${parsedAccount.supportedFlowType}` == "S2S_PASSPHRASE") {
        return (
            <S2sPassPhrase linkaccount={linkaccount} newDefinedAccount={newDefinedAccount} parsedAccount={parsedAccount} />
        )
    }
    else if (flowType.includes("S2S") && flowType.includes("OAUTH")) {
        return (<BothValid linkaccount={linkaccount} newDefinedAccount={newDefinedAccount} parsedAccount={parsedAccount} />)
    } else {
        return (<h1>Error</h1>)
    }
}

export default Import