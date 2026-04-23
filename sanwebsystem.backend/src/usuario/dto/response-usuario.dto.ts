import { HistoricoSenhaDto } from './historico_senha.dto';

export class ResponseUsuarioDto {
    id: string | undefined;
    login: string | undefined;
    dataSenha: string | undefined;
    senha: string | undefined;
    salt: string | undefined;
    trocarSenha: boolean | undefined;
    nome: string | undefined;
    email: string | undefined;
    ehControlador: boolean | undefined;
    tfa: boolean | undefined;
    tfaTipo: number | null | undefined;
    tfaKey?: string | null;
    tfaKeyDataHora?: string | null;
    tfaEntryKey?: string | null;
    tfaQrcodeImageUrl?: string | null;
    ativo: boolean | undefined;
    foto?: string | null;
    fotoMimetype?: string | null;
    historicoSenha?: HistoricoSenhaDto[] | null;
}
