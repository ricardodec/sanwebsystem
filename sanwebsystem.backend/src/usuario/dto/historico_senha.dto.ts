export class HistoricoSenhaDto {
    id: number | undefined;
    usuarioId: number | undefined;
    dataSenha: Date | undefined;
    senha?: string | null;
    salt?: string | null;
}
