import { DataSource } from 'typeorm';
import { Variavel } from '../entities/variavel.entity';

export const seedVariavel = async (dataSource: DataSource): Promise<void> => {
    const variavelRepository = dataSource.getRepository(Variavel);

    await variavelRepository.save({
        ID: 1,
        tag: 'NOME_PARCEIRO',
        descricao: 'Nome/razão social do parceiro',
    });
    await variavelRepository.save({
        ID: 2,
        tag: 'NOMEFANTASIA_PARCEIRO',
        descricao: 'Nome fantasia do parceiro',
    });
    await variavelRepository.save({
        ID: 3,
        tag: 'CNPJCPF_PARCEIRO',
        descricao: 'CNPJ/CPF do parceiro',
    });
    await variavelRepository.save({
        ID: 4,
        tag: 'ENDERECO_PARCEIRO',
        descricao: 'Endereço do parceiro',
    });
    await variavelRepository.save({
        ID: 5,
        tag: 'NOME_CLIENTE',
        descricao: 'Nome/razão social do cliente',
    });
    await variavelRepository.save({
        ID: 6,
        tag: 'NOMEFANTASIA_CLIENTE',
        descricao: 'Nome fantasia do cliente',
    });
    await variavelRepository.save({
        ID: 7,
        tag: 'CNPJCPF_CLIENTE',
        descricao: 'CNPJ/CPF do cliente',
    });
    await variavelRepository.save({
        ID: 8,
        tag: 'ENDERECO_CLIENTE',
        descricao: 'Endereço do cliente',
    });
    await variavelRepository.save({
        ID: 9,
        tag: 'DATA_CONTRATO',
        descricao: 'Data do contrato',
    });
    await variavelRepository.save({
        ID: 10,
        tag: 'DATA_CONTRATO_EXTENSO',
        descricao: 'Data do contrato por extenso',
    });
    await variavelRepository.save({
        ID: 11,
        tag: 'NUM_CONTRATO',
        descricao: 'Número do contrato',
    });
    await variavelRepository.save({
        ID: 12,
        tag: 'RESPONSAVEIS_PARCEIRO',
        descricao:
            'Composição da identificação dos responsáveis do parceiro selecionado',
    });
    await variavelRepository.save({
        ID: 13,
        tag: 'RESPONSAVEIS_CLIENTE',
        descricao:
            'Composição da identificação dos responsáveis solidários do cliente selecionado',
    });
    await variavelRepository.save({
        ID: 14,
        tag: 'SOLIDARIOS_CLIENTE',
        descricao:
            'Representantes do cliente que assinam como interveniente responsável solidário',
    });
    await variavelRepository.save({
        ID: 15,
        tag: 'FIEIS_CLIENTE',
        descricao:
            'Representantes do cliente que assinam como interveniente fiel depositário',
    });
    await variavelRepository.save({
        ID: 16,
        tag: 'RESPONSAVEIS_CLIENTE_EMAIL',
        descricao: 'Lista dos e-mails dos responsáveis do cliente selecionado',
    });
    await variavelRepository.save({
        ID: 17,
        tag: 'RESPONSAVEIS_PARTNER_EMAIL',
        descricao: 'Lista dos e-mails dos responsáveis do parceiro selecionado',
    });
    await variavelRepository.save({
        ID: 18,
        tag: 'SOLIDARIOS_CLIENTE_EMAIL',
        descricao:
            'Lista dos e-mails dos responsáveis solidários do cliente selecionado',
    });
    await variavelRepository.save({
        ID: 19,
        tag: 'CIDADE_PARCEIRO',
        descricao: 'Cidade do parceiro',
    });
    await variavelRepository.save({
        ID: 20,
        tag: 'DATA_ADITIVO',
        descricao: 'Data da declaração/termo de cessão',
    });
    await variavelRepository.save({
        ID: 21,
        tag: 'DATA_ADITIVO_EXTENSO',
        descricao: 'Data da declaração/termo de cessão por extenso',
    });
    await variavelRepository.save({
        ID: 22,
        tag: 'ADITIVO_VALOR',
        descricao: 'Valor bruto da declaração/termo de cessão',
    });
    await variavelRepository.save({
        ID: 23,
        tag: 'ADITIVO_VALOR_EXTENSO',
        descricao: 'Valor bruto por extenso da declaração/termo de cessão',
    });
    await variavelRepository.save({
        ID: 24,
        tag: 'ADITIVO_VALOR_LIQUIDO',
        descricao: 'Valor líquido da declaração/termo de cessão',
    });
    await variavelRepository.save({
        ID: 25,
        tag: 'ADITIVO_VALOR_LIQUIDO_EXTENSO',
        descricao: 'Valor líquido por extenso da declaração/termo de cessão',
    });
    await variavelRepository.save({
        ID: 26,
        tag: 'TITULOS_BORDERO',
        descricao: 'Tabela com o(s) título(s) da declaração/termo de cessão',
    });
    await variavelRepository.save({
        ID: 27,
        tag: 'RESUMO_BORDERO',
        descricao:
            'Tabela com demonstrativo dos valores da declaração/termo de cessão',
    });
    await variavelRepository.save({
        ID: 28,
        tag: 'CONTAS_PAGAMENTO',
        descricao:
            'Tabela com a(s) conta(s) corrente(s) para pagamento da declaração/termo de cessão',
    });
    await variavelRepository.save({
        ID: 29,
        tag: 'NUM_ADITIVO',
        descricao: 'Número da declaração/termo de cessão',
    });
    await variavelRepository.save({
        ID: 30,
        tag: 'RESPONSAVEL_CLIENTE',
        descricao:
            'Identificação de determinado responsável do cliente selecionado',
    });
    await variavelRepository.save({
        ID: 31,
        tag: 'RESPONSAVEL_CLIENTE_NOME',
        descricao: 'Nome de determinado responsável do cliente selecionado',
    });
    await variavelRepository.save({
        ID: 32,
        tag: 'RESPONSAVEL_CLIENTE_CNPJCPF',
        descricao: 'CPF de determinado responsável do cliente selecionado',
    });
    await variavelRepository.save({
        ID: 33,
        tag: 'RESPONSAVEL_CLIENTE_ENDERECO',
        descricao: 'Endereço de determinado responsável do cliente selecionado',
    });
    await variavelRepository.save({
        ID: 34,
        tag: 'TESTEMUNHAS_PARCEIRO',
        descricao: 'Listas das testemunhas do parceiro',
    });
    await variavelRepository.save({
        ID: 35,
        tag: 'ANUENTES_CLIENTE',
        descricao: 'Cônjuges dos assinantes do cliente selecionado',
    });
    await variavelRepository.save({
        ID: 36,
        tag: 'RECOMPRAS_BORDERO',
        descricao:
            'Tabela com o(s) título(s) recomprado(s) na declaração/termo de cessão',
    });
    await variavelRepository.save({
        ID: 37,
        tag: 'NOME_SACADO',
        descricao: 'Nome do Sacado',
    });
    await variavelRepository.save({
        ID: 38,
        tag: 'CNPJCPF_SACADO',
        descricao: 'CNPJ/CPF do Sacado',
    });
    await variavelRepository.save({
        ID: 39,
        tag: 'NUM_DOCUMENTO',
        descricao: 'Número do documento do título',
    });
    await variavelRepository.save({
        ID: 40,
        tag: 'DATA_EMISSAO_TITULO',
        descricao: 'Data da emissão do título',
    });
    await variavelRepository.save({
        ID: 41,
        tag: 'DATA_VCTO_TITULO',
        descricao: 'Data de vencimento do título',
    });
    await variavelRepository.save({
        ID: 42,
        tag: 'VALOR_NOMINAL',
        descricao: 'Valor nominal do título',
    });
    await variavelRepository.save({
        ID: 43,
        tag: 'DATA_DO_DIA',
        descricao: 'Data do sistema',
    });
    await variavelRepository.save({
        ID: 44,
        tag: 'DATA_DO_DIA_EXTENSO',
        descricao: 'Data do sistema DD, mmmm de AAAA',
    });
    await variavelRepository.save({
        ID: 45,
        tag: 'RESPONSAVEIS_PARCEIRO_ASSINATURA',
        descricao:
            'Lista de assinaturas dos responsáveis do parceiro selecionado',
    });
    await variavelRepository.save({
        ID: 46,
        tag: 'RESPONSAVEIS_CLIENTE_ASSINATURA',
        descricao:
            'Lista de assinaturas dos responsáveis do cliente selecionado',
    });
    await variavelRepository.save({
        ID: 47,
        tag: 'SOLIDARIOS_CLIENTE_ASSINATURA',
        descricao:
            'Lista de assinaturas de Interveniente(s) Responsável(éis) Solidário(s) do cliente selecionado',
    });
    await variavelRepository.save({
        ID: 48,
        tag: 'FIEIS_CLIENTE_ASSINATURA',
        descricao:
            'Lista de assinaturas de Interveniente(s) Fiel(éis) Depositário(s) do cliente selecionado',
    });
    await variavelRepository.save({
        ID: 49,
        tag: 'LOGRADOURO_PARCEIRO',
        descricao: 'Logradouro com número e complemento do parceiro',
    });
    await variavelRepository.save({
        ID: 50,
        tag: 'BAIRRO_PARCEIRO',
        descricao: 'Bairro do parceiro',
    });
    await variavelRepository.save({
        ID: 51,
        tag: 'UF_PARCEIRO',
        descricao: 'UF do parceiro',
    });
    await variavelRepository.save({
        ID: 52,
        tag: 'CEP_PARCEIRO',
        descricao: 'CEP do parceiro',
    });
    await variavelRepository.save({
        ID: 53,
        tag: 'CIDADE_UF_PARCEIRO',
        descricao: 'Cidade e UF do parceiro',
    });
    await variavelRepository.save({
        ID: 54,
        tag: 'CIDADE_CLIENTE',
        descricao: 'Cidade do Cliente',
    });
    await variavelRepository.save({
        ID: 55,
        tag: 'LOGRADOURO_CLIENTE',
        descricao: 'Logradouro com número e complemento do Cliente',
    });
    await variavelRepository.save({
        ID: 56,
        tag: 'BAIRRO_CLIENTE',
        descricao: 'Bairro do Cliente',
    });
    await variavelRepository.save({
        ID: 57,
        tag: 'UF_CLIENTE',
        descricao: 'UF do Cliente',
    });
    await variavelRepository.save({
        ID: 58,
        tag: 'CEP_CLIENTE',
        descricao: 'CEP do Cliente',
    });
    await variavelRepository.save({
        ID: 59,
        tag: 'CIDADE_UF_CLIENTE',
        descricao: 'Cidade e UF do Cliente',
    });
    await variavelRepository.save({
        ID: 60,
        tag: 'RG_CLIENTE',
        descricao: 'RG do Cliente',
    });
    await variavelRepository.save({
        ID: 61,
        tag: 'RG_EMISSOR_CLIENTE',
        descricao: 'Emissor do RG do Cliente',
    });
    await variavelRepository.save({
        ID: 62,
        tag: 'TELEFONE_CLIENTE',
        descricao: 'Telefone do Cliente',
    });
    await variavelRepository.save({
        ID: 63,
        tag: 'NUM_CAUTELA',
        descricao: 'Número da cautela da subscrição',
    });
    await variavelRepository.save({
        ID: 64,
        tag: 'DATA_SUBSCRICAO',
        descricao: 'Data da subscrição',
    });
    await variavelRepository.save({
        ID: 65,
        tag: 'NUM_EMISSAO',
        descricao: 'Número da emissão das debêntures',
    });
    await variavelRepository.save({
        ID: 66,
        tag: 'NUM_EMISSAO_EXT',
        descricao: 'Número da emissão das debêntures (extenso)',
    });
    await variavelRepository.save({
        ID: 67,
        tag: 'DATA_EMISSAO',
        descricao: 'Data da emissão das debêntures',
    });
    await variavelRepository.save({
        ID: 68,
        tag: 'VALOR_EMISSAO',
        descricao: 'Valor da emissão das debêntures',
    });
    await variavelRepository.save({
        ID: 69,
        tag: 'QTDE_SERIES_EMISSAO',
        descricao: 'Qtde. de séries da emissão das debêntures',
    });
    await variavelRepository.save({
        ID: 70,
        tag: 'QTDE_SERIES_EMISSAO_EXT',
        descricao: 'Qtde. de séries da emissão das debêntures (extenso)',
    });
    await variavelRepository.save({
        ID: 71,
        tag: 'VCTO_EMISSAO',
        descricao: 'Data da vencimento da emissão',
    });
    await variavelRepository.save({
        ID: 72,
        tag: 'PRECO_UNITARIO_EMISSAO',
        descricao: 'Preço unitário da emissão',
    });
    await variavelRepository.save({
        ID: 73,
        tag: 'PRECO_UNITARIO_EMISSAO_EXT',
        descricao: 'Preço unitário da emissão (extenso)',
    });
    await variavelRepository.save({
        ID: 74,
        tag: 'QTDE_SUBSCRICAO',
        descricao: 'Quantidade subscrita',
    });
    await variavelRepository.save({
        ID: 75,
        tag: 'QTDE_SUBSCRICAO_EXT',
        descricao: 'Quantidade subscrita (extenso)',
    });
    await variavelRepository.save({
        ID: 76,
        tag: 'NUM_SERIE',
        descricao: 'Número de série da emissão',
    });
    await variavelRepository.save({
        ID: 77,
        tag: 'NUM_SERIE_EXT',
        descricao: 'Número de série da emissão (extenso)',
    });
    await variavelRepository.save({
        ID: 78,
        tag: 'VALOR_SUBSCRICAO',
        descricao: 'Valor da subscrição',
    });
    await variavelRepository.save({
        ID: 79,
        tag: 'VALOR_SUBSCRICAO_EXT',
        descricao: 'Valor da subscrição (extenso)',
    });
    await variavelRepository.save({
        ID: 80,
        tag: 'COD_REGISTRO_EMISSAO',
        descricao: 'Código do registro da emissão',
    });
    await variavelRepository.save({
        ID: 81,
        tag: 'DATA_REGISTRO_EMISSAO',
        descricao: 'Data do registro da emissão',
    });
    await variavelRepository.save({
        ID: 82,
        tag: 'NOME_PROCURADOR',
        descricao: 'Nome do procurador',
    });
    await variavelRepository.save({
        ID: 83,
        tag: 'CPF_PROCURADOR',
        descricao: 'CPF do procurador',
    });
    await variavelRepository.save({
        ID: 84,
        tag: 'RG_PROCURADOR',
        descricao: 'RG do procurador',
    });
    await variavelRepository.save({
        ID: 85,
        tag: 'RG_EMISSOR_PROCURADOR',
        descricao: 'Emissor do RG do procurador',
    });
    await variavelRepository.save({
        ID: 86,
        tag: 'TELEFONE_PROCURADOR',
        descricao: 'Telefone do procurador',
    });
    await variavelRepository.save({
        ID: 87,
        tag: 'ANO_CALENDARIO',
        descricao: 'Ano calendário',
    });
    await variavelRepository.save({
        ID: 88,
        tag: 'ANO_EXERCICIO',
        descricao: 'Ano exercício das informações',
    });
    await variavelRepository.save({
        ID: 89,
        tag: 'DATA_ANTERIOR',
        descricao: 'Data anterior ao exercício das informações',
    });
    await variavelRepository.save({
        ID: 90,
        tag: 'DATA_ATUAL',
        descricao: 'Data atual do exercício das informações',
    });
    await variavelRepository.save({
        ID: 91,
        tag: 'TRIBUTACAO_EXCLUSIVA',
        descricao: 'Tabela 4 de rendimentos com tributação exclusiva',
    });
    await variavelRepository.save({
        ID: 92,
        tag: 'INFORMACOES_COMPL',
        descricao: 'Tabela 5 de informações complementares',
    });
    await variavelRepository.save({
        ID: 93,
        tag: 'DATA_INFO_EXTENSO',
        descricao: 'Data informada DD, mmmm de AAAA',
    });
};
