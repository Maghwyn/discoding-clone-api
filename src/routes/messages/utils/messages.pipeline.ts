import { Document, ObjectId } from 'mongodb';
import { RelationshipType } from '@/routes/relationship/interfaces/relationship.interface';
import { MessageContext } from '@/routes/messages/interfaces/messages.interface';


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
				_id: 0,
				id: '$_id',
				isOwner: { $eq: ['$userId', userId] },
				userId: { $arrayElemAt: ['$user._id', 0] },
				userPicture: { $arrayElemAt: ['$user.avatarUrl', 0] },
				username: { $arrayElemAt: ['$user.username', 0] },
				channelId: '$contextId',
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

export const privateUnreadMessagesPipeline = (userId: ObjectId): Document[] => {
	return [
		{
			$match: {
				contextType: MessageContext.CONVERSATION,
				isRead: false,
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
											{ $eq: ['$user._id', '$$userIdA'] },
											{ $eq: [userId, '$$userIdB'] },
										]
									},
									{
										$and: [
											{ $eq: [userId, '$$userIdB'] },
											{ $eq: ['$user._id', '$$userIdA'] },
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
			$project: {
				_id: 0,
				id: '$_id',
				isOwner: { $eq: ['$userId', userId] },
				userId: { $arrayElemAt: ['$user._id', 0] },
				userPicture: { $arrayElemAt: ['$user.avatarUrl', 0] },
				username: { $arrayElemAt: ['$user.username', 0] },
				channelId: '$contextId',
				content: '$content',
				isEdited: '$isEdited',
				isBlocked: { $eq: [true, false] },
				createdAt: '$createdAt',
			},
		},
	]
}

export const searchMessagePipeline = (userId: ObjectId, contextId: ObjectId, query: string): Document[] => {
	return [
		{
			$match: {
				contextId: contextId,
				content: new RegExp(query, 'gi')
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
			$project: {
				_id: 0,
				id: '$_id',
				isOwner: { $eq: ['$userId', userId] },
				userId: { $arrayElemAt: ['$user._id', 0] },
				userPicture: { $arrayElemAt: ['$user.avatarUrl', 0] },
				username: { $arrayElemAt: ['$user.username', 0] },
				channelId: '$contextId',
				content: '$content',
				isEdited: '$isEdited',
				isBlocked: { $eq: [true, false] },
				createdAt: '$createdAt',
			},
		},
	]
}

