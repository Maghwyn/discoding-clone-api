import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';
import { ChannelsService } from '@/routes/channels/channels.service';
import { ChannelsController } from '@/routes/channels/channels.controller';
import { ChannelsRepository } from '@/routes/channels/channels.repository';
import { ServersModule } from '@/routes/servers/servers.module';

@Module({
	imports: [DatabaseModule.forRoot(), ServersModule],
	providers: [ChannelsService, ChannelsRepository],
	controllers: [ChannelsController],
})
export class ChannelsModule {}
