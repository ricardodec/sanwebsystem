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
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import fetchService from '@actions/fetch';
import Loading from '@ui/loading';
import { ObjectForm, ObjectList } from '@types';
import BreadcrumbUI from '@ui/breadcrumb';
import { addLocalePtBR, formataCarregarMais } from '@ui/formats';
import FeriadoEdit from './edit/page';
import { AuthContext } from '@context/auth';

export interface IFeriadoVo {
    data: Date | null;
    data_: string | null;
    nome: string | null;
}

const Feriado = () => {
    interface IForm {
        isErro: boolean;
        dataIni: ObjectForm<Nullable<Date>>;
        dataFim: ObjectForm<Nullable<Date>>;
        nome: ObjectForm<string>;
        pesquisa: ObjectList<IFeriadoVo>;
    }

    const dtIni = new Date();
    const dtFim = new Date();
    dtFim.setMonth(dtIni.getMonth() + 1);

    const formDefault: IForm = {
        isErro: false,
        dataIni: { isAlert: false, value: new Date(dtIni.getFullYear(), dtIni.getMonth(), dtIni.getDate()), message: '' },
        dataFim: { isAlert: false, value: new Date(dtFim.getFullYear(), dtFim.getMonth(), dtFim.getDate()), message: '' },
        nome: { isAlert: false, value: '', message: '' },
        pesquisa: {
            limit: 0,
            offset: 0,
            qtde: 0,
            ordem: 'data',
            ordemCrescente: true,
            ultimoRegistro: true,
            lista: []
        }
    };

    const [form, setForm] = useState<IForm>(formDefault);
    const [list, setList] = useState<IFeriadoVo[]>([]);
    const [selectedRow, setSelectedRow] = useState<IFeriadoVo | null>(null);
    const [selectedRows, setSelectedRows] = useState<IFeriadoVo[]>([]);
    const [feriadoDialog, setFeriadoDialog] = useState(false);

    const router = useRouter();
    const dataTableRef = useRef(null);
    const objectFocusRef = useRef(null);
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages>(null);
    
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        if (objectFocusRef.current !== null) {
            (objectFocusRef.current as HTMLElement).focus();
        }
        Loading.hide();
    }, []);

    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        Loading.show();

        await fetchService({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/feriado/pesquisar`,
            method: `POST`,
            token: auth?.token as string,
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

                const pesquisa = [...(data.pesquisa.lista as IFeriadoVo[])];

                data.pesquisa.lista = [];

                if (data.dataIni.value) {
                    data.dataIni.value = new Date(data.dataIni.value);
                }

                if (data.dataFim.value) {
                    data.dataFim.value = new Date(data.dataFim.value);
                }

                setForm(data);
                setList(pesquisa);
            })
            .finally(() => Loading.hide());
    };

    const onCarregarMais = async () => {
        Loading.show();

        await fetchService({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/feriado/pesquisar`,
            method: `POST`,
            token: auth?.token as string,
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

                const pesquisa = [...(data.pesquisa.lista as IFeriadoVo[])];

                data.pesquisa.lista = [];

                if (data.dataIni.value) {
                    data.dataIni.value = new Date(data.dataIni.value);
                }

                if (data.dataFim.value) {
                    data.dataFim.value = new Date(data.dataFim.value);
                }

                setForm(data);
                setList([...list, ...pesquisa]);
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
        setList([] as IFeriadoVo[]);
        setSelectedRow(null);
        setSelectedRows([]);

        if (objectFocusRef.current !== null) {
            (objectFocusRef.current as HTMLElement).focus();
        }
};

    const onAdicionarClick = () => {
        const feriadoVo: IFeriadoVo = {
            data: null,
            data_: null,
            nome: null
        };

        Loading.show();
        setSelectedRow(feriadoVo);
        setSelectedRows([]);
        setFeriadoDialog(true);
    };

    const onEditarClick = (data: IFeriadoVo) => {
        Loading.show();
        setSelectedRow(data);
        setSelectedRows([]);
        setFeriadoDialog(true);
    };

    const onExcluirClick = (data?: IFeriadoVo) => {
        if (data)
            setSelectedRows([data]);

        confirmDialog({
            group: 'page',
            message: 'Confirma a exclusão do(s) feriado(s) selecionado(s)?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'reject',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            onHide: () => setSelectedRows([]),
            accept: () => aoConfirmaExcluir(data)
        });
    };

    const aoConfirmaExcluir = (data?: IFeriadoVo) => {
        Loading.show();

        const selecao = data
            ? [data.data]
            : selectedRows.reduce((previous: Date[], current: IFeriadoVo) => {
                  previous.push(current.data as Date);
                  return previous;
              }, []);

        type ResponseData = {
            [key: string]: string;
        };

        fetchService({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/feriado/excluir`, method: `POST`, token: auth?.token as string, responseType: 'text', body: JSON.stringify(selecao) })
            .then((data: ResponseData | null) => {
                if (data !== null) {
                    let lista: IFeriadoVo[] = [...list];
                    const messages: MessagesMessage[] = [];

                    for (const date of selecao) {
                        if (date === null) continue;

                        const data_ = new Date(date);
                        const dateStr = data_.getDate().toString().padStart(2, '0') + '/' + (data_.getMonth() + 1).toString().padStart(2, '0') + '/' + data_.getFullYear();

                        if (date && Object.hasOwn(data, dateStr))
                            messages.push({ severity: 'error', sticky: true, closable: false, summary: 'Erro', detail: data[dateStr] });
                        else
                            lista = lista.filter((x) => x.data !== date);
                    }

                    setSelectedRow(null);
                    setList(lista);

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

    const toolbarStart = () => {
        const menu: MenuItem[] = [
            { icon: 'pi pi-sync', label: 'Início', command: () => router.push('/parceiro/acesso') },
            { label: 'Feriados', disabled: true }
        ];

        return <BreadcrumbUI menu={menu} />;
    };

    const actionsRowTemplate = (data: IFeriadoVo) => {
        return (
            <div className="flex flex-wrap align-items-center justify-content-center">
                <Button icon="pi pi-pencil" tooltip="Editar" rounded outlined onClick={() => onEditarClick(data)} />
                <Button icon="pi pi-trash" className="ml-2" rounded outlined severity="danger" onClick={() => onExcluirClick(data)} />
            </div>
        );
    };

    const onEditarClose = (feriado: IFeriadoVo | null)  => {
        if (feriado !== null) {
            const lista: IFeriadoVo[] = [ ...list ];
            const index: number = lista.findIndex(x => x.data_ === feriado.data_);

            if (index < 0) {
                lista.push(feriado);
            } else {
                lista[index] = feriado;
            }

            setList(lista);
            toast.current?.show({ severity: 'info', summary: 'Info', detail: `Operação realizada com sucesso!`});
        };
        
        setSelectedRow(null);
        setSelectedRows([]);
        setFeriadoDialog(false);
        Loading.hide();
    };

    addLocalePtBR();

    return (
        <>
            <form onSubmit={onSubmit}>
                <Toolbar className="border-none" start={toolbarStart} />

                <Panel header="Cadastro de Feriados" toggleable collapsed={false} footerTemplate={footerPanel} className="mb-4">
                    <Messages ref={msgs} />
                    <div className="formgrid grid">

                        <div className="field col-3">
                            <label htmlFor="nome" className="font-bold">
                                Nome:
                            </label>
                            <InputText
                                ref={objectFocusRef}
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

                        <div className="field col-2">
                            <label htmlFor="dataIni" className="font-bold">
                                Data Inicial:
                            </label>
                            <Calendar
                                id="dataIni"
                                value={form.dataIni.value}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        dataIni: {
                                            ...form.dataIni,
                                            value: e.target.value
                                        }
                                    })
                                }
                                className="w-full text-base"
                                locale="pt-BR"
                                showIcon
                                showButtonBar
                            />
                            {form.dataIni.isAlert && <small className="text-red-500">&nbsp;{form.dataIni.message}</small>}
                        </div>

                        <div className="field col-2">
                            <label htmlFor="dataFim" className="font-bold">
                                Data Final:
                            </label>
                            <Calendar
                                id="dataFim"
                                value={form.dataFim.value}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        dataFim: {
                                            ...form.dataFim,
                                            value: e.target.value
                                        }
                                    })
                                }
                                className="w-full text-base"
                                locale="pt-BR"
                                showIcon
                                showButtonBar
                            />
                            {form.dataFim.isAlert && <small className="text-red-500">&nbsp;{form.dataFim.message}</small>}
                        </div>
                    </div>
                </Panel>
            </form>

            <DataTable
                ref={dataTableRef}
                value={list}
                dataKey={(feriado: IFeriadoVo) => feriado.data?.toString() ?? ''}
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
                    field="data"
                    header="Data"
                    body={(data: IFeriadoVo) => data.data_}
                    headerClassName="bg-blue-100 h-2rem"
                    align="center"
                    sortable
                />

                <Column
                    field="nome"
                    header="Nome"
                    body={(data: IFeriadoVo) => data.nome}
                    headerClassName="bg-blue-100 h-2rem"
                    sortable
                />

                <Column
                    alignHeader="center"
                    headerClassName="bg-blue-100 h-2rem"
                    align="center"
                    body={actionsRowTemplate} exportable={false}
                />
            </DataTable>

            <Dialog visible={feriadoDialog} header="Feriado" className="p-fluid" style={{ width: '50%', height: '50%' }} modal maximizable showCloseIcon={false} closable={false} onHide={() => setFeriadoDialog(false)}>
                {selectedRow !== null && <FeriadoEdit data={selectedRow?.data} onClose={(feriado: IFeriadoVo | null) => onEditarClose(feriado)} />}
            </Dialog>

            <ConfirmDialog group="page" />
            <Toast ref={toast} />
        </>
    );
};

export default Feriado;
