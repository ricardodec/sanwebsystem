import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableGrupoAcessoAcao1777570793325 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "sanweb_maindb"."grupo_acesso_acao" (
                "grupo_acesso_ID" BIGINT NOT NULL,
                "componente_ID" BIGINT NOT NULL,
                "acao_ID" BIGINT NOT NULL,
                "ativo" BIT NOT NULL,
                CONSTRAINT "PK_grupo_acesso_acao" PRIMARY KEY ("grupo_acesso_ID", "componente_ID", "acao_ID"),
                INDEX "IDX_grupo_acesso_acao_componente" ("componente_ID" ASC, "acao_ID" ASC) INVISIBLE,
                INDEX "IDX_grupo_acesso_acao_grupo_acesso_ID" ("grupo_acesso_ID" ASC) VISIBLE,
                CONSTRAINT "FK_grupo_acesso_acao_componente"
                    FOREIGN KEY ("componente_ID" , "acao_ID")
                    REFERENCES "sanweb_maindb"."acao_componente" ("componente_ID" , "acao_ID")
                        ON DELETE NO ACTION
                        ON UPDATE NO ACTION,
                CONSTRAINT "FK_grupo_acesso_acao_grupo_acesso_ID"
                    FOREIGN KEY ("grupo_acesso_ID")
                    REFERENCES "sanweb_maindb"."grupo_acesso" ("ID")
                        ON DELETE NO ACTION
                        ON UPDATE NO ACTION)
            ENGINE = InnoDB;`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP TABLE "sanweb_maindb"."grupo_acesso_acao";`,
        );
    }
}
