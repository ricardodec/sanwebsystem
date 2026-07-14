import { SnowflakeId } from '@akashrajpurohit/snowflake-id';
import { DataSource, Repository } from 'typeorm';
import { ModuloEnum } from '../../common/enums/modulo-enum';
import { ModuloParceiro } from '../entities/modulo_parceiro.entity';
import { OperacaoRole, Parceiro } from '../entities/parceiro.entity';
import { TipoPessoaRole } from '../entities/tenant/pessoa.entity';

const createParceiro = async (
    parceiroRepository: Repository<Parceiro>,
    parceiro: Parceiro,
    moduloParceiroRepository?: Repository<ModuloParceiro>,
    modulos?: ModuloEnum[],
): Promise<Parceiro> => {
    parceiro = await parceiroRepository.save(parceiro);

    if (moduloParceiroRepository && modulos) {
        for (const modulo of modulos) {
            await moduloParceiroRepository.save({
                ID: Number(SnowflakeId().generate()),
                parceiro_ID: parceiro.ID,
                modulo_ID: modulo,
                ativo: true,
            } as ModuloParceiro);
        }
    }

    return parceiro;
};

export const seedParceiro = async (dataSource: DataSource): Promise<void> => {
    const parceiroRepository = dataSource.getRepository(Parceiro);
    const moduloParceiroRepository = dataSource.getRepository(ModuloParceiro);

    await createParceiro(
        parceiroRepository,
        {
            ID: Number(SnowflakeId().generate()),
            tipoPessoa: TipoPessoaRole.EMPRESA,
            cnpjCpf: '13411535000105',
            nome: 'Original Partner Fomento Mercantil Ltda.',
            operacao: OperacaoRole.FACTORING,
            ativo: false,
        } as Parceiro,
        moduloParceiroRepository,
        [ModuloEnum.FOMENTO_ATIVO, ModuloEnum.FOMENTO_PASSIVO],
    );

    await createParceiro(
        parceiroRepository,
        {
            ID: Number(SnowflakeId().generate()),
            tipoPessoa: TipoPessoaRole.EMPRESA,
            cnpjCpf: '28498867000138',
            nome: '2Get Partner Fomento Mercantil Ltda',
            operacao: OperacaoRole.FACTORING,
            ativo: false,
        } as Parceiro,
        moduloParceiroRepository,
        [ModuloEnum.FOMENTO_ATIVO, ModuloEnum.FOMENTO_PASSIVO],
    );

    await createParceiro(
        parceiroRepository,
        {
            ID: Number(SnowflakeId().generate()),
            tipoPessoa: TipoPessoaRole.EMPRESA,
            cnpjCpf: '27373527000118',
            nome: 'Ideal Partner Fomento Mercantil Ltda',
            operacao: OperacaoRole.FACTORING,
            ativo: false,
        } as Parceiro,
        moduloParceiroRepository,
        [ModuloEnum.FOMENTO_ATIVO, ModuloEnum.FOMENTO_PASSIVO],
    );

    await createParceiro(
        parceiroRepository,
        {
            ID: Number(SnowflakeId().generate()),
            tipoPessoa: TipoPessoaRole.EMPRESA,
            cnpjCpf: '29043135000116',
            nome: 'Exact Securitizadora S/A',
            operacao: OperacaoRole.SECURUTIZADORA,
            ativo: true,
        } as Parceiro,
        moduloParceiroRepository,
        [ModuloEnum.SECURITIZACAO_ATIVO, ModuloEnum.SECURITIZACAO_PASSIVO],
    );

    await createParceiro(
        parceiroRepository,
        {
            ID: Number(SnowflakeId().generate()),
            tipoPessoa: TipoPessoaRole.EMPRESA,
            cnpjCpf: '29294726000166',
            nome: 'Exactus VIII Partner Securitizadora S/A',
            operacao: OperacaoRole.SECURUTIZADORA,
            ativo: false,
        } as Parceiro,
        moduloParceiroRepository,
        [ModuloEnum.SECURITIZACAO_ATIVO, ModuloEnum.SECURITIZACAO_PASSIVO],
    );

    await createParceiro(
        parceiroRepository,
        {
            ID: Number(SnowflakeId().generate()),
            tipoPessoa: TipoPessoaRole.EMPRESA,
            cnpjCpf: '29799585000133',
            nome: 'Ideal Partner Securitizadora S/A',
            operacao: OperacaoRole.SECURUTIZADORA,
            ativo: false,
        } as Parceiro,
        moduloParceiroRepository,
        [ModuloEnum.SECURITIZACAO_ATIVO, ModuloEnum.SECURITIZACAO_PASSIVO],
    );
};
