'use client';

import React, { useEffect, useState, useRef, useContext } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ScrollTop } from 'primereact/scrolltop';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { DataTable } from 'primereact/datatable';
import { Badge } from 'primereact/badge';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Messages, MessagesMessage } from 'primereact/messages';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { ObjectForm, ObjectOption } from '@types';
import { TipoPessoaEnum, OperacaoEnum } from '@enums';
import fetchService from '@actions/fetch';
import Loading from '@ui/loading';
import CnpjCpfUI from '@ui/cnpjcpf';
import { FileUploadUI } from '@ui/files';
import { addLocalePtBR, formatBoolean } from '@ui/formats';
import Endereco, {
  IEnderecoForm,
  formDefault as formEnderecoDefault,
} from '@ui/pessoa/endereco';
import Telefone, {
  ITelefoneForm,
  formDefault as formTelefoneDefault,
} from '@ui/pessoa/telefone';
import Email, {
  IEmailForm,
  formDefault as formEmailDefault,
} from '@ui/pessoa/email';
import RedeSocial, {
  IRedeSocialForm,
  formDefault as formRedeSocialDefault,
} from '@ui/pessoa/redeSocial';
import { AuthContext } from '@context/auth';

type EmpresaForm = {
  nomeFantasia: ObjectForm<string>;
  inscricaoEstadual: ObjectForm<string>;
  inscricaoMunicipal: ObjectForm<string>;
  dataAbertura: ObjectForm<Nullable<Date>>;
  grupoEconomicoId: ObjectForm<number>;
  grupoEconomicoLista: ObjectOption<number>[];
};

export interface IForm {
  isErro: boolean;
  id: number;
  pessoaId: number;
  cnpjCpf: ObjectForm<string>;
  tipoPessoa: ObjectForm<number>;
  nome: ObjectForm<string>;
  operacao: ObjectForm<number>;
  ativo: ObjectForm<boolean>;
  logo: ObjectForm<string>;
  logoMimeType: ObjectForm<string>;
  operacaoLista: ObjectOption<number>[];
  ehComercial: ObjectForm<boolean>;
  ehInvestidor: ObjectForm<boolean>;
  ehSacado: ObjectForm<boolean>;
  ehFornecedor: ObjectForm<boolean>;
  empresa: EmpresaForm;
  enderecoLista: IEnderecoForm[];
  tipoEnderecoLista: ObjectOption<number>[];
  telefoneLista: ITelefoneForm[];
  tipoTelefoneLista: ObjectOption<number>[];
  emailLista: IEmailForm[];
  redeSocialLista: IRedeSocialForm[];
  tipoRedeSocialLista: ObjectOption<number>[];
  estadoLista: ObjectOption<string>[];
}

export const formDefault: IForm = {
  isErro: false,
  id: 0,
  pessoaId: 0,
  cnpjCpf: { isAlert: false, value: '', message: '' },
  tipoPessoa: {
    isAlert: false,
    value: TipoPessoaEnum.Empresa.value,
    message: '',
  },
  nome: { isAlert: false, value: '', message: '' },
  operacao: {
    isAlert: false,
    value: OperacaoEnum.Securitizadora.value,
    message: '',
  },
  ativo: { isAlert: false, value: true, message: '' },
  logo: { isAlert: false, value: '', message: '' },
  logoMimeType: { isAlert: false, value: '', message: '' },
  operacaoLista: [],
  ehComercial: { isAlert: false, value: false, message: '' },
  ehInvestidor: { isAlert: false, value: false, message: '' },
  ehSacado: { isAlert: false, value: false, message: '' },
  ehFornecedor: { isAlert: false, value: false, message: '' },
  empresa: {
    nomeFantasia: { isAlert: false, value: '', message: '' },
    inscricaoEstadual: { isAlert: false, value: null, message: '' },
    inscricaoMunicipal: { isAlert: false, value: null, message: '' },
    dataAbertura: { isAlert: false, value: null, message: '' },
    grupoEconomicoId: { isAlert: false, value: null, message: '' },
    grupoEconomicoLista: [],
  },
  enderecoLista: [],
  tipoEnderecoLista: [],
  telefoneLista: [],
  tipoTelefoneLista: [],
  emailLista: [],
  redeSocialLista: [],
  tipoRedeSocialLista: [],
  estadoLista: [],
};

interface ParceiroEditProps {
  parceiroId: number;
  onClose: (parceiro: Control.IParceiro | null) => void;
}

