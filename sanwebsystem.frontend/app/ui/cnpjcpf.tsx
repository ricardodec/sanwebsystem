import React from 'react';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { InputMask, InputMaskChangeEvent } from 'primereact/inputmask';
import { ObjectForm } from '@types';
import { TipoPessoaEnum } from '@enums';
import { isValidCPF, isValidCNPJ } from './validations';

type CnpjCpfUIProps = {
    id?: string;
    name?: string;
    ref?: React.Ref<HTMLElement>;
    tipoPessoa: ObjectForm<number>;
    cnpjCpf: ObjectForm<string>;
    onChange: (
        tipoPessoa: ObjectForm<number>,
        cnpjCpf: ObjectForm<string>,
    ) => void;
    ui?: 'AMBOS' | null;
    required?: boolean;
    disabled?: boolean;
    autoFocus?: boolean;
    unmask?: boolean;
};

const CnpjCpfUI = ({
    id,
    name,
    ref,
    tipoPessoa,
    cnpjCpf,
    onChange,
    ui = null,
    required = false,
    disabled = false,
    autoFocus = false,
    unmask = true,
}: Readonly<CnpjCpfUIProps>) => {
    id ??= '';
    name ??= '';

    const onTipoPessoaChange = (e: RadioButtonChangeEvent) => {
        onChange(
            { ...tipoPessoa, value: Number(e.target.value) },
            { isAlert: false, value: '', message: '' },
        );
    };

    const onCnpjCpfChange = (e: InputMaskChangeEvent) => {
        let mensagem = '';

        if (
            e.target.value !== '' &&
            tipoPessoa.value === TipoPessoaEnum.Empresa.value &&
            !isValidCNPJ(e.target.value as string)
        )
            mensagem = 'CNPJ inválido';
        else if (
            e.target.value !== '' &&
            tipoPessoa.value === TipoPessoaEnum.PessoaNatural.value &&
            !isValidCPF(e.target.value as string)
        )
            mensagem = 'CPF inválido';

        onChange(tipoPessoa, {
            isAlert: mensagem !== '',
            value: e.target.value as string,
            message: mensagem,
        });
    };

    const getMask = () => {
        if (tipoPessoa.value === TipoPessoaEnum.Empresa.value)
            return '99.999.999/9999-99';
        else if (tipoPessoa.value === TipoPessoaEnum.PessoaNatural.value)
            return '999.999.999-99';
        else return '';
    };

    return (
        <div className="formgrid grid">
            {ui === 'AMBOS' && (
                <div className="field col-4">
                    <label htmlFor={'tipoPessoa' + id} className="font-bold">
                        Tipo:
                    </label>
                    <div className="flex flex-wrap mt-2">
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId={'tipoPessoa1' + id}
                                name={'tipoPessoa' + name}
                                value={TipoPessoaEnum.Empresa.value}
                                onChange={onTipoPessoaChange}
                                checked={
                                    tipoPessoa.value ===
                                    TipoPessoaEnum.Empresa.value
                                }
                                disabled={disabled}
                                invalid={tipoPessoa.isAlert}
                            />
                            <label
                                htmlFor={id + 'tipoPessoa1'}
                                className="ml-2"
                            >
                                {TipoPessoaEnum.Empresa.name}
                            </label>
                        </div>
                        <div className="flex align-items-center ml-4">
                            <RadioButton
                                inputId={'tipoPessoa2' + id}
                                name={'tipoPessoa' + name}
                                value={TipoPessoaEnum.PessoaNatural.value}
                                onChange={onTipoPessoaChange}
                                checked={
                                    tipoPessoa.value ===
                                    TipoPessoaEnum.PessoaNatural.value
                                }
                                disabled={disabled}
                                invalid={tipoPessoa.isAlert}
                            />
                            <label
                                htmlFor={id + 'tipoPessoa2'}
                                className="ml-2"
                            >
                                {TipoPessoaEnum.PessoaNatural.name}
                            </label>
                        </div>
                    </div>
                    {tipoPessoa.isAlert && (
                        <small className="text-red-500">
                            &nbsp;{tipoPessoa.message}
                        </small>
                    )}
                </div>
            )}

            <div className={ui === 'AMBOS' ? 'field col-8' : 'field col-12'}>
                <label htmlFor={'cnpjCpf' + id} className="font-bold">
                    {tipoPessoa.value === TipoPessoaEnum.Empresa.value
                        ? 'CNPJ:'
                        : 'CPF:'}
                </label>
                <InputMask
                    ref={ref as React.Ref<InputMask> | undefined}
                    id={'cnpjCpf' + id}
                    name={'cnpjCpf' + name}
                    mask={getMask()}
                    unmask={unmask}
                    value={cnpjCpf.value as string}
                    invalid={cnpjCpf.isAlert}
                    onChange={onCnpjCpfChange}
                    className="w-full text-base"
                    required={required}
                    disabled={disabled}
                    autoFocus={autoFocus}
                />
                {ui !== 'AMBOS' && tipoPessoa.isAlert && (
                    <small className="text-red-500">
                        &nbsp;{tipoPessoa.message}
                    </small>
                )}
                {cnpjCpf.isAlert && (
                    <small className="text-red-500">
                        &nbsp;{cnpjCpf.message}
                    </small>
                )}
            </div>
        </div>
    );
};

export default CnpjCpfUI;
