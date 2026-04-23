'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MenuItem } from 'primereact/menuitem';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Messages, MessagesMessage } from 'primereact/messages';
import { Toolbar } from 'primereact/toolbar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Badge } from 'primereact/badge';
import fetchService from '@actions/fetch';
import Loading from '@ui/loading';
import { ObjectForm, ObjectList } from '@types';
import { TFATipoEnum } from '@enums';
import BreadcrumbUI from '@ui/breadcrumb';
import { formatBoolean, formataCarregarMais } from '@ui/formats';
import { FileAvatarUI } from '@ui/files';
import UsuarioEdit from './edit/page';
import UsuarioParceiro from './parceiro/page';
import { AuthContext } from '@context/auth';

export interface IPesquisaUsuario {
    id: number;
    login: string;
    nome: string;
    email: string;
    ehControlador: boolean;
    ativo: boolean;
    tfa: boolean;
    tfaTipo: number | null;
    foto: string | null;
    fotoMimeType: string | null;
};

const Usuario = () => {
    
    interface IForm {
        isErro: boolean;
        parceiroId: number;
        login: ObjectForm<string>;
        nome: ObjectForm<string>;
        email: ObjectForm<string>;
        pesquisa: ObjectList<IPesquisaUsuario>;
    };

    const { auth } = useContext(AuthContext);
    
    const formDefault: IForm = {
        isErro: false,
        parceiroId: auth.parceiroId ?? 0,
        login: { isAlert: false, value: '', message: '' },
        nome: { isAlert: false, value: '', message: '' },
        email: { isAlert: false, value: '', message: '' },
        pesquisa: {
            limit: 0,
            offset: 0,
            qtde: 0,
            ordem: 'login',
            ordemCrescente: true,
            ultimoRegistro: true,
            lista: []
        }
    };
    
    const [form, setForm] = useState<IForm>(formDefault);
    const [list, setList] = useState<IPesquisaUsuario[]>([]);
    const [selectedRow, setSelectedRow] = useState<IPesquisaUsuario | null>(null);
    const [selectedRows, setSelectedRows] = useState<IPesquisaUsuario[]>([]);
    const [usuarioDialog, setUsuarioDialog] = useState(false);
    const [parceiroDialog, setParceiroDialog] = useState(false);

    const router = useRouter();
    const dataTableRef = useRef(null);
    const objectFocusRef = useRef(null);
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages>(null);

    useEffect(() => {
        Loading.hide();
    }, []);

    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        Loading.show();

        await fetchService({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/usuario/pesquisar`,
            method: `POST`,
            token: auth.token as string,
            body: JSON.stringify({
                ...form,
                pesquisa: {
                    ...form.pesquisa,
                    offset: 0,
                    qtde: 0,
                    ultimoRegistro: false,
                    lista: []
                }
            })
        })
            .then((data: IForm | null) => {
                if (data === null)
                    return;

                const pesquisa = [ ...data.pesquisa.lista as IPesquisaUsuario[] ];

                data.pesquisa.lista = [];

                setForm(data);
                setList(pesquisa);
            })
            .finally(() => Loading.hide() );
    };

    const onCarregarMais = async () => {
        Loading.show();

        await fetchService({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/usuario/pesquisar`,
            method: `POST`,
            token: auth.token as string,
            body: JSON.stringify({
                ...form,
                pesquisa: {
                    ...form.pesquisa,
                    lista: []
                }
            })
        })
            .then((data: IForm | null) => {
                if (data === null)
                    return;

                const pesquisa = [ ...data.pesquisa.lista as IPesquisaUsuario[] ];

                data.pesquisa.lista = [];

                setForm(data);
                setList([...list, ...pesquisa ]);
            })
            .finally(() => Loading.hide() );
    };
    
    const footerPanel = () => {
        const toolbarStart = () => {
            return <Button type="button" label="Limpar" icon="pi pi-filter-slash" severity="info" outlined onClick={onLimparClick} />;
        };

        const toolbarEnd = () => {
            return (
                <>
                    <Button type="button" label="Adiciona" icon="pi pi-plus" severity="success" className="mr-4" onClick={onAdicionarClick} />
                    <Button type="button" label="Excluir" icon="pi pi-trash" severity="danger" className="mr-8" onClick={() => onExcluirClick()} disabled={selectedRows.length === 0}>
                        {selectedRows.length > 0 && <Badge className="text-red-600" value={selectedRows.length} severity="contrast" />}
                    </Button>                        
                    <Button type="submit" label="Pesquisar" icon="pi pi-filter" severity="info" />
                </>
            );
        };

        return (
            <div className="bg-white">
                <Toolbar className="bg-white border-none" start={toolbarStart} end={toolbarEnd} />
                <small className="ml-3">Use os filtros para refinar a pesquisa.</small>
            </div>
        );
    };

    const onLimparClick = () => {
        setForm(formDefault);
        setList([] as IPesquisaUsuario[]);
        setSelectedRow(null);
        setSelectedRows([]);

        if (objectFocusRef.current !== null) {
            (objectFocusRef.current as HTMLElement).focus();
        }
    };

    const onExcluirClick = (data?: IPesquisaUsuario) => {

        if (data) {
            setSelectedRows([ data ]);
        }

        confirmDialog({
            group: 'page',
            message: 'Confirma a exclusão do(s) usuário(s) selecionado(s)?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'reject',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            onHide: () => setSelectedRows([]),
            accept: () => aoConfirmaExcluir(data)
        });
    };

    const aoConfirmaExcluir = (data?: IPesquisaUsuario) => {
        Loading.show();
        
        const selecao = data ? [data.id] : selectedRows.reduce((acc: number[], curr: IPesquisaUsuario) => {
            acc.push(curr.id);
            return acc;
        }, []);

        type ResponseData = {
            [key: number]: string;
        };

        fetchService({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/usuario/excluir`, method: `POST`, token: auth.token as string, responseType: 'text', body: JSON.stringify(selecao) })
            .then((data: ResponseData | null) => {
                if (data !== null) {
                    let lista: IPesquisaUsuario[] = [ ...list ];
                    const messages: MessagesMessage[] = [];

                    for (const id of selecao) {
                        if (Object.hasOwn(data, id))
                            messages.push({ severity: 'error', sticky: true, closable: false, summary: 'Erro', detail: data[id]});
                        else
                            lista = lista.filter(x => x.id !== id);
                    }

                    setSelectedRow(null);
                    setList(lista);
                    
                    if (messages.length === 0)
                        toast.current?.show({ severity: 'info', summary: 'Info', detail: `Operação realizada com sucesso!`});
                    else {
                        msgs.current?.clear();
                        msgs.current?.show(messages);
                    }
                }
            })
            .finally(() => {
                Loading.hide();
            });
    };

    const onAdicionarClick = () => {
        const pesquisaUsuario: IPesquisaUsuario = {
            id: 0,
            login: '',
            nome: '',
            email: '',
            ehControlador: false,
            ativo: true,
            tfa: false,
            tfaTipo: null,
            foto: null,
            fotoMimeType: null
        };

        Loading.show();
        setSelectedRow(pesquisaUsuario);
        setSelectedRows([]);
        setUsuarioDialog(true);
    };

    const onUsuarioClick = (data: IPesquisaUsuario) => {
        Loading.show();
        setSelectedRow(data);
        setSelectedRows([]);
        setUsuarioDialog(true);
    };

    const onParceiroClick = (data: IPesquisaUsuario) => {
        Loading.show();
        setSelectedRow(data);
        setSelectedRows([]);
        setParceiroDialog(true);
    };

    const onUsuarioClose = (usuario: Auth.ICadastroUsuario | null)  => {
        if (usuario !== null) {
            const index = list.findIndex((u) => u.id === usuario.id);

            const pesquisaUsuario: IPesquisaUsuario = {
                id: usuario.id,
                login: usuario.login.value,
                nome: usuario.nome.value,
                email: usuario.email.value,
                ehControlador: usuario.ehControlador.value,
                ativo: usuario.ativo.value,
                tfa: usuario.tfa.value,
                tfaTipo: usuario.tfaTipo.value,
                foto: usuario.foto.value,
                fotoMimeType: usuario.fotoMimeType.value
            };

            if (index < 0) {
                setList([
                    ...list,
                    pesquisaUsuario
                ]);
            }
            else {
                const usuarioLista = [...list];
                usuarioLista[index] = pesquisaUsuario;

                setList(usuarioLista);
            }

            toast.current?.show({ severity: 'info', summary: 'Info', detail: `Operação realizada com sucesso!`});
        };
        
        Loading.hide();
        setSelectedRow(null);
        setSelectedRows([]);
        setUsuarioDialog(false);
    };
 
    const onParceiroClose = ()  => {
        Loading.hide();
        setSelectedRow(null);
        setSelectedRows([]);
        setParceiroDialog(false);
    };
  
    const toolbarStart = () => {
        const menu: MenuItem[]  = [
            { icon: 'pi pi-sync', label: 'Início', command: () => router.push(form.parceiroId === 0 ? '/parceiro/acesso' : '/dashboard') },
            { label: 'Usuários', disabled: true }
        ];

        return <BreadcrumbUI menu={menu} />
    };

    const logoTemplate = (data: IPesquisaUsuario) => data.foto && data.fotoMimeType && <FileAvatarUI file={data.foto} mimeType={data.fotoMimeType} size='large' />

    const tipoTFATemplate = (data: IPesquisaUsuario) => {
        if (data.tfaTipo === null)
            return "";
        else if (data.tfaTipo === TFATipoEnum.Google.value)
            return TFATipoEnum.Google.name;
        else if (data.tfaTipo === TFATipoEnum.Email.value)
            return TFATipoEnum.Email.name;
        else
            return "Inválido";
    };
    
    const actionsRowTemplate = (data: IPesquisaUsuario) => {
        return (
            <div className="flex flex-wrap align-items-center justify-content-center">
                <Button icon="pi pi-pencil" tooltip="Editar" rounded outlined onClick={() => onUsuarioClick(data)} />
                {
                    !data.ehControlador && <Button icon="pi pi-building" tooltip="Parceiros" className="ml-2" rounded outlined severity="info" onClick={() => onParceiroClick(data)} />
                }
                <Button icon="pi pi-trash" className="ml-2" rounded outlined severity="danger" onClick={() => onExcluirClick(data)} />
            </div>
        );
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <Toolbar className="border-none" start={toolbarStart} />

                <Panel header="Cadastro de Usuários" toggleable collapsed={false} footerTemplate={footerPanel} className="mb-4">
                    <Messages ref={msgs} />
                    <div className="formgrid grid">
                        <div className="field col-2">
                            <label htmlFor="login" className="font-bold">Login:</label>

                            <InputText
                                id="login"
                                ref={objectFocusRef}
                                type="text"
                                value={form.login.value as string}
                                invalid={form.login.isAlert}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        login: {
                                            ...form.login,
                                            value: e.target.value
                                        }
                                    })
                                }
                                className="w-full text-base"
                                autoFocus
                            />
                            {form.login.isAlert && <small className="text-red-500">&nbsp;{form.login.message}</small>}
                        </div>

                        <div className="field col-3">
                            <label htmlFor="nome" className="font-bold">Nome:</label>

                            <InputText
                                id="nome"
                                type="text"
                                value={form.nome.value as string}
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

                        <div className="field col-3">
                            <label htmlFor="email" className="font-bold">E-mail:</label>

                            <InputText
                                id="email"
                                type="email"
                                value={form.email.value as string}
                                invalid={form.email.isAlert}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        email: {
                                            ...form.email,
                                            value: e.target.value
                                        }
                                    })
                                }
                                className="w-full text-base"
                            />
                            {form.email.isAlert && <small className="text-red-500">&nbsp;{form.email.message}</small>}
                        </div>
                    </div>
                </Panel>
            </form>

            <DataTable
                ref={dataTableRef}
                value={list}
                dataKey={(data: IPesquisaUsuario) => data.id.toString()}
                selectionMode="checkbox"
                selection={selectedRows}
                onSelectionChange={(e) => setSelectedRows(e.value)}
                sortField={form.pesquisa.ordem}
                sortOrder={form.pesquisa.ordemCrescente ? 1 : -1}
                onSort={(e) => {
                    setForm({
                        ...form,
                        pesquisa: {
                            ...form.pesquisa,
                            ordem: e.sortField,
                            ordemCrescente: e.sortOrder === 1
                        }
                    });
                }}
                emptyMessage="Seleção não retornou resultados."
                footer={list.length > 0 && form.pesquisa && !form.pesquisa.ultimoRegistro && formataCarregarMais(onCarregarMais)}
                stripedRows
                showGridlines
                scrollable
                resizableColumns
                scrollHeight="400px"
            >
                <Column
                    selectionMode="multiple"
                    headerClassName="bg-blue-100 h-2rem"
                    exportable={false}
                />

                <Column
                    field="login"
                    header="Login"
                    body={(data: IPesquisaUsuario) => data.login}
                    headerClassName="bg-blue-100 h-2rem"
                    sortable
                />

                <Column
                    field="nome"
                    header="Nome"
                    body={(data: IPesquisaUsuario) => data.nome}
                    headerClassName="bg-blue-100 h-2rem"
                    sortable
                />

                <Column
                    field="email"
                    header="E-mail"
                    body={(data: IPesquisaUsuario) => data.email}
                    headerClassName="bg-blue-100 h-2rem"
                    sortable
                />

                <Column
                    field="ehControlador"
                    alignHeader="center"
                    headerClassName="bg-blue-100 h-2rem"
                    header="Controlador"
                    align="center"
                    body={(data: IPesquisaUsuario) => formatBoolean(data.ehControlador)}
                    sortable
                />

                <Column
                    field="tfa"
                    alignHeader="center"
                    headerClassName="bg-blue-100 h-2rem"
                    header="TFA"
                    align="center"
                    body={(data: IPesquisaUsuario) => formatBoolean(data.tfa)}
                    sortable
                />

                <Column
                    field="tfaTipo"
                    headerClassName="bg-blue-100 h-2rem"
                    header="Tipo de TFA"
                    body={tipoTFATemplate}
                    sortable
                />

                <Column
                    field="ativo"
                    alignHeader="center"
                    headerClassName="bg-blue-100 h-2rem"
                    header="Ativo"
                    align="center"
                    body={(data: IPesquisaUsuario) => formatBoolean(data.ativo)}
                    sortable
                />

                <Column
                    alignHeader="center"
                    headerClassName="bg-blue-100 h-2rem"
                    align="center"
                    field="foto"
                    header="Foto"
                    body={logoTemplate}
                />

                <Column
                    alignHeader="center"
                    headerClassName="bg-blue-100 h-2rem"
                    align="center"
                    body={actionsRowTemplate}
                    exportable={false}
                />
            </DataTable>

            <Dialog
                visible={usuarioDialog}
                header="Usuário"
                className="p-fluid"
                style={{ width: "60%", height: "100%" }}
                modal
                maximizable 
                showCloseIcon={false}
                closable={false}
                onHide={() => setUsuarioDialog(false)}
            >   
                {selectedRow !== null && <UsuarioEdit usuarioId={selectedRow?.id} parceiroId={form.parceiroId} onClose={(usuario: Auth.ICadastroUsuario | null) => onUsuarioClose(usuario)} />}
            </Dialog>

            <Dialog
                visible={parceiroDialog}
                header="Liberação de acesso à parceiro(s)"
                className="p-fluid"
                style={{ width: "60%", height: "100%" }}
                modal
                maximizable 
                showCloseIcon={false}
                closable={false}
                onHide={() => setParceiroDialog(false)}
            >   
                {selectedRow !== null && <UsuarioParceiro usuarioId={selectedRow?.id} onClose={onParceiroClose} />}
            </Dialog>

            <ConfirmDialog group="page" />
            <Toast ref={toast} />
        </>
    );
};

export default Usuario;
