import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class ClerkAuthMiddleware implements NestMiddleware {

  private jwksClient: jwksRsa.JwksClient;
  private configService:ConfigService = new ConfigService();

  constructor() {

    this.jwksClient = jwksRsa({
      jwksUri: this.configService.get<string>('CLERK_JKWS_API'),
      cache: true,
      rateLimit: true,
    });

    this.use = this.use.bind(this);
  }

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1]; // Remove the "Bearer " part
    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    // Decode the token to get the `kid` (key ID)
    const decodedHeader: any = jwt.decode(token, { complete: true });
    const kid = decodedHeader?.header?.kid;

    if (!kid) {
      throw new UnauthorizedException('Token missing key ID (kid)');
    }

    // Fetch the public key using the `kid`
    this.jwksClient.getSigningKey(kid, (err, key) => {
      if (err) {
        console.error('Error getting signing key:', err);
        return res.status(401).send('Unauthorized: Could not get signing key');
      }

      // Get the public key from the signing key
      const publicKey = key.getPublicKey();

      try {
        // Verify the token using the public key
        const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });

        // Attach the userId to the request
        req['userId'] = (decoded as any).userId; // The userId is typically in the 'sub' field
        next();
      } catch (err) {
        res.status(401).send('Unauthorized: Invalid token');
      }
    });
  }
}
