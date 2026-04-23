'use server';

import { redirect } from 'next/navigation';
import {
    getCookieSignedUser,
    setCookieSignedUser,
    getCookieToken,
    setCookieToken,
} from './cookies';

const REDIRECT = '/auth/login';

export const redirectIfAuthenticated = async (url: string): Promise<void> => {
    const token = await getCookieToken();

    if (!token?.value) return;

    const signedUser = await getCookieSignedUser();

    if (signedUser?.value) redirect(url);
};

export const logoutService = async () => {
    await setCookieToken(null);
    await setCookieSignedUser(null);

    redirect(REDIRECT);
};
