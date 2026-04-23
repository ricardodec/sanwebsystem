import { Column, Entity } from 'typeorm';

@Entity('documento_padrao')
export class DocumentoPadrao {
    @Column({
        name: 'ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_documento_padrao',
    })
    id: number = 0;

    @Column({ name: 'nome', type: 'varchar', length: 50 })
    nome: string = '';

    @Column({ name: 'documento', type: 'text' })
    documento: string = '';

    @Column({ name: 'ativo', type: 'boolean', default: true })
    ativo: boolean = true;
}
