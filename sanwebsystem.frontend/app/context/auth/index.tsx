'use client';

import React, { createContext, useEffect, useMemo, useReducer } from 'react';
import { Auth, Control } from '@types';
import fetchServiceClient from '@actions/fetchclient';
import { setCookieSignedUser, setCookieToken } from '@actions/cookies';

export const AuthContext = createContext({
    parametro: null,
    signedUser: null,
    parceiro: null,
    token: null,
} as Auth.AuthContextProps);

export enum AuthType {
    PARAMETRO = 'PARAMETRO',
    SIGNEDUSER = 'SIGNEDUSER',
    PARCEIRO = 'PARCEIRO',
    TOKEN = 'TOKEN',
}

export type AuthAction = {
    type: AuthType;
    payload?:
        | Control.IParametro
        | Control.IParceiro
        | Auth.ISignedUser
        | string
        | null;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [auth, dispatch] = useReducer(
        (state: Auth.AuthContextProps, action: AuthAction) => {
            switch (action.type) {
                case AuthType.PARAMETRO:
                    return {
                        ...state,
                        parametro: action.payload,
                    };
                case AuthType.SIGNEDUSER:
                    setCookieSignedUser(action.payload);

                    return {
                        ...state,
                        signedUser: action.payload,
                    };
                case AuthType.TOKEN:
                    setCookieToken(action.payload as string | null);

                    return {
                        ...state,
                        token: action.payload as string | null,
                    };
                default:
                    return state;
            }
        },
        {
            parametro: null,
            signedUser: null,
            parceiro: null,
            token: null,
        },
    );

    useEffect(() => {
        const getParametro = async () => {
            return await fetchServiceClient({
                url: `${process.env.NEXT_PUBLIC_API_URL}/api/parametro`,
                method: `GET`,
            });
        };

        dispatch({ type: AuthType.PARAMETRO, payload: getParametro() });
    }, []);

    const value = useMemo(
        () => ({
            auth,
            dispatch,
            isAuthenticated: () =>
                auth.token != null &&
                auth.token != undefined &&
                auth.token != '',
        }),
        [auth],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
