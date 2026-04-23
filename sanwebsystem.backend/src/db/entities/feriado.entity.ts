import { Column, Entity } from 'typeorm';

@Entity('feriado', { schema: 'sanweb_maindb' })
export class Feriado {
    @Column({
        name: 'data',
        type: 'date',
        primary: true,
        primaryKeyConstraintName: 'PK_feriado',
    })
    data: Date = new Date();

    @Column({ name: 'nome', type: 'varchar', length: 50 })
    nome: string = '';
}
