import { ObjectId } from "mongodb";

export interface Server {
	_id?: ObjectId;
	ownerId: ObjectId;
	config: Config;
	iconUrl: string;
	bannerUrl: string;
	name: string;
	isPublic: boolean;
	createdAt: Date;
	members: Array<ObjectId>;
}

export interface Config {
	roles : Array<Role>
}

export interface Role {
	name : string;
}