import { Column, Entity } from 'typeorm';

export enum TipoAuthRole {
    BASIC = 0,
    OAUTH = 1,
}

@Entity('configuracao', { schema: 'sanweb_maindb' })
export class Configuracao {
    @Column({
        name: 'ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_configuracao',
    })
    id: number = 0;

    @Column({ name: 'email_remetente', type: 'varchar', length: 256 })
    emailRemetente: string = '';

    @Column({ name: 'nome_remetente', type: 'varchar', length: 50 })
    nomeRemetente: string = '';

    @Column({ name: 'servidor_SMTP', type: 'varchar', length: 256 })
    servidorSmtp: string = '';

    @Column({ name: 'porta_SMTP', type: 'integer' })
    portaSmtp: number = 0;

    @Column({
        name: 'tipo_oauth',
        type: 'enum',
        enum: TipoAuthRole,
        default: TipoAuthRole.BASIC,
    })
    tipoOAuth: TipoAuthRole = TipoAuthRole.BASIC;

    @Column({ name: 'oauth', type: 'boolean', default: false })
    oauth: boolean = false;

    @Column({ name: 'senha', type: 'varchar', length: 256, nullable: true })
    senha?: string | null = null;
}
