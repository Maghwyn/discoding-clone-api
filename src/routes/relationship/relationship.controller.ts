import { ObjectId } from "mongodb";
import { Response } from 'express';
import { Body, Controller, Get, Post, Query, Res, UseFilters, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { Jwt } from "@/common/decorators/jwt.decorator";
import { ServiceErrorCatcher } from '@/common/error/catch.service';
import { RelationshipsService } from '@/routes/relationship/relationship.service';
import { DTOCreateRelationShip } from "@/routes/relationship/dto/relationship.dto";

@Controller('relationships')
@UseGuards(JwtAuthGuard)
@UseFilters(ServiceErrorCatcher)
export class RelationshipsController {
	constructor(private readonly relationshipsService: RelationshipsService) {}

	@Post()
	async createRelationship(@Jwt() userId: ObjectId, @Body() body: DTOCreateRelationShip, @Res() res: Response) {
		const user = await this.relationshipsService.createRelation(userId, body.username, body.type);
		return res.status(201).json(user);
	}

	@Get()
	async retrieveRelationList(@Jwt() userId: ObjectId, @Query('type') type: string, @Res() res: Response) {
		const list = await this.relationshipsService.retrieveRelationList(userId, parseInt(type));
		return res.status(200).json(list);
	}

	// Create your own controller routes
	// Available tag @Post() @Get() @Put() @Delete() @Patch()

	// ServiceErrorCatcher listen to error thrown by ServiceError and prevent the API from crashing from manual throw
	// Response is imported because we use Reponse from Express, and not Response from node
}