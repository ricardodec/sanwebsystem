import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
} from 'typeorm';
import { GrupoEconomico } from './grupo_economico.entity';
import { Pessoa } from './pessoa.entity';
import { Representante } from './representante.entity';

@Entity('empresa')
export class Empresa {
    @Column({
        name: 'pessoa_ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_empresa',
    })
    pessoaId: number = 0;

    @Column({ name: 'nome_fantasia', type: 'varchar', length: 60 })
    nomeFantasia: string = '';

    @Column({
        name: 'inscricao_estadual',
        type: 'varchar',
        length: 20,
        nullable: true,
    })
    inscricaoEstadual?: string | null = null;

    @Column({
        name: 'inscricao_municipal',
        type: 'varchar',
        length: 20,
        nullable: true,
    })
    inscricaoMunicipal?: string | null = null;

    @Column({ name: 'data_abertura', type: 'date', nullable: true })
    dataAbertura?: Date | null = null;

    @Column({
        name: 'grupo_economico_ID',
        type: 'bigint',
        nullable: true,
    })
    grupoEconomicoId?: number | null = null;

    @Column({ name: 'dados_json', type: 'json', nullable: true })
    dadosJson?: string | null = null;

    @OneToOne(() => Pessoa, (pessoa) => pessoa.pessoaNatural)
    @JoinColumn({ name: 'pessoa_ID', referencedColumnName: 'ID' })
    pessoa?: Promise<Pessoa>;

    @OneToMany(
        () => Representante,
        (representante) => representante.representada,
        {
            onDelete: 'CASCADE',
        },
    )
    representacoes?: Promise<Representante[]>;

    @ManyToOne(
        () => GrupoEconomico,
        (grupoEconomico) => grupoEconomico.empresas,
    )
    @JoinColumn({ name: 'grupo_economico_ID', referencedColumnName: 'ID' })
    grupoEconomico?: Promise<GrupoEconomico>;
}
