'use client';

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

    // Dynamic CORS for serverless
    app.enableCors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true); // allow curl, Postman, mobile apps

        const allowedOrigins = [
          'https://ecommerce-63rnpimr2-johnadebas-projects.vercel.app',
          'https://ecommerce-bbjf-5uifhjbxt-johnadebas-projects.vercel.app',
          'http://localhost:3000', // local dev
        ];

        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
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

    // Handle preflight requests explicitly
    server.options('*', (_, res) => {
      res.sendStatus(200);
    });

    // Global API prefix
    app.setGlobalPrefix('api');

    // Validation pipe
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
      'https://ecommerce-63rnpimr2-johnadebas-projects.vercel.app',
      'https://ecommerce-bbjf-5uifhjbxt-johnadebas-projects.vercel.app',
    ],
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
