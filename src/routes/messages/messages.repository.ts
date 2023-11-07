import { Filter, UpdateFilter, Db, InsertOneOptions, DeleteOptions, FindOptions } from 'mongodb';
import { Inject, Injectable } from '@nestjs/common';

import { Message } from '@/routes/messages/interfaces/messages.interface';

@Injectable()
export class MessagesRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get messages() {
		return this.db.collection<Message>('messages');
	}

	create(doc: Message, options?: InsertOneOptions) {
		return this.messages.insertOne(doc, options);
	}

	findOne(filter: Filter<Message>, options?: FindOptions<Document>) {
		return this.messages.findOne(filter, options);
	}

	findOneAndUpdate(filter: Filter<Message>, update: UpdateFilter<Message>) {
		return this.messages.findOneAndUpdate(filter, update);
	}

	deleteOne(filter: Filter<Message>, options?: DeleteOptions) {
		return this.messages.deleteMany(filter, options);
	}

	async exists(query: Filter<Message>) {
		const options = { projection: { _id: 1 } };
		return (await this.messages.findOne(query, options)) !== null;
	}
}
