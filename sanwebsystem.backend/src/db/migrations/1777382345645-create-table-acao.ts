import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableAcao1777382345645 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "sanweb_maindb"."acao" (
                "ID" BIGINT NOT NULL,
                "nome" VARCHAR(50) NOT NULL,
                CONSTRAINT "PK_acao" PRIMARY KEY ("ID"))
            ENGINE = InnoDB;`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sanweb_maindb"."acao";`);
    }
}
