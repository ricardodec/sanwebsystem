'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MenuItem } from 'primereact/menuitem';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { Nullable } from "primereact/ts-helpers";
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import fetchService from '@actions/fetch';
import Loading from '@ui/loading';
import { ObjectForm } from '@types';
import BreadcrumbUI from '@ui/breadcrumb';
import { AuthContext } from '@context/auth';

const Parametro = () => {
    interface IForm {
        isErro: boolean;
        cicloSenha: ObjectForm<Nullable<number>>,
        numRepeticaoSenha: ObjectForm<Nullable<number>>,
        minTamanhoSenha: ObjectForm<Nullable<number>>,
        caracterMinusculo: ObjectForm<boolean>,
        caracterMaiusculo: ObjectForm<boolean>,
        caracterEspecial: ObjectForm<boolean>,
        caracterNumerico: ObjectForm<boolean>,
        linhasPorPagina: ObjectForm<Nullable<number>>
    }

    const formDefault: IForm = {
        isErro: false,
        cicloSenha: { isAlert: false, value: 0, message: '' },
        numRepeticaoSenha: { isAlert: false, value: 0, message: '' },
        minTamanhoSenha: { isAlert: false, value: 0, message: '' },
        caracterMinusculo: { isAlert: false, value: true, message: '' },
        caracterMaiusculo: { isAlert: false, value: true, message: '' },
        caracterEspecial: { isAlert: false, value: true, message: '' },
        caracterNumerico: { isAlert: false, value: true, message: '' },
        linhasPorPagina: { isAlert: false, value: 0, message: '' },
    };

    const { auth } = useContext(AuthContext);
    const [form, setForm] = useState<IForm>(formDefault);
    const formPrev = useRef<IForm>(formDefault);

    const formAlterado = () => JSON.stringify(form) !== JSON.stringify(formPrev.current);

    const router = useRouter();
    const objectFocusRef = useRef(null);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        fetchService({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/parametro/editar`,
            method: `POST`,
            token: auth.token as string,
            body: JSON.stringify(form)
        })
            .then((data: IForm | null) => {
                if (data === null) return;

                setForm(data);
                formPrev.current = { ...data };
            })
            .finally(() => {
                if (objectFocusRef.current !== null) {
                    (objectFocusRef.current as HTMLElement).focus();
                }
                Loading.hide();
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (formAlterado()) {
            confirmDialog({
                group: 'page',
                message: 'Confirma a a alteração?',
                header: 'Confirmar',
                icon: 'pi pi-exclamation-triangle',
                defaultFocus: 'reject',
                acceptLabel: 'Sim',
                rejectLabel: 'Não',
                accept: () => onSalvar()
            });
        }
        else {
            router.push('/parceiro/acesso');
        }
    };

    const onSalvar = () => {
        Loading.show();

        fetchService({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/parametro/salvar`,
            method: `POST`,
            token: auth.token as string,
            body: JSON.stringify(form)
        })
            .then((data: IForm | null) => {
                if (data === null) return;

                setForm(data);
                toast.current?.show({ severity: 'info', summary: 'Info', detail: `Operação realizada com sucesso!` });
            })
            .finally(() => Loading.hide());
    };

    const toolbarStart = () => {
        const menu: MenuItem[] = [
            { icon: 'pi pi-sync', label: 'Início', command: () => router.push('/parceiro/acesso') },
            { label: 'Parâmetros', disabled: true }
        ];

        return <BreadcrumbUI menu={menu} />;
    };

    const cicloSenhaLista = [
        { label: 'Nunca exigir', value: 0 },
        { label: 'A cada 15 dias', value: 15 },
        { label: 'A cada 30 dias', value: 30 },
        { label: 'A cada 60 dias', value: 60 },
        { label: 'A cada 90 dias', value: 90 },
        { label: 'A cada 180 dias', value: 180 }
    ];

    const numRepeticaoSenhaLista = [
        { label: 'Sempre permitir', value: -1 },
        { label: 'Permitir a cada 3 senhas', value: 3 },
        { label: 'Permitir a cada 5 senhas', value: 5 },
        { label: 'Permitir a cada 10 senhas', value: 10 },
        { label: 'Nunca permitir', value: 0 }
    ];

    const linhasPorPaginaLista = [
        { label: '5 linhas', value: 5 },
        { label: '10 linhas', value: 10 },
        { label: '15 linhas', value: 15 },
        { label: '30 linhas', value: 30 },
        { label: '50 linhas', value: 50 }
    ];
    return (
        <>
            <form onSubmit={onSubmit}>
                <Toolbar className="border-none" start={toolbarStart} end={<Button type="submit" label="Salvar" icon="pi pi-save" />} />

                <Panel header="Parâmetros Gerais" collapsed={false} className="mb-4">
                    <div className="formgrid grid">
                        <div className="field col-3">
                            <label htmlFor="linhasPorPagina" className="font-bold">
                                Linhas por página nas pesquisas:
                            </label>
                            <Dropdown
                                id="linhasPorPagina"
                                name="linhasPorPagina"
                                options={linhasPorPaginaLista}
                                value={form.linhasPorPagina.value}
                                invalid={form.linhasPorPagina.isAlert}
                                onChange={(e: DropdownChangeEvent) => setForm({ ...form, linhasPorPagina: { ...form.linhasPorPagina, value: e.target.value }})}
                                optionValue="value"
                                optionLabel="label" 
                                defaultValue={10}
                                className="w-full text-base"
                            />
                            {form.linhasPorPagina.isAlert && <small className="text-red-500">&nbsp;{form.linhasPorPagina.message}</small>}
                        </div>
                    </div>
                </Panel>

                <Panel header="Parâmetros de Senha" collapsed={false} className="mb-4">
                    <div className="formgrid grid">
                        <div className="field col-3">
                            <label htmlFor="cicloSenha" className="font-bold">
                                Ciclo de troca de senha:
                            </label>
                            <Dropdown
                                id="cicloSenha"
                                name="cicloSenha"
                                options={cicloSenhaLista}
                                value={form.cicloSenha.value}
                                invalid={form.cicloSenha.isAlert}
                                onChange={(e: DropdownChangeEvent) => setForm({ ...form, cicloSenha: { ...form.cicloSenha, value: e.target.value }})}
                                optionValue="value"
                                optionLabel="label" 
                                defaultValue={90}
                                className="w-full text-base"
                            />
                            {form.cicloSenha.isAlert && <small className="text-red-500">&nbsp;{form.cicloSenha.message}</small>}
                        </div>

                        <div className="field col-3">
                            <label htmlFor="numRepeticaoSenha" className="font-bold">
                                Repetição de senha:
                            </label>
                            <Dropdown
                                id="numRepeticaoSenha"
                                name="numRepeticaoSenha"
                                options={numRepeticaoSenhaLista}
                                value={form.numRepeticaoSenha.value}
                                invalid={form.numRepeticaoSenha.isAlert}
                                onChange={(e: DropdownChangeEvent) => setForm({ ...form, numRepeticaoSenha: { ...form.numRepeticaoSenha, value: e.target.value }})}
                                optionValue="value"
                                optionLabel="label" 
                                defaultValue={3}
                                className="w-full text-base"
                            />
                            {form.numRepeticaoSenha.isAlert && <small className="text-red-500">&nbsp;{form.numRepeticaoSenha.message}</small>}
                        </div>

                        <div className="field col-3">
                            <label htmlFor="minTamanhoSenha" className="font-bold">
                                Tamanho mínimo da senha:
                            </label>
                            <InputNumber
                                id="minTamanhoSenha"
                                name="minTamanhoSenha"
                                type="text"
                                value={form.minTamanhoSenha.value}
                                invalid={form.minTamanhoSenha.isAlert}
                                onValueChange={(e: InputNumberValueChangeEvent) => setForm({ ...form, minTamanhoSenha: { ...form.minTamanhoSenha, value: e.target.value }})}
                                className="w-full text-base"
                                locale="pt-BR"
                                useGrouping={false}
                            />
                            {form.minTamanhoSenha.isAlert && <small className="text-red-500">&nbsp;{form.minTamanhoSenha.message}</small>}
                        </div>
                    </div>
                    
                    <div className="formgrid grid">
                        <div className="field col-3">
                            <label htmlFor="caracterMinusculo" className="font-bold">
                                Exige caracter minúsculo:
                            </label>
                            <br />
                            <InputSwitch
                                id="caracterMinusculo"
                                name={"caracterMinusculo"}
                                className="mt-2"
                                checked={form.caracterMinusculo.value as boolean}
                                onChange={(e: InputSwitchChangeEvent) => setForm({ ...form, caracterMinusculo: { ...form.caracterMinusculo, value: e.target.value }})}
                            />
                            {form.caracterMinusculo.isAlert && <small className="text-red-500">&nbsp;{form.caracterMinusculo.message}</small>}
                        </div>

                        <div className="field col-3">
                            <label htmlFor="caracterMaiusculo" className="font-bold">
                                Exige caracter maiúsculo:
                            </label>
                            <br />
                            <InputSwitch
                                id="caracterMaiusculo"
                                name={"caracterMaiusculo"}
                                className="mt-2"
                                checked={form.caracterMaiusculo.value as boolean}
                                onChange={(e: InputSwitchChangeEvent) => setForm({ ...form, caracterMaiusculo: { ...form.caracterMaiusculo, value: e.target.value }})}
                            />
                            {form.caracterMaiusculo.isAlert && <small className="text-red-500">&nbsp;{form.caracterMaiusculo.message}</small>}
                        </div>

                        <div className="field col-3">
                            <label htmlFor="caracterEspecial" className="font-bold">
                                Exige caracter especial:
                            </label>
                            <br />
                            <InputSwitch
                                id="caracterEspecial"
                                name={"caracterEspecial"}
                                className="mt-2"
                                checked={form.caracterEspecial.value as boolean}
                                onChange={(e: InputSwitchChangeEvent) => setForm({ ...form, caracterEspecial: { ...form.caracterEspecial, value: e.target.value }})}
                            />
                            {form.caracterEspecial.isAlert && <small className="text-red-500">&nbsp;{form.caracterEspecial.message}</small>}
                        </div>

                        <div className="field col-3">
                            <label htmlFor="caracterNumerico" className="font-bold">
                                Exige caracter numérico:
                            </label>
                            <br />
                            <InputSwitch
                                id="caracterNumerico"
                                name={"caracterNumerico"}
                                className="mt-2"
                                checked={form.caracterNumerico.value as boolean}
                                onChange={(e: InputSwitchChangeEvent) => setForm({ ...form, caracterNumerico: { ...form.caracterNumerico, value: e.target.value }})}
                            />
                            {form.caracterNumerico.isAlert && <small className="text-red-500">&nbsp;{form.caracterNumerico.message}</small>}
                        </div>
                    </div>
                </Panel>
            </form>

            <ConfirmDialog group="page" />
            <Toast ref={toast} />
        </>
    );
};

export default Parametro;
