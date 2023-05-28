import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AcceptLanguageResolver, I18nJsonLoader, I18nModule, QueryResolver } from 'nestjs-i18n';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import path, { join } from 'path';
import  DailyRotateFile from 'winston-daily-rotate-file';
import { HttpModule } from '@nestjs/axios';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CacheModule } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisModule } from './redis.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import GraphQLJSON from 'graphql-type-json';
import ormconfig from './config/ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';

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

        HttpModule.registerAsync({
            useFactory: () => ({
                timeout: 5000,
                maxRedirects: 5,
            }),
        }),

        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '.', 'public'),
            exclude: ['/api*'],
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

        TypeOrmModule.forRoot(ormconfig[0]), //default

        TypeOrmModule.forRoot(ormconfig[1]), //other db

        /*CacheModule.register({
            isGlobal: true,
            ttl: 5, // seconds
            max: 10000, // maximum number of items in cache
        }),*/

//        GraphQLModule.forRoot<ApolloDriverConfig>({
//            driver: ApolloDriver,
//            playground: false,
//            installSubscriptionHandlers: true,
//            autoSchemaFile: true,
//            sortSchema: true,
//            typePaths: ['./**/*.graphql'],
//            definitions: {
//                path: join(process.cwd(), 'src/graphql.ts'),
//                outputAs: 'class',
//            },
//            subscriptions: {
//                'graphql-ws': {
//                    path: '/graphql'
//                },
//            },
//            buildSchemaOptions: {
//                dateScalarMode: 'timestamp',
//                numberScalarMode: 'integer',
//            },
//            resolvers: { 
//                JSON: GraphQLJSON
//            },
//        }),

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
                    maxSize: '200m',
                    maxFiles: '14d',
                    auditFile: path.join(__dirname, './../logs/debug/audit.json'),
                }).on('rotate', function(oldFilename, newFilename) {
                    // do something fun
                }),
                new DailyRotateFile({
                    dirname: path.join(__dirname, './../logs/info/'),
                    filename: 'info-%DATE%.log',
                    level: 'info',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: true,
                    maxSize: '200m',
                    maxFiles: '14d',
                    auditFile: path.join(__dirname, './../logs/info/audit.json'),
                }).on('rotate', function(oldFilename, newFilename) {
                    // do something fun
                }),
                new DailyRotateFile({
                    dirname: path.join(__dirname, './../logs/error/'),
                    filename: 'error-%DATE%.log',
                    level: 'error',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: true,
                    maxSize: '200m',
                    maxFiles: '14d',
                    auditFile: path.join(__dirname, './../logs/error/audit.json'),
                }).on('rotate', function(oldFilename, newFilename) {
                    // do something fun
                }),
            ],
        }),
        RedisModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule {}
