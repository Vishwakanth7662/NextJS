
import { CardElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import CheckoutForm from '../components/paymentComponents/checkoutForm';
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react';
import PaymentPlans from '../components/paymentComponents/paymentPlan';
import RightFeed from '../components/shared/right-feed';
import LeftFeed from '../components/shared/left-feed';
import { useRouter } from 'next/router';
import MainService from '../services/main-service'
import ClientSide from '../services/main-serviceClient'
import getInsideAllPromiseFunction from '../components/getInsideAllServerPromise';
import getCurrenturl from '../components/currentUrlCheck';
import nookies from 'nookies';
import style from '../styles/pricing/payment.module.scss'

let mainServicePost: any = MainService('post');

function getDetails(tokens: any | null, context: any | null) {
    let cookies = nookies.get(context);
    let paymentIntentId = cookies.paymentIntentId;
    return new Promise(async (resolve, reject) => {
        try {
            let res = await mainServicePost('details', 'ups', { "paymentIntentId": paymentIntentId }, null, tokens);
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
    let details = response ? response.data : {};
    return {
        props: {
            details: details
        }
    }
}

export async function getServerSideProps(context: any) {
    const cookies = nookies.get(context);
    getCurrenturl(context);
    let fnsArr = [getDetails]
    let storePromise = await getData(cookies.accessTokens, context, fnsArr)
    return storePromise
}

function Payment(props: any) {
    let router = useRouter();
    let starterAddOn: any[] = ['5000 Transactions', 'Tax analysis', 'Form 8948, Schedule D'];
    let standardAddOn: any[] = ['Unlimited Transactions', 'Tax analysis', 'Form 8948, Schedule D', 'Tax summary by exchanges/wallets'];

    var [option1, setOption1] = useState({
        clientSecret: "",
        theme: "stripe",
    });
    const [details, setDetails] = useState<any>();
    const [showLoader, setShowLoader] = useState(false);
    const [makePayment, setMakePayment] = useState(false);
    const [vendorKey, setVendorKey] = useState('');
    const [cardsArr, setCardsArr] = useState<any[]>([]);
    const [showPlan, setShowPlan] = useState(false);
    const [initiatePayLoader, setInitiatePayLoader] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('')
    const [paymentMethodId, setPaymentMethodId] = useState('');
    const [paymentVendor, setPaymentVendor] = useState('');
    const [selected, setSelected] = useState('');
    var stripePromise = vendorKey === '' ? null : loadStripe(vendorKey);
    const [cardPayLoader, setCardPay] = useState(false);
    const [returnUrl, setReturnUrl] = useState('');
    const [showError, setShowError] = useState(false);
    const [autoPay, setAutoPay] = useState("false");
    const [termsAgreed, setTermsAgreed] = useState(true);
    const [err, setErr] = useState<any>();
    const [alreadyChecked, setAlreadyChecked] = useState(true);
    const [disableUseCard, setDisableUseCard] = useState(false);
    const [showCardsSection, setShowCardsSection] = useState(true);

    let paymentIntentId = Cookies.get('paymentIntentId')!;
    let resObj = {
        "paymentIntentId": paymentIntentId,
        "paymentMethodId": paymentMethodId,
        "paymentMethod": paymentMethod,
        "paymentVendor": paymentVendor
    }
    console.log(resObj);

    var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;
    let clientSidePost: any = ClientSide('post');

    let isLoggedIn: boolean

    async function payResponse(paymentResponse: any) {
        try {
            let res = await clientSidePost('/api/v1/payment/payResponse', paymentResponse, null);
            console.log(res);
            Cookies.set('paymentDetails', JSON.stringify(res.data), { expires: 1, path: '/' });
            router.push('/pay-success');
        }
        catch (e: any) {
            console.log(e);
            setShowError(true);
            setErr(e.data.error.message);
        }
    }

    async function getDetails() {
        setDetails(JSON.parse(props.details.paymentIntentPOJO.metadata));
        setCardsArr(props.details.paymentMethodPOJOS);
        props.details.paymentMethodPOJOS.forEach((card: any) => {
            if (card.defaultPaymentMethod === 'USER_DEFAULT_PM') {
                console.log('yes')
                setPaymentMethodId(card.paymentMethodId);
                setPaymentMethod(card.paymentMethod);
                setPaymentVendor(card.paymentVendor)
            }
        })
    }

    async function initiateStripe() {
        setDisableUseCard(true);
        setInitiatePayLoader(true);
        try {
            let res = await clientSidePost('/api/v1/payment/initiateStripe', { "paymentIntentId": paymentIntentId, 'paymentMethod': 'CARD', "saveCardDetails": autoPay }, null);
            console.log(res);
            setInitiatePayLoader(false);
            clientSecret(res.data.clientSecret);
            setVendorKey(res.data.vendorKey);
            setReturnUrl(res.data.returnURL);
            setShowCardsSection(false);
            setMakePayment(true);
        }
        catch (e: any) {
            setInitiatePayLoader(false);
            console.log(e);
            setShowError(true);
            setErr(e.data.error.message);
            setDisableUseCard(false);
        }
    }

    function checkDefaultCard(cardObject: any) {

        if (cardObject.defaultPaymentMethod === 'USER_DEFAULT_PM') {
            return true;
        }

        else
            return false;
    }

    console.log(cardsArr);
    async function useCard() {
        setCardPay(true);
        try {
            let res = await clientSidePost('/api/v1/payment/useCards', resObj, null);
            console.log(res);
            payResponse({
                paymentIntentId: res.data.paymentIntentId,
                paymentStatus: res.data.paymentStatus
            })
        }
        catch (e: any) {
            console.log(e);
            setCardPay(false);
            setShowError(true);
            setErr(e.data.error.message);
        }
    }

    function clientSecret(clientSec: string) {
        setOption1({ clientSecret: clientSec, theme: "stripe", });
    }

    useEffect(() => {
        paymentIntentId = Cookies.get('paymentIntentId')!;
        getDetails();
    }, [])

    console.log(details);

    return (
        <>
            <div className="d-flex justify-content-between">
                <div className='d-none d-lg-block'>
                    <LeftFeed />
                </div>
                <div className='w-100'>
                    <>
                        {
                            cardPayLoader ?
                                <div className={`text-center d-flex justify-content-center align-items-center ${style.paymentLoader}`}>
                                    <img src={imageHost + '/processing-loader.gif'} alt="loading" />
                                    <p>Please wait while we process your
                                        request. This may take several
                                        minutes. Please do not refresh or
                                        close your browser. Thank you!</p>
                                </div>
                                :
                                <div className={`${style.paymentPage}`}>
                                    {
                                        showPlan ?
                                            <>
                                                <div className={`${style.selectedPlanPopup}`}>
                                                    <div className={`h-100 w-100 ${style.black} position-fixed`}></div>
                                                    <div className={`${style.plan} position-absolute`}>
                                                        <div className="position-relative">
                                                            <button onClick={() => { setShowPlan(false); window.scrollTo(0, 0); }} className={`${style.dismiss} position-absolute`}><img src={imageHost + '/close-plan-popup.svg'} alt="close popup" /></button>
                                                        </div>
                                                        <PaymentPlans details={details} />
                                                        <div className="d-flex justify-content-start mt-4">
                                                            <button onClick={() => { setShowPlan(false); window.scrollTo(0, 0); }} className={`${style.close} me-4`}>Close</button>
                                                            <button onClick={() => { router.push('/plans') }} className={`${style.changePlan}`}>Change Plan</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </> :
                                            <></>
                                    }

                                    {
                                        showLoader ?
                                            <>
                                                <div className={`text-center ${style.loaderDiv} h-100 w-100`}>
                                                    <img className='m-auto' src={imageHost + '/loader-small.gif'} alt="loading" />
                                                </div>
                                            </> :
                                            <>
                                                {
                                                    details ?
                                                        <>
                                                            {
                                                                details.planType === "ADD_ON" ?
                                                                    <>
                                                                        <div className={`${style.addOnPayment} container`}>
                                                                            <div className={`${style.mainHeading} position-relative mb-5`}>
                                                                                <hr />
                                                                                <div className={`${style.title} position-absolute text-center w-100`}>
                                                                                    <h2>Add-On Plan</h2>
                                                                                </div>
                                                                            </div>
                                                                            <div className={`${style.secondHead} d-flex justify-content-between align-items-center`}>
                                                                                <div className='me-3'>Activate Add Ons</div>
                                                                                <button onClick={() => { router.push('/add-on') }}>Modify</button>
                                                                            </div>
                                                                            <div className={`${style.subHead} mt-2`}>
                                                                                Unlock the access to enhanced portfolio features & tax reports at just <span>${details.paidPrice}</span>
                                                                            </div>
                                                                            <div className={`${style.featuresDiv} row row-cols-2 mt-3`}>
                                                                                {
                                                                                    details.yearsForAddon ?
                                                                                        <>
                                                                                            {
                                                                                                details.yearsForAddon.map((year: any) => {
                                                                                                    return (<b className={`${style.features} col d-flex mb-3`}><img className='me-2 img-fluid' src={imageHost + "/orange-tick.svg"} alt="" />{details.planDisplayName} for {year}</b>)
                                                                                                })
                                                                                            }
                                                                                        </> :
                                                                                        <></>
                                                                                }
                                                                                {
                                                                                    details.planName === 'STANDARD' ?
                                                                                        <>
                                                                                            {
                                                                                                standardAddOn.map((feature: any) => {
                                                                                                    return (<p className={`${style.features} col d-flex`}><img className='me-2 img-fluid' src={imageHost + "/orange-tick.svg"} alt="" /> {feature}</p>)
                                                                                                })
                                                                                            }
                                                                                        </> :
                                                                                        <>
                                                                                            {
                                                                                                details.planName === 'STARTER' ?
                                                                                                    <>
                                                                                                        {
                                                                                                            starterAddOn.map((feature: any) => {
                                                                                                                return (<p className={`${style.features} col d-flex`}><img className='me-2 img-fluid' src={imageHost + "/orange-tick.svg"} alt="" /> {feature}</p>)
                                                                                                            })
                                                                                                        }
                                                                                                    </> :
                                                                                                    <></>
                                                                                            }
                                                                                        </>
                                                                                }
                                                                            </div>
                                                                            <div className={`${style.termsConditions} mt-3`}>
                                                                                <div className={`${style.formSwitch} form-switch`}>
                                                                                    <input className={`${style.formCheckInput} form-check-input me-3`} checked={termsAgreed} onChange={(e) => { if (e.target.checked) { setTermsAgreed(true) } else { setTermsAgreed(false) } }} type="checkbox" role="switch" id="terms-conditions" />
                                                                                    By continuing, you agree to the <a href="/terms-of-use">terms and conditions</a>
                                                                                </div>
                                                                                <div className={`${style.formSwitch} form-switch mt-3`}>
                                                                                    <input className={`${style.formCheckInput} form-check-input me-3`} onChange={(e) => { if (e.target.checked) { setAutoPay('true') } else { setAutoPay('false') } }} type="checkbox" role="switch" id="auto-pay" />
                                                                                    Save Card
                                                                                </div>
                                                                            </div>
                                                                            <div className={`${style.paymentBlock} mt-3`}>
                                                                                {
                                                                                    showError ?
                                                                                        <div className={`${style.error} mb-4 ms-0`}>
                                                                                            <b>Payment Failed! &nbsp;</b>{err ? err : 'Something went wrong, Please try again'}
                                                                                        </div> :
                                                                                        <></>
                                                                                }
                                                                                {
                                                                                    makePayment ?
                                                                                        <>
                                                                                            <Elements stripe={stripePromise} options={option1}>
                                                                                                <CheckoutForm returnUrl={returnUrl} />
                                                                                            </Elements>
                                                                                        </> :
                                                                                        <>
                                                                                            {cardsArr.length === 0 || !showCardsSection ?
                                                                                                <></> :
                                                                                                <>
                                                                                                    <div className={`${style.cards} mt-3`}>
                                                                                                        {
                                                                                                            cardsArr.length !== 0 ?
                                                                                                                <>
                                                                                                                    <h3 className='mt-4 mb-4'>Pay Through Existing Card</h3>
                                                                                                                    {
                                                                                                                        cardsArr.map((cardObj: any) => {
                                                                                                                            return (
                                                                                                                                <>
                                                                                                                                    <div className={`row ${style.cardsDiv} position-relative pb-3 pt-4`}>
                                                                                                                                        {
                                                                                                                                            checkDefaultCard(cardObj) ?
                                                                                                                                                <input type="checkbox" className={`${style.checks} position-absolute`} checked={alreadyChecked ? true : selected === cardObj.paymentMethodId} onChange={(e) => { if (e.target.checked) { setAlreadyChecked(false); setSelected(cardObj.paymentMethodId); setPaymentMethodId(cardObj.paymentMethodId); setPaymentMethod(cardObj.paymentMethod); setPaymentVendor(cardObj.paymentVendor) } else { setAlreadyChecked(false); setSelected(''); setPaymentMethodId(''); setPaymentMethod(''); setPaymentVendor('') } }} name="" id="" /> :
                                                                                                                                                <input className={`${style.checks} position-absolute`} checked={selected === cardObj.paymentMethodId} onChange={(e) => { if (e.target.checked) { setAlreadyChecked(false); setSelected(cardObj.paymentMethodId); setPaymentMethodId(cardObj.paymentMethodId); setPaymentMethod(cardObj.paymentMethod); setPaymentVendor(cardObj.paymentVendor) } else { setAlreadyChecked(false); setSelected(''); setPaymentMethodId(''); setPaymentMethod(''); setPaymentVendor('') } }} type="checkbox" name="" id="" />
                                                                                                                                        }

                                                                                                                                        <div className="d-none d-md-block col-4 ps-5"><img src={imageHost + `/${cardObj.userCard.brand}.svg`} alt="brand" /></div>
                                                                                                                                        <div className="col-6 col-md-4 ps-5 ps-md-0">XXXX XXXX XXXX {cardObj.userCard.lastFour}<br /><span className={`${style.label}`}>Card Number</span></div>
                                                                                                                                        <div className="col-6 col-md-4 text-center">{cardObj.userCard.expiryMonth}/{cardObj.userCard.expiryYear}<br /><span className={`${style.label}`}>Expiry Date</span></div>
                                                                                                                                    </div>

                                                                                                                                </>
                                                                                                                            )
                                                                                                                        })
                                                                                                                    }

                                                                                                                </> :
                                                                                                                <></>
                                                                                                        }

                                                                                                    </div>
                                                                                                </>
                                                                                            }
                                                                                            <div className='mt-4 justify-content-center justify-content-md-start d-flex align-items-start'>
                                                                                                {
                                                                                                    cardsArr.length !== 0 && showCardsSection ? <button className={`${style.useCard}`} disabled={disableUseCard} onClick={useCard}>Use Card</button> : <></>
                                                                                                }

                                                                                                {
                                                                                                    initiatePayLoader ?
                                                                                                        <img className='ms-2' src={imageHost + '/loader-small.gif'} alt="loading" /> :
                                                                                                        <button className={cardsArr.length === 0 ? `ms-0 ${style.makePayment}` : `ms-2 ${style.makePayment}`} disabled={!termsAgreed} onClick={initiateStripe}>Add New Card</button>
                                                                                                }

                                                                                            </div>
                                                                                        </>
                                                                                }




                                                                            </div>

                                                                        </div>

                                                                    </> :
                                                                    <>
                                                                        <div className='p-5'>
                                                                            {
                                                                                details ?
                                                                                    <>
                                                                                        {
                                                                                            details.planPrice ?
                                                                                                <>
                                                                                                    {
                                                                                                        details.planPrice === details.paidPrice ?
                                                                                                            <></> :
                                                                                                            <div className="d-flex justify-content-center text-center mb-4"><div className={`${style.note}`}>We have adjusted the price from your previous plan. You just need to pay <b>${details.paidPrice}</b> instead of <b>${details.planPrice}</b> for the selected package</div></div>
                                                                                                    }
                                                                                                </> : <></>
                                                                                        }
                                                                                        {
                                                                                            details.refundAmount ?
                                                                                                <>
                                                                                                    <div className="d-flex justify-content-center text-center mb-4"><div className={`${style.note}`}>After you complete the payment for {details.planDisplayName}, a refund of <b>${details.refundAmount}</b> will be initiated for your previous plan.</div></div>
                                                                                                </> :
                                                                                                <></>
                                                                                        }
                                                                                    </> :
                                                                                    <></>
                                                                            }
                                                                            <div className="d-flex">
                                                                                {
                                                                                    details ?
                                                                                        <>
                                                                                            <div className='d-none d-lg-block w-50 pe-5'>
                                                                                                {
                                                                                                    showLoader ?
                                                                                                        <>
                                                                                                            <div className="text-center">
                                                                                                                <img src={imageHost + '/loader-small.gif'} alt="loading" />
                                                                                                            </div>
                                                                                                        </> :
                                                                                                        <>
                                                                                                            <PaymentPlans details={details} />
                                                                                                        </>
                                                                                                }
                                                                                            </div>
                                                                                            <div className='d-none d-lg-block border'></div>
                                                                                            <div className={`${style.rightSide} m-auto mt-0`}>
                                                                                                {
                                                                                                    showError ?
                                                                                                        <div className={`${style.error} mb-4 ms-0`}>
                                                                                                            <b>Payment Failed! &nbsp;</b>{err ? err : 'Something went wrong, Please try again'}
                                                                                                        </div> :
                                                                                                        <></>
                                                                                                }
                                                                                                {
                                                                                                    makePayment ?
                                                                                                        <>
                                                                                                            <Elements stripe={stripePromise} options={option1}>
                                                                                                                <CheckoutForm returnUrl={returnUrl} />
                                                                                                            </Elements>
                                                                                                        </> :
                                                                                                        <>
                                                                                                            <div className={`${style.preStripe}`}>
                                                                                                                <div className={`${style.head}`}>ACTIVATE {details.planName ? details.planName.toUpperCase() : '--'} PLAN</div>

                                                                                                                <div className={`${style.box} mt-3`}>
                                                                                                                    <b>{details.planDisplayName ? details.planDisplayName : '--'}</b>
                                                                                                                    <p className='mt-3'>Unlock the access to enhanced portfolio features & tax reports at just <span>${details.paidPrice ? details.paidPrice : '--'}</span></p>
                                                                                                                    <p>You can upgrade, downgrade or cancel any time.</p>
                                                                                                                    <div className={`checks form-switch ${style.formSwitch}`}>
                                                                                                                        <input className={`form-check-input me-3 ${style.formCheckInput}`} checked={termsAgreed} onChange={(e) => { if (e.target.checked) { setTermsAgreed(true) } else { setTermsAgreed(false) } }} type="checkbox" role="switch" id="terms-conditions" />
                                                                                                                        By continuing, you agree to the <a href="/terms-of-use">terms and conditions</a>
                                                                                                                    </div>
                                                                                                                    <div className={`checks form-switch ${style.formSwitch} mt-3`}>
                                                                                                                        <input className={`form-check-input me-3 ${style.formCheckInput}`} onChange={(e) => { if (e.target.checked) { setAutoPay('true') } else { setAutoPay('false') } }} type="checkbox" role="switch" id="auto-pay" />
                                                                                                                        Enable Auto Pay (Your card will be saved for future payments)
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                {
                                                                                                                    cardsArr.length === 0 ?
                                                                                                                        <>
                                                                                                                            {
                                                                                                                                initiatePayLoader ?
                                                                                                                                    <img className=' mt-4' src={imageHost + '/loader-small.gif'} alt="loading" /> :
                                                                                                                                    <button className={`mt-4 ${style.makePayment}`} disabled={!termsAgreed} onClick={initiateStripe}>Add New Card</button>
                                                                                                                            }
                                                                                                                        </> :
                                                                                                                        <></>
                                                                                                                }

                                                                                                            </div>
                                                                                                        </>
                                                                                                }

                                                                                                <div className="d-block d-lg-none text-center mt-3 mb-4">
                                                                                                    <button className={`${style.showPlanButton}`} onClick={() => { setShowPlan(true) }}>Click here</button> to view the plan you have selected
                                                                                                </div>
                                                                                                {cardsArr.length === 0 || !showCardsSection ?
                                                                                                    <></> :
                                                                                                    <>
                                                                                                        <hr />
                                                                                                        <div className={`${style.cards}`}>
                                                                                                            <h3 className='mt-4 mb-4'>Pay Through Existing Card</h3>

                                                                                                            {
                                                                                                                cardsArr ?
                                                                                                                    <>
                                                                                                                        {
                                                                                                                            cardsArr.map((cardObj: any) => {
                                                                                                                                return (
                                                                                                                                    <>
                                                                                                                                        <div className={`row ${style.cardsDiv} position-relative pb-3 pt-4`}>
                                                                                                                                            {
                                                                                                                                                checkDefaultCard(cardObj) ?
                                                                                                                                                    <input type="checkbox" className={`${style.checks} position-absolute`} checked={alreadyChecked ? true : selected === cardObj.paymentMethodId} onChange={(e) => { if (e.target.checked) { setAlreadyChecked(false); setSelected(cardObj.paymentMethodId); setPaymentMethodId(cardObj.paymentMethodId); setPaymentMethod(cardObj.paymentMethod); setPaymentVendor(cardObj.paymentVendor) } else { setAlreadyChecked(false); setSelected(''); setPaymentMethodId(''); setPaymentMethod(''); setPaymentVendor('') } }} name="" id="" /> :
                                                                                                                                                    <input className={`${style.checks} position-absolute`} checked={selected === cardObj.paymentMethodId} onChange={(e) => { if (e.target.checked) { setAlreadyChecked(false); setSelected(cardObj.paymentMethodId); setPaymentMethodId(cardObj.paymentMethodId); setPaymentMethod(cardObj.paymentMethod); setPaymentVendor(cardObj.paymentVendor) } else { setAlreadyChecked(false); setSelected(''); setPaymentMethodId(''); setPaymentMethod(''); setPaymentVendor('') } }} type="checkbox" name="" id="" />
                                                                                                                                            }

                                                                                                                                            <div className="d-none d-xl-block col-4 ps-5"><img src={imageHost + `/${cardObj.userCard.brand}.svg`} alt="brand" /></div>
                                                                                                                                            <div className="col-6 col-xl-4 ps-5 ps-xl-0">XXXX XXXX XXXX {cardObj.userCard.lastFour}<br /><span className={`${style.label}`}>Card Number</span></div>
                                                                                                                                            <div className="col-6 col-xl-4 text-center">{cardObj.userCard.expiryMonth}/{cardObj.userCard.expiryYear}<br /><span className={`${style.label}`}>Expiry Date</span></div>
                                                                                                                                        </div>

                                                                                                                                    </>
                                                                                                                                )
                                                                                                                            })
                                                                                                                        }
                                                                                                                    </> :
                                                                                                                    <></>
                                                                                                            }

                                                                                                            <div className='mt-4 justify-content-center justify-content-lg-start d-flex align-items-start'>
                                                                                                                <button className={`${style.useCard}`} disabled={disableUseCard} onClick={useCard}>Use Card</button>
                                                                                                                {
                                                                                                                    initiatePayLoader ?
                                                                                                                        <img className='ms-2' src={imageHost + '/loader-small.gif'} alt="loading" /> :
                                                                                                                        <button className={`ms-2 ${style.makePayment}`} disabled={!termsAgreed} onClick={initiateStripe}>Add New Card</button>
                                                                                                                }

                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </>
                                                                                                }


                                                                                            </div>
                                                                                        </> :
                                                                                        <>
                                                                                            <img src={imageHost + "/loader-small.gif"} alt="" />
                                                                                        </>
                                                                                }

                                                                            </div>
                                                                        </div>
                                                                    </>
                                                            }
                                                        </> :
                                                        <></>
                                                }

                                            </>


                                    }
                                </div>
                        }

                    </>
                </div>
                <div className="d-none d-lg-block">
                    <RightFeed />
                </div>
            </div>


        </>
    )
}

export default Payment