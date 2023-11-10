import { ObjectId } from 'mongodb';
import { Response } from 'express';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UseFilters, UseGuards } from '@nestjs/common';

import { Jwt } from '@/common/decorators/jwt.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { ServiceErrorCatcher } from '@/common/error/catch.service';
import { MessagesService } from '@/routes/messages/messages.service';
import { DTOContextContentMessage, DTOContextMessage } from '@/routes/messages/dto/messages.dto';

@Controller('messages')
@UseGuards(JwtAuthGuard)
@UseFilters(ServiceErrorCatcher)
export class MessagesController {
	constructor(private readonly messagesService: MessagesService) {}

	@Post('/private')
	async sendMessage(@Jwt() userId: ObjectId, @Body() body: DTOContextContentMessage, @Res() res: Response) {
		const conversationId = await this.messagesService.createPrivateMessage(userId, body.contextId, body.content);
		return res.status(201).json(conversationId);
	}


	@Get('/private/unreads')
	async retrievePrivateUnreads(@Jwt() userId: ObjectId, @Res() res: Response) {
		const messages = await this.messagesService.retrievePrivateUnreads(userId);
		return res.status(200).json(messages);
	}

	@Post('/private/delete/:id')
	async deleteMessage(@Jwt() userId: ObjectId, @Param('id') messageId: string, @Body() body: DTOContextMessage,  @Res() res: Response) {
		await this.messagesService.deletePrivateMessage(userId, messageId, body.contextId);
		return res.status(200).json();
	}

	@Patch('/:id')
	async editMessage(@Jwt() userId: ObjectId, @Param('id') messageId: string, @Body() body: DTOContextContentMessage, @Res() res: Response) {
		await this.messagesService.editMessage(userId, messageId, body.contextId, body.content);
		return res.status(200).json();
	}

	@Get('/search/:channelId')
	async searchMessageInChannel(@Jwt() userId: ObjectId, @Param('channelId') channelId: string, @Query('q') query: string, @Res() res: Response) {
		const messages = await this.messagesService.searchMessageInChannel(userId, channelId, query);
		return res.status(200).json(messages);
	}

	@Get('/channel/:id')
	async retrieveMessageFromChannel(@Jwt() userId: ObjectId, @Param('id') channelId: string, @Query('context') context: string, @Res() res: Response) {
		const messages = await this.messagesService.retrieveChannelMessages(userId, channelId, parseInt(context));
		return res.status(200).json(messages);
	}

	// Create your own controller routes
	// Available tag @Post() @Get() @Put() @Delete() @Patch()

	// ServiceErrorCatcher listen to error thrown by ServiceError and prevent the API from crashing from manual throw
	// Response is imported because we use Reponse from Express, and not Response from node
}