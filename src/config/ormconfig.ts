import parseBoolean from '@eturino/ts-parse-boolean';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { parse } from 'querystring';

dotenv.config();

export =[
    {
        name: 'default',
        type: 'postgres',
        host: process.env.PGHOST,
        port: parseInt(process.env.PGPORT),
        username: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        options: {
            instanceName: process.env.DEFAULT_DB_INSTANCE,
            enableArithAbort: false,
        },
        logging: parseBoolean(process.env.DEFAULT_DB_LOGGING),
        logger: "file",
        dropSchema: false,
        synchronize: true,
        migrationsRun: parseBoolean(process.env.DEFAULT_DB_RUN_MIGRATIONS),
        migrationsTableName: "migrations_history",
        migrations: [join(__dirname, '..', 'model/migration1/**/*.{ts,js}')],
        subscribers: [join(__dirname, '..', 'model/subscriber1/**/*.{ts,js}')],
        cli: {
            "entitiesDir": "src",
            "migrationsDir": "src/model/migration1",
            "subscribersDir": "src/model/subscriber1"
        },
        entities: [
            join(__dirname, '..', 'model/entity/db1/**/*.entity.{ts,js}'),
        ],
        //ssl: true,
        extra: {
            trustServerCertificate: true,
            timezone: "+7:00",
            connectionLimit: 100
        //    ssl: {
        //        rejectUnauthorized: false,
        //    },
        },
    } as TypeOrmModuleOptions,
    {
        name: 'other',
        type: 'postgres',
        host: process.env.PGHOST2,
        port: parseInt(process.env.PGPORT2),
        username: process.env.PGUSER2,
        password: process.env.PGPASSWORD2,
        database: process.env.PGDATABASE2,
        options: {
            instanceName: process.env.OTHER_DB_INSTANCE,
            enableArithAbort: false,
        },
        logging: parseBoolean(process.env.OTHER_DB_LOGGING),
        logger: "file",
        dropSchema: false,
        synchronize: false,
        migrationsRun: false,
        migrationsTableName: "migrations_history",
        entities: [
            join(__dirname, '..', 'model/entity/db2/**/*.entity.{ts,js}'),
        ],
        migrations: [join(__dirname, '..', 'model/migration2/**/*.{ts,js}')],
        subscribers: [join(__dirname, '..', 'model/subscriber2/**/*.{ts,js}')],
        cli: {
            "entitiesDir": "src",
            "migrationsDir": "src/model/migration2",
            "subscribersDir": "src/model/subscriber2"
        },
        //options: { trustServerCertificate: true },
        //ssl: true,
        extra: {
            trustServerCertificate: true,
            timezone: "+7:00",
            connectionLimit: 100
        //    ssl: {
        //        rejectUnauthorized: false,
        //    },
        },
    } as TypeOrmModuleOptions,
];