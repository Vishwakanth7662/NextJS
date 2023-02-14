import nookies from 'nookies'

export default function getCurrenturl(context:any){
    nookies.set(context, 'currentURL', context.req.url.split("?")[0], {
        path: '/',
        maxAge: 3600,
    });
}