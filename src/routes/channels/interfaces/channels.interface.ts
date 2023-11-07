import { ObjectId } from 'mongodb';

export interface Channel {
	_id?: ObjectId;
	serverId: ObjectId;
	isDefault: boolean;
	name: string;
	type: ChannelType;
	createdAt: Date;
}

export type ChannelType = 'text' | 'audio';