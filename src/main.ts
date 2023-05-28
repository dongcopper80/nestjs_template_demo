require("dotenv").config();

import { NestFactory } from '@nestjs/core';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import express, { json, raw, text, urlencoded } from 'express';
import { join } from 'path';
import { PORT, API_PREFIX, SWAGGER_PREFIX, ACCESS_TOKEN } from './config/configuration';
import { TrimStringsPipe } from './config/trim-strings.pipe';
import cookieParser from 'cookie-parser';
import { SocketIoAdapter } from './config/socket-io.adapters';
import helmet from 'helmet';
import rateLimit from "express-rate-limit";
import session from 'express-session';
import * as consolidate from 'consolidate';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import chalk from 'chalk'
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { LoggerMiddleware } from './logger/logger.middleware';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import compression from 'compression';

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

    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    app.useGlobalPipes(
        new TrimStringsPipe(),
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            skipMissingProperties: false,
            forbidUnknownValues: true,
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }));

    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalInterceptors(new TimeoutInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.use(LoggerMiddleware);

    app.use(compression());

    app.use(helmet({
        contentSecurityPolicy: false,
    }));

    app.useStaticAssets(join(__dirname, '..', 'public'), {
        index: false,
        redirect: false,
        prefix: '/public/'
    });
    app.setBaseViewsDir(join(__dirname, '..', 'views'));

    app.engine('html', consolidate.mustache);
    app.set('view engine', 'html');
    app.set('views', join(__dirname, "..", 'views'));
    app.setViewEngine('ejs');
    app.set('view engine', 'pug');
    app.set('view engine', 'ejs');
    app.set('view engine', 'hbs');

    const apiLimiter = rateLimit({
        windowMs: 60 * 1000, // 1 minutes
        max: 30,
        headers: true,
        handler: function (req, res) {
            res.status(429).send({
                status: 500,
                message: 'Too many requests!',
            });
        },
        skip: (req, res) => {
            if (req.ip === '::ffff:127.0.0.1')
                return true;
            return false;
        }
    });

    app.use(apiLimiter);

    var expiryDate = new Date(Date.now() + 6 * 60 * 60 * 1000) // 6 hour

    app.use(
        session({
            secret: ACCESS_TOKEN,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: true,
                maxAge: 6 * 60 * 60 * 1000,
                expires: expiryDate,
                path: '/',
            },
            name: 'sessionId'
        }),
    );

    app.use(urlencoded({ extended: true, limit: '50mb', parameterLimit: 100000 }));
    app.use(json({ limit: '50mb' }));
    app.use(text());
    app.use(raw());

    app.use(cookieParser(ACCESS_TOKEN));

    await app.startAllMicroservices();

    app.useWebSocketAdapter(new SocketIoAdapter(app));

    app.enableCors({
        origin: true,
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: "Content-Type,Accept,Authorization,Access-Control-Allow-Origin,Origin, Referer,X-Referer,X-Requested-With,X-Forwarded-for"
    });

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Referer,X-Referer,X-Requested-With,X-Forwarded-for');
        next();
    });

    await app.listen(PORT);

    console.log(`Server started at port ${PORT}!`);
}

bootstrap();
