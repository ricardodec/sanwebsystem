import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('historico_senha', { schema: 'sanweb_maindb' })
export class HistoricoSenha {
    @Column({
        name: 'ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_historico_senha',
    })
    id: number = 0;

    @Column({ name: 'usuario_id', type: 'bigint' })
    usuarioId: number = 0;

    @Column({ name: 'data_senha', type: 'date' })
    dataSenha: Date = new Date();

    @Column({ name: 'senha', type: 'varchar', length: 255, nullable: true })
    senha?: string | null = null;

    @Column({ name: 'salt', type: 'varchar', length: 255, nullable: true })
    salt?: string | null = null;

    @ManyToOne(() => Usuario, (usuario) => usuario.historicoSenha)
    @JoinColumn({ name: 'usuario_id', referencedColumnName: 'id' })
    usuario?: Promise<Usuario>;
}
