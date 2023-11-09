import { ObjectId } from 'mongodb';
import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { RelationshipsRepository } from '@/routes/relationship/relationship.repository';
import { RelationshipType } from '@/routes/relationship/interfaces/relationship.interface';
import { UsersService } from '@/routes/users/users.service';

@Injectable()
export class RelationshipsService {
	constructor(
		@Inject(forwardRef(() => RelationshipsRepository))
		private readonly relationshipsRepository: RelationshipsRepository,
		private readonly usersService: UsersService,
	) {}

	async addFriend(userId: ObjectId, friendUsername: { username: string }) {
		try {
			const friendUserInfo = await this.usersService.getUserFrom({
				username: friendUsername.username,
			});

			// check if the user exist
			if (friendUserInfo == null) {
				return 'User does not exist';
			}

			// check if he is not asking himself
			const userIdB = friendUserInfo._id;

			if (userId.equals(userIdB)) {
				return "You can't be friend with yourself";
			}

			// check if the user is already friend with him
			const userB = await this.relationshipsRepository.findOne({ userIdB: userIdB });

			if (userB !== null) {
				return 'You are already friend with this person';
			}

			const relationshipObject = {
				type: RelationshipType.FRIEND,
				userIdA: userId,
				userIdB: userIdB,
				since: new Date(),
			};

			this.relationshipsRepository.create(relationshipObject);

			return 'friend added';
		} catch (error) {
			console.error('Error:', error);
		}
	}

	// Create your own business logic here
	// If the function is async but does not await something, we don't add the modifier async to the function
	// Just keep that in mind

	// If you wanna throw an error manually after a condition, use new ServiceError(type, message);
	// Mongodb return null if it doesn't find the document, so you can do (!document) throw new ServiceError(type, message);

	// If you need a document from another repository in another module, you use the service of that module to get it throught a function.
	// You do not import directly the repository of another module.
}
