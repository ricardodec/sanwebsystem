import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from '../../auth/config/jwt.config';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../../common/app.constant';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  static extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers['authorization'];

    if (!authorization || typeof authorization !== 'string') {
      return undefined;
    }

    const auth = authorization
      .replace(/"/g, '')
      .replace(/'/g, '')
      .replace(/`/g, '')
      .split(' ');

    if (!auth || auth.length !== 2 || auth[0] !== 'Bearer') {
      return undefined;
    }

    return auth[1];
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = AuthGuard.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authorization failure');
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = await this.jwtService.verifyAsync(token, {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
      } as JwtVerifyOptions);

      request[REQUEST_TOKEN_PAYLOAD_KEY] = payload as string;
    } catch (error) {
      throw new UnauthorizedException(error);
    }

    return true;
  }
}
