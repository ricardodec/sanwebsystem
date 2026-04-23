'use client';

import React, { useEffect, useState, useRef, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { MenuItem } from 'primereact/menuitem';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Loading from '@ui/loading';
import fetchService from '@actions/fetch';
import BreadcrumbUI from '@ui/breadcrumb';
import { formUsuarioDefault } from '../usuario/default/default-type';
import UsuarioEditDefault from '../usuario/default/default';
import { AuthContext } from '@context/auth';

const PerfilUsuarioEdit = () => {
    const formPrev = useRef<Auth.ICadastroUsuario>(formUsuarioDefault);
    const [form, setForm] = useState<Auth.ICadastroUsuario>(formUsuarioDefault);

    const formAlterado = () => JSON.stringify(form) !== JSON.stringify(formPrev.current);

    const { auth } = useContext(AuthContext);
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const objectFocusRef = useRef(null);

    useEffect(() => {
        fetchService({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/usuario`, method: `GET`, token: auth.token as string })
            .then((data: Auth.ICadastroUsuario | null) => {
                if (data === null) {
                    return;
                }

                formPrev.current = data;
                setForm(data);
            })
            .finally(() => {
                Loading.hide();
                
                if (objectFocusRef.current !== null) {
                    (objectFocusRef.current as HTMLElement).focus();
                }
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRetornarClick = () => {
        if (formAlterado()) {
            confirmDialog({
                group: 'page',
                message: 'Deseja ignorar as alterações?',
                header: 'Confirmar',
                icon: 'pi pi-exclamation-triangle',
                defaultFocus: 'reject',
                acceptLabel: 'Sim',
                rejectLabel: 'Não',
                accept: () => router.push('/parceiro/acesso')
            });
        } else {
            router.push('/parceiro/acesso');
        }
    };

    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (formAlterado()) {
            confirmDialog({
                group: 'page',
                message: 'Confirma as alterações?',
                header: 'Confirmar',
                icon: 'pi pi-exclamation-triangle',
                defaultFocus: 'reject',
                acceptLabel: 'Sim',
                rejectLabel: 'Não',
                accept: () => aoConfirmaSalvar()
            });
        } else {
            router.push('/parceiro/acesso');
        }
    };

    const aoConfirmaSalvar = () => {
        Loading.show();

        fetchService({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/usuario`, method: `POST`, token: auth.token as string, body: JSON.stringify(form) })
            .then((data: Auth.ICadastroUsuario | null) => {
                if (data != null) {
                    formPrev.current = data;
                    setForm(data);
                    toast.current?.show({ severity: 'info', summary: 'Info', detail: `Operação realizada com sucesso!` });
                }
            })
            .finally(() => {
                Loading.hide();
            });
    };

    const toolbarStart = () => {
        const menu: MenuItem[] = [
            { icon: 'pi pi-sync', label: 'Início', command: () => onRetornarClick() },
            { label: 'Perfil', disabled: true }
        ];

        return <BreadcrumbUI menu={menu} />;
    };

    const toolbarEnd = () => {
        return <Button type="submit" label="Salvar" icon="pi pi-save" />;
    };

    return (
        <form onSubmit={onSubmit}>
            <Toolbar className="border-none" start={toolbarStart} end={toolbarEnd}></Toolbar>

            <Panel header="Perfil do usuário">
                <UsuarioEditDefault ref={objectFocusRef} form={form} setForm={setForm} />
            </Panel>

            <Toast ref={toast} />
            <ConfirmDialog group="page" />
        </form>
    );
};

export default PerfilUsuarioEdit;
