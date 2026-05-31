import { ObjectForm } from '@/src/common/dto/object-form.dto';
import { SignedUserDto } from './signeduser.dto';

export class ResponseTfaDto {
    signedUser: SignedUserDto | undefined;
    login: string | undefined;
    email: ObjectForm<string> | undefined;
}
