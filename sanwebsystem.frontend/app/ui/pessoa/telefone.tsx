'use client';

import React, { useEffect, useState, useRef, useContext } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ScrollTop } from 'primereact/scrolltop';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { Nullable } from 'primereact/ts-helpers';
import {
    InputNumber,
    InputNumberValueChangeEvent,
} from 'primereact/inputnumber';
import { ObjectForm, ObjectOption } from '@types';
import { TipoTelefoneEnum } from '@enums';
import fetchService from '@actions/fetch';
import Loading from '@ui/loading';
import { AuthContext } from '@context/auth';

export interface ITelefoneForm {
    schema: string;
    isErro: boolean;
    id: number;
    pessoaId: number;
    tipo: ObjectForm<number>;
    ddi: ObjectForm<Nullable<number>>;
    ddd: ObjectForm<Nullable<number>>;
    numero: ObjectForm<Nullable<number>>;
    contato: ObjectForm<string>;
    whatsapp: ObjectForm<boolean>;
    telegram: ObjectForm<boolean>;
    ativo: ObjectForm<boolean>;
}

export const formDefault: ITelefoneForm = {
    schema: '0',
    isErro: false,
    id: 0,
    pessoaId: 0,
    tipo: {
        isAlert: false,
        value: TipoTelefoneEnum.NaoInformado.value,
        message: '',
    },
    ddi: { isAlert: false, value: null, message: '' },
    ddd: { isAlert: false, value: null, message: '' },
    numero: { isAlert: false, value: null, message: '' },
    contato: { isAlert: false, value: '', message: '' },
    whatsapp: { isAlert: false, value: true, message: '' },
    telegram: { isAlert: false, value: true, message: '' },
    ativo: { isAlert: false, value: true, message: '' },
};

interface TelefoneProps {
    id: number;
    pessoaid?: number;
    telefoneLista: ITelefoneForm[];
    tipoTelefoneLista: ObjectOption<number>[];
    onClose: (telefone: ITelefoneForm | null) => void;
}

