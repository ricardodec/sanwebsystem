import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Empresa } from './empresa.entity';
import { PessoaNatural } from './pessoa_natural.entity';

export enum FuncaoRole {
    NAO_INFORMADO = 0,
    SOCIO = 1,
    SOCIO_ADMINISTRADOR = 2,
    ADMINISTRADOR = 3,
    COLABORADOR = 4,
    PROCURADOR = 5,
    TESTEMUNHA = 6,
    DIRETOR = 7,
    DIRETOR_ESTATUTARIO = 8,
}

@Entity('representante')
export class Representante {
    @PrimaryColumn({
        name: 'representada_ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_representante',
    })
    representada_ID: number = 0;

    @PrimaryColumn({
        name: 'representante_ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_representante',
    })
    representante_ID: number = 0;

    @Column({
        name: 'funcao',
        type: 'enum',
        enum: FuncaoRole,
        default: FuncaoRole.NAO_INFORMADO,
    })
    funcao: FuncaoRole = FuncaoRole.NAO_INFORMADO;

    @Column({
        name: 'departamento',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    departamento?: string | null = null;

    @Column({ name: 'eh_procurador', type: 'boolean', default: false })
    ehProcurador: boolean = false;

    @Column({ name: 'data_vcto_procuracao', type: 'date', nullable: true })
    dataVctoProcuracao?: Date | null = null;

    @Column({ name: 'ativo', type: 'boolean', default: true })
    ativo: boolean = true;

    @ManyToOne(() => Empresa)
    @JoinColumn({
        name: 'representada_ID',
        referencedColumnName: 'pessoa_ID',
        foreignKeyConstraintName: 'FK_representante_representada_ID',
    })
    representada?: Promise<Empresa>;

    @ManyToOne(() => PessoaNatural)
    @JoinColumn({
        name: 'representante_ID',
        referencedColumnName: 'pessoa_ID',
        foreignKeyConstraintName: 'FK_representante_representante_ID',
    })
    representante?: Promise<PessoaNatural>;
}
