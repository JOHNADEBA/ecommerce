import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ClerkAuthGuard } from './clerk-auth.guard.js';
import { RolesGuard } from './roles.guard.js';
import { Reflector } from '@nestjs/core';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private clerkAuthGuard: ClerkAuthGuard,
    private rolesGuard: RolesGuard,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1️⃣ First authenticate
    await this.clerkAuthGuard.canActivate(context);
    
    // 2️⃣ Then get roles from the decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // 3️⃣ If no roles required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    
    // 4️⃣ Check if user has required roles
    return this.rolesGuard.canActivate(context);
  }
}