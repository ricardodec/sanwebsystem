import { Column, Entity, OneToMany } from 'typeorm';
import { ModuloComponente } from './modulo_componente.entity';
import { ModuloParceiro } from './modulo_parceiro.entity';

@Entity('modulo', { schema: 'sanweb_maindb' })
export class Modulo {
    @Column({
        name: 'ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_modulo',
    })
    id: number = 0;

    @Column({ name: 'nome', type: 'varchar', length: 50 })
    nome: string = '';

    @Column({ name: 'ativo', type: 'boolean', default: true })
    ativo: boolean = true;

    @OneToMany(
        () => ModuloComponente,
        (moduloComponente) => moduloComponente.modulo,
        {
            onDelete: 'CASCADE',
        },
    )
    moduloComponente?: Promise<ModuloComponente[]>;

    @OneToMany(
        () => ModuloParceiro,
        (moduloParceiro) => moduloParceiro.modulo,
        {
            onDelete: 'CASCADE',
        },
    )
    moduloParceiro?: Promise<ModuloParceiro[]>;
}
