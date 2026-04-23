import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { IRegexProtocol } from './regex-protocol';

@Injectable()
export class PasswordRegex implements IRegexProtocol {
  execute(value: string): string {
    const regex = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    );
    return regex.test(value) ? 'Senha válida' : 'Senha inválida';
  }
}
