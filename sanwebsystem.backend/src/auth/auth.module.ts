import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashingService } from '../common/hashing/hashing.service';
import { CryptService } from '../common/hashing/crypt.service';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../db/entities/user.entity';
import { PasswordHistory } from '../db/entities/password_history.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User, PasswordHistory]),
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
