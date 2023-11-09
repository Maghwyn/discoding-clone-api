import { Document, ObjectId } from 'mongodb';
import { RelationshipType } from '@/routes/relationship/interfaces/relationship.interface';

export const channelMessagesPipeline = (userId: ObjectId, contextId: ObjectId): Document[] => {
	return [
		{
			$match: {
				contextId: contextId,
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: 'userId',
				foreignField: '_id',
				as: 'user',
			},
		},
		{
			$lookup: {
				from: 'relationships',
				let: { userId: '$userId' },
				pipeline: [
					{
						$match: {
							$expr: {
								$or: [
									{ $eq: ['$userIdA', '$$userId'] },
									{ $eq: ['$userIdB', '$$userId'] },
								],
							},
							type: RelationshipType.BLOCKED,
						},
					},
				],
				as: 'blockedRelationships',
			},
		},
		// Could unwind the users
		{
			$project: {
				id: '$_id',
				isOwner: { $eq: ['$userId', userId] },
				userId: { $arrayElemAt: ['$user._id', 0] },
				userPicture: { $arrayElemAt: ['$user.avatarUrl', 0] },
				username: { $arrayElemAt: ['$user.username', 0] },
				content: '$content',
				isEdited: '$isEdited',
				isBlocked: {
					$cond: {
						if: { $gt: [{ $size: '$blockedRelationships' }, 0] },
						then: true,
						else: false,
					},
				},
				createdAt: '$createdAt',
			},
		},
	]
} 