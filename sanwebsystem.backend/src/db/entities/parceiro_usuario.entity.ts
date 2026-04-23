import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GrupoAcesso } from './grupo_acesso.entity';
import { Parceiro } from './parceiro.entity';
import { Usuario } from './usuario.entity';

export enum PerfilRole {
    ADMINISTRATIVO = 0,
    COMERCIAL = 1,
    INVESTIDOR = 2,
    CLINICA = 3,
    OUTRO = 4,
}

@Entity('parceiro_usuario', { schema: 'sanweb_maindb' })
export class ParceiroUsuario {
    @Column({
        name: 'parceiro_ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_parceiro_usuario',
    })
    parceiroId: number = 0;

    @Column({
        name: 'usuario_ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_parceiro_usuario',
    })
    usuarioId: number = 0;

    @Column({
        name: 'perfil',
        type: 'enum',
        enum: PerfilRole,
        default: PerfilRole.OUTRO,
    })
    perfil: PerfilRole = PerfilRole.OUTRO;

    @JoinColumn({ name: 'grupo_acesso_id', referencedColumnName: 'id' })
    @Column({ name: 'grupo_acesso_id', type: 'bigint', nullable: true })
    grupoAcessoId?: number | null = null;

    @Column({ name: 'eh_responsavel', type: 'boolean', default: false })
    ehResponsavel: boolean = false;

    @Column({ name: 'ativo', type: 'boolean', default: true })
    ativo: boolean = true;

    @ManyToOne(() => Usuario, (usuario) => usuario.parceiroUsuario)
    @JoinColumn({ name: 'usuario_id', referencedColumnName: 'id' })
    usuario?: Promise<Usuario>;

    @ManyToOne(() => Parceiro, (parceiro) => parceiro.parceiroUsuario)
    @JoinColumn({ name: 'parceiro_id', referencedColumnName: 'id' })
    parceiro?: Promise<Parceiro>;

    @ManyToOne(() => GrupoAcesso, (grupoAcesso) => grupoAcesso.parceiroUsuario)
    grupoAcesso?: Promise<GrupoAcesso>;
}
