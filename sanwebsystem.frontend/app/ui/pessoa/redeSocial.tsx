'use client';

import React, { useEffect, useState, useRef, useContext } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ScrollTop } from 'primereact/scrolltop';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { ObjectForm, ObjectOption } from '@types';
import { TipoRedeSocialEnum } from '@enums';
import fetchService from '@actions/fetch';
import Loading from '@ui/loading';
import { AuthContext } from '@context/auth';

export interface IRedeSocialForm {
    schema: string;
    isErro: boolean;
    id: number;
    pessoaId: number;
    tipo: ObjectForm<number>;
    identificador: ObjectForm<string>;
    ativo: ObjectForm<boolean>;
}

export const formDefault: IRedeSocialForm = {
    schema: '0',
    isErro: false,
    id: 0,
    pessoaId: 0,
    tipo: {
        isAlert: false,
        value: TipoRedeSocialEnum.Outra.value,
        message: '',
    },
    identificador: { isAlert: false, value: '', message: '' },
    ativo: { isAlert: false, value: true, message: '' },
};

interface RedeSocialProps {
    id: number;
    pessoaid?: number;
    redeSocialLista: IRedeSocialForm[];
    tipoRedeSocialLista: ObjectOption<number>[];
    onClose: (redesocial: IRedeSocialForm | null) => void;
}

const RedeSocial = ({
    id,
    pessoaid,
    redeSocialLista,
    tipoRedeSocialLista,
    onClose,
}: RedeSocialProps) => {
    const { auth } = useContext(AuthContext);
    const [form, setForm] = useState<IRedeSocialForm>(formDefault);
    const formPrev = useRef<IRedeSocialForm>(formDefault);
    const objectFocusRef = useRef(null);

    const formAlterado = () =>
        JSON.stringify(form) !== JSON.stringify(formPrev.current);

    useEffect(() => {
        const parceiro: Control.IParceiro = auth.parceiro;

        formDefault.schema = parceiro === null ? '0' : parceiro.id.toString();
        formDefault.pessoaId = pessoaid ?? 0;

        if (id !== 0) {
            const redesocial = redeSocialLista.find((x) => x.id === id);

            if (redesocial) {
                redesocial.schema = formDefault.schema;

                setForm(redesocial);
                formPrev.current = redesocial;
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
                group: 'redesocial',
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
                group: 'redesocial',
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
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/cadastro/pessoa/redesocial/salvar`,
            method: `POST`,
            token: auth.token as string,
            body: JSON.stringify(form),
        }).then((data: IRedeSocialForm | null) => {
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
                                options={tipoRedeSocialLista}
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
                    </div>

                    <div className="formgrid grid">
                        <div className="field col-8">
                            <label
                                htmlFor="identificador"
                                className="font-bold"
                            >
                                Identificador:
                            </label>
                            <InputText
                                id="identificador"
                                name="identificador"
                                type="text"
                                value={form.identificador.value as string}
                                invalid={form.identificador.isAlert}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                    setForm({
                                        ...form,
                                        identificador: {
                                            ...form.identificador,
                                            value: e.target.value,
                                        },
                                    })
                                }
                                className="w-full text-base"
                            />
                            {form.identificador.isAlert && (
                                <small className="text-red-500">
                                    &nbsp;{form.identificador.message}
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

                <ConfirmDialog group="redesocial" />
            </div>

            <ScrollTop target="parent" threshold={100} />
        </>
    );
};

export default RedeSocial;
