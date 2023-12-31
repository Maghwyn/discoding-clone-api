import { Request } from 'express';
import { ForbiddenException } from '@nestjs/common';
import { CorsOptionsCallback } from '@nestjs/common/interfaces/external/cors-options.interface';

import { config } from '@/config/config';

export const corsOptionsDelegate = (req: Request, callback: CorsOptionsCallback) => {
	const whitelist = config.app.whitelist;
	const origin = req.header('origin');

	if (origin && whitelist.indexOf(origin) !== -1) {
		return callback(null, { origin: true, credentials: true });
	} else if (origin === undefined) {
		return callback(null, { origin: true, credentials: true });
	}

	throw new ForbiddenException();
};
