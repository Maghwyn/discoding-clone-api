import { Server } from 'socket.io';
import { ObjectId } from 'mongodb';
import { JwtService } from '@nestjs/jwt';
import { UseFilters } from '@nestjs/common';
import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
} from '@nestjs/websockets';

import { WSServiceErrorCatcher } from '@/common/error/ws.catch.service';
import { AuthSocket, WSAuthMiddleware } from '@/common/middlewares/socket.auth.middleware';
import { MessageDelete, MessageDetails, MessageUpdate } from '@/routes/messages/interfaces/messages.interface';

@UseFilters(WSServiceErrorCatcher)
@WebSocketGateway({
	transports: ['websocket'],
	cors: {
		origin: '*', // to be defined later
	},
	namespace: 'messages',
})
export class MessagesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly jwtService: JwtService) {}
	@WebSocketServer() server: Server;

	afterInit(server: Server) {
		server.use(WSAuthMiddleware(this.jwtService));
	}

	async handleConnection(client: AuthSocket) {
		client.join(client.user.id.toString());
		// client.to(client.user.id.toString()).emit('peer-connected');
	}

	async handleDisconnect(client: AuthSocket) {
		client.leave(client.user.id.toString());
		// client.to(client.user.id.toString()).emit('peer-disconnected');
	}

	sendMessage(message: MessageDetails, recipientId: ObjectId, channelId: ObjectId) {
		this.server.to(recipientId.toString()).emit('message-received', message, channelId);
	}

	updateMessage(message: MessageUpdate, channelId: string) {
		this.server.to(channelId).emit('message-updated', message);
	}

	deleteMessage(message: MessageDelete, channelId: string) {
		this.server.to(channelId).emit('message-deleted', message);
	}

	@SubscribeMessage('connected-to')
	connectToChannel(client: AuthSocket, channelId: string) {
		client.rooms.forEach((room) => {
			if (room.length !== 24) return;
			if (room !== client.user.id.toString()) {
				client.leave(room);
			}
		})

		client.join(channelId);
	}
}
