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
    moduloId: number = 0;

    @Column({
        name: 'componente_ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_modulo_componente',
    })
    componenteId: number = 0;

    @Column({ name: 'ativo', type: 'boolean', default: true })
    ativo: boolean = true;

    @ManyToOne(() => Modulo, (modulo) => modulo.moduloComponente)
    @JoinColumn({ name: 'modulo_id', referencedColumnName: 'id' })
    modulo?: Promise<Modulo>;

    @ManyToOne(() => Componente, (componente) => componente.moduloComponente)
    @JoinColumn({ name: 'componente_id', referencedColumnName: 'id' })
    componente?: Promise<Componente>;
}
