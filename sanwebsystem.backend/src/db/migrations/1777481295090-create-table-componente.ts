import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableComponente1777481295090 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "sanweb_maindb"."componente" (
                "ID" BIGINT NOT NULL,
                "superior_ID" BIGINT NULL,
                "ambiente_ID" BIGINT NOT NULL,
                "nome" VARCHAR(50) NOT NULL,
                "icon" VARCHAR(50) NULL,
                "to" VARCHAR(50) NULL,
                "url" VARCHAR(256) NULL,
                "target" VARCHAR(50) NULL,
                "menu" BIT NOT NULL,
                "ativo" BIT NOT NULL,
                CONSTRAINT "PK_componente" PRIMARY KEY ("ID"),
                INDEX "IDX_componente_superior_componente_ID" ("superior_ID" ASC) VISIBLE,
                INDEX "IDX_componente_ambiente_ID" ("ambiente_ID" ASC) VISIBLE,
                CONSTRAINT "FK_componente_superior_componente_ID"
                    FOREIGN KEY ("superior_ID")
                    REFERENCES "sanweb_maindb"."componente" ("ID")
                        ON DELETE NO ACTION
                        ON UPDATE NO ACTION,
                CONSTRAINT "FK_componente_ambiente_ID"
                    FOREIGN KEY ("ambiente_ID")
                    REFERENCES "sanweb_maindb"."ambiente" ("ID")
                        ON DELETE NO ACTION
                        ON UPDATE NO ACTION)
                ENGINE = InnoDB;`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sanweb_maindb"."componente";`);
    }
}
