import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableModuloParceiro1777568851094 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "sanweb_maindb"."modulo_parceiro" (
                "modulo_ID" BIGINT NOT NULL,
                "parceiro_ID" BIGINT NOT NULL,
                "ativo" BIT NOT NULL,
                CONSTRAINT "PK_modulo_parceiro" PRIMARY KEY ("modulo_ID", "parceiro_ID")
                INDEX "IDX_modulo_parceiro_modulo_ID" ("modulo_ID" ASC) VISIBLE,
                INDEX "IDX_modulo_parceiro_parceiro_ID" ("parceiro_ID" ASC) VISIBLE,
                CONSTRAINT "FK_modulo_parceiro_modulo_ID"
                    FOREIGN KEY ("modulo_ID")
                    REFERENCES "sanweb_maindb"."modulo" ("ID")
                        ON DELETE NO ACTION
                        ON UPDATE NO ACTION,
                CONSTRAINT "FK_modulo_parceiro_parceiro_ID"
                    FOREIGN KEY ("parceiro_ID")
                    REFERENCES "sanweb_maindb"."parceiro" ("ID")
                        ON DELETE NO ACTION
                        ON UPDATE NO ACTION)
            ) ENGINE = InnoDB;`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP TABLE "sanweb_maindb"."modulo_parceiro";`,
        );
    }
}
