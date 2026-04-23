'use server';

import { cookies } from 'next/headers';

const TOKEN_NAME = 'token';
const SIGNEDUSER_NAME = 'signeduser';
const MAX_AGE = 1000000;

const getCookie = async (name: string) => {
    return await cookies().then((cookieStore) => {
        if (!cookieStore.has(name)) {
            return undefined;
        }

        return cookieStore.get(name);
    });
};

const setCookie = async (name: string, value: string) => {
    (await cookies()).set(name, value, { maxAge: MAX_AGE });
};

const removeCookie = async (name: string) => {
    (await cookies()).delete(name);
};

export const setCookieToken = async (value: string | null | undefined) => {
    if (!value) {
        await removeCookie(TOKEN_NAME);
        return;
    }

    setCookie(TOKEN_NAME, value);
};

export const getCookieToken = async () => getCookie(TOKEN_NAME);

export const setCookieSignedUser = async (
    value: Auth.ISignedUser | null | undefined,
) => {
    if (!value) {
        await removeCookie(SIGNEDUSER_NAME);
        return;
    }

    setCookie(SIGNEDUSER_NAME, JSON.stringify(value));
};

export const getCookieSignedUser = async () => getCookie(SIGNEDUSER_NAME);

export const getCookieTokenName = async () => TOKEN_NAME;
export const getCookieSignedUserName = async () => SIGNEDUSER_NAME;
