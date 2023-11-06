import {
	Filter,
	UpdateFilter,
	Db,
	FindOneAndUpdateOptions,
	OptionalId,
	InsertOneOptions,
	WithId,
	AggregateOptions,
	Document,
} from 'mongodb';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '@/users/interfaces/users.interface';

@Injectable()
export class UsersRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get users() {
		return this.db.collection<User>('users');
	}

	create(doc: OptionalId<User>, options?: InsertOneOptions) {
		return this.users.insertOne(doc, options);
	}

	findOne<T = User, E = WithId<T>>(
		query: Filter<User>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.users.findOne<E>(query, options);
	}

	updateOne(query: Filter<User>, update: Partial<User> | UpdateFilter<User>) {
		return this.users.updateOne(query, update);
	}

	findOneAndUpdate(filter: Filter<User>, update: UpdateFilter<User>) {
		return this.users.findOneAndUpdate(filter, update);
	}

	aggregate(pipeline: Array<Document>, options?: AggregateOptions) {
		return this.users.aggregate(pipeline, options).toArray();
	}

	async exists(query: Filter<User>) {
		const options = { projection: { _id: 1 } };
		return (await this.users.findOne(query, options)) !== null;
	}
}
