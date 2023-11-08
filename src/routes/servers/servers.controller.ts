import { Response } from 'express';
import { Controller, Get, Res, UseFilters, UseGuards, Post, Body, Delete, Put, Param} from "@nestjs/common";

import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { ServiceErrorCatcher } from '@/common/error/catch.service';
import { ServersService } from '@/routes/servers/servers.service';
import { Jwt } from "@/common/decorators/jwt.decorator";
import { ObjectId } from "mongodb";

import { DTOserverCreate, DTOserverUpdate } from "@/routes/servers/dto/server.dto";

@Controller('servers')
@UseGuards(JwtAuthGuard)
@UseFilters(ServiceErrorCatcher)
export class ServersController {
	constructor(private readonly serversService: ServersService) {}

	// Create your own controller routes
	// Available tag @Post() @Get() @Put() @Delete() @Patch()

	// ServiceErrorCatcher listen to error thrown by ServiceError and prevent the API from crashing from manual throw
	// Response is imported because we use Reponse from Express, and not Response from node
	@Get()
	async getAll(@Res() res: Response) {
		const servers = await this.serversService.getAllServers();
		return res.status(200).json(servers);
	}

	@Get('/me')
	async getUserServers(@Jwt() userId: ObjectId, @Res() res: Response) {
		const servers = await this.serversService.getUserServer(userId);
		return res.status(200).json(servers);
	}

	@Post()
	async createServer(@Jwt() userId: ObjectId, @Body() server : DTOserverCreate, @Res() res: Response) {
		const servers = await this.serversService.createServer(server, userId);
		return res.status(201).json(servers);
	}

	@Delete(':id')
	async deleteServer(@Jwt() userId: ObjectId, @Param('id') serverId: string, @Res() res: Response) {
		const servers = await this.serversService.deleteServers(serverId, userId);
		return res.status(200).json(servers);
	}

	@Put()
	async updateServer(@Jwt() userId: ObjectId, @Body() server : DTOserverUpdate, @Res() res: Response) {
		const servers = await this.serversService.updateServer(server, userId);
		return res.status(200).json(servers);
	}
}