import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

const server = express();
let cachedApp: any;

/* ---------------- VERCEL SERVERLESS ---------------- */

async function createServer() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    // ✅ SIMPLE CORS CONFIGURATION - NO CALLBACK ERRORS
    app.enableCors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) {
          return callback(null, true);
        }

        // Check if origin is allowed
        const allowedOrigins = [
          process.env.BASE_DEV_DOMAIN,
          process.env.BASE_PROD_DOMAIN,
          'http://localhost:3000',
        ].filter(Boolean);

        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
          return callback(null, true);
        }

        // Block all other origins - but don't throw an error!
        console.log('❌ CORS blocked:', origin);
        return callback(null, false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
      ],
    });

    app.setGlobalPrefix('api');

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    await app.init();

    cachedApp = server;
  }

  return cachedApp;
}

export default async function handler(req: Request, res: Response) {
  const app = await createServer();
  return app(req, res);
}

/* ---------------- LOCAL DEVELOPMENT ---------------- */

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      process.env.BASE_DEV_DOMAIN,
      process.env.BASE_PROD_DOMAIN,
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(3001);
}

if (!process.env.VERCEL) {
  bootstrap();
}
