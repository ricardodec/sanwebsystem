import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Ambiente } from './ambiente.entity';

export enum TarefaStatusRole {
    ANDAMENTO = 0,
    COMPLETO = 1,
    ERRO = 2,
}

@Entity('tarefa', { schema: 'sanweb_maindb' })
export class Tarefa {
    @Column({
        name: 'ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_tarefa',
    })
    ID: number = 0;

    @Column({ name: 'ambiente_ID', type: 'bigint' })
    ambiente_ID: number = 0;

    @Column({ name: 'nome', type: 'varchar', length: 50 })
    nome: string = '';

    @Column({
        name: 'tempo_execucao',
        type: 'varchar',
        length: 20,
        nullable: true,
    })
    tempoExecucao?: string | null = null;

    @Column({ name: 'ultima_execucao', type: 'date', nullable: true })
    ultimaExecucao?: Date | null = null;

    @Column({
        name: 'status',
        type: 'enum',
        enum: TarefaStatusRole,
        default: null,
        nullable: true,
    })
    status?: TarefaStatusRole;

    @ManyToOne(() => Ambiente, (ambiente) => ambiente.tarefas)
    @JoinColumn({
        name: 'ambiente_ID',
        referencedColumnName: 'ID',
        foreignKeyConstraintName: 'FK_tarefa_ambiente_ID',
    })
    ambiente?: Promise<Ambiente>;
}
