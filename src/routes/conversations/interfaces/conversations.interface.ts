import { ObjectId } from "mongodb";

export interface Conversation {
	_id?: ObjectId;
	userIdA: ObjectId;
	userIdB: ObjectId;
	createdAt: Date;
	updatedAt: Date;
}