import { AppModule } from '@/src/app/app.module';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);
    const repo = dataSource.getRepository(Usuario);

    // Your seeding logic
    await repo.save({ email: 'admin@example.com', password: 'hash' });

    console.log('Seeding complete!');
    await app.close();
}
bootstrap();
