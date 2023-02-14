import axios from 'axios';

export default function postApiCall(token: any, endPoint: string, data: any, type: string) {
    let baseUrl: any;
    if (type === 'ups')
        baseUrl = process.env.NEXT_PUBLIC_UPSBASEURL!;
    else
        baseUrl = process.env.NEXT_PUBLIC_BASEURL!;
    console.log("TOKEN RECIEVED BY POSTAPICALL")
    console.log(token)
    let tokens = JSON.parse(token).access_token;
    let normalConfig = {
        headers: {
            Authorization: 'Bearer ' + tokens,
            "Content-Type": "application/json"
        }
    }
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/${endPoint}`, data, normalConfig)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err.response)
            })
    })
}