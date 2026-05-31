import { AppModule } from '@/src/app/app.module';
import { HashingService } from '@/src/common/hashing/hashing.service';
import { SnowflakeId } from '@akashrajpurohit/snowflake-id';
import { NestFactory } from '@nestjs/core';
import { DataSource, Repository } from 'typeorm';
import { Acao } from '../entities/acao.entity';
import { AcaoComponente } from '../entities/acao_componente.entity';
import { Ambiente } from '../entities/ambiente.entity';
import { Componente } from '../entities/componente.entity';
import { HistoricoSenha } from '../entities/historico_senha.entity';
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
    acaoId: number,
    repository: Repository<AcaoComponente>,
): Promise<void> => {
    await repository.save({
        componenteId: componente.id,
        acaoId: acaoId,
        componente: Promise.resolve(componente),
    } as AcaoComponente);
};

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const hashingService = app.get(HashingService);
    const dataSource = app.get(DataSource);
    const ambienteRepository = dataSource.getRepository(Ambiente);

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

    const usuarioRepository = dataSource.getRepository(Usuario);
    const historicoSenhaRepository = dataSource.getRepository(HistoricoSenha);

    let hash = await hashingService.hash('admin123');

    let usuario = await usuarioRepository.save({
        id: Number(SnowflakeId().generate()),
        login: 'sanweb_adm',
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

    hash = await hashingService.hash('admin123');

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

    enum AcaoEnum {
        CONSULTAR = 'Consultar',
        INSERIR = 'Incluir',
        ALTERAR = 'Editar',
        EXCLUIR = 'Excluir',
        EXECUTAR = 'Executar',
        CANCELAR = 'Cancelar',
        ENVIAR = 'Enviar',
        INSTRUIR = 'Instruir',
        CONFIRMAR = 'Confirmar',
        APROVAR = 'Aprovar',
        REPROVAR = 'Reprovar',
    }

    for (const [key, value] of Object.entries(AcaoEnum)) {
        await acaoRepository.save({
            id: Number(key),
            nome: value,
        } as Acao);
    }

    const componenteRepository = dataSource.getRepository(Componente);
    const acaoComponenteRepository = dataSource.getRepository(AcaoComponente);

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
        superior: Promise.resolve(superior),
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    for (let i = 1; i <= 4; i++) {
        await createAcaoComponente(componente, i, acaoComponenteRepository);
    }

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
        superior: Promise.resolve(superior),
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    for (let i = 1; i <= 4; i++) {
        await createAcaoComponente(componente, i, acaoComponenteRepository);
    }

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
        superior: Promise.resolve(superior),
        ambiente: Promise.resolve(ambiente),
    } as Componente);

    console.log('Seeding complete!');
    await app.close();
}
bootstrap();
