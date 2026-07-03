import { SnowflakeId } from '@akashrajpurohit/snowflake-id';
import { NestFactory } from '@nestjs/core';
import { DataSource, Repository } from 'typeorm';
import { AppModule } from '../../app/app.module';
import { AcaoEnum } from '../../common/enums/acao-enum';
import { HashingService } from '../../common/hashing/hashing.service';
import { Acao } from '../entities/acao.entity';
import { AcaoComponente } from '../entities/acao_componente.entity';
import { Ambiente } from '../entities/ambiente.entity';
import { Componente } from '../entities/componente.entity';
import { Configuracao, TipoAuthRole } from '../entities/configuracao.entity';
import { GrupoAcesso } from '../entities/grupo_acesso.entity';
import { HistoricoSenha } from '../entities/historico_senha.entity';
import { Modulo } from '../entities/modulo.entity';
import { ModuloComponente } from '../entities/modulo_componente.entity';
import { ModuloParceiro } from '../entities/modulo_parceiro.entity';
import { Parametro } from '../entities/parametro.entity';
import { OperacaoRole, Parceiro } from '../entities/parceiro.entity';
import { TipoPessoaRole } from '../entities/partner/pessoa.entity';
import { TfaTypeRole, Usuario } from '../entities/usuario.entity';

const createHistoricoSenha = async (
    usuario: Usuario,
    repository: Repository<HistoricoSenha>,
): Promise<void> => {
    await repository.save({
        id: Number(SnowflakeId().generate()),
        usuarioId: usuario.id,
        dataSenha: usuario.dataSenha,
        senha: usuario.senha,
        salt: usuario.salt,
        usuario: Promise.resolve(usuario),
    } as HistoricoSenha);
};

