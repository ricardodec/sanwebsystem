import { Injectable } from '@nestjs/common';
import { IRegexProtocol } from './regex-protocol';
import { REGEX_EMAIL_PROTOCOL, REGEX_PASSWORD_PROTOCOL } from '../app.constant';
import { PasswordRegex } from './password.regex';
import { EmailRegex } from './email.regex';

export type ClassNames =
  | typeof REGEX_EMAIL_PROTOCOL
  | typeof REGEX_PASSWORD_PROTOCOL;

@Injectable()
export class RegexFactory {
  static create(className: ClassNames): IRegexProtocol | undefined {
    switch (className) {
      case REGEX_EMAIL_PROTOCOL:
        return new EmailRegex();
      case REGEX_PASSWORD_PROTOCOL:
        return new PasswordRegex();
      default:
        return undefined;
    }
  }
}
