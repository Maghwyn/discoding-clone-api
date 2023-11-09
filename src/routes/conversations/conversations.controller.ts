import { Response } from 'express';
import { Controller, Get, Res, UseFilters, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { ServiceErrorCatcher } from '@/common/error/catch.service';
import { ConversationsService } from '@/routes/conversations/conversations.service';
import { Jwt } from '@/common/decorators/jwt.decorator';
import { ObjectId } from 'mongodb';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
@UseFilters(ServiceErrorCatcher)
export class ConversationsController {
	constructor(private readonly conversationsService: ConversationsService) {}

	@Get('')
	async getAllConversations(@Jwt() userId: ObjectId, @Res() res: Response) {
		const directMessages = await this.conversationsService.retrieveMyConversations(userId);
		return res.status(200).json(directMessages);
	}

	// Create your own controller routes
	// Available tag @Post() @Get() @Put() @Delete() @Patch()

	// ServiceErrorCatcher listen to error thrown by ServiceError and prevent the API from crashing from manual throw
	// Response is imported because we use Reponse from Express, and not Response from node
}