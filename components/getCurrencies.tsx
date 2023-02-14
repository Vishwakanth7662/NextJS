import React from 'react'
import MainService from '../services/main-service';

function getCurrencies(crypto: any, tokens: any) {
    let url = "search/currency/" + crypto;
    let mainservice: any = MainService("get");
    return new Promise(async (resolve, reject) => {
        try {
            let res = await mainservice(url, 'ups', null, tokens);
            resolve(res.data)
        }
        catch (e: any) {
            reject(e);
        }
    })
}

export default getCurrencies