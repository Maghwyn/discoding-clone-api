import { ObjectId } from "mongodb";

export interface Message {
	_id?: ObjectId;
	contextId: ObjectId;
	contextType: MessageContext; 
	type: MessageType;
	userId: ObjectId; // From the userId, you will need to aggregate to the users collection and retrieve useranme, avatarUrl ect.
	content: string;
	isEdited: boolean;
	createdAt: Date;
}

export enum MessageContext {
	CHANNEL = 1,
	CONVERSATION = 2,
}

export type MessageType = 'audio' | 'image' | 'text';