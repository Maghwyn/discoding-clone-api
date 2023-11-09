import { Response } from 'express';
import { Body, Controller, Get, Post, Res, UseFilters, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { ServiceErrorCatcher } from '@/common/error/catch.service';
import { RelationshipsService } from '@/routes/relationship/relationship.service';
import { Jwt } from "@/common/decorators/jwt.decorator";
import { ObjectId } from "mongodb";

@Controller('relationships')
@UseGuards(JwtAuthGuard)
@UseFilters(ServiceErrorCatcher)
export class RelationshipsController {
	constructor(private readonly relationshipsService: RelationshipsService) {}

	@Post('addFriend')
	async addFriend(@Jwt() userId: ObjectId, @Body() friendPseudo:  { username : string } ,@Res() res: Response) {
		const user = await this.relationshipsService.addFriend(userId, friendPseudo);
		return res.status(200).json(user);
	}

	// Create your own controller routes
	// Available tag @Post() @Get() @Put() @Delete() @Patch()

	// ServiceErrorCatcher listen to error thrown by ServiceError and prevent the API from crashing from manual throw
	// Response is imported because we use Reponse from Express, and not Response from node
}