const createAcaoComponente = async (
    componente: Componente,
    acao: AcaoEnum,
    repository: Repository<AcaoComponente>,
): Promise<void> => {
    await repository.save({
        componenteId: componente.id,
        acaoId: AcaoEnum[acao],
        componente: Promise.resolve(componente),
    } as AcaoComponente);
};

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const hashingService = app.get(HashingService);
    const dataSource = app.get(DataSource);
    const ambienteRepository = dataSource.getRepository(Ambiente);
    const parametroRepository = dataSource.getRepository(Parametro);
    const configuracaoRepository = dataSource.getRepository(Configuracao);

    const ambiente = await ambienteRepository.save({
        id: Number(SnowflakeId().generate()),
        descricao: 'Web',
        dataBase: new Date(),
        ativo: true,
    } as Ambiente);

    await ambienteRepository.save({
        id: Number(SnowflakeId().generate()),
        descricao: 'App',
        dataBase: new Date(),
        ativo: false,
    } as Ambiente);

    await parametroRepository.save({
        id: Number(SnowflakeId().generate()),
        cicloSenha: 90,
        numRepeticaoSenha: 10,
        minTamanhoSenha: 10,
        caracterMinusculo: true,
        caracterMaiusculo: true,
        caracterEspecial: true,
        caracterNumerico: true,
        linhasPorPagina: 10,
    } as Parametro);

    await configuracaoRepository.save({
        id: Number(SnowflakeId().generate()),
        emailRemetente: 'ricardo.castro@sanwebsystem.com.br',
        nomeRemetente: 'SAN WebSystem',
        servidorSmtp: 'email-ssl.com.br',
        portaSmtp: 465,
        tipoOAuth: TipoAuthRole.BASIC,
        oauth: false,
        senha: 'DGLy009q/TfTryQkK/Yfow==',
    } as Configuracao);

    const usuarioRepository = dataSource.getRepository(Usuario);
    const historicoSenhaRepository = dataSource.getRepository(HistoricoSenha);

    let hash = await hashingService.hash('admin123');

    let usuario = await usuarioRepository.save({
        id: Number(SnowflakeId().generate()),
        login: 'admin',
        dataSenha: new Date(),
        senha: hash.passwordHashed,
        salt: hash.salt,
        nome: 'Administrador',
        email: 'ricardodec@gmail.com',
        trocarSenha: false,
        ehControlador: true,
        tfa: false,
        tfaTipo: TfaTypeRole.NAO_APLICADO,
        tfaKey: null,
        tfaKeyDataHora: null,
        tfaEntryKey: null,
        tfaQrcodeImageUrl: null,
        ativo: true,
        foto: null,
        fotoMimetype: null,
    } as Usuario);

    await createHistoricoSenha(usuario, historicoSenhaRepository);

    hash = await hashingService.hash('user123');

    usuario = await usuarioRepository.save({
        id: Number(SnowflakeId().generate()),
        login: 'ricardodec',
        dataSenha: new Date(),
        senha: hash.passwordHashed,
        salt: hash.salt,
        nome: 'Ricardo de Castro',
        email: 'ricardodec@gmail.com',
        trocarSenha: false,
        ehControlador: false,
        tfa: false,
        tfaTipo: TfaTypeRole.NAO_APLICADO,
        tfaKey: null,
        tfaKeyDataHora: null,
        tfaEntryKey: null,
        tfaQrcodeImageUrl: null,
        ativo: true,
        foto: null,
        fotoMimetype: null,
    } as Usuario);

    await createHistoricoSenha(usuario, historicoSenhaRepository);

    const acaoRepository = dataSource.getRepository(Acao);

    for (const [key, value] of Object.entries(AcaoEnum)) {
        await acaoRepository.save({
            id: Number(key),
            nome: value,
        } as Acao);
    }

    enum ModuloEnum {
        SECURITIZACAO_ATIVO = 0,
        SECURITIZACAO_PASSIVO = 1,
        FOMENTO_ATIVO = 2,
        FOMENTO_PASSIVO = 3,
        FIDC_ATIVO = 4,
        FIDC_PASSIVO = 5,
        CONTAS_A_PAGAR_E_RECEBER = 6,
        AVALIACAO_PSICOLOGICA = 7,
    }

    const moduloLista: number[] = [];

    for (let i: number = 0; i < 8; i++) {
        moduloLista.push(Number(SnowflakeId().generate()));
    }

    const moduloRepository = dataSource.getRepository(Modulo);

    await moduloRepository.save({
        id: moduloLista[ModuloEnum.SECURITIZACAO_ATIVO],
        nome: 'Securitização (Ativo)',
        ativo: true,
    } as Modulo);

    await moduloRepository.save({
        id: moduloLista[ModuloEnum.SECURITIZACAO_PASSIVO],
        nome: 'Securitização (Passivo)',
        ativo: true,
    } as Modulo);

    await moduloRepository.save({
        id: moduloLista[ModuloEnum.FOMENTO_ATIVO],
        nome: 'Fomento (Ativo)',
        ativo: true,
    } as Modulo);

    await moduloRepository.save({
        id: moduloLista[ModuloEnum.FOMENTO_PASSIVO],
        nome: 'Fomento (Passivo)',
        ativo: true,
    } as Modulo);

    await moduloRepository.save({
        id: moduloLista[ModuloEnum.FIDC_ATIVO],
        nome: 'FIDC (Ativo)',
        ativo: true,
    } as Modulo);

    await moduloRepository.save({
        id: moduloLista[ModuloEnum.FIDC_PASSIVO],
        nome: 'FIDC (Passivo)',
        ativo: true,
    } as Modulo);

    await moduloRepository.save({
        id: moduloLista[ModuloEnum.CONTAS_A_PAGAR_E_RECEBER],
        nome: 'Contas a Pagar e Receber',
        ativo: true,
    } as Modulo);

    await moduloRepository.save({
        id: moduloLista[ModuloEnum.AVALIACAO_PSICOLOGICA],
        nome: 'Avaliação Psicológica',
        ativo: true,
    } as Modulo);

    const componenteRepository = dataSource.getRepository(Componente);
    const acaoComponenteRepository = dataSource.getRepository(AcaoComponente);
    const moduloComponenteRepository =
        dataSource.getRepository(ModuloComponente);

    let superior = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: null,
        ambienteId: ambiente.id,
        nome: 'Controle de Acesso',
        icon: null,
        to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: true,
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    let componente = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: superior.id,
        ambienteId: ambiente.id,
        nome: 'Usuários',
        icon: 'pi pi-fw pi-users',
        to: '/usuario2',
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: true,
        superior: Promise.resolve(superior),
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await createAcaoComponente(
        componente,
        AcaoEnum.CONSULTAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.INSERIR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.ALTERAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.EXCLUIR,
        acaoComponenteRepository,
    );

    componente = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: superior.id,
        ambienteId: ambiente.id,
        nome: 'Grupos de Acesso',
        icon: 'pi pi-fw pi-tags',
        to: '/grupoacesso2',
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: true,
        superior: Promise.resolve(superior),
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await createAcaoComponente(
        componente,
        AcaoEnum.CONSULTAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.INSERIR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.ALTERAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.EXCLUIR,
        acaoComponenteRepository,
    );

    superior = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: null,
        ambienteId: ambiente.id,
        nome: 'Cadastros',
        icon: null,
        to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: true,
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    componente = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: superior.id,
        ambienteId: ambiente.id,
        nome: 'Parceiros',
        icon: null,
        to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: true,
        superior: Promise.resolve(superior),
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await createAcaoComponente(
        componente,
        AcaoEnum.CONSULTAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.INSERIR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.ALTERAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.EXCLUIR,
        acaoComponenteRepository,
    );

    componente = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: superior.id,
        ambienteId: ambiente.id,
        nome: 'Clientes',
        icon: null,
        to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: true,
        superior: Promise.resolve(superior),
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await createAcaoComponente(
        componente,
        AcaoEnum.CONSULTAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.INSERIR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.ALTERAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.EXCLUIR,
        acaoComponenteRepository,
    );

    componente = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: superior.id,
        ambienteId: ambiente.id,
        nome: 'Fornecedores',
        icon: null,
        to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: true,
        superior: Promise.resolve(superior),
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await createAcaoComponente(
        componente,
        AcaoEnum.CONSULTAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.INSERIR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.ALTERAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.EXCLUIR,
        acaoComponenteRepository,
    );

    componente = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: superior.id,
        ambienteId: ambiente.id,
        nome: 'Grupos Econômicos',
        icon: null,
        to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: true,
        superior: Promise.resolve(superior),
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await createAcaoComponente(
        componente,
        AcaoEnum.CONSULTAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.INSERIR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.ALTERAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.EXCLUIR,
        acaoComponenteRepository,
    );

    superior = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: null,
        ambienteId: ambiente.id,
        nome: 'Controles',
        icon: null,
        to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: true,
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    componente = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: superior.id,
        ambienteId: ambiente.id,
        nome: 'Parâmetros',
        icon: null,
        to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: true,
        superior: Promise.resolve(superior),
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await createAcaoComponente(
        componente,
        AcaoEnum.CONSULTAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.ALTERAR,
        acaoComponenteRepository,
    );

    componente = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: superior.id,
        ambienteId: ambiente.id,
        nome: 'Feriados',
        icon: null,
        to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: true,
        superior: Promise.resolve(superior),
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await createAcaoComponente(
        componente,
        AcaoEnum.CONSULTAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.INSERIR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.ALTERAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.EXCLUIR,
        acaoComponenteRepository,
    );

    componente = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: superior.id,
        ambienteId: ambiente.id,
        nome: 'Documentos Padronizados',
        icon: null,
        to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: true,
        superior: Promise.resolve(superior),
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await createAcaoComponente(
        componente,
        AcaoEnum.CONSULTAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.INSERIR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.ALTERAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.EXCLUIR,
        acaoComponenteRepository,
    );

    componente = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: superior.id,
        ambienteId: ambiente.id,
        nome: 'Bancos e Agências',
        icon: null,
        to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: true,
        superior: Promise.resolve(superior),
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await createAcaoComponente(
        componente,
        AcaoEnum.CONSULTAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.INSERIR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.ALTERAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.EXCLUIR,
        acaoComponenteRepository,
    );

    componente = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: superior.id,
        ambienteId: ambiente.id,
        nome: 'Indicadores Econômicos e Financeiros',
        icon: null,
        to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: false,
        superior: Promise.resolve(superior),
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await createAcaoComponente(
        componente,
        AcaoEnum.CONSULTAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.INSERIR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.ALTERAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.EXCLUIR,
        acaoComponenteRepository,
    );

    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.SECURITIZACAO_PASSIVO],
        componenteId: componente.id,
        ativo: true,
    });
    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.FOMENTO_PASSIVO],
        componenteId: componente.id,
        ativo: true,
    });
    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.FIDC_PASSIVO],
        componenteId: componente.id,
        ativo: true,
    });
    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.CONTAS_A_PAGAR_E_RECEBER],
        componenteId: componente.id,
        ativo: true,
    });

    superior = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: null,
        ambienteId: ambiente.id,
        nome: 'Financeiro',
        icon: null,
        to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: false,
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.CONTAS_A_PAGAR_E_RECEBER],
        componenteId: superior.id,
        ativo: true,
    });

    componente = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: superior.id,
        ambienteId: ambiente.id,
        nome: 'Contas Bancárias',
        icon: null,
        to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: false,
        superior: Promise.resolve(superior),
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await createAcaoComponente(
        componente,
        AcaoEnum.CONSULTAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.INSERIR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.ALTERAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.EXCLUIR,
        acaoComponenteRepository,
    );

    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.CONTAS_A_PAGAR_E_RECEBER],
        componenteId: componente.id,
        ativo: true,
    });

    componente = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: superior.id,
        ambienteId: ambiente.id,
        nome: 'Plano de Contas',
        icon: null,
        to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: false,
        superior: Promise.resolve(superior),
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await createAcaoComponente(
        componente,
        AcaoEnum.CONSULTAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.INSERIR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.ALTERAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.EXCLUIR,
        acaoComponenteRepository,
    );

    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.CONTAS_A_PAGAR_E_RECEBER],
        componenteId: componente.id,
        ativo: true,
    });

    componente = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: superior.id,
        ambienteId: ambiente.id,
        nome: 'Contas a Pagar',
        icon: null,
        to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: false,
        superior: Promise.resolve(superior),
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await createAcaoComponente(
        componente,
        AcaoEnum.CONSULTAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.INSERIR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.ALTERAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.EXCLUIR,
        acaoComponenteRepository,
    );

    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.CONTAS_A_PAGAR_E_RECEBER],
        componenteId: componente.id,
        ativo: true,
    });

    componente = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: superior.id,
        ambienteId: ambiente.id,
        nome: 'Contas a Receber',
        icon: null,
        to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: false,
        superior: Promise.resolve(superior),
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await createAcaoComponente(
        componente,
        AcaoEnum.CONSULTAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.INSERIR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.ALTERAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.EXCLUIR,
        acaoComponenteRepository,
    );

    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.CONTAS_A_PAGAR_E_RECEBER],
        componenteId: componente.id,
        ativo: true,
    });

    componente = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: superior.id,
        ambienteId: ambiente.id,
        nome: 'Lançamentos',
        icon: null,
        to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: false,
        superior: Promise.resolve(superior),
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await createAcaoComponente(
        componente,
        AcaoEnum.CONSULTAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.INSERIR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.ALTERAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.EXCLUIR,
        acaoComponenteRepository,
    );

    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.CONTAS_A_PAGAR_E_RECEBER],
        componenteId: componente.id,
        ativo: true,
    });

    superior = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: null,
        ambienteId: ambiente.id,
        nome: 'Debêntures',
        icon: null,
        to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: false,
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.SECURITIZACAO_PASSIVO],
        componenteId: superior.id,
        ativo: true,
    });
    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.FOMENTO_PASSIVO],
        componenteId: superior.id,
        ativo: true,
    });
    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.FIDC_PASSIVO],
        componenteId: superior.id,
        ativo: true,
    });

    componente = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: superior.id,
        ambienteId: ambiente.id,
        nome: 'Emissão',
        icon: null,
        to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: false,
        superior: Promise.resolve(superior),
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await createAcaoComponente(
        componente,
        AcaoEnum.CONSULTAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.INSERIR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.ALTERAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.EXCLUIR,
        acaoComponenteRepository,
    );

    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.SECURITIZACAO_PASSIVO],
        componenteId: componente.id,
        ativo: true,
    });
    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.FOMENTO_PASSIVO],
        componenteId: componente.id,
        ativo: true,
    });
    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.FIDC_PASSIVO],
        componenteId: componente.id,
        ativo: true,
    });

    componente = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: superior.id,
        ambienteId: ambiente.id,
        nome: 'Subscrição',
        icon: null,
        to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: false,
        superior: Promise.resolve(superior),
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await createAcaoComponente(
        componente,
        AcaoEnum.CONSULTAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.INSERIR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.ALTERAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.EXCLUIR,
        acaoComponenteRepository,
    );

    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.SECURITIZACAO_PASSIVO],
        componenteId: componente.id,
        ativo: true,
    });
    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.FOMENTO_PASSIVO],
        componenteId: componente.id,
        ativo: true,
    });
    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.FIDC_PASSIVO],
        componenteId: componente.id,
        ativo: true,
    });

    componente = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: superior.id,
        ambienteId: ambiente.id,
        nome: 'Resgate',
        icon: null,
        to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: false,
        superior: Promise.resolve(superior),
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await createAcaoComponente(
        componente,
        AcaoEnum.CONSULTAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.INSERIR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.ALTERAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.EXCLUIR,
        acaoComponenteRepository,
    );

    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.SECURITIZACAO_PASSIVO],
        componenteId: componente.id,
        ativo: true,
    });
    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.FOMENTO_PASSIVO],
        componenteId: componente.id,
        ativo: true,
    });
    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.FIDC_PASSIVO],
        componenteId: componente.id,
        ativo: true,
    });

    componente = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: superior.id,
        ambienteId: ambiente.id,
        nome: 'Provisionamento de Resgates',
        icon: null,
        to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: false,
        superior: Promise.resolve(superior),
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await createAcaoComponente(
        componente,
        AcaoEnum.CONSULTAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.INSERIR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.ALTERAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.EXCLUIR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.APROVAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.REPROVAR,
        acaoComponenteRepository,
    );

    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.SECURITIZACAO_PASSIVO],
        componenteId: componente.id,
        ativo: true,
    });
    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.FOMENTO_PASSIVO],
        componenteId: componente.id,
        ativo: true,
    });
    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.FIDC_PASSIVO],
        componenteId: componente.id,
        ativo: true,
    });

    componente = await componenteRepository.save({
        id: Number(SnowflakeId().generate()),
        superiorId: superior.id,
        ambienteId: ambiente.id,
        nome: 'Informe de Rendimentos',
        icon: null,
        to: null,
        url: null,
        target: null,
        menu: true,
        ativo: true,
        geral: false,
        superior: Promise.resolve(superior),
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    await createAcaoComponente(
        componente,
        AcaoEnum.CONSULTAR,
        acaoComponenteRepository,
    );
    await createAcaoComponente(
        componente,
        AcaoEnum.EXECUTAR,
        acaoComponenteRepository,
    );

    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.SECURITIZACAO_PASSIVO],
        componenteId: componente.id,
        ativo: true,
    });
    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.FOMENTO_PASSIVO],
        componenteId: componente.id,
        ativo: true,
    });
    await moduloComponenteRepository.save({
        id: Number(SnowflakeId().generate()),
        moduloId: moduloLista[ModuloEnum.FIDC_PASSIVO],
        componenteId: componente.id,
        ativo: true,
    });

    const grupoAcessoRepository = dataSource.getRepository(GrupoAcesso);

    await grupoAcessoRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: null,
        nome: 'Assistência Operacional',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: null,
        nome: 'Confirmação',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: null,
        nome: 'Crédito',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: null,
        nome: 'Diretoria Executiva',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: null,
        nome: 'Diretoria Operacional',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: null,
        nome: 'Financeiro',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: null,
        nome: 'Formalização',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: null,
        nome: 'Gerência Comercial',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: null,
        nome: 'Monitoramento',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: null,
        nome: 'Operações',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: null,
        nome: 'RH',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: null,
        nome: 'Superintendência Comercial',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: null,
        nome: 'Suporte Comercial',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: null,
        nome: 'TI',
        ativo: true,
    } as GrupoAcesso);

    const parceiroRepository = dataSource.getRepository(Parceiro);
    const moduloParceiroRepository = dataSource.getRepository(ModuloParceiro);

    let parceiro = await parceiroRepository.save({
        id: Number(SnowflakeId().generate()),
        tipoPessoa: TipoPessoaRole.EMPRESA,
        cnpjCpf: '13411535000105',
        nome: 'Original Partner Fomento Mercantil Ltda.',
        operacao: OperacaoRole.FACTORING,
        ativo: false,
    } as Parceiro);

    await moduloParceiroRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: parceiro.id,
        moduloId: moduloLista[ModuloEnum.FOMENTO_ATIVO],
        ativo: true,
    });
    await moduloParceiroRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: parceiro.id,
        moduloId: moduloLista[ModuloEnum.FOMENTO_PASSIVO],
        ativo: true,
    });

    parceiro = await parceiroRepository.save({
        id: Number(SnowflakeId().generate()),
        tipoPessoa: TipoPessoaRole.EMPRESA,
        cnpjCpf: '28498867000138',
        nome: '2Get Partner Fomento Mercantil Ltda',
        operacao: OperacaoRole.FACTORING,
        ativo: false,
    } as Parceiro);

    await moduloParceiroRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: parceiro.id,
        moduloId: moduloLista[ModuloEnum.FOMENTO_ATIVO],
        ativo: true,
    });
    await moduloParceiroRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: parceiro.id,
        moduloId: moduloLista[ModuloEnum.FOMENTO_PASSIVO],
        ativo: true,
    });

    parceiro = await parceiroRepository.save({
        id: Number(SnowflakeId().generate()),
        tipoPessoa: TipoPessoaRole.EMPRESA,
        cnpjCpf: '27373527000118',
        nome: 'Ideal Partner Fomento Mercantil Ltda',
        operacao: OperacaoRole.FACTORING,
        ativo: false,
    } as Parceiro);

    await moduloParceiroRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: parceiro.id,
        moduloId: moduloLista[ModuloEnum.FOMENTO_ATIVO],
        ativo: true,
    });
    await moduloParceiroRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: parceiro.id,
        moduloId: moduloLista[ModuloEnum.FOMENTO_PASSIVO],
        ativo: true,
    });

    parceiro = await parceiroRepository.save({
        id: Number(SnowflakeId().generate()),
        tipoPessoa: TipoPessoaRole.EMPRESA,
        cnpjCpf: '29043135000116',
        nome: 'Exact Securitizadora S/A',
        operacao: OperacaoRole.SECURUTIZADORA,
        ativo: true,
    } as Parceiro);

    await moduloParceiroRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: parceiro.id,
        moduloId: moduloLista[ModuloEnum.SECURITIZACAO_ATIVO],
        ativo: true,
    });
    await moduloParceiroRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: parceiro.id,
        moduloId: moduloLista[ModuloEnum.SECURITIZACAO_PASSIVO],
        ativo: true,
    });

    parceiro = await parceiroRepository.save({
        id: Number(SnowflakeId().generate()),
        tipoPessoa: TipoPessoaRole.EMPRESA,
        cnpjCpf: '29294726000166',
        nome: 'Exactus VIII Partner Securitizadora S/A',
        operacao: OperacaoRole.SECURUTIZADORA,
        ativo: false,
    } as Parceiro);

    await moduloParceiroRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: parceiro.id,
        moduloId: moduloLista[ModuloEnum.SECURITIZACAO_ATIVO],
        ativo: true,
    });
    await moduloParceiroRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: parceiro.id,
        moduloId: moduloLista[ModuloEnum.SECURITIZACAO_PASSIVO],
        ativo: true,
    });

    parceiro = await parceiroRepository.save({
        id: Number(SnowflakeId().generate()),
        tipoPessoa: TipoPessoaRole.EMPRESA,
        cnpjCpf: '29799585000133',
        nome: 'Ideal Partner Securitizadora S/A',
        operacao: OperacaoRole.SECURUTIZADORA,
        ativo: false,
    } as Parceiro);

    await moduloParceiroRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: parceiro.id,
        moduloId: moduloLista[ModuloEnum.SECURITIZACAO_ATIVO],
        ativo: true,
    });
    await moduloParceiroRepository.save({
        id: Number(SnowflakeId().generate()),
        parceiroId: parceiro.id,
        moduloId: moduloLista[ModuloEnum.SECURITIZACAO_PASSIVO],
        ativo: true,
    });

    console.log('Seeding complete!');
    await app.close();
}
bootstrap();
