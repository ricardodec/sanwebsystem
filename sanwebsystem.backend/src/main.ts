import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove chaves que não estão definidas no DTO
      forbidNonWhitelisted: true, //lançar um erro para chaves não definidas no DTO
      transform: true, // transformar os tipos de entrada para os tipos definidos no DTO
    }),
  );

  if (process.env.NODE_ENC === 'production') {
    // helmet -> cabeçalhos de segurança no protocolo HTTP
    app.use(helmet());

    // cors   -> permitir que outro domínio faça request na sua aplicação
    app.enableCors({
      origin: ['www.sanwebsystem.com.br'],
    });

    // csrf   -> Importante se usarmos cookies
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Sanwebsystem API')
    .setDescription('Ecossistema para negócios de R. CASTRO CONSULTING')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.APP_PORT ?? 3030);
}

bootstrap().catch((err) => {
  console.error('Failed to start the application:', err);
  process.exit(1);
});
