import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableAcaoComponente1777481658516 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "sanweb_maindb"."acao_componente" (
                "componente_ID" BIGINT NOT NULL,
                "acao_ID" BIGINT NOT NULL,
                "ativo" BIT NOT NULL,
                CONSTRAINT "PK_acao_componente" PRIMARY KEY ("componente_ID", "acao_ID"),
                INDEX "IDX_acao_componente_componente_ID" ("componente_ID" ASC) VISIBLE,
                INDEX "IDX_acao_componente_acao_ID" ("acao_ID" ASC) VISIBLE,
                CONSTRAINT "FK_acao_componente_acao_ID"
                    FOREIGN KEY ("acao_ID")
                    REFERENCES "sanweb_maindb"."acao" ("ID")
                        ON DELETE CASCADE
                        ON UPDATE NO ACTION,
                CONSTRAINT "FK_acao_componente_componente_ID"
                    FOREIGN KEY ("componente_ID")
                    REFERENCES "sanweb_maindb"."componente" ("ID")
                        ON DELETE CASCADE
                        ON UPDATE NO ACTION)
            ENGINE = InnoDB;`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP TABLE "sanweb_maindb"."acao_componente";`,
        );
    }
}
