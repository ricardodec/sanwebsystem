import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Pessoa } from './pessoa.entity';

export enum TipoTelefoneRole {
    NAO_INFORMADO = 0,
    RESIDENCIAL = 1,
    COMERCIAL = 2,
    CELULAR = 3,
    OUTRO = 4,
}

@Entity('telefone')
export class Telefone {
    @Column({
        name: 'ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_telefone',
    })
    id: number = 0;

    @Column({ name: 'pessoa_ID', type: 'bigint' })
    pessoaId: number = 0;

    @Column({
        name: 'tipo_telefone',
        type: 'enum',
        enum: TipoTelefoneRole,
        default: TipoTelefoneRole.NAO_INFORMADO,
    })
    tipoTelefone: TipoTelefoneRole = TipoTelefoneRole.NAO_INFORMADO;

    @Column({ name: 'ddi', type: 'varchar', length: 2, nullable: true })
    ddi?: string | null = null;

    @Column({ name: 'ddd', type: 'varchar', length: 2, nullable: true })
    ddd: string = '';

    @Column({ name: 'numero', type: 'varchar', length: 20, nullable: true })
    numero: string = '';

    @Column({ name: 'contato', type: 'varchar', length: 256, nullable: true })
    contato?: string | null = null;

    @Column({ name: 'whatsapp', type: 'boolean', default: false })
    whatsapp: boolean = false;

    @Column({ name: 'telegram', type: 'boolean', default: false })
    telegram: boolean = false;

    @Column({ name: 'ativo', type: 'boolean', default: true })
    ativo: boolean = true;

    @ManyToOne(() => Pessoa, (pessoa) => pessoa.telefones)
    @JoinColumn({ name: 'pessoa_ID', referencedColumnName: 'ID' })
    pessoa?: Promise<Pessoa>;
}
