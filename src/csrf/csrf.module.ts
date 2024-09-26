import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { CsrfController } from './csrf.controller';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';

@Module({
  controllers: [CsrfController],
})
export class CsrfModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieParser(), // Apply cookie-parser first
        csurf({ // Apply CSRF middleware
          cookie: {
            httpOnly: true, // CSRF cookie can't be accessed via JS
            sameSite: 'lax', // Allow CSRF cookie across sites in Lax mode
            secure: false, // Use `true` in production with HTTPS
          },
        })
      )
      // Only apply CSRF protection to state-changing methods
      .forRoutes('*'
        // { path: '*', method: RequestMethod.POST },
        // { path: '*', method: RequestMethod.PUT },
        // { path: '*', method: RequestMethod.DELETE }
      );
  }
}
