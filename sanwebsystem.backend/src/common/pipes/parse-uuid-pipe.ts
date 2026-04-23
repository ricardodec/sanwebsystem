import {
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class ParseUuidPipe implements PipeTransform<string, number> {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (metadata.type !== 'param' || metadata.data !== 'id') {
      return value;
    }
    const val = uuidValidate(value);

    if (!val) {
      throw new BadRequestException(
        `Validation failed (UUID string is expected): ${JSON.stringify(metadata)}`,
      );
    }

    return val;
  }
}
