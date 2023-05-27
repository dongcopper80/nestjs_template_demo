require("dotenv").config();

import { NestFactory } from '@nestjs/core';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import express, { json, raw, text, urlencoded } from 'express';
import { join } from 'path';
import { PORT, API_PREFIX, SWAGGER_PREFIX } from './config/configuration';

async function bootstrap() {

    const server = express();

    const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(server), {
        logger: process.env.NODE_ENV === 'development' ? ['log', 'debug', 'error', 'verbose', 'warn'] : ['error', 'warn'],
        cors: true,
        bodyParser: true,
    });

    app.set('trust proxy', 1);
    app.disable('x-powered-by');
    app.setGlobalPrefix(API_PREFIX);

    app.useGlobalPipes(new ValidationPipe());

    await app.listen(PORT);
}

bootstrap();
