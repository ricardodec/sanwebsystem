import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { Cliente } from './cliente.entity';
import { Email } from './email.entity';
import { Empresa } from './empresa.entity';
import { Endereco } from './endereco.entity';
import { PessoaNatural } from './pessoa_natural.entity';
import { RedeSocial } from './rede_social.entity';
import { Telefone } from './telefone.entity';

export enum TipoPessoaRole {
    PESSOA_NATURAL = 0,
    EMPRESA = 1,
    OUTRA = 2,
}

@Entity('pessoa')
export class Pessoa {
    @Column({
        name: 'ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_pessoa',
    })
    id: number = 0;

    @Column({ name: 'parceiro_ID', type: 'bigint', nullable: true })
    parceiroId?: number | null = null;

    @Column({ name: 'cnpj_cpf', type: 'varchar', length: 14 })
    cnpjCpf: string = '';

    @Column({
        name: 'tipo_pessoa',
        type: 'enum',
        enum: TipoPessoaRole,
        default: TipoPessoaRole.EMPRESA,
    })
    tipoPessoa: TipoPessoaRole = TipoPessoaRole.EMPRESA;

    @Column({ name: 'nome', type: 'varchar', length: 50 })
    nome: string = '';

    @Column({ name: 'eh_comercial', type: 'boolean', default: false })
    ehComercial: boolean = false;

    @Column({ name: 'eh_investidor', type: 'boolean', default: false })
    ehInvestidor: boolean = false;

    @Column({ name: 'eh_sacado', type: 'boolean', default: false })
    ehSacado: boolean = false;

    @Column({ name: 'eh_fornecedor', type: 'boolean', default: false })
    ehFornecedor: boolean = false;

    @Column({ name: 'eh_psicologo', type: 'boolean', default: false })
    ehPsicologo: boolean = false;

    @OneToMany(() => Email, (email) => email.pessoa, {
        onDelete: 'CASCADE',
    })
    emails?: Promise<Email[]>;

    @OneToMany(() => RedeSocial, (redeSocial) => redeSocial.pessoa, {
        onDelete: 'CASCADE',
    })
    redeSociais?: Promise<RedeSocial[]>;

    @OneToMany(() => Telefone, (telefone) => telefone.pessoa, {
        onDelete: 'CASCADE',
    })
    telefones?: Promise<Telefone[]>;

    @OneToMany(() => Endereco, (endereco) => endereco.pessoa, {
        onDelete: 'CASCADE',
    })
    enderecos?: Promise<Endereco[]>;

    @OneToOne(() => Empresa, (empresa) => empresa.pessoa, {
        onDelete: 'CASCADE',
    })
    empresa?: Promise<Empresa>;

    @OneToOne(() => PessoaNatural, (pessoaNatural) => pessoaNatural.pessoa, {
        onDelete: 'CASCADE',
    })
    pessoaNatural?: Promise<PessoaNatural>;

    @OneToOne(() => Cliente, (cliente) => cliente.pessoa, {
        onDelete: 'CASCADE',
    })
    cliente?: Promise<Cliente>;
}
