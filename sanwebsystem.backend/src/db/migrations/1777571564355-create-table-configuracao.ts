import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableConfiguracao1777571564355 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "sanweb_maindb"."configuracao" (
                "ID" BIGINT NOT NULL,
                "email_remetente" VARCHAR(256) NOT NULL,
                "nome_remetente" VARCHAR(50) NOT NULL,
                "servidor_SMTP" VARCHAR(256) NOT NULL,
                "porta_SMTP" INT NOT NULL,
                "tipo_auth" ENUM('BASIC', 'OAUTH') NOT NULL,
                "oauth" BIT NOT NULL,
                "senha" VARCHAR(256) NULL,
                CONSTRAINT "PK_configuracao" PRIMARY KEY ("ID"))
            ENGINE = InnoDB;`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sanweb_maindb"."configuracao";`);
    }
}
