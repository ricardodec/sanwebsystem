import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableModulo1777481911771 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "sanweb_maindb"."modulo" (
                "ID" BIGINT NOT NULL,
                "nome" VARCHAR(50) NOT NULL,
                "ativo" BIT NOT NULL,
                CONSTRAINT "PK_modulo" PRIMARY KEY ("ID"))
            ENGINE = InnoDB;`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sanweb_maindb"."modulo";`);
    }
}
