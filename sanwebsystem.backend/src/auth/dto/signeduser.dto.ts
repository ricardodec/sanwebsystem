export class SignedUserDto {
    login: string | undefined;
    senha: string | undefined;
    trocarSenha: boolean | undefined;
    nome: string | undefined;
    email: string | undefined;
    ehControlador: boolean | undefined;
    tfa: boolean | undefined;
    tfaTipo?: number | null;
    tfaKey?: string | null;
    tfaEntryKey?: string | null;
    tfaQrCodeImageUrl?: string | null;
    foto?: string | null;
    fotoMimetype?: string | null;
}
