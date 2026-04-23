import React from 'react';
import { InputMask, InputMaskChangeEvent} from "primereact/inputmask";
import { Nullable } from "primereact/ts-helpers";
import { ObjectForm } from '@types';
import { isValidCEP } from './validations';

type CepUIProps = {
    id?: string;
    name?: string;
    ref?: React.Ref<HTMLElement>;
    cep: ObjectForm<Nullable<string>>;
    onChange: (value: ObjectForm<Nullable<string>>) => void;
    required?: boolean;
    disabled?: boolean;
    autoFocus?: boolean;
    unmask?: boolean;
};

const CepUI = ({ id, name, ref, cep, onChange, required = false, disabled = false, autoFocus = false, unmask = true }: Readonly<CepUIProps>) => {

    id ??= '';
    name ??= '';

    const onCepChange = (e: InputMaskChangeEvent) => {
        let mensagem = '';
        
        if (e.target.value !== '' && !isValidCEP(e.target.value as string, unmask))
            mensagem = "CEP inválido";

        onChange({ isAlert: mensagem !== '', value: e.target.value as string, message: mensagem });
    };

    return (
        <>
            <InputMask
                ref={ref as React.Ref<InputMask> | undefined}
                id={id}
                name={name}
                mask="99999-999"
                placeholder="99999-999"
                unmask={unmask}
                value={cep.value as string}
                invalid={cep.isAlert}
                onChange={onCepChange}
                className="w-full text-base"
                disabled={disabled}
                autoFocus={autoFocus}
                required={required}
            />
            {cep.isAlert && <small className="text-red-500">&nbsp;{cep.message}</small>}
        </>
    );
}

export default CepUI;