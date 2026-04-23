import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('password_history', { schema: 'sanweb_maindb' })
export class PasswordHistory {
  @PrimaryGeneratedColumn('uuid', { name: 'PK_password_history' })
  id?: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'password_datetime', type: 'timestamp' })
  passwordDatetime: Date;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password?: string;

  @Column({ name: 'salt', type: 'varchar', length: 255 })
  salt?: string;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: Promise<User>;
}
