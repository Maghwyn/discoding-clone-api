import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

import {
	EMAIL_FORMAT,
	PASSWORD_FORMAT,
	USERNAME_FORMAT,
} from '@/common/constants/global';

export class DTOAuthSignup {
	@IsNotEmpty()
	@IsString()
	@Length(8, 127)
	@Matches(EMAIL_FORMAT, { message: 'Invalid email' })
	public email: string;

	@IsNotEmpty()
	@IsString()
	@Length(8, 40)
	@Matches(PASSWORD_FORMAT, { message: 'Password too weak' })
	public password: string;

	@IsNotEmpty()
	@IsString()
	@Length(2, 30)
	@Matches(USERNAME_FORMAT, { message: 'Invalid username format' })
	public username: string;
}

export class DTOAuthEmail {
	@IsNotEmpty()
	@IsString()
	@Length(8, 127)
	@Matches(EMAIL_FORMAT, { message: 'Invalid email' })
	public email: string;
}

export class DTOActivationToken {
	@IsNotEmpty()
	@IsString()
	public token: string;
}

export class DTOResetPassword {
	@IsNotEmpty()
	@IsString()
	public token: string;

	@IsNotEmpty()
	@IsString()
	@Length(8, 40)
	@Matches(PASSWORD_FORMAT, { message: 'Password too weak' })
	public password: string;
}
