import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

function userAccounts(token: any) {
    let normalConfig = {
        headers: {
            Authorization: 'Bearer ' + token,
            "Content-Type": "application/json"
        }
    }
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:8082/api/v1/ups/user/accounts', normalConfig)
            .then(res => {
                console.log('abc');
                console.log(res)
                resolve(res)
            })
            .catch(err => {
                console.log('def')
                console.log(err)
                reject(err.response)
            })
    })
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method !== 'GET') {
        res.status(405).json({ message: 'Invalid Method' })
    }
    console.log(req.body);
    let tokens: any = req.cookies.accessTokens;
    let accessToken = JSON.parse(tokens).access_token;
    console.log(accessToken);
    await userAccounts(accessToken).then((abc: any) => {
        console.log(abc);
        if (!res.headersSent) {
            res.status(200).json(abc.data);
        }
    }).catch((e: any) => {
        console.log("ERROR");
        console.log(e);
        if (!res.headersSent) {
            res.status(e.status).json(e.data ? e.data : { data: { error: { message: 'Something Went Wrong!' } } });
        }
    });
    console.log("RUKAA");
}