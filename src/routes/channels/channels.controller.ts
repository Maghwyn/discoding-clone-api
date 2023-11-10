import { Response } from 'express';
import { Body, Controller, Get, Param, Post, Query, Res, UseFilters, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { ServiceErrorCatcher } from '@/common/error/catch.service';
import { ChannelsService } from '@/routes/channels/channels.service';
import { Jwt } from "@/common/decorators/jwt.decorator";
import { ObjectId } from "mongodb";

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
}
