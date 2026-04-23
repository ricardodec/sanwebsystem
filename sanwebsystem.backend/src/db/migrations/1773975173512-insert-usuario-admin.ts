import { SnowflakeId } from '@akashrajpurohit/snowflake-id';
import * as bcrypt from 'bcryptjs';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertUsuarioAdmin1773975173512 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const salt = await bcrypt.genSalt();
        const passwordHashed = await bcrypt.hash('123456', salt);
        const id = Number(SnowflakeId().generate());

        await queryRunner.query(
            `INSERT INTO "sanweb_maindb"."usuario"
              ("ID", "login", "data_senha", "senha", "salt", "trocar_senha", "nome", "email", "eh_controlador",
                  "tfa", "tfa_tipo", "tfa_key", "tfa_key_data_hora", "tfa_entry_key", "tfa_qrcode_image_url", "ativo",
                  "foto", "foto_mimetype")
              VALUES (${id}, 'admin', '2026-03-19 00:00:00', '${passwordHashed}', '${salt}', false, 'Admin', 'ricardodec@gmail.com', true,
                  false, NULL, NULL, NULL, NULL, NULL, true,
                  NULL, NULL);`,
        );

        await queryRunner.query(
            `INSERT INTO "sanweb_maindb"."historico_senha"
              ("ID", "usuario_ID", "data_senha", "senha", "salt")
              VALUES (${Number(SnowflakeId().generate())}, ${id}, '2026-03-19 00:00:00', '${passwordHashed}', '${salt}');`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM "sanweb_maindb"."usuario" WHERE "login" = "admin";`,
        );
    }
}
