import { ObjectId } from "mongodb";

export interface Message {
	_id?: ObjectId;
	contextId: ObjectId;
	contextType: MessageContext; 
	type: MessageType;
	userId: ObjectId;
	content: string;
	isEdited: boolean;
	isRead: boolean;
	createdAt: Date;
}

export interface MessageDetails {
	id: ObjectId;
	isOwner: boolean;
	userId: ObjectId;
	userPicture: string;
	username: string;
	content: string;
	channelId: ObjectId;
	isEdited: boolean;
	isBlocked: boolean;
	createdAt: Date;
}

export interface MessageUpdate {
	id: ObjectId;
	content: string;
}

export interface MessageDelete {
	id: ObjectId;
}

export enum MessageContext {
	CHANNEL = 1,
	CONVERSATION = 2,
}

export type MessageType = 'audio' | 'image' | 'text';