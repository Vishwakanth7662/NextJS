import React, { useEffect, useState } from 'react'
import axios from 'axios';
let joinURL: any;
import { parseCookies, setCookie, destroyCookie } from 'nookies'
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
        return function getRequest(apiUrl: String, params: any | null): any {
            const url: any = apiUrl;
            return new Promise((resolve, reject) => {
                axios.get(url)
                    .then(res => {
                        console.log("IN Mainservice");
                        // console.log(res)
                        resolve(res)
                    })
                    .catch(err => {
                        console.log("In error mainservice");
                        console.log(err.response.status);
                        // console.log(err)
                        if (err.response.status === 401) {
                            console.log("In 401");
                            window.location.href = "/login"
                        }
                        reject(err.response)
                    })
            })

        }
    }
    if (method === "post") {
        return function postRequest(apiEndpoint: string, data: any | null, params: any | null) {
            const url = apiEndpoint;
            return new Promise((resolve, reject) => {
                axios.post(url, data, config)
                    .then(res => {
                        resolve(res)
                    })
                    .catch(err => {
                        console.log("In error mainservice");
                        console.log(err.response.status);
                        // console.log(err)
                        if (err.response.status === 401) {
                            console.log("In 401");
                            window.location.href = "/login"
                        }
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

    // function postRequest(apiUrl: String, data: any | null, type: String, params: any | null): any {
    //     if (type === "user") {
    //         domain = process.env.NEXT_PUBLIC_BASEURL!
    //     } else if (type === "ups") {
    //         domain = process.env.NEXT_PUBLIC_UPSBASEURL!
    //     } else if (type === "tax") {
    //         domain = process.env.NEXT_PUBLIC_TAXURL!
    //     }
    //     const url = joinURL(domain, apiUrl)
    //     return new Promise((resolve, reject) => {
    //         axios.post(url, data, getNormalConfig(params))
    //             .then(res => {
    //                 // (res)
    //                 resolve(res)
    //             })
    //             .catch(err => {
    //                 (err)
    //                 reject(err.response)
    //             })
    //     })

    // }
    // function noConfigPostRequest(apiUrl: String, data: any | null, type: String, params: any | null): any {
    //     if (type === "user") {
    //         domain = process.env.NEXT_PUBLIC_BASEURL!
    //     } else if (type === "ups") {
    //         domain = process.env.NEXT_PUBLIC_UPSBASEURL!
    //     } else if (type === "tax") {
    //         domain = process.env.NEXT_PUBLIC_TAXURL!
    //     }
    //     const url = joinURL(domain, apiUrl)
    //     return new Promise((resolve, reject) => {
    //         axios.post(url, data)
    //             .then(res => {
    //                 resolve(res)
    //             })
    //             .catch(err => {
    //                 (err)
    //                 reject(err.response)
    //             })
    //     })
    // }
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
    if (method === "delete"){
        console.log("Delete in mainservice");
       return function deleteRequest(apiUrl: String|any, data: any | null, params: any | null): any {
            const url = apiUrl;
            console.log(url);
            return new Promise((resolve, reject) => {
                axios.delete(url)
                    .then(res => {
                        console.log(res)
                        resolve(res)
                    })
                    .catch(err => {
                        console.log(err.response.status);
                        // console.log(err)
                        if (err.response.status === 401) {
                            console.log("In 401");
                            window.location.href = "/login"
                        }
                        reject(err.response)
                    })
            })
        }
    }

    // console.log(accessResponse + " accessResponse");
    return (
        <div>MainService</div>
    )
}

export default MainService