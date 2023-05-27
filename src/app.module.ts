import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as path from 'path';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AcceptLanguageResolver, I18nJsonLoader, I18nModule, QueryResolver } from 'nestjs-i18n';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import  DailyRotateFile from 'winston-daily-rotate-file';

@Module({
    imports: [
        EventEmitterModule.forRoot({
            // set this to `true` to use wildcards
            wildcard: false,
            // the delimiter used to segment namespaces
            delimiter: '.',
            // set this to `true` if you want to emit the newListener event
            newListener: false,
            // set this to `true` if you want to emit the removeListener event
            removeListener: false,
            // the maximum amount of listeners that can be assigned to an event
            maxListeners: 10,
            // show event name in memory leak message when more than maximum amount of listeners is assigned
            verboseMemoryLeak: false,
            // disable throwing uncaughtException if an error event is emitted and it has no listeners
            ignoreErrors: false,
        }),

        I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaderOptions: {
                path: path.join(__dirname, '/i18n/'),
                watch: true,
            },
            resolvers: [
                { use: QueryResolver, options: ['lang'] },
                AcceptLanguageResolver,
            ],
        }),

        WinstonModule.forRoot({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
                nestWinstonModuleUtilities.format.nestLike('MyLogger', { prettyPrint: true }),
            ),
            transports: [
                new winston.transports.Console(),
                new DailyRotateFile({
                    dirname: path.join(__dirname, './../logs/debug/'), //path to where save loggin result 
                    filename: 'debug-%DATE%.log', //name of file where will be saved logging result
                    level: 'debug',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d'
                }),
                new DailyRotateFile({
                    dirname: path.join(__dirname, './../logs/info/'),
                    filename: 'info-%DATE%.log',
                    level: 'info',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d'
                }),
                new DailyRotateFile({
                    dirname: path.join(__dirname, './../logs/error/'),
                    filename: 'error-%DATE%.log',
                    level: 'error',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d'
                }),
            ],
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule {}
