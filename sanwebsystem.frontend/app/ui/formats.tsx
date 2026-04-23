'use client';

import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { addLocale } from 'primereact/api';

export const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'R$',
    });
};

export const formatDecimal = (value: number) => {
    return value.toLocaleString('pt-BR', {
        style: 'decimal',
    });
};

export const formatBoolean = (
    data: boolean,
    style = { fontSize: '1.5rem' } as React.CSSProperties,
) => {
    return (
        <i
            className={classNames('pi', {
                'text-green-500 true-icon pi-check-circle': data,
                'text-red-500 false-icon pi-times-circle': !data,
            })}
            style={style}
        ></i>
    );
};

export const formatCnpjCpf = (value: string) => {
    const cnpjCpf = value.replaceAll(/\D/g, '');

    if (cnpjCpf.length <= 11) {
        return cnpjCpf.replaceAll(
            /(\d{3})(\d{3})(\d{3})(\d{2})/g,
            '$1.$2.$3-$4',
        );
    }

    return cnpjCpf.replaceAll(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
        '$1.$2.$3/$4-$5',
    );
};

export const formataCarregarMais = (action?: () => void) => {
    return (
        <div className="flex flex-wrap align-items-center justify-content-center">
            <Button
                type="button"
                label="Carregar mais..."
                icon="pi pi-search-plus"
                severity="info"
                onClick={action}
            />
        </div>
    );
};

export const addLocalePtBR = () => {
    addLocale('pt-BR', {
        dateFormat: 'dd/mm/yy',
        firstDayOfWeek: 1,
        dayNames: [
            'domingo',
            'segunda',
            'terça',
            'quarta',
            'quinta',
            'sexta',
            'sábado',
        ],
        dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
        dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
        monthNames: [
            'janeiro',
            'fevereiro',
            'março',
            'abril',
            'maio',
            'junho',
            'julho',
            'agosto',
            'setembro',
            'outubro',
            'novembro',
            'dezembro',
        ],
        monthNamesShort: [
            'jan',
            'fev',
            'mar',
            'abr',
            'mai',
            'jun',
            'jul',
            'ago',
            'set',
            'out',
            'nov',
            'dez',
        ],
        today: 'Hoje',
        clear: 'Limpar',
    });
};
