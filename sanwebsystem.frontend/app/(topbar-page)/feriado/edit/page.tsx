'use client';

import React, { useEffect, useState, useRef, useContext } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ScrollTop } from 'primereact/scrolltop';
import { Calendar } from 'primereact/calendar';
import { Nullable } from "primereact/ts-helpers";
import { ObjectForm } from '@types';
import fetchService from '@actions/fetch';
import Loading from '@ui/loading';
import { addLocalePtBR } from '@ui/formats';
import { IFeriadoVo } from '../page';
import { AuthContext } from '@context/auth';

export interface IForm {
    isErro: boolean,
    data: ObjectForm<Nullable<Date>>;
    nome: ObjectForm<string | null>;
};

export const formDefault: IForm = {
    isErro: false,
    data: { isAlert: false, value: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), message: '' },
    nome: { isAlert: false, value: '', message: ''}
};

interface FeriadoAddProps {
    data: Date | null;
    onClose: (feriado: IFeriadoVo | null) => void;
}

const FeriadoEdit = ({ data, onClose }: FeriadoAddProps) => {

    const { auth } = useContext(AuthContext);

    const [form, setForm] = useState<IForm>(formDefault);
    const formPrev = useRef<IForm>(formDefault);

    const formAlterado = () => JSON.stringify(form) !== JSON.stringify(formPrev.current);

    const objectFocusRef = useRef(null);

    useEffect(() => {
        fetchService({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/feriado/editar`, method: `POST`, token: auth?.token as string, body: JSON.stringify(data) })
            .then((data: IForm | null) => {
                if (data === null) {
                    return;
                }

                if (data.data.value) {
                    data.data.value = new Date(data.data.value);
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

        fetchService({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/feriado/salvar`, method: `POST`, token: auth?.token as string, body: JSON.stringify(form) })
            .then((data: IForm | null) => {
                if (data != null) {
                    if (data.data.value) {
                        data.data.value = new Date(data.data.value);
                    }

                    if (data.isErro) {
                        setForm(data);
                        Loading.hide();
                    }
                    else {
                        const dtBase = data.data.value as Date;

                        onClose({
                            data: dtBase,
                            data_: dtBase.getDate().toString().padStart(2, '0') + '/' + (dtBase.getMonth() + 1).toString().padStart(2, '0') + '/' + dtBase.getFullYear(),
                            nome: data.nome.value as string
                        });
                    }
                }
            });
    };

    addLocalePtBR();

    return (
        <>
            <div className="min-w-full">
                <form onSubmit={onSubmit}>
                    <Toolbar
                        className="border-none bg-white"
                        start={<Button type="button" label="Retornar" icon="pi pi-step-backward" onClick={onRetornarClick} />}
                        end={<Button type="submit" label="Salvar" icon="pi pi-save" />}
                    />

                    <hr />
                    <div className="formgrid grid">
                        <div className="field col-4">
                            <label htmlFor="data" className="font-bold">
                                Data:
                            </label>
                            <Calendar
                                id="data"
                                value={form.data.value}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        data: {
                                            ...form.data,
                                            value: e.target.value
                                        }
                                    })
                                }
                                className="w-full text-base"
                                locale="pt-BR"
                                showIcon
                                showButtonBar
                            />
                            {form.data.isAlert && <small className="text-red-500">&nbsp;{form.data.message}</small>}
                        </div>

                        <div className="field col-8">
                            <label htmlFor="nome" className="font-bold">
                                Nome:
                            </label>
                            <InputText
                                ref={objectFocusRef}
                                id="nome"
                                type="text"
                                value={form.nome.value ?? ''}
                                invalid={form.nome.isAlert}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        nome: {
                                            ...form.nome,
                                            value: e.target.value
                                        }
                                    })
                                }
                                className="w-full text-base"
                            />
                            {form.nome.isAlert && <small className="text-red-500">&nbsp;{form.nome.message}</small>}
                        </div>
                    </div>
                </form>
            </div>

            <ConfirmDialog group="edit" />
            <ScrollTop target="parent" threshold={100} />
        </>
    );
};

export default FeriadoEdit;