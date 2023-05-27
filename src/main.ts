require("dotenv").config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import express, { json, raw, text, urlencoded } from 'express';
import { join } from 'path';
import { PORT } from './config/configuration';

async function bootstrap() {

    const server = express();

    const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(server), {
        logger: process.env.NODE_ENV === 'development' ? ['log', 'debug', 'error', 'verbose', 'warn'] : ['error', 'warn'],
        cors: true,
        bodyParser: true,
    });

    await app.listen(PORT);
}

bootstrap();
