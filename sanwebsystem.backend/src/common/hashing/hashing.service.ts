import { AppConfig } from '../app.config';

export abstract class HashingService {
    protected readonly algorithm: string = 'aes-256-gcm';
    protected readonly key: Buffer<ArrayBuffer>;

    constructor() {
        const config = AppConfig.getConstants();
        // node -e "console.log(require('crypto').randomBytes(32).toString('hex')) => ENCRYPTION_KEY"
        this.key = Buffer.from(config.EncryptionKey, 'hex');
    }

    abstract hash(password: string): Promise<{
        passwordHashed: string;
        salt?: string;
    }>;

    abstract compare(
        password: string,
        passwordHashed: string,
    ): Promise<boolean>;

    abstract encrypt(text: string): {
        encrypted: string;
        iv: string;
        authTag: string;
    };

    abstract decrypt(encrypted: string, iv: string, authTag: string): string;
}
