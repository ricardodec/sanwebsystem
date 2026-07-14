import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { AcaoComponente } from './acao_componente.entity';
import { GrupoAcesso } from './grupo_acesso.entity';

@Entity('grupo_acesso_acao', { schema: 'sanweb_maindb' })
export class GrupoAcessoAcao {
    @PrimaryColumn({
        name: 'grupo_acesso_ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_grupo_acesso_acao',
    })
    grupo_acesso_ID: number = 0;

    @PrimaryColumn({
        name: 'componente_ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_grupo_acesso_acao',
    })
    componente_ID: number = 0;

    @PrimaryColumn({
        name: 'acao_ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_grupo_acesso_acao',
    })
    acao_ID: number = 0;

    @Column({ name: 'ativo', type: 'boolean', default: true })
    ativo: boolean = true;

    @ManyToOne(() => GrupoAcesso)
    @JoinColumn({
        name: 'grupo_acesso_ID',
        referencedColumnName: 'ID',
        foreignKeyConstraintName: 'FK_grupo_acesso_acao_grupo_acesso_ID',
    })
    grupoAcesso?: Promise<GrupoAcesso>;

    @ManyToOne(() => AcaoComponente, {
        createForeignKeyConstraints: true,
        cascade: false,
        nullable: false,
    })
    @JoinColumn([
        {
            name: 'componente_ID',
            referencedColumnName: 'componente_ID',
            foreignKeyConstraintName: 'FK_grupo_acesso_acao_componente',
        },
        {
            name: 'acao_ID',
            referencedColumnName: 'acao_ID',
            foreignKeyConstraintName: 'FK_grupo_acesso_acao_componente',
        },
    ])
    acaoComponente?: Promise<AcaoComponente>;
}
