import { Column, Entity, OneToMany } from 'typeorm';
import { GrupoAcesso } from './grupo_acesso.entity';
import { ModuloParceiro } from './modulo_parceiro.entity';
import { ParceiroUsuario } from './parceiro_usuario.entity';
import { TipoPessoaRole } from './partner/pessoa.entity';

export enum OperacaoRole {
    FACTORING = 0,
    SECURUTIZADORA = 1,
    FIDC = 2,
    CLINICA = 3,
    OUTRA = 4,
}

@Entity('parceiro', { schema: 'sanweb_maindb' })
export class Parceiro {
    @Column({
        name: 'ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_parceiro',
    })
    id: number = 0;

    @Column({ name: 'cnpj_cpf', type: 'varchar', length: 14 })
    cnpjCpf: string = '';

    @Column({
        name: 'tipo_pessoa',
        type: 'enum',
        enum: TipoPessoaRole,
        default: TipoPessoaRole.EMPRESA,
    })
    tipoPessoa: TipoPessoaRole = TipoPessoaRole.EMPRESA;

    @Column({ name: 'nome', type: 'varchar', length: 50 })
    nome: string = '';

    @Column({
        name: 'operacao',
        type: 'enum',
        enum: OperacaoRole,
        default: OperacaoRole.OUTRA,
    })
    operacao: OperacaoRole = OperacaoRole.OUTRA;

    @Column({ name: 'ativo', type: 'boolean', default: true })
    ativo: boolean = true;

    @Column({ name: 'logo', type: 'blob', nullable: true })
    logo: Buffer | null = null;

    @Column({
        name: 'logo_mimetype',
        type: 'varchar',
        length: 20,
        nullable: true,
    })
    logoMimetype: string | null = null;

    @OneToMany(
        () => ParceiroUsuario,
        (parceiroUsuario) => parceiroUsuario.parceiro,
        {
            onDelete: 'CASCADE',
        },
    )
    parceiroUsuario?: Promise<ParceiroUsuario[]>;

    @OneToMany(
        () => ModuloParceiro,
        (moduloParceiro) => moduloParceiro.parceiro,
        {
            onDelete: 'CASCADE',
        },
    )
    moduloParceiro?: Promise<ModuloParceiro[]>;

    @OneToMany(() => GrupoAcesso, (grupoAcesso) => grupoAcesso.parceiro, {
        onDelete: 'CASCADE',
    })
    grupoAcesso?: Promise<GrupoAcesso[]>;
}
