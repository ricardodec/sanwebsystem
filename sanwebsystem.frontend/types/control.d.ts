declare namespace Control {

    type Operacao = 1 | 2 | 3;
    type TipoPessoa = 1 | 2 | 3;

    interface IParceiro {
        id: number;
        cnpjCpf: string;
        tipoPessoa: TipoPessoa;
        nome: string;
        operacao: Operacao;
        ativo: boolean;
        logo: string | null;
        logoMimeType: string | null;
        grupoAcessoLista?: IGrupoAcesso[];
    }

    interface IParametro {
        cicloSenha: number;
        numRepeticaoSenha: number;
        minTamanhoSenha: number;
        caracterMinusculo: boolean;
        caracterMaiusculo: boolean;
        caracterEspecial: boolean;
        caracterNumerico: boolean;
        linhasPorPagina: number;
    }

    interface IAcao {
        id: number;
        nome: string;
    }

    interface IComponente {
        id: number;
        superior: IComponente | null;
        nome: string;
        icon?: string;
        to?: string;
        url?: string;
        target?: string;
        ativo: boolean;
        acoes?: IAcaoComponente[];
        componentes?: IComponente[];
    }

    interface IModulo {
        nome: string;
        componentes: IComponente[];
    }

    interface IMenu {
        modulos: IModulo[];
    }

    interface IAcaoComponente {
        grupoAcessoId: number;
        componenteId: number;
        acao: IAcao;
        ativo: boolean;
        id?: string;
    }

    interface IGrupoAcesso {
        id: number;
        nome: string;
        ativo: boolean;
        acoes: IAcaoComponente[];
    }
}