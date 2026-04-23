import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegexFactory } from '../common/regex/regex-factory';
import {
  REGEX_EMAIL_PROTOCOL,
  REGEX_PASSWORD_PROTOCOL,
} from '../common/app.constant';
import { HashingService } from '../common/hashing/hashing.service';
import { CryptService } from '../common/hashing/crypt.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '../auth/config/jwt.config';
import { User } from '../db/entities/user.entity';
import { PasswordHistory } from '../db/entities/password_history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PasswordHistory]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [UserController],
  providers: [
    UserService,
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
export class UserModule {}
