import { randomUUID } from 'crypto';
import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export class InsertUserAdmin1773975173512 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const salt = await bcrypt.genSalt();
    const passwordHashed = await bcrypt.hash('123456', salt);
    const id = randomUUID();

    await queryRunner.query(
      `INSERT INTO "sanweb_maindb"."user"
        ("id", "login", "password_datetime", "password", "salt", "must_password_change", "name", "email", "controller",
            "tfa_active", "tfa_type", "tfa_key", "tfa_key_datetime", "tfa_entry_key", "tfa_qrcode_image_url", "active",
            "photo", "photo_mimetype")
        VALUES ('${id}', 'admin', '2026-03-19 00:00:00', '${passwordHashed}', '${salt}', false, 'Admin', 'ricardodec@gmail.com', true,
            false, '0'::"sanweb_maindb"."tfa_type_enum", NULL, NULL, NULL, NULL, true,
            NULL, NULL);`,
    );

    await queryRunner.query(
      `INSERT INTO "sanweb_maindb"."password_history"
        ("id", "user_id", "password_datetime", "password", "salt")
        VALUES (uuid_generate_v4(), '${id}', '2026-03-19 00:00:00', '${passwordHashed}', '${salt}');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "sanweb_maindb"."user" WHERE "login" = "admin";`,
    );
  }
}
