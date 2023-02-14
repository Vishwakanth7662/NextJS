import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import postApiCall from "../../../../components/postApiCall";
const http = require('http');

function joinURL(baseUrl: String, mainUrl: String) {
    return `${baseUrl}/${mainUrl}`;
}

function newToken(tokens: any) {
    let domain: String = process.env.NEXT_PUBLIC_BASEURL!;
    let data: any;
    let refreshToken: any = JSON.parse(tokens).refresh_token;
    console.log(refreshToken);
    let apiUrl = `oauth/token?grant_type=refresh_token&refresh_token=${refreshToken}`
    const url = joinURL(domain, apiUrl)
    return new Promise((resolve, reject) => {
        axios.post(url, null, {
            headers: {
                Authorization: `Basic ` + process.env.NEXT_PUBLIC_CLIENT_OAUTH_DETAILS!
            }
        }).then((res: any) => {
            data = res.data;
            console.log("New data");
            resolve(data);
        }).catch((e: any) => {
            reject(e.response)
        })
    })
}

function getData(tokens: any, url: any | null, param: any | null, body: any | null) {
    let apiCall = postApiCall(tokens, "get/txns", body, 'ups');
    let sendRes: {
        status: number,
        data: any,
        newToken: any
    }

    return new Promise((resolve, reject) => {
        apiCall.then((abc: any) => {
            console.log(abc);
            sendRes = {
                status: 200,
                data: abc.data,
                newToken: tokens
            }
            resolve(sendRes);
        }).catch(async (e: any) => {
            if (e.status === 401) {
                console.log("401 error")
                await newToken(tokens).then(async (response: any) => {
                    console.log("INSIDE NEW TOKEN'S RESPONSE")
                    console.log(response);
                    await getData(JSON.stringify(response), null, null, null).then(resolve).catch(reject);
                }).catch((e: any) => {
                    let resCode = e.status;
                    console.log(e.status)
                    if (e.status === 400)
                        resCode = 401
                    sendRes = {
                        status: resCode,
                        data: e.data,
                        newToken: tokens
                    }
                    console.log("Redirct to login");
                    reject(sendRes)
                })
            } else {
                sendRes = {
                    status: e.status,
                    data: e.data,
                    newToken: tokens
                }
                reject(sendRes);
            }
        });
    })
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    let data = req.body;
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Invalid Method' })
        return
    }
    let tokens: any = req.cookies.accessTokens;
    await getData(tokens, null, null, data).then((response: any) => {
        console.log("Response")
        res.setHeader('Set-Cookie', [`tokens=${response.newToken}; Max-Age=3600; Path=/; HttpOnly`]);
        res.status(200).json(response.data);
        return
    }).catch(async (e: any) => {
        console.log("Error");
        console.log(e);
        res.status(e.status).json(e.data ? e.data : { data: { error: { message: 'Something Went Wrong!' } } });
        return
    })
}