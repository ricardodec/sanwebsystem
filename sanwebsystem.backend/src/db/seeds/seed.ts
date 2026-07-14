import { SnowflakeId } from '@akashrajpurohit/snowflake-id';
import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { MysqlConnectionCredentialsOptions } from 'typeorm/driver/mysql/MysqlConnectionCredentialsOptions.js';
import { AppConfig } from '../../common/app.config';
import { AcaoEnum, getNomeAcaoEnum } from '../../common/enums/acao-enum';
import { getNomeModuloEnum, ModuloEnum } from '../../common/enums/modulo-enum';
import { HashingService } from '../../common/hashing/hashing.service';
import { Acao } from '../entities/acao.entity';
import { Ambiente } from '../entities/ambiente.entity';
import { Configuracao, TipoAuthRole } from '../entities/configuracao.entity';
import { Modulo } from '../entities/modulo.entity';
import { Parametro } from '../entities/parametro.entity';
import { TenantConnectionManager } from '../tenant-connection-manager';
import { seedComponente } from './seed-componente';
import { seedFeriado } from './seed-feriado';
import { seedGrupoAcesso } from './seed-grupo_acesso';
import { seedParceiro } from './seed-parceiro';
import { seedUsuario } from './seed-usuario';
import { seedVariavel } from './seed-variavel';
import { SeedModule } from './seed.module';

const seedMainDb = async (
    dataSource: DataSource,
    hashingService: HashingService,
): Promise<void> => {
    const ambienteRepository = dataSource.getRepository(Ambiente);

    const ambiente = await ambienteRepository.save({
        ID: 1,
        descricao: 'Web',
        dataBase: new Date(),
        ativo: true,
    } as Ambiente);

    await ambienteRepository.save({
        ID: 2,
        descricao: 'App',
        dataBase: new Date(),
        ativo: false,
    } as Ambiente);

    const parametroRepository = dataSource.getRepository(Parametro);

    await parametroRepository.save({
        ID: Number(SnowflakeId().generate()),
        cicloSenha: 90,
        numRepeticaoSenha: 10,
        minTamanhoSenha: 10,
        caracterMinusculo: true,
        caracterMaiusculo: true,
        caracterEspecial: true,
        caracterNumerico: true,
        linhasPorPagina: 10,
    } as Parametro);

    const configuracaoRepository = dataSource.getRepository(Configuracao);
    const { email } = AppConfig.getConstants();
    const hash = await hashingService.hash(email.password ?? 'Nwjubb=3vi');

    await configuracaoRepository.save({
        ID: Number(SnowflakeId().generate()),
        emailRemetente: email.username ?? 'ricardo.castro@sanwebsystem.com.br',
        nomeRemetente: 'SAN WebSystem',
        servidorSmtp: email.host ?? 'email-ssl.com.br',
        portaSmtp: email.port ?? 465,
        tipoOAuth: TipoAuthRole.BASIC,
        oauth: false,
        senha: hash.passwordHashed,
    } as Configuracao);

    const acaoRepository = dataSource.getRepository(Acao);

    for (const [key, value] of Object.entries(AcaoEnum)) {
        if (typeof value === 'string')
            await acaoRepository.save({
                ID: Number(key),
                nome: getNomeAcaoEnum(AcaoEnum[value]),
            } as Acao);
    }

    const moduloRepository = dataSource.getRepository(Modulo);

    for (const [key, value] of Object.entries(ModuloEnum)) {
        if (typeof value === 'string')
            await moduloRepository.save({
                ID: Number(key),
                nome: getNomeModuloEnum(ModuloEnum[value]),
                ativo: true,
            } as Modulo);
    }

    await seedUsuario(dataSource, hashingService);
    await seedComponente(dataSource, ambiente);
    await seedGrupoAcesso(dataSource, null);
    await seedParceiro(dataSource);
    await seedVariavel(dataSource);
    await seedFeriado(dataSource);
};

const seedTenantDb = async (
    seed: INestApplicationContext,
    databaseName: string,
): Promise<void> => {
    const options = {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: databaseName,
        autoLoadEntities: true,
        synchronize: true,
    } as MysqlConnectionCredentialsOptions;

    const connectionManager = seed.get(TenantConnectionManager);
    await connectionManager.getDataSource(options);
};

async function bootstrap() {
    const seed = await NestFactory.createApplicationContext(SeedModule);
    const dataSource = seed.get(DataSource);
    const hashingService = seed.get(HashingService);

    await seedMainDb(dataSource, hashingService);
    await seedTenantDb(seed, 'sanweb_db_0');

    console.log('Seeding complete!');
    await seed.close();
}

bootstrap()
    .catch((err) => {
        console.error('Failed to execute the seeding process:', err);
    })
    .finally(() => process.exit(1));
