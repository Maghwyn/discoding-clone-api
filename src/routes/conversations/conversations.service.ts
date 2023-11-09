import { Filter, ObjectId } from 'mongodb';
import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { ServiceError } from '@/common/error/catch.service';
import { ConversationsRepository } from '@/routes/conversations/conversations.repository';
import { Conversation } from '@/routes/conversations/interfaces/conversations.interface';
import { directMessagesPipeline } from '@/routes/conversations/utils/conversations.pipeline';
import { UsersService } from '@/routes/users/users.service';
import { convertToObjectId } from '@/common/helpers/string.helper';

@Injectable()
export class ConversationsService {
	constructor(
		@Inject(forwardRef(() => ConversationsRepository))
		private readonly conversationsRepository: ConversationsRepository,
		@Inject(forwardRef(() => UsersService))
		private readonly usersService: UsersService,
	) {}

	// Means that there's no message
	async createEmptyConversation(userId: ObjectId, interlocutorStrId: string) {
		const interlocutorId = convertToObjectId(interlocutorStrId);
		const user = await this.usersService.getUserFrom({ _id: interlocutorId });
		if (!user) throw new ServiceError('NOT_FOUND', 'User not found');
		
		const res = await this.createConversation({
			userIdA: userId,
			userIdB: interlocutorId,
			createdAt: new Date(),
			updatedAt: new Date(),
		})

		return {
			id: res.insertedId,
			userId: user._id,
			pictureUrl: user.avatarUrl,
			username: user.username,
		}
	}
	
	createConversation(conversation: Conversation) {
		return this.conversationsRepository.create(conversation);
	}

	retrieveFrom(filter: Filter<Conversation>) {
		return this.conversationsRepository.findOne(filter);
	}

	retrieveMyConversations(userId: ObjectId) {
		return this.conversationsRepository.aggregate(directMessagesPipeline(userId));
	}

	channelExistsById(channelId: ObjectId) {
		return this.conversationsRepository.exists({ _id: channelId });
	}

	// Create your own business logic here
	// If the function is async but does not await something, we don't add the modifier async to the function
	// Just keep that in mind

	// If you wanna throw an error manually after a condition, use new ServiceError(type, message);
	// Mongodb return null if it doesn't find the document, so you can do (!document) throw new ServiceError(type, message);

	// If you need a document from another repository in another module, you use the service of that module to get it throught a function.
	// You do not import directly the repository of another module.
}