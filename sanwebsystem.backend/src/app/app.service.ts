import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SignedUserDto } from '../auth/dto/signeduser.dto';
import { NOME_EMPRESA, NOME_SISTEMA } from '../common/app.constant';

@Injectable()
export class AppService {
    constructor(private readonly mailerService: MailerService) {}

    getHello(): string {
        return 'Hello World!';
    }

    sendTfaEmail(usuario: SignedUserDto): void {
        const body =
            '<p>' +
            'Prezado, ' +
            usuario.nome +
            '.<br/><br/>' +
            'Segue código de confirmação de acesso ao nosso sistema.<br/>' +
            'Código: ' +
            usuario.tfaKey +
            '<br/><br/>' +
            'Att,<br/>' +
            NOME_EMPRESA +
            '</p>';

        this.mailerService
            .sendMail({
                to: usuario.email,
                from: 'admin@sanwebsystem.com.br',
                subject: NOME_SISTEMA + ' - Código de autenticação',
                html: body,
            })
            .then((success) => {
                console.log(success);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}
