import { Column, Entity } from 'typeorm';

export enum PeriodicidadeRole {
    DIARIA = 0,
    MENSAL = 1,
    ANUAL = 2,
}

export enum TipoJurosRole {
    SIMPLES = 0,
    COMPOSTO = 1,
}

@Entity('padrao')
export class Padrao {
    @Column({
        name: 'ID',
        type: 'bigint',
        primary: true,
        primaryKeyConstraintName: 'PK_padrao',
    })
    id: number = 0;

    @Column({ name: 'parceiro_ID', type: 'bigint' })
    parceiroId: number = 0;

    @Column({ name: 'fator_mes', type: 'decimal', precision: 7, scale: 4 })
    fatorMes: number = 0;

    @Column({ name: 'iof', type: 'decimal', precision: 7, scale: 4 })
    iof: number = 0;

    @Column({ name: 'iof_diario', type: 'decimal', precision: 7, scale: 4 })
    iofDiario: number = 0;

    @Column({ name: 'ad_valorem', type: 'decimal', precision: 11, scale: 4 })
    adValorem: number = 0;

    @Column({ name: 'dias_float', type: 'tinyint' })
    diasFloat: number = 0;

    @Column({ name: 'ISS', type: 'decimal', precision: 7, scale: 4 })
    iss: number = 0;

    @Column({ name: 'PIS_PASEP', type: 'decimal', precision: 7, scale: 4 })
    pisPasep: number = 0;

    @Column({ name: 'COFINS', type: 'decimal', precision: 7, scale: 4 })
    cofins: number = 0;

    @Column({ name: 'taxa_juros', type: 'decimal', precision: 11, scale: 8 })
    taxaJuros: number = 0;

    @Column({
        name: 'periodicidade',
        type: 'enum',
        enum: PeriodicidadeRole,
        default: PeriodicidadeRole.MENSAL,
    })
    periodicidade: PeriodicidadeRole = PeriodicidadeRole.MENSAL;

    @Column({
        name: 'tipo_juros',
        type: 'enum',
        enum: TipoJurosRole,
        default: TipoJurosRole.COMPOSTO,
    })
    tipoJuros: TipoJurosRole = TipoJurosRole.COMPOSTO;

    @Column({ name: 'mora', type: 'decimal', precision: 11, scale: 8 })
    mora: number = 0;

    @Column({ name: 'multa', type: 'decimal', precision: 11, scale: 8 })
    multa: number = 0;

    @Column({
        name: 'juros_prorrogacao',
        type: 'decimal',
        precision: 11,
        scale: 8,
    })
    jurosProrrogacao: number = 0;

    @Column({ name: 'dados_json', type: 'json', nullable: true })
    dadosJson?: string | null = null;
}
