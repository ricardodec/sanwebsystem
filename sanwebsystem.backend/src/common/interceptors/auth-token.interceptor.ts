/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthTokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    // Posição zero do token no header: Authorization é Bearer, posição um é o token em si
    const token: string | undefined =
      request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token de autenticação não fornecido');
    }

    return next.handle();
  }
}
