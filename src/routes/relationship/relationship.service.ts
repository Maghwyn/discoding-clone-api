import { Filter, ObjectId } from 'mongodb';
import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { RelationshipsRepository } from '@/routes/relationship/relationship.repository';
import { Relationship } from '@/routes/relationship/interfaces/relationship.interface';
import { RelationshipType } from '@/routes/relationship/interfaces/relationship.interface';
import { UsersService } from '@/routes/users/users.service';
import { ServiceError } from '@/common/error/catch.service';
import { relationshipListPipeline } from '@/routes/relationship/utils/relationship.pipeline';

@Injectable()
export class RelationshipsService {
	constructor(
		@Inject(forwardRef(() => RelationshipsRepository))
		private readonly relationshipsRepository: RelationshipsRepository,
		private readonly usersService: UsersService,
	) {}

	retrieveFrom(filter: Filter<Relationship>) {
		return this.relationshipsRepository.findOne(filter);
	}

	async createRelation(userId: ObjectId, username: string, type: RelationshipType) {
		const user = await this.usersService.getUserFrom({ username });
		if (!user) throw new ServiceError('NOT_FOUND', 'User not found');
		if (user._id.equals(userId)) {
			const text = type === RelationshipType.FRIEND
				? 'You can\'t be friend with yourself'
				: 'You can\'t block yourself'
			throw new ServiceError('BAD_REQUEST', text);
		}

		const relationship = await this.relationshipsRepository.findOne({
			$or: [
				{ userIdA: userId },
				{ userIdB: userId }
			]
		});

		if (relationship && relationship.type === RelationshipType.BLOCKED) {
			return await this.deleteRelation(relationship._id);
		}

		if (relationship && relationship.type === RelationshipType.FRIEND)
			throw new ServiceError('BAD_REQUEST', 'You are already friend with this person');

		await this.relationshipsRepository.create({
			userIdA: userId,
			userIdB: user._id,
			type,
			since: new Date(),
		});
	}

	async deleteRelation(relationshipId: ObjectId) {
		await this.relationshipsRepository.deleteOne({ _id: relationshipId });
	}

	async retrieveRelationList(userId: ObjectId, type: RelationshipType) {
		if (type !== RelationshipType.PENDING && type !== RelationshipType.FRIEND && type !== RelationshipType.BLOCKED)
			throw new ServiceError('BAD_REQUEST', 'Relation type must be one of 0,1,2');

		return this.relationshipsRepository.aggregate(relationshipListPipeline(userId, type));
	}

	// Create your own business logic here
	// If the function is async but does not await something, we don't add the modifier async to the function
	// Just keep that in mind

	// If you wanna throw an error manually after a condition, use new ServiceError(type, message);
	// Mongodb return null if it doesn't find the document, so you can do (!document) throw new ServiceError(type, message);

	// If you need a document from another repository in another module, you use the service of that module to get it throught a function.
	// You do not import directly the repository of another module.
}
