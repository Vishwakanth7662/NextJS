import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import style from '../styles/tax-report/tax-report.module.scss'
import MainService from '../services/main-service';
import mainServiceClient from '../services/main-serviceClient';
import nookies from 'nookies';
import check401 from '../components/401-check';
import getInsideAllPromiseFunction from '../components/getInsideAllServerPromise';
import getCurrenturl from '../components/currentUrlCheck';
import LeftFeed from '../components/shared/left-feed';
import RightFeed from '../components/shared/right-feed';

let mainservice: any = MainService("get");

function getForms(tokens: any) {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await mainservice("forms", 'ups', null, tokens);
            resolve(res.data);
        }
        catch (e: any) {
            reject(e);
        }
    })
}

async function getData(tokens: any, context: any, fnsArr: any[]) {
    let subscriptions: any;
    let getTxnsRes: any;
    let userAccs: any;
    let storePromise = await getInsideAllPromiseFunction(tokens, context, fnsArr)
    console.log("StorePromise props");
    console.log(storePromise.props);
    let response = storePromise.props[0].value;
    let forms = response.forms;
    return {
        props: {
            formsObj: forms
        }
    }
    return storePromise
}

export async function getServerSideProps(context: any) {
    const cookies = nookies.get(context);
    getCurrenturl(context);
    let fnsArr = [getForms]
    let storePromise = await getData(cookies.accessTokens, context, fnsArr)
    return storePromise
}


