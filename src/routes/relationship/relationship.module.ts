import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';
import { RelationshipsService } from '@/routes/relationship/relationship.service';
import { RelationshipsController } from '@/routes/relationship/relationship.controller';
import { RelationshipsRepository } from '@/routes/relationship/relationship.repository';

@Module({
	imports: [DatabaseModule.forRoot()],
	providers: [RelationshipsService, RelationshipsRepository],
	controllers: [RelationshipsController],
})
export class RelationshipsModule {}
