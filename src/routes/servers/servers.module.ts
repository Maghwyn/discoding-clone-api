import { forwardRef, Module } from "@nestjs/common";

import { DatabaseModule } from '@/database/database.module';
import { ServersService } from '@/routes/servers/servers.service';
import { ServersController } from '@/routes/servers/servers.controller';
import { ServersRepository } from '@/routes/servers/servers.repository';
import { ChannelsModule} from "@/routes/channels/channels.module";

@Module({
	imports: [DatabaseModule.forRoot(), forwardRef(() => ChannelsModule)],
	providers: [ServersService, ServersRepository],
	controllers: [ServersController],
	exports: [ServersService]
})
export class ServersModule {}
