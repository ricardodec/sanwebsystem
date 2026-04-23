'use client';

import React, { useEffect, useState, useRef, useContext } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ScrollTop } from 'primereact/scrolltop';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import fetchService from '@actions/fetch';
import Loading from '@ui/loading';
import { formUsuarioDefault } from '../default/default-type';
import UsuarioDefault from '../default/default';
import { AuthContext } from '@context/auth';

interface UsuarioEditProps {
    usuarioId: number;
    parceiroId: number;
    onClose: (usuario: Auth.ICadastroUsuario | null) => void;
}

const UsuarioEdit = ({ usuarioId, parceiroId, onClose }: UsuarioEditProps) => {
    const { auth } = useContext(AuthContext);
    const formPrev = useRef<Auth.ICadastroUsuario>(formUsuarioDefault);
    const objectFocusRef = useRef(null);

    const [form, setForm] = useState<Auth.ICadastroUsuario>(formUsuarioDefault);
    const [alteraSenha, setAlteraSenha] = useState<boolean>(false);

    const formAlterado = () => JSON.stringify(form) !== JSON.stringify(formPrev.current);

    useEffect(() => {
        fetchService({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/usuario/editar`, method: `POST`, token: auth.token as string, body: usuarioId.toString() })
            .then((data: Auth.ICadastroUsuario | null) => {
                if (data === null) {
                    return;
                }

                data.parceiroId = parceiroId;

                formPrev.current = data;
                setForm(data);
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
                accept: () => onClose(null)
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
                accept: () => aoConfirmaSalvar()
            });
        } else {
            onClose(null);
        }
    };

    const aoConfirmaSalvar = () => {
        Loading.show();

        fetchService({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/controle/usuario/salvar`, method: `POST`, token: auth.token as string, body: JSON.stringify(form) })
            .then((data: Auth.ICadastroUsuario | null) => {
                if (data != null) {
                    formPrev.current = data;
                    setForm(data);
                    onClose(data);
                }
            })
            .finally(() => {
                Loading.hide();
            });
    };

    const toolbarStart = () => {
        return <Button type="button" label="Retornar" icon="pi pi-step-backward" onClick={onRetornarClick} />;
    };

    const toolbarEnd = () => {
        return <Button type="submit" label="Salvar" icon="pi pi-save" />;
    };

    const passwordFooter = (
        <>
            <Divider />
            <p className="mt-2">Necessário</p>
            <ul className="pl-2 ml-2 mt-0 line-height-3">
                {auth.parametro.caracterMinusculo === true && <li>Pelo menos uma letra minúscula</li>}
                {auth.parametro.caracterMaiusculo === true && <li>Pelo menos uma letra maiúscula</li>}
                {auth.parametro.caracterNumerico === true && <li>Pelo menos um número</li>}
                {auth.parametro.caracterEspecial === true && <li>Pelo menos um caracter especial (=*@&#!@+-)</li>}
                <li>Mínimo de {auth.parametro.minTamanhoSenha} caracteres</li>
            </ul>
        </>
    );

    return (
        <>
            <div className="min-w-full">
                <form onSubmit={onSubmit}>
                    <Toolbar className="border-none bg-white" start={toolbarStart} end={toolbarEnd} />

                    <hr />
                    <UsuarioDefault ref={objectFocusRef} form={form} setForm={setForm} />

                    <div className="formgrid grid mt-3">
                        <div className="field col-3">
                            <label htmlFor="ativo" className="font-bold">
                                Ativo:
                            </label>
                            <br />
                            <InputSwitch id="ativo" className="mt-2" checked={form.ativo.value as boolean} onChange={(e: InputSwitchChangeEvent) => setForm({ ...form, ativo: { ...form.ativo, value: e.target.value } })} />
                            {form.ativo.isAlert && <small className="text-red-500">&nbsp;{form.ativo.message}</small>}
                        </div>

                        <div className="field col-3">
                            <label htmlFor="ehControlador" className="font-bold">
                                É controlador?:
                            </label>
                            <br />
                            <InputSwitch
                                id="ehControlador"
                                className="mt-2"
                                checked={form.ehControlador.value as boolean}
                                onChange={(e: InputSwitchChangeEvent) => setForm({ ...form, ehControlador: { ...form.ehControlador, value: e.target.value } })}
                            />
                            {form.ehControlador.isAlert && <small className="text-red-500">&nbsp;{form.ehControlador.message}</small>}
                        </div>
                    </div>

                    <div className="formgrid grid mt-3">
                        <div className="field col-3">
                            <label htmlFor="alteraSenha" className="font-bold">
                                Alterar senha?:
                            </label>
                            <br />
                            <InputSwitch id="enviarEmailSenha" className="mt-2" checked={alteraSenha} onChange={(e: InputSwitchChangeEvent) => setAlteraSenha(e.target.value)} />
                        </div>

                        {alteraSenha && (
                            <>
                                <div className="field col-5">
                                    <label htmlFor="senha" className="font-bold">
                                        Senha *
                                    </label>
                                    <div className="p-inputgroup">
                                        <Password
                                            inputId="senha"
                                            value={form.senha.value as string}
                                            invalid={form.senha.isAlert}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, senha: { ...form.senha, value: e.target.value } })}
                                            inputClassName="w-full text-base"
                                            placeholder="Senha"
                                            feedback={true}
                                            toggleMask
                                            promptLabel="Entre com a senha"
                                            weakLabel="Fraca"
                                            mediumLabel="Média"
                                            strongLabel="Forte"
                                            minLength={auth.parametro.minTamanhoSenha}
                                            footer={passwordFooter}
                                        />
                                        <span className="p-inputgroup-addon bg-orange-500">
                                            <i className="pi pi-exclamation-triangle text-white" title="Preencha somente se quiser alterar!"></i>
                                        </span>
                                    </div>
                                    {form.senha.isAlert && <span className="text-red-500 mt-1 w-full md:w-30rem">{form.senha.message}</span>}
                                </div>

                                <div className="field col-offset-1 col-3">
                                    <label htmlFor="enviarEmailSenha" className="font-bold">
                                        Enviar e-mail?:
                                    </label>
                                    <br />
                                    <InputSwitch id="enviarEmailSenha" className="mt-2" checked={form.enviarEmailSenha} onChange={(e: InputSwitchChangeEvent) => setForm({ ...form, enviarEmailSenha: e.target.value })} />
                                </div>
                            </>
                        )}
                    </div>
                </form>

                <ConfirmDialog group="edit" />
            </div>

            <ScrollTop target="parent" threshold={100} />
        </>
    );
};

export default UsuarioEdit;
