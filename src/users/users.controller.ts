import { Response } from 'express';
import { ObjectId } from 'mongodb';
import { Controller, Get, Res, UseFilters, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { Jwt } from '@/common/decorators/jwt.decorator';
import { UsersService } from '@/users/users.service';
import { ServiceErrorCatcher } from '@/common/error/catch.service';
import { USER_EMAIL_PROJECTION } from '@/users/utils/users.projection';

@Controller('users')
@UseGuards(JwtAuthGuard)
@UseFilters(ServiceErrorCatcher)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('me')
	async getme(@Jwt() userId: ObjectId, @Res() res: Response) {
		const user = await this.usersService.retrieveUserInformation(userId, USER_EMAIL_PROJECTION);
		return res.status(200).json(user);
	}
}