const Telefone = ({
    id,
    pessoaid,
    telefoneLista,
    tipoTelefoneLista,
    onClose,
}: TelefoneProps) => {
    const { auth } = useContext(AuthContext);
    const [form, setForm] = useState<ITelefoneForm>(formDefault);
    const formPrev = useRef<ITelefoneForm>(formDefault);
    const objectFocusRef = useRef(null);

    const formAlterado = () =>
        JSON.stringify(form) !== JSON.stringify(formPrev.current);

    useEffect(() => {
        const parceiro: Control.IParceiro = auth.parceiro;

        formDefault.schema = parceiro === null ? '0' : parceiro.id.toString();
        formDefault.pessoaId = pessoaid ?? 0;

        if (id === 0) {
            setForm(formDefault);
            formPrev.current = formDefault;
        } else {
            const telefone = telefoneLista.find((x) => x.id === id);

            if (telefone) {
                telefone.schema = formDefault.schema;

                setForm(telefone);
                formPrev.current = telefone;
            } else {
                onClose(null);
            }
        }

        if (objectFocusRef.current !== null) {
            (objectFocusRef.current as HTMLElement).focus();
        }

        Loading.hide();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRetornarClick = () => {
        if (formAlterado()) {
            confirmDialog({
                group: 'telefone',
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
                group: 'telefone',
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
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/cadastro/pessoa/telefone/salvar`,
            method: `POST`,
            token: auth.token as string,
            body: JSON.stringify(form),
        }).then((data: ITelefoneForm | null) => {
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
                        <div className="field col-4">
                            <label htmlFor="tipo" className="font-bold">
                                Tipo de telefone:
                            </label>
                            <Dropdown
                                ref={objectFocusRef}
                                id="tipo"
                                name={'tipo'}
                                options={tipoTelefoneLista}
                                value={form.tipo.value}
                                invalid={form.tipo.isAlert}
                                onChange={(e: DropdownChangeEvent) =>
                                    setForm({
                                        ...form,
                                        tipo: {
                                            ...form.tipo,
                                            value: Number.parseInt(
                                                e.target.value as string,
                                            ),
                                        },
                                    })
                                }
                                optionValue="id"
                                optionLabel="descricao"
                                className="w-full text-base"
                                required
                            />
                            {form.tipo.isAlert && (
                                <small className="text-red-500">
                                    &nbsp;{form.tipo.message}
                                </small>
                            )}
                        </div>

                        <div className="field col-2">
                            <label htmlFor="ddi" className="font-bold">
                                DDI:
                            </label>
                            <InputNumber
                                id="ddi"
                                name={'ddi'}
                                type="text"
                                value={form.ddi.value}
                                invalid={form.ddi.isAlert}
                                onValueChange={(
                                    e: InputNumberValueChangeEvent,
                                ) =>
                                    setForm({
                                        ...form,
                                        ddi: {
                                            ...form.ddi,
                                            value: e.target.value,
                                        },
                                    })
                                }
                                className="w-full text-base"
                                locale="pt-BR"
                                useGrouping={false}
                                maxLength={2}
                            />
                            {form.ddi.isAlert && (
                                <small className="text-red-500">
                                    &nbsp;{form.ddi.message}
                                </small>
                            )}
                        </div>

                        <div className="field col-2">
                            <label htmlFor="ddd" className="font-bold">
                                DDD:
                            </label>
                            <InputNumber
                                id="ddd"
                                name={'ddd'}
                                type="text"
                                value={form.ddd.value}
                                invalid={form.ddd.isAlert}
                                onValueChange={(
                                    e: InputNumberValueChangeEvent,
                                ) =>
                                    setForm({
                                        ...form,
                                        ddd: {
                                            ...form.ddd,
                                            value: e.target.value,
                                        },
                                    })
                                }
                                className="w-full text-base"
                                locale="pt-BR"
                                useGrouping={false}
                                maxLength={2}
                                required
                            />
                            {form.ddd.isAlert && (
                                <small className="text-red-500">
                                    &nbsp;{form.ddd.message}
                                </small>
                            )}
                        </div>

                        <div className="field col-4">
                            <label htmlFor="numero" className="font-bold">
                                Número:
                            </label>
                            <InputNumber
                                id="numero"
                                name={'numero'}
                                type="text"
                                value={form.numero.value}
                                invalid={form.numero.isAlert}
                                onValueChange={(
                                    e: InputNumberValueChangeEvent,
                                ) =>
                                    setForm({
                                        ...form,
                                        numero: {
                                            ...form.numero,
                                            value: e.target.value,
                                        },
                                    })
                                }
                                className="w-full text-base"
                                locale="pt-BR"
                                useGrouping={false}
                                maxLength={20}
                                required
                            />
                            {form.numero.isAlert && (
                                <small className="text-red-500">
                                    &nbsp;{form.numero.message}
                                </small>
                            )}
                        </div>
                    </div>

                    <div className="formgrid grid">
                        <div className="field col-6">
                            <label htmlFor="contato" className="font-bold">
                                Contato:
                            </label>
                            <InputText
                                id="contato"
                                name="contato"
                                type="text"
                                value={form.contato.value as string}
                                invalid={form.contato.isAlert}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                    setForm({
                                        ...form,
                                        contato: {
                                            ...form.contato,
                                            value: e.target.value,
                                        },
                                    })
                                }
                                className="w-full text-base"
                            />
                            {form.contato.isAlert && (
                                <small className="text-red-500">
                                    &nbsp;{form.contato.message}
                                </small>
                            )}
                        </div>

                        <div className="field col-2">
                            <label htmlFor="whatsapp" className="font-bold">
                                Whatsapp:
                            </label>
                            <br />
                            <InputSwitch
                                id="whatsapp"
                                name={'whatsapp'}
                                className="mt-2"
                                checked={form.whatsapp.value as boolean}
                                onChange={(e: InputSwitchChangeEvent) =>
                                    setForm({
                                        ...form,
                                        whatsapp: {
                                            ...form.whatsapp,
                                            value: e.target.value,
                                        },
                                    })
                                }
                            />
                            {form.whatsapp.isAlert && (
                                <small className="text-red-500">
                                    &nbsp;{form.whatsapp.message}
                                </small>
                            )}
                        </div>

                        <div className="field col-2">
                            <label htmlFor="telegram" className="font-bold">
                                Telegram:
                            </label>
                            <br />
                            <InputSwitch
                                id="telegram"
                                name={'telegram'}
                                className="mt-2"
                                checked={form.telegram.value as boolean}
                                onChange={(e: InputSwitchChangeEvent) =>
                                    setForm({
                                        ...form,
                                        telegram: {
                                            ...form.telegram,
                                            value: e.target.value,
                                        },
                                    })
                                }
                            />
                            {form.telegram.isAlert && (
                                <small className="text-red-500">
                                    &nbsp;{form.telegram.message}
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

                <ConfirmDialog group="telefone" />
            </div>

            <ScrollTop target="parent" threshold={100} />
        </>
    );
};

export default Telefone;
