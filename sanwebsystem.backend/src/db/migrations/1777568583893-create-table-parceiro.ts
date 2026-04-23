import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableParceiro1777568583893 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "sanweb_maindb"."parceiro" (
                "ID" BIGINT NOT NULL,
                "cnpj_cpf" VARCHAR(14) NOT NULL,
                "tipo_pessoa" ENUM('PESSOA_NATURAL', 'EMPRESA', 'OUTRA') NOT NULL,
                "nome" VARCHAR(60) NOT NULL,
                "operacao" ENUM('FACTORING', 'SECURITIZADORA', 'FIDC', 'CLINICA', 'OUTRA') NOT NULL,
                "ativo" BIT NOT NULL,
                "logo" BLOB NULL,
                "logo_mimetype" VARCHAR(20) NULL,
                CONSTRAINT "PK_parceiro" PRIMARY KEY ("ID"),
                UNIQUE INDEX "IDX_parceiro_cnpj_cpf" ("cnpj_cpf" ASC) VISIBLE)
            ENGINE = InnoDB;`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sanweb_maindb"."parceiro";`);
    }
}
