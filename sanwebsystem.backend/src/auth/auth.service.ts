import {
    Inject,
    Injectable,
    Scope,
    UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingService } from '../common/hashing/hashing.service';
import { Usuario } from '../db/entities/usuario.entity';
import jwtConfig from './config/jwt.config';
import { RefreshTokenDto } from './config/refresh-token.dto';
import { LoginDto } from './dto/login.dto';

@Injectable({ scope: Scope.DEFAULT })
export class AuthService {
    constructor(
        @InjectRepository(Usuario)
        private readonly userRepository: Repository<Usuario>,
        @Inject(HashingService)
        private readonly hashingService: HashingService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService,
    ) {}

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

    async getUserByLogin(login: string): Promise<Usuario> {
        const Usuario = await this.userRepository.findOne({
            where: { login },
        });

        if (!Usuario) {
            throw new Error('Login inválido');
        }

        if (!Usuario.ativo) {
            throw new Error('Login não autorizado');
        }

        return Usuario;
    }

    async createTokens(Usuario: Usuario): Promise<{
        token: string | undefined;
        refreshToken: string | undefined;
    }> {
        const tokenPromise = this.generateJwtToken<Partial<Usuario>>(
            Usuario.login,
            this.jwtConfiguration.ttl,
            { email: Usuario.email },
        );

        const refreshTokenPromise = this.generateJwtToken<Partial<Usuario>>(
            Usuario.login,
            this.jwtConfiguration.refreshTtl,
            { email: Usuario.email },
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

    async login(loginDto: LoginDto): Promise<{
        token: string | undefined;
        refreshToken: string | undefined;
    }> {
        try {
            const Usuario = await this.getUserByLogin(loginDto.login as string);

            const isValid = await this.hashingService.compare(
                loginDto.password ?? '',
                Usuario?.senha ?? '',
            );

            if (!isValid) {
                throw new Error('Login inválido');
            }

            const { token, refreshToken } = await this.createTokens(Usuario);

            return {
                token,
                refreshToken,
            };
        } catch (error: any) {
            throw new UnauthorizedException(error.message);
        }
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

            const Usuario = await this.getUserByLogin(sub as string);

            const { token, refreshToken } = await this.createTokens(Usuario);

            return {
                token,
                refreshToken,
            };
        } catch (error: any) {
            throw new UnauthorizedException(error.message);
        }
    }
}
