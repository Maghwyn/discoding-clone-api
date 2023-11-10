import { ObjectId } from 'mongodb';
import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { ServiceError } from '@/common/error/catch.service';
import { MessagesRepository } from '@/routes/messages/messages.repository';
import { Message, MessageContext, MessageDetails } from '@/routes/messages/interfaces/messages.interface';
import { ConversationsService } from '@/routes/conversations/conversations.service';
import { convertToObjectId } from '@/common/helpers/string.helper';
import { Conversation } from '@/routes/conversations/interfaces/conversations.interface';
import { RelationshipsService } from '@/routes/relationship/relationship.service';
import { RelationshipType } from '@/routes/relationship/interfaces/relationship.interface';
import { channelMessagesPipeline, privateUnreadMessagesPipeline, searchMessagePipeline } from '@/routes/messages/utils/messages.pipeline';
import { UsersService } from '@/routes/users/users.service';
import { MessagesGateway } from '@/routes/messages/messages.gateway';

@Injectable()
export class MessagesService {
	constructor(
		@Inject(forwardRef(() => MessagesRepository))
		private readonly messagesRepository: MessagesRepository,
		@Inject(forwardRef(() => ConversationsService))
		private readonly conversationsService: ConversationsService,
		@Inject(forwardRef(() => RelationshipsService))
		private readonly relationshipsService: RelationshipsService,
		@Inject(forwardRef(() => UsersService))
		private readonly usersService: UsersService,
		@Inject(forwardRef(() => MessagesGateway))
		private readonly messagesGateway: MessagesGateway,
	) {}

	async createPrivateMessage(userId: ObjectId, interlocutorStrId: string, content: string) {
		let conversationId: ObjectId;
		const interlocutorId = convertToObjectId(interlocutorStrId);
		const user = await this.usersService.getUserFrom({ _id: interlocutorId });
		const myUser = await this.usersService.getUserFrom({ _id: userId });
		if (!user && !myUser) throw new ServiceError('NOT_FOUND', 'User not found');

		const relationship = await this.relationshipsService.retrieveFrom({
			$or: [
				{ userIdA: userId, userIdB: interlocutorId },
				{ userIdA: interlocutorId, userIdB: userId },
			],
		})

		if (relationship && relationship.type === RelationshipType.BLOCKED) {
			throw new ServiceError('UNAUTHORIZED', 'You are not able to send a message to that user');
		}

		const conversation = await this.conversationsService.retrieveFrom({
			$or: [
				{ userIdA: userId, userIdB: interlocutorId },
				{ userIdA: interlocutorId, userIdB: userId },
			],
		});

		if (!conversation) {
			const conv: Conversation = {
				userIdA: userId,
				userIdB: interlocutorId,
				createdAt: new Date(),
				updatedAt: new Date(),
			}

			const result = await this.conversationsService.createConversation(conv);
			// TODO: Dispatch socket from interlocutorId
			// TODO: Dispatch socket from userId
			conversationId = result.insertedId;
		} else {
			conversationId = conversation._id;
		}

		const res = await this.messagesRepository.create({
			contextId: conversationId,
			contextType: MessageContext.CONVERSATION,
			type: 'text',
			userId: userId,
			content: content,
			isEdited: false,
			isRead: false,
			createdAt: new Date(),
		});

		const message: MessageDetails = {
			id: res.insertedId,
			isOwner: true,
			userId: userId,
			userPicture: myUser.avatarUrl,
			username: myUser.username,
			channelId: conversationId,
			content: content,
			isEdited: false,
			isBlocked: false,
			createdAt: new Date(),
		}

		this.messagesGateway.sendMessage(message, userId, conversationId);
		message.isOwner = false;
		this.messagesGateway.sendMessage(message, interlocutorId, conversationId);

		return {
			id: conversationId,
			userId: user._id,
			pictureUrl: user.avatarUrl,
			username: user.username,
		};
	}

	async editMessage(userId: ObjectId, messageStrId: string, channelId: string, content: string) {
		const messageId = convertToObjectId(messageStrId);

		const message = await this.messagesRepository.findOneAndUpdate(
			{ _id: messageId, userId },
			{ $set: { content, isEdited: true } }
		)

		if (message) {
			this.messagesGateway.updateMessage({ content, id: messageId }, channelId);
		}
	}

	async deletePrivateMessage(userId: ObjectId, messageStrId: string, channelId: string) {
		const messageId = convertToObjectId(messageStrId);
		const exists = await this.messagesRepository.exists({ _id: messageId, userId });

		if (exists) {
			await this.messagesRepository.deleteOne({ _id: messageId, userId });
			this.messagesGateway.deleteMessage({ id: messageId }, channelId);
		}
	}

	async retrieveChannelMessages(userId: ObjectId, channelStrId: string, contextType: MessageContext) {
		if (contextType !== MessageContext.CONVERSATION && contextType !== MessageContext.CHANNEL) {
			throw new ServiceError('BAD_REQUEST', 'Context must either be 1 or 2');
		}

		const channelId = convertToObjectId(channelStrId);
		
		if (contextType === MessageContext.CONVERSATION) {
			const channel = await this.conversationsService.retrieveFrom({ _id: channelId });
			if (!channel) throw new ServiceError('NOT_FOUND', 'Channel not found');
			if (!channel.userIdA.equals(userId) && !channel.userIdB.equals(userId)) {
				throw new ServiceError('NOT_FOUND', 'Channel not found');
			}

			await this.messagesRepository.updateMany(
				{ contextId: channelId },
				{ $set: { isRead: true } }
			)
		}

		if (contextType === MessageContext.CHANNEL) {
			// TODO: Retrieve from servers and verify the access to the channel
			return [];
		}

		return this.messagesRepository.aggregate(channelMessagesPipeline(userId, channelId));
	}

	async retrievePrivateUnreads(userId: ObjectId) {
		return this.messagesRepository.aggregate(privateUnreadMessagesPipeline(userId));
	}

	async searchMessageInChannel(userId: ObjectId, channelStrId: string, query: string) {
		const channelId = convertToObjectId(channelStrId);
		const channel = this.conversationsService.retrieveFrom({ _id: channelId });
		if (!channel) throw new ServiceError('NOT_FOUND', 'Channel not found');

		return this.messagesRepository.aggregate(searchMessagePipeline(userId, channelId, query));
	}

	// Create your own business logic here
	// If the function is async but does not await something, we don't add the modifier async to the function
	// Just keep that in mind

	// If you wanna throw an error manually after a condition, use new ServiceError(type, message);
	// Mongodb return null if it doesn't find the document, so you can do (!document) throw new ServiceError(type, message);

	// If you need a document from another repository in another module, you use the service of that module to get it throught a function.
	// You do not import directly the repository of another module.
}