function TaxReport(props: any) {
    const router = useRouter()
    let clientSidePost: any = mainServiceClient("post")
    var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;

    const [selectedRange, setSelectedRange] = useState("2023");
    const [selectedForm, setSelectedForm] = useState('Select Form Type');
    const [forms, setForms] = useState<any[]>(props.formsObj);
    const [showFormsLoader, setShowFormsLoader] = useState(false);
    const [selectedCalc, setSelectedCalc] = useState('FIFO - First In, First Out');
    const [fetchingReportLoader, setFetchingReportLoader] = useState(false);
    const [generateReportMessage, setGenerateReportMessage] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [updateReportLoader, setUpdateReportLoader] = useState(false);
    const [report, setReport] = useState<any>();
    const [showErr, setShowErr] = useState(false);
    const [downloadLoader, setDownloadLoader] = useState(false);
    const [showDownloadError, setShowDownloadError] = useState(false);
    const [downloadErr, setDownloadErr] = useState('');
    const [showInvalidPlanErr, setShowInvalidPlanErr] = useState(false);
    const [invalidErr, setInvalidErr] = useState('');
    const [showAddAccountErr, setShowAddAccountErr] = useState(false);
    const [err, setErr] = useState('');
    const [showUpgradePlan, setShowUpgradePlan] = useState(true);
    const [noAccess, showNoAccess] = useState(false);
    const [downloadAccess, showDownloadAccess] = useState(false);
    const [showAddOnBtn, setShowAddOnBtn] = useState(false);

    let yearRanges = ["2023", "2022", "2021", "2020", "2019", "2018", "2017"];
    let formTypes = ['Form 8949', 'Form Schedule D (1040)', 'Form Schedule 1 (1040)', 'Form Schedule A (1040)', 'Form 1040', 'Form 709', 'Form 8283', 'Form 14039', 'Form 4684']

    let yearsArr = selectedRange.split('-');
    let methodArr = selectedCalc.split(' ');
    console.log(methodArr)

    function getTotalLostOrStolen(lsObj: any) {
        let value = 0.00;
        Object.keys(lsObj).map((key: any) => {
            value += Number(lsObj[key]);
        })
        return value.toFixed(2);
    }

    async function downloadForm() {
        setDownloadLoader(true);
        try {
            let res = await clientSidePost('/api/v1/tax-analysis/download-form', { year: selectedRange, costBasis: methodArr[0], formType: selectedForm }, null);
            console.log(res);
            window.location.href = res.data.fileUrl;
            setShowDownloadError(false);
            setDownloadLoader(false);
        }
        catch (e: any) {
            console.log(e);
            if (e.status === 500) {
                window.location.href = '/500-error'
            }
            if (e.data.error.code === 9936) {
                setShowInvalidPlanErr(true);
                setShowAddOnBtn(true);
                setShowUpgradePlan(false);
                setGenerateReportMessage(false);
                setInvalidErr("Your current plan doesnt support the reports for the selected year. Please buy add-on to get the report for selected year.")
            }

            if (e.data.error.code === 9930 || e.data.error.code === 9934) {
                setShowInvalidPlanErr(true);
                setShowSummary(false);
                setGenerateReportMessage(false);
                if (e.data.error.code === 9930) {
                    setInvalidErr("Your current plan does not support this feature. To access this feature, please upgrade the plan.");
                }
                else {
                    if (e.data.error.code === 9934)
                        setInvalidErr(`You need to upgrade your plan because your total transaction is ${e.data.userTxnCount} and you have taken a plan to support ${e.data.userPlanCountLimit} transactions.`);
                    else
                        setInvalidErr(e.data.error.message);
                }
            }
            else {
                setShowDownloadError(true);
            }
            setDownloadErr(e.data.error.message);
            setDownloadLoader(false);
        }
    }

    async function generateReport() {
        setShowErr(false);
        setUpdateReportLoader(true);
        try {
            let res = await clientSidePost('/api/v1/tax-report/generate-report', { year: selectedRange, costBasis: methodArr[0], nationality: 'US' }, null);
            setGenerateReportMessage(false);
            console.log(res);
            setUpdateReportLoader(false);
            setReport(res.data);
            setShowSummary(true);
            setShowErr(false);
        }
        catch (e: any) {
            console.log(e);
            window.scrollTo(0, 0);
            if (e.status === 500) {
                window.location.href = '/500-error'
            }
            setUpdateReportLoader(false);
            if (e.data.error.code === 9936) {
                setShowInvalidPlanErr(true);
                setShowAddOnBtn(true);
                setShowUpgradePlan(false);
                setGenerateReportMessage(false);
                setInvalidErr("Your current plan doesnt support the reports for the selected year. Please buy add-on to get the report for selected year.")
            }

            if (e.data.error.code === 9930 || e.data.error.code === 9934) {
                setGenerateReportMessage(false);
                setShowInvalidPlanErr(true);

                if (e.data.error.code === 9930) {
                    setInvalidErr("Your current plan does not support this feature. To access this feature, please upgrade the plan.");
                }
                else {
                    if (e.data.error.code === 9934)
                        setInvalidErr(`You need to upgrade your plan because your total transaction is ${e.data.userTxnCount} and you have taken a plan to support ${e.data.userPlanCountLimit} transactions.`);
                    else
                        setInvalidErr(e.data.error.message);
                }
            }
            else if (e.data.error.code === 9937) {
                setGenerateReportMessage(false);
                setShowAddAccountErr(true);
            }
            else {
                setShowErr(true);
            }

            setErr(e.data.error.message);
            setShowSummary(false);
        }
    }

    async function loadReport() {
        setShowErr(false);
        setFetchingReportLoader(true);
        try {
            let res = await clientSidePost('/api/v1/tax-report/load-report', { year: selectedRange, costBasis: methodArr[0], nationality: 'US' }, null);
            console.log(res);
            setFetchingReportLoader(false);
            setShowSummary(true);
            setReport(res.data);
            setShowErr(false);
        }
        catch (e: any) {
            setErr(e.data.error.message);
            if (e.status === 500) {
                window.location.href = '/500-error'
            }
            setShowSummary(false);
            if (e.data.error.code === 9936) {
                setShowInvalidPlanErr(true);
                setShowUpgradePlan(false);
                setShowAddOnBtn(true);
                setGenerateReportMessage(false);
                setInvalidErr("Your current plan doesnt support the reports for the selected year. Please buy add-on to get the report for selected year.")
            }
            if (e.data.error.code === 9930 || e.data.error.code === 9934) {
                setShowInvalidPlanErr(true);
                if (e.data.error.code === 9930) {
                    setInvalidErr("Your current plan does not support this feature. To access this feature, please upgrade the plan.");
                }
                else {
                    if (e.data.error.code === 9934)
                        setInvalidErr(`You need to upgrade your plan because your total transaction is ${e.data.userTxnCount} and you have taken a plan to support ${e.data.userPlanCountLimit} transactions.`);
                    else
                        setInvalidErr(e.data.error.message);
                }
            }

            else if (e.data.error.code === 9937) {
                setGenerateReportMessage(false);
                setShowAddAccountErr(true);
            }
            else {
                setShowErr(true);
            }
            window.scrollTo(0, 0);
            setFetchingReportLoader(false);
            console.log(e);
            console.log(e.data.error.code);

        }
    }

    return (
        <>
            <div className="d-flex justify-content-between">
                <div className="d-none d-lg-block">
                    <LeftFeed />
                </div>
                <div className={`${style.taxPage} container`}>
                    <div className={`${style.desktopForms} d-none d-lg-block position-relative`}>
                        <hr className={`${style.topLine} mb-5`} />
                        <div className={`w-100 text-center position-absolute ${style.titleDiv}`}><div className={`${style.title} m-auto`}>Tax Summary</div></div>
                        <div className={`${style.mainForm} d-flex justify-content-center align-items-start`}>
                            <div className="d-flex me-4">
                                <b className='pt-3'>Report for</b>
                                <div className={`accordion ${style.yearSelect} ms-3`}>
                                    <div className="accordion-item position-relative">
                                        <h2 className="accordion-header" id="headingOne">
                                            <button className={`${style.dropdownBtn} accordion-button collapsed`} type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                {selectedRange}
                                            </button>
                                        </h2>
                                        <div id="collapseOne" className={`${style.dropdownBox} accordion-collapse position-absolute collapse`} aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                            <div className={`${style.dropdownBody} accordion-body`}>
                                                {
                                                    yearRanges.map(range => {
                                                        return (
                                                            <button type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" onClick={() => { setSelectedRange(range); }} className={range === selectedRange ? "d-none" : `${style.years}`}>{range}</button>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-start ms-4">
                                <b className='pt-3'>Calculation Method</b>
                                <div className={`accordion ${style.yearSelect} ms-3`}>
                                    <div className="accordion-item position-relative">
                                        <h2 className="accordion-header" id="headingOne">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMethod" aria-expanded="true" aria-controls="collapseMethod">
                                                {selectedCalc}
                                            </button>
                                        </h2>
                                        <div id="collapseMethod" className={`${style.dropdownBox} accordion-collapse position-absolute collapse`} aria-labelledby="headingMethod" data-bs-parent="#headingOne">
                                            <div className={`${style.dropdownBody} accordion-body`}>
                                                <div className={selectedCalc === 'LIFO - Last In First Out' ? 'd-none' : 'w-100'}><button type="button" data-bs-toggle="collapse" data-bs-target="#collapseMethod" onClick={() => { setSelectedCalc('LIFO - Last In First Out') }}>LIFO - Last In First Out</button></div>
                                                <div className={selectedCalc === 'HIFO - Highest In First Out' ? 'd-none' : 'w-100'}><button type="button" data-bs-toggle="collapse" data-bs-target="#collapseMethod" onClick={() => { setSelectedCalc('HIFO - Highest In First Out') }}>HIFO - Highest In First Out</button></div>
                                                <div className={selectedCalc === 'FIFO - First In, First Out' ? 'd-none' : 'w-100'}><button type="button" data-bs-toggle="collapse" data-bs-target="#collapseMethod" onClick={() => { setSelectedCalc('FIFO - First In, First Out') }}>FIFO - First In, First Out</button></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className={`${style.viewSummary} ms-3 mt-1`} onClick={() => { loadReport(); }}>View Summary</button>

                        </div>
                        {
                            showSummary ?
                                <>
                                    <div className={`${style.downloadSection} d-flex justify-content-center mt-4`} onMouseEnter={() => { if (noAccess) { showDownloadAccess(true); } }}>
                                        <div className={`accordion ${style.yearSelect} ms-3`}>
                                            <div className="accordion-item position-relative">
                                                <h2 className="accordion-header" id="headingOne">
                                                    <button disabled={noAccess} className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                                                        {selectedForm}
                                                    </button>
                                                </h2>
                                                <div id="collapseThree" className={`${style.dropdownBox} accordion-collapse position-absolute collapse`} aria-labelledby="headingOne" data-bs-parent="#headingOne">
                                                    <div className={`${style.dropdownBody} accordion-body`}>
                                                        {
                                                            showFormsLoader ?
                                                                <div className='text-center mt-3 mb-3'>
                                                                    <img src={imageHost + '/loader-small.gif'} alt="loading" />
                                                                </div>
                                                                :
                                                                <>
                                                                    {
                                                                        forms.map(form => {
                                                                            return (
                                                                                <button type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" onClick={() => { setSelectedForm(form.formName); }} className={form.formName === selectedForm ? "d-none" : "ranges"}>{form.displayName} - {form.formDescription}</button>
                                                                            )
                                                                        })
                                                                    }
                                                                </>
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            downloadLoader ?
                                                <img className={`ms-3 mt-4 ${style.loaderReport}`} src={imageHost + '/loader-small.gif'} alt="" /> :
                                                <button className={`${style.downloadSectionBtn} ms-3 mt-1`} disabled={selectedForm === 'Select Form Type' || noAccess} onClick={downloadForm}>Download Report</button>
                                        }

                                        {
                                            updateReportLoader ?
                                                <img src={imageHost + '/loader-small.gif'} alt="loading" className=' loader-report ms-3 mt-4' /> :
                                                <button className={`${style.downloadSectionBtn} ms-3 mt-1`} onClick={() => { generateReport(); }}>Update Report</button>
                                        }

                                    </div>
                                    {
                                        downloadAccess ?
                                            <><div className={`text-center w-100 mt-3 ${style.downloadNote}`}>(Your crypto tax forms are ready. Please subscribe to our plans <a onClick={() => { router.push('/plans') }}>here</a> to download them.)</div> </> :
                                            <></>
                                    }
                                    {
                                        showDownloadError ?
                                            <div className={`${style.error} mt-4 text-center position-relative`}><b>Error : {downloadErr}</b> <button className='position-absolute' onClick={() => { setShowDownloadError(false) }}><img src={imageHost + '/red-cross.svg'} alt="" /></button></div> :
                                            <></>
                                    }
                                    <div className={`${style.lastSync} mt-4 text-center`}>Summary generated on:: {report ? report.createdAt ? report.createdAt : '' : ''}</div>
                                </>
                                :
                                <></>
                        }
                    </div>

                    <div className={`${style.mobileForms} d-block d-lg-none`}>
                        <div className={`${style.mainHeading} position-relative`}>
                            <hr />
                            <div className={`${style.title} w-100 text-center position-absolute`}>
                                <h3 className="m-auto">Tax Summary</h3>
                            </div>
                        </div>
                        {
                            report ? report.userReviewCount ?
                                <div className={`${style.note} w-100 text-center mt-5`}>
                                    {report ? report.userReviewCount ? report.userReviewCount : '0.00' : '0.00'} Transactions <a href="/transactions">Need Review</a>
                                </div>
                                : <></> : <></>
                        }
                        <div className={`${style.yearsDiv} mt-3`}>
                            <b>Report for</b><br />
                            <div className={`accordion mt-2 ${style.yearSelect}`}>
                                <div className="accordion-item position-relative">
                                    <h2 className="accordion-header" id="headingOne">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                            {selectedRange}
                                        </button>
                                    </h2>
                                    <div id="collapseOne" className={`${style.dropdownBox} accordion-collapse position-absolute collapse`} aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                        <div className={`${style.dropdownBody} accordion-body`}>
                                            {
                                                yearRanges.map(range => {
                                                    return (
                                                        <button type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" onClick={() => { setSelectedRange(range); }} className={range === selectedRange ? "d-none" : "ranges"}>{range}</button>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`${style.methodDiv} mt-3`}>
                            <b>Calculation Method</b>
                            <div className={`accordion mt-2 ${style.yearSelect}`}>
                                <div className="accordion-item position-relative">
                                    <h2 className="accordion-header" id="headingOne">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMethod" aria-expanded="true" aria-controls="collapseMethod">
                                            {selectedCalc}
                                        </button>
                                    </h2>
                                    <div id="collapseMethod" className={`${style.dropdownBox} accordion-collapse position-absolute collapse`} aria-labelledby="headingOne" data-bs-parent="#headingOne">
                                        <div className={`${style.dropdownBody} accordion-body`}>
                                            <div className={selectedCalc === 'LIFO - Last In First Out' ? 'd-none' : 'w-100'}><button type="button" data-bs-toggle="collapse" data-bs-target="#collapseMethod" onClick={() => { setSelectedCalc('LIFO - Last In First Out') }}>LIFO - Last In First Out</button></div>
                                            <div className={selectedCalc === 'HIFO - Highest In First Out' ? 'd-none' : 'w-100'}><button type="button" data-bs-toggle="collapse" data-bs-target="#collapseMethod" onClick={() => { setSelectedCalc('HIFO - Highest In First Out') }}>HIFO - Highest In First Out</button></div>
                                            <div className={selectedCalc === 'FIFO - First In, First Out' ? 'd-none' : 'w-100'}><button type="button" data-bs-toggle="collapse" data-bs-target="#collapseMethod" onClick={() => { setSelectedCalc('FIFO - First In, First Out') }}>FIFO - First In, First Out</button></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-100 text-center mt-4">
                            <button onClick={loadReport} className={`${style.viewSummary}`}>View Summary</button>
                        </div>
                        {
                            showSummary ?
                                <>
                                    <div className={`${style.downloadSectionMobile} mt-4`} onMouseEnter={() => { if (noAccess) { showDownloadAccess(true); } }}>
                                        <div className={`accordion ${style.yearSelect}`}>
                                            <div className="accordion-item position-relative">
                                                <h2 className="accordion-header" id="headingOne">
                                                    <button disabled={noAccess} className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                                                        {selectedForm}
                                                    </button>
                                                </h2>
                                                <div id="collapseThree" className={`${style.dropdownBox} accordion-collapse position-absolute collapse`} aria-labelledby="headingOne" data-bs-parent="#headingOne">
                                                    <div className={`${style.dropdownBody} accordion-body`}>
                                                        {
                                                            forms.map(form => {
                                                                return (
                                                                    <button type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" onClick={() => { setSelectedForm(form.formName); }} className={form.formName === selectedForm ? "d-none" : "ranges"}>{form.displayName} - {form.formDescription}</button>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center mt-4">
                                            {
                                                downloadLoader ?
                                                    <img className={`ms-3 mt-4 ${style.loaderReport}`} src={imageHost + '/loader-small.gif'} alt="" /> :
                                                    <button className={`${style.downloadSectionBtn} ms-3 mt-1`} disabled={selectedForm === 'Select Form Type' || noAccess} onClick={downloadForm}>Download Report</button>
                                            }
                                        </div>
                                        {
                                            downloadAccess ?
                                                <>
                                                    <div className={`text-center ${style.downloadNote} mt-3`}>(Your crypto tax forms are ready. Please subscribe to our plans <a onClick={() => { router.push('/plans') }}>here</a> to download them.)</div>
                                                </> :
                                                <></>
                                        }
                                    </div>
                                    <div className={`${style.lastSync} mt-4 text-center`}>Summary generated on: {report ? report.createdAt ? report.createdAt : '' : ''}<br />
                                        <button className={`${style.update}`} onClick={() => { generateReport(); }}>Click here to update report</button> </div>
                                </>
                                :
                                <></>
                        }
                    </div>

                    {
                        fetchingReportLoader ?
                            <>
                                <div className="w-100 text-center mt-5">
                                    Please wait while we fetch your tax summary<br />
                                    <img src={imageHost + '/loader-small.gif'} alt="" />
                                </div>
                            </> :
                            <>
                                {
                                    updateReportLoader ?
                                        <>
                                            <div className={`${style.updateLoader} text-center d-lg-flex justify-content-center mt-5`}>
                                                <img src={imageHost + '/features-mascot.svg'} className='img-fluid' alt="" />
                                                <div className='text-center ms-lg-5'>
                                                    Please wait while we generate your tax report<br />
                                                    <img src={imageHost + '/loader-small.gif'} alt="" />
                                                </div>
                                            </div>
                                        </> :
                                        <>

                                            {
                                                showSummary ?
                                                    <>
                                                        <div className={`${style.taxReport} container`}>

                                                            {/* DESKTOP VIEW */}

                                                            <div className={`${style.reportContent} d-none d-lg-block`}>
                                                                <div className={`${style.note} mb-4`}>
                                                                    Note: You have {report ? report.userReviewCount ? report.userReviewCount : '0.00' : '0.00'} transactions that need to be reviewed. Please review them <a onClick={() => { router.push('/transactions') }}>here</a> to get the correct tax reports.
                                                                </div>
                                                                <div className={`w-100 ${style.firstBox} d-flex`}>
                                                                    <div>
                                                                        <h2>Capital Gain/Loss Summary &nbsp; <button onClick={() => { router.push('/tax-analysis') }}>(View Tax Analysis)</button></h2>
                                                                        <hr />
                                                                        <div className="row">
                                                                            <div className={`${style.col4} col-4`}></div>
                                                                            <div className={`${style.col4} col-4`}>Short Term</div>
                                                                            <div className={`${style.col4} col-4`}>Long Term</div>
                                                                            <div className={`${style.col4} col-4`}>Total Proceeds</div>
                                                                            <div className={`${style.col4} col-4`}>${report ? report.totalProceeds ? report.totalProceeds.SHORT_TERM ? Number(report.totalProceeds.SHORT_TERM).toLocaleString("en-US") : '0.00' : '0.00' : ''}</div>
                                                                            <div className={`${style.col4} col-4`}>${report ? report.totalProceeds ? report.totalProceeds.LONG_TERM ? Number(report.totalProceeds.LONG_TERM).toLocaleString("en-US") : '0.00' : '0.00' : ''}</div>
                                                                            <div className={`${style.col4} col-4`}>Total Costs</div>
                                                                            <div className={`${style.col4} col-4`}>${report ? report.totalCost ? report.totalCost.SHORT_TERM ? Number(report.totalCost.SHORT_TERM).toLocaleString("en-US") : '0.00' : '0.00' : ''}</div>
                                                                            <div className={`${style.col4} col-4`}>${report ? report.totalCost ? report.totalCost.LONG_TERM ? Number(report.totalCost.LONG_TERM).toLocaleString("en-US") : '0.00' : '0.00' : ''}</div>
                                                                        </div>
                                                                        <hr />
                                                                        <div className="row">
                                                                            <div className={`${style.col4} col-4`}>Total Capital Gain/Loss</div>
                                                                            <b className={`${style.col4} col-4`}>${report ? report.shortTermGain ? Number(report.shortTermGain).toLocaleString("en-US") : '0.00' : '0.00'}</b>
                                                                            <b className={`${style.col4} col-4`}>${report ? report.longTermGain ? Number(report.longTermGain).toLocaleString("en-US") : '0.00' : '0.00'}</b>
                                                                        </div>
                                                                    </div>
                                                                    <img src={imageHost + '/capital-gain-mascot.svg'} alt="" className="img-fluid ms-5 mt-1" />
                                                                </div>
                                                                <div className="d-flex mt-3 justify-content-between align-items-baseline">
                                                                    <div className={`${style.taxableIncome} me-2`}>
                                                                        <h3>Taxable Income</h3>
                                                                        <div className="row">
                                                                            <b className={`${style.col6} col-6`}>Taxable Income</b>
                                                                            <b className={`${style.col6} col-6`}>Amount</b>
                                                                        </div>
                                                                        <hr />
                                                                        <div className="row">
                                                                            {
                                                                                report ?
                                                                                    <>
                                                                                        {
                                                                                            report.incomeResult ?
                                                                                                <>
                                                                                                    {
                                                                                                        Object.keys(report.incomeResult).map((key: any) => {
                                                                                                            return (
                                                                                                                <>
                                                                                                                    <div className={`${style.col6} col-6`}>{key.replace('_', ' ')}</div>
                                                                                                                    <div className={`${style.col6} col-6`}>${Number(report.incomeResult[key]).toLocaleString("en-US")}</div>
                                                                                                                </>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </> :
                                                                                                <>
                                                                                                    <div className="text-center">No Income Transactions</div>
                                                                                                </>
                                                                                        }

                                                                                    </> :
                                                                                    <>
                                                                                    </>
                                                                            }
                                                                        </div>
                                                                        <hr />
                                                                        <div className="row">
                                                                            <b className={`${style.col6} col-6`}>Total Income</b>
                                                                            <b className={`${style.col6} col-6`}>${report ? report.netIncomeGain ? Number(report.netIncomeGain).toLocaleString("en-US") : '0.00' : '0.00'}</b>
                                                                        </div>
                                                                    </div>
                                                                    <div className={`${style.lostStolen} ms-2`}>
                                                                        <h3>Lost or Stolen</h3>
                                                                        <div className="row">
                                                                            <b className={`${style.col6} col-6`}>Lost or Stolen</b>
                                                                            <b className={`${style.col6} col-6`}>Amount</b>
                                                                        </div>
                                                                        <hr />
                                                                        <div className="row">
                                                                            {
                                                                                report ?
                                                                                    report.lostOrStolen ?
                                                                                        <>
                                                                                            {
                                                                                                Object.keys(report.lostOrStolen).map((key: any) => {
                                                                                                    return (
                                                                                                        <>
                                                                                                            <div className={`${style.col6} col-6`}>{key}</div>
                                                                                                            <div className={`${style.col6} col-6`}>${Number(report.lostOrStolen[key]).toLocaleString("en-US")}</div>
                                                                                                        </>
                                                                                                    )
                                                                                                })
                                                                                            }
                                                                                        </> :
                                                                                        <>
                                                                                            <div className="row p-0 m-auto">
                                                                                                <div className={`${style.col6} col-6`}>Stolen</div>
                                                                                                <div className={`${style.col6} col-6`}>$0.00</div>
                                                                                                <div className={`${style.col6} col-6`}>Lost Investment</div>
                                                                                                <div className={`${style.col6} col-6`}>$0.00</div>
                                                                                                <div className={`${style.col6} col-6`}>Other Lost</div>
                                                                                                <div className={`${style.col6} col-6`}>$0.00</div>
                                                                                            </div>
                                                                                        </> : <>

                                                                                    </>
                                                                            }
                                                                        </div>
                                                                        <hr />
                                                                        <div className="row">
                                                                            <b className={`${style.col6} col-6`}>Total Lost or Stolen</b>
                                                                            <b className={`${style.col6} col-6`}>${report ? report.lostOrStolen ? Number(getTotalLostOrStolen(report.lostOrStolen)).toLocaleString("en-US") : '0.00' : '--'}</b>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="d-flex mt-3 justify-content-between align-items-baseline">
                                                                    <div className={`${style.otherIncome} me-2`}>
                                                                        <h3>Gifts/Donations</h3>
                                                                        <div className="row">
                                                                            <b className={`${style.col6} col-6`}>Gifts/Donations</b>
                                                                            <b className={`${style.col6} col-6`}>Amount</b>
                                                                        </div>
                                                                        <hr />
                                                                        <div className="row">
                                                                            <div className={`${style.col6} col-6`}>Gift Sent</div>
                                                                            <div className={`${style.col6} col-6`}>${report ? report.giftAndDonations ? report.giftAndDonations["Gift Sent"] ? Number(report.giftAndDonations["Gift Sent"]).toLocaleString("en-US") : '0.00' : '0.00' : '0.00'}</div>
                                                                            <div className={`${style.col6} col-6`}>Gift Received</div>
                                                                            <div className={`${style.col6} col-6`}>${report ? report.giftReceived ? Number(report.giftReceived).toLocaleString("en-US") : '0.00' : '0.00'}</div>
                                                                            <div className={`${style.col6} col-6`}>Donation</div>
                                                                            <div className={`${style.col6} col-6`}>${report ? report.giftAndDonations ? report.giftAndDonations["Donation"] ? Number(report.giftAndDonations["Donation"]).toLocaleString("en-US") : '0.00' : '0.00' : '0.00'}</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className={`${style.lowerRight} w-50 ms-2`}>
                                                                        <div className={`${style.settings}`}>
                                                                            <h3>Settings</h3>
                                                                            <div className="row">
                                                                                <b className={`${style.col6} col-6`}>Settings</b>
                                                                                <a href="/settings" className={`${style.col6} col-6`}><img src={imageHost + '/settings-icon.svg'} alt="settings" /></a>
                                                                            </div>
                                                                            <hr />
                                                                            <div className="row">
                                                                                <div className={`${style.col6} col-6`}>Base Currency</div>
                                                                                <div className={`${style.col6} col-6`}>{report ? report.resultCurrency ? report.resultCurrency : '' : ''}</div>
                                                                            </div>
                                                                            <hr />
                                                                            <div className="row">
                                                                                <div className={`${style.col6} col-6`}>Country</div>
                                                                                <div className={`${style.col6} col-6`}>USA</div>
                                                                            </div>
                                                                        </div>
                                                                        <div className={`${style.reviewBoxes} mt-3`}>
                                                                            Want to <b>review your accounts</b> <a href="/my-accounts" className='ms-2'>Click Here</a>
                                                                        </div>
                                                                        <div className={`${style.reviewBoxes} mt-3`}>
                                                                            Want to <b>review your transactions</b> <a href="/transactions" className='ms-2'>Click Here</a>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>

                                                            {/* MOBILE VIEW */}

                                                            <div className={`${style.mobileContent} d-block d-lg-none`}>
                                                                <div className="accordion accordion-flush" id="accordionFlushExample">
                                                                    <div className="accordion-item">
                                                                        <h2 className="accordion-header" id="flush-headingOne">
                                                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#capitalSummary" aria-expanded="false" aria-controls="capitalSummary">
                                                                                <b>Capital Gain/Loss Summary</b>
                                                                            </button>
                                                                        </h2>
                                                                        <div id="capitalSummary" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                                                            <div className={`${style.capitalDiv} accordion-body`}>
                                                                                <div className={`${style.taxAnalysisLink} text-center`}>(<a onClick={() => { router.push('/tax-analysis') }}>View Tax Analysis</a>)</div>
                                                                                <div className={`row ${style.heading} mt-2`}>
                                                                                    <div className={`${style.col4} col-4`}></div>
                                                                                    <b className={`${style.col4} col-4`}>Short Term</b>
                                                                                    <b className={`${style.col4} col-4`}>Long Term</b>
                                                                                </div>
                                                                                <div className="row">
                                                                                    <div className={`${style.col4} col-4`}>Total Proceeds</div>
                                                                                    <div className={`${style.col4} col-4`}>${report ? report.totalProceeds ? report.totalProceeds.SHORT_TERM ? Number(report.totalProceeds.SHORT_TERM).toLocaleString("en-US") : '0.00' : '0.00' : ''}</div>
                                                                                    <div className={`${style.col4} col-4`}>${report ? report.totalProceeds ? report.totalProceeds.LONG_TERM ? Number(report.totalProceeds.LONG_TERM).toLocaleString("en-US") : '0.00' : '0.00' : ''}</div>
                                                                                    <div className={`${style.col4} col-4`}>Total Costs</div>
                                                                                    <div className={`${style.col4} col-4`}>${report ? report.totalCost ? report.totalCost.SHORT_TERM ? Number(report.totalCost.SHORT_TERM).toLocaleString("en-US") : '0.00' : '0.00' : ''}</div>
                                                                                    <div className={`${style.col4} col-4`}>${report ? report.totalCost ? report.totalCost.LONG_TERM ? Number(report.totalCost.LONG_TERM).toLocaleString("en-US") : '0.00' : '0.00' : ''}</div>
                                                                                </div>
                                                                                <div className="total row">
                                                                                    <b className={`${style.col4} col-4`}>Total Capital Gain/Loss</b>
                                                                                    <b className={`${style.col4} col-4`}>${report ? report.shortTermGain ? Number(report.shortTermGain).toLocaleString("en-US") : '0.00' : '0.00'}</b>
                                                                                    <b className={`${style.col4} col-4`}>${report ? report.longTermGain ? Number(report.longTermGain).toLocaleString("en-US") : '0.00' : '0.00'}</b>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="accordion-item">
                                                                        <h2 className="accordion-header" id="flush-headingTwo">
                                                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#taxable" aria-expanded="false" aria-controls="taxable">
                                                                                <b>Taxable Income</b>
                                                                            </button>
                                                                        </h2>
                                                                        <div id="taxable" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                                                                            <div className={`${style.capitalDiv} accordion-body`}>
                                                                                <div className={`row ${style.heading} mt-2 border-top-0`}>
                                                                                    <b className={`${style.col6} col-6`}>Taxable Income</b>
                                                                                    <b className={`${style.col6} col-6`}>Amount</b>
                                                                                </div>
                                                                                <div className="row">
                                                                                    {
                                                                                        report ?
                                                                                            <>
                                                                                                {
                                                                                                    report.incomeResult ?
                                                                                                        <>
                                                                                                            {
                                                                                                                Object.keys(report.incomeResult).map((key: any) => {
                                                                                                                    return (
                                                                                                                        <>
                                                                                                                            <div className={`${style.col6} col-6`}>{key.replace('_', ' ')}</div>
                                                                                                                            <div className={`${style.col6} col-6`}>${Number(report.incomeResult[key]).toLocaleString("en-US")}</div>
                                                                                                                        </>
                                                                                                                    )
                                                                                                                })
                                                                                                            }
                                                                                                        </> :
                                                                                                        <>
                                                                                                            <div className="text-center">No Income Transactions</div>
                                                                                                        </>
                                                                                                }

                                                                                            </> :
                                                                                            <>
                                                                                            </>
                                                                                    }
                                                                                </div>
                                                                                <div className="total row">
                                                                                    <b className={`${style.col6} col-6`}>Total Income</b>
                                                                                    <b className={`${style.col6} col-6`}>${report ? report.netIncomeGain ? Number(report.netIncomeGain).toLocaleString("en-US") : '0.00' : '0.00'}</b>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="accordion-item">
                                                                        <h2 className="accordion-header" id="flush-headingThree">
                                                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#gifts" aria-expanded="false" aria-controls="gifts">
                                                                                <b>Gifts/Donations</b>
                                                                            </button>
                                                                        </h2>
                                                                        <div id="gifts" className="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                                                                            <div className={`${style.capitalDiv} accordion-body`}>
                                                                                <div className={`row ${style.heading} mt-2 border-top-0`}>
                                                                                    <b className={`${style.col6} col-6`}>Gifts/Donations</b>
                                                                                    <b className={`${style.col6} col-6`}>Amount</b>
                                                                                </div>
                                                                                <div className="row">
                                                                                    <div className={`${style.col6} col-6`}>Gift Sent</div>
                                                                                    <div className={`${style.col6} col-6`}>${report ? report.giftAndDonations ? report.giftAndDonations['Gift Sent'] ? Number(report.giftAndDonations["Gift Sent"]).toLocaleString("en-US") : '0.00' : '0.00' : '0.00'}</div>
                                                                                    <div className={`${style.col6} col-6`}>Gift Received</div>
                                                                                    <div className={`${style.col6} col-6`}>${report ? report.giftReceived ? Number(report.giftReceived).toLocaleString("en-US") : '0.00' : '0.00'}</div>
                                                                                    <div className={`${style.col6} col-6`}>Donation</div>
                                                                                    <div className={`${style.col6} col-6`}>${report ? report.giftAndDonations ? report.giftAndDonations["Donation"] ? Number(report.giftAndDonations["Donation"]).toLocaleString("en-US") : '0.00' : '0.00' : '0.00'}</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="accordion-item">
                                                                        <h2 className="accordion-header" id="flush-headingFour">
                                                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#lostStolen" aria-expanded="false" aria-controls="lostStolen">
                                                                                <b>Lost Or Stolen</b>
                                                                            </button>
                                                                        </h2>
                                                                        <div id="lostStolen" className="accordion-collapse collapse" aria-labelledby="flush-headingFour" data-bs-parent="#accordionFlushExample">
                                                                            <div className={`${style.capitalDiv} accordion-body`}>
                                                                                <div className={`row ${style.heading} mt-2 border-top-0`}>
                                                                                    <b className={`${style.col6} col-6`}>Lost or Stolen</b>
                                                                                    <b className={`${style.col6} col-6`}>Amount</b>
                                                                                </div>
                                                                                <div className="row">
                                                                                    {
                                                                                        report ?
                                                                                            report.lostOrStolen ?
                                                                                                <>
                                                                                                    {
                                                                                                        Object.keys(report.lostOrStolen).map((key: any) => {
                                                                                                            return (
                                                                                                                <>
                                                                                                                    <div className={`${style.col6} col-6`}>- {key}</div>
                                                                                                                    <div className={`${style.col6} col-6`}>${Number(report.lostOrStolen[key]).toLocaleString("en-US")}</div>
                                                                                                                </>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </> :
                                                                                                <>
                                                                                                    <div className="row">
                                                                                                        <div className={`${style.col6} col-6`}>Stolen</div>
                                                                                                        <div className={`${style.col6} col-6`}>$0.00</div>
                                                                                                        <div className={`${style.col6} col-6`}>Lost Investment</div>
                                                                                                        <div className={`${style.col6} col-6`}>$0.00</div>
                                                                                                        <div className={`${style.col6} col-6`}>Other Lost</div>
                                                                                                        <div className={`${style.col6} col-6`}>$0.00</div>
                                                                                                    </div>
                                                                                                </> : <>

                                                                                            </>
                                                                                    }
                                                                                </div>
                                                                                <div className="total row">
                                                                                    <b className={`${style.col6} col-6`}>Total Lost or Stolen</b>
                                                                                    <b className={`${style.col6} col-6`}>${report ? report.lostOrStolen ? Number(getTotalLostOrStolen(report.lostOrStolen)).toLocaleString("en-US") : '0.00' : '--'}</b>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="accordion-item">
                                                                        <h2 className="accordion-header" id="flush-headingFive">
                                                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#settings" aria-expanded="false" aria-controls="settings">
                                                                                <b>Settings</b>
                                                                            </button>
                                                                        </h2>
                                                                        <div id="settings" className="accordion-collapse collapse" aria-labelledby="flush-headingFive" data-bs-parent="#accordionFlushExample">
                                                                            <div className={`${style.capitalDiv} accordion-body`}>
                                                                                <div className={`row ${style.heading} mt-2 border-top-0 pb-2`}>
                                                                                    <b className={`${style.col6} col-6`}>Settings</b>
                                                                                    <a href="/settings" className={`${style.col6} col-6`}><img src={imageHost + '/settings-icon.svg'} alt="settings" /></a>
                                                                                </div>
                                                                                <div className="row">
                                                                                    <div className={`${style.col6} col-6`}>Base Currency</div>
                                                                                    <div className={`${style.col6} col-6`}>{report ? report.resultCurrency ? report.resultCurrency : '' : ''}</div>
                                                                                </div>
                                                                                <hr />
                                                                                <div className="row">
                                                                                    <div className={`${style.col6} col-6`}>Country</div>
                                                                                    <div className={`${style.col6} col-6`}>USA</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </> :
                                                    <>
                                                        {
                                                            generateReportMessage ?
                                                                <><div className="text-center mt-5">
                                                                    <img className='img-fluid mb-4' src={imageHost + '/no-summary-mascot.svg'} alt="No Summary Mascot" />
                                                                    <div>You can generate the report by clicking on generate report button.</div>
                                                                    <button className={`${style.viewSummary} ms-3 mt-1`} onClick={() => { generateReport(); }}>Generate Report</button>
                                                                </div></> :
                                                                <>
                                                                    {
                                                                        showInvalidPlanErr ?
                                                                            <div className="text-center mt-5">
                                                                                <img src={imageHost + '/upgrade-plan-mascot.svg'} alt="" className="img-fluid mb-4" />
                                                                                <div>{invalidErr}</div>
                                                                                {showUpgradePlan &&
                                                                                    <button onClick={() => { router.push('/plans') }} className={`${style.viewSummary} mt-3`}>Upgrade Plan</button>
                                                                                }
                                                                                {
                                                                                    showAddOnBtn &&
                                                                                    <button onClick={() => { router.push('/add-on') }} className={`${style.viewSummary} mt-3`}>Buy Add On</button>
                                                                                }

                                                                            </div> :
                                                                            <>
                                                                                {
                                                                                    showAddAccountErr ?
                                                                                        <div className="text-center mt-5">
                                                                                            <img className='img-fluid' src={imageHost + '/add-account-mascot.svg'} alt="" />
                                                                                            <div>Please add the account to Generate the Tax summary</div>
                                                                                            <button onClick={() => { router.push('/add-account') }} className={`${style.viewSummary} mt-3`}>Add Account</button>
                                                                                        </div> :
                                                                                        <div className="mascot text-center mt-5">
                                                                                            <img src={imageHost + '/raised-hands-mascot.svg'} alt="" className="img-fluid mb-4" />
                                                                                            <div>You can check your tax summary by selecting Year and Calculation Method
                                                                                                and clicking on View Summary Button.</div>
                                                                                        </div>
                                                                                }

                                                                            </>

                                                                    }
                                                                </>
                                                        }

                                                    </>
                                            }
                                        </>
                                }

                            </>
                    }


                    <hr className='mt-5' />
                    <div className={`${style.taxFooter} mt-5`}>
                        <b>Found our tax analysis tool helpful? Check out our other products</b>
                        <div className={`${style.products} d-none d-md-flex`}>
                            <div className='text-center me-2 position-relative'>
                                <img src={imageHost + '/tax-footer-img1.svg'} alt="" className="img-fluid position-absolute" />
                                <p className={`${style.productName}`}>confused about your next investment?</p>
                                <p className={`${style.description}`}>
                                    Try our AI/ML based investment strategies tailored specifically for you and save big</p>
                                <button onClick={() => { router.push('/investment-strategies'); window.scrollTo(0, 0); }}>Explore</button>
                            </div>
                            <div className='text-center ms-1 me-1 position-relative'>
                                <img src={imageHost + '/tax-footer-img2.svg'} alt="" className="img-fluid position-absolute" />
                                <p className={`${style.productName}`}>Want to see the real time portfolio performance?</p>
                                <p className={`${style.description}`}>Checkout our portfolio manager which tracks your crypto assets and performance</p>
                                <button onClick={() => { router.push('/users-portfolio'); window.scrollTo(0, 0); }}>Explore</button>
                            </div>
                            <div className='text-center ms-2 position-relative'>
                                <img src={imageHost + '/tax-footer-img3.svg'} alt="" className="img-fluid position-absolute" />
                                <p className={`${style.productName}`}>Pay By Crypto</p>
                                <p className={`${style.description}`}>spend crypto at your favorite outlets through our secure, fast and affordable payment gateway</p>
                                <button onClick={() => { router.push('/pay-by-crypto'); window.scrollTo(0, 0); }}>Explore</button>
                            </div>
                        </div>
                        <div className={`${style.productsMobile} d-block d-md-none`}>
                            <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel" data-bs-interval="10000">
                                <div className={`${style.carouselInner} carousel-inner`}>
                                    <div className="carousel-item active">
                                        <div className={`text-center me-2 position-relative ${style.productDiv}`}>
                                            <img src={imageHost + '/tax-footer-img1.svg'} alt="" className="img-fluid position-absolute" />
                                            <p className={`${style.productName}`}>confused about your next investment?</p>
                                            <p className={`${style.description}`}>
                                                Try our AI/ML based investment strategies tailored specifically for you and save big</p>
                                            <button onClick={() => { router.push('/investment-strategies'); window.scrollTo(0, 0); }}>Explore</button>
                                        </div>
                                    </div>
                                    <div className="carousel-item">
                                        <div className={`text-center ms-1 me-1 position-relative ${style.productDiv}`}>
                                            <img src={imageHost + '/tax-footer-img2.svg'} alt="" className="img-fluid position-absolute" />
                                            <p className={`${style.productName}`}>Want to see the real time portfolio performance?</p>
                                            <p className={`${style.description}`}>Checkout our portfolio manager which tracks your crypto assets and performance</p>
                                            <button onClick={() => { router.push('/users-portfolio'); window.scrollTo(0, 0); }}>Explore</button>
                                        </div>
                                    </div>
                                    <div className="carousel-item">
                                        <div className={`text-center ms-2 position-relative ${style.productDiv}`}>
                                            <img src={imageHost + '/tax-footer-img3.svg'} alt="" className="img-fluid position-absolute" />
                                            <p className={`${style.productName}`}>Pay By Crypto</p>
                                            <p className={`${style.description}`}>spend crypto at your favorite outlets through our secure, fast and affordable payment gateway</p>
                                            <button onClick={() => { router.push('/pay-by-crypto'); window.scrollTo(0, 0); }}>Explore</button>
                                        </div>
                                    </div>
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='d-none d-lg-block'>
                    <RightFeed />
                </div>
            </div>
        </>
    )

}

export default TaxReport