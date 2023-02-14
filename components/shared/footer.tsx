import { useRouter } from 'next/router';
import React from 'react'
import style from '../../styles/shared/footer.module.scss';

function Footer() {
    let router = useRouter();
    var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;
    return (
        <>
            <footer className={`${style.footer} w-100 position-relative ps-5 ps-lg-0`}>
                <img className={`${style.triangle} position-absolute`} src={imageHost + '/arrow-cut-shape.png'} alt="" />
                <div className="d-block d-lg-flex flex-wrap justify-content-center">
                    <div className={`${style.productsDiv} mt-3`}>
                        <h2 className={`${style.heading}`}>Products</h2>
                        <div><a href="">Portfolio Tracker</a></div>
                        <div><a href="">Crypto Tax</a></div>
                        <div><a href="">Investment Strategies</a></div>
                        <div><a href="">Pay By Crypto</a></div>
                        <div><a href="">CRPTM Cloud</a></div>
                    </div>
                    <div className={`${style.productsDiv} mt-3`}>
                        <h2 className={`${style.heading}`}>Company Info</h2>
                        <div><a href="">Privacy Policy</a></div>
                        <div><a href="">Terms Of Use</a></div>
                        <div><a href="">Contact Us</a></div>
                        <div><a href="">FAQs</a></div>
                    </div>
                    <div className={`${style.productsDiv} mt-3`}>
                        <h2 className={`${style.heading}`}>Resources</h2>
                        <div><a href="">Integrations</a></div>
                        <div><a href="">Pricing</a></div>
                        <div><a href="">Blog</a></div>
                    </div>
                    <div className='mt-3'>
                        <h2 className={`${style.followUs} mb-4`}>Follow Us</h2>
                        <div className='d-flex'>
                            <a href="https://www.facebook.com/crptm.official" className='me-2' target="_blank">
                                <img src={imageHost + "/facebook.svg"} alt="" />
                            </a>
                            <a href="https://twitter.com/CrptmOfficial" className='me-2' target="_blank">
                                <img src={imageHost + "/twitter.svg"} alt="" />
                            </a>
                            <a href="https://www.instagram.com/crptm.official/" className='me-2' target="_blank">
                                <img src={imageHost + "/instagram.svg"} alt="" />
                            </a>
                            <a href="https://www.youtube.com/channel/UCy6IZhZ3GQd4_tkiyAEyo_g" className='me-2' target="_blank">
                                <img src={imageHost + "/youtube.svg"} alt="" />
                            </a>
                            <a href="https://www.linkedin.com/company/crptm/" className='me-2' target="_blank">
                                <img src={imageHost + "/linkedin-icon.svg"} alt="" />
                            </a>
                        </div>
                        <h2 className={`${style.followUs} mt-4`}>About Us</h2>
                        <img className="img-fluid mt-1" src={imageHost + "/logo-with-tagline.svg?v=1"} alt="logo-with-tagline" />
                        <div className={`${style.aboutUsBlurb} mt-3`}>At CRPTM, we cherish the vision to
                            provide a trusted and…<a onClick={() => { router.push('/about-us') }}> Read more</a></div>
                    </div>
                </div>

            </footer>
            <div className={`${style.copyrightDiv} text-center w-100`}>© 2022 CRPTM - All Rights Reserved</div>
        </>
    )
}

export default Footer
