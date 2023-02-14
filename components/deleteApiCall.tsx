import axios from 'axios';

export default function getApiCall(token: any, endPoint: string, type: string,params:any|null) {
    let baseUrl: any;
    if (type === 'ups')
        baseUrl = process.env.NEXT_PUBLIC_UPSBASEURL!;
    else if (type === 'user')
        baseUrl = process.env.NEXT_PUBLIC_BASEURL!;
    console.log("IN delete API CALL")
    let tokens = JSON.parse(token).access_token;
    let normalConfig = {
        headers: {
            Authorization: 'Bearer ' + tokens,
            "Content-Type": "application/json"
        },
        params:params
    }
    return new Promise((resolve, reject) => {
        console.log("Normal config");
        
        console.log(normalConfig);
        
        axios.delete(`${baseUrl}/${endPoint}`, normalConfig)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err.response)
            })
    })
}
