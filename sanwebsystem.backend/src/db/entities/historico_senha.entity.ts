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
    ID: number = 0;

    @Column({ name: 'usuario_ID', type: 'bigint' })
    usuario_ID: number = 0;

    @Column({ name: 'data_senha', type: 'date' })
    dataSenha: Date = new Date();

    @Column({ name: 'senha', type: 'varchar', length: 255, nullable: true })
    senha?: string | null = null;

    @ManyToOne(() => Usuario, (usuario) => usuario.historicoSenha)
    @JoinColumn({
        name: 'usuario_ID',
        referencedColumnName: 'ID',
        foreignKeyConstraintName: 'FK_historico_senha_usuario_ID',
    })
    usuario?: Promise<Usuario>;
}
