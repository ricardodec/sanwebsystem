import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
} from 'typeorm';
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
    id: number = 0;

    @Column({ name: 'superior_id', type: 'bigint' })
    superiorId?: number;

    @Column({ name: 'ambiente_id', type: 'bigint' })
    ambienteId: number = 0;

    @Column({ name: 'nome', type: 'varchar', length: 50 })
    nome: string = '';

    @Column({ name: 'icon', type: 'varchar', length: 50, nullable: true })
    icon?: string | null = null;

    @Column({ name: 'to', type: 'varchar', length: 50, nullable: true })
    to?: string | null = null;

    @Column({ name: 'url', type: 'varchar', length: 256, nullable: true })
    url?: string | null = null;

    @Column({ name: 'target', type: 'varchar', length: 50, nullable: true })
    target?: string | null = null;

    @Column({ name: 'menu', type: 'boolean', default: false })
    menu: boolean = false;

    @Column({ name: 'ativo', type: 'boolean', default: true })
    ativo: boolean = true;

    @OneToOne(() => Componente, (componente) => componente.superior)
    @JoinColumn({ name: 'superior_id', referencedColumnName: 'id' })
    superior?: Promise<Componente>;

    @ManyToOne(() => Ambiente, (ambiente) => ambiente.componentes)
    @JoinColumn({ name: 'ambiente_id', referencedColumnName: 'id' })
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
