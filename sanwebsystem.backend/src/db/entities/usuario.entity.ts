import {
    Column,
    Entity,
    EntityOptions,
    Index,
    IndexOptions,
    OneToMany,
} from 'typeorm';
import { HistoricoSenha } from './historico_senha.entity';
import { ParceiroUsuario } from './parceiro_usuario.entity';

export enum TfaTypeRole {
    NAO_APLICADO = 0,
    GOOGLE = 1,
    EMAIL = 2,
}

@Entity('usuario', { schema: 'sanweb_maindb' } as EntityOptions)
@Index('IDX_usuario_login', ['login'], { unique: true } as IndexOptions)
export class Usuario {
    @Column({
        name: 'ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_usuario',
    })
    id: number = 0;

    @Column({ name: 'login', type: 'varchar', length: 50 })
    login: string = '';

    @Column({ name: 'data_senha', type: 'date' })
    dataSenha: Date = new Date();

    @Column({ name: 'senha', type: 'varchar', length: 255, nullable: true })
    senha?: string;

    @Column({ name: 'salt', type: 'varchar', length: 255, nullable: true })
    salt?: string;

    @Column({ name: 'trocar_senha', type: 'boolean', default: false })
    trocarSenha: boolean = false;

    @Column({ name: 'nome', type: 'varchar', length: 50 })
    nome: string = '';

    @Column({ name: 'email', type: 'varchar', length: 100 })
    email: string = '';

    @Column({ name: 'eh_controlador', type: 'boolean', default: false })
    ehControlador: boolean = false;

    @Column({ name: 'tfa', type: 'boolean', default: false })
    tfa: boolean = false;

    @Column({
        name: 'tfa_tipo',
        type: 'enum',
        enum: TfaTypeRole,
        default: TfaTypeRole.NAO_APLICADO,
    })
    tfaTipo: TfaTypeRole = TfaTypeRole.NAO_APLICADO;

    @Column({ name: 'tfa_key', type: 'varchar', length: 32, nullable: true })
    tfaKey: string | null = null;

    @Column({ name: 'tfa_key_data_hora', type: 'date', nullable: true })
    tfaKeyDataHora: Date | null = null;

    @Column({
        name: 'tfa_entry_key',
        type: 'varchar',
        length: 52,
        nullable: true,
    })
    tfaEntryKey: string | null = null;

    @Column({ name: 'tfa_qrcode_image_url', type: 'blob', nullable: true })
    tfaQrcodeImageUrl: Buffer | null = null;

    @Column({ name: 'ativo', type: 'boolean', default: true })
    ativo: boolean = true;

    @Column({ name: 'foto', type: 'blob', nullable: true })
    foto: Buffer | null = null;

    @Column({
        name: 'foto_mimetype',
        type: 'varchar',
        length: 20,
        nullable: true,
    })
    fotoMimetype: string | null = null;

    @OneToMany(
        () => HistoricoSenha,
        (historicoSenha) => historicoSenha.usuario,
        {
            onDelete: 'CASCADE',
        },
    )
    historicoSenha?: Promise<HistoricoSenha[]>;

    @OneToMany(
        () => ParceiroUsuario,
        (parceiroUsuario) => parceiroUsuario.usuario,
        {
            onDelete: 'CASCADE',
        },
    )
    parceiroUsuario?: Promise<ParceiroUsuario[]>;
}
