/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { UserDto } from '@/src/user/dto/user.dto';
import { getApp } from './generate-faker';

export const getToken = async (app: INestApplication<App>) => {
  const response = await request(app.getHttpServer()).get('/auth/login').send({
    login: 'admin',
    password: '123456',
  });

  return (
    response.body as {
      token: string;
    }
  ).token;
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await getApp();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('/user (POST)', () => {
    it('deve criar um novo usuário', async () => {
      const userDto: UserDto = {
        login: 'teste2',
        password: 'E1vVtbYgP#',
        name: 'Teste2',
        email: 'teste2@example.com',
        active: true,
      };

      const response = await request(app.getHttpServer())
        .post('/user')
        .set('Authorization', `Bearer ${await getToken(app)}`)
        .send(userDto)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          login: userDto.login,
          passwordHashed: expect.any(String),
          salt: expect.any(String),
          name: userDto.name,
          email: userDto.email,
        }),
      );
    });
  });
});
