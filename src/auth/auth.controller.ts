import { ObjectId } from 'mongodb';
import { Response } from 'express';
import { Body, Controller, Post, Res, UseFilters, UseGuards } from '@nestjs/common';

import { AuthService } from '@/auth/auth.service';
import { ServiceErrorCatcher } from '@/common/error/catch.service';
import { LocalAuthGuard } from '@/common/guards/local.guard';
import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { createAuthCookie, expireAuthCookie } from '@/auth/utils/auth.cookie';
import { Jwt } from '@/common/decorators/jwt.decorator';
import { Local } from '@/common/decorators/local.decorator';
import {
	DTOActivationToken,
	DTOAuthEmail,
	DTOAuthSignup,
	DTOResetPassword,
} from '@/auth/dto/auth.dto';

@Controller('auth')
@UseFilters(ServiceErrorCatcher)
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('')
	@UseGuards(JwtAuthGuard)
	async isAuth(@Jwt() userId: ObjectId, @Res() res: Response) {
		await this.authService.checkAuth(userId);
		return res.status(200).json();
	}

	@Post('signup')
	async signUp(@Body() body: DTOAuthSignup, @Res() res: Response) {
		await this.authService.signup(body);
		return res.status(201).json();
	}

	@Post('signin')
	@UseGuards(LocalAuthGuard)
	async signin(@Local() userId: ObjectId, @Res() res: Response) {
		const strategy = await this.authService.generateTokenById(userId);
		res.setHeader('Set-Cookie', createAuthCookie(strategy));
		return res.status(200).json();
	}

	@Post('logout')
	@UseGuards(JwtAuthGuard)
	async logout(@Res() res: Response) {
		res.setHeader('Set-Cookie', expireAuthCookie());
		return res.status(200).json();
	}

	@Post('ask-activation-token')
	async askActivationToken(@Body() body: DTOAuthEmail, @Res() res: Response) {
		await this.authService.askActivationToken(body.email);
		return res.status(201).json();
	}

	@Post('ask-reset-token')
	async askResetToken(@Body() body: DTOAuthEmail, @Res() res: Response) {
		await this.authService.askResetPwdToken(body.email);
		return res.status(201).json();
	}

	@Post('activate')
	async activateAccount(@Body() body: DTOActivationToken, @Res() res: Response) {
		const userId = await this.authService.activateAccount(body);
		const strategy = await this.authService.generateTokenById(userId);
		res.setHeader('Set-Cookie', createAuthCookie(strategy));
		return res.status(200).json();
	}

	@Post('reset-password')
	async resetPassword(@Body() body: DTOResetPassword, @Res() res: Response) {
		await this.authService.resetPassword(body);
		return res.status(200).json();
	}
}
