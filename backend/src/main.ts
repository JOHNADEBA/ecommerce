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

    const corsOptions: CorsOptionsDelegate<Request> = (req, callback) => {
      const origin = req.header('Origin');

      let allowed = false;

      if (!origin) {
        allowed = true; // Postman, curl, server-to-server
      }

      if (origin?.includes('localhost')) {
        allowed = true;
      }

      if (origin?.endsWith('.vercel.app')) {
        allowed = true;
      }

      const options = {
        origin: allowed ? origin : false,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
          'Content-Type',
          'Authorization',
          'X-Requested-With',
          'Accept',
        ],
      };

      callback(null, options);
    };

    app.enableCors(corsOptions);

    server.options('*', (_, res) => {
      res.sendStatus(200);
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
    origin: true,
    credentials: true,
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
