import { ObjectId } from "mongodb";

export interface Relationship {
	_id?: ObjectId;
	type: RelationshipType;
	userIdA: ObjectId;
	userIdB: ObjectId;
	since: Date;
}

export enum RelationshipType {
	PENDING = 0,
	FRIEND = 1,
	BLOCKED = 2,
}