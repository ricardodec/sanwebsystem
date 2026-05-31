import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import jwtConfig from '../auth/config/jwt.config';
import {
    REGEX_EMAIL_PROTOCOL,
    REGEX_PASSWORD_PROTOCOL,
} from '../common/app.constant';
import { CryptService } from '../common/hashing/crypt.service';
import { HashingService } from '../common/hashing/hashing.service';
import { RegexFactory } from '../common/regex/regex-factory';
import { HistoricoSenha } from '../db/entities/historico_senha.entity';
import { Usuario } from '../db/entities/usuario.entity';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Usuario, HistoricoSenha]),
        ConfigModule.forFeature(jwtConfig),
        JwtModule.registerAsync(jwtConfig.asProvider()),
    ],
    controllers: [UsuarioController],
    providers: [
        UsuarioService,
        {
            provide: HashingService,
            useClass: CryptService,
        },
        RegexFactory,
        {
            provide: REGEX_EMAIL_PROTOCOL,
            useFactory: () => RegexFactory.create(REGEX_EMAIL_PROTOCOL),
        },
        {
            provide: REGEX_PASSWORD_PROTOCOL,
            useFactory: () => RegexFactory.create(REGEX_PASSWORD_PROTOCOL),
        },
    ],
    exports: [HashingService],
})
export class UsuarioModule {}