const ParceiroEdit = ({ parceiroId, onClose }: ParceiroEditProps) => {
  const { auth } = useContext(AuthContext);
  const [form, setForm] = useState<IForm>(formDefault);
  const [enderecoLista, setEnderecoLista] = useState<IEnderecoForm[]>([]);
  const [telefoneLista, setTelefoneLista] = useState<ITelefoneForm[]>([]);
  const [emailLista, setEmailLista] = useState<IEmailForm[]>([]);
  const [redeSocialLista, setRedeSocialLista] = useState<IRedeSocialForm[]>([]);
  const formPrev = useRef<IForm>(formDefault);

  const tipoEnderecoLista = useRef<ObjectOption<number>[]>([]);
  const tipoTelefoneLista = useRef<ObjectOption<number>[]>([]);
  const tipoRedeSocialLista = useRef<ObjectOption<number>[]>([]);
  const estadoLista = useRef<ObjectOption<string>[]>([]);

  const formAlterado = () =>
    JSON.stringify(form) !== JSON.stringify(formPrev.current);

  const objectFocusRef = useRef(null);
  const toast = useRef<Toast>(null);
  const msgs = useRef<Messages>(null);
  const [selectedEnderecoRow, setSelectedEnderecoRow] =
    useState<IEnderecoForm | null>(null);
  const [selectedEnderecoRows, setSelectedEnderecoRows] = useState<
    IEnderecoForm[]
  >([]);
  const [selectedTelefoneRow, setSelectedTelefoneRow] =
    useState<ITelefoneForm | null>(null);
  const [selectedTelefoneRows, setSelectedTelefoneRows] = useState<
    ITelefoneForm[]
  >([]);
  const [selectedEmailRow, setSelectedEmailRow] = useState<IEmailForm | null>(
    null,
  );
  const [selectedEmailRows, setSelectedEmailRows] = useState<IEmailForm[]>([]);
  const [selectedRedeSocialRow, setSelectedRedeSocialRow] =
    useState<IRedeSocialForm | null>(null);
  const [selectedRedeSocialRows, setSelectedRedeSocialRows] = useState<
    IRedeSocialForm[]
  >([]);
  const [enderecoDialog, setEnderecoDialog] = useState(false);
  const [telefoneDialog, setTelefoneDialog] = useState(false);
  const [emailDialog, setEmailDialog] = useState(false);
  const [redeSocialDialog, setRedeSocialDialog] = useState(false);

  useEffect(() => {
    let url: string;
    let body: string;

    if (parceiroId && parceiroId > 0) {
      url = `${process.env.NEXT_PUBLIC_API_URL}/api/controle/parceiro/editar`;
      body = parceiroId.toString();
    } else {
      url = `${process.env.NEXT_PUBLIC_API_URL}/api/controle/parceiro/adicionar`;
      body = '';
    }

    fetchService({
      url: url,
      method: `POST`,
      token: auth.token as string,
      body: body,
    })
      .then((data: IForm | null) => {
        if (data === null) {
          return;
        }

        formPrev.current = {
          ...data,
          enderecoLista: [],
          tipoEnderecoLista: [],
          telefoneLista: [],
          tipoTelefoneLista: [],
          estadoLista: [],
          emailLista: [],
        };
        setForm({
          ...data,
          enderecoLista: [],
          tipoEnderecoLista: [],
          telefoneLista: [],
          tipoTelefoneLista: [],
          estadoLista: [],
          emailLista: [],
        });

        setEnderecoLista(data.enderecoLista);
        setTelefoneLista(data.telefoneLista);
        setEmailLista(data.emailLista);
        setRedeSocialLista(data.redeSocialLista);

        tipoEnderecoLista.current = data.tipoEnderecoLista;
        tipoTelefoneLista.current = data.tipoTelefoneLista;
        tipoRedeSocialLista.current = data.tipoRedeSocialLista;
        estadoLista.current = data.estadoLista;

        formDefault.pessoaId = data.pessoaId;
        formEnderecoDefault.pessoaId = data.pessoaId;
        formTelefoneDefault.pessoaId = data.pessoaId;
        formEmailDefault.pessoaId = data.pessoaId;
        formRedeSocialDefault.pessoaId = data.pessoaId;
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
        group: 'edit',
        message: 'Confirma as alterações?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        defaultFocus: 'reject',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => aoConfirmarSalvar(),
      });
    } else {
      onClose(null);
    }
  };

  const aoConfirmarSalvar = () => {
    Loading.show();

    fetchService({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/parceiro/salvar`,
      method: `POST`,
      token: auth.token as string,
      body: JSON.stringify(form),
    }).then((data: IForm | null) => {
      if (data != null) {
        if (data.isErro) {
          setForm(data);
          Loading.hide();
        } else {
          onClose({
            id: data.id,
            cnpjCpf: data.cnpjCpf.value as string,
            tipoPessoa: data.tipoPessoa.value as Control.TipoPessoa,
            nome: data.nome.value as string,
            operacao: data.operacao.value as Control.Operacao,
            ativo: data.ativo.value as boolean,
            logo: data.logoMimeType.value as string,
            logoMimeType: data.logoMimeType.value as string,
          });
        }
      }
    });
  };

  const onUpload = (fileName: string, type: string, result: string | null) => {
    setForm({
      ...form,
      logo: {
        ...form.logo,
        value: result,
      },
      logoMimeType: {
        ...form.logoMimeType,
        value: type,
      },
    });
  };

  const onClear = () => {
    setForm({
      ...form,
      logo: {
        ...form.logo,
        value: null,
      },
      logoMimeType: {
        ...form.logoMimeType,
        value: null,
      },
    });
  };

  const onAdicionarEnderecoClick = () => {
    Loading.show();
    setSelectedEnderecoRow(formEnderecoDefault);
    setSelectedEnderecoRows([]);
    setEnderecoDialog(true);
  };

  const onEditarEnderecoClick = (data: IEnderecoForm) => {
    Loading.show();
    setSelectedEnderecoRow(data);
    setSelectedEnderecoRows([]);
    setEnderecoDialog(true);
  };

  const onEditarEnderecoClose = (endereco: IEnderecoForm | null) => {
    if (endereco !== null) {
      const lista: IEnderecoForm[] = [...enderecoLista];
      const index: number = lista.findIndex((x) => x.id === endereco.id);

      if (index < 0) lista.push(endereco);
      else lista[index] = endereco;

      setEnderecoLista(lista);
      toast.current?.show({
        severity: 'info',
        summary: 'Info',
        detail: `Operação realizada com sucesso!`,
      });
    }

    setSelectedEnderecoRow(null);
    setSelectedEnderecoRows([]);
    setEnderecoDialog(false);
    Loading.hide();
  };

  const onExcluirEnderecoClick = (data?: IEnderecoForm) => {
    if (data) {
      setSelectedEnderecoRows([data]);
    }

    confirmDialog({
      group: 'edit',
      message: 'Confirma a exclusão do(s) endereço(s) selecionado(s)?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'reject',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      onHide: () => setSelectedEnderecoRows([]),
      accept: () => aoConfirmarEnderecoExcluir(data),
    });
  };

  const aoConfirmarEnderecoExcluir = (data?: IEnderecoForm) => {
    Loading.show();

    const selecao = data
      ? [data.id]
      : selectedEnderecoRows.reduce<number[]>(
          (previous: number[], currentValue: IEnderecoForm) => {
            previous.push(currentValue.id);
            return previous;
          },
          [],
        );

    const body = JSON.stringify({
      schema: '0',
      idLista: selecao,
    });

    type ResponseData = {
      [key: number]: string;
    };

    fetchService({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/cadastro/pessoa/endereco/excluir`,
      method: `POST`,
      token: auth.token as string,
      responseType: 'text',
      body: body,
    })
      .then((data: ResponseData | null) => {
        if (data !== null && data !== undefined) {
          let lista: IEnderecoForm[] = [...enderecoLista];
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

          setSelectedEnderecoRow(null);
          setEnderecoLista(lista);

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

  const actionsRowEnderecoTemplate = (data: IEnderecoForm) => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-center">
        <Button
          type="button"
          icon="pi pi-pencil"
          tooltip="Editar"
          rounded
          outlined
          onClick={() => onEditarEnderecoClick(data)}
        />
        <Button
          type="button"
          icon="pi pi-trash"
          className="ml-2"
          rounded
          outlined
          severity="danger"
          onClick={() => onExcluirEnderecoClick(data)}
        />
      </div>
    );
  };

  const enderecoToolbarTemplate = () => {
    return (
      <>
        <Button
          type="button"
          label="Adiciona"
          icon="pi pi-plus"
          severity="success"
          className="mr-4"
          onClick={onAdicionarEnderecoClick}
        />
        <Button
          type="button"
          label="Excluir"
          icon="pi pi-trash"
          severity="danger"
          onClick={() => onExcluirEnderecoClick()}
          disabled={selectedEnderecoRows.length === 0}
        >
          {selectedEnderecoRows.length > 0 && (
            <Badge
              className="text-red-600"
              value={selectedEnderecoRows.length}
              severity="contrast"
            />
          )}
        </Button>
      </>
    );
  };

  const onAdicionarTelefoneClick = () => {
    Loading.show();
    setSelectedTelefoneRow(formTelefoneDefault);
    setSelectedTelefoneRows([]);
    setTelefoneDialog(true);
  };

  const onEditarTelefoneClick = (data: ITelefoneForm) => {
    Loading.show();
    setSelectedTelefoneRow(data);
    setSelectedTelefoneRows([]);
    setTelefoneDialog(true);
  };

  const onEditarTelefoneClose = (telefone: ITelefoneForm | null) => {
    if (telefone !== null) {
      const lista: ITelefoneForm[] = [...telefoneLista];
      const index: number = telefoneLista.findIndex(
        (x) => x.id === telefone.id,
      );

      if (index < 0) lista.push(telefone);
      else lista[index] = telefone;

      setTelefoneLista(lista);
      toast.current?.show({
        severity: 'info',
        summary: 'Info',
        detail: `Operação realizada com sucesso!`,
      });
    }

    setSelectedTelefoneRow(null);
    setSelectedTelefoneRows([]);
    setTelefoneDialog(false);
    Loading.hide();
  };

  const onExcluirTelefoneClick = (data?: ITelefoneForm) => {
    if (data) {
      setSelectedTelefoneRows([data]);
    }

    confirmDialog({
      group: 'edit',
      message: 'Confirma a exclusão do(s) telefone(s) selecionado(s)?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'reject',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      onHide: () => setSelectedTelefoneRows([]),
      accept: () => aoConfirmarTelefoneExcluir(data),
    });
  };

  const aoConfirmarTelefoneExcluir = (data?: ITelefoneForm) => {
    Loading.show();

    const selecao = data
      ? [data.id]
      : selectedTelefoneRows.reduce<number[]>(
          (previous: number[], currentValue: ITelefoneForm) => {
            previous.push(currentValue.id);
            return previous;
          },
          [],
        );

    const body = JSON.stringify({
      schema: '0',
      idLista: selecao,
    });

    type ResponseData = {
      [key: number]: string;
    };

    fetchService({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/cadastro/pessoa/telefone/excluir`,
      method: `POST`,
      token: auth.token as string,
      responseType: 'text',
      body: body,
    })
      .then((data: ResponseData | null) => {
        if (data !== null) {
          let lista: ITelefoneForm[] = [...telefoneLista];
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

          setSelectedTelefoneRow(null);
          setTelefoneLista(lista);

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

  const actionsRowTelefoneTemplate = (data: ITelefoneForm) => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-center">
        <Button
          type="button"
          icon="pi pi-pencil"
          tooltip="Editar"
          rounded
          outlined
          onClick={() => onEditarTelefoneClick(data)}
        />
        <Button
          type="button"
          icon="pi pi-trash"
          className="ml-2"
          rounded
          outlined
          severity="danger"
          onClick={() => onExcluirTelefoneClick(data)}
        />
      </div>
    );
  };

  const telefoneToolbarTemplate = () => {
    return (
      <>
        <Button
          type="button"
          label="Adiciona"
          icon="pi pi-plus"
          severity="success"
          className="mr-4"
          onClick={onAdicionarTelefoneClick}
        />
        <Button
          type="button"
          label="Excluir"
          icon="pi pi-trash"
          severity="danger"
          onClick={() => onExcluirTelefoneClick()}
          disabled={selectedTelefoneRows.length === 0}
        >
          {selectedTelefoneRows.length > 0 && (
            <Badge
              className="text-red-600"
              value={selectedTelefoneRows.length}
              severity="contrast"
            />
          )}
        </Button>
      </>
    );
  };

  const onAdicionarEmailClick = () => {
    Loading.show();
    setSelectedEmailRow(formEmailDefault);
    setSelectedEmailRows([]);
    setEmailDialog(true);
  };

  const onEditarEmailClick = (data: IEmailForm) => {
    Loading.show();
    setSelectedEmailRow(data);
    setSelectedEmailRows([]);
    setEmailDialog(true);
  };

  const onEditarEmailClose = (email: IEmailForm | null) => {
    if (email !== null) {
      const lista: IEmailForm[] = [...emailLista];
      const index: number = emailLista.findIndex((x) => x.id === email.id);

      if (index < 0) lista.push(email);
      else lista[index] = email;

      setEmailLista(lista);
      toast.current?.show({
        severity: 'info',
        summary: 'Info',
        detail: `Operação realizada com sucesso!`,
      });
    }

    setSelectedEmailRow(null);
    setSelectedEmailRows([]);
    setEmailDialog(false);
    Loading.hide();
  };

  const onExcluirEmailClick = (data?: IEmailForm) => {
    if (data) {
      setSelectedEmailRows([data]);
    }

    confirmDialog({
      group: 'edit',
      message: 'Confirma a exclusão do(s) email(s) selecionado(s)?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'reject',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      onHide: () => setSelectedEmailRows([]),
      accept: () => aoConfirmarEmailExcluir(data),
    });
  };

  const aoConfirmarEmailExcluir = (data?: IEmailForm) => {
    Loading.show();

    const selecao = data
      ? [data.id]
      : selectedEmailRows.reduce<number[]>(
          (previous: number[], currentValue: IEmailForm) => {
            previous.push(currentValue.id);
            return previous;
          },
          [],
        );

    const body = JSON.stringify({
      schema: '0',
      idLista: selecao,
    });

    type ResponseData = {
      [key: number]: string;
    };

    fetchService({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/cadastro/pessoa/email/excluir`,
      method: `POST`,
      token: auth.token as string,
      responseType: 'text',
      body: body,
    })
      .then((data: ResponseData | null) => {
        if (data !== null) {
          let lista: IEmailForm[] = [...emailLista];
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

          setSelectedEmailRow(null);
          setEmailLista(lista);

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

  const actionsRowEmailTemplate = (data: IEmailForm) => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-center">
        <Button
          type="button"
          icon="pi pi-pencil"
          tooltip="Editar"
          rounded
          outlined
          onClick={() => onEditarEmailClick(data)}
        />
        <Button
          type="button"
          icon="pi pi-trash"
          className="ml-2"
          rounded
          outlined
          severity="danger"
          onClick={() => onExcluirEmailClick(data)}
        />
      </div>
    );
  };

  const emailToolbarTemplate = () => {
    return (
      <>
        <Button
          type="button"
          label="Adiciona"
          icon="pi pi-plus"
          severity="success"
          className="mr-4"
          onClick={onAdicionarEmailClick}
        />
        <Button
          type="button"
          label="Excluir"
          icon="pi pi-trash"
          severity="danger"
          onClick={() => onExcluirEmailClick()}
          disabled={selectedEmailRows.length === 0}
        >
          {selectedEmailRows.length > 0 && (
            <Badge
              className="text-red-600"
              value={selectedEmailRows.length}
              severity="contrast"
            />
          )}
        </Button>
      </>
    );
  };

  const onAdicionarRedeSocialClick = () => {
    Loading.show();
    setSelectedRedeSocialRow(formRedeSocialDefault);
    setSelectedRedeSocialRows([]);
    setRedeSocialDialog(true);
  };

  const onEditarRedeSocialClick = (data: IRedeSocialForm) => {
    Loading.show();
    setSelectedRedeSocialRow(data);
    setSelectedRedeSocialRows([]);
    setRedeSocialDialog(true);
  };

  const onEditarRedeSocialClose = (redeSocial: IRedeSocialForm | null) => {
    if (redeSocial !== null) {
      const lista: IRedeSocialForm[] = [...redeSocialLista];
      const index: number = redeSocialLista.findIndex(
        (x) => x.id === redeSocial.id,
      );

      if (index < 0) lista.push(redeSocial);
      else lista[index] = redeSocial;

      setRedeSocialLista(lista);
      toast.current?.show({
        severity: 'info',
        summary: 'Info',
        detail: `Operação realizada com sucesso!`,
      });
    }

    setSelectedRedeSocialRow(null);
    setSelectedRedeSocialRows([]);
    setRedeSocialDialog(false);
    Loading.hide();
  };

  const onExcluirRedeSocialClick = (data?: IRedeSocialForm) => {
    if (data) {
      setSelectedRedeSocialRows([data]);
    }

    confirmDialog({
      group: 'edit',
      message: 'Confirma a exclusão do(s) redeSocial(s) selecionado(s)?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'reject',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      onHide: () => setSelectedRedeSocialRows([]),
      accept: () => aoConfirmarRedeSocialExcluir(data),
    });
  };

  const aoConfirmarRedeSocialExcluir = (data?: IRedeSocialForm) => {
    Loading.show();

    const selecao = data
      ? [data.id]
      : selectedRedeSocialRows.reduce<number[]>(
          (previous: number[], currentValue: IRedeSocialForm) => {
            previous.push(currentValue.id);
            return previous;
          },
          [],
        );

    const body = JSON.stringify({
      schema: '0',
      idLista: selecao,
    });

    type ResponseData = {
      [key: number]: string;
    };

    fetchService({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/cadastro/pessoa/redesocial/excluir`,
      method: `POST`,
      token: auth.token as string,
      responseType: 'text',
      body: body,
    })
      .then((data: ResponseData | null) => {
        if (data !== null) {
          let lista: IRedeSocialForm[] = [...redeSocialLista];
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

          setSelectedRedeSocialRow(null);
          setRedeSocialLista(lista);

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

  const actionsRowRedeSocialTemplate = (data: IRedeSocialForm) => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-center">
        <Button
          type="button"
          icon="pi pi-pencil"
          tooltip="Editar"
          rounded
          outlined
          onClick={() => onEditarRedeSocialClick(data)}
        />
        <Button
          type="button"
          icon="pi pi-trash"
          className="ml-2"
          rounded
          outlined
          severity="danger"
          onClick={() => onExcluirRedeSocialClick(data)}
        />
      </div>
    );
  };

  const redeSocialToolbarTemplate = () => {
    return (
      <>
        <Button
          type="button"
          label="Adiciona"
          icon="pi pi-plus"
          severity="success"
          className="mr-4"
          onClick={onAdicionarRedeSocialClick}
        />
        <Button
          type="button"
          label="Excluir"
          icon="pi pi-trash"
          severity="danger"
          onClick={() => onExcluirRedeSocialClick()}
          disabled={selectedRedeSocialRows.length === 0}
        >
          {selectedRedeSocialRows.length > 0 && (
            <Badge
              className="text-red-600"
              value={selectedRedeSocialRows.length}
              severity="contrast"
            />
          )}
        </Button>
      </>
    );
  };

  addLocalePtBR();

  return (
    <>
      <div className="min-w-full">
        <form onSubmit={onSubmit}>
          <Toolbar
            className="border-none bg-white"
            start={
              <Button
                type="button"
                label="Retornar"
                icon="pi pi-step-backward"
                onClick={onRetornarClick}
              />
            }
            end={<Button type="submit" label="Salvar" icon="pi pi-save" />}
          />

          <hr />
          <Messages ref={msgs} />
          <div className="formgrid grid">
            <div className="col-3">
              <CnpjCpfUI
                ref={parceiroId && parceiroId > 0 ? null : objectFocusRef}
                tipoPessoa={form.tipoPessoa}
                cnpjCpf={form.cnpjCpf}
                onChange={(
                  tipoPessoa: ObjectForm<number>,
                  cnpjCpf: ObjectForm<string>,
                ) =>
                  setForm({ ...form, tipoPessoa: tipoPessoa, cnpjCpf: cnpjCpf })
                }
                disabled={parceiroId > 0}
                required
              />
            </div>

            <div className="field col-offset-1 col-6">
              <label htmlFor="nome" className="font-bold">
                Nome:
              </label>
              <InputText
                ref={parceiroId && parceiroId > 0 ? objectFocusRef : null}
                id="nome"
                type="text"
                value={form.nome.value as string}
                invalid={form.nome.isAlert}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({
                    ...form,
                    nome: { ...form.nome, value: e.target.value },
                  })
                }
                className="w-full text-base"
                required
              />
              {form.nome.isAlert && (
                <small className="text-red-500">
                  &nbsp;{form.nome.message}
                </small>
              )}
            </div>
          </div>

          <div className="formgrid grid">
            <div className="field col-4">
              <label htmlFor="operacao" className="font-bold">
                Tipo de Operação:
              </label>
              <Dropdown
                id="operacao"
                options={form.operacaoLista}
                value={form.operacao.value}
                invalid={form.operacao.isAlert}
                onChange={(e: DropdownChangeEvent) =>
                  setForm({
                    ...form,
                    operacao: { ...form.operacao, value: e.target.value },
                  })
                }
                optionValue="id"
                optionLabel="descricao"
                defaultValue={OperacaoEnum.Securitizadora.value}
                className="w-full text-base"
              />
              {form.operacao.isAlert && (
                <small className="text-red-500">
                  &nbsp;{form.operacao.message}
                </small>
              )}
            </div>

            <div className="field col-6">
              <label htmlFor="nomeFantasia" className="font-bold">
                Nome Fantasia:
              </label>
              <InputText
                id="nomeFantasia"
                type="text"
                value={form.empresa.nomeFantasia.value as string}
                invalid={form.empresa.nomeFantasia.isAlert}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({
                    ...form,
                    empresa: {
                      ...form.empresa,
                      nomeFantasia: {
                        ...form.empresa.nomeFantasia,
                        value: e.target.value,
                      },
                    },
                  })
                }
                className="w-full text-base"
                required
              />
              {form.empresa.nomeFantasia.isAlert && (
                <small className="text-red-500">
                  &nbsp;{form.empresa.nomeFantasia.message}
                </small>
              )}
            </div>
          </div>

          <div className="formgrid grid">
            <div className="field col-4">
              <label htmlFor="inscricaoEstadual" className="font-bold">
                Inscrição Estadual:
              </label>
              <InputText
                id="inscricaoEstadual"
                type="text"
                value={form.empresa.inscricaoEstadual.value ?? ''}
                invalid={form.empresa.inscricaoEstadual.isAlert}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({
                    ...form,
                    empresa: {
                      ...form.empresa,
                      inscricaoEstadual: {
                        ...form.empresa.inscricaoEstadual,
                        value: e.target.value,
                      },
                    },
                  })
                }
                className="w-full text-base"
              />
              {form.empresa.inscricaoEstadual.isAlert && (
                <small className="text-red-500">
                  &nbsp;{form.empresa.inscricaoEstadual.message}
                </small>
              )}
            </div>

            <div className="field col-4">
              <label htmlFor="inscricaoMunicipal" className="font-bold">
                Inscrição Municipal:
              </label>
              <InputText
                id="inscricaoMunicipal"
                type="text"
                value={form.empresa.inscricaoMunicipal.value ?? ''}
                invalid={form.empresa.inscricaoMunicipal.isAlert}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({
                    ...form,
                    empresa: {
                      ...form.empresa,
                      inscricaoMunicipal: {
                        ...form.empresa.inscricaoMunicipal,
                        value: e.target.value,
                      },
                    },
                  })
                }
                className="w-full text-base"
              />
              {form.empresa.inscricaoMunicipal.isAlert && (
                <small className="text-red-500">
                  &nbsp;{form.empresa.inscricaoMunicipal.message}
                </small>
              )}
            </div>
          </div>

          <div className="formgrid grid">
            <div className="field col-4">
              <label htmlFor="grupoEconomicoId" className="font-bold">
                Grupo Econômico:
              </label>
              <Dropdown
                id="grupoEconomicoId"
                options={form.empresa.grupoEconomicoLista}
                value={form.empresa.grupoEconomicoId.value}
                invalid={form.empresa.grupoEconomicoId.isAlert}
                onChange={(e: DropdownChangeEvent) =>
                  setForm({
                    ...form,
                    empresa: {
                      ...form.empresa,
                      grupoEconomicoId: {
                        ...form.empresa.grupoEconomicoId,
                        value: e.target.value,
                      },
                    },
                  })
                }
                optionValue="id"
                optionLabel="descricao"
                className="w-full text-base"
              />
              {form.empresa.grupoEconomicoId.isAlert && (
                <small className="text-red-500">
                  &nbsp;{form.empresa.grupoEconomicoId.message}
                </small>
              )}
            </div>

            <div className="field col-4">
              <label htmlFor="dataAbertura" className="font-bold">
                Data de Abertura:
              </label>
              <Calendar
                id="dataAbertura"
                value={form.empresa.dataAbertura.value}
                onChange={(e) =>
                  setForm({
                    ...form,
                    empresa: {
                      ...form.empresa,
                      dataAbertura: {
                        ...form.empresa.dataAbertura,
                        value: e.target.value,
                      },
                    },
                  })
                }
                locale="pt-BR"
                showIcon
                showButtonBar
              />
              {form.empresa.dataAbertura.isAlert && (
                <small className="text-red-500">
                  &nbsp;{form.empresa.dataAbertura.message}
                </small>
              )}
            </div>
          </div>

          {parceiroId > 0 && form.pessoaId > 0 && (
            <>
              <br />
              <Toolbar
                start={<span className="text-xl font-bold">Endereço(s)</span>}
                end={enderecoToolbarTemplate}
              />

              <DataTable
                value={enderecoLista}
                dataKey={(data: IEnderecoForm) => data.id.toString()}
                selectionMode="checkbox"
                selection={selectedEnderecoRows}
                onSelectionChange={(e) => setSelectedEnderecoRows(e.value)}
                emptyMessage="Nenhum endereço cadastrado."
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
                  header="Logradouro"
                  body={(data: IEnderecoForm) => data.logradouro.value}
                  headerClassName="bg-blue-100 h-2rem"
                />

                <Column
                  header="Número"
                  body={(data: IEnderecoForm) => data.numero.value}
                  headerClassName="bg-blue-100 h-2rem"
                />

                <Column
                  header="Bairro"
                  body={(data: IEnderecoForm) => data.bairro.value}
                  headerClassName="bg-blue-100 h-2rem"
                />

                <Column
                  header="Cidade/UF"
                  body={(data: IEnderecoForm) =>
                    data.cidade.value + '/' + data.uf.value
                  }
                  headerClassName="bg-blue-100 h-2rem"
                />

                <Column
                  alignHeader="center"
                  headerClassName="bg-blue-100 h-2rem"
                  header="Ativo"
                  align="center"
                  body={(data: IEnderecoForm) =>
                    formatBoolean(data.ativo.value as boolean)
                  }
                />

                <Column
                  alignHeader="center"
                  headerClassName="bg-blue-100 h-2rem"
                  align="center"
                  body={actionsRowEnderecoTemplate}
                  exportable={false}
                />
              </DataTable>

              <br />
              <Toolbar
                start={<span className="text-xl font-bold">Telefone(s)</span>}
                end={telefoneToolbarTemplate}
              />

              <DataTable
                value={telefoneLista}
                dataKey={(data: ITelefoneForm) => data.id.toString()}
                selectionMode="checkbox"
                selection={selectedTelefoneRows}
                onSelectionChange={(e) => setSelectedTelefoneRows(e.value)}
                emptyMessage="Nenhum telefone cadastrado."
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
                  header="DDI"
                  body={(data: ITelefoneForm) => data.ddi.value}
                  headerClassName="bg-blue-100 h-2rem"
                />

                <Column
                  header="DDD"
                  body={(data: ITelefoneForm) => data.ddd.value}
                  headerClassName="bg-blue-100 h-2rem"
                />

                <Column
                  header="Número"
                  body={(data: ITelefoneForm) => data.numero.value}
                  headerClassName="bg-blue-100 h-2rem"
                />

                <Column
                  header="Contato"
                  body={(data: ITelefoneForm) => data.contato.value}
                  headerClassName="bg-blue-100 h-2rem"
                />

                <Column
                  alignHeader="center"
                  headerClassName="bg-blue-100 h-2rem"
                  header="Whatsapp"
                  align="center"
                  body={(data: ITelefoneForm) =>
                    formatBoolean(data.whatsapp.value as boolean)
                  }
                />

                <Column
                  alignHeader="center"
                  headerClassName="bg-blue-100 h-2rem"
                  header="Telegram"
                  align="center"
                  body={(data: ITelefoneForm) =>
                    formatBoolean(data.telegram.value as boolean)
                  }
                />

                <Column
                  alignHeader="center"
                  headerClassName="bg-blue-100 h-2rem"
                  header="Ativo"
                  align="center"
                  body={(data: ITelefoneForm) =>
                    formatBoolean(data.ativo.value as boolean)
                  }
                />

                <Column
                  alignHeader="center"
                  headerClassName="bg-blue-100 h-2rem"
                  align="center"
                  body={actionsRowTelefoneTemplate}
                  exportable={false}
                />
              </DataTable>

              <br />
              <Toolbar
                start={<span className="text-xl font-bold">E-mail(s)</span>}
                end={emailToolbarTemplate}
              />

              <DataTable
                value={emailLista}
                dataKey={(data: IEmailForm) => data.id.toString()}
                selectionMode="checkbox"
                selection={selectedEmailRows}
                onSelectionChange={(e) => setSelectedEmailRows(e.value)}
                emptyMessage="Nenhum e-mail cadastrado."
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
                  header="E-mail"
                  body={(data: IEmailForm) => data.endereco.value}
                  headerClassName="bg-blue-100 h-2rem"
                />

                <Column
                  alignHeader="center"
                  headerClassName="bg-blue-100 h-2rem"
                  header="Ativo"
                  align="center"
                  body={(data: IEmailForm) =>
                    formatBoolean(data.ativo.value as boolean)
                  }
                />

                <Column
                  alignHeader="center"
                  headerClassName="bg-blue-100 h-2rem"
                  align="center"
                  body={actionsRowEmailTemplate}
                  exportable={false}
                />
              </DataTable>

              <br />
              <Toolbar
                start={
                  <span className="text-xl font-bold">Rede(s) Social(s)</span>
                }
                end={redeSocialToolbarTemplate}
              />

              <DataTable
                value={redeSocialLista}
                dataKey={(data: IRedeSocialForm) => data.id.toString()}
                selectionMode="checkbox"
                selection={selectedRedeSocialRows}
                onSelectionChange={(e) => setSelectedRedeSocialRows(e.value)}
                emptyMessage="Nenhuma rede social cadastrada."
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
                  header="Identificador"
                  body={(data: IRedeSocialForm) => data.identificador.value}
                  headerClassName="bg-blue-100 h-2rem"
                />

                <Column
                  alignHeader="center"
                  headerClassName="bg-blue-100 h-2rem"
                  header="Ativo"
                  align="center"
                  body={(data: IRedeSocialForm) =>
                    formatBoolean(data.ativo.value as boolean)
                  }
                />

                <Column
                  alignHeader="center"
                  headerClassName="bg-blue-100 h-2rem"
                  align="center"
                  body={actionsRowRedeSocialTemplate}
                  exportable={false}
                />
              </DataTable>
            </>
          )}

          <br />
          <div className="formgrid grid">
            <div className="field col-12">
              <label htmlFor="logo" className="font-bold">
                Logotipo:
              </label>
              <FileUploadUI
                id="logo"
                file={form.logo.value as string}
                mimeType={form.logoMimeType.value as string}
                multiple={false}
                onUpload={onUpload}
                onClear={onClear}
              />
              {form.logo.isAlert && (
                <small className="text-red-500">
                  &nbsp;{form.logo.message}
                </small>
              )}
              {form.logoMimeType.isAlert && (
                <small className="text-red-500">
                  &nbsp;{form.logoMimeType.message}
                </small>
              )}
            </div>
          </div>

          <div className="formgrid grid">
            <div className="field col-3">
              <label htmlFor="ativo" className="font-bold">
                Ativo:
              </label>
              <br />
              <InputSwitch
                id="ativo"
                className="mt-2"
                checked={form.ativo.value as boolean}
                onChange={(e: InputSwitchChangeEvent) =>
                  setForm({
                    ...form,
                    ativo: { ...form.ativo, value: e.target.value },
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
      </div>

      <Dialog
        visible={enderecoDialog}
        header="Endereço"
        className="p-fluid"
        style={{ width: '65%', height: '70%' }}
        modal
        showCloseIcon={false}
        closable={false}
        onHide={() => setEnderecoDialog(false)}
      >
        {selectedEnderecoRow !== null && selectedEnderecoRow?.id === 0 && (
          <Endereco
            id={0}
            pessoaid={form.pessoaId}
            enderecoLista={enderecoLista}
            tipoEnderecoLista={tipoEnderecoLista.current}
            estadoLista={estadoLista.current}
            onClose={onEditarEnderecoClose}
          />
        )}
        {selectedEnderecoRow !== null && selectedEnderecoRow?.id !== 0 && (
          <Endereco
            id={selectedEnderecoRow?.id}
            enderecoLista={enderecoLista}
            tipoEnderecoLista={tipoEnderecoLista.current}
            estadoLista={estadoLista.current}
            onClose={onEditarEnderecoClose}
          />
        )}
      </Dialog>

      <Dialog
        visible={telefoneDialog}
        header="Telefone"
        className="p-fluid"
        style={{ width: '50%', height: '60%' }}
        modal
        showCloseIcon={false}
        closable={false}
        onHide={() => setTelefoneDialog(false)}
      >
        {selectedTelefoneRow !== null && selectedTelefoneRow?.id === 0 && (
          <Telefone
            id={0}
            pessoaid={form.pessoaId}
            telefoneLista={telefoneLista}
            tipoTelefoneLista={tipoTelefoneLista.current}
            onClose={onEditarTelefoneClose}
          />
        )}
        {selectedTelefoneRow !== null && selectedTelefoneRow?.id !== 0 && (
          <Telefone
            id={selectedTelefoneRow?.id}
            telefoneLista={telefoneLista}
            tipoTelefoneLista={tipoTelefoneLista.current}
            onClose={onEditarTelefoneClose}
          />
        )}
      </Dialog>

      <Dialog
        visible={emailDialog}
        header="E-mail"
        className="p-fluid"
        style={{ width: '50%', height: '50%' }}
        modal
        showCloseIcon={false}
        closable={false}
        onHide={() => setEmailDialog(false)}
      >
        {selectedEmailRow !== null && selectedEmailRow?.id === 0 && (
          <Email
            id={0}
            pessoaid={form.pessoaId}
            emailLista={emailLista}
            onClose={onEditarEmailClose}
          />
        )}
        {selectedEmailRow !== null && selectedEmailRow?.id !== 0 && (
          <Email
            id={selectedEmailRow?.id}
            emailLista={emailLista}
            onClose={onEditarEmailClose}
          />
        )}
      </Dialog>

      <Dialog
        visible={redeSocialDialog}
        header="Rede Social"
        className="p-fluid"
        style={{ width: '50%', height: '65%' }}
        modal
        showCloseIcon={false}
        closable={false}
        onHide={() => setRedeSocialDialog(false)}
      >
        {selectedRedeSocialRow !== null && selectedRedeSocialRow?.id === 0 && (
          <RedeSocial
            id={0}
            pessoaid={form.pessoaId}
            redeSocialLista={redeSocialLista}
            tipoRedeSocialLista={tipoRedeSocialLista.current}
            onClose={onEditarRedeSocialClose}
          />
        )}
        {selectedRedeSocialRow !== null && selectedRedeSocialRow?.id !== 0 && (
          <RedeSocial
            id={selectedRedeSocialRow?.id}
            redeSocialLista={redeSocialLista}
            tipoRedeSocialLista={tipoRedeSocialLista.current}
            onClose={onEditarRedeSocialClose}
          />
        )}
      </Dialog>

      <ConfirmDialog group="edit" />
      <Toast ref={toast} />
      <ScrollTop target="parent" threshold={100} />
    </>
  );
};

export default ParceiroEdit;
