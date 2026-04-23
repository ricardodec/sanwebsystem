import { Column, Entity, OneToMany } from 'typeorm';
import { Empresa } from './empresa.entity';

@Entity('grupo_economico', { schema: 'sanweb_maindb' })
export class GrupoEconomico {
    @Column({
        name: 'ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_grupo_economico',
    })
    id: number = 0;

    @Column({ name: 'nome', type: 'varchar', length: 50 })
    nome: string = '';

    @OneToMany(() => Empresa, (empresa) => empresa.grupoEconomico)
    empresas?: Promise<Empresa[]>;
}
