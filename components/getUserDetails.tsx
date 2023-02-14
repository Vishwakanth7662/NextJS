import React from 'react'
import MainService from '../services/main-service'

function GetUserDetails(tokens: any) {
    let mainServiceGet: any = MainService('get');
    return new Promise(async (resolve, reject) => {
        try {
            let res = await mainServiceGet('details', 'user', null, tokens)
            resolve(res.data)
        }
        catch (e: any) {
            reject(e);
        }
    }

    )
}

export default GetUserDetails