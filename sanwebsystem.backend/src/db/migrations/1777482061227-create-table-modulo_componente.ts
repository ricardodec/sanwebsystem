import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableModuloComponente1777482061227 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "sanweb_maindb"."modulo_componente" (
                "modulo_ID" BIGINT NOT NULL,
                "componente_ID" BIGINT NOT NULL,
                "ativo" BIT NOT NULL,
                CONSTRAINT "PK_modulo_componente" PRIMARY KEY ("modulo_ID", "componente_ID"),
                INDEX "IDX_modulo_componente_modulo_ID" ("modulo_ID" ASC) VISIBLE,
                INDEX "IDX_modulo_componente_componente_ID" ("componente_ID" ASC) VISIBLE,
                CONSTRAINT "FK_modulo_componente_modulo_ID"
                    FOREIGN KEY ("modulo_ID")
                    REFERENCES "sanweb_maindb"."modulo" ("ID")
                        ON DELETE CASCADE
                        ON UPDATE NO ACTION,
                CONSTRAINT "FK_modulo_componente_componente_ID"
                    FOREIGN KEY ("componente_ID")
                    REFERENCES "sanweb_maindb"."componente" ("ID")
                        ON DELETE CASCADE
                        ON UPDATE NO ACTION)
            ENGINE = InnoDB;`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP TABLE "sanweb_maindb"."modulo_componente";`,
        );
    }
}
