import { TfaTypeRole } from '@/src/db/entities/usuario.entity';
import { Injectable } from '@nestjs/common';
import { Secret, TOTP } from '@otp-lib/authenticator';
import * as QRCode from 'qrcode';
import { NOME_SISTEMA, TAMANHO_CHAVE_TFA } from '../app.constant';

@Injectable()
export class TwoFactorService {
    async generate(email: string, tfaType: TfaTypeRole) {
        let key: string | null = null;
        let entryKey: string | null = null;
        let qrCodeImageUrl: Buffer | null = null;

        if (tfaType === TfaTypeRole.EMAIL) {
            const soma = Number('1' + '0'.repeat(TAMANHO_CHAVE_TFA - 1));
            const multiplica = Number('9' + '0'.repeat(TAMANHO_CHAVE_TFA - 1));

            key = Math.floor(soma + Math.random() * multiplica).toString();
        } else if (tfaType === TfaTypeRole.AUTHENTICATOR) {
            const secret = Secret.create();

            const setupInfo = new TOTP({
                account: email,
                issuer: NOME_SISTEMA,
                secret: secret,
            });

            key = secret.toBase64();
            entryKey = setupInfo.toURI();
            qrCodeImageUrl = Buffer.from(
                await QRCode.toDataURL(entryKey),
                'utf-8',
            );
        }

        return {
            key,
            entryKey,
            qrCodeImageUrl,
        };
    }

    isTfaKeyExpired(type: TfaTypeRole, createdAt?: Date): boolean {
        if (type !== TfaTypeRole.EMAIL) return false;
        if (!type || !createdAt) return true;

        const expiredAt = new Date();
        expiredAt.setMinutes(createdAt?.getMinutes() + 10);

        return createdAt <= expiredAt;
    }

    async keyIsValid(
        email: string,
        code: string,
        key: string,
        tfaType: TfaTypeRole,
    ) {
        let isValid = false;

        if (tfaType === TfaTypeRole.EMAIL) {
            isValid = key === code;
        } else if (tfaType === TfaTypeRole.AUTHENTICATOR) {
            const setupInfo = new TOTP({
                account: email,
                issuer: NOME_SISTEMA,
                secret: Secret.fromBase64(key),
            });

            isValid = await setupInfo.verify(code);
        }

        return isValid;
    }
}
