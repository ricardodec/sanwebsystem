import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptService } from '../common/hashing/crypt.service';
import { HashingService } from '../common/hashing/hashing.service';
import { HistoricoSenha } from '../db/entities/historico_senha.entity';
import { Usuario } from '../db/entities/usuario.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import jwtConfig from './config/jwt.config';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Usuario, HistoricoSenha]),
        ConfigModule.forFeature(jwtConfig),
        JwtModule.registerAsync(jwtConfig.asProvider()),
    ],
    controllers: [AuthController],
    providers: [
        {
            provide: HashingService,
            useClass: CryptService,
        },
        AuthService,
    ],
    exports: [HashingService, JwtModule, ConfigModule],
})
export class AuthModule {}
