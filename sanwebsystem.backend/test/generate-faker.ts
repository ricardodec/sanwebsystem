import { faker } from '@faker-js/faker';
import { AppConfig, AppConfigType } from '@common/app.config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../src/auth/auth.module';
import { UserModule } from '../src/user/user.module';
import { UserService } from '../src/user/user.service';
import { UserDto } from '../src/user/dto/user.dto';
import { randomUUID } from 'crypto';

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
            type: 'postgres',
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
      AuthModule,
      UserModule,
    ],
  }).compile();

  return moduleFixture.createNestApplication();
};

const generateUsers = async (userService: UserService) => {
  for (let i: number = 0; i < 20; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const fullName = faker.person.fullName({
      firstName: firstName,
      lastName: lastName,
    });

    const email = faker.internet
      .email({
        firstName: firstName,
        lastName: lastName,
      })
      .toLowerCase();

    const login = faker.internet
      .username({
        firstName: firstName,
        lastName: lastName,
      })
      .toLowerCase();

    const userDto = {
      id: randomUUID(),
      login: login,
      password: '123456',
      name: fullName,
      email: email,
      active: true,
    } as UserDto;

    await userService.create(userDto);
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const app = await getApp();
  await app.init();

  const userService = app.get(UserService);
  await generateUsers(userService);

  await app.close();
})();
