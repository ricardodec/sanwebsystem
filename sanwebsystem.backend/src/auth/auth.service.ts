import {
    Inject,
    Injectable,
    Scope,
    UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AppService } from '../app/app.service';
import { HashingService } from '../common/hashing/hashing.service';
import { TwoFactorService } from '../common/tfa/tfa.service';
import { Parametro } from '../db/entities/parametro.entity';
import { TfaTypeRole, Usuario } from '../db/entities/usuario.entity';
import jwtConfig from './config/jwt.config';
import { RefreshTokenDto } from './config/refresh-token.dto';
import { LoginDto } from './dto/login.dto';
import { ResponseLoginDto } from './dto/response-login.dto';
import { ResponseTfaDto } from './dto/response-tfa.dto';
import { ResponseTrocaSenhaDto } from './dto/response-trocasenha.dto';
import { SignedUserDto } from './dto/signeduser.dto';
import { TfaDto } from './dto/tfa.dto';
import { TrocaSenhaDto } from './dto/trocasenha.dto';

export const NUNCA_EXIGIR_TROCA_SENHA: number = 0;
export const NUNCA_PERMITIR_REPETICAO_SENHA: number = 0;
export const SEMPRE_PERMITIR_REPETICAO_SENHA: number = -1;

@Injectable({ scope: Scope.DEFAULT })
export class AuthService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
        @InjectRepository(Parametro)
        private readonly parametroRepository: Repository<Parametro>,
        @Inject(HashingService)
        private readonly hashingService: HashingService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly appService: AppService,
        private readonly jwtService: JwtService,
        private readonly dataSource: DataSource,
        private readonly twoFactorService: TwoFactorService,
    ) {}

    async getUserByLogin(login: string): Promise<Usuario> {
        const usuario = await this.usuarioRepository.findOne({
            where: { login },
        });

        if (!usuario) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        return usuario;
    }

    async getAuthUserByLogin(login: string, senha: string): Promise<Usuario> {
        const usuario = await this.getUserByLogin(login);

        if (!usuario.ativo) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const isValid = await this.hashingService.compare(
            senha ?? '',
            usuario?.senha ?? '',
        );

        if (!isValid) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        return usuario;
    }

    async generateJwtToken<T>(
        sub: string,
        expiresIn: number,
        payload?: T,
    ): Promise<string> {
        const token = await this.jwtService.signAsync(
            {
                sub,
                ...payload,
            },
            {
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                secret: this.jwtConfiguration.secret,
                expiresIn: expiresIn,
            } as JwtSignOptions,
        );

        return token;
    }

    async isDeveTrocarSenha(usuario: Usuario): Promise<boolean> {
        if (usuario.trocarSenha) {
            return true;
        }

        const parametro = await this.parametroRepository.findOne({});

        if (!parametro) {
            return true;
        }

        const today = new Date();
        const dataExpiracao =
            parametro.cicloSenha == NUNCA_EXIGIR_TROCA_SENHA
                ? today.setDate(today.getDate() + 1)
                : usuario.dataSenha.setDate(
                      today.getDate() + parametro.cicloSenha,
                  );

        return dataExpiracao <= today.getDate();
    }

    async createTokens(usuario: Usuario): Promise<{
        token: string | undefined;
        refreshToken: string | undefined;
    }> {
        const tokenPromise = this.generateJwtToken<Partial<Usuario>>(
            usuario.login,
            this.jwtConfiguration.ttl,
            { email: usuario.email },
        );

        const refreshTokenPromise = this.generateJwtToken<Partial<Usuario>>(
            usuario.login,
            this.jwtConfiguration.refreshTtl,
            { email: usuario.email },
        );

        const [token, refreshToken] = await Promise.all([
            tokenPromise,
            refreshTokenPromise,
        ]);

        return {
            token,
            refreshToken,
        };
    }

    async login(loginDto: LoginDto): Promise<ResponseLoginDto> {
        try {
            const usuario = await this.getAuthUserByLogin(
                loginDto.login as string,
                loginDto.senha as string,
            );

            const trocarSenha: boolean = await this.isDeveTrocarSenha(usuario);

            if (usuario.tfa) {
                return {
                    token: undefined,
                    refreshToken: undefined,
                    signedUser: {
                        login: usuario.login,
                        senha: usuario.senha,
                        trocarSenha: trocarSenha,
                        nome: usuario.nome,
                        email: usuario.email,
                        ehControlador: usuario.ehControlador,
                        tfa: usuario.tfa,
                        tfaTipo: usuario.tfaTipo,
                        tfaKey: usuario.tfaKey,
                        tfaEntryKey: usuario.tfaEntryKey,
                        tfaQrCodeImageUrl:
                            usuario.tfaQrcodeImageUrl?.toString('utf8'),
                        foto: usuario.foto?.toString('utf8'),
                        fotoMimetype: usuario.fotoMimetype,
                    },
                    msgErro: undefined,
                };
            }

            const { token, refreshToken } = await this.createTokens(usuario);

            return {
                token,
                refreshToken,
                signedUser: {
                    login: usuario.login,
                    senha: usuario.senha,
                    trocarSenha: trocarSenha,
                    nome: usuario.nome,
                    email: usuario.email,
                    ehControlador: usuario.ehControlador,
                    tfa: usuario.tfa,
                    tfaTipo: usuario.tfaTipo,
                    tfaKey: usuario.tfaKey,
                    tfaEntryKey: usuario.tfaEntryKey,
                    tfaQrCodeImageUrl:
                        usuario.tfaQrcodeImageUrl?.toString('utf8'),
                    foto: usuario.foto?.toString('utf8'),
                    fotoMimetype: usuario.fotoMimetype,
                },
                msgErro: undefined,
            };
        } catch (error: any) {
            if (error instanceof UnauthorizedException) {
                return {
                    token: undefined,
                    refreshToken: undefined,
                    signedUser: undefined,
                    msgErro: error.message,
                };
            }

            throw error;
        }
    }

    async trocarSenha(
        trocaSenhaDto: TrocaSenhaDto,
    ): Promise<ResponseTrocaSenhaDto> {
        const response: ResponseTrocaSenhaDto = {
            isErro: false,
            msgSenha: undefined,
            msgNovaSenha: undefined,
            msgConfirmaSenha: undefined,
        };

        try {
            const usuario = await this.getAuthUserByLogin(
                trocaSenhaDto.login as string,
                trocaSenhaDto.senha as string,
            );

            if (
                trocaSenhaDto.novaSenha === undefined ||
                trocaSenhaDto.novaSenha.length === 0
            ) {
                response.isErro = true;
                response.msgNovaSenha = 'A nova senha deve ser informada';
            } else if (trocaSenhaDto.novaSenha === usuario.senha) {
                response.isErro = true;
                response.msgNovaSenha =
                    'A nova senha deve ser diferente da senha atual';
            }

            if (
                trocaSenhaDto.confirmaSenha === undefined ||
                trocaSenhaDto.confirmaSenha.length === 0
            ) {
                response.isErro = true;
                response.msgConfirmaSenha =
                    'A confirmação da senha deve ser informada';
            } else if (
                trocaSenhaDto.novaSenha !== trocaSenhaDto.confirmaSenha
            ) {
                response.isErro = true;
                response.msgConfirmaSenha =
                    'A confirmação da senha não corresponde à nova senha';
            }

            if (!response.isErro) {
                const parametro = await this.parametroRepository.findOne({});

                if (!parametro) {
                    throw new Error('Parâmetro não identificado');
                }

                if (
                    trocaSenhaDto.novaSenha != undefined &&
                    trocaSenhaDto.novaSenha.length < parametro.minTamanhoSenha
                ) {
                    response.isErro = true;
                    response.msgNovaSenha = `A nova senha deve conter no mínimo ${parametro.minTamanhoSenha} caracteres`;
                } else {
                    const hash = await this.hashingService.hash(
                        trocaSenhaDto.novaSenha || '',
                    );

                    usuario.dataSenha = new Date();
                    usuario.trocarSenha = false;
                    usuario.senha = hash.passwordHashed;
                    usuario.salt = hash.salt;

                    await this.dataSource.transaction(async (manager) => {
                        const usuarioRepository_ =
                            manager.getRepository(Usuario);
                        const usuario_ = await usuarioRepository_.save(usuario);

                        return usuario_;
                    });
                }
            }
        } catch (error: any) {
            throw error;
        }

        return response;
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        token: string | undefined;
        refreshToken: string | undefined;
    }> {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const { sub } = await this.jwtService.verify(
                refreshTokenDto.refreshToken,
                this.jwtConfiguration,
            );

            const usuario = await this.getUserByLogin(sub as string);

            const { token, refreshToken } = await this.createTokens(usuario);

            return {
                token,
                refreshToken,
            };
        } catch (error: any) {
            throw new UnauthorizedException(error.message);
        }
    }

    async generateTfaCode(tfaDto: TfaDto): Promise<ResponseTfaDto> {
        const response: ResponseTfaDto = {
            signedUser: undefined,
            login: tfaDto.login,
            email: { value: tfaDto.email ?? '', message: '', isAlert: false },
        };

        const usuario = await this.getUserByLogin(tfaDto.login ?? '');

        if (!usuario.ativo) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        if (tfaDto.email !== usuario.email) {
            response.email = {
                value: tfaDto.email ?? '',
                message:
                    'O e-mail informado não corresponde ao e-mail do usuário',
                isAlert: true,
            };

            return response;
        }

        const { key, entryKey, qrCodeImageUrl } =
            await this.twoFactorService.generate(
                usuario.email,
                usuario.tfaTipo,
            );

        usuario.tfaKey = key;
        usuario.tfaEntryKey = entryKey;
        usuario.tfaQrcodeImageUrl = qrCodeImageUrl;
        usuario.tfaKeyDataHora = new Date();

        await this.usuarioRepository.save(usuario);

        response.signedUser = {
            login: usuario.login,
            senha: usuario.senha,
            trocarSenha: usuario.trocarSenha,
            nome: usuario.nome,
            email: usuario.email,
            ehControlador: usuario.ehControlador,
            tfa: usuario.tfa,
            tfaTipo: usuario.tfaTipo,
            tfaKey: usuario.tfaKey,
            tfaEntryKey: usuario.tfaEntryKey,
            tfaQrCodeImageUrl: usuario.tfaQrcodeImageUrl?.toString('utf8'),
            foto: usuario.foto?.toString('utf8'),
            fotoMimetype: usuario.fotoMimetype,
        };

        if (usuario.tfaTipo === TfaTypeRole.EMAIL) {
            this.appService.sendTfaEmail(response.signedUser);
        }

        return response;
    }

    async resetTfaCode(login: string): Promise<SignedUserDto> {
        const usuario = await this.getUserByLogin(login);

        usuario.tfa = true;
        usuario.tfaEntryKey = null;
        usuario.tfaQrcodeImageUrl = null;

        if (usuario.tfaTipo === TfaTypeRole.AUTHENTICATOR) {
            usuario.tfaTipo = TfaTypeRole.EMAIL;
            usuario.tfaKey = null;
            usuario.tfaKeyDataHora = null;
        } else if (usuario.tfaTipo === TfaTypeRole.EMAIL) {
            const { key } = await this.twoFactorService.generate(
                usuario.email,
                usuario.tfaTipo,
            );

            usuario.tfaKey = key;
            usuario.tfaKeyDataHora = new Date();
        }

        await this.usuarioRepository.save(usuario);

        const signedUser: SignedUserDto = {
            login: usuario.login,
            senha: usuario.senha,
            trocarSenha: usuario.trocarSenha,
            nome: usuario.nome,
            email: usuario.email,
            ehControlador: usuario.ehControlador,
            tfa: usuario.tfa,
            tfaTipo: usuario.tfaTipo,
            tfaKey: usuario.tfaKey,
            tfaEntryKey: null,
            tfaQrCodeImageUrl: null,
            foto: usuario.foto?.toString('utf8'),
            fotoMimetype: usuario.fotoMimetype,
        };

        if (usuario.tfaTipo === TfaTypeRole.EMAIL) {
            this.appService.sendTfaEmail(signedUser);
        }

        return signedUser;
    }

    async validateTfaCode(
        login: string,
        tfaCode: string,
    ): Promise<{
        signedUser: SignedUserDto;
        isAuthenticated: boolean;
        token: string | null;
        msgError: string | null;
    }> {
        const usuario = await this.getUserByLogin(login);
        const isExpired = this.twoFactorService.isTfaKeyExpired(
            usuario.tfaTipo,
            usuario.tfaKeyDataHora ?? undefined,
        );
        const isValid = await this.twoFactorService.keyIsValid(
            usuario.email,
            tfaCode,
            usuario.tfaKey ?? '',
            usuario.tfaTipo,
        );

        const signedUser: SignedUserDto = {
            login: usuario.login,
            senha: usuario.senha,
            trocarSenha: usuario.trocarSenha,
            nome: usuario.nome,
            email: usuario.email,
            ehControlador: usuario.ehControlador,
            tfa: usuario.tfa,
            tfaTipo: usuario.tfaTipo,
            tfaKey: usuario.tfaKey,
            tfaEntryKey: usuario.tfaEntryKey,
            tfaQrCodeImageUrl: usuario.tfaQrcodeImageUrl?.toString('utf8'),
            foto: usuario.foto?.toString('utf8'),
            fotoMimetype: usuario.fotoMimetype,
        };

        const isAuthenticated = isValid && !isExpired;

        const response: {
            signedUser: SignedUserDto;
            isAuthenticated: boolean;
            token: string | null;
            msgError: string | null;
        } = {
            signedUser: signedUser,
            isAuthenticated: isAuthenticated,
            token: null,
            msgError: isAuthenticated
                ? null
                : 'Código de autenticação inválido ou expirado.',
        };

        if (response.isAuthenticated) {
            const { token } = await this.createTokens(usuario);
            response.token = token ?? null;
        }

        return response;
    }
}
