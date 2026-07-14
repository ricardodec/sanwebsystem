import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Componente } from './componente.entity';
import { Modulo } from './modulo.entity';

@Entity('modulo_componente', { schema: 'sanweb_maindb' })
export class ModuloComponente {
    @Column({
        name: 'modulo_ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_modulo_componente',
    })
    modulo_ID: number = 0;

    @Column({
        name: 'componente_ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_modulo_componente',
    })
    componente_ID: number = 0;

    @Column({ name: 'ativo', type: 'boolean', default: true })
    ativo: boolean = true;

    @ManyToOne(() => Modulo, (modulo) => modulo.moduloComponente)
    @JoinColumn({
        name: 'modulo_ID',
        referencedColumnName: 'ID',
        foreignKeyConstraintName: 'FK_modulo_componente_modulo_ID',
    })
    modulo?: Promise<Modulo>;

    @ManyToOne(() => Componente, (componente) => componente.moduloComponente)
    @JoinColumn({
        name: 'componente_ID',
        referencedColumnName: 'ID',
        foreignKeyConstraintName: 'FK_modulo_componente_componente_ID',
    })
    componente?: Promise<Componente>;
}
