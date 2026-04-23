import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Modulo } from './modulo.entity';
import { Parceiro } from './parceiro.entity';

@Entity('modulo_parceiro', { schema: 'sanweb_maindb' })
export class ModuloParceiro {
    @Column({
        name: 'modulo_ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_modulo_parceiro',
    })
    moduloId: number = 0;

    @Column({
        name: 'parceiro_ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_modulo_parceiro',
    })
    parceiroId: number = 0;

    @Column({ name: 'ativo', type: 'boolean', default: true })
    ativo: boolean = true;

    @ManyToOne(() => Modulo, (modulo) => modulo.moduloParceiro)
    @JoinColumn({ name: 'modulo_id', referencedColumnName: 'id' })
    modulo?: Promise<Modulo>;

    @ManyToOne(() => Parceiro, (parceiro) => parceiro.moduloParceiro)
    @JoinColumn({ name: 'parceiro_id', referencedColumnName: 'id' })
    parceiro?: Promise<Parceiro>;
}
