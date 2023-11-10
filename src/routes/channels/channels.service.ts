import { ObjectId } from 'mongodb';
import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { ServiceError } from '@/common/error/catch.service';
import { ChannelsRepository } from '@/routes/channels/channels.repository';
import { ServersService } from '@/routes/servers/servers.service';
import { DTOchannelCreate, DTOChannelUpdate } from "@/routes/channels/dto/channels.dto";

@Injectable()
export class ChannelsService {
	constructor(
		@Inject(forwardRef(() => ServersService))
		private readonly serversService: ServersService,
		@Inject(forwardRef(() => ChannelsRepository))
		private readonly channelsRepository: ChannelsRepository,
	) {}

	public createChannel(Channel: DTOchannelCreate, isDefault : boolean) {
		return this.channelsRepository.create({
			name: Channel.name,
			_id: new ObjectId(),
			createdAt: new Date(),
			type: Channel.type,
			isDefault: isDefault,
			serverId: new ObjectId(Channel.serverId)
		}).then(res => {return res.insertedId});
	}
	getOneChannel(channelId : ObjectId){
		return this.channelsRepository.findOne({_id: channelId})
	}
	getChannels(serverId : string) {
		return this.channelsRepository.findChannels({ serverId: new ObjectId(serverId) });
	}

	deleteChannels(channelId: string) {
		return this.channelsRepository.deleteOne({ _id: new ObjectId(channelId) });
	}

	updateChannel(channel: DTOChannelUpdate) {
		return this.channelsRepository.findOneAndUpdate({
			_id: new ObjectId(channel._id),
		}, {
			$set: {
				name: channel.name,
			}
		});
	}
	// Create your own business logic here
	// If the function is async but does not await something, we don't add the modifier async to the function
	// Just keep that in mind

	// If you wanna throw an error manually after a condition, use new ServiceError(type, message);
	// Mongodb return null if it doesn't find the document, so you can do (!document) throw new ServiceError(type, message);

	// If you need a document from another repository in another module, you use the service of that module to get it throught a function.
	// You do not import directly the repository of another module.
}