import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from 'typeorm';
import { Acao } from './acao.entity';
import { Componente } from './componente.entity';
import { GrupoAcessoAcao } from './grupo_acesso_acao.entity';

@Entity('acao_componente', { schema: 'sanweb_maindb' })
export class AcaoComponente {
    @PrimaryColumn({
        name: 'componente_ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_acao_componente',
    })
    componente_ID: number = 0;

    @PrimaryColumn({
        name: 'acao_ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_acao_componente',
    })
    acao_ID: number = 0;

    @Column({ name: 'ativo', type: 'boolean', default: true })
    ativo: boolean = true;

    @ManyToOne(() => Componente)
    @JoinColumn({
        name: 'componente_ID',
        referencedColumnName: 'ID',
        foreignKeyConstraintName: 'FK_acao_componente_componente_ID',
    })
    componente?: Promise<Componente>;

    @ManyToOne(() => Acao)
    @JoinColumn({
        name: 'acao_ID',
        referencedColumnName: 'ID',
        foreignKeyConstraintName: 'FK_acao_componente_acao_ID',
    })
    acao?: Promise<Acao>;

    @OneToMany(
        () => GrupoAcessoAcao,
        (grupoAcessoAcao) => grupoAcessoAcao.acaoComponente,
    )
    grupoAcessoAcao?: Promise<GrupoAcessoAcao>;
}
