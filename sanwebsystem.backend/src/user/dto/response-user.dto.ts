export class ResponseUserDto {
  id: string;
  login: string;
  passwordDatetime: string;
  password: string;
  salt: string;
  isMustPasswordChange: boolean;
  name: string;
  email: string;
  isController: boolean;
  isTfaActive: boolean;
  tfaType: number | null;
  tfaKey?: string | null;
  tfaKeyDatetime?: string | null;
  tfaEntryKey?: string | null;
  tfaQrcodeImageUrl?: string | null;
  isActive: boolean;
  photo?: string | null;
  photoMimetype?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
