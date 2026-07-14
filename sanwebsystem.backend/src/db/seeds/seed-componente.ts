import { SnowflakeId } from '@akashrajpurohit/snowflake-id';
import { DataSource, Repository } from 'typeorm';
import { AcaoEnum } from '../../common/enums/acao-enum';
import { ModuloEnum } from '../../common/enums/modulo-enum';
import { AcaoComponente } from '../entities/acao_componente.entity';
import { Ambiente } from '../entities/ambiente.entity';
import { Componente } from '../entities/componente.entity';
import { ModuloComponente } from '../entities/modulo_componente.entity';

const createComponente = async (
    componenteRepository: Repository<Componente>,
    componente: Componente,
    acaoRepository?: Repository<AcaoComponente>,
    acoes?: AcaoEnum[],
    moduloComponenteRepository?: Repository<ModuloComponente>,
    modulos?: ModuloEnum[],
): Promise<Componente> => {
    componente = await componenteRepository.save(componente);

    if (acaoRepository && acoes) {
        for (const acao of acoes) {
            await acaoRepository.save({
                componente_ID: componente.ID,
                acao_ID: acao,
                componente: Promise.resolve(componente),
            } as AcaoComponente);
        }
    }

    if (moduloComponenteRepository && modulos) {
        for (const modulo of modulos) {
            await moduloComponenteRepository.save({
                ID: Number(SnowflakeId().generate()),
                modulo_ID: modulo,
                componente_ID: componente.ID,
                ativo: true,
            } as ModuloComponente);
        }
    }

    return componente;
};

