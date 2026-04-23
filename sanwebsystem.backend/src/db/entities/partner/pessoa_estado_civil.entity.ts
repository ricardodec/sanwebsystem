import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PessoaNatural } from './pessoa_natural.entity';

export enum EstadoCivilRole {
    SOLTEIRO = 0,
    CASADO = 1,
    DIVORCIADO = 2,
    SEPARADO = 3,
    UNIAOESTAVEL = 4,
    VIUVO = 5,
    OUTRO = 6,
}

@Entity('pessoa_estado_civil')
export class PessoaEstadoCivil {
    @Column({
        name: 'ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_pessoa_estado_civil',
    })
    id: number = 0;

    @Column({ name: 'pessoa_ID', type: 'bigint' })
    pessoaId: number = 0;

    @Column({
        name: 'estado_civil',
        type: 'enum',
        enum: EstadoCivilRole,
        default: EstadoCivilRole.SOLTEIRO,
    })
    estadoCivil: EstadoCivilRole = EstadoCivilRole.SOLTEIRO;

    @Column({ name: 'conjuge', type: 'varchar', length: 50, nullable: true })
    conjuge?: string | null = null;

    @Column({ name: 'data_ini', type: 'date' })
    dataIni: Date = new Date();

    @Column({ name: 'data_fim', type: 'date', nullable: true })
    dataFim?: Date | null = null;

    @ManyToOne(
        () => PessoaNatural,
        (pessoaNatural) => pessoaNatural.pessoaEstadoCivil,
    )
    @JoinColumn({ name: 'pessoa_ID', referencedColumnName: 'pessoa_ID' })
    pessoaNatural?: Promise<PessoaNatural>;
}
