
import style from '../styles/pricing/payment.module.scss'
import getInsideAllPromiseFunction from '../components/getInsideAllServerPromise';
import getCurrenturl from '../components/currentUrlCheck';
import nookies from 'nookies';
import MainService from '../services/main-service'

let mainServicePost: any = MainService('post');

function payResponse(tokens: any | null, context: any | null) {
    let reqBody = {
        paymentIntentId: context.query.paymentIntentId,
        paymentStatus: context.query.status,
        errorCode: context.query.errorCode,
        errorMsg: context.query.errorMsg
    }
    return new Promise(async (resolve, reject) => {
        try {
            let res = await mainServicePost('pay/response', 'user', reqBody, null, tokens);
            if (res.data) {
                nookies.set(context, 'paymentDetails', JSON.stringify(res.data), {
                    path: '/',
                    maxAge: 3600,
                });
            }
            resolve(res);
        }
        catch (e: any) {
            reject(e);
        }
    })
}

async function getData(tokens: any, context: any, fnsArr: any[]) {
    let storePromise = await getInsideAllPromiseFunction(tokens, context, fnsArr)
    console.log("StorePromise props");
    console.log(storePromise.props);
    let response = storePromise.props ? storePromise.props[0].value : null;
    if (response) {
        return {
            redirect: {
                destination: '/pay-success',
                permanent: false,
            }
        }
    }
    else {
        return {
            redirect: {
                destination: '/pay-error',
                permanent: false,
            }
        }
    }
}

export async function getServerSideProps(context: any) {
    const cookies = nookies.get(context);
    getCurrenturl(context);
    let fnsArr = [payResponse]
    let storePromise = await getData(cookies.accessTokens, context, fnsArr)
    return storePromise
}

function ProcessingPay() {
    var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;

    return (
        <>
            <div className={`text-center w-100 d-md-flex justify-content-center align-items-center ${style.paymentLoader}`}>
                <img className="img-fluid" src={imageHost + '/processing-loader.gif'} alt="loading" />
                <p>Please wait while we process your
                    request. This may take several
                    minutes. Please do not refresh or
                    close your browser. Thank you!</p>
            </div>
        </>
    )
}

export default ProcessingPay;