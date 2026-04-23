import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Pessoa } from './pessoa.entity';

export enum PerfilRole {
    TOMADOR = 0,
    INVESTIDOR = 1,
    TOMADORINVESTIDOR = 2,
    CLINICA = 3,
    PACIENTE = 4,
}

@Entity('cliente')
export class Cliente {
    @Column({
        name: 'pessoa_ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_cliente',
    })
    pessoaId: number = 0;

    @Column({
        name: 'perfil',
        type: 'enum',
        enum: PerfilRole,
        default: PerfilRole.TOMADOR,
    })
    perfil: PerfilRole = PerfilRole.TOMADOR;

    @Column({ name: 'ativo', type: 'boolean', default: true })
    ativo: boolean = true;

    @OneToOne(() => Pessoa, (pessoa) => pessoa.cliente)
    @JoinColumn({ name: 'pessoa_ID', referencedColumnName: 'ID' })
    pessoa?: Promise<Pessoa>;
}
