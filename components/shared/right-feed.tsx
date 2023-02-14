import React from 'react';
import style from '../../styles/shared/right-feed.module.scss';

const RightFeed = () => {
    return (
        <div className={`${style.feedPortfolio} px-0`}>
            <div className={`${style.topGainers} px-3`}>
                <div className='d-flex justify-content-between'>
                    <h4 className={`${style.topGainersHeading} mt-4`}>Did you know?</h4>
                </div>
                <div className={`${style.gainerDiv} border border-1 mb-3`}>
                    <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                        <div className={`carousel-inner ${style.innerCarousel}`}>
                            <div className="carousel-item active" data-bs-interval="4000">
                                <p className="d-block w-100">The first commercial bitcoin transaction was done for 10,000 BTC for 2 pizzas</p>
                            </div>
                            <div className="carousel-item" data-bs-interval="4000">
                                <p className="d-block w-100">There are more than 16,000 cryptocurrencies in existence</p>
                            </div>
                            <div className="carousel-item" data-bs-interval="4000">
                                <p className="d-block w-100">The total 21 million of bitcoins can be created.</p>
                            </div>
                            <div className="carousel-item" data-bs-interval="4000">
                                <p className="d-block w-100">US owns the maximum crypto ATMs</p>
                            </div>
                            <div className="carousel-item" data-bs-interval="4000">
                                <p className="d-block w-100">Crypto currencies are taxable </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr className={`${style.lineBreak}`} />
            <div className={`${style.cryptoFeed} px-3`}>
                <div className='d-flex justify-content-between'>
                    <h4 className={`${style.topGainersHeading} mt-4`}>Learn About Cryptos</h4>
                </div>
                <div className={`${style.feedDiv}`}>
                    <p className='mt-3'>The current crypto environment is composed of an amazing variety of digital assets with varied technical specifications and intended purposes...</p>
                    <a href="/blog" target="_blank" className={`${style.feedLink}`}>Find out more...</a>
                </div>
            </div>
        </div>
    )
}

export default RightFeed