import { ObjectId } from 'mongodb';
import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { ChannelsRepository } from '@/routes/channels/channels.repository';
import { ServersService } from '@/routes/servers/servers.service';
import { UsersService } from '@/routes/users/users.service';
import { RelationshipsService } from '@/routes/relationship/relationship.service';
import { ServersRepository } from '@/routes/servers/servers.repository';
import { ConversationsService } from '@/routes/conversations/conversations.service';
import { ChannelType } from '@/routes/channels/interfaces/channels.interface';
import { DTOchannelCreate, DTOChannelUpdate } from '@/routes/channels/dto/channels.dto';

interface ChannelsList {
	serverId: ObjectId;
	channelId: ObjectId;
	channelName: string;
	channelType: ChannelType;
}

interface MembersList {
	conversationId: ObjectId;
	username: string;
	avatarUrl: string;
}

@Injectable()
export class ChannelsService {
	constructor(
		@Inject(forwardRef(() => ServersService))
		private readonly serversService: ServersService,
		private readonly serverRepo: ServersRepository,
		@Inject(forwardRef(() => ChannelsRepository))
		private readonly channelsRepository: ChannelsRepository,
		private readonly usersService: UsersService,
		private readonly relationshipsService: RelationshipsService,
		private readonly conversationsService: ConversationsService,
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
  
	getChannels(serverId: string) {
		return this.channelsRepository.findChannels({ serverId: new ObjectId(serverId) });
	}

	getOneChannel(channelId : ObjectId){
		return this.channelsRepository.findOne({_id: channelId})
	}

	deleteChannels(channelId: string) {
		return this.channelsRepository.deleteOne({ _id: new ObjectId(channelId) });
	}

	updateChannel(channel: DTOChannelUpdate) {
		return this.channelsRepository.findOneAndUpdate(
			{
				_id: new ObjectId(channel._id),
			},
			{
				$set: {
					name: channel.name,
				},
			},
		);
	}
	async searchChannelsAndUsers(userId, searchElement) {
		// get all channels from server
		const allChannels: ChannelsList[] = [];
		const allMembers: MembersList[] = [];

		const conversationFilter = {
			$or: [{ userIdA: userId }, { userIdB: userId }],
		};

		const conversations = await this.conversationsService
			.retrieveManyFrom(conversationFilter)
			.toArray();

		conversations.map(async (conv) => {
			if (userId.equals(conv.userIdA)) {
				const otherUserInfo = await this.usersService.getUserFrom(conv.userIdB);
				allMembers.push({
					conversationId: conv?._id,
					username: otherUserInfo.username,
					avatarUrl: otherUserInfo?.avatarUrl,
				});
			} else {
				const otherUserInfo = await this.usersService.getUserFrom(conv.userIdA);
				allMembers.push({
					conversationId: conv?._id,
					username: otherUserInfo.username,
					avatarUrl: otherUserInfo?.avatarUrl,
				});
			}
		});

		// look for server where the user is in
		const usersServer = await this.serversService.getUserServer(userId);
		if (usersServer !== null) {
			usersServer.map(async (server) => {
				const channelsFromServer = await this.channelsRepository
					.find({
						serverId: server._id,
					})
					.toArray();

				channelsFromServer.map((channelFromServer) => {
					allChannels.push({
						serverId: channelFromServer.serverId,
						channelId: channelFromServer._id,
						channelName: channelFromServer.name,
						channelType: channelFromServer.type,
					});
				});

				server.members.map(async (member) => {
					const memberInfo = await this.usersService.getUserFrom(member);

					// handle if user is member in another serve
					if (!memberInfo._id.equals(userId)) {
						let isMemberAlreadyThere = false;
						allMembers.map((member) => {
							if (member.username == memberInfo.username) {
								isMemberAlreadyThere = true;
							}
						});

						if (!isMemberAlreadyThere) {
							allMembers.push({
								conversationId: undefined,
								username: memberInfo.username,
								avatarUrl: memberInfo?.avatarUrl,
							});
						}
					}
				});
			});
		}

		// Get userFriends
		const userFriends = await this.relationshipsService
			.retrieveManyFrom({
				$or: [{ userIdA: userId }, { userIdB: userId }],
				type: 1,
			})
			.toArray();

		let isMemberAlreadyThere = false;
		const promise = userFriends.map(async (userFriend) => {
			let userFriendInfo;
			if (userId.equals(userFriend.userIdA)) {
				userFriendInfo = await this.usersService.getUserFrom({ _id: userFriend.userIdB });
			} else {
				userFriendInfo = await this.usersService.getUserFrom({ _id: userFriend.userIdA });
			}

			allMembers.map((member) => {
				if (member.username == userFriendInfo.username) {
					isMemberAlreadyThere = true;
				}
			});

			if (!isMemberAlreadyThere) {
				allMembers.push({
					conversationId: undefined,
					username: userFriendInfo.username,
					avatarUrl: userFriendInfo?.avatarUrl,
				});
			}
		});

		await Promise.all(promise);

		return [allChannels, allMembers];
	}
}
