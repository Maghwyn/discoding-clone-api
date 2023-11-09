import { ObjectId } from 'mongodb';
import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { ServiceError } from '@/common/error/catch.service';
import { MessagesRepository } from '@/routes/messages/messages.repository';
import { Message, MessageContext } from '@/routes/messages/interfaces/messages.interface';
import { ConversationsService } from '@/routes/conversations/conversations.service';
import { convertToObjectId } from '@/common/helpers/string.helper';
import { Conversation } from '@/routes/conversations/interfaces/conversations.interface';
import { RelationshipsService } from '@/routes/relationship/relationship.service';
import { RelationshipType } from '@/routes/relationship/interfaces/relationship.interface';

@Injectable()
export class MessagesService {
	constructor(
		@Inject(forwardRef(() => MessagesRepository))
		private readonly messagesRepository: MessagesRepository,
		@Inject(forwardRef(() => ConversationsService))
		private readonly conversationsService: ConversationsService,
		@Inject(forwardRef(() => RelationshipsService))
		private readonly relationshipsService: RelationshipsService,
	) {}

	async createPrivateMessage(userId: ObjectId, interlocutorStrId: string, content: string) {
		let conversationId: ObjectId;
		const interlocutorId = convertToObjectId(interlocutorStrId);
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

		const message: Message =  {
			contextId: conversationId,
			contextType: MessageContext.CONVERSATION,
			type: 'text',
			userId: userId,
			content: content,
			isEdited: false,
			createdAt: new Date(),
		}

		await this.messagesRepository.create(message);
		// TODO: Dispatch socket from interlocutorId
		// TODO: Dispatch socket from userId
	}

	async editMessage(userId: ObjectId, messageStrId: string, content: string) {
		const messageId = convertToObjectId(messageStrId);

		const message = await this.messagesRepository.findOneAndUpdate(
			{ _id: messageId, userId },
			{ $set: { content } }
		)

		if (message) {
			// TODO: Dispatch socket from interlocutorId
			// TODO: Dispatch socket from userId
		}
	}

	async deletePrivateMessage(userId: ObjectId, messageStrId: string) {
		const messageId = convertToObjectId(messageStrId);
		const exists = await this.messagesRepository.exists({ _id: messageId, userId });

		if (exists) {
			await this.messagesRepository.deleteOne({ _id: messageId, userId });
			// TODO: Dispatch socket from interlocutorId
			// TODO: Dispatch socket from userId
		}
	}

	// Create your own business logic here
	// If the function is async but does not await something, we don't add the modifier async to the function
	// Just keep that in mind

	// If you wanna throw an error manually after a condition, use new ServiceError(type, message);
	// Mongodb return null if it doesn't find the document, so you can do (!document) throw new ServiceError(type, message);

	// If you need a document from another repository in another module, you use the service of that module to get it throught a function.
	// You do not import directly the repository of another module.
}