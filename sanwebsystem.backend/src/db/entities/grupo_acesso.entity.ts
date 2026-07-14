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
    ID: number = 0;

    @Column({ name: 'parceiro_ID', type: 'bigint', nullable: true })
    parceiro_ID?: number | null = null;

    @Column({ name: 'nome', type: 'varchar', length: 50 })
    nome: string = '';

    @Column({ name: 'ativo', type: 'boolean', default: true })
    ativo: boolean = true;

    @ManyToOne(() => Parceiro, (parceiro) => parceiro.grupoAcesso)
    @JoinColumn({
        name: 'parceiro_ID',
        referencedColumnName: 'ID',
        foreignKeyConstraintName: 'FK_grupo_acesso_parceiro_ID',
    })
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
