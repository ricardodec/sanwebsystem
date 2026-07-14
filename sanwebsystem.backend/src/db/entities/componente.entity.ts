import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AcaoComponente } from './acao_componente.entity';
import { Ambiente } from './ambiente.entity';
import { ModuloComponente } from './modulo_componente.entity';

@Entity('componente', { schema: 'sanweb_maindb' })
export class Componente {
    @Column({
        name: 'ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_componente',
    })
    ID: number = 0;

    @Column({
        name: 'superior_ID',
        type: 'bigint',
        nullable: true,
    })
    superior_ID?: number | null = null;

    @Column({ name: 'ambiente_ID', type: 'bigint' })
    ambiente_ID: number = 0;

    @Column({ name: 'nome', type: 'varchar', length: 50 })
    nome: string = '';

    @Column({ name: 'icon', type: 'varchar', length: 50, nullable: true })
    icon?: string | null = null;

    @Column({ name: 'action_to', type: 'varchar', length: 50, nullable: true })
    action_to?: string | null = null;

    @Column({ name: 'url', type: 'varchar', length: 256, nullable: true })
    url?: string | null = null;

    @Column({ name: 'target', type: 'varchar', length: 50, nullable: true })
    target?: string | null = null;

    @Column({ name: 'menu', type: 'boolean', default: false })
    menu: boolean = false;

    @Column({ name: 'ativo', type: 'boolean', default: true })
    ativo: boolean = true;

    @Column({ name: 'geral', type: 'boolean', default: true })
    geral: boolean = true;

    @ManyToOne(() => Componente)
    @JoinColumn({
        name: 'superior_ID',
        referencedColumnName: 'ID',
        foreignKeyConstraintName: 'FK_componente_superior_ID',
    })
    superior?: Promise<Componente>;

    @ManyToOne(() => Ambiente)
    @JoinColumn({
        name: 'ambiente_ID',
        referencedColumnName: 'ID',
        foreignKeyConstraintName: 'FK_componente_ambiente_ID',
    })
    ambiente?: Promise<Ambiente>;

    @OneToMany(
        () => ModuloComponente,
        (moduloComponente) => moduloComponente.modulo,
        {
            onDelete: 'CASCADE',
        },
    )
    moduloComponente?: Promise<ModuloComponente[]>;

    @OneToMany(() => AcaoComponente, (acaoComponente) => acaoComponente.acao, {
        onDelete: 'CASCADE',
    })
    acaoComponente?: Promise<AcaoComponente[]>;
}
