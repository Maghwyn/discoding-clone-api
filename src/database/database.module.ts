import { config } from '@/config/config';
import { DynamicModule, Module } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@Module({})
export class DatabaseModule {
	private static async _connectDatabase() {
		const client = await MongoClient.connect(config.mongo.uri, {
			//! Production settings
			// useUnifiedTopology: true,
			// useNewUrlParser: true,
			// tls: true,
		});
		return client.db(config.mongo.dbname);
	}

	static forRoot(): DynamicModule {
		return {
			module: DatabaseModule,
			providers: [
				{
					provide: 'DATABASE_CONNECTION',
					useFactory: async () => await DatabaseModule._connectDatabase(),
				},
			],
			exports: ['DATABASE_CONNECTION'],
		};
	}
}
