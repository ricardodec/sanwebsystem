/* eslint-disable react-hooks/refs */
'use client';

import React, { useEffect, useState, useRef, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { MenuItem } from 'primereact/menuitem';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import { Messages, MessagesMessage } from 'primereact/messages';
import { Toolbar } from 'primereact/toolbar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Badge } from 'primereact/badge';
import Loading from '@ui/loading';
import BreadcrumbUI from '@ui/breadcrumb';
import { formatBoolean, formataCarregarMais } from '@ui/formats';
import { ObjectForm, ObjectList } from '@types';
import fetchService from '@actions/fetch';
import GrupoAcessoEdit from './edit/page';
import GrupoAcessoComponente from './componente/page';
import { AuthContext } from '@context/auth';

const GrupoAcesso = () => {
    interface IForm {
        isErro: boolean;
        parceiroId: number;
        nome: ObjectForm<string>;
        inativo: ObjectForm<boolean>;
        pesquisa: ObjectList<Control.IGrupoAcesso>;
    }

    const { auth } = useContext(AuthContext);
    
    const formDefault: IForm = {
        isErro: false,
        parceiroId: auth.parceiro?.id || 0,
        nome: { isAlert: false, value: '', message: '' },
        inativo: { isAlert: false, value: false, message: '' },
        pesquisa: {
            limit: 0,
            offset: 0,
            qtde: 0,
            ordem: 'nome',
            ordemCrescente: true,
            ultimoRegistro: true,
            lista: []
        }
    };
    const [form, setForm] = useState<IForm>(formDefault);
    const [lista, setLista] = useState<Control.IGrupoAcesso[]>([]);
    const [selectedRow, setSelectedRow] = useState<Control.IGrupoAcesso | null>(null);
    const [selectedRows, setSelectedRows] = useState<Control.IGrupoAcesso[]>([]);
    const [grupoAcessoDialog, setGrupoAcessoDialog] = useState(false);
    const [acaoDialog, setAcaoDialog] = useState(false);

    const router = useRouter();
    const dataTableRef = useRef(null);
    const objectFocusRef = useRef(null);
    const nome = useRef<string>('');
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
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/grupoacesso/pesquisar`,
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
                if (data === null) return;

                const pesquisa = [...(data.pesquisa.lista as Control.IGrupoAcesso[])];

                data.pesquisa.lista = [];

                setForm(data);
                setLista(pesquisa);
            })
            .finally(() => Loading.hide());
    };

    const onCarregarMais = async () => {
        Loading.show();

        await fetchService({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/grupoacesso/pesquisar`,
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
                if (data === null) return;

                const pesquisa = [...(data.pesquisa.lista as Control.IGrupoAcesso[])];

                data.pesquisa.lista = [];

                setForm(data);
                setLista([...lista, ...pesquisa]);
            })
            .finally(() => Loading.hide());
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
        setLista([] as Control.IGrupoAcesso[]);
        setSelectedRow(null);
        setSelectedRows([]);

        if (objectFocusRef.current !== null) {
            (objectFocusRef.current as HTMLElement).focus();
        }
    };

    const onExcluirClick = (data?: Control.IGrupoAcesso) => {
        if (data) setSelectedRows([data]);

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

    const aoConfirmaExcluir = (data?: Control.IGrupoAcesso) => {
        Loading.show();

        const selecao = data
            ? [data.id]
            : selectedRows.reduce((acc: number[], curr: Control.IGrupoAcesso) => {
                  acc.push(curr.id);
                  return acc;
              }, []);

        type ResponseData = {
            [key: number]: string;
        };

        fetchService({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/grupoacesso/excluir`, method: `POST`, token: auth.token as string, responseType: 'text', body: JSON.stringify(selecao) })
            .then((data: ResponseData | null) => {
                if (data !== null) {
                    let lista_: Control.IGrupoAcesso[] = [...lista];
                    const messages: MessagesMessage[] = [];

                    for (const id of selecao) {
                        if (Object.hasOwn(data, id)) messages.push({ severity: 'error', sticky: true, closable: false, summary: 'Erro', detail: data[id] });
                        else lista_ = lista.filter((x) => x.id !== id);
                    }

                    setSelectedRow(null);
                    setLista(lista_);

                    if (messages.length === 0) toast.current?.show({ severity: 'info', summary: 'Info', detail: `Operação realizada com sucesso!` });
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
        const pesquisaUsuario: Control.IGrupoAcesso = {
            id: 0,
            nome: '',
            ativo: true,
            acoes: []
        };

        Loading.show();
        setSelectedRow(pesquisaUsuario);
        setSelectedRows([]);
        setGrupoAcessoDialog(true);
    };

    const onEditarClick = (data: Control.IGrupoAcesso) => {
        Loading.show();
        setSelectedRow(data);
        setSelectedRows([]);
        setGrupoAcessoDialog(true);
    };

    const onAcaoClick = (data: Control.IGrupoAcesso) => {
        Loading.show();
        setSelectedRow(data);
        setSelectedRows([]);

        nome.current = data.nome;
        setAcaoDialog(true);
    };

    const onEditarClose = (grupoAcesso: Control.IGrupoAcesso | null) => {
        if (grupoAcesso !== null) {
            const index = lista.findIndex((x) => x.id === grupoAcesso.id);

            if (index < 0) {
                setLista([...lista, grupoAcesso]);
            } else {
                const lista_ = [...lista];
                lista_[index] = grupoAcesso;

                setLista(lista_);
            }

            toast.current?.show({ severity: 'info', summary: 'Info', detail: `Operação realizada com sucesso!` });
        }

        Loading.hide();
        setSelectedRow(null);
        setSelectedRows([]);
        setGrupoAcessoDialog(false);
    };

    const onAcaoClose = () => {
        Loading.hide();
        setSelectedRow(null);
        setSelectedRows([]);
        setAcaoDialog(false);
    };

    const toolbarStart = () => {
        const menu: MenuItem[] = [
            { icon: 'pi pi-sync', label: 'Início', command: () => router.push(form.parceiroId === 0 ? '/parceiro/acesso' : '/dashboard') },
            { label: 'Grupos de Acesso', disabled: true }
        ];

        return <BreadcrumbUI menu={menu} />;
    };

    const actionsRowTemplate = (data: Control.IGrupoAcesso) => {
        return (
            <div className="flex flex-wrap align-items-center justify-content-center">
                <Button icon="pi pi-pencil" tooltip="Editar" rounded outlined onClick={() => onEditarClick(data)} />
                <Button icon="pi pi-play-circle" tooltip="Ações" className="ml-2" rounded outlined severity="info" onClick={() => onAcaoClick(data)} />
                <Button icon="pi pi-trash" className="ml-2" rounded outlined severity="danger" onClick={() => onExcluirClick(data)} />
            </div>
        );
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <Toolbar className="border-none" start={toolbarStart} />

                <Panel header="Cadastro de Grupos de Acesso" toggleable collapsed={false} footerTemplate={footerPanel} className="mb-4">
                    <Messages ref={msgs} />
                    <div className="formgrid grid">
                        <div className="field col-3">
                            <label htmlFor="nome" className="font-bold">
                                Nome:
                            </label>

                            <InputText
                                id="nome"
                                name="nome"
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
                            <label htmlFor="inativo" className="font-bold">
                                Inativo:
                            </label>
                            <br />
                            <InputSwitch id="inativo" name="inativo" checked={form.inativo.value as boolean} onChange={(e: InputSwitchChangeEvent) => setForm({ ...form, inativo: { ...form.inativo, value: e.target.value } })} className="mt-2" />
                            {form.inativo.isAlert && <small className="text-red-500">&nbsp;{form.inativo.message}</small>}
                        </div>
                    </div>
                </Panel>
            </form>

            <DataTable
                ref={dataTableRef}
                value={lista}
                dataKey={(data: Control.IGrupoAcesso) => data.id.toString()}
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
                footer={lista.length > 0 && form.pesquisa && !form.pesquisa.ultimoRegistro && formataCarregarMais(onCarregarMais)}
                stripedRows
                showGridlines
                scrollable
                resizableColumns
                scrollHeight="400px"
            >
                <Column selectionMode="multiple" headerClassName="bg-blue-100 h-2rem" exportable={false} />

                <Column field="nome" header="Nome" body={(data: Control.IGrupoAcesso) => data.nome} headerClassName="bg-blue-100 h-2rem" sortable />

                <Column field="ativo" alignHeader="center" headerClassName="bg-blue-100 h-2rem" header="Ativo" align="center" body={(data: Control.IGrupoAcesso) => formatBoolean(data.ativo)} sortable />

                <Column alignHeader="center" headerClassName="bg-blue-100 h-2rem" align="center" body={actionsRowTemplate} exportable={false} />
            </DataTable>

            <Dialog visible={grupoAcessoDialog} header="Grupo de Acesso" className="p-fluid" style={{ width: '60%', height: '50%' }} modal maximizable showCloseIcon={false} closable={false} onHide={() => setGrupoAcessoDialog(false)}>
                {selectedRow !== null && <GrupoAcessoEdit grupoAcessoId={selectedRow?.id} onClose={onEditarClose}></GrupoAcessoEdit>}
            </Dialog>

            <Dialog visible={acaoDialog} header={nome.current} className="p-fluid" style={{ width: '60%', height: '100%' }} modal maximizable showCloseIcon={false} closable={false} onHide={() => setAcaoDialog(false)}>
                {selectedRow !== null && <GrupoAcessoComponente grupoAcessoId={selectedRow?.id} onClose={onAcaoClose}></GrupoAcessoComponente>}
            </Dialog>

            <ConfirmDialog group="page" />
            <Toast ref={toast} />
        </>
    );
};

export default GrupoAcesso;
