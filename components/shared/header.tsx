import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import style from '../../styles/shared/header.module.scss';
import Cookies from 'js-cookie'
import MainService from '../../services/main-service';

function Header() {
    let router = useRouter();
    var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;
    const [tokens, setTokens] = useState<any>(Cookies.get('accessTokens'));
    const [userName, setUserName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [navbarCollapse, setNavbarCollapse] = useState(false);

    function fetchTokens() {
        return Cookies.get('accessTokens');
    }

    const toggleNavbar = () => {
        setNavbarCollapse(!navbarCollapse);
    };
    let mainServicePost: any = MainService('post');


    useEffect(() => {
        console.log("HEADER'S USE EFFECT")
        console.log(fetchTokens());
        getUserDetails();
        if (fetchTokens())
            setIsLoggedIn(true);
        else
            setIsLoggedIn(false);
    }, [])

    async function getUserDetails() {
        if (Cookies.get('username')) {

            setUserName(Cookies.get('username')!)
        }
    }

    return (
        <>
            {/* DESKTOP VIEW */}
            <nav className={`d-none d-lg-block navbar p-0 fixed-top navbar-expand-lg navbar-light bg-light ${style.header}`}>
                <div className="container d-flex justify-content-between">
                    <a className={`navbar-brand ${style.logoDiv}`} href="#"><img className={`img-fluid ${style.logo}`} src={imageHost + '/reverse-logo.svg'} alt="Main Logo" /></a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            {
                                !isLoggedIn &&
                                <li className="nav-item">
                                    <a className={`nav-link me-2 me-xl-5 ${style.navLink} active`} aria-current="page" onClick={() => { router.push('/') }}>Home</a>
                                </li>
                            }
                            <li className="nav-item dropdown">
                                <a className={`nav-link me-2 me-xl-5 ${style.navLink} dropdown-toggle`} href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Products
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarScrollingDropdown">
                                    <li><a className="dropdown-item" href="#">Portfolio</a></li>
                                    {
                                        isLoggedIn ?
                                            <>
                                                <li><a className="dropdown-item" onClick={() => { router.push('/tax-report') }}>Tax Summary</a></li>
                                                <li><a className="dropdown-item" onClick={() => { router.push('/tax-analysis') }}>Tax Analysis</a></li>
                                            </> :
                                            <li><a className="dropdown-item" href="#">Crypto Tax</a></li>
                                    }
                                    <li><a className="dropdown-item" href="#">Investment Strategies</a></li>
                                    <li><a className="dropdown-item" href="#">Pay By Crypto</a></li>
                                    <li><a className="dropdown-item" href="#">CRPTM Cloud</a></li>
                                </ul>
                            </li>
                            {
                                isLoggedIn &&
                                <li className="nav-item dropdown">
                                    <a className={`nav-link me-2 me-xl-5 ${style.navLink} dropdown-toggle`} href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Accounts
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby="navbarScrollingDropdown">
                                        <li><a className="dropdown-item" href="#">Add Accounts</a></li>
                                        <li><a className="dropdown-item" href="#">My Accounts</a></li>
                                    </ul>
                                </li>
                            }
                            {
                                !isLoggedIn ?
                                    <li className="nav-item">
                                        <a className={`nav-link me-2 me-xl-5 ${style.navLink}`} onClick={() => { router.push('/integrations') }}>Integrations</a>
                                    </li> :
                                    <li className="nav-item">
                                        <a className={`nav-link me-2 me-xl-5 ${style.navLink}`} onClick={() => { router.push('/transactions') }}>Transactions</a>
                                    </li>
                            }

                            <li className="nav-item">
                                <a className={`nav-link me-2 me-xl-5 ${style.navLink}`} onClick={() => { router.push('/plans') }}>Pricing</a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link me-2 me-xl-5 ${style.navLink}`} onClick={() => { router.push('/blogs') }}>Blog</a>
                            </li>
                        </ul>
                    </div>
                    <div className="d-none d-lg-block">
                        {
                            isLoggedIn ?
                                <div className="dropdown">
                                    <button role="button" data-bs-toggle="dropdown" className={`dropdown-toggle ${style.userName}`}><img className='img-fluid me-3' src={imageHost + '/user-icon.svg'} alt="" />{userName ? userName : ''}</button>
                                    <div className="dropdown-menu">
                                        <li><a className="dropdown-item" onClick={() => { router.push('/settings') }}>Settings</a></li>
                                        <form action="/logout" method="get"><li><button className="dropdown-item" type='submit'>LogOut</button></li></form>

                                    </div>
                                </div> :
                                <div className="d-flex">
                                    <button className={`${style.loginBtn}`} onClick={() => { router.push('/login') }}>Login</button>
                                    <button className={`${style.signUpBtn}`} onClick={() => { router.push('/signup') }}>Sign Up</button>
                                    <img className='img-fluid' src={imageHost + '/usericon.svg'} alt="" />
                                </div>
                        }
                    </div>


                </div>
            </nav>

            {/* MOBILE VIEW */}
            <nav className={`d-block d-lg-none navbar p-0 fixed-top navbar-expand-lg navbar-light bg-light ${style.header}`}>
                <div className="container d-flex justify-content-between">
                    <a className={`navbar-brand ${style.logoDiv}`} href="#"><img className={`img-fluid ${style.logo}`} src={imageHost + '/reverse-logo.svg'} alt="Main Logo" /></a>
                    <button className={`${style.navbarToggler} ${navbarCollapse ? `` : `${style.collapsed}`} navbar-toggler collapsed d-flex d-lg-none flex-column`} type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" onClick={toggleNavbar}>
                        <span className={`${style.togglerIcon} ${style.topBar}`}></span>
                        <span className={`${style.togglerIcon} ${style.middleBar}`}></span>
                        <span className={`${style.togglerIcon} ${style.bottomBar}`}></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className={`navbar-nav ${style.navbarNav}`}>
                            {
                                !isLoggedIn &&
                                <li className="nav-item">
                                    <a className={`nav-link  ${style.navLink} active`} aria-current="page" onClick={() => { router.push('/') }}>Home</a>
                                </li>
                            }
                            <li className="nav-item dropdown">
                                <a className={`nav-link ${style.navLink} dropdown-toggle`} href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Products
                                </a>
                                <ul className={`dropdown-menu ${style.dropdownMenu}`} aria-labelledby="navbarScrollingDropdown">
                                    <li><a className="dropdown-item" href="#">Portfolio</a></li>
                                    {
                                        isLoggedIn ?
                                            <>
                                                <li><a className="dropdown-item" onClick={() => { router.push('/tax-report') }}>Tax Summary</a></li>
                                                <li><a className="dropdown-item" onClick={() => { router.push('/tax-analysis') }}>Tax Analysis</a></li>
                                            </> :
                                            <li><a className="dropdown-item" href="#">Crypto Tax</a></li>
                                    }
                                    <li><a className="dropdown-item" href="#">Investment Strategies</a></li>
                                    <li><a className="dropdown-item" href="#">Pay By Crypto</a></li>
                                    <li><a className="dropdown-item" href="#">CRPTM Cloud</a></li>
                                </ul>
                            </li>
                            {
                                isLoggedIn &&
                                <li className="nav-item dropdown">
                                    <a className={`nav-link ${style.navLink} dropdown-toggle`} href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Accounts
                                    </a>
                                    <ul className={`dropdown-menu ${style.dropdownMenu}`} aria-labelledby="navbarScrollingDropdown">
                                        <li><a className="dropdown-item" href="#">Add Accounts</a></li>
                                        <li><a className="dropdown-item" href="#">My Accounts</a></li>
                                    </ul>
                                </li>
                            }
                            {
                                !isLoggedIn ?
                                    <li className="nav-item">
                                        <a className={`nav-link ${style.navLink}`} onClick={() => { router.push('/integrations') }}>Integrations</a>
                                    </li> :
                                    <li className="nav-item">
                                        <a className={`nav-link ${style.navLink}`} onClick={() => { router.push('/transactions'); }}>Transactions</a>
                                    </li>
                            }

                            <li className="nav-item">
                                <a className={`nav-link ${style.navLink}`} onClick={() => { router.push('/plans') }}>Pricing</a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${style.navLink}`} onClick={() => { router.push('/blogs') }}>Blog</a>
                            </li>
                            {
                                isLoggedIn &&
                                <li className="nav-item">
                                    <a className={`nav-link ${style.navLink}`} onClick={() => { router.push('/settings') }}>Settings</a>
                                </li>
                            }
                            {
                                isLoggedIn ?
                                    <form action="/logout" method="get">
                                        <li className='nav-item'><button className={`nav-link m-auto ${style.navLink}`} type='submit'>LogOut</button></li>
                                    </form>
                                    :
                                    <>
                                        <li className="nav-item">
                                            <button className={`nav-link ${style.signup}`} onClick={() => { router.push('/signup') }}>Get Started For Free</button>
                                            <button className={`nav-link ${style.login}`} onClick={() => { router.push('/login') }}>Login</button>
                                        </li>
                                    </>
                            }

                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header