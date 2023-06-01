import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ACCESS_TOKEN, EXPIRATION_DATE } from '../config/configuration';
import { EventsGateway } from './events.gateway';

@Module({
    imports: [
        JwtModule.register({
            secret: ACCESS_TOKEN,
            signOptions: {
                expiresIn: EXPIRATION_DATE + 'd'
            }
        }),
        PassportModule.register({
            defaultStrategy: 'jwt',
            session: true,
        }),
    ],
    providers: [EventsGateway],
})
export class EventsModule { }