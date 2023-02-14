import { format } from 'date-fns';
import { useRouter } from 'next/router';
import React from 'react'
import style from '../../styles/pricing/premium-plan.module.scss'
var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;

function PaymentPlans(props: any) {
    let router = useRouter();
    let currentYr = format(new Date(), 'yyyy');
    let features = [
        "Exchanges/Wallets Integration",
        "Portfolio transactions",
        "Transactions for tax calculation",
        "Realtime Portfolio Performance",
        "Portfolio performance over last 90 days",
        "Daily portfolio updates",
        "Exchange API sync",
        "Custom CSV File Support",
        "10000+ cryptocurrencies",
        "8+ years of historical market data",
        "Transaction Sorting and Filtering",
        "Crypto as Income, Defi",
        "Mining or donations",
        "ICOs & Airdrops",
        "Mining, Staking, Lending, Forks",
        "Self transfer matching",
        "Exchange & transaction fee tracking",
        "HIFO/FIFO/LIFO",
        "Capital gains preview",
        "Current year tax Summary",
        `Download tax forms (${Number(currentYr) - 1} and ${currentYr})`,
        "Tax Analysis",
        "Form 8949, Schedule D, Schedule 1",
        "Tax summary by wallet/Exchanges",
    ];
    let newbieFeatures: any[] = [
        "Exchanges/Wallets Integration",
        "Portfolio transactions",
        "Transactions for tax calculation",
        "Realtime Portfolio Performance",
        "Portfolio performance over last 90 days",
        "Daily portfolio updates",
        "Exchange API sync",
        "Custom CSV File Support",
        "10000+ cryptocurrencies",
        "8+ years of historical market data",
        "Transaction Sorting and Filtering",
        "Crypto as Income, Defi",
        "Mining or donations",
        "ICOs & Airdrops",
        "Mining, Staking, Lending, Forks",
        "Self transfer matching",
        "Exchange & transaction fee tracking",
        "Current year tax Summary",
        "Capital gains preview",
        "HIFO/FIFO/LIFO",
    ];
    let starterFeatures: any[] = [
        "Exchanges/Wallets Integration",
        "Portfolio transactions",
        "Transactions for tax calculation",
        "Realtime Portfolio Performance",
        "Portfolio performance over last 90 days",
        "Daily portfolio updates",
        "Exchange API sync",
        "Custom CSV File Support",
        "10000+ cryptocurrencies",
        "8+ years of historical market data",
        "Transaction Sorting and Filtering",
        "Crypto as Income, Defi",
        "Mining or donations",
        "ICOs & Airdrops",
        "Mining, Staking, Lending, Forks",
        "Self transfer matching",
        "Exchange & transaction fee tracking",
        "Current year tax Summary",
        "Capital gains preview",
        "HIFO/FIFO/LIFO",
        `Download tax forms (${Number(currentYr) - 1} and ${currentYr})`,
        "Tax Analysis",
        "Form 8949, Schedule D, Schedule 1"
    ];
    let starterAddOn: any[] = ['5000 Transactions', 'Tax analysis', 'Form 8948, Schedule D'];
    let standardAddOn: any[] = ['Unlimited Transactions', 'Tax analysis', 'Form 8948, Schedule D', 'Tax summary by exchanges/wallets'];
    let detail = props.details;
    console.log(detail)
    return (
        <>
            {
                detail ?
                    <>
                        <div className={`${style.premiumPlan}`}>
                            <p className={`${style.mainTitle} d-flex justify-content-between`}>
                                <div>You have selected<br /><span className={`${style.planName}`}>{detail.planDisplayName} <span className={`${style.price}`}>{detail.planPrice === detail.paidPrice ? '' : '$' + detail.planPrice}</span> ${detail.paidPrice}</span>/{detail.frequencyDisplayName}</div>
                                <div className='d-none d-md-block'><button onClick={() => { router.push('/plans') }}>Change Plan</button></div>
                            </p>
                            {
                                detail.planDisplayName === 'Standard Plan' ?
                                    <>
                                        {
                                            features.map(feature => {
                                                return (
                                                    <p className={`${style.featureBorder}`}><img src={imageHost + "/orange-tick.svg"} alt="" /> {feature}</p>
                                                )
                                            })
                                        }
                                    </> :
                                    <>
                                        {
                                            detail.planDisplayName === 'Starter Plan' ?
                                                <>
                                                    {
                                                        starterFeatures.map(feature => {
                                                            return (
                                                                <p className={`${style.featureBorder}`}><img src={imageHost + "/orange-tick.svg"} alt="" /> {feature}</p>
                                                            )
                                                        })
                                                    }
                                                </> :
                                                <>
                                                    {
                                                        detail.planDisplayName === 'Newbie Plan' ?
                                                            <>
                                                                {
                                                                    newbieFeatures.map(feature => {
                                                                        return (
                                                                            <p className={`${style.featureBorder}`}><img src={imageHost + "/orange-tick.svg"} alt="" /> {feature}</p>
                                                                        )
                                                                    })
                                                                }
                                                            </> :
                                                            <>
                                                                {
                                                                    detail.planDisplayName === 'Standard Add On' ?
                                                                        <>
                                                                            {
                                                                                standardAddOn.map(feature => {
                                                                                    return (
                                                                                        <p className={`${style.featureBorder}`}><img src={imageHost + "/orange-tick.svg"} alt="" /> {feature}</p>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </> :
                                                                        <></>
                                                                }
                                                            </>
                                                    }
                                                </>
                                        }
                                    </>
                            }
                            <div>

                            </div>
                        </div>
                    </> :
                    <></>
            }

        </>

    )
}

export default PaymentPlans