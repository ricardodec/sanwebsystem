enum ModuloEnum {
    SECURITIZACAO_ATIVO = 1,
    SECURITIZACAO_PASSIVO = 2,
    FOMENTO_ATIVO = 3,
    FOMENTO_PASSIVO = 4,
    FIDC_ATIVO = 5,
    FIDC_PASSIVO = 6,
    CONTAS_A_PAGAR_E_RECEBER = 7,
    AVALIACAO_PSICOLOGICA = 8,
}

const getNomeModuloEnum = (modulo: ModuloEnum): string => {
    switch (modulo) {
        case ModuloEnum.SECURITIZACAO_ATIVO:
            return 'Seguritização (Ativo)';
        case ModuloEnum.SECURITIZACAO_PASSIVO:
            return 'Seguritização (Passivo)';
        case ModuloEnum.FOMENTO_ATIVO:
            return 'Fomento (Ativo)';
        case ModuloEnum.FOMENTO_PASSIVO:
            return 'Fomento (Passivo)';
        case ModuloEnum.FIDC_ATIVO:
            return 'FIDC (Ativo)';
        case ModuloEnum.FIDC_PASSIVO:
            return 'FIDC (Passivo)';
        case ModuloEnum.CONTAS_A_PAGAR_E_RECEBER:
            return 'Contas a Pagar e Receber';
        case ModuloEnum.AVALIACAO_PSICOLOGICA:
            return 'Avaliação Psicológica';
        default:
            return '';
    }
};

export { getNomeModuloEnum, ModuloEnum };
