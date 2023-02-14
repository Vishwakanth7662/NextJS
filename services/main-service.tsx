import React, { useEffect, useState } from 'react'
import axios from 'axios';
let joinURL: any;
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import Cookies from 'js-cookie'

let accessResponse: any;
const MainService = (method: string) => {
    let domain: String
    let config = {
        headers: {
            Authorization: `Basic ` + process.env.NEXT_PUBLIC_CLIENT_OAUTH_DETAILS!
        }
    };
    function joinURL(baseUrl: String, mainUrl: String) {
        return `${baseUrl}/${mainUrl}`;
    }
    function getNormalConfig(tokens: any | null) {
        console.log("NORMAL CONFIG")
        console.log(tokens);
        if (tokens) {
            let normalConfig = {
                headers: {
                    Authorization: 'Bearer ' + JSON.parse(tokens).access_token,
                    "Content-Type": "application/json"
                }
            };
            console.log(normalConfig);
            return normalConfig;
        }
        else {
            let normalConfig = {
                headers: {
                    Authorization: 'Bearer ' + '',
                    "Content-Type": "application/json"
                }
            };
            console.log(normalConfig);
            return normalConfig;
        }
    }
    if (method === "get") {
        return function getRequest(apiUrl: String, type: String, params: any | null, tokens: any | null): any {
            console.log(tokens);
            if (type === "user") {
                domain = process.env.NEXT_PUBLIC_BASEURL!
            } else if (type === "ups") {
                domain = process.env.NEXT_PUBLIC_UPSBASEURL!
            } else if (type === "tax") {
                domain = process.env.NEXT_PUBLIC_TAXURL!
            }
            const url = joinURL(domain, apiUrl)
            return new Promise((resolve, reject) => {
                axios.get(url, getNormalConfig(tokens))
                    .then(res => {
                        // console.log(res)
                        resolve(res)
                    })
                    .catch(err => {
                        // console.log(err)
                        reject(err)
                    })
            })

        }
    }
    if (method === "noTokenGet") {
        return function noTokenGetRequest(apiUrl: String, type: String, params: any | null): any {
            if (type === "user") {
                domain = process.env.NEXT_PUBLIC_BASEURL!
            } else if (type === "ups") {
                domain = process.env.NEXT_PUBLIC_UPSBASEURL!
            } else if (type === "tax") {
                domain = process.env.NEXT_PUBLIC_TAXURL!
            }
            const url = joinURL(domain, apiUrl)
            return new Promise((resolve, reject) => {
                axios.get(url)
                    .then(res => {
                        // console.log(res)
                        resolve(res)
                    })
                    .catch(err => {
                        // console.log(err)
                        reject(err)
                    })
            })

        }
    }
    if (method === "post") {
        return function postRequest(apiEndpoint: string, type: String, data: any | null, params: any | null, tokens: any | null) {
            if (type === "user") {
                domain = process.env.NEXT_PUBLIC_BASEURL!
            } else if (type === "ups") {
                domain = process.env.NEXT_PUBLIC_UPSBASEURL!
            }
            const url = joinURL(domain, apiEndpoint);
            return new Promise((resolve, reject) => {
                axios.post(url, data, getNormalConfig(tokens))
                    .then(res => {
                        resolve(res)
                    })
                    .catch(err => {
                        console.log(err);
                        // if (err.message === "Request failed with status code 401") {
                        //     window.location.href = '/session-expired';
                        // }
                        // if (err.message === "Network Error") {
                        //     window.location.href = '/network-error';
                        // }
                        // if (err.message === "Request failed with status code 403") {
                        //     window.location.href = '/access-denied';
                        // }
                        reject(err.response)
                    })
            })
        }
    }


    function noConfigGetRequest(apiUrl: String, data: any | null, type: String, params: any | null): any {
        if (type === "user") {
            domain = process.env.NEXT_PUBLIC_BASEURL!
        } else if (type === "ups") {
            domain = process.env.NEXT_PUBLIC_UPSBASEURL!
        } else if (type === "tax") {
            domain = process.env.NEXT_PUBLIC_TAXURL!
        }
        const url = joinURL(domain, apiUrl)
        return new Promise((resolve, reject) => {
            axios.get(url)
                .then(res => {
                    // (res)
                    resolve(res)
                })
                .catch(err => {
                    (err)
                    reject(err.response)
                })
        })
    }

    if (method === "SignUp") {
        console.log("Entered signup function");
        return function postRequestWithoutAccessToken(apiUrl: String, data: any | null, type: String, params: any | null): any {
            console.log("Entered signup function 2");
            if (type === "user") {
                console.log(process.env.NEXT_PUBLIC_BASEURL);
                domain = "http://localhost:8080/api/v1/user";
            } else if (type === "ups") {
                domain = process.env.NEXT_PUBLIC_UPSBASEURL!
            } else if (type === "tax") {
                domain = process.env.NEXT_PUBLIC_TAXURL!
            }
            const url = joinURL(domain, apiUrl)
            console.log(domain);
            console.log(apiUrl);
            return new Promise((resolve, reject) => {
                axios.post(url, data)
                    .then(res => {
                        console.log(res)
                        resolve(res)
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err.response)
                    })
            })

        }
    }
    function deleteRequest(apiUrl: String, data: any | null, type: String, params: any | null): any {
        if (type === "user") {
            domain = process.env.NEXT_PUBLIC_BASEURL!
        } else if (type === "ups") {
            domain = process.env.NEXT_PUBLIC_UPSBASEURL!
        } else if (type === "tax") {
            domain = process.env.NEXT_PUBLIC_TAXURL!
        }
        const url = joinURL(domain, apiUrl)
        console.log(url);
        return new Promise((resolve, reject) => {
            axios.delete(url, getNormalConfig(params))
                .then(res => {
                    console.log(res)
                    resolve(res)
                })
                .catch(err => {
                    (err)
                    reject(err.response)
                })
        })
    }


    if (method === "getUserDetails") {
        let mainServiceGet: any = MainService("get");
        async function getUserDetail(tokens: any) {
            try {
                let response = await mainServiceGet('details', 'user', null, tokens);
                console.log(response);
                setCookie(null, 'user', JSON.stringify(response.data), {
                    maxAge: 30 * 24 * 60 * 60,
                    path: '/',
                })
                setCookie(null, 'address', JSON.stringify(response.data.address), {
                    maxAge: 30 * 24 * 60 * 60,
                    path: '/',
                })
            }
            catch (e) {
                console.log(e);
            }
        }
    }

    console.log(accessResponse + " accessResponse");
    return (
        <div>MainService</div>
    )
}

export default MainService