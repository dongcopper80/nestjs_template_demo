import { Injectable } from '@nestjs/common';
import crypto from "crypto";

@Injectable()
export class AppService {
    getHello(): string {
        return 'Bearer ' + crypto.randomBytes(256).toString('hex');
    }
}
