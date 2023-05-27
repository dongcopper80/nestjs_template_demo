import { Logger } from '@nestjs/common';

export class MyLogger extends Logger {

    error(message: string, trace: string) {
        // Send stack trace to chatwork, or some others logic
        super.error(message, trace);
    }
}