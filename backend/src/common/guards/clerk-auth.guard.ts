import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyToken } from '@clerk/backend';
import { Request } from 'express';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      console.error('❌ Missing or invalid Authorization header');

      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
        authorizedParties: [
          process.env.BASE_DEV_DOMAIN || 'http://localhost:3000',
          process.env.BASE_PROD_DOMAIN || 'http://localhost:3000',
        ],
        clockSkewInMs: 5000,
      });

      // Attach Clerk user data to the request for use in controllers/services
      request['user'] = {
        sub: payload.sub,
        clerkId: payload.sub, // Clerk user ID
        // Add more if needed: email: payload.email_addresses?.[0]?.email_address,
      };

      return true;
    } catch (err) {
      console.error('Clerk token verification failed:', err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
