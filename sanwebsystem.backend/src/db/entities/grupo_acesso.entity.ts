import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { GrupoAcessoAcao } from './grupo_acesso_acao.entity';
import { Parceiro } from './parceiro.entity';
import { ParceiroUsuario } from './parceiro_usuario.entity';

@Entity('grupo_acesso', { schema: 'sanweb_maindb' })
export class GrupoAcesso {
    @Column({
        name: 'ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_grupo_acesso',
    })
    id: number = 0;

    @Column({ name: 'parceiro_id', type: 'bigint', nullable: true })
    parceiroId?: number | null = null;

    @Column({ name: 'nome', type: 'varchar', length: 50 })
    nome: string = '';

    @Column({ name: 'ativo', type: 'boolean', default: true })
    ativo: boolean = true;

    @ManyToOne(() => Parceiro, (parceiro) => parceiro.grupoAcesso)
    @JoinColumn({ name: 'parceiro_id', referencedColumnName: 'id' })
    parceiro?: Promise<Parceiro>;

    @OneToMany(
        () => ParceiroUsuario,
        (parceiroUsuario) => parceiroUsuario.grupoAcesso,
        {
            onDelete: 'CASCADE',
        },
    )
    parceiroUsuario?: Promise<ParceiroUsuario[]>;

    @OneToMany(
        () => GrupoAcessoAcao,
        (grupoAcessoAcao) => grupoAcessoAcao.grupoAcesso,
        {
            onDelete: 'CASCADE',
        },
    )
    grupoAcessoAcao?: Promise<GrupoAcessoAcao[]>;
}
