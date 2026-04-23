import { Column, Entity } from 'typeorm';

@Entity('variavel', { schema: 'sanweb_maindb' })
export class Variavel {
    @Column({
        name: 'ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_variavel',
    })
    id: number = 0;

    @Column({ name: 'tag', type: 'varchar', length: 50 })
    tag: string = '';

    @Column({ name: 'descricao', type: 'varchar', length: 100 })
    descricao: string = '';
}
