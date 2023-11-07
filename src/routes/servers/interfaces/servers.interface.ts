import { ObjectId } from "mongodb";

export interface Server {
	_id?: ObjectId;
	ownerId: ObjectId;
	configId: ObjectId;
	iconUrl: string;
	bannerUrl: string;
	name: string;
	isPublic: boolean;
	createdAt: Date;
}