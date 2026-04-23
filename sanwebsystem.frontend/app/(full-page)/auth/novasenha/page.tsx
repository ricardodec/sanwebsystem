'use client';

import React, { useContext, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { LayoutContext } from '@layout/context/layoutcontext';
import fetchService from '@actions/fetch';
import Loading from '@ui/loading';
import { ObjectForm } from '@types';
import { isEmailValid } from '@ui/validations';

const NovaSenhaPage = () => {
    interface IAuthNovaSenha {
        isErro: boolean;
        login: ObjectForm<string>;
        email: ObjectForm<string>;
    }

    const { layoutConfig } = useContext(LayoutContext);

    const formDefault: IAuthNovaSenha = {
        isErro: false,
        login: { isAlert: false, value: '', message: '' },
        email: { isAlert: false, value: '', message: '' },
    };

    const router = useRouter();
    const toast = useRef<Toast>(null);

    const showToast = () => {
        toast.current?.show({
            severity: 'info',
            summary: 'Info',
            detail: 'E-mail enviado com sucesso!',
        });
    };

    const [form, setForm] = useState<IAuthNovaSenha>(formDefault);

    useEffect(() => {
        Loading.hide();
    }, []);

    const onSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.stopPropagation();
        event.preventDefault();

        Loading.show();

        await fetchService({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/novasenha`,
            method: `POST`,
            body: JSON.stringify(form),
        })
            .then((data: IAuthNovaSenha | null) => {
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

    return (
        <form className={containerClassName} onSubmit={onSubmit}>
            <div className="flex flex-column align-items-center justify-content-center w-4">
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
                            'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)',
                    }}
                >
                    <div
                        className="surface-card py-4 px-5 sm:px-8"
                        style={{ borderRadius: '53px' }}
                    >
                        <div className="text-center mb-5">
                            <span className="text-900 text-lg font-semibold">
                                Prencha o formulário. Será encaminhada uma senha
                                temporária no e-mail associado ao seu usuário
                            </span>
                        </div>

                        <div className="flex flex-column align-items-start justify-content-start mb-5 w-8">
                            <label
                                htmlFor="login"
                                className="block text-900 text-lg font-medium mb-2"
                            >
                                Usuário
                            </label>
                            <InputText
                                id="login"
                                type="text"
                                value={form.login.value?.toString() || ''}
                                invalid={form.login.isAlert}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        login: {
                                            ...form.login,
                                            value: e.target.value.toLowerCase(),
                                        },
                                    })
                                }
                                placeholder="ID do usuário"
                                className="w-full md:w-30rem"
                                style={{ padding: '1rem' }}
                                required
                                autoFocus
                            />
                            {form.login.isAlert && (
                                <span className="text-red-500 mt-1 w-full md:w-30rem">
                                    {form.login.message}
                                </span>
                            )}
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
                                value={form.email.value?.toString() || ''}
                                invalid={
                                    form.email.isAlert ||
                                    !isEmailValid(form.email.value as string)
                                }
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        email: {
                                            ...form.email,
                                            value: e.target.value,
                                        },
                                    })
                                }
                                placeholder="Email associado"
                                className="w-full md:w-30rem"
                                style={{ padding: '1rem' }}
                                required
                            />
                            {form.email.isAlert && (
                                <span className="text-red-500 mt-1 w-full md:w-30rem">
                                    {form.email.message}
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

export default NovaSenhaPage;
