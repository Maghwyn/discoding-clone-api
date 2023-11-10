import { forwardRef, Module } from "@nestjs/common";

import { DatabaseModule } from '@/database/database.module';
import { ChannelsService } from '@/routes/channels/channels.service';
import { ChannelsController } from '@/routes/channels/channels.controller';
import { ChannelsRepository } from '@/routes/channels/channels.repository';
import { ServersModule } from '@/routes/servers/servers.module';
import { ServersRepository } from "@/routes/servers/servers.repository";

@Module({
	imports: [DatabaseModule.forRoot(), forwardRef(() => ServersModule)],
	providers: [ChannelsService, ChannelsRepository],
	controllers: [ChannelsController],
	exports: [ChannelsService, ChannelsRepository]
})
export class ChannelsModule {}
