import { ObjectId } from 'mongodb';

export interface Token {
	_id?: ObjectId;
	userId: ObjectId;
	token: string;
	expireAt: Date;
	type: TokenType;
}

export enum TokenEnum {
	ACTIVATION = 1,
	RESET_PWD = 2,
}

export type TokenType = (typeof TokenEnum)[keyof typeof TokenEnum];
