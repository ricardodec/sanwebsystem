import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AcaoComponente } from './acao_componente.entity';
import { GrupoAcesso } from './grupo_acesso.entity';

@Entity('grupo_acesso_acao', { schema: 'sanweb_maindb' })
export class GrupoAcessoAcao {
    @Column({
        name: 'grupo_acesso_ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_grupo_acesso_acao',
    })
    grupoAcessoId: number = 0;

    @Column({
        name: 'componente_ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_grupo_acesso_acao',
    })
    componenteId: number = 0;

    @Column({
        name: 'acao_ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_grupo_acesso_acao',
    })
    acaoId: number = 0;

    @Column({ name: 'ativo', type: 'boolean', default: true })
    ativo: boolean = true;

    @ManyToOne(() => GrupoAcesso, (grupoAcesso) => grupoAcesso.grupoAcessoAcao)
    @JoinColumn({ name: 'grupo_acesso_id', referencedColumnName: 'id' })
    grupoAcesso?: Promise<GrupoAcesso>;

    @ManyToOne(
        () => AcaoComponente,
        (acaoComponente) => acaoComponente.grupoAcessoAcao,
    )
    @JoinColumn([
        { name: 'componente_id', referencedColumnName: 'componente_id' },
        { name: 'acao_id', referencedColumnName: 'acao_id' },
    ])
    acaoComponente?: Promise<AcaoComponente>;
}
