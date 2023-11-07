import { ObjectId } from "mongodb";

export interface Friend {
	_id?: ObjectId;
	userIdA: ObjectId;
	userIdB: ObjectId;
	createdAt: Date;
}