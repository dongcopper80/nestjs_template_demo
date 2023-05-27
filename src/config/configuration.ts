import * as dotenv from 'dotenv'

dotenv.config()

const NODE_ENV: string = process.env.NODE_ENV || 'development';

const PRIMARY_COLOR: string = process.env.PRIMARY_COLOR || '#87e8de';

const PORT: number = +process.env.PORT || 7227;

const API_PREFIX: string = process.env.API_PREFIX || 'api/v1';

const SWAGGER_PREFIX: string = process.env.SWAGGER_PREFIX || 'google/swagger';

export {
    PORT,
    API_PREFIX,
    SWAGGER_PREFIX
};