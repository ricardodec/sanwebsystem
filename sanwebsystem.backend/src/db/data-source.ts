import { DataSource, DataSourceOptions } from 'typeorm';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'sanweb_adm',
  password: 'MHSunAt!Qx',
  database: 'sanwebsystem',
  autoLoadEntities: true,
  synchronize: false,
  entities: [`${process.cwd()}/src/db/entities/**/*{.js,.ts}`],
  migrations: [`${process.cwd()}/src/db/migrations/**/*{.js,.ts}`],
  migrationsRun: false,
  migrationsTableName: 'migrations',
  migrationsTransactionMode: 'all',
} as DataSourceOptions);

export default dataSource;
