import { Global, Module } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

export const PRISMA_CLIENT = 'PRISMA_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: PRISMA_CLIENT,
      useFactory: () => {
        // Get the database URL based on environment
        const databaseUrl = process.env.VERCEL
          ? process.env.POSTGRES_PRISMA_URL // Vercel provides this for Prisma
          : process.env.DATABASE_URL; // Local development

        console.log('🔌 Connecting to database...', {
          environment: process.env.VERCEL ? 'production' : 'development',
          url: databaseUrl ? 'set' : 'not set',
          urlPreview: databaseUrl
            ? databaseUrl.substring(0, 20) + '...'
            : 'none',
        });

        if (!databaseUrl) {
          throw new Error('Database URL is not set');
        }

        // For Prisma 7, we need to use the adapter pattern
        const pool = new Pool({ connectionString: databaseUrl });
        const adapter = new PrismaPg(pool);

        return new PrismaClient({
          adapter,
          log: process.env.VERCEL
            ? ['error']
            : ['query', 'info', 'warn', 'error'],
        });
      },
    },
  ],
  exports: [PRISMA_CLIENT],
})
export class PrismaModule {}
