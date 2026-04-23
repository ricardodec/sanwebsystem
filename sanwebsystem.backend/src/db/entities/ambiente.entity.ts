import { Column, Entity, OneToMany } from 'typeorm';
import { Componente } from './componente.entity';
import { Tarefa } from './tarefa.entity';

@Entity('ambiente', { schema: 'sanweb_maindb' })
export class Ambiente {
    @Column({
        name: 'ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_ambiente',
    })
    id: number = 0;

    @Column({ name: 'descricao', type: 'varchar', length: 50 })
    descricao: string = '';

    @Column({ name: 'data_base', type: 'date' })
    dataBase: Date = new Date();

    @Column({ name: 'ativo', type: 'boolean', default: true })
    ativo: boolean = true;

    @OneToMany(() => Tarefa, (tarefa) => tarefa.ambiente, {
        onDelete: 'CASCADE',
    })
    tarefas?: Promise<Tarefa[]>;

    @OneToMany(() => Componente, (componente) => componente.ambiente)
    componentes?: Promise<Componente[]>;
}
