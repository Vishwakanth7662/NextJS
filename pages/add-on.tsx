import React, { useEffect, useState } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import MainService from '../services/main-service';
import mainServiceClient from '../services/main-serviceClient';
import nookies from 'nookies';
import LeftFeed from '../components/shared/left-feed';
import RightFeed from '../components/shared/right-feed';
import getInsideAllPromiseFunction from '../components/getInsideAllServerPromise';
import getCurrenturl from '../components/currentUrlCheck';
import style from '../styles/pricing/add-ons.module.scss'
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'

let mainservice: any = MainService("get");

function getAddOns(tokens: any) {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await mainservice("addons", 'user', null, tokens);
            resolve(res.data);
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
    let response = storePromise.props[0].value;
    return {
        props: {
            addOnsObj: response
        }
    }
}

export async function getServerSideProps(context: any) {
    const cookies = nookies.get(context);
    getCurrenturl(context);
    let fnsArr = [getAddOns]
    let storePromise = await getData(cookies.accessTokens, context, fnsArr)
    return storePromise
}

function AddOn(props: any) {
    const router = useRouter();
    console.log(props.addOnsObj);
    let clientSidePost: any = mainServiceClient('post')
    const [filteredAddOns, setFilteredAddOns] = useState<any[]>([]);
    const [allAddOns, setAllAddOns] = useState<any[]>([]);
    const [selectedAddOn, setSelectedAddOn] = useState<any>();
    const [yearsSelected, setYearsSelected] = useState<any[]>([]);
    const [currency, setCurrency] = useState<any>();
    const [totalAmount, setTotallAmount] = useState(0);
    const [reload, setReload] = useState(false);
    const [addOnSelected, setAddOnSelected] = useState(false);
    const [buyLoader, setBuyLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [hoveredid, setHoveredid] = useState<any>();
    const [gettingAddOnsLoader, setGettingAddOnsLoader] = useState(false);

    var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;
    let totalAddOns = new Map();

    allAddOns.forEach((addOn: any) => {
        if (addOn.name === 'STARTER') {
            totalAddOns.set('STARTER', addOn.frequencyDisplayName.split(' ')[0] === 'Tax' ? 1 : Number(addOn.frequencyDisplayName.split(' ')[0]));
        }
        if (addOn.name === 'STANDARD') {
            totalAddOns.set('STANDARD', addOn.frequencyDisplayName.split(' ')[0] === 'Tax' ? 1 : Number(addOn.frequencyDisplayName.split(' ')[0]));
        }
    })

    console.log(totalAddOns);
    let endYear = Math.max(...yearsSelected);
    let startYear = Math.min(...yearsSelected);

    function checkConsecutive() {
        if (yearsSelected.length !== 0) {
            if (startYear !== endYear) {
                if (endYear - startYear + 1 === yearsSelected.length)
                    return true
                else
                    return false
            }
            else
                return true
        }
        else {
            return true;
        }
    }

    console.log(checkConsecutive());

    function setTotalAmount() {
        allAddOns.forEach((addOn: any) => {
            let addOnFreq = addOn.frequencyDisplayName.split(' ')[0] === 'Tax' ? 1 : Number(addOn.frequencyDisplayName.split(' ')[0]);
            if (selectedAddOn && yearsSelected.length !== 0) {
                if (addOn.name === selectedAddOn && addOnFreq === yearsSelected.length) {
                    setTotallAmount(addOn.offerPrice);
                    setReload(!reload);
                }
            }
            else {
                setTotallAmount(0);
            }
        })
    }

    function checkSelected(addOn: any) {
        return (selectedAddOn === addOn.name && yearsSelected.includes(addOn.year));
    }

    function checkLimit(addOn: any) {
        if (yearsSelected.length === totalAddOns.get(selectedAddOn)) {
            if (addOn.name === selectedAddOn) {
                if (yearsSelected.includes(addOn.year))
                    return false;
                else
                    return true
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }


    let resObj = {
        subscriptionPlan: selectedAddOn,
        startYear: String(startYear),
        endYear: String(endYear),
        currency: currency
    }

    console.log(resObj);

    async function getAddOns() {
        let addOnsObj = props.addOnsObj;
        setCurrency(addOnsObj.allAddOns[0].currency);
        setFilteredAddOns(addOnsObj.filteredAddOns);
        setAllAddOns(addOnsObj.allAddOns);
    }

    async function buyAddOn() {
        setBuyLoader(true);
        try {
            let res = await clientSidePost('/api/v1/buyAddOn', resObj, null);
            setBuyLoader(false);
            console.log(res);
            Cookies.set('paymentDetails', JSON.stringify(res.data), { expires: 1, path: '/' });
            if (res.data.paymentIntentId) {
                Cookies.set('paymentIntentId', res.data.paymentIntentId, { expires: 1, path: '/' });
                router.push("/payment");
            } else {
                window.location.href = "/pay-success";
            }
        }
        catch (e: any) {
            setBuyLoader(false);
            setShowError(true);
            console.log(e);
        }
    }

    console.log(yearsSelected);
    console.log(selectedAddOn);

    useEffect(() => {
        console.log('changed')
        setTotalAmount();
    }, [yearsSelected, addOnSelected])

    useEffect(() => {
        getAddOns();
    }, []);

    return (
        <div className="d-flex justify-content-between">
            <div className="d-none d-lg-block">
                <LeftFeed />
            </div>
            <div className={`${style.addOn} container`}>
                <div className={`${style.mainTitle} w-100 position-relative`}>
                    <hr />
                    <div className={`${style.titleDiv} position-absolute w-100 text-center`}><h2 className='m-auto'>Add-on Plan</h2></div>
                </div>
                <div className={`${style.message} text-center mt-5`}>
                    We have tailored the plans that are convenient, simple and easy for YOU!. <br /> Choose the plans that best meet your needs.
                </div>
                <div className={`${style.totalAmountDiv} mt-2 d-flex justify-content-center align-items-center flex-wrap`}>
                    Total Amount - <span>${totalAmount}.00</span>
                    <OverlayTrigger
                        placement='bottom'
                        overlay={
                            <Tooltip id="popover-contained">
                                {!checkConsecutive() ? <div>You can club the add-ons for only consecutive years.</div> : <><div>Continue to the Payment Page</div></>}
                            </Tooltip>
                        }
                    >
                        <div>
                            {
                                buyLoader ?
                                    <img className='ms-3' src={imageHost + '/loader-small.gif'} alt="loading" /> :
                                    <div className="p-3">
                                        <button className='ms-3' onClick={buyAddOn} disabled={(yearsSelected.length > totalAddOns.get(selectedAddOn)) || (yearsSelected.length === 0) || !checkConsecutive()}>Continue</button>
                                    </div>
                            }
                        </div>
                    </OverlayTrigger>
                    <div className={`w-100 text-start ${style.lilNote} mt-3`}><b>You can save upto 20% when purchasing multiple add-ons</b></div>
                </div>
                {
                    showError ?
                        <div className={`${style.error} ps-3 mt-2 position-relative`}><b>Error : </b>Something Went Wrong. Please Try Again <button onClick={() => { setShowError(false) }} className='position-absolute'><img src={imageHost + '/cross-icon.png'} alt="" /></button></div> :
                        <></>
                }
                <div className={`d-flex flex-wrap justify-content-center ${style.addOnsDiv} mb-4`}>
                    {
                        gettingAddOnsLoader ?
                            <div className="text-center mt-5"><img className='img-fluid' src={imageHost + '/loader3.gif'} alt="" /></div> :
                            <>
                                {
                                    filteredAddOns.length !== 0 ?
                                        <>
                                            {
                                                filteredAddOns.map((addOn: any, index: any) => {
                                                    return (
                                                        <>
                                                            <div onMouseEnter={() => { setShowMessage(true); setHoveredid(index) }} onMouseLeave={() => { setShowMessage(false); }} className={checkSelected(addOn) ? `form-check position-relative ${style.mainBoxSelected} me-0 me-md-4 mt-4` : `form-check position-relative ${style.mainBox} me-0 me-md-4 mt-4`}>
                                                                <label htmlFor={index} className="form-check-label w-100 h-100">
                                                                    <div className={`${style.year} pe-4`}>{addOn.year} <span className='mb-1'>(Tax Year)</span></div>
                                                                    <div className={`${style.price} w-100 text-center mt-3`}>${addOn.offerPrice}</div>
                                                                    <div className={`${style.planName} text-center`}>{addOn.name} Addon Price</div>
                                                                </label>
                                                                <input
                                                                    type="checkbox"
                                                                    disabled={(selectedAddOn && addOn.name !== selectedAddOn) || checkLimit(addOn)}
                                                                    id={index}
                                                                    className={`form-check-input position-absolute ${style.check}`}
                                                                    onChange={(e) => {

                                                                        if (e.target.checked) {
                                                                            setSelectedAddOn(addOn.name);
                                                                            if (!yearsSelected.includes(addOn.year)) {
                                                                                setYearsSelected(yearsSelected => [...yearsSelected, addOn.year])
                                                                            }
                                                                            setAddOnSelected(true);
                                                                        }
                                                                        else {
                                                                            yearsSelected.splice(yearsSelected.indexOf(addOn.year), 1)
                                                                            setReload(!reload);
                                                                            if (yearsSelected.length === 0) {
                                                                                setSelectedAddOn(null);
                                                                            }
                                                                            setTotalAmount();
                                                                        }
                                                                    }} />
                                                                {
                                                                    showMessage && hoveredid === index && selectedAddOn && addOn.name !== selectedAddOn ?
                                                                        <div className={`position-absolute ${style.addOnMsg}`}>You can only select the add-ons from the same plan.</div> :
                                                                        <>
                                                                            {
                                                                                showMessage && hoveredid === index && checkLimit(addOn) ?
                                                                                    <div className={`position-absolute ${style.addOnMsg}`}>you can select maximum of 3 add-ons at one time.</div> :
                                                                                    <></>
                                                                            }
                                                                        </>
                                                                }
                                                            </div>

                                                        </>



                                                    )
                                                })
                                            }
                                        </> :
                                        <><div className='text-center mt-5'>No Add Ons to show</div></>
                                }
                            </>
                    }

                </div>
            </div>
            <div className='d-none d-lg-block'>
                <RightFeed />
            </div>
        </div>
    )
}

export default AddOn