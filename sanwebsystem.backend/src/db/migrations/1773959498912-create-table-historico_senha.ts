import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablePasswordHistory1773959498912 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE historico_senha (
                ID BIGINT NOT NULL,
                usuario_ID BIGINT NOT NULL,
                data_senha DATE NOT NULL,
                senha VARCHAR(256) NOT NULL,
                CONSTRAINT PK_historico_senha PRIMARY KEY (ID),
                INDEX IDX_historico_senha_usuario_ID (usuario_ID ASC) INVISIBLE,
                INDEX IDX_historico_senha_usuario (usuario_ID ASC, data_senha DESC) VISIBLE,
                CONSTRAINT FK_historico_senha_usuario_ID
                  FOREIGN KEY (usuario_ID)
                  REFERENCES usuario (ID)
                  ON DELETE CASCADE
                  ON UPDATE NO ACTION)
              ENGINE = InnoDB;`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE historico_senha;`);
    }
}
