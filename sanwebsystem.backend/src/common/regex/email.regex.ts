import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { IRegexProtocol } from './regex-protocol';

@Injectable()
export class EmailRegex implements IRegexProtocol {
  execute(value: string): string {
    const regex = new RegExp(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    );
    return regex.test(value) ? 'Email válido' : 'Email inválido';
  }
}
