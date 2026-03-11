import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service.js';

import { PRISMA_CLIENT } from './lib/prisma.module.js';
import { PrismaClient } from '../generated/prisma/client.js';

@Controller()
export class AppController {
  constructor(
    @Inject(PRISMA_CLIENT) private prisma: PrismaClient,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async healthCheck() {
    try {
      // Simple database query to check connection
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        database: 'disconnected',
        error: error.message,
      };
    }
  }
}
