import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Pessoa } from './pessoa.entity';

export enum TipoRedeSocialRole {
    LINKEDIN = 0,
    INSTAGRAM = 1,
    FACEBOOK = 2,
    TWITTER_X = 3,
    TIKTOK = 4,
    YOUTUBE = 5,
    GITHUB = 6,
    OUTRA = 7,
}

@Entity('rede_social')
export class RedeSocial {
    @Column({
        name: 'ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_rede_social',
    })
    id: number = 0;

    @Column({ name: 'pessoa_ID', type: 'bigint' })
    pessoaId: number = 0;

    @Column({
        name: 'tipo_rede_social',
        type: 'enum',
        enum: TipoRedeSocialRole,
        default: TipoRedeSocialRole.OUTRA,
    })
    tipoRedeSocial: TipoRedeSocialRole = TipoRedeSocialRole.OUTRA;

    @Column({ name: 'identificador', type: 'varchar', length: 256 })
    identificador: string = '';

    @Column({ name: 'ativo', type: 'boolean', default: true })
    ativo: boolean = true;

    @ManyToOne(() => Pessoa, (pessoa) => pessoa.redeSociais)
    @JoinColumn({ name: 'pessoa_ID', referencedColumnName: 'ID' })
    pessoa?: Promise<Pessoa>;
}
