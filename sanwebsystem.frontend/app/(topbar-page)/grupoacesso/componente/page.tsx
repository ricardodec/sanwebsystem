'use client';

import React, { useEffect, useState, useRef, useContext } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { PickList, PickListChangeEvent } from 'primereact/picklist';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ScrollTop } from 'primereact/scrolltop';
import { MenuItem } from 'primereact/menuitem';
import { Steps } from 'primereact/steps';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import fetchService from '@actions/fetch';
import Loading from '@ui/loading';
import { ObjectForm } from '@types';
import { AuthContext } from '@context/auth';

const GrupoAcessoComponente = (props: {
    grupoAcessoId: number;
    onClose: () => void;
}) => {
    const COMPONENTE = 0;
    const ACAO = 1;

    interface IAcaoAcessoForm {
        isErro: boolean;
        acaoComponente: Control.IAcaoComponente;
        ativo: ObjectForm<boolean>;
    }

    interface IComponenteAcessoForm {
        isErro: boolean;
        componente: Control.IComponente;
        acaoAcessoLista: IAcaoAcessoForm[];
    }

    interface IForm {
        isErro: boolean;
        grupoAcessoId: number;
        componenteAcessoLista: IComponenteAcessoForm[];
    }

    const formDefault: IForm = {
        isErro: false,
        grupoAcessoId: 0,
        componenteAcessoLista: [],
    };

    const { auth } = useContext(AuthContext);
    const toast = useRef<Toast>(null);
    const objectFocusRef = useRef(null);

    const [source, setSource] = useState<Control.IComponente[]>([]);
    const [target, setTarget] = useState<Control.IComponente[]>([]);

    const [form, setForm] = useState<IForm>(formDefault);
    const formPrev = useRef<IForm>(formDefault);

    const formAlterado = () =>
        JSON.stringify(form) !== JSON.stringify(formPrev.current);

    const toComponenteSorted = (
        lista: Control.IComponente[],
    ): Control.IComponente[] => {
        return lista.sort((a: Control.IComponente, b: Control.IComponente) => {
            const nomeA = a.nome.toUpperCase();
            const nomeB = b.nome.toUpperCase();

            if (nomeA < nomeB) {
                return -1;
            }
            if (nomeA > nomeB) {
                return 1;
            }
            return 0;
        });
    };

    const filterSourceData = (
        data: Control.IComponente[],
        dataTarget: Control.IComponente[],
    ) => {
        return data.filter(
            (sel) => dataTarget?.findIndex((x) => x.id === sel.id) === -1,
        );
    };

    const processSourceData = (dataTarget: Control.IComponente[]) => {
        const parceiro = auth.parceiro;

        fetchService({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/componente/modulo/parceiro/lista`,
            method: `POST`,
            body: parceiro ? parceiro.id.toString() : `0`,
            token: auth?.token as string,
        }).then((data: Control.IComponente[] | null) => {
            setSource(
                toComponenteSorted(filterSourceData(data ?? [], dataTarget)),
            );
        });
    };

    useEffect(() => {
        Loading.show();

        fetchService({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/grupoacesso/acao/editar`,
            method: `POST`,
            body: props.grupoAcessoId.toString(),
            token: auth?.token as string,
        })
            .then((data: IForm | null) => {
                if (data === null) return [];

                formPrev.current = { ...data };
                setForm(data);
                setTarget(
                    toComponenteSorted(
                        data.componenteAcessoLista.map((ca) => ca.componente),
                    ),
                );

                return target;
            })
            .then((dataTarget) => {
                processSourceData(dataTarget);
            })
            .finally(() => {
                Loading.hide();
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (
            objectFocusRef.current !== null &&
            (objectFocusRef.current as HTMLElement).focus
        ) {
            (objectFocusRef.current as HTMLElement).focus();
        }
    }, [form.componenteAcessoLista]);

    const onRetornarClick = () => {
        if (formAlterado()) {
            confirmDialog({
                group: 'acaocomponente',
                message: 'Deseja ignorar as alterações?',
                header: 'Confirmar',
                icon: 'pi pi-exclamation-triangle',
                defaultFocus: 'reject',
                acceptLabel: 'Sim',
                rejectLabel: 'Não',
                accept: () => props.onClose(),
            });
        } else {
            props.onClose();
        }
    };

    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (formAlterado()) {
            confirmDialog({
                group: 'acaocomponente',
                message: 'Confirma as alterações?',
                header: 'Confirmar',
                icon: 'pi pi-exclamation-triangle',
                defaultFocus: 'reject',
                acceptLabel: 'Sim',
                rejectLabel: 'Não',
                accept: () => aoConfirmaSalvar(),
            });
        } else {
            props.onClose();
        }
    };

    const aoConfirmaSalvar = () => {
        Loading.show();

        fetchService({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/grupoacesso/acao/salvar`,
            method: `POST`,
            body: JSON.stringify(form),
            token: auth?.token as string,
        })
            .then((data: IForm | null) => {
                if (data === null) return;

                setForm(data);

                if (!data.isErro) {
                    formPrev.current = { ...data };
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Info',
                        detail: `Operação realizada com sucesso!`,
                    });
                }
            })
            .finally(() => Loading.hide());
    };

    const itemTemplate = (componente: Control.IComponente) => {
        return (
            <div className="flex flex-column align-items-center gap-1">
                <span className="text-xs">{componente.nome}</span>
                <Tag
                    value={componente.ativo ? 'Ativo' : 'Inativo'}
                    severity={componente.ativo ? 'success' : 'warning'}
                ></Tag>
            </div>
        );
    };

    const onChange = (event: PickListChangeEvent) => {
        setSource(toComponenteSorted(event.source as Control.IComponente[]));
        setTarget(toComponenteSorted(event.target as Control.IComponente[]));
    };

    const [activeIndex, setActiveIndex] = useState<number>(COMPONENTE);

    const stepItems: MenuItem[] = [
        { label: 'Selecionar componente(s)' },
        { label: 'Selecionar a(s) ação(s)' },
    ];

    const toolbarStart = () => {
        return (
            <>
                {activeIndex === COMPONENTE && (
                    <Button
                        type="button"
                        label="Retornar"
                        icon="pi pi-step-backward"
                        onClick={onRetornarClick}
                    />
                )}
                {activeIndex === ACAO && (
                    <Button
                        type="button"
                        label={stepItems[ACAO].label}
                        icon="pi pi-backward"
                        outlined
                        onClick={() => onChangeStep(activeIndex - 1)}
                    />
                )}
            </>
        );
    };

    const toolbarEnd = () => {
        return (
            <>
                {activeIndex === COMPONENTE && (
                    <Button
                        type="button"
                        label={stepItems[ACAO].label}
                        icon="pi pi-forward"
                        iconPos="right"
                        outlined
                        onClick={() => onChangeStep(activeIndex + 1)}
                    />
                )}
                {activeIndex === ACAO && (
                    <Button type="submit" label="Salvar" icon="pi pi-save" />
                )}
            </>
        );
    };

    const montaDadosAcao = () => {
        const componenteAcessoLista = form.componenteAcessoLista.filter(
            (ca) => target?.findIndex((t) => t.id === ca.componente.id) >= 0,
        );

        for (const componente of target) {
            const index = form.componenteAcessoLista
                .map((ca) => ca.componente)
                .findIndex((ca) => ca.id === componente.id);
            const indexPrev = formPrev.current.componenteAcessoLista
                .map((ca) => ca.componente)
                .findIndex((ca) => ca.id === componente.id);

            if (index < 0 && indexPrev < 0) {
                const acaoLista =
                    componente.acoes?.map(
                        (acaoComponente) =>
                            ({
                                isErro: false,
                                acaoComponente: acaoComponente,
                                ativo: {
                                    value:
                                        componente.ativo &&
                                        acaoComponente.ativo,
                                    message: '',
                                },
                            }) as IAcaoAcessoForm,
                    ) ?? [];

                componenteAcessoLista.push({
                    isErro: false,
                    componente: componente,
                    acaoAcessoLista: acaoLista,
                });
            } else if (index < 0 && indexPrev >= 0) {
                componenteAcessoLista.push({
                    ...formPrev.current.componenteAcessoLista[indexPrev],
                });
            } else if (
                index >= 0 &&
                componenteAcessoLista[index] !== undefined
            ) {
                for (const acaoAcesso of componenteAcessoLista[index]
                    .acaoAcessoLista) {
                    acaoAcesso.ativo = {
                        ...acaoAcesso.ativo,
                        value:
                            indexPrev >= 0 &&
                            acaoAcesso.ativo.value &&
                            componente.ativo &&
                            acaoAcesso.acaoComponente.ativo,
                    };
                }
            }
        }

        setForm({
            ...form,
            componenteAcessoLista: toComponenteAcessoSorted(
                componenteAcessoLista,
            ),
        });
    };

    const toComponenteAcessoSorted = (
        lista: IComponenteAcessoForm[],
    ): IComponenteAcessoForm[] => {
        return lista.sort(
            (a: IComponenteAcessoForm, b: IComponenteAcessoForm) => {
                const nomeA = a.componente.nome.toUpperCase();
                const nomeB = b.componente.nome.toUpperCase();

                if (nomeA < nomeB) {
                    return -1;
                }
                if (nomeA > nomeB) {
                    return 1;
                }
                return 0;
            },
        );
    };

    const onChangeStep = (step: number) => {
        if (step === ACAO) {
            montaDadosAcao();
        }

        setActiveIndex(step);
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

                    <Steps
                        model={stepItems}
                        activeIndex={activeIndex}
                        readOnly={true}
                    />

                    <br />
                    <div className="card">
                        {activeIndex === COMPONENTE && (
                            <PickList
                                dataKey="id"
                                source={source}
                                target={target}
                                onChange={onChange}
                                itemTemplate={itemTemplate}
                                showSourceControls={false}
                                showTargetControls={false}
                                filter
                                filterBy="nome"
                                sourceHeader="Disponível"
                                targetHeader="Selecionado"
                                sourceStyle={{ height: '70rem' }}
                                targetStyle={{ height: '70rem' }}
                                sourceFilterPlaceholder="Busque por nome"
                                targetFilterPlaceholder="Busque por nome"
                            />
                        )}

                        {activeIndex === ACAO && (
                            <>
                                {form.componenteAcessoLista.map((sel) => {
                                    const setChange = () => {
                                        const lista =
                                            form.componenteAcessoLista.filter(
                                                (ca) =>
                                                    ca.componente.id !==
                                                    sel.componente.id,
                                            ) ?? [];

                                        setForm({
                                            ...form,
                                            componenteAcessoLista:
                                                toComponenteAcessoSorted([
                                                    ...lista,
                                                    sel,
                                                ]),
                                        });
                                    };

                                    const setSelChange = (
                                        e: CheckboxChangeEvent,
                                        acaoId: number,
                                        acaoAcesso: IAcaoAcessoForm | undefined,
                                    ) => {
                                        if (
                                            acaoAcesso &&
                                            e.target.checked === false
                                        ) {
                                            sel.acaoAcessoLista =
                                                sel.acaoAcessoLista.filter(
                                                    (aa) =>
                                                        aa.acaoComponente.acao
                                                            .id !== acaoId,
                                                );
                                        } else if (
                                            !acaoAcesso &&
                                            e.target.checked === true
                                        ) {
                                            const acaoComponente =
                                                sel.componente.acoes?.find(
                                                    (ca) =>
                                                        ca.acao.id === acaoId,
                                                );

                                            if (acaoComponente) {
                                                sel.acaoAcessoLista = [
                                                    ...sel.acaoAcessoLista,
                                                    {
                                                        isErro: false,
                                                        acaoComponente:
                                                            acaoComponente,
                                                        ativo: {
                                                            value: sel
                                                                .componente
                                                                .ativo,
                                                            message: '',
                                                        },
                                                    } as IAcaoAcessoForm,
                                                ];
                                            }
                                        }

                                        setChange();
                                    };

                                    return (
                                        <React.Fragment key={sel.componente.id}>
                                            <div className="formgrid grid">
                                                <div className="field col-12">
                                                    <span className="font-bold">
                                                        {sel.componente.nome}
                                                    </span>
                                                    <Tag
                                                        className="ml-6"
                                                        value={
                                                            sel.componente.ativo
                                                                ? 'Ativo'
                                                                : 'Inativo'
                                                        }
                                                        severity={
                                                            sel.componente.ativo
                                                                ? 'success'
                                                                : 'warning'
                                                        }
                                                    ></Tag>
                                                </div>

                                                {sel.componente.acoes?.map(
                                                    (selAcao) => {
                                                        const acaoAcesso =
                                                            sel.acaoAcessoLista.find(
                                                                (aa) =>
                                                                    aa
                                                                        .acaoComponente
                                                                        .acao
                                                                        .id ===
                                                                    selAcao.acao
                                                                        .id,
                                                            );

                                                        return (
                                                            <React.Fragment
                                                                key={
                                                                    sel.componente.id.toString() +
                                                                    selAcao.acao.id.toString()
                                                                }
                                                            >
                                                                <hr />
                                                                <div className="field col-offset-1 col-2 mt-3">
                                                                    <div className="flex align-items-center">
                                                                        <Checkbox
                                                                            inputId={
                                                                                'sel_' +
                                                                                sel.componente.id.toString() +
                                                                                '_' +
                                                                                selAcao.acao.id.toString()
                                                                            }
                                                                            name={
                                                                                'sel_' +
                                                                                sel.componente.id.toString() +
                                                                                '_' +
                                                                                selAcao.acao.id.toString()
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setSelChange(
                                                                                    e,
                                                                                    selAcao
                                                                                        .acao
                                                                                        .id,
                                                                                    acaoAcesso,
                                                                                )
                                                                            }
                                                                            checked={
                                                                                acaoAcesso !==
                                                                                undefined
                                                                            }
                                                                            className="mt-2"
                                                                        />
                                                                        <label
                                                                            htmlFor={
                                                                                'sel_' +
                                                                                sel.componente.id.toString() +
                                                                                '_' +
                                                                                selAcao.acao.id.toString()
                                                                            }
                                                                            className="font-bold mt-2 ml-2"
                                                                        >
                                                                            {
                                                                                selAcao
                                                                                    .acao
                                                                                    .nome
                                                                            }
                                                                        </label>
                                                                    </div>
                                                                </div>

                                                                <div className="field col-2 mt-3">
                                                                    <div className="flex align-items-center">
                                                                        <InputSwitch
                                                                            id={
                                                                                'ativo_' +
                                                                                sel.componente.id.toString() +
                                                                                '_' +
                                                                                selAcao.acao.id.toString()
                                                                            }
                                                                            name={
                                                                                'ativo_' +
                                                                                sel.componente.id.toString() +
                                                                                '_' +
                                                                                selAcao.acao.id.toString()
                                                                            }
                                                                            className="mt-2"
                                                                            checked={
                                                                                selAcao.ativo &&
                                                                                sel
                                                                                    .componente
                                                                                    .ativo &&
                                                                                (acaoAcesso
                                                                                    ? (acaoAcesso
                                                                                          .ativo
                                                                                          .value as boolean)
                                                                                    : false)
                                                                            }
                                                                            onChange={(
                                                                                event: InputSwitchChangeEvent,
                                                                            ) => {
                                                                                if (
                                                                                    acaoAcesso
                                                                                ) {
                                                                                    acaoAcesso.ativo.value =
                                                                                        event.target.value;
                                                                                    setChange();
                                                                                }
                                                                            }}
                                                                            disabled={
                                                                                !acaoAcesso
                                                                            }
                                                                        />
                                                                        <label
                                                                            htmlFor={
                                                                                'ativo_' +
                                                                                sel.componente.id.toString() +
                                                                                '_' +
                                                                                selAcao.acao.id.toString()
                                                                            }
                                                                            className="mt-2 ml-2"
                                                                        >
                                                                            Ativo
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </React.Fragment>
                                                        );
                                                    },
                                                )}
                                            </div>
                                            <hr />
                                        </React.Fragment>
                                    );
                                })}
                            </>
                        )}
                    </div>
                </form>
            </div>

            <Toast ref={toast} />
            <ConfirmDialog group="acaocomponente" />
            <ScrollTop target="parent" threshold={100} />
        </>
    );
};

export default GrupoAcessoComponente;
