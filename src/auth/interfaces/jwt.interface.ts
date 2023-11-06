import { ObjectId } from 'mongodb';

export interface JwtTokenData {
	token: string;
}

export interface JwtPayload {
	id: string | ObjectId;
	iat: number;
	exp: number;
	refresh?: string;
}
