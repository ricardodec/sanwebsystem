enum AcaoEnum {
    CONSULTAR = 1,
    INSERIR = 2,
    ALTERAR = 3,
    EXCLUIR = 4,
    EXECUTAR = 5,
    CANCELAR = 6,
    ENVIAR = 7,
    INSTRUIR = 8,
    CONFIRMAR = 9,
    APROVAR = 10,
    REPROVAR = 11,
}

const getNomeAcaoEnum = (acao: AcaoEnum): string => {
    switch (acao) {
        case AcaoEnum.CONSULTAR:
            return 'Consultar';
        case AcaoEnum.INSERIR:
            return 'Inserir';
        case AcaoEnum.ALTERAR:
            return 'Alterar';
        case AcaoEnum.EXCLUIR:
            return 'Excluir';
        case AcaoEnum.EXECUTAR:
            return 'Executar';
        case AcaoEnum.CANCELAR:
            return 'Cancelar';
        case AcaoEnum.ENVIAR:
            return 'Enviar';
        case AcaoEnum.INSTRUIR:
            return 'Instruir';
        case AcaoEnum.CONFIRMAR:
            return 'Confirmar';
        case AcaoEnum.APROVAR:
            return 'Aprovar';
        case AcaoEnum.REPROVAR:
            return 'Reprovar';
        default:
            return '';
    }
};

export { AcaoEnum, getNomeAcaoEnum };
