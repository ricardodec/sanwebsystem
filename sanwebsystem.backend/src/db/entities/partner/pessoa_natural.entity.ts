import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Pessoa } from './pessoa.entity';
import { PessoaEstadoCivil } from './pessoa_estado_civil.entity';
import { Representante } from './representante.entity';

@Entity('pessoa_natural')
export class PessoaNatural {
    @Column({
        name: 'pessoa_ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_pessoa_natural',
    })
    pessoaId: number = 0;

    @Column({ name: 'data_nascimento', type: 'date', nullable: true })
    dataNascimento?: Date | null = null;

    @Column({ name: 'profissao', type: 'varchar', length: 100, nullable: true })
    profissao?: string | null = null;

    @Column({ name: 'dados_json', type: 'json', nullable: true })
    dadosJson?: string | null = null;

    @OneToOne(() => Pessoa, (pessoa) => pessoa.pessoaNatural)
    @JoinColumn({ name: 'pessoa_ID', referencedColumnName: 'ID' })
    pessoa?: Promise<Pessoa>;

    @OneToMany(() => PessoaEstadoCivil, (endereco) => endereco.pessoaNatural, {
        onDelete: 'CASCADE',
    })
    pessoaEstadoCivil?: Promise<PessoaEstadoCivil[]>;

    @OneToMany(
        () => Representante,
        (representante) => representante.representante,
        {
            onDelete: 'CASCADE',
        },
    )
    representacoes?: Promise<Representante[]>;
}
