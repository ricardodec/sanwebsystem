'use client';

import React, { useEffect, useState, useRef, useContext } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ScrollTop } from 'primereact/scrolltop';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { ObjectForm } from '@types';
import fetchService from '@actions/fetch';
import Loading from '@ui/loading';
import { isEmailValid } from '../validations';
import { AuthContext } from '@context/auth';

export interface IEmailForm {
    schema: string;
    isErro: boolean;
    id: number;
    pessoaId: number;
    endereco: ObjectForm<string>;
    ativo: ObjectForm<boolean>;
}

export const formDefault: IEmailForm = {
    schema: '0',
    isErro: false,
    id: 0,
    pessoaId: 0,
    endereco: { isAlert: false, value: '', message: '' },
    ativo: { isAlert: false, value: true, message: '' },
};

interface EmailProps {
    id: number;
    pessoaid?: number;
    emailLista: IEmailForm[];
    onClose: (email: IEmailForm | null) => void;
}

const Email = ({ id, pessoaid, emailLista, onClose }: EmailProps) => {
    const { auth } = useContext(AuthContext);
    const [form, setForm] = useState<IEmailForm>(formDefault);
    const formPrev = useRef<IEmailForm>(formDefault);
    const objectFocusRef = useRef(null);

    const formAlterado = () =>
        JSON.stringify(form) !== JSON.stringify(formPrev.current);

    useEffect(() => {
        const parceiro: Control.IParceiro = auth.parceiro;

        formDefault.schema = parceiro === null ? '0' : parceiro.id.toString();
        formDefault.pessoaId = pessoaid ?? 0;

        if (id !== 0) {
            const email = emailLista.find((x) => x.id === id);

            if (email) {
                email.schema = formDefault.schema;

                setForm(email);
                formPrev.current = email;
            } else {
                onClose(null);
            }
        }

        if (objectFocusRef.current) {
            (objectFocusRef.current as HTMLElement).focus();
        }

        Loading.hide();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRetornarClick = () => {
        if (formAlterado()) {
            confirmDialog({
                group: 'email',
                message: 'Deseja ignorar as alterações?',
                header: 'Confirmar',
                icon: 'pi pi-exclamation-triangle',
                defaultFocus: 'reject',
                acceptLabel: 'Sim',
                rejectLabel: 'Não',
                accept: () => onClose(null),
            });
        } else {
            onClose(null);
        }
    };

    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (formAlterado()) {
            confirmDialog({
                group: 'email',
                message: 'Confirma as alterações?',
                header: 'Confirmar',
                icon: 'pi pi-exclamation-triangle',
                defaultFocus: 'reject',
                acceptLabel: 'Sim',
                rejectLabel: 'Não',
                accept: () => aoConfirmaSalvar(),
            });
        } else {
            onClose(null);
        }
    };

    const aoConfirmaSalvar = () => {
        Loading.show();

        fetchService({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/cadastro/pessoa/email/salvar`,
            method: `POST`,
            token: auth.token as string,
            body: JSON.stringify(form),
        }).then((data: IEmailForm | null) => {
            if (data != null) {
                if (data.isErro) {
                    setForm(data);
                    Loading.hide();
                } else {
                    onClose(data);
                }
            }
        });
    };

    const toolbarStart = () => {
        return (
            <Button
                type="button"
                label="Retornar"
                icon="pi pi-step-backward"
                onClick={onRetornarClick}
            />
        );
    };

    const toolbarEnd = () => {
        return <Button type="submit" label="Salvar" icon="pi pi-save" />;
    };

    return (
        <>
            <div className="min-w-full">
                <form onSubmit={onSubmit}>
                    <Toolbar
                        className="border-none bg-white"
                        start={toolbarStart}
                        end={toolbarEnd}
                    />

                    <hr />
                    <div className="formgrid grid">
                        <div className="field col-8">
                            <label htmlFor="endereco" className="font-bold">
                                E-mail:
                            </label>
                            <InputText
                                ref={objectFocusRef}
                                id="endereco"
                                name="endereco"
                                type="text"
                                value={form.endereco.value as string}
                                invalid={
                                    form.endereco.isAlert ||
                                    !isEmailValid(form.endereco.value as string)
                                }
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                    setForm({
                                        ...form,
                                        endereco: {
                                            ...form.endereco,
                                            value: e.target.value,
                                        },
                                    })
                                }
                                className="w-full text-base"
                            />
                            {(form.endereco.isAlert ||
                                !isEmailValid(
                                    form.endereco.value as string,
                                )) && (
                                <small className="text-red-500">
                                    &nbsp;
                                    {form.endereco.message === ''
                                        ? 'E-mail inválido'
                                        : form.endereco.message}
                                </small>
                            )}
                        </div>

                        <div className="field col-2">
                            <label htmlFor="ativo" className="font-bold">
                                Ativo:
                            </label>
                            <br />
                            <InputSwitch
                                id="ativo"
                                name={'ativo'}
                                className="mt-2"
                                checked={form.ativo.value as boolean}
                                onChange={(e: InputSwitchChangeEvent) =>
                                    setForm({
                                        ...form,
                                        ativo: {
                                            ...form.ativo,
                                            value: e.target.value,
                                        },
                                    })
                                }
                            />
                            {form.ativo.isAlert && (
                                <small className="text-red-500">
                                    &nbsp;{form.ativo.message}
                                </small>
                            )}
                        </div>
                    </div>
                </form>

                <ConfirmDialog group="email" />
            </div>

            <ScrollTop target="parent" threshold={100} />
        </>
    );
};

export default Email;
