import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Pessoa } from './pessoa.entity';

export enum TipoEnderecoRole {
    NAO_INFORMADO = 0,
    RESIDENCIAL = 1,
    COMERCIAL = 2,
    OUTRO = 3,
}

@Entity('endereco')
export class Endereco {
    @Column({
        name: 'ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_endereco',
    })
    id: number = 0;

    @Column({ name: 'pessoa_ID', type: 'bigint' })
    pessoaId: number = 0;

    @Column({
        name: 'tipo_endereco',
        type: 'enum',
        enum: TipoEnderecoRole,
        default: TipoEnderecoRole.NAO_INFORMADO,
    })
    tipoEndereco: TipoEnderecoRole = TipoEnderecoRole.NAO_INFORMADO;

    @Column({ name: 'logradouro', type: 'varchar', length: 100 })
    logradouro: string = '';

    @Column({ name: 'numero', type: 'integer', nullable: true })
    numero?: number | null = null;

    @Column({
        name: 'complemento',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    complemento?: string | null = null;

    @Column({ name: 'bairro', type: 'varchar', length: 50, nullable: true })
    bairro?: string | null = null;

    @Column({ name: 'cidade', type: 'varchar', length: 50 })
    cidade: string = '';

    @Column({ name: 'uf', type: 'varchar', length: 2 })
    uf: string = '';

    @Column({ name: 'cep', type: 'varchar', length: 9 })
    cep: string = '';

    @Column({ name: 'ativo', type: 'boolean', default: true })
    ativo: boolean = true;

    @ManyToOne(() => Pessoa, (pessoa) => pessoa.enderecos)
    @JoinColumn({ name: 'pessoa_ID', referencedColumnName: 'ID' })
    pessoa?: Promise<Pessoa>;
}
