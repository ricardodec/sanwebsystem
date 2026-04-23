import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablePasswordHistory1773959498912 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sanweb_maindb"."password_history" (
            "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
            "user_id" uuid NOT NULL,
            "password_datetime" timestamp NOT NULL,
            "password" varchar(255) NOT NULL,
            "salt" varchar(255) NOT NULL,
            CONSTRAINT "PK_password_history" PRIMARY KEY (id)
        );`,
    );

    await queryRunner.query(
      `ALTER TABLE "sanweb_maindb"."password_history"
        ADD CONSTRAINT "FK_password_history_user_id" FOREIGN KEY ("user_id")
            REFERENCES "sanweb_maindb"."user" ("id") ON DELETE CASCADE;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "sanweb_maindb"."password_history"`);
  }
}
