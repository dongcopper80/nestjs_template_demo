import { HttpException, HttpStatus, Logger, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway(
    {
        transports: ['websocket', 'polling'],
        cors: { origin: '*' },
        serveClient: true,
    }
)
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server;

    private logger: Logger = new Logger('EventsGateway');

    constructor(
        
    ) { }

    afterInit(server: any) {
        console.log('Gateway initialized');
    }

    async handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(client.id, 'Connected..............................');
        this.logger.log(client.handshake.auth.token);

        client.on('room', (room) => {
            client.join(room);
        });
    }

    async handleDisconnect(client: Socket): Promise<any> {
        this.logger.log(client.id, 'Disconnect');
    }
}