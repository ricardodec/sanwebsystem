import { SignedUserDto } from './signeduser.dto';

export class ResponseValidateTfaDto {
    signedUser: SignedUserDto | undefined;
    token: string | null | undefined;
    msgError: string | null | undefined;
}
