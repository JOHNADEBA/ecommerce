import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaClient } from '../../../generated/prisma/client.js';
import { PRISMA_CLIENT } from '../../lib/prisma.module.js';
import { Inject } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(PRISMA_CLIENT) private prisma: PrismaClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get roles from either passed reflector or directly
    const requiredRoles = this.reflector
      ? this.reflector.getAllAndOverride<string[]>('roles', [
          context.getHandler(),
          context.getClass(),
        ])
      : Reflect.getMetadata('roles', context.getHandler());

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles required → allow
    }

    const request = context.switchToHttp().getRequest();
    const clerkUser = request.user;

    if (!clerkUser?.sub) {
      throw new UnauthorizedException('User not authenticated');
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { clerkId: clerkUser.sub },
      select: { role: true },
    });

    if (!dbUser) {
      throw new ForbiddenException('User not found in database');
    }

    const hasRole = requiredRoles.some((role) => dbUser.role === role);

    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
