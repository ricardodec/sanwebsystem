declare namespace Auth {

    interface ILoginUser {
        login: string;
        nome: string;
        email: string;
    }

    type TFATipo = 1 | 2;

    interface ISignedUser {
        login: string;
        senha: string;
        trocarSenha: boolean;
        nome: string;
        email: string;
        ehControlador: boolean;
        tfa: boolean;
        tfaTipo?: TFATipo | null;
        tfaKey?: string | null;
        tfaEntryKey?: string | null;
        tfaQrCodeImageUrl?: string | null;
        foto?: string | null;
        fotoMimeType?: string | null;
    }

    interface IGeraChaveTFA {
        isErro: boolean;
        loginVo: Auth.ISignedUser;
        login: string;
        email: ObjectForm;
    }

    interface IUsuario extends ISignedUser {
        id: number;
        dateSenha: Date;
        salt: string;
        tfaKeyDataHora?: Date | null;
        ativo: boolean;
    }

    type Usuario = IUsuario;
    
    interface ICadastroUsuario {
        isErro: boolean;
        id: number;
        parceiroId: number;
        login: ObjectForm;
        senha: ObjectForm;
        nome: ObjectForm;
        email: ObjectForm;
        ehControlador: ObjectForm;
        ativo: ObjectForm;
        tfaKey: string | null;
        tfaEntryKey: string | null;
        tfaQrCodeImageUrl: string | null;
        tfa: ObjectForm;
        tfaTipo: ObjectForm;
        foto: ObjectForm;
        fotoMimeType: ObjectForm;
        enviarEmailSenha: boolean;
        tfaTipoLista: ObjectOption<string>[];
    }

    type AuthContextProps = {
        parametro: Control.IParametro | null;
        signedUser: Auth.ISignedUser | null;
        parceiro: Control.IParceiro | null;
        token: string | null;
    }
}