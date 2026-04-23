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
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import { Messages, MessagesMessage } from 'primereact/messages';
import { Toolbar } from 'primereact/toolbar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Badge } from 'primereact/badge';
import fetchService from '@actions/fetch';
import Loading from '@ui/loading';
import { ObjectForm, ObjectList } from '@types';
import { TipoPessoaEnum, OperacaoEnum } from '@enums';
import BreadcrumbUI from '@ui/breadcrumb';
import {
  formatBoolean,
  formatCnpjCpf,
  formataCarregarMais,
} from '../../ui/formats';
import { FileAvatarUI } from '../../ui/files';
import { AuthContext } from '../../context/auth';
import ParceiroEdit from './edit/page';

const Parceiro = () => {
  interface IForm {
    isErro: boolean;
    cnpjCpf: ObjectForm<string>;
    nome: ObjectForm<string>;
    inativo: ObjectForm<boolean>;
    pesquisa: ObjectList<Control.IParceiro>;
  }

  const formDefault: IForm = {
    isErro: false,
    cnpjCpf: { isAlert: false, value: '', message: '' },
    nome: { isAlert: false, value: '', message: '' },
    inativo: { isAlert: false, value: false, message: '' },
    pesquisa: {
      limit: 0,
      offset: 0,
      qtde: 0,
      ordem: 'nome',
      ordemCrescente: true,
      ultimoRegistro: true,
      lista: [],
    },
  };

  const parceiroDefault: Control.IParceiro = {
    id: 0,
    cnpjCpf: '',
    tipoPessoa: TipoPessoaEnum.Empresa.value as Control.TipoPessoa,
    nome: '',
    operacao: OperacaoEnum.Securitizadora.value as Control.Operacao,
    ativo: true,
    logo: null,
    logoMimeType: null,
  };

  const { auth } = useContext(AuthContext);
  const [form, setForm] = useState<IForm>(formDefault);
  const [list, setList] = useState<Control.IParceiro[]>([]);
  const [selectedRow, setSelectedRow] = useState<Control.IParceiro | null>(
    null,
  );
  const [selectedRows, setSelectedRows] = useState<Control.IParceiro[]>([]);
  const [parceiroDialog, setParceiroDialog] = useState(false);

  const router = useRouter();
  const dataTableRef = useRef(null);
  const objectFocusRef = useRef(null);
  const toast = useRef<Toast>(null);
  const msgs = useRef<Messages>(null);

  useEffect(() => {
    Loading.hide();
  });

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    Loading.show();

    await fetchService({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/parceiro/pesquisar`,
      method: `POST`,
      token: auth.token as string,
      body: JSON.stringify({
        ...form,
        pesquisa: {
          ...form.pesquisa,
          offset: 0,
          qtde: 0,
          ultimoRegistro: false,
        },
      }),
    })
      .then((data: IForm | null) => {
        if (data === null) return;

        const pesquisa = [...(data.pesquisa.lista as Control.IParceiro[])];
        data.pesquisa.lista = [];

        setForm(data);
        setList(pesquisa);
      })
      .finally(() => {
        Loading.hide();
      });
  };

  const onCarregarMais = async () => {
    Loading.show();

    await fetchService({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/parceiro/pesquisar`,
      method: `POST`,
      token: auth.token as string,
      body: JSON.stringify(form),
    })
      .then((data: IForm | null) => {
        if (data === null) return;

        const pesquisa = [...(data.pesquisa.lista as Control.IParceiro[])];
        data.pesquisa.lista = [];

        setForm(data);
        setList([...list, ...pesquisa]);
      })
      .finally(() => Loading.hide());
  };

  const footerPanel = () => {
    const toolbarStart = () => {
      return (
        <Button
          type="button"
          label="Limpar"
          icon="pi pi-filter-slash"
          severity="info"
          outlined
          onClick={onLimparClick}
        />
      );
    };

    const toolbarEnd = () => {
      return (
        <>
          <Button
            type="button"
            label="Adiciona"
            icon="pi pi-plus"
            severity="success"
            className="mr-4"
            onClick={onAdicionarClick}
          />
          <Button
            type="button"
            label="Excluir"
            icon="pi pi-trash"
            severity="danger"
            className="mr-8"
            onClick={() => onExcluirClick()}
            disabled={selectedRows.length === 0}
          >
            {selectedRows.length > 0 && (
              <Badge
                className="text-red-600"
                value={selectedRows.length}
                severity="contrast"
              />
            )}
          </Button>
          <Button
            type="submit"
            label="Pesquisar"
            icon="pi pi-filter"
            severity="info"
          />
        </>
      );
    };

    return (
      <div className="bg-white">
        <Toolbar
          className="bg-white border-none"
          start={toolbarStart}
          end={toolbarEnd}
        />
        <small className="ml-3">Use os filtros para refinar a pesquisa.</small>
      </div>
    );
  };

  const onLimparClick = () => {
    setForm(formDefault);
    setList([] as Control.IParceiro[]);
    setSelectedRow(null);
    setSelectedRows([]);

    if (objectFocusRef.current) {
      (objectFocusRef.current as HTMLElement).focus();
    }
  };

  const onExcluirClick = (data?: Control.IParceiro) => {
    if (data) {
      setSelectedRows([data]);
    }

    confirmDialog({
      group: 'page',
      message: 'Confirma a exclusão do(s) parceiro(s) selecionado(s)?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'reject',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      onHide: () => setSelectedRows([]),
      accept: () => aoConfirmaExcluir(data),
    });
  };

  const aoConfirmaExcluir = (data?: Control.IParceiro) => {
    Loading.show();

    const selecao = data
      ? [data.id]
      : selectedRows.reduce(
          (previous: number[], current: Control.IParceiro) => {
            previous.push(current.id);
            return previous;
          },
          [],
        );

    type ResponseData = {
      [key: number]: string;
    };

    fetchService({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/usuario/excluir`,
      method: `POST`,
      token: auth.token as string,
      responseType: 'text',
      body: JSON.stringify(selecao),
    })
      .then((data: ResponseData | null) => {
        if (data !== null) {
          let lista: Control.IParceiro[] = [...list];
          const messages: MessagesMessage[] = [];

          for (const id of selecao) {
            if (Object.hasOwn(data, id))
              messages.push({
                severity: 'error',
                sticky: true,
                closable: false,
                summary: 'Erro',
                detail: data[id],
              });
            else lista = lista.filter((x) => x.id !== id);
          }

          setSelectedRow(null);
          setList(lista);

          if (messages.length === 0)
            toast.current?.show({
              severity: 'info',
              summary: 'Info',
              detail: `Operação realizada com sucesso!`,
            });
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
    Loading.show();
    setSelectedRow(parceiroDefault);
    setSelectedRows([]);
    setParceiroDialog(true);
  };

  const onEditarClick = (data: Control.IParceiro) => {
    Loading.show();
    setSelectedRow(data);
    setSelectedRows([]);
    setParceiroDialog(true);
  };

  const onEditarClose = (parceiro: Control.IParceiro | null) => {
    if (parceiro !== null) {
      const index = list.findIndex((p) => p.id === parceiro.id);

      if (index < 0) {
        setList([...list, parceiro]);
      } else {
        const lista = [...list];
        lista[index] = parceiro;

        setList(lista);
      }

      toast.current?.show({
        severity: 'info',
        summary: 'Info',
        detail: `Operação realizada com sucesso!`,
      });
    }

    Loading.hide();
    setSelectedRow(null);
    setSelectedRows([]);
    setParceiroDialog(false);
  };

  const toolbarStart = () => {
    const menu: MenuItem[] = [
      {
        icon: 'pi pi-sync',
        label: 'Início',
        command: () => router.push('/parceiro/acesso'),
      },
      { label: 'Parceiros', disabled: true },
    ];

    return <BreadcrumbUI menu={menu} />;
  };

  const logoTemplate = (data: Control.IParceiro) =>
    data.logo &&
    data.logoMimeType && (
      <FileAvatarUI
        file={data.logo}
        mimeType={data.logoMimeType}
        size="large"
      />
    );

  const actionsRowTemplate = (data: Control.IParceiro) => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-center">
        <Button
          icon="pi pi-pencil"
          tooltip="Editar"
          rounded
          outlined
          onClick={() => onEditarClick(data)}
        />
        <Button
          icon="pi pi-trash"
          className="ml-2"
          rounded
          outlined
          severity="danger"
          onClick={() => onExcluirClick(data)}
        />
      </div>
    );
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <Toolbar className="border-none" start={toolbarStart} />

        <Panel
          header="Cadastro de Parceiros"
          toggleable
          collapsed={false}
          footerTemplate={footerPanel}
          className="mb-4"
        >
          <Messages ref={msgs} />
          <div className="formgrid grid">
            <div className="field col-2">
              <label htmlFor="cnpjCpf" className="font-bold">
                CNPJ/CPF:
              </label>

              <InputText
                id="cnpjCpf"
                ref={objectFocusRef}
                type="text"
                value={form.cnpjCpf.value as string}
                invalid={form.cnpjCpf.isAlert}
                onChange={(e) =>
                  setForm({
                    ...form,
                    cnpjCpf: {
                      ...form.cnpjCpf,
                      value: e.target.value,
                    },
                  })
                }
                className="w-full text-base"
                autoFocus
                aria-describedby="cnpjCpf-help"
              />
              <small id="cnpjCpf-help">Iniciado por...</small>
              {form.cnpjCpf.isAlert && (
                <small className="text-red-500">
                  &nbsp;{form.cnpjCpf.message}
                </small>
              )}
            </div>

            <div className="field col-3">
              <label htmlFor="nome" className="font-bold">
                Nome:
              </label>

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
                      value: e.target.value,
                    },
                  })
                }
                className="w-full text-base"
                aria-describedby="nome-help"
              />
              <small id="nome-help">Contém...</small>
              {form.nome.isAlert && (
                <small className="text-red-500">
                  &nbsp;{form.nome.message}
                </small>
              )}
            </div>

            <div className="field col-3">
              <label htmlFor="inativo" className="font-bold">
                Inativo:
              </label>
              <br />
              <InputSwitch
                id="inativo"
                checked={form.inativo.value as boolean}
                onChange={(e: InputSwitchChangeEvent) =>
                  setForm({
                    ...form,
                    inativo: { ...form.inativo, value: e.target.value },
                  })
                }
              />
              {form.inativo.isAlert && (
                <small className="text-red-500">
                  &nbsp;{form.inativo.message}
                </small>
              )}
            </div>
          </div>
        </Panel>
      </form>

      <DataTable
        ref={dataTableRef}
        value={list}
        dataKey={(data: Control.IParceiro) => data.id.toString()}
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
              ordemCrescente: e.sortOrder === 1,
            },
          });
        }}
        emptyMessage="Seleção não retornou resultados."
        footer={
          list.length > 0 &&
          form.pesquisa &&
          !form.pesquisa.ultimoRegistro &&
          formataCarregarMais(onCarregarMais)
        }
        stripedRows
        showGridlines
        scrollable
        resizableColumns
      >
        <Column
          selectionMode="multiple"
          headerClassName="bg-blue-100 h-2rem"
          exportable={false}
        />

        <Column
          field="id"
          header="#"
          body={(data: Control.IParceiro) => data.id}
          headerClassName="bg-blue-100 h-2rem"
          sortable
        />

        <Column
          field="cnpjCpf"
          header="CNPJ/CPF"
          body={(data: Control.IParceiro) => formatCnpjCpf(data.cnpjCpf)}
          headerClassName="bg-blue-100 h-2rem"
          sortable
        />

        <Column
          field="nome"
          header="Nome"
          body={(data: Control.IParceiro) => data.nome}
          headerClassName="bg-blue-100 h-2rem"
          sortable
        />

        <Column
          field="ativo"
          alignHeader="center"
          headerClassName="bg-blue-100 h-2rem"
          header="Ativo"
          align="center"
          body={(data: Control.IParceiro) => formatBoolean(data.ativo)}
          sortable
        />

        <Column
          alignHeader="center"
          headerClassName="bg-blue-100 h-2rem"
          align="center"
          field="logo"
          header="Logotipo"
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
        visible={parceiroDialog}
        header="Cadastro de Parceiro(s)"
        className="p-fluid"
        style={{ width: '60%', height: '100%' }}
        modal
        maximizable
        showCloseIcon={false}
        closable={false}
        onHide={() => setParceiroDialog(false)}
      >
        {selectedRow !== null && (
          <ParceiroEdit parceiroId={selectedRow?.id} onClose={onEditarClose} />
        )}
      </Dialog>

      <ConfirmDialog group="page" />
      <Toast ref={toast} />
    </>
  );
};

export default Parceiro;
