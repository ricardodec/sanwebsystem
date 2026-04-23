import { DataSource, DataSourceOptions } from 'typeorm';

const dataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'sanweb_adm',
    password: 'MHSunAt!Qx',
    // database: 'sanweb_maindb',
    autoLoadEntities: true,
    synchronize: false,
    entities: [`${process.cwd()}/src/db/entities/**/*{.js,.ts}`],
    seeds: [`${process.cwd()}/src/db/seeds/**/*{.ts,.js}`],
    migrations: [`${process.cwd()}/src/db/migrations/**/*{.js,.ts}`],
    migrationsRun: false,
    migrationsTableName: 'migrations',
    migrationsTransactionMode: 'all',
} as DataSourceOptions);

export default dataSource;
