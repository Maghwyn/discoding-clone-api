import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';
import { RelationshipsService } from '@/routes/relationship/relationship.service';
import { RelationshipsController } from '@/routes/relationship/relationship.controller';
import { RelationshipsRepository } from '@/routes/relationship/relationship.repository';
import { UsersService } from "@/routes/users/users.service";
import { UsersRepository } from "@/routes/users/users.repository";

@Module({
	imports: [DatabaseModule.forRoot()],
	providers: [RelationshipsService, RelationshipsRepository, UsersService, UsersRepository],
	controllers: [RelationshipsController],
	exports: [RelationshipsService]
})
export class RelationshipsModule {}
