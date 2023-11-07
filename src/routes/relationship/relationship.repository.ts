import { Filter, UpdateFilter, Db, InsertOneOptions, DeleteOptions, FindOptions } from 'mongodb';
import { Inject, Injectable } from '@nestjs/common';

import { Relationship } from '@/routes/relationship/interfaces/relationship.interface';

@Injectable()
export class RelationshipsRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get relationships() {
		return this.db.collection<Relationship>('relationships');
	}

	create(doc: Relationship, options?: InsertOneOptions) {
		return this.relationships.insertOne(doc, options);
	}

	findOne(filter: Filter<Relationship>, options?: FindOptions<Document>) {
		return this.relationships.findOne(filter, options);
	}

	findOneAndUpdate(filter: Filter<Relationship>, update: UpdateFilter<Relationship>) {
		return this.relationships.findOneAndUpdate(filter, update);
	}

	deleteOne(filter: Filter<Relationship>, options?: DeleteOptions) {
		return this.relationships.deleteMany(filter, options);
	}

	async exists(query: Filter<Relationship>) {
		const options = { projection: { _id: 1 } };
		return (await this.relationships.findOne(query, options)) !== null;
	}
}
