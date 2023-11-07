import { Filter, UpdateFilter, Db, InsertOneOptions, DeleteOptions, FindOptions } from 'mongodb';
import { Inject, Injectable } from '@nestjs/common';

import { Friend } from '@/routes/friends/interfaces/friends.interface';

@Injectable()
export class FriendsRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get friends() {
		return this.db.collection<Friend>('friends');
	}

	create(doc: Friend, options?: InsertOneOptions) {
		return this.friends.insertOne(doc, options);
	}

	findOne(filter: Filter<Friend>, options?: FindOptions<Document>) {
		return this.friends.findOne(filter, options);
	}

	findOneAndUpdate(filter: Filter<Friend>, update: UpdateFilter<Friend>) {
		return this.friends.findOneAndUpdate(filter, update);
	}

	deleteOne(filter: Filter<Friend>, options?: DeleteOptions) {
		return this.friends.deleteMany(filter, options);
	}

	async exists(query: Filter<Friend>) {
		const options = { projection: { _id: 1 } };
		return (await this.friends.findOne(query, options)) !== null;
	}
}
