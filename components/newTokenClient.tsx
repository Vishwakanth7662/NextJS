import nookies from 'nookies';
import axios from 'axios';
import Cookies from 'js-cookie';
import Router, { useRouter } from 'next/router';

export default function newTokenClient() {
    const router = useRouter()
    console.log("New Token called");
    let domain: String = process.env.NEXT_PUBLIC_BASEURL!;
    let tokenss = Cookies.get('accessTokens');
    let parsedTokens: any;
    if (tokenss)
        parsedTokens = JSON.parse(tokenss);
    else
        router.push('/login')
    let data: any;
    console.log(tokenss);
    let refreshToken: any = parsedTokens.refresh_token;
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
