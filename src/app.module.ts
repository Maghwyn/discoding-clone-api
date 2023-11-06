import { EventEmitterModule } from '@nestjs/event-emitter';
import { Module } from '@nestjs/common';

import { AppService } from '@/app.service';
import { AppController } from '@/app.controller';
import { DatabaseModule } from '@/database/database.module';
import { MailjetModule } from '@/mailjet/mailjet.module';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';

@Module({
	imports: [
		EventEmitterModule.forRoot(),
		DatabaseModule.forRoot(),
		MailjetModule,
		AuthModule,
		UsersModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
