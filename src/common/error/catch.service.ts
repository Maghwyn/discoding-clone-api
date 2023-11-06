import {
	HttpException,
	HttpStatus,
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	Logger as NestLogger,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponse {
	message: string;
	error: string;
}

const ERRORS = {
	BAD_REQUEST: { status: HttpStatus.BAD_REQUEST, message: 'Bad request' },
	UNAUTHORIZED: { status: HttpStatus.UNAUTHORIZED, message: 'Unauthorized' },
	FORBIDDEN: { status: HttpStatus.FORBIDDEN, message: 'Forbidden' },
	NOT_FOUND: { status: HttpStatus.NOT_FOUND, message: 'Not Found' },
	INTERNAL_SERVER_ERROR: {
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		message: 'Internal server error',
	},
};

export class ServiceError extends HttpException {
	constructor(STATUS: keyof typeof ERRORS, error: string) {
		const { status, message } = ERRORS[STATUS];
		super({ message: message, error: error }, status);
	}
}

@Catch(ServiceError)
export class ServiceErrorCatcher implements ExceptionFilter {
	catch(exception: ServiceError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = exception.getStatus();
		const { message, error } = exception.getResponse() as ErrorResponse;
		NestLogger.debug(error, message.toUpperCase());

		response.status(status).json({
			status: status,
			message: message,
			error: error,
			time: new Date().toISOString(),
		});
	}
}
