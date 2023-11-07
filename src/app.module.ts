import { EventEmitterModule } from '@nestjs/event-emitter';
import { Module } from '@nestjs/common';

import { AppService } from '@/app.service';
import { AppController } from '@/app.controller';
import { DatabaseModule } from '@/database/database.module';
import { MailjetModule } from '@/mailjet/mailjet.module';
import { AuthModule } from '@/routes/auth/auth.module';
import { UsersModule } from '@/routes/users/users.module';
import { ChannelsModule } from '@/routes/channels/channels.module';
import { ConversationsModule } from '@/routes/conversations/conversations.module';
import { FriendsModule } from '@/routes/friends/friends.module';
import { MessagesModule } from '@/routes/messages/messages.module';
import { ServersModule } from '@/routes/servers/servers.module';

@Module({
	imports: [
		EventEmitterModule.forRoot(),
		DatabaseModule.forRoot(),
		MailjetModule,
		AuthModule,
		UsersModule,
		ChannelsModule,
		ConversationsModule,
		FriendsModule,
		MessagesModule,
		ServersModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
