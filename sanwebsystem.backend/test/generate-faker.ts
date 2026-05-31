import { HashingService } from '@/src/common/hashing/hashing.service';
import { HistoricoSenha } from '@/src/db/entities/historico_senha.entity';
import { Usuario } from '@/src/db/entities/usuario.entity';
import { UsuarioModule } from '@/src/usuario/usuario.module';
import { SnowflakeId } from '@akashrajpurohit/snowflake-id';
import { AppConfig, AppConfigType } from '@common/app.config';
import { Faker, pt_BR } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App } from 'supertest/types';
import { Repository } from 'typeorm';
import { createUsuario } from './create-usuario.faker';

export const getApp = async (): Promise<INestApplication<App>> => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
            TypeOrmModule.forRootAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => {
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                    const { database } = new AppConfig(
                        configService,
                    ).getParams() as AppConfigType;

                    return {
                        type: 'mysql',
                        host: database.host,
                        port: database.port,
                        username: database.username,
                        password: database.password,
                        database: database.name,
                        autoLoadEntities: database.autoLoadEntities,
                        synchronize: database.synchronize,
                    };
                },
            }),
            UsuarioModule,
        ],
    }).compile();

    return moduleFixture.createNestApplication();
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
    const faker = new Faker({
        locale: [pt_BR],
    });

    const app = await getApp();
    await app.init();

    const usuarioRepository = app.get(Repository<Usuario>);
    const historicoSenhaRepository = app.get(Repository<HistoricoSenha>);
    const hashingService = app.get(HashingService);

    for (let i: number = 0; i < 20; i++) {
        const usuario = await usuarioRepository.save(
            await createUsuario(faker, hashingService),
        );

        await historicoSenhaRepository.save({
            id: Number(SnowflakeId().generate()),
            usuarioId: usuario.id,
            dataSenha: usuario.dataSenha,
            senha: usuario.senha,
            salt: usuario.salt,
            usuario: Promise.resolve(usuario),
        } as HistoricoSenha);
    }

    await app.close();
})();
