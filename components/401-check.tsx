import getTokens from "../components/newtoken";
import nookies from 'nookies'

export default async function check401(tokens: any) {
    // let redirect: boolean = false;
    return await getTokens(tokens).then((res: any) => {
        console.log("In 401");
        return {
            "retry": true,
            "login": false,
            "token": res
        }
    }).catch((e: any) => {
        console.log("Redirct to login");
        return {
            "retry": false,
            "login": true,
            "token": {}
        }
    })
}







