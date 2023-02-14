import React from 'react'
import MainService from '../services/main-service'
import nookies from 'nookies';

export async function getServerSideProps(context: any) {
    const cookies = nookies.get(context);
    let tokens = cookies.accessTokens;
    let mainServicePost: any = MainService('post');
    try {
        let res = await mainServicePost('/logout', 'user', null, null, tokens);
        console.log(res);
    }
    catch (e: any) {
        console.log(e);
    }

    Object.keys(nookies.get(context)).forEach(key => {
        nookies.destroy(context, key)
    });

    return {
        redirect: {
            destination: `/login`,
            permanent: false,
        }
    }
}

function Logout() {
    return (
        <div>Logout</div>
    )
}

export default Logout