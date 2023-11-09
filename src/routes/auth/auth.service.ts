import { ObjectId } from 'mongodb';
import { JwtService } from '@nestjs/jwt';
import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { UsersService } from '@/routes/users/users.service';
import { ServiceError } from '@/common/error/catch.service';
import {
	argonVerify,
	generateRandomBuffer,
	generateRandomToken,
	hash,
} from '@/common/helpers/string.helper';
import { DTOActivationToken, DTOAuthSignup, DTOResetPassword } from '@/routes/auth/dto/auth.dto';
import { AuthEventEmitter } from '@/routes/auth/events/auth.events';
import { TokensRepository } from '@/routes/auth/tokens.repository';
import { TokenEnum } from '@/routes/auth/interfaces/tokens.interface';

@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => UsersService))
		private readonly usersService: UsersService,
		@Inject(forwardRef(() => TokensRepository))
		private readonly tokensRepository: TokensRepository,
		private readonly authEventEmitter: AuthEventEmitter,
		private readonly jwtService: JwtService,
	) {}

	async signup(payload: DTOAuthSignup) {
		const result = await this.usersService.userExists({ email: payload.email });
		if (result) return null; //! Prevent email mapping by always returning 201

		const salt = generateRandomBuffer(32);
		const hashedPassword = await hash(payload.password, salt);

		await this.usersService.createUser({
			email: payload.email,
			username: payload.username.toLowerCase().trim(),
			password: hashedPassword,
			isActivated: false,
			createdAt: new Date(),
		});
		await this.askActivationToken(payload.email);
	}

	async validateUser(email: string, password: string) {
		const user = await this.usersService.getUserFrom({ email });
		if (!user) return null;

		const passwordMatch = await argonVerify(user.password, password);
		if (!passwordMatch) return null;

		// if (!user.isActivated) return null;
		else return user._id;
	}

	async checkAuth(userId: ObjectId) {
		const result = await this.usersService.userExists({ _id: userId });
		if (!result)
			throw new ServiceError(
				'UNAUTHORIZED',
				'You do not have the rights to access this ressource.',
			);
	}

	async generateTokenById(userId: ObjectId) {
		const token = await this.jwtService.signAsync({ id: userId.toString() });
		return JSON.stringify({ token: token });
	}

	//!---------------------------------------------------------------
	public async askActivationToken(email: string) {
		try {
			const activationToken = await this._createToken(email, TokenEnum.ACTIVATION);
			this.authEventEmitter.askActivationToken(email, activationToken);
		} catch (err) {
			return; // Prevent the digging of registered emails by always returning 201
		}
	}

	public async askResetPwdToken(email: string) {
		try {
			const resetPwdToken = await this._createToken(email, TokenEnum.RESET_PWD);
			this.authEventEmitter.askResetPwdToken(email, resetPwdToken);
		} catch (err) {
			return; // Prevent the digging of registered emails by always returning 201
		}
	}

	private async _createToken(email: string, type: TokenEnum) {
		const user = await this.usersService.getUserFrom({ email });
		if (!user || (user?.isActivated && type === TokenEnum.ACTIVATION))
			//! We should not give information whether it's validated or if it does not exist
			throw new ServiceError('BAD_REQUEST', 'Invalid payload');

		const tokenExists = await this.tokensRepository.exists({ userId: user._id, type });
		if (tokenExists) {
			await this.tokensRepository.deleteMany({ userId: user._id, type });
		}

		// Generate the expiration
		const currentDate = new Date();
		const inSixHours = new Date(currentDate);
		inSixHours.setHours(currentDate.getHours() + 6);

		const token = generateRandomToken();
		await this.tokensRepository.create({
			userId: user._id,
			token: token,
			expireAt: inSixHours,
			type,
		});

		return token;
	}
	//!---------------------------------------------------------------

	//!---------------------------------------------------------------
	async activateAccount(payload: DTOActivationToken) {
		const userId = await this.verifyTokenValidity(payload.token, TokenEnum.ACTIVATION);
		const isActivated = await this.usersService.isAccountActivated(userId);
		if (isActivated) throw new ServiceError('BAD_REQUEST', 'Invalid payload');

		const user = await this.usersService.activateAccount(userId);
		this.authEventEmitter.accountValidated(user.email);
		return userId;
	}

	async resetPassword(payload: DTOResetPassword) {
		const userId = await this.verifyTokenValidity(payload.token, TokenEnum.RESET_PWD);
		const password = payload.password;

		const salt = generateRandomBuffer(32);
		const hashedPassword = await hash(password, salt);
		await this.usersService.updateUserPassword(userId, hashedPassword);
	}

	async verifyTokenValidity(token: string, type: TokenEnum) {
		const document = await this.tokensRepository.findOneAndUpdate(
			{ token, type },
			{ $set: { expireAt: new Date(-1) } },
		);
		if (!document) throw new ServiceError('BAD_REQUEST', 'Invalid token');

		return document.userId;
	}
	//!---------------------------------------------------------------
}
