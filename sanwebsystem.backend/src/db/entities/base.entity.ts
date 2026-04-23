import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class Base {
  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
