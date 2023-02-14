import getTokens from "../components/newTokenClient";
import Cookies from 'js-cookie';

export default async function check401Client(e: any) {
    console.log(e);
    console.log("401 error");
    let redirect: boolean = false;
    let answer: any;
    let error: any;
    await getTokens().then((res: any) => {
        console.log(res);
        Cookies.remove('accessTokens');
        Cookies.set('accessTokens', JSON.stringify(res), { maxAge: 3600, path: '/' });
        answer = 'Hit again';
    }).catch((e: any) => {
        error = 'redirect to login';
        console.log("Redirct to login");
        redirect = true;
    })
    if (redirect) {
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        }
    }
    else {
        return new Promise((resolve, reject) => {
            if (answer)
                resolve(answer);
            if (error)
                reject(error);
        })
    }
}