import { ObjectId } from 'mongodb';

export interface User {
	_id?: ObjectId;
	email: string;
	username: string;
	password: string;
	avatarUrl?: string;
	isActivated: boolean;
	createdAt: Date | string;
}
