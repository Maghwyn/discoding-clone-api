import { createParamDecorator, ExecutionContext, Logger as NestLogger } from '@nestjs/common';
import { ObjectId } from 'mongodb';

// TODO: Need unit testing
export const Local = createParamDecorator((_: unknown, context: ExecutionContext) => {
	try {
		const args = context.getArgs();
		const user = <{ id: ObjectId }>args[0].user;
		return user.id;
	} catch (e) {
		NestLogger.error(`Could not retrieve the user id, ${e}`);
		return null;
	}
});
