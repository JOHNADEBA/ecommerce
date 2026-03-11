import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import express, { Application, Request, Response } from 'express';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

// For local development
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  // Add global validation pipe with transform enabled
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT || 3001);
}

// For Vercel serverless
const server = express();

export const createNestServer = async (expressInstance: Application) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
    {},
  );

  app.enableCors({
    origin: [
      process.env.BASE_DEV_DOMAIN || 'http://localhost:3000',
      process.env.BASE_PROD_DOMAIN ||
        'https://ecommerce-one-sable-77.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  app.setGlobalPrefix('api');

  // Add global validation pipe with transform enabled
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    }),
  );

  await app.init();
  return expressInstance;
};

let cachedHandler: Application | undefined;

export default async function handler(req: Request, res: Response) {
  if (!cachedHandler) {
    cachedHandler = await createNestServer(server);
  }

  return cachedHandler(req, res);
}

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  bootstrap().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}
