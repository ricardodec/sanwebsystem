import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'node:path';
import { AuthModule } from '../auth/auth.module';
import { AppConfig } from '../common/app.config';
import { AuthMiddleware } from '../common/middlewares/auth.middleware';
import { UsuarioModule } from '../usuario/usuario.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ThrottlerModule.forRoot([
            {
                ttl: 60000, // time to live em ms
                limit: 50, // máximo de requests durante o ttl
                blockDuration: 5000, // tempo de bloqueio
            },
        ]),
        ConfigModule,
        ConfigModule.forRoot({
            load: [() => AppConfig.getConstants()],
            validationSchema: AppConfig.getSchema(),
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const { database } = new AppConfig(configService).getParams();

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
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const { email } = new AppConfig(configService).getParams();

                return {
                    transport: {
                        host: email.host,
                        port: email.port,
                        secure: true, // upgrade later with STARTTLS
                        auth: {
                            user: email.username,
                            pass: email.password,
                        },
                    },
                    defaults: {
                        from: email.from,
                    },
                    template: {
                        dir: process.cwd() + '/templates/',
                        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
                        options: {
                            strict: true,
                        },
                    },
                };
            },
        }),
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, '..', '..', 'photos'),
            serveRoot: '/photos',
        }),
        AuthModule,
        UsuarioModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
    exports: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude({
                path: '/',
                method: RequestMethod.GET,
            })
            .exclude({
                // path: '/auth/*path',
                path: '/auth/login',
                method: RequestMethod.ALL,
            })
            .forRoutes({
                path: '*',
                method: RequestMethod.ALL,
            });
    }
}
