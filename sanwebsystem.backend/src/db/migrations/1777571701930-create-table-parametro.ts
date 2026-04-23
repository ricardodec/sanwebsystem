import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableParametro1777571701930 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "sanweb_maindb"."parametro" (
                "ID" BIGINT NOT NULL,
                "ciclo_senha" INT NOT NULL,
                "num_repeticao_senha" INT NOT NULL,
                "min_tamanho_senha" INT NOT NULL,
                "caracter_minusculo" BIT NOT NULL,
                "caracter_maiusculo" BIT NOT NULL,
                "caracter_especial" BIT NOT NULL,
                "caracter_numerico" BIT NOT NULL,
                "linhas_por_pagina" INT NOT NULL,
                CONSTRAINT "PK_parametro" PRIMARY KEY ("ID"))
            ENGINE = InnoDB;`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sanweb_maindb"."parametro";`);
    }
}
