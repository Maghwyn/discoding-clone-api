import { Response } from 'express';
import { Body, Controller, Delete, Get, Param, Post, Query, Put, Res, UseFilters, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { ServiceErrorCatcher } from '@/common/error/catch.service';
import { ChannelsService } from '@/routes/channels/channels.service';
import { Jwt } from "@/common/decorators/jwt.decorator";
import { ObjectId } from "mongodb";
import { DTOchannelCreate, DTOChannelUpdate } from "@/routes/channels/dto/channels.dto";

@Controller('channels')
@UseGuards(JwtAuthGuard)
@UseFilters(ServiceErrorCatcher)
export class ChannelsController {
	constructor(private readonly channelsService: ChannelsService) {}

	@Get('searchChannelsAndUsers')
	async searchChannelsAndUsers(
		@Jwt() userId: ObjectId,
		@Query() searchElement: { searchElement: string },
		@Res() res: Response,
	) {
		const [channels, users] = await this.channelsService.searchChannelsAndUsers(
			userId,
			searchElement,
		);

		return res.status(200).json({ channels: channels, users: users });
	}

	@Get(':id')
	async getUserServers(@Param('id') serverId : string, @Res() res: Response) {
		const channels = await this.channelsService.getChannels(serverId);
		return res.status(200).json(channels);
	}

	@Post()
	async createServer( @Body() channel : DTOchannelCreate, @Res() res: Response) {
		const channels = await this.channelsService.createChannel(channel);
		return res.status(201).json(channels);
	}

	@Delete(':id')
	async deleteServer(@Param('id') channelId: string, @Res() res: Response) {
		const channel = await this.channelsService.deleteChannels(channelId);
		return res.status(200).json(channel);
	}

	@Put()
	async updateServer(@Body() server : DTOChannelUpdate, @Res() res: Response) {
		const channel = await this.channelsService.updateChannel(server);
		return res.status(200).json(channel);
	}

}
