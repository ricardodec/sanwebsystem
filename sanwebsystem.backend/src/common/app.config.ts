import Joi from '@hapi/joi';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type AppConfigType = {
  nodeEnv: string;
  appPort: number;
  jwt: {
    secret: string;
    audience: string;
    issuer: string;
    ttl: number;
    refreshTtl: number;
  };
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
    autoLoadEntities: boolean;
    synchronize: boolean;
  };
  email: {
    host: string;
    port: number;
    username: string;
    password: string;
    from: string;
  };
};

export class AppConfig {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {}

  static getSchema() {
    return Joi.object({
      NODE_ENV: [Joi.string()],
      APP_PORT: [Joi.number()],
      DATABASE_HOST: [Joi.required(), Joi.string()],
      DATABASE_PORT: [Joi.required(), Joi.number()],
      DATABASE_USERNAME: [Joi.required(), Joi.string()],
      DATABASE_PASSWORD: [Joi.required(), Joi.string()],
      DATABASE_NAME: [Joi.required(), Joi.string()],
      DATABASE_AUTOLOADENTITIES: Joi.boolean().default(true),
      DATABASE_SYNCHRONIZE: Joi.boolean().default(false),
      JWT_TOKEN: [Joi.required(), Joi.string()],
      JWT_AUDIENCE: [Joi.required(), Joi.string()],
      JWT_ISSUER: [Joi.required(), Joi.string()],
      JWT_TTL: [Joi.required(), Joi.number()],
      JWT_REFRESH_TTL: [Joi.required(), Joi.number()],
      EMAIL_HOST: [Joi.required(), Joi.string()],
      EMAIL_PORT: [Joi.required(), Joi.number()],
      EMAIL_USER: [Joi.required(), Joi.string()],
      EMAIL_PASS: [Joi.required(), Joi.string()],
      EMAIL_FROM: [Joi.required(), Joi.string()],
    });
  }

  static getConstants(): AppConfigType {
    return {
      nodeEnv: process.env.NODE_ENV ?? 'development',
      appPort: Number(process.env.APP_PORT ?? '3030'),
      jwt: {
        secret: process.env.JWT_SECRET ?? '',
        audience: process.env.JWT_AUDIENCE ?? '',
        issuer: process.env.JWT_ISSUER ?? '',
        ttl: Number(process.env.JWT_TTL ?? '3600'),
        refreshTtl: Number(process.env.JWT_REFRESH_TTL ?? '86400'),
      },
      database: {
        host: process.env.DATABASE_HOST as string,
        port: Number(process.env.DATABASE_PORT ?? '5432'),
        username: process.env.DATABASE_USERNAME as string,
        password: process.env.DATABASE_PASSWORD as string,
        name: process.env.DATABASE_NAME as string,
        autoLoadEntities: Boolean(process.env.DATABASE_AUTOLOADENTITIES),
        synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
      },
      email: {
        host: process.env.EMAIL_HOST as string,
        port: Number(process.env.EMAIL_PORT ?? '465'),
        username: process.env.EMAIL_USER as string,
        password: process.env.EMAIL_PASS as string,
        from: process.env.EMAIL_FROM as string,
      },
    };
  }

  getParams(): AppConfigType {
    return {
      nodeEnv: this.configService.getOrThrow<string>('nodeEnv'),
      appPort: this.configService.get<number>('appPort') ?? 3030,
      jwt: {
        secret: this.configService.getOrThrow<string>('jwt.secret'),
        audience: this.configService.getOrThrow<string>('jwt.audience'),
        issuer: this.configService.getOrThrow<string>('jwt.issuer'),
        ttl: this.configService.getOrThrow<number>('jwt.ttl'),
        refreshTtl: this.configService.getOrThrow<number>('jwt.refreshTtl'),
      },
      database: {
        host: this.configService.getOrThrow<string>('database.host'),
        port: this.configService.getOrThrow<number>('database.port'),
        username: this.configService.getOrThrow<string>('database.username'),
        password: this.configService.getOrThrow<string>('database.password'),
        name: this.configService.getOrThrow<string>('database.name'),
        autoLoadEntities:
          this.configService.get<boolean>('database.autoLoadEntities') ?? true,
        synchronize:
          this.configService.get<boolean>('database.synchronize') ?? false,
      },
      email: {
        host: this.configService.getOrThrow<string>('email.host'),
        port: this.configService.getOrThrow<number>('email.port'),
        username: this.configService.getOrThrow<string>('email.username'),
        password: this.configService.getOrThrow<string>('email.password'),
        from: this.configService.getOrThrow<string>('email.from'),
      },
    };
  }
}
