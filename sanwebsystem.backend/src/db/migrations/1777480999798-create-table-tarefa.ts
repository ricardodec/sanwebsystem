import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableTarefa1777480999798 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS tarefa (
                ID BIGINT NOT NULL,
                ambiente_ID BIGINT NOT NULL,
                nome VARCHAR(50) NOT NULL,
                tempo_execucao VARCHAR(20) NULL,
                ultima_execucao DATETIME NULL,
                status ENUM('ANDAMENTO', 'COMPLETO', 'ERRO') NULL,
                CONSTRAINT PK_tarefa PRIMARY KEY (ID),
                INDEX IDX_tarefa_ambiente_ID (ambiente_ID ASC) VISIBLE,
                CONSTRAINT FK_tarefa_ambiente_ID
                    FOREIGN KEY (ambiente_ID)
                    REFERENCES ambiente (ID)
                        ON DELETE NO ACTION
                        ON UPDATE NO ACTION)
            ENGINE = InnoDB;`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE tarefa;`);
    }
}
