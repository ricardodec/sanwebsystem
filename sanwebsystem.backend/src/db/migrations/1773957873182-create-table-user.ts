import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUser1773957873182 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "sanweb_maindb"."tfa_type_enum" AS ENUM ('0', '1', '2');`,
    );

    await queryRunner.query(
      `CREATE TABLE "sanweb_maindb"."user" (
            "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
            "login" varchar(50) NOT NULL,
            "password_datetime" timestamp NOT NULL,
            "password" varchar(255) NOT NULL,
            "salt" varchar(255) NOT NULL,
            "must_password_change" bool DEFAULT false NOT NULL,
            "name" varchar(50) NOT NULL,
            "email" varchar(100) NOT NULL,
            "controller" bool DEFAULT false NOT NULL,
            "tfa_active" bool DEFAULT false NOT NULL,
            "tfa_type" sanweb_maindb."tfa_type_enum" DEFAULT '0'::sanweb_maindb.tfa_type_enum NOT NULL,
            "tfa_key" varchar(32) NULL,
            "tfa_key_datetime" timestamp NULL,
            "tfa_entry_key" varchar(52) NULL,
            "tfa_qrcode_image_url" bytea NULL,
            "active" bool DEFAULT false NOT NULL,
            "photo" bytea NULL,
            "photo_mimetype" varchar(20) NULL,
            CONSTRAINT "PK_user" PRIMARY KEY (id),
            CONSTRAINT "UQ_user_login" UNIQUE (login)
        );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "sanweb_maindb"."user";`);
    await queryRunner.query(`DROP TYPE "sanweb_maindb"."tfa_type_enum";`);
  }
}
