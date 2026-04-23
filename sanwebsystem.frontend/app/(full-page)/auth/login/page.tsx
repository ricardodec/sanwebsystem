'use client';

import React, { useContext, useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { LayoutContext } from '@layout/context/layoutcontext';
import Loading from '@ui/loading';
import { Auth } from '@types';
import fetchService from '@actions/fetch';
import { redirectIfAuthenticated } from '@actions/authenticate';
import { AuthContext, AuthType } from '@context/auth';

const LoginPage = () => {
    interface IAuthLoginRequest {
        login: string;
        senha: string;
    }

    interface IAuthLoginResponse {
        signedUser: Auth.ISignedUser;
        token: string | null;
        msgErro: string | null;
    }

    useEffect(() => {
        Loading.hide();
    }, []);

    const { layoutConfig } = useContext(LayoutContext);

    const [form, setForm] = useState<IAuthLoginRequest>({
        login: '',
        senha: '',
    });
    const [msgErro, setMsgErro] = useState<string | null>(null);

    const { dispatch, isAuthenticated } = useContext(AuthContext);
    const router = useRouter();

    const onSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        Loading.show();

        await fetchService({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
            method: `POST`,
            body: JSON.stringify(form),
        }).then((data: IAuthLoginResponse | null) => {
            if (data == null) {
                Loading.hide();
                return;
            }

            if (data.msgErro != null && data.msgErro != '') {
                setMsgErro(data.msgErro);
                Loading.hide();
                return;
            }

            dispatch({ type: AuthType.SIGNEDUSER, payload: data.signedUser });

            if (data.signedUser.trocarSenha as boolean) {
                router.push('/auth/trocasenha');
            } else if (data.signedUser.tfa as boolean) {
                router.push('/auth/tfa');
            } else {
                dispatch({ type: AuthType.TOKEN, payload: data.token });
            }
        });

        if (isAuthenticated()) {
            await redirectIfAuthenticated(`/parceiro/acesso`);
        }
    };

    const onNovaSenhaClick = () => {
        Loading.show();
        router.push('/auth/novasenha');
    };

    const containerClassName = classNames(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden',
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' },
    );

    return (
        <form className={containerClassName} onSubmit={onSubmit}>
            <div className="flex flex-column align-items-center justify-content-center">
                <div className="flex justify-content-center flex-wrap">
                    <Image
                        src={`/layout/images/logo_san.png`}
                        alt="SAN Logo"
                        height="60"
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
                            'linear-gradient(180deg, var(--primary-color) 1%, var(--primary-color-text) 15%)',
                    }}
                >
                    <div
                        className="w-full surface-card py-4 px-5 sm:px-8"
                        style={{ borderRadius: '53px' }}
                    >
                        <div className="text-center mb-5">
                            <span className="text-900 text-lg font-bold">
                                Identifique-se para continuar
                            </span>
                        </div>

                        <div className="flex flex-column align-items-start justify-content-start mb-5">
                            <label
                                htmlFor="login"
                                className="block text-900 text-lg font-medium mb-2"
                            >
                                Usuário
                            </label>
                            <InputText
                                id="login"
                                type="text"
                                value={form.login}
                                invalid={msgErro !== null && msgErro !== ''}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        login: e.target.value.toLowerCase(),
                                    })
                                }
                                placeholder="ID do usuário"
                                className="w-full md:w-30rem"
                                style={{ padding: '1rem' }}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="flex flex-column align-items-start justify-content-start mb-5">
                            <label
                                htmlFor="senha"
                                className="block text-900 text-lg font-medium mb-2"
                            >
                                Senha
                            </label>
                            <Password
                                inputId="senha"
                                value={form.senha}
                                invalid={msgErro !== null && msgErro !== ''}
                                onChange={(e) =>
                                    setForm({ ...form, senha: e.target.value })
                                }
                                placeholder="Senha"
                                className="w-full"
                                inputClassName="w-full p-3 md:w-30rem"
                                toggleMask
                                feedback={false}
                                required
                            />
                        </div>

                        {msgErro != null && msgErro != '' && (
                            <div className="flex align-items-center justify-content-center mt-2 mb-5">
                                <Message severity="error" text={msgErro} />
                            </div>
                        )}

                        <div className="flex align-items-center justify-content-between mt-2">
                            <Button
                                type="button"
                                label="Esqueceu sua senha?"
                                link
                                className="font-medium no-underline ml-2 text-right cursor-pointer"
                                style={{ color: 'var(--primary-color)' }}
                                onClick={onNovaSenhaClick}
                            />
                        </div>

                        <div className="flex justify-content-center mt-5">
                            <Button
                                type="submit"
                                label="Conectar"
                                className="w-6 text-xl"
                            ></Button>
                            <Button
                                type="button"
                                label="Voltar"
                                className="bg-primary-reverse text-xl ml-4"
                                onClick={() => {
                                    Loading.show();
                                    router.push('/');
                                }}
                            ></Button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default LoginPage;
