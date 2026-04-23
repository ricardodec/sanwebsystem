import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableFeriado1777571863482 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "sanweb_maindb"."feriado" (
                "data" DATE NOT NULL,
                "nome" VARCHAR(50) NOT NULL,
                CONSTRAINT "PK_feriado" PRIMARY KEY ("data"))
            ENGINE = InnoDB;`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sanweb_maindb"."feriado";`);
    }
}
