import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptionsDelegate } from '@nestjs/common/interfaces/external/cors-options.interface.js';

const server = express();
let cachedApp: any;

/* ---------------- VERCEL SERVERLESS ---------------- */

async function createServer() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    const allowedOrigins = [
      process.env.BASE_DEV_DOMAIN,
      process.env.BASE_PROD_DOMAIN,
      'http://localhost:3000',
    ].filter((v): v is string => Boolean(v));

    const corsOptions: CorsOptionsDelegate<Request> = (req, callback) => {
      const origin = req.header('Origin');

      if (!origin) {
        return callback(null, { origin: true, credentials: true });
      }

      if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, { origin: true, credentials: true });
      }

      console.log('❌ CORS blocked:', origin);
      callback(new Error('Not allowed by CORS'), { origin: false });
    };

    app.enableCors(corsOptions);

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

  const allowedOrigins = [
    process.env.BASE_DEV_DOMAIN,
    process.env.BASE_PROD_DOMAIN,
    'http://localhost:3000',
  ].filter((v): v is string => Boolean(v));

  const corsOptions: CorsOptionsDelegate<Request> = (req, callback) => {
    const origin = req.header('Origin');

    if (!origin) {
      return callback(null, { origin: true, credentials: true });
    }

    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, { origin: true, credentials: true });
    }

    console.log('❌ CORS blocked:', origin);
    callback(new Error('Not allowed by CORS'), { origin: false });
  };

  app.enableCors(corsOptions);

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
