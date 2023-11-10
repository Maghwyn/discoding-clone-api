import { ObjectId, Document } from "mongodb";

export const directMessagesPipeline = (userId: ObjectId): Document[] => {
	return [
		{
			$match: {
				$or: [
					{ userIdA: userId },
					{ userIdB: userId },
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
			$project: {
				_id: 0,
				id: '$_id',
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