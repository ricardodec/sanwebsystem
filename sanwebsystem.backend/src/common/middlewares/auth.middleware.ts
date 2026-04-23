import { HttpStatus, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthGuard } from '../../auth/guards/auth-guard';

export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = AuthGuard.extractTokenFromHeader(req);

    if (!token) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Authorization header is missing' });
    }

    next(); // return next() to pass control to the next middleware or route handler and ignore another sentences after this.

    res.on('finish', () => {
      console.log('Request completed with status code:', res.statusCode);
    });
  }
}
