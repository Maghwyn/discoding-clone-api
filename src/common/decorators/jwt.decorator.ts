import { createParamDecorator, ExecutionContext, Logger as NestLogger } from '@nestjs/common';

import { JwtPayload } from '@/routes/auth/interfaces/jwt.interface';

// TODO: Need unit testing
export const Jwt = createParamDecorator((_: unknown, context: ExecutionContext) => {
	try {
		const args = context.getArgs();
		const user = <JwtPayload>args[0].user;
		return user.id;
	} catch (e) {
		NestLogger.error(`Could not retrieve the user id from the jwt, ${e}`);
		return null;
	}
});
