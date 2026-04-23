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
import { TipoEnderecoEnum } from '@enums';
import fetchService from '@actions/fetch';
import Loading from '../loading';
import { addLocalePtBR } from '../formats';
import CepUI from '../cep';
import { AuthContext } from '@context/auth';

export interface IEnderecoForm {
    schema: string;
    isErro: boolean;
    id: number;
    pessoaId: number;
    tipo: ObjectForm<number>;
    logradouro: ObjectForm<string>;
    numero: ObjectForm<Nullable<number>>;
    complemento: ObjectForm<string>;
    bairro: ObjectForm<string>;
    cidade: ObjectForm<string>;
    uf: ObjectForm<string>;
    cep: ObjectForm<Nullable<string>>;
    ativo: ObjectForm<boolean>;
}

export const formDefault: IEnderecoForm = {
    schema: '0',
    isErro: false,
    id: 0,
    pessoaId: 0,
    tipo: {
        isAlert: false,
        value: TipoEnderecoEnum.NaoInformado.value,
        message: '',
    },
    logradouro: { isAlert: false, value: '', message: '' },
    numero: { isAlert: false, value: null, message: '' },
    complemento: { isAlert: false, value: '', message: '' },
    bairro: { isAlert: false, value: '', message: '' },
    cidade: { isAlert: false, value: '', message: '' },
    uf: { isAlert: false, value: '', message: '' },
    cep: { isAlert: false, value: null, message: '' },
    ativo: { isAlert: false, value: true, message: '' },
};

interface EnderecoProps {
    id: number;
    pessoaid?: number;
    enderecoLista: IEnderecoForm[];
    tipoEnderecoLista: ObjectOption<number>[];
    estadoLista: ObjectOption<string>[];
    onClose: (endereco: IEnderecoForm | null) => void;
}

const Endereco = ({
    id,
    pessoaid,
    enderecoLista,
    tipoEnderecoLista,
    estadoLista,
    onClose,
}: EnderecoProps) => {
    const { auth } = useContext(AuthContext);
    const [form, setForm] = useState<IEnderecoForm>(formDefault);
    const formPrev = useRef<IEnderecoForm>(formDefault);
    const objectFocusRef = useRef(null);

    const formAlterado = () =>
        JSON.stringify(form) !== JSON.stringify(formPrev.current);

    useEffect(() => {
        const parceiro: Control.IParceiro = auth.parceiro;

        formDefault.schema = parceiro === null ? '0' : parceiro.id.toString();
        formDefault.pessoaId = pessoaid ?? 0;

        if (id !== 0) {
            const endereco = enderecoLista.find((x) => x.id === id);

            if (endereco) {
                endereco.schema = formDefault.schema;

                setForm(endereco);
                formPrev.current = endereco;
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
                group: 'endereco',
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
                group: 'endereco',
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
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/cadastro/pessoa/endereco/salvar`,
            method: `POST`,
            token: auth.token as string,
            body: JSON.stringify(form),
        }).then((data: IEnderecoForm | null) => {
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

    addLocalePtBR();

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
                                Tipo de endereço:
                            </label>
                            <Dropdown
                                ref={objectFocusRef}
                                id="tipo"
                                name={'tipo'}
                                options={tipoEnderecoLista}
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

                        <div className="field col-6">
                            <label htmlFor="logradouro" className="font-bold">
                                Logradouro:
                            </label>
                            <InputText
                                id="logradouro"
                                name="logradouro"
                                type="text"
                                value={form.logradouro.value as string}
                                invalid={form.logradouro.isAlert}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                    setForm({
                                        ...form,
                                        logradouro: {
                                            ...form.logradouro,
                                            value: e.target.value,
                                        },
                                    })
                                }
                                className="w-full text-base"
                                required
                            />
                            {form.logradouro.isAlert && (
                                <small className="text-red-500">
                                    &nbsp;{form.logradouro.message}
                                </small>
                            )}
                        </div>

                        <div className="field col-2">
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
                            />
                            {form.numero.isAlert && (
                                <small className="text-red-500">
                                    &nbsp;{form.numero.message}
                                </small>
                            )}
                        </div>
                    </div>

                    <div className="formgrid grid">
                        <div className="field col-4">
                            <label htmlFor="complemento" className="font-bold">
                                Complemento:
                            </label>
                            <InputText
                                id="complemento"
                                name={'complemento'}
                                type="text"
                                value={form.complemento.value as string}
                                invalid={form.complemento.isAlert}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                    setForm({
                                        ...form,
                                        complemento: {
                                            ...form.complemento,
                                            value: e.target.value,
                                        },
                                    })
                                }
                                className="w-full text-base"
                            />
                            {form.complemento.isAlert && (
                                <small className="text-red-500">
                                    &nbsp;{form.complemento.message}
                                </small>
                            )}
                        </div>

                        <div className="field col-4">
                            <label htmlFor="bairro" className="font-bold">
                                Bairro:
                            </label>
                            <InputText
                                id="bairro"
                                name={'bairro'}
                                type="text"
                                value={form.bairro.value as string}
                                invalid={form.bairro.isAlert}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                    setForm({
                                        ...form,
                                        bairro: {
                                            ...form.bairro,
                                            value: e.target.value,
                                        },
                                    })
                                }
                                className="w-full text-base"
                            />
                            {form.bairro.isAlert && (
                                <small className="text-red-500">
                                    &nbsp;{form.bairro.message}
                                </small>
                            )}
                        </div>

                        <div className="field col-4">
                            <label htmlFor="cep" className="font-bold">
                                CEP:
                            </label>
                            <CepUI
                                id="cep"
                                name={'cep'}
                                cep={form.cep}
                                onChange={(cep: ObjectForm<Nullable<string>>) =>
                                    setForm({ ...form, cep: cep })
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="formgrid grid">
                        <div className="field col-4">
                            <label htmlFor="cidade" className="font-bold">
                                Cidade:
                            </label>
                            <InputText
                                id="cidade"
                                name={'cidade'}
                                type="text"
                                value={form.cidade.value as string}
                                invalid={form.cidade.isAlert}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                    setForm({
                                        ...form,
                                        cidade: {
                                            ...form.cidade,
                                            value: e.target.value,
                                        },
                                    })
                                }
                                className="w-full text-base"
                                required
                            />
                            {form.cidade.isAlert && (
                                <small className="text-red-500">
                                    &nbsp;{form.cidade.message}
                                </small>
                            )}
                        </div>

                        <div className="field col-4">
                            <label htmlFor="uf" className="font-bold">
                                UF:
                            </label>
                            <Dropdown
                                id="uf"
                                name={'uf'}
                                options={estadoLista}
                                value={form.uf.value}
                                invalid={form.uf.isAlert}
                                onChange={(e: DropdownChangeEvent) =>
                                    setForm({
                                        ...form,
                                        uf: {
                                            ...form.uf,
                                            value: e.target.value,
                                        },
                                    })
                                }
                                optionValue="id"
                                optionLabel="descricao"
                                className="w-full text-base"
                                filter
                                showFilterClear
                                required
                            />
                            {form.uf.isAlert && (
                                <small className="text-red-500">
                                    &nbsp;{form.uf.message}
                                </small>
                            )}
                        </div>

                        <div className="field col-4">
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

                <ConfirmDialog group="endereco" />
            </div>

            <ScrollTop target="parent" threshold={100} />
        </>
    );
};

export default Endereco;
