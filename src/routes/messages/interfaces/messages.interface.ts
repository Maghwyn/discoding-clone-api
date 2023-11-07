import { ObjectId } from "mongodb";

export interface Message {
	_id?: ObjectId;
	channelId?: ObjectId;
	conversationId?: ObjectId;
	userId: ObjectId; // From the userId, you will need to aggregate to the users collection and retrieve useranme, avatarUrl ect.
	content: string;
	isEdited: boolean;
	createdAt: Date;
}