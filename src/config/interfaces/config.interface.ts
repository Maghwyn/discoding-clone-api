export type CookieSameSite = 'lax' | 'strict' | 'none';

export interface EnvConfiguration {
	app: Configuration.Application;
	mongo: Configuration.MongoDB;
	jwt: Configuration.JWT;
	mailjet: Configuration.Mailjet;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Configuration {
	export interface Application {
		port: string;
		env: string;
		whitelist: Array<string>;
		redirect: string;
	}

	export interface MongoDB {
		uri: string;
		dbname: string;
	}

	export interface JWT {
		secret: string;
		cookie: JWTCookie;
	}

	export interface JWTCookie {
		secure: boolean;
		samesite: CookieSameSite;
	}

	export interface Mailjet {
		user: string;
		pass: string;
	}
}
