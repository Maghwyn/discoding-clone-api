import { ObjectId, Document } from "mongodb";

import { RelationshipType } from "@/routes/relationship/interfaces/relationship.interface";

export const relationshipListPipeline = (userId: ObjectId, type: RelationshipType): Document[] => {
	return [
		{
			$match: {
				$or: [
					{ userIdA: userId, type },
					{ userIdB: userId, type },
				],
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: 'userIdA',
				foreignField: '_id',
				as: 'userA',
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: 'userIdB',
				foreignField: '_id',
				as: 'userB',
			},
		},
		{
			$lookup: {
				from: 'conversations',
				let: {
					userIdA: '$userIdA',
					userIdB: '$userIdB',
				},
				pipeline: [
					{
						$match: {
							$expr: {
								$or: [
									{
										$and: [
											{ $eq: ['$userIdA', '$$userIdA'] },
											{ $eq: ['$userIdB', '$$userIdB'] },
										]
									},
									{
										$and: [
											{ $eq: ['$userIdA', '$$userIdB'] },
											{ $eq: ['$userIdB', '$$userIdA'] },
										]
									}
								]
							},
						},
					},
				],
				as: 'conversation',
			},
		},
		{
			$unwind: {
				path: '$conversation',
				preserveNullAndEmptyArrays: true // Preserve the pipeline result if the array is empty
			}
		},
		{
			$project: {
				_id: 0,
				channelId: '$conversation._id',
				userId: {
					$cond: {
						if: { $eq: ['$userIdA', userId] },
						then: { $arrayElemAt: ['$userB._id', 0] },
						else: { $arrayElemAt: ['$userA._id', 0] },
					},
				},
				userPicture: {
					$cond: {
						if: { $eq: ['$userIdA', userId] },
						then: { $arrayElemAt: ['$userB.avatarUrl', 0] },
						else: { $arrayElemAt: ['$userA.avatarUrl', 0] },
					},
				},
				username: {
					$cond: {
						if: { $eq: ['$userIdA', userId] },
						then: { $arrayElemAt: ['$userB.username', 0] },
						else: { $arrayElemAt: ['$userA.username', 0] },
					},
				},
			},
		},
	];
}