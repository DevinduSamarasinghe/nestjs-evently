import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {

  private csrfProtection;

  constructor() {
    // Initialize csurf middleware with cookie configuration
    this.csrfProtection = csurf({
      cookie: {
        httpOnly: true, // The CSRF cookie cannot be accessed via JavaScript
        sameSite: 'lax', // Cookie will only be sent with requests from the same site
        secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
      },
    });

    this.use = this.use.bind(this);
  }

  use(req: Request, res: Response, next: NextFunction) {
    cookieParser()(req, res, (err) => {
      if (err) {
        return res.status(400).send('Error parsing cookies');
      }

      this.csrfProtection(req, res, (csrfError) => {
        if (csrfError) {
          return res.status(403).send('Invalid CSRF token');
        }

        // If request method is not GET, check if CSRF token is provided
        if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
          const csrfToken = req.headers['x-csrf-token'];
          if (!csrfToken || csrfToken !== req.csrfToken()) {
            throw new UnauthorizedException('CSRF token mismatch');
          }
        }

        // Proceed with request if everything is valid
        next();
      });
    });
  }
}
