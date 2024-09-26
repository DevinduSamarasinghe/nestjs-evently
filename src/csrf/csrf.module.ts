import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CsrfController } from './csrf.controller';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
import { Request, Response, NextFunction } from 'express';

@Module({
  controllers: [CsrfController],
})
export class CsrfModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieParser(), // Apply cookie-parser first to handle cookies
        (req: Request, res: Response, next: NextFunction) => {
          // Skip CSRF protection for safe methods (GET, HEAD, OPTIONS)
          if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
            return next(); // Skip CSRF validation for these methods
          }
          // Apply CSRF protection for state-changing requests
          return csurf({
            cookie: {
              httpOnly: true,
              sameSite: 'strict',
              secure: process.env.NODE_ENV === 'production', // Only for production
            },
          })(req, res, next); // Apply CSRF protection for state-changing methods
        }
      )
      .forRoutes('*'); // Apply to all routes
  }
}
