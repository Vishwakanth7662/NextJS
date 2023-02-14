import check401 from '../components/401-check';
import nookies from 'nookies';

async function getInsideAllPromiseFunction(tokens: any, context: any, fnsArr: any[]) {
    let fnArray: any[] = [];
    fnsArr.forEach((fn: any) => {
        fnArray.push(fn(tokens, context))
    })
    let storePromise: any = await Promise.allSettled(fnArray).then(async result => {
        try {
            let status200 = false;
            let status500 = false;
            let status401 = false;
            result.forEach((element: any) => {
                if (element.status === "fulfilled") {
                    status200 = true
                } else {
                    if (element.reason.response.status === 401) {
                        status401 = true;
                        return
                    } else {
                        status500 = true
                    }
                }
            })
            if (status401) {
                let response = await check401(tokens)
                if (response?.login) {
                    console.log("In the 401 before login");
                    Object.keys(nookies.get(context)).forEach(key => {
                        nookies.destroy(context, key)
                    });
                    return {
                        redirect: {
                            destination: "/login",
                            permanent: false
                        }, props: undefined
                    }
                }
                nookies.destroy(context, "accessTokens")
                nookies.set(context, 'accessTokens', JSON.stringify(response?.token), {
                    path: '/',
                    maxAge: 3600,
                });
                let serverResponse: any = await getInsideAllPromiseFunction(JSON.stringify(response?.token), context, fnsArr)
                return serverResponse
            }
            else if (status500) {
                return {
                    redirect: {
                        destination: "/error-500",
                        permanent: false
                    },
                    props: undefined
                }
            }
            return {
                props: result
            }
        }
        catch (e: any) {
            console.log(e);
            return {
                redirect: {
                    destination: "/error-500",
                    permanent: false
                },
                props: undefined
            }
        }
    })
    return storePromise
}
export default getInsideAllPromiseFunction