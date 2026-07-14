import { SnowflakeId } from '@akashrajpurohit/snowflake-id';
import { DataSource } from 'typeorm';
import { GrupoAcesso } from '../entities/grupo_acesso.entity';

export const seedGrupoAcesso = async (
    dataSource: DataSource,
    parceiroId: number | null,
): Promise<void> => {
    const grupoAcessoRepository = dataSource.getRepository(GrupoAcesso);

    await grupoAcessoRepository.save({
        ID: Number(SnowflakeId().generate()),
        parceiro_ID: parceiroId,
        nome: 'Assistência Operacional',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        ID: Number(SnowflakeId().generate()),
        parceiro_ID: parceiroId,
        nome: 'Confirmação',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        ID: Number(SnowflakeId().generate()),
        parceiro_ID: parceiroId,
        nome: 'Crédito',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        ID: Number(SnowflakeId().generate()),
        parceiro_ID: parceiroId,
        nome: 'Diretoria Executiva',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        ID: Number(SnowflakeId().generate()),
        parceiro_ID: parceiroId,
        nome: 'Diretoria Operacional',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        ID: Number(SnowflakeId().generate()),
        parceiro_ID: parceiroId,
        nome: 'Financeiro',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        ID: Number(SnowflakeId().generate()),
        parceiro_ID: parceiroId,
        nome: 'Formalização',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        ID: Number(SnowflakeId().generate()),
        parceiro_ID: parceiroId,
        nome: 'Gerência Comercial',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        ID: Number(SnowflakeId().generate()),
        parceiro_ID: parceiroId,
        nome: 'Monitoramento',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        ID: Number(SnowflakeId().generate()),
        parceiro_ID: parceiroId,
        nome: 'Operações',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        ID: Number(SnowflakeId().generate()),
        parceiro_ID: parceiroId,
        nome: 'RH',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        ID: Number(SnowflakeId().generate()),
        parceiro_ID: parceiroId,
        nome: 'Superintendência Comercial',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        ID: Number(SnowflakeId().generate()),
        parceiro_ID: parceiroId,
        nome: 'Suporte Comercial',
        ativo: true,
    } as GrupoAcesso);

    await grupoAcessoRepository.save({
        ID: Number(SnowflakeId().generate()),
        parceiro_ID: parceiroId,
        nome: 'TI',
        ativo: true,
    } as GrupoAcesso);
};
