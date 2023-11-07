import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';
import { ServersService } from '@/routes/servers/servers.service';
import { ServersController } from '@/routes/servers/servers.controller';
import { ServersRepository } from '@/routes/servers/servers.repository';

@Module({
	imports: [DatabaseModule.forRoot()],
	providers: [ServersService, ServersRepository],
	controllers: [ServersController],
	exports: [ServersService]
})
export class ServersModule {}
