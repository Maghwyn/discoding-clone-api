import { CookieSameSite, EnvConfiguration } from '@/config/interfaces/config.interface';

// Ensure type checking
export const config: EnvConfiguration = {
	app: {
		port: process.env.API_PORT,
		env: process.env.NODE_ENV,
		whitelist: JSON.parse(process.env.API_WHITELIST) || [process.env.API_WHITELIST],
		redirect: process.env.FRONT_URL_REDIRECT,
	},
	mongo: {
		uri: process.env.MONGO_URI,
		dbname: process.env.MONGO_DBNAME,
	},
	jwt: {
		secret: process.env.JWT_SECRET,
		cookie: {
			secure: JSON.parse(process.env.COOKIE_SECURE),
			samesite: process.env.COOKIE_SAMESITE as CookieSameSite,
		},
	},
	mailjet: {
		user: process.env.MAILJET_USER,
		pass: process.env.MAILJET_PASS,
	},
};
