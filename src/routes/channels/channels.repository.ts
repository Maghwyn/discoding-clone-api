import { Filter, UpdateFilter, Db, InsertOneOptions, DeleteOptions, FindOptions } from 'mongodb';
import { Inject, Injectable } from '@nestjs/common';

import { Channel } from '@/routes/channels/interfaces/channels.interface';

@Injectable()
export class ChannelsRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get channels() {
		return this.db.collection<Channel>('channels');
	}

	create(doc: Channel, options?: InsertOneOptions) {
		return this.channels.insertOne(doc, options);
	}

	find(filter: Filter<Channel>, options?: FindOptions<Document>) {
		return this.channels.find(filter, options);
	}
	findOne(filter: Filter<Channel>, options?: FindOptions<Document>) {
		return this.channels.findOne(filter, options);
	}

	findOneAndUpdate(filter: Filter<Channel>, update: UpdateFilter<Channel>) {
		return this.channels.findOneAndUpdate(filter, update);
	}

	deleteOne(filter: Filter<Channel>, options?: DeleteOptions) {
		return this.channels.deleteOne(filter, options);
	}

	async exists(query: Filter<Channel>) {
		const options = { projection: { _id: 1 } };
		return (await this.channels.findOne(query, options)) !== null;
	}
}
