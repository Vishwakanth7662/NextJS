import { CardCvcElement, CardElement, CardExpiryElement, CardNumberElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { CardGroup, CardImg } from "react-bootstrap";
import style from '../../styles/pricing/payment.module.scss'

function CheckoutForm(props: any) {
    var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;
    const [errorMessage, setErrorMessage] = useState("");
    const [showLoader, setShowLoader] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    // handles the form submission
    const handleSubmit = async (event: any) => {
        setShowLoader(true);
        event.preventDefault();
        if (!stripe || !elements) return;
        console.log(props.returnUrl);
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: props.returnUrl,
            },
        });
        if (error) {

            console.log(error);
            setErrorMessage(String(error.message));
            setShowLoader(false);
        } else {
            console.log("success");
            setShowLoader(false);
        }
    };
    return (
        <div className={`${style.checkoutForm}`}>
            {errorMessage && <div className={`${style.error} mb-4`}>{errorMessage}</div>}
            <h1 className="mb-3">You are almost there!</h1>
            <form onSubmit={handleSubmit}>
                <PaymentElement />
                {
                    stripe ?
                        <div className="text-center text-md-start">
                            {
                                showLoader ?
                                    <><img src={imageHost + '/loader-small.gif'} alt="loading" className="img-fluid mt-3 mb-3" /></> :
                                    <><button disabled={!stripe} className={`${style.pay} mt-3 mb-3`}>Make Payment</button></>
                            }

                        </div>
                        :
                        <></>
                }

            </form>
        </div>
    );
};
export default CheckoutForm;
