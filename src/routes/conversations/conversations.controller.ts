import { Response } from 'express';
import { ObjectId } from 'mongodb';
import { Body, Controller, Get, Post, Res, UseFilters, UseGuards } from '@nestjs/common';

import { Jwt } from '@/common/decorators/jwt.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { ServiceErrorCatcher } from '@/common/error/catch.service';
import { ConversationsService } from '@/routes/conversations/conversations.service';
import { DTOEmptyConversation } from '@/routes/conversations/dto/conversations.dto';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
@UseFilters(ServiceErrorCatcher)
export class ConversationsController {
	constructor(private readonly conversationsService: ConversationsService) {}

	@Get()
	async getAllConversations(@Jwt() userId: ObjectId, @Res() res: Response) {
		const directMessages = await this.conversationsService.retrieveMyConversations(userId);
		return res.status(200).json(directMessages);
	}

	@Post()
	async createEmptyConversations(@Jwt() userId: ObjectId, @Body() body: DTOEmptyConversation, @Res() res: Response) {
		const directMessages = await this.conversationsService.createEmptyConversation(userId, body.userId);
		return res.status(200).json(directMessages);
	}

	// Create your own controller routes
	// Available tag @Post() @Get() @Put() @Delete() @Patch()

	// ServiceErrorCatcher listen to error thrown by ServiceError and prevent the API from crashing from manual throw
	// Response is imported because we use Reponse from Express, and not Response from node
}