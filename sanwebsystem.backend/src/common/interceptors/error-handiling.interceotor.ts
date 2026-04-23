import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorHandilingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('ErrorHandilingInterceptor INICIADO');

    return next.handle().pipe(
      catchError((error) => {
        console.log('ErrorHandilingInterceptor:', error);

        if (error instanceof NotFoundException) {
          // Aqui você pode personalizar a resposta de erro, por exemplo:
          return throwError(() => new BadRequestException(error.message));
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return throwError(() => error);
      }),
    );
  }
}
