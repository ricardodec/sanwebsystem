import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Acao } from './acao.entity';
import { Componente } from './componente.entity';
import { GrupoAcessoAcao } from './grupo_acesso_acao.entity';

@Entity('acao_componente', { schema: 'sanweb_maindb' })
export class AcaoComponente {
    @PrimaryColumn({ name: 'PK_acao_componente' })
    @Column({ name: 'componente_id', type: 'bigint' })
    componenteId: number = 0;

    @PrimaryColumn({ name: 'PK_acao_componente' })
    @Column({ name: 'acao_id', type: 'bigint' })
    acaoId: number = 0;

    @Column({ name: 'ativo', type: 'boolean', default: true })
    ativo: boolean = true;

    @ManyToOne(() => Componente, (componente) => componente.acaoComponente)
    @JoinColumn({ name: 'componente_id', referencedColumnName: 'id' })
    componente?: Promise<Componente>;

    @ManyToOne(() => Acao, (acao) => acao.acaoComponente)
    @JoinColumn({ name: 'acao_id', referencedColumnName: 'id' })
    acao?: Promise<Acao>;

    @ManyToOne(
        () => GrupoAcessoAcao,
        (grupoAcessoAcao) => grupoAcessoAcao.acaoComponente,
    )
    grupoAcessoAcao?: Promise<GrupoAcessoAcao>;
}
