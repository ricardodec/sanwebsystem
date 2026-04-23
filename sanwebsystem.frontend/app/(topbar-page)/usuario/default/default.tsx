'use client';

import React from 'react';
import Image from 'next/image';
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { TFATipoEnum } from '@enums';
import { isEmailValid } from '@ui/validations';
import { FileUploadUI } from '@ui/files';

interface UsuarioEditProps {
    ref?: React.Ref<HTMLElement>;
    form: Auth.ICadastroUsuario;
    setForm: React.Dispatch<React.SetStateAction<Auth.ICadastroUsuario>>;
}

const UsuarioDefault = ({ ref, form, setForm }: UsuarioEditProps) => {
    const onUpload = (fileName: string, type: string, result: string | null) => {
        setForm({
            ...form,
            foto: {
                ...form.foto,
                value: result
            },
            fotoMimeType: {
                ...form.fotoMimeType,
                value: type
            }
        });
    };

    const onClear = () => {
        setForm({
            ...form,
            foto: {
                ...form.foto,
                value: null
            },
            fotoMimeType: {
                ...form.fotoMimeType,
                value: null
            }
        });
    };

    const getImageQrCode = () => {
        return (
            <div className="formgrid grid">
                <div className="col-offset-4 col-4">
                    <Image src={form.tfaQrCodeImageUrl ?? ''} alt="QRCode Authenticator" />
                </div>

                <div className="col-12">
                    <hr />
                    <strong>Codinome: </strong>
                    <span>sanwebsystem.com.br: {form.email.value}</span>
                    <br />
                    <strong>Chave de Configuração: </strong>
                    <span>{form.tfaEntryKey ?? ''}</span>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="formgrid grid">
                <div className="field col-3">
                    <label htmlFor="login" className="font-bold">
                        Login:
                    </label>
                    <InputText
                        ref={form.id === 0 ? (ref as React.Ref<HTMLInputElement> | undefined) : undefined}
                        id="login"
                        type="text"
                        value={form.login.value as string}
                        invalid={form.login.isAlert}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, login: { ...form.login, value: e.target.value.toLowerCase() } })}
                        className="w-full text-base"
                        disabled={form.id !== 0}
                        required
                    />
                    {form.login.isAlert && <small className="text-red-500">&nbsp;{form.login.message}</small>}
                </div>

                <div className="field col-4">
                    <label htmlFor="nome" className="font-bold">
                        Nome:
                    </label>
                    <InputText
                        ref={form.id === 0 ? undefined : (ref as React.Ref<HTMLInputElement> | undefined)}
                        id="nome"
                        type="text"
                        value={form.nome.value as string}
                        invalid={form.nome.isAlert}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, nome: { ...form.nome, value: e.target.value } })}
                        className="w-full text-base"
                        required
                    />
                    {form.nome.isAlert && <small className="text-red-500">&nbsp;{form.nome.message}</small>}
                </div>

                <div className="field col-5">
                    <label htmlFor="email" className="font-bold">
                        E-mail:
                    </label>
                    <InputText
                        id="email"
                        type="email"
                        value={form.email.value as string}
                        invalid={form.email.isAlert || !isEmailValid(form.email.value as string)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: { ...form.email, value: e.target.value } })}
                        className="w-full text-base"
                        required
                    />
                    {form.email.isAlert && <small className="text-red-500">&nbsp;{form.email.message}</small>}
                </div>
            </div>

            <div className="formgrid grid">
                <div className="field col-3">
                    <label htmlFor="tfa" className="font-bold">
                        TFA:
                    </label>
                    <br />
                    <InputSwitch id="tfa" className="mt-2" checked={form.tfa.value as boolean} onChange={(e: InputSwitchChangeEvent) => setForm({ ...form, tfa: { ...form.tfa, value: e.target.value } })} />
                    {form.tfa.isAlert && <small className="text-red-500">&nbsp;{form.tfa.message}</small>}
                </div>

                {form.tfa.value === true && (
                    <div className="field col-4">
                        <label htmlFor="tfaTipo" className="font-bold">
                            Tipo de TFA:
                        </label>
                        <Dropdown
                            id="tfaTipo"
                            options={form.tfaTipoLista}
                            value={form.tfaTipo.value.toString()}
                            onChange={(e: DropdownChangeEvent) => setForm({ ...form, tfaTipo: { ...form.tfaTipo, value: Number(e.target.value) } })}
                            optionValue="id"
                            optionLabel="descricao"
                            defaultValue={form.tfaTipoLista.length === 0 ? 0 : form.tfaTipoLista[0].id}
                            className="w-full text-base"
                        />
                        {form.tfaTipo.isAlert && <small className="text-red-500">&nbsp;{form.tfaTipo.message}</small>}
                    </div>
                )}
            </div>

            {form.tfa.value === true && form.tfaTipo.value === TFATipoEnum.Google.value && form.tfaQrCodeImageUrl !== null && <Panel header="QRCode no Google Authenticator">{getImageQrCode()}</Panel>}

            <div className="formgrid grid">
                <div className="field col-12">
                    <label htmlFor="foto" className="font-bold">
                        Foto:
                    </label>
                    <FileUploadUI id="foto" file={form.foto.value} mimeType={form.fotoMimeType.value} multiple={false} onUpload={onUpload} onClear={onClear} />
                    {form.foto.isAlert && <small className="text-red-500">&nbsp;{form.foto.message}</small>}
                    {form.fotoMimeType.isAlert && <small className="text-red-500">&nbsp;{form.fotoMimeType.message}</small>}
                </div>
            </div>
        </>
    );
};

export default UsuarioDefault;
