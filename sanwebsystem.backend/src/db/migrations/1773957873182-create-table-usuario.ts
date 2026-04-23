import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUser1773957873182 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "sanweb_maindb"."usuario" (
                "ID" BIGINT NOT NULL,
                "login" VARCHAR(50) NOT NULL,
                "data_senha" DATE NOT NULL,
                "senha" VARCHAR(256) NOT NULL,
                "salt" VARCHAR(256) NOT NULL,
                "trocar_senha" BIT NOT NULL,
                "nome" VARCHAR(50) NOT NULL,
                "email" VARCHAR(256) NOT NULL,
                "eh_controlador" BIT NOT NULL,
                "tfa" BIT NOT NULL,
                "tfa_tipo" ENUM('google', 'email') NULL,
                "tfa_key" VARCHAR(32) NULL,
                "tfa_key_data_hora" DATETIME NULL,
                "tfa_entry_key" VARCHAR(52) NULL,
                "tfa_qrcode_image_url" BLOB NULL,
                "ativo" BIT NOT NULL,
                "foto" MEDIUMBLOB NULL,
                "foto_mimetype" VARCHAR(20) NULL,
                CONSTRAINT "PK_usuario" PRIMARY KEY ("ID"),
                UNIQUE INDEX "IDX_usuario_login" ("login" ASC) VISIBLE)
            ENGINE = InnoDB;`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sanweb_maindb"."usuario";`);
    }
}
