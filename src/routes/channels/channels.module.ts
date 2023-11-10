import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';
import { ChannelsService } from '@/routes/channels/channels.service';
import { ChannelsController } from '@/routes/channels/channels.controller';
import { ChannelsRepository } from '@/routes/channels/channels.repository';
import { ServersModule } from '@/routes/servers/servers.module';
import { UsersService } from '@/routes/users/users.service';
import { UsersRepository } from '@/routes/users/users.repository';
import { ServersRepository } from '@/routes/servers/servers.repository';
import { RelationshipsService } from '@/routes/relationship/relationship.service';
import { RelationshipsModule } from '@/routes/relationship/relationship.module';
import { RelationshipsRepository } from "@/routes/relationship/relationship.repository";
import { ConversationsRepository } from "@/routes/conversations/conversations.repository";
import { ConversationsService } from "@/routes/conversations/conversations.service";

@Module({
	imports: [DatabaseModule.forRoot(), ServersModule],
	providers: [
		ChannelsService,
		ChannelsRepository,
		UsersService,
		UsersRepository,
		ServersModule,
		ServersRepository,
		RelationshipsRepository,
		RelationshipsService,
		ConversationsRepository,
		ConversationsService,
	],
	controllers: [ChannelsController],
})
export class ChannelsModule {}