export const seedComponente = async (
    dataSource: DataSource,
    ambiente: Ambiente,
): Promise<void> => {
    const componenteRepository = dataSource.getRepository(Componente);
    const acaoComponenteRepository = dataSource.getRepository(AcaoComponente);
    const moduloComponenteRepository =
        dataSource.getRepository(ModuloComponente);

    let superior = await createComponente(componenteRepository, {
        ID: Number(SnowflakeId().generate()),
        superior_ID: null,
        ambiente_ID: Number(ambiente.ID),
        nome: 'Controle de Acesso',
        icon: null,
        action_action_to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: true,
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await createComponente(
        componenteRepository,
        {
            ID: Number(SnowflakeId().generate()),
            superior_ID: Number(superior.ID),
            ambiente_ID: Number(ambiente.ID),
            nome: 'Usuários',
            icon: 'pi pi-fw pi-users',
            action_action_to: '/usuario2',
            url: null,
            target: null,
            menu: true,
            ativo: true,
            geral: true,
            superior: Promise.resolve(superior),
            ambiente: Promise.resolve(ambiente),
        } as Componente,
        acaoComponenteRepository,
        [
            AcaoEnum.CONSULTAR,
            AcaoEnum.INSERIR,
            AcaoEnum.ALTERAR,
            AcaoEnum.EXCLUIR,
        ],
    );

    await createComponente(
        componenteRepository,
        {
            ID: Number(SnowflakeId().generate()),
            superior_ID: Number(superior.ID),
            ambiente_ID: Number(ambiente.ID),
            nome: 'Grupos de Acesso',
            icon: 'pi pi-fw pi-tags',
            action_to: '/grupoacesso2',
            url: null,
            target: null,
            menu: true,
            ativo: true,
            geral: true,
            superior: Promise.resolve(superior),
            ambiente: Promise.resolve(ambiente),
        } as Componente,
        acaoComponenteRepository,
        [
            AcaoEnum.CONSULTAR,
            AcaoEnum.INSERIR,
            AcaoEnum.ALTERAR,
            AcaoEnum.EXCLUIR,
        ],
    );

    superior = await componenteRepository.save({
        ID: Number(SnowflakeId().generate()),
        superior_ID: null,
        ambiente_ID: Number(ambiente.ID),
        nome: 'Cadastros',
        icon: null,
        action_to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: true,
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await createComponente(
        componenteRepository,
        {
            ID: Number(SnowflakeId().generate()),
            superior_ID: Number(superior.ID),
            ambiente_ID: Number(ambiente.ID),
            nome: 'Parceiros',
            icon: null,
            action_to: null,
            url: null,
            target: null,
            menu: true,
            ativo: true,
            geral: true,
            superior: Promise.resolve(superior),
            ambiente: Promise.resolve(ambiente),
        } as Componente,
        acaoComponenteRepository,
        [
            AcaoEnum.CONSULTAR,
            AcaoEnum.INSERIR,
            AcaoEnum.ALTERAR,
            AcaoEnum.EXCLUIR,
        ],
    );

    await createComponente(
        componenteRepository,
        {
            ID: Number(SnowflakeId().generate()),
            superior_ID: Number(superior.ID),
            ambiente_ID: Number(ambiente.ID),
            nome: 'Clientes',
            icon: null,
            action_to: null,
            url: null,
            target: null,
            menu: true,
            ativo: true,
            geral: true,
            superior: Promise.resolve(superior),
            ambiente: Promise.resolve(ambiente),
        } as Componente,
        acaoComponenteRepository,
        [
            AcaoEnum.CONSULTAR,
            AcaoEnum.INSERIR,
            AcaoEnum.ALTERAR,
            AcaoEnum.EXCLUIR,
        ],
    );

    await createComponente(
        componenteRepository,
        {
            ID: Number(SnowflakeId().generate()),
            superior_ID: Number(superior.ID),
            ambiente_ID: Number(ambiente.ID),
            nome: 'Fornecedores',
            icon: null,
            action_to: null,
            url: null,
            target: null,
            menu: true,
            ativo: true,
            geral: true,
            superior: Promise.resolve(superior),
            ambiente: Promise.resolve(ambiente),
        } as Componente,
        acaoComponenteRepository,
        [
            AcaoEnum.CONSULTAR,
            AcaoEnum.INSERIR,
            AcaoEnum.ALTERAR,
            AcaoEnum.EXCLUIR,
        ],
    );

    await createComponente(
        componenteRepository,
        {
            ID: Number(SnowflakeId().generate()),
            superior_ID: Number(superior.ID),
            ambiente_ID: Number(ambiente.ID),
            nome: 'Grupos Econômicos',
            icon: null,
            action_to: null,
            url: null,
            target: null,
            menu: true,
            ativo: true,
            geral: true,
            superior: Promise.resolve(superior),
            ambiente: Promise.resolve(ambiente),
        } as Componente,
        acaoComponenteRepository,
        [
            AcaoEnum.CONSULTAR,
            AcaoEnum.INSERIR,
            AcaoEnum.ALTERAR,
            AcaoEnum.EXCLUIR,
        ],
    );

    superior = await componenteRepository.save({
        ID: Number(SnowflakeId().generate()),
        superior_ID: null,
        ambiente_ID: Number(ambiente.ID),
        nome: 'Controles',
        icon: null,
        action_to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: true,
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await createComponente(
        componenteRepository,
        {
            ID: Number(SnowflakeId().generate()),
            superior_ID: Number(superior.ID),
            ambiente_ID: Number(ambiente.ID),
            nome: 'Parâmetros',
            icon: null,
            action_to: null,
            url: null,
            target: null,
            menu: true,
            ativo: true,
            geral: true,
            superior: Promise.resolve(superior),
            ambiente: Promise.resolve(ambiente),
        } as Componente,
        acaoComponenteRepository,
        [AcaoEnum.CONSULTAR, AcaoEnum.ALTERAR],
    );

    await createComponente(
        componenteRepository,
        {
            ID: Number(SnowflakeId().generate()),
            superior_ID: Number(superior.ID),
            ambiente_ID: Number(ambiente.ID),
            nome: 'Feriados',
            icon: null,
            action_to: null,
            url: null,
            target: null,
            menu: true,
            ativo: true,
            geral: true,
            superior: Promise.resolve(superior),
            ambiente: Promise.resolve(ambiente),
        } as Componente,
        acaoComponenteRepository,
        [
            AcaoEnum.CONSULTAR,
            AcaoEnum.INSERIR,
            AcaoEnum.ALTERAR,
            AcaoEnum.EXCLUIR,
        ],
    );

    await createComponente(
        componenteRepository,
        {
            ID: Number(SnowflakeId().generate()),
            superior_ID: Number(superior.ID),
            ambiente_ID: Number(ambiente.ID),
            nome: 'Documentos Padronizados',
            icon: null,
            action_to: null,
            url: null,
            target: null,
            menu: true,
            ativo: true,
            geral: true,
            superior: Promise.resolve(superior),
            ambiente: Promise.resolve(ambiente),
        } as Componente,
        acaoComponenteRepository,
        [
            AcaoEnum.CONSULTAR,
            AcaoEnum.INSERIR,
            AcaoEnum.ALTERAR,
            AcaoEnum.EXCLUIR,
        ],
    );

    await createComponente(
        componenteRepository,
        {
            ID: Number(SnowflakeId().generate()),
            superior_ID: Number(superior.ID),
            ambiente_ID: Number(ambiente.ID),
            nome: 'Bancos e Agências',
            icon: null,
            action_to: null,
            url: null,
            target: null,
            menu: true,
            ativo: true,
            geral: true,
            superior: Promise.resolve(superior),
            ambiente: Promise.resolve(ambiente),
        } as Componente,
        acaoComponenteRepository,
        [
            AcaoEnum.CONSULTAR,
            AcaoEnum.INSERIR,
            AcaoEnum.ALTERAR,
            AcaoEnum.EXCLUIR,
        ],
    );

    await createComponente(
        componenteRepository,
        {
            ID: Number(SnowflakeId().generate()),
            superior_ID: Number(superior.ID),
            ambiente_ID: Number(ambiente.ID),
            nome: 'Indicadores Econômicos e Financeiros',
            icon: null,
            action_to: null,
            url: null,
            target: null,
            menu: true,
            ativo: true,
            geral: false,
            superior: Promise.resolve(superior),
            ambiente: Promise.resolve(ambiente),
        } as Componente,
        acaoComponenteRepository,
        [
            AcaoEnum.CONSULTAR,
            AcaoEnum.INSERIR,
            AcaoEnum.ALTERAR,
            AcaoEnum.EXCLUIR,
        ],
        moduloComponenteRepository,
        [
            ModuloEnum.SECURITIZACAO_PASSIVO,
            ModuloEnum.FOMENTO_PASSIVO,
            ModuloEnum.FIDC_PASSIVO,
            ModuloEnum.CONTAS_A_PAGAR_E_RECEBER,
        ],
    );

    superior = await createComponente(
        componenteRepository,
        {
            ID: Number(SnowflakeId().generate()),
            superior_ID: null,
            ambiente_ID: Number(ambiente.ID),
            nome: 'Financeiro',
            icon: null,
            action_to: null,
            url: null,
            target: null,
            menu: true,
            ativo: true,
            geral: false,
            ambiente: Promise.resolve(ambiente),
        } as Componente,
        acaoComponenteRepository,
        [],
        moduloComponenteRepository,
        [ModuloEnum.CONTAS_A_PAGAR_E_RECEBER],
    );

    await createComponente(
        componenteRepository,
        {
            ID: Number(SnowflakeId().generate()),
            superior_ID: Number(superior.ID),
            ambiente_ID: Number(ambiente.ID),
            nome: 'Contas Bancárias',
            icon: null,
            action_to: null,
            url: null,
            target: null,
            menu: true,
            ativo: true,
            geral: false,
            superior: Promise.resolve(superior),
            ambiente: Promise.resolve(ambiente),
        } as Componente,
        acaoComponenteRepository,
        [
            AcaoEnum.CONSULTAR,
            AcaoEnum.INSERIR,
            AcaoEnum.ALTERAR,
            AcaoEnum.EXCLUIR,
        ],
        moduloComponenteRepository,
        [ModuloEnum.CONTAS_A_PAGAR_E_RECEBER],
    );

    await createComponente(
        componenteRepository,
        {
            ID: Number(SnowflakeId().generate()),
            superior_ID: Number(superior.ID),
            ambiente_ID: Number(ambiente.ID),
            nome: 'Plano de Contas',
            icon: null,
            action_to: null,
            url: null,
            target: null,
            menu: true,
            ativo: true,
            geral: false,
            superior: Promise.resolve(superior),
            ambiente: Promise.resolve(ambiente),
        } as Componente,
        acaoComponenteRepository,
        [
            AcaoEnum.CONSULTAR,
            AcaoEnum.INSERIR,
            AcaoEnum.ALTERAR,
            AcaoEnum.EXCLUIR,
        ],
        moduloComponenteRepository,
        [ModuloEnum.CONTAS_A_PAGAR_E_RECEBER],
    );

    await createComponente(
        componenteRepository,
        {
            ID: Number(SnowflakeId().generate()),
            superior_ID: Number(superior.ID),
            ambiente_ID: Number(ambiente.ID),
            nome: 'Contas a Pagar',
            icon: null,
            action_to: null,
            url: null,
            target: null,
            menu: true,
            ativo: true,
            geral: false,
            superior: Promise.resolve(superior),
            ambiente: Promise.resolve(ambiente),
        } as Componente,
        acaoComponenteRepository,
        [
            AcaoEnum.CONSULTAR,
            AcaoEnum.INSERIR,
            AcaoEnum.ALTERAR,
            AcaoEnum.EXCLUIR,
        ],
        moduloComponenteRepository,
        [ModuloEnum.CONTAS_A_PAGAR_E_RECEBER],
    );

    await createComponente(
        componenteRepository,
        {
            ID: Number(SnowflakeId().generate()),
            superior_ID: Number(superior.ID),
            ambiente_ID: Number(ambiente.ID),
            nome: 'Contas a Receber',
            icon: null,
            action_to: null,
            url: null,
            target: null,
            menu: true,
            ativo: true,
            geral: false,
            superior: Promise.resolve(superior),
            ambiente: Promise.resolve(ambiente),
        } as Componente,
        acaoComponenteRepository,
        [
            AcaoEnum.CONSULTAR,
            AcaoEnum.INSERIR,
            AcaoEnum.ALTERAR,
            AcaoEnum.EXCLUIR,
        ],
        moduloComponenteRepository,
        [ModuloEnum.CONTAS_A_PAGAR_E_RECEBER],
    );

    await createComponente(
        componenteRepository,
        {
            ID: Number(SnowflakeId().generate()),
            superior_ID: Number(superior.ID),
            ambiente_ID: Number(ambiente.ID),
            nome: 'Lançamentos',
            icon: null,
            action_to: null,
            url: null,
            target: null,
            menu: true,
            ativo: true,
            geral: false,
            superior: Promise.resolve(superior),
            ambiente: Promise.resolve(ambiente),
        } as Componente,
        acaoComponenteRepository,
        [
            AcaoEnum.CONSULTAR,
            AcaoEnum.INSERIR,
            AcaoEnum.ALTERAR,
            AcaoEnum.EXCLUIR,
        ],
        moduloComponenteRepository,
        [ModuloEnum.CONTAS_A_PAGAR_E_RECEBER],
    );

    superior = await createComponente(
        componenteRepository,
        {
            ID: Number(SnowflakeId().generate()),
            superior_ID: null,
            ambiente_ID: Number(ambiente.ID),
            nome: 'Debêntures',
            icon: null,
            action_to: null,
            url: null,
            target: null,
            menu: true,
            ativo: true,
            geral: false,
            ambiente: Promise.resolve(ambiente),
        } as Componente,
        acaoComponenteRepository,
        [],
        moduloComponenteRepository,
        [
            ModuloEnum.SECURITIZACAO_PASSIVO,
            ModuloEnum.FOMENTO_PASSIVO,
            ModuloEnum.FIDC_PASSIVO,
        ],
    );

    await createComponente(
        componenteRepository,
        {
            ID: Number(SnowflakeId().generate()),
            superior_ID: Number(superior.ID),
            ambiente_ID: Number(ambiente.ID),
            nome: 'Emissão',
            icon: null,
            action_to: null,
            url: null,
            target: null,
            menu: true,
            ativo: true,
            geral: false,
            superior: Promise.resolve(superior),
            ambiente: Promise.resolve(ambiente),
        } as Componente,
        acaoComponenteRepository,
        [
            AcaoEnum.CONSULTAR,
            AcaoEnum.INSERIR,
            AcaoEnum.ALTERAR,
            AcaoEnum.EXCLUIR,
        ],
        moduloComponenteRepository,
        [
            ModuloEnum.SECURITIZACAO_PASSIVO,
            ModuloEnum.FOMENTO_PASSIVO,
            ModuloEnum.FIDC_PASSIVO,
        ],
    );

    await createComponente(
        componenteRepository,
        {
            ID: Number(SnowflakeId().generate()),
            superior_ID: Number(superior.ID),
            ambiente_ID: Number(ambiente.ID),
            nome: 'Subscrição',
            icon: null,
            action_to: null,
            url: null,
            target: null,
            menu: true,
            ativo: true,
            geral: false,
            superior: Promise.resolve(superior),
            ambiente: Promise.resolve(ambiente),
        } as Componente,
        acaoComponenteRepository,
        [
            AcaoEnum.CONSULTAR,
            AcaoEnum.INSERIR,
            AcaoEnum.ALTERAR,
            AcaoEnum.EXCLUIR,
        ],
        moduloComponenteRepository,
        [
            ModuloEnum.SECURITIZACAO_PASSIVO,
            ModuloEnum.FOMENTO_PASSIVO,
            ModuloEnum.FIDC_PASSIVO,
        ],
    );

    await createComponente(
        componenteRepository,
        {
            ID: Number(SnowflakeId().generate()),
            superior_ID: Number(superior.ID),
            ambiente_ID: Number(ambiente.ID),
            nome: 'Resgate',
            icon: null,
            action_to: null,
            url: null,
            target: null,
            menu: true,
            ativo: true,
            geral: false,
            superior: Promise.resolve(superior),
            ambiente: Promise.resolve(ambiente),
        } as Componente,
        acaoComponenteRepository,
        [
            AcaoEnum.CONSULTAR,
            AcaoEnum.INSERIR,
            AcaoEnum.ALTERAR,
            AcaoEnum.EXCLUIR,
        ],
        moduloComponenteRepository,
        [
            ModuloEnum.SECURITIZACAO_PASSIVO,
            ModuloEnum.FOMENTO_PASSIVO,
            ModuloEnum.FIDC_PASSIVO,
        ],
    );

    await createComponente(
        componenteRepository,
        {
            ID: Number(SnowflakeId().generate()),
            superior_ID: Number(superior.ID),
            ambiente_ID: Number(ambiente.ID),
            nome: 'Provisionamento de Resgates',
            icon: null,
            action_to: null,
            url: null,
            target: null,
            menu: true,
            ativo: true,
            geral: false,
            superior: Promise.resolve(superior),
            ambiente: Promise.resolve(ambiente),
        } as Componente,
        acaoComponenteRepository,
        [
            AcaoEnum.CONSULTAR,
            AcaoEnum.INSERIR,
            AcaoEnum.ALTERAR,
            AcaoEnum.EXCLUIR,
            AcaoEnum.APROVAR,
            AcaoEnum.REPROVAR,
        ],
        moduloComponenteRepository,
        [
            ModuloEnum.SECURITIZACAO_PASSIVO,
            ModuloEnum.FOMENTO_PASSIVO,
            ModuloEnum.FIDC_PASSIVO,
        ],
    );

    await createComponente(
        componenteRepository,
        {
            ID: Number(SnowflakeId().generate()),
            superior_ID: Number(superior.ID),
            ambiente_ID: Number(ambiente.ID),
            nome: 'Informe de Rendimentos',
            icon: null,
            action_to: null,
            url: null,
            target: null,
            menu: true,
            ativo: true,
            geral: false,
            superior: Promise.resolve(superior),
            ambiente: Promise.resolve(ambiente),
        } as Componente,
        acaoComponenteRepository,
        [AcaoEnum.CONSULTAR, AcaoEnum.EXECUTAR],
        moduloComponenteRepository,
        [
            ModuloEnum.SECURITIZACAO_PASSIVO,
            ModuloEnum.FOMENTO_PASSIVO,
            ModuloEnum.FIDC_PASSIVO,
        ],
    );
};
