/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class ChangeDataInterceptor implements NestInterceptor {
  private cache = new Map<string, any>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('ChangeDataInterceptor called');

    return next.handle().pipe(
      tap((data) => {
        if (Array.isArray(data)) {
          return {
            ...data,
            count: data.length,
          };
        }

        return data;
      }),
    );
  }
}
