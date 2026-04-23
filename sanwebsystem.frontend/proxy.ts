import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCookieToken, getCookieSignedUser } from '@actions/cookies';

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico|layout/images|demo/images|api/|auth/|pages/access|pages/error|pages/notfound).*)',
    ],
};

export const proxy = async (request: NextRequest) => {
    const token = await getCookieToken();
    const signedUser = await getCookieSignedUser();
    const urlExceptions = ['/', '/auth/login', '/auth/logout'];

    if (
        !urlExceptions.includes(request.nextUrl.pathname) &&
        (!token || !signedUser)
    ) {
        return NextResponse.redirect(new URL('/pages/access', request.url));
    }
};
