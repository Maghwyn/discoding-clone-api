import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '@/routes/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
	constructor(private authService: AuthService) {
		super({
			usernameField: 'email',
		});
	}

	async validate(email: string, password: string) {
		const userId = await this.authService.validateUser(email, password);
		if (!userId) throw new UnauthorizedException(); // Wrong Pwd/email or not activated

		return { id: userId };
	}
}
