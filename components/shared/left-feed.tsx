import React, { useState } from "react";
import { useRouter } from "next/router";
import style from '../../styles/shared/left-feed.module.scss';


const LeftFeed = () => {
    var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;
    let router = useRouter();

    return (
        <div className={`${style.leftFeedPortfolio} px-0 py-4`}>
            {router.pathname === `/users-portfolio` ? (
                <div className={`${style.homePortfolioIcon} all-icon-hover ${style.exchangePortfolioSctive} text-center ms-auto`}>
                    <a
                        onClick={() => {
                            router.push("/users-portfolio");
                        }}
                    >
                        <img
                            className="mt-3"
                            src={imageHost + "/portfolio-main-feed.svg"}
                            alt=""
                        />
                    </a>
                </div>
            ) : (
                <div className={`${style.homePortfolioIcon} all-icon-hover exchange-portfolio text-center ms-auto`}>
                    <a onClick={() => router.push("/users-portfolio")}>
                        <img
                            className="mt-3"
                            src={imageHost + "/portfolio-home-white.svg"}
                            alt=""
                        />
                    </a>
                </div>
            )}
            {router.pathname === `/add-account` ||
                router.pathname === `/add-account/import` ? (
                <div className={`${style.exchangePortfolioIcon} ${style.exchangeSettingsActive} all-icon-hover text-center ms-auto`}>
                    <a
                        onClick={() => {
                            router.push("/add-account");
                        }}
                    >
                        <img
                            className="mt-3"
                            src={imageHost + "/add-account-orange.svg"}
                            alt=""
                        />
                    </a>
                </div>
            ) : (
                <div className={`${style.exchangePortfolioIcon} exchange-settings all-icon-hover text-center ms-auto`}>
                    <a
                        onClick={() => {
                            router.push("/add-account");
                        }}
                    >
                        <img className="mt-3" src={imageHost + "/add-account.svg"} alt="" />
                    </a>
                </div>
            )}
            {router.pathname === `/my-accounts` ? (
                <div className={`${style.homePortfolioIcon} all-icon-hover ${style.exchangeMyaccountsActive}text-center ms-auto`}>
                    <a
                        onClick={() => {
                            router.push("/my-accounts");
                        }}
                    >
                        <img
                            className="mt-3"
                            src={imageHost + "/portfolio-home-orange.svg"}
                            alt=""
                        />
                    </a>
                </div>
            ) : (
                <div className={`${style.homePortfolioIcon} all-icon-hover exchange-myaccounts text-center ms-auto`}>
                    <a onClick={() => router.push("/my-accounts")}>
                        <img
                            className="mt-3"
                            src={imageHost + "/portfolio-home-feed.svg"}
                            alt=""
                        />
                    </a>
                </div>
            )}
            {router.pathname === `/tax-report` ? (
                <div className={`${style.exchangePortfolioIcon} ${style.exchangeSettingsActive} all-icon-hover text-center ms-auto`}>
                    <a
                        onClick={() => {
                            router.push("/tax-report");
                        }}
                    >
                        <img
                            className="mt-3"
                            src={imageHost + "/tax-icon-orange.svg"}
                            alt=""
                        />
                    </a>
                </div>
            ) : (
                <div className={`${style.exchangePortfolioIcon} exchange-settings all-icon-hover text-center ms-auto`}>
                    <a
                        onClick={() => {
                            router.push("/tax-report");
                        }}
                    >
                        <img
                            className="mt-3"
                            src={imageHost + "/tax-icon-white.svg"}
                            alt=""
                        />
                    </a>
                </div>
            )}
            {router.pathname === `/tax-analysis` ? (
                <div className={`${style.exchangePortfolioIcon} ${style.exchangeSettingsActive} all-icon-hover text-center ms-auto`}>
                    <a
                        onClick={() => {
                            router.push("/tax-analysis");
                        }}
                    >
                        <img
                            className="mt-3"
                            src={imageHost + "/tax-analysis-orange.svg"}
                            alt=""
                        />
                    </a>
                </div>
            ) : (
                <div className={`${style.exchangePortfolioIcon} exchange-settings all-icon-hover text-center ms-auto`}>
                    <a
                        onClick={() => {
                            router.push("/tax-analysis");
                        }}
                    >
                        <img
                            className="mt-3"
                            src={imageHost + "/tax-analysis-white.svg"}
                            alt=""
                        />
                    </a>
                </div>
            )}
            {router.pathname === `/settings?tab=1` ||
                router.pathname === `/settings?tab=2` ||
                router.pathname === `/settings?tab=3` ||
                router.pathname === `/settings?tab=4` ||
                router.pathname === `/settings?tab=5` ||
                router.pathname === `/settings?tab=6` ? (
                <div className={`${style.exchangePortfolioIcon} ${style.exchangeSettingsActive} all-icon-hover text-center ms-auto`}>
                    <a
                        onClick={() => {
                            router.push("/settings?tab=1");
                        }}
                    >
                        <img
                            className="mt-3"
                            src={imageHost + "/settings-orange.svg"}
                            alt=""
                        />
                    </a>
                </div>
            ) : (
                <div className={`${style.exchangePortfolioIcon} exchange-settings all-icon-hover text-center ms-auto`}>
                    <a
                        onClick={() => {
                            router.push("/settings?tab=1");
                        }}
                    >
                        <img
                            className="mt-3"
                            src={imageHost + "/settings-white.svg"}
                            alt=""
                        />
                    </a>
                </div>
            )}
            {router.pathname === `/transactions` ? (
                <div className={`${style.exchangePortfolioIcon} ${style.exchangeSettingsActive} all-icon-hover text-center ms-auto`}>
                    <a
                        onClick={() => {
                            router.push("/transactions");
                        }}
                    >
                        <img
                            className="mt-3"
                            src={imageHost + "/txns-orange-icon.svg"}
                            alt=""
                        />
                    </a>
                </div>
            ) : (
                <div className={`${style.exchangePortfolioIcon} exchange-settings all-icon-hover text-center ms-auto`}>
                    <a
                        onClick={() => {
                            router.push("/transactions");
                        }}
                    >
                        <img
                            className="mt-3"
                            src={imageHost + "/txns-white-icon.svg"}
                            alt=""
                        />
                    </a>
                </div>
            )}
        </div>
    );
};

export default LeftFeed;
