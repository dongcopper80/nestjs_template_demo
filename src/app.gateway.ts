import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(
    ) {

        setInterval(async () => {
            await this.process();
        }, 5000);
    }

    private async process() {
        this.server.emit('events', new Date().toISOString());
    }

    afterInit(server: any) {
        this.logger.log('Init');

        this.gameUsers = new Map<string, string>();
    }

    handleConnection(client: any, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);

        //this.logger.log(client.handshake.query['username']);
        //this.logger.log(client.handshake.query['accessToken']);
    }

    handleDisconnect(client: any) {

        this.logger.log(`Client disconnected: ${client.id}`);

        if (this.gameUsers.has(client.id)) {

            this.gameUsers.delete(client.id);
        }
    }

    @WebSocketServer() server: Server;

    private logger: Logger = new Logger('AppGateway');

    gameUsers: Map<string, string>;
}