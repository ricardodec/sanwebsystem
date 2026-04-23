import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableAmbiente1777480658970 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "sanweb_maindb"."ambiente" (
                "ID" BIGINT NOT NULL,
                "descricao" VARCHAR(50) NOT NULL,
                "data_base" DATE NULL,
                "ativo" BIT NOT NULL,
                CONSTRAINT "PK_ambiente" PRIMARY KEY ("ID"))
            ENGINE = InnoDB;`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sanweb_maindb"."ambiente";`);
    }
}
