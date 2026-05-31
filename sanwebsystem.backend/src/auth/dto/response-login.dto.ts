import { SignedUserDto } from './signeduser.dto';

export class ResponseLoginDto {
    token: string | undefined;
    refreshToken: string | undefined;
    signedUser: SignedUserDto | undefined;
    msgErro: string | undefined;
}
