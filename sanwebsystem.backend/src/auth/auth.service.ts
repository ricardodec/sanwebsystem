import {
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { HashingService } from '../common/hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { RefreshTokenDto } from './config/refresh-token.dto';
import { User } from '../db/entities/user.entity';

@Injectable({ scope: Scope.DEFAULT })
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async getUserByLogin(login: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { login },
    });

    if (!user) {
      throw new Error('Login inválido');
    }

    if (!user.active) {
      throw new Error('Login não autorizado');
    }

    return user;
  }

  async createTokens(user: User): Promise<{
    token: string | undefined;
    refreshToken: string | undefined;
  }> {
    const tokenPromise = this.generateJwtToken<Partial<User>>(
      user.login,
      this.jwtConfiguration.ttl,
      { email: user.email },
    );

    const refreshTokenPromise = this.generateJwtToken<Partial<User>>(
      user.login,
      this.jwtConfiguration.refreshTtl,
      { email: user.email },
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
      const user = await this.getUserByLogin(loginDto.login as string);

      const isValid = await this.hashingService.compare(
        loginDto.password ?? '',
        user?.password ?? '',
      );

      if (!isValid) {
        throw new Error('Login inválido');
      }

      const { token, refreshToken } = await this.createTokens(user);

      return {
        token,
        refreshToken,
      };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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

      const user = await this.getUserByLogin(sub as string);

      const { token, refreshToken } = await this.createTokens(user);

      return {
        token,
        refreshToken,
      };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new UnauthorizedException(error.message);
    }
  }
}
