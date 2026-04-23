import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const DataParam = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data ? request[data] : request;
  },
);
