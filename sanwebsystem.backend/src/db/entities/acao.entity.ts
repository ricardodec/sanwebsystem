import { Column, Entity, OneToMany } from 'typeorm';
import { AcaoComponente } from './acao_componente.entity';

@Entity('acao', { schema: 'sanweb_maindb' })
export class Acao {
    @Column({
        name: 'ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_acao',
    })
    id: number = 0;

    @Column({ name: 'nome', type: 'varchar', length: 50 })
    nome: string = '';

    @OneToMany(() => AcaoComponente, (acaoComponente) => acaoComponente.acao)
    acaoComponente?: Promise<AcaoComponente[]>;
}
