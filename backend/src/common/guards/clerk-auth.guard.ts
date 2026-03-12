import {
  Injectable,
  CanActivate,
  ExecutionContext,
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
      // ✅ BEST: Verify the JWT locally using Clerk's secret
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
      });

      console.log('✅ Token verified for user:', payload.sub);

      // Attach Clerk user info to request
      request['user'] = {
        sub: payload.sub,
        clerkId: payload.sub,
      };

      return true;
    } catch (err) {
      console.error('❌ Clerk token verification failed:', err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
