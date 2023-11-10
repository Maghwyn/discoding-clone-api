import { Filter, ObjectId } from 'mongodb';
import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { ServiceError } from '@/common/error/catch.service';
import { ConversationsRepository } from '@/routes/conversations/conversations.repository';
import { Conversation } from '@/routes/conversations/interfaces/conversations.interface';
import { directMessagesPipeline } from '@/routes/conversations/utils/conversations.pipeline';

@Injectable()
export class ConversationsService {
	constructor(
		@Inject(forwardRef(() => ConversationsRepository))
		private readonly conversationsRepository: ConversationsRepository,
	) {}
	
	createConversation(conversation: Conversation) {
		return this.conversationsRepository.create(conversation);
	}

	retrieveFrom(filter: Filter<Conversation>) {
		return this.conversationsRepository.findOne(filter);
	}

	retrieveManyFrom(filter: Filter<Conversation>) {
		return this.conversationsRepository.find(filter);
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