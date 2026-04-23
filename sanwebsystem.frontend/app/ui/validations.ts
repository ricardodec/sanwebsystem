export const isEmailValid = (email: string | null | undefined): boolean => {
    if (email === null || email === '') return true;

    if (email === undefined) return false;

    const emailRegex: RegExp =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

export const isValidCEP = (cep: string, unmask: boolean): boolean => {
    const cepRegex: RegExp = unmask ? /^\d{8}$/ : /^\d{5}-\d{3}$/;
    return cepRegex.test(cep);
};

export const isValidCPF = (value: string): boolean => {
    let soma = 0;
    let resto = 0;

    value = value.replaceAll(/[^\d]+/g, '');

    if (
        value === '00000000000' ||
        value === '11111111111' ||
        value === '22222222222' ||
        value === '33333333333' ||
        value === '44444444444' ||
        value === '55555555555' ||
        value === '66666666666' ||
        value === '77777777777' ||
        value === '88888888888' ||
        value === '99999999999'
    )
        return false;

    for (let i = 1; i <= 9; i++)
        soma = soma + Number(value.substring(i - 1, i)) * (11 - i);

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) resto = 0;

    if (resto !== Number(value.substring(9, 10))) return false;

    soma = 0;

    for (let i = 1; i <= 10; i++)
        soma = soma + Number(value.substring(i - 1, i)) * (12 - i);

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) resto = 0;

    return resto === Number(value.substring(10, 11));
};

export const isValidCNPJ = (value: string): boolean => {
    value = value.replaceAll(/[^\d]+/g, '');

    if (value === '') return false;

    if (value.length === 13) value = '0' + value;
    else if (value.length !== 14) return false;

    if (
        value === '00000000000000' ||
        value === '11111111111111' ||
        value === '22222222222222' ||
        value === '33333333333333' ||
        value === '44444444444444' ||
        value === '55555555555555' ||
        value === '66666666666666' ||
        value === '77777777777777' ||
        value === '88888888888888' ||
        value === '99999999999999'
    )
        return false;

    let tamanho = value.length - 2;
    let numeros = value.substring(0, tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    const digitos = value.substring(tamanho);

    for (let i = tamanho; i >= 1; i--) {
        soma += Number(numeros.charAt(tamanho - i)) * pos--;

        if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    if (resultado !== Number(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = value.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += Number(numeros.charAt(tamanho - i)) * pos--;

        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    return resultado === Number(digitos.charAt(1));
};
