import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { CryptService } from '../../common/hashing/crypt.service';
import { HashingService } from '../../common/hashing/hashing.service';
import { Acao } from '../entities/acao.entity';
import { AcaoComponente } from '../entities/acao_componente.entity';
import { Ambiente } from '../entities/ambiente.entity';
import { Componente } from '../entities/componente.entity';
import { Configuracao } from '../entities/configuracao.entity';
import { Feriado } from '../entities/feriado.entity';
import { GrupoAcesso } from '../entities/grupo_acesso.entity';
import { GrupoAcessoAcao } from '../entities/grupo_acesso_acao.entity';
import { HistoricoSenha } from '../entities/historico_senha.entity';
import { Modulo } from '../entities/modulo.entity';
import { ModuloComponente } from '../entities/modulo_componente.entity';
import { ModuloParceiro } from '../entities/modulo_parceiro.entity';
import { Parametro } from '../entities/parametro.entity';
import { Parceiro } from '../entities/parceiro.entity';
import { ParceiroUsuario } from '../entities/parceiro_usuario.entity';
import { Tarefa } from '../entities/tarefa.entity';
import { Usuario } from '../entities/usuario.entity';
import { Variavel } from '../entities/variavel.entity';
import { TenantConnectionManager } from '../tenant-connection-manager';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env.local',
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '',
            database: 'sanweb_maindb',
            autoLoadEntities: true,
            synchronize: true,
        } as DataSourceOptions),
        TypeOrmModule.forFeature([
            Acao,
            AcaoComponente,
            Ambiente,
            Componente,
            Configuracao,
            Feriado,
            GrupoAcesso,
            GrupoAcessoAcao,
            HistoricoSenha,
            Modulo,
            ModuloComponente,
            ModuloParceiro,
            Parametro,
            Parceiro,
            ParceiroUsuario,
            Tarefa,
            Usuario,
            Variavel,
        ]),
    ],
    providers: [
        TenantConnectionManager,
        {
            provide: HashingService,
            useClass: CryptService,
        },
    ],
    exports: [TenantConnectionManager],
})
export class SeedModule {}
