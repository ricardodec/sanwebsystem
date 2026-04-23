import { Column, Entity } from 'typeorm';

@Entity('parametro', { schema: 'sanweb_maindb' })
export class Parametro {
    @Column({
        name: 'ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_parametro',
    })
    id: number = 0;

    @Column({ name: 'ciclo_senha', type: 'boolean' })
    cicloSenha: boolean = false;

    @Column({ name: 'num_repeticao_senha', type: 'integer' })
    numRepeticaoSenha: number = 0;

    @Column({ name: 'caracter_minusculo', type: 'boolean' })
    caracterMinusculo: boolean = false;

    @Column({ name: 'caracter_maiusculo', type: 'boolean' })
    caracterMaiusculo: boolean = false;

    @Column({ name: 'caracter_especial', type: 'boolean' })
    caracterEspecial: boolean = false;

    @Column({ name: 'caracter_numerico', type: 'boolean' })
    caracterNumerico: boolean = false;

    @Column({ name: 'linhas_por_pagina', type: 'integer' })
    linhasPorPagina: number = 0;
}
