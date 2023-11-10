import { Filter, UpdateFilter, Db, InsertOneOptions, DeleteOptions, FindOptions } from 'mongodb';
import { Inject, Injectable } from '@nestjs/common';

import { Server } from '@/routes/servers/interfaces/servers.interface';

@Injectable()
export class ServersRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get servers() {
		return this.db.collection<Server>('servers');
	}

	create(doc: Server, options?: InsertOneOptions) {
		return this.servers.insertOne(doc, options).then(result => {return result.insertedId});
	}
	findServers(filter?: Filter<Server>){
		return this.servers.find(filter).toArray();
	}
	findOne(filter: Filter<Server>, options?: FindOptions<Document>) {
		return this.servers.findOne(filter, options);
	}

	findOneAndUpdate(filter: Filter<Server>, update: UpdateFilter<Server>) {
		return this.servers.findOneAndUpdate(filter, update);
	}

	deleteOne(filter: Filter<Server>, options?: DeleteOptions) {
		return this.servers.deleteMany(filter, options);
	}

	async exists(query: Filter<Server>) {
		const options = { projection: { _id: 1 } };
		return (await this.servers.findOne(query, options)) !== null;
	}
}
