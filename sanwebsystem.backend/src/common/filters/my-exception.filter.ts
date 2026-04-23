import {
  ArgumentsHost,
  // BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  // NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(Error) // BadRequestException, NotFoundException
export class MyExceptionFilter<
  T extends HttpException,
> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const request = context.getRequest<Request>();

    const statusCode = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.BAD_REQUEST;

    const exceptionResponse = exception.getResponse() as HttpException | string;

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse.message;

    response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
