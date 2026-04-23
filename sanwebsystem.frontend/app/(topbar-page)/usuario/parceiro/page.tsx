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
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import fetchService from '@actions/fetch';
import Loading from '@ui/loading';
import { ObjectForm, ObjectOption } from '@types';
import { PerfilEnum } from '@enums';
import { AuthContext } from '@context/auth';

interface ParceiroAcessoProps {
    usuarioId: number;
    onClose: () => void;
};

const ParceiroAcesso = ({ usuarioId, onClose }: ParceiroAcessoProps) => {

    const PARCEIRO = 0;
    const PERFIL = 1;

    interface IParceiroAcesso {
        isErro: boolean;
        usuarioId: number;
        parceiroLista: IAcesso[];
    };

    const parceiroAcessoDefault: IParceiroAcesso = {
        isErro: false,
        usuarioId: 0,
        parceiroLista: []
    };

    interface IAcesso {
        isErro: boolean;
        parceiro: Control.IParceiro;
        perfil: ObjectForm<number>;
        grupoAcessoId: ObjectForm<number | null>;
        ehResponsavel: ObjectForm<boolean>;
        ativo: ObjectForm<boolean>;
        grupoAcessoLista: ObjectOption<number>[];
    }

    const { auth } = useContext(AuthContext);
    const toast = useRef<Toast>(null);
    const objectFocusRef = useRef(null);

    const [source, setSource] = useState<Control.IParceiro[]>([]);
    const [target, setTarget] = useState<Control.IParceiro[]>([]);
    const [form, setForm] = useState<IParceiroAcesso>(parceiroAcessoDefault);

    const formPrev = useRef<IParceiroAcesso>(parceiroAcessoDefault);

    const formAlterado = () => JSON.stringify(form) !== JSON.stringify(formPrev.current);

    const filterSourceData = (data: Control.IParceiro[], dataTarget: Control.IParceiro[]) => {
        return data.filter(s => dataTarget?.findIndex(t => t.id === s.id) === -1);
    };

    const processSourceData = (dataTarget: Control.IParceiro[]) => {
        fetchService({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/parceiro/acesso`, method: `GET`, token: auth.token as string })
            .then((data: Control.IParceiro[] | null) => {
                setSource(filterSourceData(data ?? [], dataTarget));
            });
    };

    useEffect(() => {
        Loading.show();

        fetchService({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/parceiro/acesso/editar`, method: `POST`, body: usuarioId.toString(), token: auth.token as string })
            .then((data: IParceiroAcesso | null) => {
                if (data === null)
                    return [];

                formPrev.current = { ...data };
                setForm(data);
                setTarget(data.parceiroLista.map(p => p.parceiro));
                
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
        if (objectFocusRef.current !== null) {
            (objectFocusRef.current as HTMLElement).focus();
        }
    }, [form.parceiroLista]);

    const onRetornarClick = () => {
        if (formAlterado()) {
            confirmDialog({
                group: 'parceiro',
                message: 'Deseja ignorar as alterações?',
                header: 'Confirmar',
                icon: 'pi pi-exclamation-triangle',
                defaultFocus: 'reject',
                acceptLabel: 'Sim',
                rejectLabel: 'Não',
                accept: () => onClose()
            });
        } else {
            onClose();
        }
    };

    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (formAlterado()) {
            confirmDialog({
                group: 'parceiro',
                message: 'Confirma as alterações?',
                header: 'Confirmar',
                icon: 'pi pi-exclamation-triangle',
                defaultFocus: 'reject',
                acceptLabel: 'Sim',
                rejectLabel: 'Não',
                accept: () => aoConfirmaSalvar()
            });
        } else {
            onClose();
        }
    };

    const aoConfirmaSalvar = () => {
        Loading.show();

        fetchService({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/parceiro/acesso/salvar`, method: `POST`, body: JSON.stringify(form), token: auth.token as string })
            .then((data: IParceiroAcesso | null) => {
                if (data === null)
                    return;

                setForm(data);

                if (!data.isErro) {
                    formPrev.current = { ...data };
                    toast.current?.show({ severity: 'info', summary: 'Info', detail: `Operação realizada com sucesso!`});
                }
            })
            .finally(() => Loading.hide());
    };

    const [activeIndex, setActiveIndex] = useState<number>(PARCEIRO);

    const stepItems: MenuItem[] = [
        { label: 'Selecionar parceiro(s)' },
        { label: 'Definir perfil de acesso' }
    ];

    const toolbarStart = () => {
        return (
            <>
                {activeIndex === PARCEIRO && <Button type="button" label="Retornar" icon="pi pi-step-backward" onClick={onRetornarClick} />}
                {activeIndex === PERFIL && <Button type="button" label={stepItems[PARCEIRO].label} icon="pi pi-backward" outlined onClick={() => onChangeStep(activeIndex - 1)} />}
            </>
        )
    };

    const toolbarEnd = () => {
        return (
            <>
                {activeIndex === PARCEIRO && <Button type="button" label={stepItems[PERFIL].label} icon="pi pi-forward" iconPos="right" outlined onClick={() => onChangeStep(activeIndex + 1)} />}
                {activeIndex === PERFIL && <Button type="submit" label="Salvar" icon="pi pi-save" />}
            </>
        );
    };

    const itemTemplate = (parceiro: Control.IParceiro) => {
        return (
            <div className="flex flex-column align-items-center gap-1">
                <span className="text-xs">{parceiro.nome}</span>
                <Tag value={parceiro.ativo ? "Ativo" : "Inativo"} severity={parceiro.ativo ? "success" : "warning"}></Tag>
            </div>
        );
    };

    const toSorted = (lista: Control.IParceiro[]) => {
        return lista.sort((a: Control.IParceiro, b: Control.IParceiro) => {
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

    const onChange = (event: PickListChangeEvent) => {
        setSource(toSorted(event.source));
        setTarget(toSorted(event.target));
    };

    const montaDadosPerfil = () => {
        const parceiroLista = [ ...form.parceiroLista ];
        
        for (const parceiro of target) {
            const index = form.parceiroLista.findIndex(p => p.parceiro.id === parceiro.id);
            const indexPrev = formPrev.current.parceiroLista.findIndex(p => p.parceiro.id === parceiro.id);

            if (index < 0 && indexPrev < 0) {   
                const grupoAcessoLista: ObjectOption<number>[] = [
                    { id: 0, nome: "Selecione", descricao: "Selecione"}
                ];

                if (parceiro.grupoAcessoLista) {
                    for (const grupoAcesso of parceiro.grupoAcessoLista) {
                        if (grupoAcesso.ativo) {
                            grupoAcessoLista.push({ id: grupoAcesso.id, nome: grupoAcesso.nome, descricao: grupoAcesso.nome});
                        }
                    }
                }

                parceiroLista.push({
                    isErro: false,
                    parceiro: { ...parceiro },
                    perfil: { isAlert: false, value: PerfilEnum.Administrativo.value, message: '' },
                    grupoAcessoId: { isAlert: false, value: null, message: '' },
                    ehResponsavel: { isAlert: false, value: false, message: '' },
                    ativo: { isAlert: false, value: parceiro.ativo, message: '' },
                    grupoAcessoLista: grupoAcessoLista
                });
            }
            else if (index < 0 && indexPrev >= 0) {
                parceiroLista.push({ ...formPrev.current.parceiroLista[indexPrev] });
            }
            else {
                parceiroLista[index].ativo.value = indexPrev >= 0;
            }
        }

        setForm({
            ...form,
            parceiroLista: parceiroLista
        });
    }

    const onChangeStep = (step: number) => {

        if (step === PERFIL) {
            montaDadosPerfil();
        }

        setActiveIndex(step);
    }

    return (
        <>
            <div className="min-w-full">
                <form onSubmit={onSubmit}>
                    <Toolbar className="border-none bg-white" start={toolbarStart} end={toolbarEnd} />

                    <Steps
                        model={stepItems}
                        activeIndex={activeIndex}
                        readOnly={true}
                    />
                    <br />

                    <div className="card">
                    {
                        activeIndex === PARCEIRO &&
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
                    }
                    {
                        activeIndex === PERFIL &&
                        <>
                            {
                                form.parceiroLista.map((p, i) => {
                                    const lista = form.parceiroLista.filter(pa => pa.parceiro.id !== p.parceiro.id) ?? [];

                                    const toAcessoSorted = (novaLista: IAcesso[]) => {
                                        return novaLista.sort((a: IAcesso, b: IAcesso) => {
                                            const nomeA = a.parceiro.nome.toUpperCase();
                                            const nomeB = b.parceiro.nome.toUpperCase();

                                            if (nomeA < nomeB) {
                                                return -1;
                                            }
                                            if (nomeA > nomeB) {
                                                return 1;
                                            }
                                            return 0;
                                        });
                                    };

                                    const setChange = () =>
                                        setForm({
                                            ...form,
                                            parceiroLista: toAcessoSorted([ ...lista, p ])
                                        });

                                    const onPerfilChange = (e: DropdownChangeEvent) => {
                                        p.perfil.value = e.target.value as number;
                                        setChange();
                                    };

                                    const onGrupoAcessoChange = (e: DropdownChangeEvent) => {
                                        p.grupoAcessoId.value = e.target.value as number;
                                        setChange();
                                    };

                                    const onEhResponsavelChange = (e: InputSwitchChangeEvent) => {
                                        p.ehResponsavel.value = e.target.value;
                                        setChange();
                                    };

                                    const onAtivoChange = (e: InputSwitchChangeEvent) => {
                                        p.ativo.value = e.target.value;
                                        setChange();
                                    };

                                    return (
                                        <React.Fragment key={p.parceiro.id}>
                                            <div className="formgrid grid">
                                                <div className="field col-12">
                                                    <span className='font-bold'>{p.parceiro.nome}</span>
                                                    <Tag className="ml-6" value={p.parceiro.ativo ? "Ativo" : "Inativo"} severity={p.parceiro.ativo ? "success" : "warning"}></Tag>
                                                </div>
                                            </div>

                                            <br />
                                            <div className="formgrid grid">
                                                <div className="field col-3">
                                                    <label htmlFor="perfil" className="font-bold">
                                                        Perfil:
                                                    </label>
                                                    <Dropdown
                                                        ref={i == 0 ? objectFocusRef : undefined}
                                                        id="perfil"
                                                        value={p.perfil.value}
                                                        invalid={p.perfil.isAlert}
                                                        options={[
                                                            { name: PerfilEnum.Administrativo.name, value: PerfilEnum.Administrativo.value },
                                                            { name: PerfilEnum.Comercial.name, value: PerfilEnum.Comercial.value },
                                                            { name: PerfilEnum.Investidor.name, value: PerfilEnum.Investidor.value }
                                                        ]}
                                                        onChange={onPerfilChange}
                                                        optionLabel="name" 
                                                        placeholder="Selecione um perfil"
                                                        className="w-full text-base"
                                                        required
                                                    />
                                                    {p.perfil.isAlert && <small className="text-red-500">&nbsp;{p.perfil.message}</small>}
                                                </div>

                                                <div className="field col-3">
                                                    <label htmlFor="grupoAcessoId" className="font-bold">
                                                        Grupo de Acesso:
                                                    </label>
                                                    <Dropdown
                                                        id="grupoAcessoId"
                                                        value={p.grupoAcessoId.value ?? 0}
                                                        invalid={p.grupoAcessoId.isAlert}
                                                        options={p.grupoAcessoLista}
                                                        onChange={onGrupoAcessoChange}
                                                        optionValue="id"
                                                        optionLabel="descricao" 
                                                        placeholder="Selecione um grupo"
                                                        className="w-full text-base"
                                                        required
                                                    />
                                                    {p.grupoAcessoId.isAlert && <small className="text-red-500">&nbsp;{p.grupoAcessoId.message}</small>}
                                                </div>

                                                <div className="field col-offset-1 col-2">
                                                    <label htmlFor="ehResponsavel" className="font-bold">
                                                        Responsável:
                                                    </label>
                                                    <br />
                                                    <InputSwitch
                                                        id="ehResponsavel"
                                                        className='mt-2'
                                                        checked={p.ehResponsavel.value as boolean}
                                                        onChange={onEhResponsavelChange}
                                                    />
                                                    {p.ehResponsavel.isAlert && <small className="text-red-500">&nbsp;{p.ehResponsavel.message}</small>}
                                                </div>

                                                <div className="field col-offset-1 col-2">
                                                    <label htmlFor="ativo" className="font-bold">
                                                        Ativo:
                                                    </label>
                                                    <br />
                                                    <InputSwitch
                                                        id="ativo"
                                                        className='mt-2'
                                                        checked={p.ativo.value as boolean}
                                                        onChange={onAtivoChange}
                                                    />
                                                    {p.ativo.isAlert && <small className="text-red-500">&nbsp;{p.ativo.message}</small>}
                                                </div>
                                            </div>

                                            <hr />
                                        </React.Fragment>
                                    );
                                })
                            }
                        </>
                    }
                    </div>
                </form>
            </div>

            <Toast ref={toast} />
            <ConfirmDialog group="parceiro" />
            <ScrollTop target="parent" threshold={100} />
        </>
    );
};

export default ParceiroAcesso;