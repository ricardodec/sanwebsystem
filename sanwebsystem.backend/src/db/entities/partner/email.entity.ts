import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Pessoa } from './pessoa.entity';

@Entity('email')
export class Email {
    @Column({
        name: 'ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_email',
    })
    id: number = 0;

    @Column({ name: 'pessoa_ID', type: 'bigint' })
    pessoaId: number = 0;

    @Column({ name: 'endereco', type: 'varchar', length: 256 })
    endereco: string = '';

    @Column({ name: 'ativo', type: 'boolean', default: true })
    ativo: boolean = true;

    @ManyToOne(() => Pessoa, (pessoa) => pessoa.emails)
    @JoinColumn({ name: 'pessoa_ID', referencedColumnName: 'ID' })
    pessoa?: Promise<Pessoa>;
}
