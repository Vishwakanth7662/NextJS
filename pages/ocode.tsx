import React from 'react';
import axios from 'axios';
import MainService from "../services/main-service";
import Link from 'next/link';
import nookies from 'nookies'
import { useRouter } from 'next/router';
import GetUserDetails from '../components/getUserDetails';

let domain = process.env.NEXT_PUBLIC_BASEURL!;
export async function getServerSideProps(context: any) {
    let code: any;
    let data: any;
    const cookies = nookies.get(context);
    const id = context.query;
    let againReturnUrl = context.query.state;
    let codeOne = context.query.code;
    if (code !== null || code !== undefined || code !== "") {
        let url: String = `/oauth/token?grant_type=authorization_code&code=${codeOne}&scope=read&state=${againReturnUrl}`
        let joinUrl = domain + url;
        await axios.post(joinUrl, null, {
            headers: {
                Authorization: "Basic " + process.env.NEXT_PUBLIC_CLIENT_OAUTH_DETAILS
            }
        }).then((res: any) => {
            data = res.data;
            console.log("DATA SENT BY BE");
            console.log(JSON.stringify(data));
        }).catch((e: any) => {
            console.log(e);
        })
        if (data) {
            try {
                let response: any = await GetUserDetails(JSON.stringify(data));
                nookies.set(context, 'username', response.username, {
                    maxAge: 3600,
                    path: '/',
                })
            }
            catch (e: any) {
                console.log(e);
            }
            nookies.destroy(context, 'accessTokens');
            nookies.set(context, 'accessTokens', JSON.stringify(data), {
                maxAge: 3600,
                path: '/',
            })

            return {
                props: {
                    todo: data
                },
                redirect: {
                    destination: `/${againReturnUrl}`,
                    permanent: false,
                }
            }
        } else {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                }
            }
        }
    }
}
const Ocode = ({ todo }: any) => {
    const router = useRouter();
    return (
        <>
            ocode
        </>
    )
}

export default Ocode