'use client';

import React, { useContext, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputOtp } from 'primereact/inputotp';
import { Toast, ToastMessage } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { LayoutContext } from '@layout/context/layoutcontext';
import Loading from '@ui/loading';
import { TFATipoEnum } from '@enums';
import fetchService from '@actions/fetch';
import { redirectIfAuthenticated } from '@actions/authenticate';
import { AuthContext, AuthType } from '@context/auth';

const TFAValidaPage = () => {
    const { auth, dispatch, isAuthenticated } = useContext(AuthContext);

    interface ITFAResponse {
        signedUser: Auth.ISignedUser;
        token: string | null;
        msgErro: string | null;
    }

    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const toast = useRef<Toast>(null);

    const showToast = (toastMessage: ToastMessage) => {
        toast.current?.show(toastMessage);
    };

    const chaveDefault: Auth.IGeraChaveTFA = {
        isErro: false,
        loginVo: auth.signedUser,
        login: auth.signedUser?.login ?? '',
        email: { value: '', message: '', isAlert: false },
    };

    const [chave, setChave] = useState<Auth.IGeraChaveTFA>(chaveDefault);
    const [code, setCode] = useState<string | number | undefined>('');

    useEffect(() => {
        Loading.hide();
    }, []);

    const gerarChaveTFA = () => {
        Loading.show();

        fetchService({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/tfa/generatecode`,
            method: `POST`,
            body: JSON.stringify(chave),
        })
            .then((data: Auth.IGeraChaveTFA | null) => {
                if (data != null && !data.isErro) {
                    dispatch({
                        type: AuthType.SIGNEDUSER,
                        payload: data.loginVo,
                    });
                    setChave(data);
                    showToast({
                        severity: 'info',
                        summary: 'Info',
                        detail: 'Senha enviada com sucesso para o seu e-mail associado!',
                    });
                }
            })
            .finally(() => {
                Loading.hide();
            });
    };

    const onGerarChaveTFAClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault();
        gerarChaveTFA();
    };

    const onRecomporTFAClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        Loading.show();

        fetchService({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/tfa/resetcode`,
            method: `POST`,
            body: auth.signedUser?.login ?? '',
        })
            .then((data: Auth.ISignedUser | null) => {
                if (data == null) return;

                dispatch({ type: AuthType.SIGNEDUSER, payload: data });

                setChave({
                    ...chave,
                    loginVo: data,
                    login: data.login,
                });

                showToast({
                    severity: 'info',
                    summary: 'Info',
                    detail: 'Acesso TFA refeito para a modalidade E-mail com sucesso!',
                });
            })
            .finally(() => {
                Loading.hide();
            });
    };

    const onSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (auth.signedUser?.tfaKey == null || auth.signedUser?.tfaKey == '') {
            gerarChaveTFA();
            return;
        }

        Loading.show();

        const body = {
            login: auth.signedUser?.login ?? '',
            code: code as string,
        };

        await fetchService({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/tfa/validatecode`,
            method: `POST`,
            body: JSON.stringify(body),
        }).then((data: ITFAResponse | null) => {
            if (data == null) {
                return;
            }

            if (data.msgErro != null && data.msgErro != '') {
                showToast({
                    severity: 'error',
                    summary: 'Erro',
                    detail: data.msgErro,
                });
                return;
            }

            dispatch({ type: AuthType.SIGNEDUSER, payload: data.signedUser });
            dispatch({ type: AuthType.TOKEN, payload: data.token });
        });

        if (isAuthenticated()) {
            await redirectIfAuthenticated(`/parceiro/acesso`);
        } else Loading.hide();
    };

    const containerClassName = classNames(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden',
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' },
    );

    return (
        <form className={containerClassName} onSubmit={onSubmit}>
            <div className="flex flex-column align-items-center justify-content-center w-4">
                <div className="flex justify-content-center flex-wrap">
                    <Image
                        src="/layout/images/logo_san.png"
                        alt="SAN Logo"
                        width={60}
                        height={60}
                    />
                </div>
                <div className="flex justify-content-center flex-wrap">
                    <span className="text-900 font-bold text-lg">
                        WEB SYSTEM
                    </span>
                </div>

                <div
                    className="mt-3"
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background:
                            'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)',
                    }}
                >
                    <div
                        className="surface-card py-4 px-5 sm:px-8"
                        style={{ borderRadius: '53px' }}
                    >
                        {(auth.signedUser?.tfaKey == null ||
                            auth.signedUser?.tfaKey == '') && (
                            <>
                                <div className="text-center mb-5">
                                    <span className="text-900 text-lg font-semibold">
                                        Confirme o e-mail que receberá seu
                                        código de validação.
                                    </span>
                                </div>

                                <div className="flex flex-column align-items-start justify-content-start mb-5 w-8">
                                    <label
                                        htmlFor="email"
                                        className="block text-900 text-lg font-medium mb-2"
                                    >
                                        E-mail
                                    </label>
                                    <InputText
                                        id="email"
                                        type="text"
                                        value={
                                            chave.email.value?.toString() || ''
                                        }
                                        invalid={chave.email.isAlert}
                                        onChange={(e) =>
                                            setChave({
                                                ...chave,
                                                email: {
                                                    ...chave.email,
                                                    value: e.target.value,
                                                },
                                            })
                                        }
                                        placeholder="Email associado"
                                        className="w-full md:w-30rem"
                                        style={{ padding: '1rem' }}
                                        required
                                        autoFocus
                                    />
                                </div>
                            </>
                        )}

                        {auth.signedUser?.tfaKey != null &&
                            auth.signedUser?.tfaKey != '' &&
                            (auth.signedUser?.tfaTipo ==
                                TFATipoEnum.Email.value ||
                                auth.signedUser?.tfaQrCodeImageUrl != null) && (
                                <>
                                    <div className="text-center mb-5">
                                        <span className="text-900 text-lg font-semibold">
                                            Prencha código{' '}
                                            {auth.signedUser?.tfaTipo ==
                                            TFATipoEnum.Google.value
                                                ? ' apresentado pelo Authenticator'
                                                : ' enviado para seu e-mail'}
                                            .
                                        </span>
                                    </div>

                                    <div className="flex flex-column align-items-start justify-content-start mb-5 w-8">
                                        <label
                                            htmlFor="login"
                                            className="block text-900 text-lg font-medium mb-2"
                                        >
                                            Código
                                        </label>
                                        <InputOtp
                                            value={code}
                                            length={6}
                                            onChange={(e) =>
                                                setCode(e.value as string)
                                            }
                                            integerOnly
                                            required
                                            autoFocus
                                        />
                                    </div>

                                    <div className="flex align-items-center justify-content-between mt-2">
                                        {auth.signedUser.tfaTipo ==
                                            TFATipoEnum.Email.value && (
                                            <Button
                                                type="button"
                                                label="Não recebeu o e-mail? Clique aqui para reenviarmos o e-mail."
                                                link
                                                className="font-medium no-underline ml-2 text-center cursor-pointer"
                                                style={{
                                                    color: 'var(--primary-color)',
                                                }}
                                                onClick={onGerarChaveTFAClick}
                                            />
                                        )}

                                        {auth.signedUser.tfaTipo ==
                                            TFATipoEnum.Google.value && (
                                            <Button
                                                type="button"
                                                label="Clique aqui se precisar recompor seu acesso em dois fatores."
                                                link
                                                className="font-medium no-underline ml-2 text-center cursor-pointer"
                                                style={{
                                                    color: 'var(--primary-color)',
                                                }}
                                                onClick={onRecomporTFAClick}
                                            />
                                        )}
                                    </div>
                                </>
                            )}

                        <div className="text-center mt-6 mb-5">
                            <Button
                                type="submit"
                                label="Confirmar"
                                className="text-xl w-6"
                            ></Button>
                            <Button
                                type="button"
                                label="Voltar"
                                className="bg-primary-reverse text-xl ml-4"
                                onClick={() => {
                                    Loading.show();
                                    router.push('/auth/login');
                                }}
                            ></Button>
                        </div>
                    </div>
                </div>
            </div>
            <Toast ref={toast} />
        </form>
    );
};

export default TFAValidaPage;
