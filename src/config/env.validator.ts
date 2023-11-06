import * as dotenv from 'dotenv';
dotenv.config();

// \n compatible for macOS and Window
import { EOL } from 'os';

const envsToCheck = [
	'API_PORT',
	'API_WHITELIST',
	'FRONT_URL_REDIRECT',
	'MONGO_URI',
	'MONGO_DBNAME',
	'JWT_SECRET',
	'COOKIE_SECURE',
	'COOKIE_SAMESITE',
	'MAILJET_USER',
	'MAILJET_PASS',
];

const missing = [];
for (const checked of envsToCheck) {
	if (!process.env[checked]) missing.push(`undefined process.env.${checked}`);
}

if (missing.length > 0) {
	throw new Error(`${EOL}${missing.join(EOL)}${EOL}Trace:`);
}
