import { AggregateOptions, Filter, FindOneAndUpdateOptions, ObjectId, Document } from 'mongodb';
import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { UsersRepository } from '@/routes/users/users.repository';
import { User } from '@/routes/users/interfaces/users.interface';
import { KeysRequired } from '@/common/interfaces/advanced.interface';

@Injectable()
export class UsersService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		private readonly usersRepository: UsersRepository,
	) {}

	createUser(user: User) {
		return this.usersRepository.create(user);
	}

	getUserFrom(query: Filter<User>) {
		return this.usersRepository.findOne(query);
	}

	retrieveUserInformation<
		T extends FindOneAndUpdateOptions,
		E extends KeysRequired<T['projection'] | User>,
	>(query: Filter<User>, projection: T) {
		return this.usersRepository.findOne<Pick<User, E>>(query, projection);
	}

	activateAccount(userId: ObjectId) {
		return this.usersRepository.findOneAndUpdate(
			{ _id: userId },
			{ $set: { isActivated: true } },
		);
	}

	isAccountActivated(userId: ObjectId) {
		return this.usersRepository.exists({ _id: userId, isActivated: true });
	}

	updateUserPassword(userId: ObjectId, password: string) {
		return this.usersRepository.updateOne({ _id: userId }, { $set: { password } });
	}

	aggregateUser(pipeline: Array<Document>, options?: AggregateOptions) {
		return this.usersRepository.aggregate(pipeline, options);
	}

	userExists(query: Filter<User>) {
		return this.usersRepository.exists(query);
	}
}
