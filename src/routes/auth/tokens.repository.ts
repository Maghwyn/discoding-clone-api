import { Filter, UpdateFilter, Db, InsertOneOptions, DeleteOptions } from 'mongodb';
import { Inject, Injectable } from '@nestjs/common';
import { Token } from '@/routes/auth/interfaces/tokens.interface';

@Injectable()
export class TokensRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {
		this.tokens.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });
	}

	get tokens() {
		return this.db.collection<Token>('users');
	}

	create(doc: Token, options?: InsertOneOptions) {
		return this.tokens.insertOne(doc, options);
	}

	findOneAndUpdate(filter: Filter<Token>, update: UpdateFilter<Token>) {
		return this.tokens.findOneAndUpdate(filter, update);
	}

	deleteMany(filter: Filter<Token>, options?: DeleteOptions) {
		return this.tokens.deleteMany(filter, options);
	}

	async exists(query: Filter<Token>) {
		const options = { projection: { _id: 1 } };
		return (await this.tokens.findOne(query, options)) !== null;
	}
}
