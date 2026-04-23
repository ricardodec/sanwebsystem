import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TimingConnectionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    console.log('TimingConnectionInterceptor INICIADO');

    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now();
        console.log('TimingConnectionInterceptor FINALIZADO');
        console.log(`Tempo de execução: ${endTime - startTime} ms`);
      }),
    );
  }
}
