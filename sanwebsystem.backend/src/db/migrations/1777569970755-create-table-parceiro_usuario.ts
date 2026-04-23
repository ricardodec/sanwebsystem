import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableParceiroUsuario1777569970755 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "sanweb_maindb"."parceiro_usuario" (
                "parceiro_ID" BIGINT NOT NULL,
                "usuario_ID" BIGINT NOT NULL,
                "perfil" ENUM('ADMINISTRATIVO', 'COMERCIAL', 'INVESTIDOR', 'CLINICA', 'OUTRO') NOT NULL,
                "grupo_acesso_ID" BIGINT NULL,
                "eh_responsavel" BIT NOT NULL,
                "ativo" BIT NOT NULL,
                CONSTRAINT "PK_parceiro_usuario" PRIMARY KEY ("parceiro_ID", "usuario_ID"),
                INDEX "IDX_parceiro_usuario_grupo_acesso_ID" ("grupo_acesso_ID" ASC) VISIBLE,
                INDEX "IDX_parceiro_usuario_parceiro_ID" ("parceiro_ID" ASC) VISIBLE,
                INDEX "IDX_parceiro_usuario_usuario_ID" ("usuario_ID" ASC) VISIBLE,
                CONSTRAINT "FK_parceiro_usuario_grupo_acesso_codigo"
                    FOREIGN KEY ("grupo_acesso_ID")
                    REFERENCES "sanweb_maindb"."grupo_acesso" ("ID")
                        ON DELETE NO ACTION
                        ON UPDATE NO ACTION,
                CONSTRAINT "FK_parceiro_usuario_parceiro_GUID"
                    FOREIGN KEY ("parceiro_ID")
                    REFERENCES "sanweb_maindb"."parceiro" ("ID")
                        ON DELETE NO ACTION
                        ON UPDATE NO ACTION,
                CONSTRAINT "FK_parceiro_usuario_usuario_GUID"
                    FOREIGN KEY ("usuario_ID")
                    REFERENCES "sanweb_maindb"."usuario" ("ID")
                        ON DELETE NO ACTION
                        ON UPDATE NO ACTION)
            ENGINE = InnoDB;`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP TABLE "sanweb_maindb"."parceiro_usuario";`,
        );
    }
}
