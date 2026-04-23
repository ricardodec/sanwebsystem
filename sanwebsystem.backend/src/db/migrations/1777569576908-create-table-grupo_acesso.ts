import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableGrupoAcesso1777569576908 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "sanweb_maindb"."grupo_acesso" (
                "ID" BIGINT NOT NULL,
                "parceiro_ID" BIGINT NOT NULL,
                "nome" VARCHAR(50) NOT NULL,
                "ativo" BIT NOT NULL,
                CONSTRAINT "PK_grupo_acesso" PRIMARY KEY ("ID")
                INDEX "IDX_grupo_acesso_parceiro_ID" ("parceiro_ID" ASC) VISIBLE,
                CONSTRAINT "FK_grupo_acesso_parceiro_ID"
                    FOREIGN KEY ("parceiro_ID")
                    REFERENCES "sanweb_maindb"."parceiro" ("ID")
                        ON DELETE NO ACTION
                        ON UPDATE NO ACTION)
            ENGINE = InnoDB;`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sanweb_maindb"."grupo_acesso";`);
    }
}
