import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'node:crypto';
import { HashingService } from './hashing.service';

@Injectable()
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

    encrypt(text: string) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(
            this.algorithm,
            this.key,
            iv,
        ) as crypto.CipherGCM;

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag();

        return {
            encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex'),
        };
    }

    decrypt(encrypted: string, iv: string, authTag: string) {
        const decipher = crypto.createDecipheriv(
            this.algorithm,
            this.key,
            Buffer.from(iv, 'hex'),
        ) as crypto.DecipherGCM;

        decipher.setAuthTag(Buffer.from(authTag, 'hex'));

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }
}
