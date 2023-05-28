import * as dotenv from 'dotenv'

dotenv.config()

const NODE_ENV: string = process.env.NODE_ENV || 'development';

const PRIMARY_COLOR: string = process.env.PRIMARY_COLOR || '#87e8de';

const PORT: number = +process.env.PORT || 7227;

const API_PREFIX: string = process.env.API_PREFIX || 'api/v1';

const SWAGGER_PREFIX: string = process.env.SWAGGER_PREFIX || 'google/swagger';

const ACCESS_TOKEN: string = process.env.ACCESS_TOKEN || 'access-token';
const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET || 'access-token-key';
const REFRESH_TOKEN: string = process.env.REFRESH_TOKEN || 'refresh-token';
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET || 'refresh-token-key';
const EMAIL_TOKEN: string = process.env.EMAIL_TOKEN || 'email-token';
const EMAIL_TOKEN_SECRET: string = process.env.EMAIL_TOKEN_SECRET || 'email-token-key';
const RESETPASS_TOKEN: string = process.env.RESETPASS_TOKEN || 'resetpass-token';
const RESETPASS_TOKEN_SECRET: string = process.env.RESETPASS_TOKEN_SECRET || 'resetpass-token-key';

const REDIS_HOST: string = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT: number = +process.env.REDIS_PORT || 6379;
const REDIS_TLS: number = +process.env.REDIS_TLS || 600;
const REDIS_PASSWORD: string = process.env.REDIS_PASSWORD || '';

export {
    PRIMARY_COLOR,
    PORT,
    API_PREFIX,
    SWAGGER_PREFIX,
    ACCESS_TOKEN,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN,
    REFRESH_TOKEN_SECRET,
    EMAIL_TOKEN,
    EMAIL_TOKEN_SECRET,
    RESETPASS_TOKEN,
    RESETPASS_TOKEN_SECRET,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_TLS,
    REDIS_PASSWORD
};