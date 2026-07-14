import { Injectable } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { MysqlConnectionCredentialsOptions } from 'typeorm/driver/mysql/MysqlConnectionCredentialsOptions.js';
import { AppConfig } from '../common/app.config';
import { Cliente } from './entities/tenant/cliente.entity';
import { Email } from './entities/tenant/email.entity';
import { Empresa } from './entities/tenant/empresa.entity';
import { Endereco } from './entities/tenant/endereco.entity';
import { GrupoEconomico } from './entities/tenant/grupo_economico.entity';
import { Pessoa } from './entities/tenant/pessoa.entity';
import { PessoaEstadoCivil } from './entities/tenant/pessoa_estado_civil.entity';
import { PessoaNatural } from './entities/tenant/pessoa_natural.entity';
import { RedeSocial } from './entities/tenant/rede_social.entity';
import { Representante } from './entities/tenant/representante.entity';
import { Telefone } from './entities/tenant/telefone.entity';

@Injectable()
export class TenantConnectionManager {
    private readonly sources = new Map<string, Promise<DataSource>>();
    private readonly config = AppConfig.getConstants();

    async getDataSource(
        options: MysqlConnectionCredentialsOptions,
    ): Promise<DataSource> {
        const tenant = (options.database ?? '') as string;
        let source = this.sources.get(tenant);

        if (!source) {
            source = this.createDataSource(
                options as MysqlConnectionCredentialsOptions,
            );
            this.sources.set(tenant, source);
        }

        return source;
    }

    private async createDataSource(
        options: MysqlConnectionCredentialsOptions,
    ): Promise<DataSource> {
        const { database } = this.config;

        return new DataSource({
            type:
                ((options as DataSourceOptions).type as 'mysql' | 'mariadb') ??
                database.type,
            host: options.host ?? database.host,
            port: options.port ?? database.port,
            username: options.username ?? database.username,
            password: options.password ?? database.password,
            database: options.database ?? database.name,
            synchronize:
                (options as DataSourceOptions).synchronize ??
                database.synchronize,
            entities: [
                Pessoa,
                Email,
                RedeSocial,
                Telefone,
                Endereco,
                Empresa,
                GrupoEconomico,
                PessoaNatural,
                PessoaEstadoCivil,
                Representante,
                Cliente,
            ],
        }).initialize();
    }
}
