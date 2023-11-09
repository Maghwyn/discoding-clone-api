import { Filter, UpdateFilter, Db, InsertOneOptions, DeleteOptions, FindOptions, Document } from 'mongodb';
import { Inject, Injectable } from '@nestjs/common';

import { Conversation } from '@/routes/conversations/interfaces/conversations.interface';

@Injectable()
export class ConversationsRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get conversations() {
		return this.db.collection<Conversation>('conversations');
	}

	create(doc: Conversation, options?: InsertOneOptions) {
		return this.conversations.insertOne(doc, options);
	}

	findOne(filter: Filter<Conversation>, options?: FindOptions<Document>) {
		return this.conversations.findOne(filter, options);
	}

	findOneAndUpdate(filter: Filter<Conversation>, update: UpdateFilter<Conversation>) {
		return this.conversations.findOneAndUpdate(filter, update);
	}

	// For the conversation, you need a soft delete.
	// So it's not visible for userA for exameple, but visible for userB as he did not delete it
	deleteOne(filter: Filter<Conversation>, options?: DeleteOptions) {
		return this.conversations.deleteMany(filter, options);
	}

	aggregate(pipeline: Document[]) {
		return this.conversations.aggregate(pipeline).toArray();
	}

	async exists(query: Filter<Conversation>) {
		const options = { projection: { _id: 1 } };
		return (await this.conversations.findOne(query, options)) !== null;
	}
}
