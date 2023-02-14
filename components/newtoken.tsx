import nookies from 'nookies';
import axios from 'axios';

export default function newToken(tokens: any) {
    console.log("New Token called");
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
            console.log(data);
            console.log("New data");
            resolve(data);
        }).catch((e: any) => {
            console.log(e);
            reject(e.response)
        })
    })
}

function joinURL(baseUrl: String, mainUrl: String) {
    return `${baseUrl}/${mainUrl}`;
}
