import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableVariavel1777571397579 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "sanweb_maindb"."variavel" (
                "ID" BIGINT NOT NULL,
                "tag" VARCHAR(50) NOT NULL,
                "descricao" VARCHAR(100) NOT NULL,
                CONSTRAINT "PK_variavel" PRIMARY KEY ("ID"))
            ENGINE = InnoDB;`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sanweb_maindb"."variavel";`);
    }
}
