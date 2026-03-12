import { Module } from '@nestjs/common';
import { ClerkAuthGuard } from './clerk-auth.guard.js';
import { RolesGuard } from './roles.guard.js';
import { AuthGuard } from './auth-combined.guard.js';

@Module({
  providers: [ClerkAuthGuard, RolesGuard, AuthGuard],
  exports: [ClerkAuthGuard, RolesGuard, AuthGuard],
})
export class GuardsModule {}
