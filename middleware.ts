import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function middleWare(res: NextRequest) {
    let tokens: any = res.cookies._parsed.get('accessTokens')?.value
    // console.log(tokens);
    if (tokens === null || tokens === 'undefined' || tokens === undefined) {
        const loginUrl = new URL("login", res.url)
        return NextResponse.redirect(loginUrl)

    } else {
        const tokensObj = JSON.parse(tokens);
        if (tokensObj.access_token === undefined || tokensObj.access_token === "" || tokensObj.refresh_token === undefined || tokensObj.refresh_token === "") {
            const loginUrl = new URL("login", res.url)
            return NextResponse.redirect(loginUrl)
        }
    }
    const response = NextResponse.next();
    return response

}

export const config = {
    matcher: ['/add-account/:path*', '/tax-analysis/:path*', '/tax-report/:path*', '/transactions/:path*', '/payment/:path*', '/add-ons/:path*']
}