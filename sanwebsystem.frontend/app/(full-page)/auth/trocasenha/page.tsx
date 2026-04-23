/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useContext, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { LayoutContext } from '@layout/context/layoutcontext';
import Loading from '@ui/loading';
import { ObjectForm } from '@types';
import fetchService from '@actions/fetch';
import { AuthContext } from '@context/auth';

const TrocaSenhaPage = () => {
    interface IAuthTrocaSenha {
        isErro: boolean;
        login: string;
        senha: ObjectForm<string>;
        novaSenha: ObjectForm<string>;
        confirmaSenha: ObjectForm<string>;
    }

    const { auth } = useContext(AuthContext);
    const { layoutConfig } = useContext(LayoutContext);

    const formDefault: IAuthTrocaSenha = {
        isErro: false,
        login: auth.signedUser?.login || '',
        senha: { isAlert: false, value: '', message: '' },
        novaSenha: { isAlert: false, value: '', message: '' },
        confirmaSenha: { isAlert: false, value: '', message: '' },
    };

    const router = useRouter();
    const toast = useRef<Toast>(null);

    const showToast = () => {
        toast.current?.show({
            severity: 'info',
            summary: 'Info',
            detail: 'Senha alterada com sucesso!',
        });
    };

    const [form, setForm] = useState<IAuthTrocaSenha>(formDefault);

    useEffect(() => {
        Loading.hide();
    }, []);

    const onSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.stopPropagation();
        event.preventDefault();

        Loading.show();

        await fetchService({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/trocarsenha`,
            method: `POST`,
            token: auth.token as string,
            body: JSON.stringify(form),
        })
            .then((data: IAuthTrocaSenha | null) => {
                if (data == null) {
                    return;
                }

                if (data.isErro === true) {
                    setForm(data);
                } else {
                    setForm(formDefault);
                    showToast();
                }
            })
            .finally(() => {
                Loading.hide();
            });
    };

    const containerClassName = classNames(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden',
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' },
    );

    const passwordFooter = (
        <>
            <Divider />
            <p className="mt-2">Necessário</p>
            <ul className="pl-2 ml-2 mt-0 line-height-3">
                {auth.parametro?.caracterMinusculo === true && (
                    <li>Pelo menos uma letra minúscula</li>
                )}
                {auth.parametro?.caracterMaiusculo === true && (
                    <li>Pelo menos uma letra maiúscula</li>
                )}
                {auth.parametro?.caracterNumerico === true && (
                    <li>Pelo menos um número</li>
                )}
                {auth.parametro?.caracterEspecial === true && (
                    <li>Pelo menos um caracter especial (=*@&#!@+-)</li>
                )}
                <li>Mínimo de {auth.parametro?.minTamanhoSenha} caracteres</li>
            </ul>
        </>
    );

    return (
        <form className={containerClassName} onSubmit={onSubmit}>
            <div className="flex flex-column align-items-center justify-content-center w-4">
                <div className="flex justify-content-center flex-wrap">
                    <img
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
                            'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)',
                    }}
                >
                    <div
                        className="surface-card py-4 px-5 sm:px-8"
                        style={{ borderRadius: '53px' }}
                    >
                        <div className="text-center mb-5">
                            <span className="text-900 text-lg font-semibold">
                                Prencha o formulário para criar suas novas
                                credenciais
                            </span>
                        </div>

                        <div className="flex flex-column align-items-start justify-content-start mb-5 w-8">
                            <label
                                htmlFor="login"
                                className="block text-900 text-lg font-medium mb-2"
                            >
                                Senha
                            </label>
                            <Password
                                inputId="senha"
                                value={form.senha.value?.toString() || ''}
                                invalid={form.senha.isAlert}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        senha: {
                                            ...form.senha,
                                            value: e.target.value,
                                        },
                                    })
                                }
                                placeholder="Senha"
                                inputClassName="w-full md:w-30rem"
                                toggleMask
                                feedback={false}
                                required
                                autoFocus
                            />
                            {form.senha.isAlert && (
                                <span className="text-red-500 mt-1 w-full md:w-30rem">
                                    {form.senha.message}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-column align-items-start justify-content-start mb-5 w-8">
                            <label
                                htmlFor="email"
                                className="block text-900 text-lg font-medium mb-2"
                            >
                                Nova senha
                            </label>
                            <Password
                                inputId="novaSenha"
                                value={form.novaSenha.value?.toString() || ''}
                                invalid={form.novaSenha.isAlert}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        novaSenha: {
                                            ...form.novaSenha,
                                            value: e.target.value,
                                        },
                                    })
                                }
                                placeholder="Nova senha"
                                inputClassName="w-full md:w-30rem"
                                toggleMask
                                promptLabel="Entre com a senha"
                                weakLabel="Fraca"
                                mediumLabel="Média"
                                strongLabel="Forte"
                                minLength={auth.parametro?.minTamanhoSenha}
                                footer={passwordFooter}
                            />
                            {form.novaSenha.isAlert && (
                                <span className="text-red-500 mt-1 w-full md:w-30rem">
                                    {form.novaSenha.message}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-column align-items-start justify-content-start mb-5 w-8">
                            <label
                                htmlFor="email"
                                className="block text-900 text-lg font-medium mb-2"
                            >
                                Confirme a senha
                            </label>
                            <Password
                                inputId="confirmaSenha"
                                value={
                                    form.confirmaSenha.value?.toString() || ''
                                }
                                invalid={form.confirmaSenha.isAlert}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        confirmaSenha: {
                                            ...form.confirmaSenha,
                                            value: e.target.value,
                                        },
                                    })
                                }
                                placeholder="Confirme a senha"
                                inputClassName="w-full md:w-30rem"
                                toggleMask
                                feedback={false}
                                required
                            />
                            {form.confirmaSenha.isAlert && (
                                <span className="text-red-500 mt-1 w-full md:w-30rem">
                                    {form.confirmaSenha.message}
                                </span>
                            )}
                        </div>

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
                                onClick={() => router.push('/auth/login')}
                            ></Button>
                        </div>
                    </div>
                </div>
            </div>
            <Toast ref={toast} />
        </form>
    );
};

export default TrocaSenhaPage;
