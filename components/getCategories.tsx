import React from 'react'
import MainService from '../services/main-service';

function getCategories(cat: any, tokens: any) {
    let url = "search/category/" + cat;
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

export default getCategories