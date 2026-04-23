'use client';

import React, { useEffect, useState, useRef, useContext } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ScrollTop } from 'primereact/scrolltop';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import { ObjectForm } from '@types';
import fetchService from '@actions/fetch';
import Loading from '@ui/loading';
import { AuthContext } from '@context/auth';

const GrupoAcessoEdit = ({ grupoAcessoId, onClose }: { grupoAcessoId: number; onClose: (grupoacesso: Control.IGrupoAcesso | null) => void }) => {
    interface IForm {
        isErro: boolean;
        id: number;
        parceiroId: number;
        nome: ObjectForm<string>;
        ativo: ObjectForm<boolean>;
    }

    const { auth } = useContext(AuthContext);

    const formDefault: IForm = {
        isErro: false,
        id: grupoAcessoId,
        parceiroId: auth.parceiro.id,
        nome: { isAlert: false, value: '', message: '' },
        ativo: { isAlert: false, value: true, message: '' }
    };

    const [form, setForm] = useState<IForm>(formDefault);
    const formPrev = useRef<IForm>(formDefault);

    const formAlterado = () => JSON.stringify(form) !== JSON.stringify(formPrev.current);

    const objectFocusRef = useRef(null);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        let url: string;
        let body: string;

        if (grupoAcessoId && grupoAcessoId > 0) {
            url = `${process.env.NEXT_PUBLIC_API_URL}/api/controle/grupoacesso/editar`;
            body = JSON.stringify(form);
        } else {
            url = `${process.env.NEXT_PUBLIC_API_URL}/api/controle/grupoacesso/adicionar`;
            body = form.parceiroId.toString();
        }

        fetchService({ url: url, method: `POST`, token: auth.token as string, body: body })
            .then((data: IForm | null) => {
                if (data === null) {
                    return;
                }

                formPrev.current = { ...data };
                setForm({ ...data });
            })
            .finally(() => {
                if (objectFocusRef.current !== null) {
                    (objectFocusRef.current as HTMLElement).focus();
                }
                Loading.hide();
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRetornarClick = () => {
        if (formAlterado()) {
            confirmDialog({
                group: 'edit',
                message: 'Deseja ignorar as alterações?',
                header: 'Confirmar',
                icon: 'pi pi-exclamation-triangle',
                defaultFocus: 'reject',
                acceptLabel: 'Sim',
                rejectLabel: 'Não',
                accept: () => onClose(null)
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
                group: 'edit',
                message: 'Confirma as alterações?',
                header: 'Confirmar',
                icon: 'pi pi-exclamation-triangle',
                defaultFocus: 'reject',
                acceptLabel: 'Sim',
                rejectLabel: 'Não',
                accept: () => aoConfirmarSalvar()
            });
        } else {
            onClose(null);
        }
    };

    const aoConfirmarSalvar = () => {
        Loading.show();

        fetchService({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/grupoacesso/salvar`, method: `POST`, token: auth.token as string, body: JSON.stringify(form) }).then((data: IForm | null) => {
            if (data != null) {
                if (data.isErro) {
                    setForm(data);
                    Loading.hide();
                } else {
                    onClose({
                        id: data.id,
                        nome: data.nome.value as string,
                        ativo: data.ativo.value as boolean,
                        acoes: []
                    });
                }
            }
        });
    };

    return (
        <>
            <div className="min-w-full">
                <form onSubmit={onSubmit}>
                    <Toolbar className="border-none bg-white" start={<Button type="button" label="Retornar" icon="pi pi-step-backward" onClick={onRetornarClick} />} end={<Button type="submit" label="Salvar" icon="pi pi-save" />} />

                    <hr />
                    <div className="formgrid grid">
                        <div className="field col-6">
                            <label htmlFor="nome" className="font-bold">
                                Nome:
                            </label>
                            <InputText
                                ref={grupoAcessoId && grupoAcessoId > 0 ? objectFocusRef : null}
                                id="nome"
                                type="text"
                                value={form.nome.value as string}
                                invalid={form.nome.isAlert}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, nome: { ...form.nome, value: e.target.value } })}
                                className="w-full text-base"
                                required
                            />
                            {form.nome.isAlert && <small className="text-red-500">&nbsp;{form.nome.message}</small>}
                        </div>

                        <div className="field col-3">
                            <label htmlFor="ativo" className="font-bold">
                                Ativo:
                            </label>
                            <br />
                            <InputSwitch id="ativo" className="mt-2" checked={form.ativo.value as boolean} onChange={(e: InputSwitchChangeEvent) => setForm({ ...form, ativo: { ...form.ativo, value: e.target.value } })} />
                            {form.ativo.isAlert && <small className="text-red-500">&nbsp;{form.ativo.message}</small>}
                        </div>
                    </div>
                </form>
            </div>

            <ConfirmDialog group="edit" />
            <Toast ref={toast} />
            <ScrollTop target="parent" threshold={100} />
        </>
    );
};

export default GrupoAcessoEdit;
