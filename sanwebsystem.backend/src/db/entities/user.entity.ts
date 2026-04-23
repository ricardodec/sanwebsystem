import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  EntityOptions,
  IndexOptions,
} from 'typeorm';
import { PasswordHistory } from './password_history.entity';

export enum TfaTypeRole {
  NAO_APLICADO = 0,
  GOOGLE = 1,
  EMAIL = 2,
}

@Entity('user', { schema: 'sanweb_maindb' } as EntityOptions)
@Index('UQ_user_login', ['login'], { unique: true } as IndexOptions)
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'PK_user' })
  id?: string;

  @Column({ name: 'login', type: 'varchar', length: 50 })
  login: string;

  @Column({ name: 'password_datetime', type: 'timestamp' })
  passwordDatetime: Date;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password?: string;

  @Column({ name: 'salt', type: 'varchar', length: 255 })
  salt?: string;

  @Column({ name: 'must_password_change', type: 'boolean', default: false })
  mustPasswordChange: boolean;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'email', type: 'varchar', length: 100 })
  email: string;

  @Column({ name: 'controller', type: 'boolean', default: false })
  controller: boolean;

  @Column({ name: 'tfa_active', type: 'boolean', default: false })
  tfaActive: boolean;

  @Column({
    name: 'tfa_type',
    type: 'enum',
    enumName: 'tfa_type_enum',
    enum: TfaTypeRole,
    default: TfaTypeRole.NAO_APLICADO,
  })
  tfaType: TfaTypeRole;

  @Column({ name: 'tfa_key', type: 'varchar', length: 32, nullable: true })
  tfaKey: string | null;

  @Column({ name: 'tfa_key_datetime', type: 'timestamp', nullable: true })
  tfaKeyDatetime: Date | null;

  @Column({
    name: 'tfa_entry_key',
    type: 'varchar',
    length: 52,
    nullable: true,
  })
  tfaEntryKey: string | null;

  @Column({ name: 'tfa_qrcode_image_url', type: 'bytea', nullable: true })
  tfaQrcodeImageUrl: Buffer | null;

  @Column({ name: 'active', type: 'boolean', default: false })
  active: boolean;

  @Column({ name: 'photo', type: 'bytea', nullable: true })
  photo: Buffer | null;

  @Column({
    name: 'photo_mimetype',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  photoMimetype: string | null;

  @OneToMany(() => PasswordHistory, (passwordHistory) => passwordHistory.userId)
  passwordHistories: Promise<PasswordHistory[]>;
}
