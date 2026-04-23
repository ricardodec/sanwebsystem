import { HashingService } from './hashing.service';
import * as bcrypt from 'bcryptjs';

export class CryptService extends HashingService {
  async hash(password: string): Promise<{
    passwordHashed: string;
    salt?: string;
  }> {
    const salt = await bcrypt.genSalt();
    return {
      passwordHashed: await bcrypt.hash(password, salt),
      salt: salt,
    };
  }

  async compare(password: string, passwordHashed: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordHashed);
  }
}
