import { useEffect, useState } from 'react';
import style from '../styles/pricing/pay-success.module.scss'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router';

function PaymentSuccess() {
    let router = useRouter();
    var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;
    const [details, setDetails] = useState<any>();
    var baseUrl = process.env.REACT_APP_URL!;

    function toUtc(date: any) {
        let dateObj = new Date(date).toUTCString();
        let temp = dateObj.split(" ");
        return temp[2] + " " + temp[1] + ", " + temp[3];
    }

    useEffect(() => {
        if (Cookies.get('paymentDetails'))
            setDetails(JSON.parse(Cookies.get('paymentDetails')!));
    }, [])

    console.log(details)
    return (
        <>
            {
                details ?
                    <>
                        <div className={`${style.paySuccess} container`}>
                            <div className={`${style.mascot} text-center`}>
                                <img src={imageHost + '/raised-hands-mascot.svg'} alt="success mascot" className="img-fluid" />
                            </div>
                            <div className={`${style.thanks} text-center mt-4`}>
                                <h1>THANK YOU FOR CHOOSING CRPTM!</h1>
                                {
                                    details.refundAmount ?
                                        <>
                                            {
                                                details.refundAmount !== 0 && details.paidPrice === 0 ?
                                                    <><p>You have successfully changed your plan to {details.planName}. We have initiated a refund of <b>${details.refundAmount}</b>.<br /> We will notify you once the refund is processed on your registered email address.</p></> :
                                                    <p>You have successfully changed your plan to {details.planName}. A refund of <b>${details.refundAmount}</b> has been initiated from previous plan.<br /> Please find below the payment receipt</p>
                                            }
                                        </> :
                                        <>
                                            {
                                                details.paidPrice === 0 ?
                                                    <p>You have successfully changed your plan to {details.planName}. You can visit the pricing page anytime to change your subscription</p> :
                                                    <>
                                                        {
                                                            details.planType === 'ADD_ON' ?
                                                                <p>You have successfully purchased the AddOn plans for year {details.startYear === details.endYear ? details.startYear : details.startYear + ' to ' + details.endYear}. Please find below the payment receipt</p> :
                                                                <p>You have successfully upgraded to {details.planName} plan. Please find below the payment receipt</p>
                                                        }
                                                    </>

                                            }

                                        </>
                                }


                            </div>
                            {
                                details.paidPrice === 0 ?
                                    <></> :
                                    <>
                                        <div className={`${style.invoice} m-auto mt-4`} id='invoice'>
                                            <b>Please find below your payment receipt.</b>
                                            <div className={`${style.details} row mt-3`}>
                                                <div className={`${style.col6} col-6 text-start`}>Plan</div>
                                                <div className={`${style.col6} col-6 text-end`}>{details ? details.planName : ''}{details.planType === 'ADD_ON' ? ' ADD ON' : ''}</div>
                                                <div className={`${style.col6} col-6 text-start`}>Amount Paid</div>
                                                <div className={`${style.col6} col-6 text-end`}>{details ? details.paidPrice + ' USD' : ''}</div>
                                                <div className={`${style.col6} col-6 text-start`}>Transaction ID</div>
                                                <div className={`${style.col6} col-6 text-end`}>{details ? details.paymentId ? details.paymentId : '--' : ''}</div>
                                                <div className={`${style.col6} col-6 text-start`}>Payment Type</div>
                                                <div className={`${style.col6} col-6 text-end`}>{details ? details.paymentMethod ? details.paymentMethod : '' : ''}</div>
                                                <div className={`${style.col6} col-6 text-start pe-0`}>Transaction Date</div>
                                                <div className={`${style.col6} col-6 text-end`}>{details ? toUtc(details.txnDate) : ''}</div>
                                                <div className={`${style.col6} col-6 text-start pe-0`}>Plan End Date</div>
                                                {
                                                    details.planType === 'ADD_ON' ?
                                                        <div className={`${style.col6} col-6 text-end`}>N/A</div> :
                                                        <div className={`${style.col6} col-6 text-end`}>{details ? toUtc(details.endDate) : ''}</div>
                                                }

                                            </div>
                                            <div className="d-none">
                                                <div className={`${style.saveInvoice} d-flex justify-content-center mt-5 text-center`}>
                                                    <button className='me-2'>Print</button>
                                                    <button className='ms-2'>Download</button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                            }

                            <div className={`${style.homeButton} text-center mt-4 mb-5`}>
                                <button onClick={() => { router.push('/users-portfolio') }}>Go To Homepage</button>
                            </div>
                        </div>
                    </> :
                    <></>
            }

        </>
    )
}

export default PaymentSuccess;